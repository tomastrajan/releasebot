import fs from 'fs';
import { getLogger } from 'log4js';
import puppeteer from 'puppeteer';

import { getChangelogStyles } from './changelog-styles';
import { getChangelogFileUrl, getChangelogReleaseUrl } from './url';

const logger = getLogger('Changelog Service');

export const getChangelogAsImage = async (project, version, asFile) => {
  try {
    const { type, repo } = project;
    logger.info('Get changelog as image for:', type, repo, version);
    const isGithub = type === 'github';
    const url = isGithub
      ? getChangelogReleaseUrl(repo, version)
      : getChangelogFileUrl(repo, version);
    const selector = isGithub ? '.release-body' : '.markdown-body';
    const page = await getPage(url, getChangelogStyles(selector));
    if (!isGithub) {
      logger.info('Get changelog as image remove other versions');
      await removeIrrelevantVersions(page, selector, version);
    }
    logger.info('Get changelog as image start:', selector);
    const screenShot = await getScreenShot(page, selector);
    logger.info('Get changelog as image success:', type, repo, version);
    return asFile ? saveToFileAndExit(screenShot, repo) : screenShot;
  } catch (err) {
    logger.error('Get changelog from github release failed', err);
  }
};

const removeIrrelevantVersions = async (page, selector, version) =>
  page.evaluate(
    (selector, version) => {
      const isVersionNode = node =>
        ['h1', 'h2', 'h3'].includes(node.nodeName.toLowerCase()) &&
        /v?\d\.\d\.\d.*/.test(node.innerText);
      let isIrrelevantNode = true;
      Array.from(document.querySelector(selector).childNodes)
        .filter(node => {
          if (!isIrrelevantNode && isVersionNode(node)) {
            isIrrelevantNode = true;
          }
          if (isVersionNode(node) && node.innerText.includes(version)) {
            isIrrelevantNode = false;
          }
          return isIrrelevantNode;
        })
        .forEach(node => node.remove());
    },
    selector,
    version
  );

const getScreenShot = async (page, selector) => {
  const { x, y, width, height } = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  }, selector);
  return await page.screenshot({
    type: 'png',
    clip: { x: x - 40, y: y - 40, width: width + 80, height: height + 110 }
  });
};

const getPage = async (url, styles) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 });
  await page.addStyleTag({ content: styles });
  page.on('console', msg => logger.debug(msg.text()));
  return page;
};

const saveToFileAndExit = (screenShot, repo) => {
  const filename = `changelog_${repo.replace('/', '_')}.png`;
  fs.writeFile(filename, screenShot, err => {
    if (err) {
      logger.error(err);
    }
    logger.info('Get changelog as image file saved:', filename);
    process.exit(0);
  });
};
