import fs from 'fs';
import { getLogger } from 'log4js';
import puppeteer from 'puppeteer';

import { getChangelogFileUrl, getChangelogReleaseUrl } from './url';
import { THEMES } from './changelog-themes';
import { getChangelogStyles } from './changelog-styles';
import {
  removeIrrelevantVersions,
  insertSignature,
  addProjectName
} from './changelog-transforms';

const logger = getLogger('Changelog Service');

export const getChangelogAsImage = async (
  project,
  version,
  theme,
  asFile,
  omitBackground
) => {
  let browser;
  let page;
  try {
    const { type, name, repo } = project;
    logger.info('Get changelog as image for:', type, repo, version);
    const isGithub = type === 'github';
    const url = isGithub
      ? getChangelogReleaseUrl(repo, version)
      : getChangelogFileUrl(repo, version);
    const selector = isGithub ? '.release-body' : '.markdown-body';
    browser = await getBrowser();
    page = await getPage(
      browser,
      url,
      getChangelogStyles(selector, THEMES[theme])
    );
    if (!isGithub) {
      logger.info('Get changelog as image remove other versions');
      await removeIrrelevantVersions(page, selector, version);
    }
    if (name) {
      await addProjectName(page, selector, type, name);
    }
    await insertSignature(page, selector);
    logger.info('Get changelog as image start:', selector);
    const screenShot = await getScreenShot(page, selector, omitBackground);
    logger.info('Get changelog as image success:', type, repo, version);
    return asFile ? saveToFileAndExit(screenShot, repo) : screenShot;
  } catch (err) {
    logger.error('Get changelog as image failed');
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
