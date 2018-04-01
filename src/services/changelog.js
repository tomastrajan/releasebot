import fs from 'fs';
import { getLogger } from 'log4js';
import puppeteer from 'puppeteer';

import { getChangelogStyles } from './changelog-styles';
import { getChangelogFileUrl, getChangelogReleaseUrl } from './url';

const logger = getLogger('Changelog Service');

export const getChangelogAsImage = async (project, version, asFile, omitBackground) => {
  let browser;
  let page;
  try {
    const { type, repo } = project;
    logger.info('Get changelog as image for:', type, repo, version);
    const isGithub = type === 'github';
    const url = isGithub
      ? getChangelogReleaseUrl(repo, version)
      : getChangelogFileUrl(repo, version);
    const selector = isGithub ? '.release-body' : '.markdown-body';
    browser = await getBrowser();
    page = await getPage(browser, url, getChangelogStyles(selector));
    if (!isGithub) {
      logger.info('Get changelog as image remove other versions');
      await removeIrrelevantVersions(page, selector, version);
    }
    logger.info('Get changelog as image start:', selector);
    const screenShot = await getScreenShot(page, selector, omitBackground);
    logger.info('Get changelog as image success:', type, repo, version);
    return asFile ? saveToFileAndExit(screenShot, repo) : screenShot;
  } catch (err) {
    logger.error('Get changelog from github release failed', err);
    throw err;
  } finally {
    if (page) {
      page.removeListener('console', puppeteerLogger);
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
};

const removeIrrelevantVersions = async (page, selector, version) =>
  page.evaluate(
    (selector, version) => {
      const finalVersion = version[0] === 'v' ? version.slice(1) : version;
      const isMatchingVersion = (node, version) => {
        const nodeVersion = node.innerText;
        const isPreReleaseVersion = /v?\d+\.\d+\.\d+-.*/.test(version);
        const isPreReleaseNodeVersion = /v?\d+\.\d+\.\d+-.*/.test(nodeVersion);
        if (isPreReleaseVersion) {
          return nodeVersion.includes(version);
        } else {
          return nodeVersion.includes(version) && !isPreReleaseNodeVersion;
        }
      };
      const isVersionNode = node =>
        ['h1', 'h2', 'h3', 'h4'].includes(node.nodeName.toLowerCase()) &&
        /v?\d+\.\d+\.\d+.*/.test(node.innerText);
      const nodes = document.querySelector(selector).childNodes;
      let isIrrelevantNode = true;
      Array.from(nodes)
        .filter(node => {
          if (!isIrrelevantNode && isVersionNode(node)) {
            isIrrelevantNode = true;
          }
          if (isVersionNode(node) && isMatchingVersion(node, finalVersion)) {
            isIrrelevantNode = false;
          }
          return isIrrelevantNode;
        })
        .forEach(node => node.remove());
      if (!nodes.length) {
        throw new Error(`Version ${version} not found`);
      }
    },
    selector,
    version
  );

const getScreenShot = async (page, selector, omitBackground) => {
  const { x, y, width, height } = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  }, selector);
  return await page.screenshot({
    omitBackground,
    type: 'png',
    clip: { x: x - 40, y: y - 40, width: width + 80, height: height + 110 }
  });
};

const getPage = async (browser, url, styles) => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 });
  await page.addStyleTag({ content: styles });
  page.setDefaultNavigationTimeout(60);
  page.on('console', puppeteerLogger);
  return page;
};

const getBrowser = async () =>
  puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

const saveToFileAndExit = (screenShot, repo) => {
  const filename = `changelog_${repo.replace('/', '_')}.png`;
  fs.writeFile(filename, screenShot, err => {
    if (err) {
      logger.error(err);
    } else {
      logger.info('Get changelog as image file saved:', filename);
    }
    process.exit(0);
  });
};

function puppeteerLogger(msg) {
  logger.debug(msg.text());
}
