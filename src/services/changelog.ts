import { writeFile } from 'fs';
import { getLogger } from 'log4js';
import * as puppeteer from 'puppeteer';

import { getChangelogFileUrl, getChangelogReleaseUrl } from './url';
import { THEMES } from './changelog-themes';
import { getChangelogStyles } from './changelog-styles';
import {
  removeIrrelevantVersions,
  addBranding,
  addProjectName
} from './changelog-transforms';

const logger = getLogger('Changelog Service');

let browser;

export const getChangelogAsImage = async (
  project,
  version,
  theme,
  asFile?,
  omitBackground?,
  omitBranding?
) => {
  let page;
  try {
    const { type, name, repo } = project;
    logger.debug('Get changelog as image for:', type, repo, version, theme, !omitBranding);
    const isGithub = type === 'github';
    const url = isGithub
      ? getChangelogReleaseUrl(repo, version)
      : getChangelogFileUrl(repo);
    const selector = isGithub ? '.release-body' : '.markdown-body';
    if (!browser || !browser.process()) {
      browser = await getBrowser();
      logger.debug('Browser created:', await browser.version());
    }
    page = await getPage(
      browser,
      url,
      getChangelogStyles(selector, THEMES[theme])
    );
    if (!isGithub) {
      logger.debug('Get changelog as image remove other versions');
      await removeIrrelevantVersions(page, selector, version);
    }
    if (name) {
      await addProjectName(page, selector, type, name);
    }
    if (!omitBranding) {
      await addBranding(page, selector);
    }
    logger.debug('Get changelog as image start:', selector);
    const screenShot = await getScreenShot(page, selector, omitBackground);
    logger.debug('Get changelog as image success:', type, repo, version);
    return asFile ? saveToFileAndExit(screenShot, repo) : screenShot;
  } catch (err) {
    logger.error('Get changelog as image failed');
    throw err;
  } finally {
    if (page) {
      page.removeListener('console', puppeteerLogger);
      console.log('close 1');
      await page.close();
      console.log('close 2');
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
  page.on('console', puppeteerLogger);
  page.setDefaultNavigationTimeout(60000);
  await page.setBypassCSP(true);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 });
  await page.addStyleTag({ content: styles });
  await page.waitFor(1000);
  return page;
};

const getBrowser = async () =>
  puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--user-data-dir'
    ]
  });

const saveToFileAndExit = (screenShot, repo) => {
  const filename = `changelog_${repo.replace('/', '_')}.png`;
  writeFile(filename, screenShot, err => {
    if (err) {
      logger.error(err.toString());
    } else {
      logger.info('Get changelog as image file saved:', filename);
    }
    process.exit(0);
  });
};

function puppeteerLogger(msg) {
  logger.debug(msg.text());
}
