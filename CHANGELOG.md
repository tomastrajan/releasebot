# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/tomastrajan/releasebot/compare/v0.9.0...v1.0.0-beta.0) (2018-04-20)


### Bug Fixes

* **changelog:** delay page to prevent missing webfonts ([03f389f](https://github.com/tomastrajan/releasebot/commit/03f389f))
* **changelog:** force bold headers, style table borders ([427ea9a](https://github.com/tomastrajan/releasebot/commit/427ea9a))


### Features

* **changelog:** add 3 new themes - forrest, reggae and cupcake ([947d0b9](https://github.com/tomastrajan/releasebot/commit/947d0b9))
* **changelog:** use release butler fonts for generated changelogs ([6780f58](https://github.com/tomastrajan/releasebot/commit/6780f58))
* **data:** add ngx-model and angular-ngrx-material-starter ([77a6113](https://github.com/tomastrajan/releasebot/commit/77a6113))
* **data:** add release butler project ([970dc52](https://github.com/tomastrajan/releasebot/commit/970dc52))
* **twitter:** add canary release type ([dd783c7](https://github.com/tomastrajan/releasebot/commit/dd783c7))


### Performance Improvements

* **changelog:** use long term browser instance instead of recreating on every request ([26dcdcb](https://github.com/tomastrajan/releasebot/commit/26dcdcb))



<a name="0.9.0"></a>
# 0.9.0 (2018-04-19)


### Bug Fixes

* **app:** default cron schedule is once every hour ([2c7a336](https://github.com/tomastrajan/releasebot/commit/2c7a336))
* **app:** pass skip flag to init command ([513594a](https://github.com/tomastrajan/releasebot/commit/513594a))
* **changelog:** changelog.md file version matching, link styles ([5eb781b](https://github.com/tomastrajan/releasebot/commit/5eb781b))
* **changelog:** close puppeteer browser after execution, fix memory leak ([9eab73b](https://github.com/tomastrajan/releasebot/commit/9eab73b))
* **changelog:** correctly release resources, add puppeteer flag ([7a1c0a9](https://github.com/tomastrajan/releasebot/commit/7a1c0a9))
* **changelog:** dracula theme ([799514a](https://github.com/tomastrajan/releasebot/commit/799514a))
* **changelog:** increase puppeteer timeout ([d47b65e](https://github.com/tomastrajan/releasebot/commit/d47b65e))
* **changelog:** logging format ([49b03bb](https://github.com/tomastrajan/releasebot/commit/49b03bb))
* **changelog:** remove border from main version line ([84f1820](https://github.com/tomastrajan/releasebot/commit/84f1820))
* **changelog:** remove starting 'v' from version for changelog.md manipulation ([84b4656](https://github.com/tomastrajan/releasebot/commit/84b4656))
* **changelog:** testing for version when removing redundant nodes from changelog.md ([69da1eb](https://github.com/tomastrajan/releasebot/commit/69da1eb))
* **changelog:** transparent background for handler only, twitter uses white background ([0ed9771](https://github.com/tomastrajan/releasebot/commit/0ed9771))
* **deployment:** docker install missing puppeteer chrome dependencies ([8f6e530](https://github.com/tomastrajan/releasebot/commit/8f6e530))
* **deployment:** fix deploy script (correct alias) ([9505c30](https://github.com/tomastrajan/releasebot/commit/9505c30))
* **release:** enhance logging, versions released since last deployment ([d6ac493](https://github.com/tomastrajan/releasebot/commit/d6ac493))
* **release:** track release count since deploy ([49db0a6](https://github.com/tomastrajan/releasebot/commit/49db0a6))
* **twitter:** changelog.md anchor link generation ([f6d197a](https://github.com/tomastrajan/releasebot/commit/f6d197a))
* **twitter:** pass version parameter for anchor link ([b8a15da](https://github.com/tomastrajan/releasebot/commit/b8a15da))
* **twitter:** tweet formatting ([e3d4eff](https://github.com/tomastrajan/releasebot/commit/e3d4eff))
* **www:** add missing title, add google analytics download changelog error event tracking ([e1d798b](https://github.com/tomastrajan/releasebot/commit/e1d798b))
* **www:** beta badge overflow ([29da3ca](https://github.com/tomastrajan/releasebot/commit/29da3ca))
* **www:** form responsive layout ([e6fdaad](https://github.com/tomastrajan/releasebot/commit/e6fdaad))
* **www:** google analytics event tracking ([e593b88](https://github.com/tomastrajan/releasebot/commit/e593b88))
* **www:** images urls ([094f949](https://github.com/tomastrajan/releasebot/commit/094f949))
* **www:** initially hide elements with css instead of js ([758f94c](https://github.com/tomastrajan/releasebot/commit/758f94c))
* **www:** overflow styles ([c0799d8](https://github.com/tomastrajan/releasebot/commit/c0799d8))
* **www:** overflow styles ([26da963](https://github.com/tomastrajan/releasebot/commit/26da963))
* **www:** responsive styles ([f2d861f](https://github.com/tomastrajan/releasebot/commit/f2d861f))
* **www:** responsive styles ([790a93e](https://github.com/tomastrajan/releasebot/commit/790a93e))
* **www:** wording ([99ffb6a](https://github.com/tomastrajan/releasebot/commit/99ffb6a))


### Features

* **app:** heavy refactor, use log4js, use yargs commands ([c3b0562](https://github.com/tomastrajan/releasebot/commit/c3b0562))
* **app:** initial commit ([8aa530a](https://github.com/tomastrajan/releasebot/commit/8aa530a))
* **app:** mvp ([3fdeb5e](https://github.com/tomastrajan/releasebot/commit/3fdeb5e))
* **app:** refactor changelog service, add standalone changelog command, enhance changelog.md screenshots with custom css offsets ([ec2e41c](https://github.com/tomastrajan/releasebot/commit/ec2e41c))
* **app:** remove redundant timestamp from logs ([6e8bc77](https://github.com/tomastrajan/releasebot/commit/6e8bc77))
* **app:** tweet changelog image ([4858b77](https://github.com/tomastrajan/releasebot/commit/4858b77))
* **changelog:** add beach theme, adjust theme property names ([9e81298](https://github.com/tomastrajan/releasebot/commit/9e81298))
* **changelog:** add signature and watermark ([5a3b3cd](https://github.com/tomastrajan/releasebot/commit/5a3b3cd))
* **changelog:** add support for 'next' version ([58b9aa6](https://github.com/tomastrajan/releasebot/commit/58b9aa6))
* **changelog:** add watermark logo ([4e07d1e](https://github.com/tomastrajan/releasebot/commit/4e07d1e))
* **changelog:** adjust styles in github releases page ([1c0fb66](https://github.com/tomastrajan/releasebot/commit/1c0fb66))
* **changelog:** enhance logging ([8c8132f](https://github.com/tomastrajan/releasebot/commit/8c8132f))
* **changelog:** enhance screenshot styles ([9b46827](https://github.com/tomastrajan/releasebot/commit/9b46827))
* **changelog:** enhance screenshot styles ([e80a0b3](https://github.com/tomastrajan/releasebot/commit/e80a0b3))
* **changelog:** enhance version not found handling and logging ([c115da8](https://github.com/tomastrajan/releasebot/commit/c115da8))
* **changelog:** extract and adjust styles ([6e74fea](https://github.com/tomastrajan/releasebot/commit/6e74fea))
* **changelog:** fail if no version found in changelog.md ([6b15c10](https://github.com/tomastrajan/releasebot/commit/6b15c10))
* **changelog:** inject styles in github releases page ([9da9501](https://github.com/tomastrajan/releasebot/commit/9da9501))
* **changelog:** support for retrieving 'latest' version of changelog ([9e2c7f6](https://github.com/tomastrajan/releasebot/commit/9e2c7f6))
* **changelog:** support themes and optional project name ([ce3818b](https://github.com/tomastrajan/releasebot/commit/ce3818b))
* **changelog:** track changelog downloads since deployment ([19c8a91](https://github.com/tomastrajan/releasebot/commit/19c8a91))
* **changelog:** use png stream ([b5ff70c](https://github.com/tomastrajan/releasebot/commit/b5ff70c))
* **changelog:** use puppeteer instead of webshot ([03a9c53](https://github.com/tomastrajan/releasebot/commit/03a9c53))
* **data:** add angular material ([b917d4b](https://github.com/tomastrajan/releasebot/commit/b917d4b))
* **data:** add boostrap ([7c88954](https://github.com/tomastrajan/releasebot/commit/7c88954))
* **data:** add init db script ([eac84f2](https://github.com/tomastrajan/releasebot/commit/eac84f2))
* **data:** add material ui, mocha and puppeteer ([78bba87](https://github.com/tomastrajan/releasebot/commit/78bba87))
* **data:** add nest project ([1e3f5f1](https://github.com/tomastrajan/releasebot/commit/1e3f5f1))
* **data:** add next.js and svetle ([cdcea38](https://github.com/tomastrajan/releasebot/commit/cdcea38))
* **data:** add npm to init db script ([6c0aa16](https://github.com/tomastrajan/releasebot/commit/6c0aa16))
* **deployment:** add deploy script ([5e04578](https://github.com/tomastrajan/releasebot/commit/5e04578))
* **deployment:** add dumb-init to docker container, add remove failed builds script ([40f9081](https://github.com/tomastrajan/releasebot/commit/40f9081))
* **deployment:** add remove all deployments script, remove redundant libs, adjust deploy script ([2e0ceb3](https://github.com/tomastrajan/releasebot/commit/2e0ceb3))
* **deployment:** adjust deploy script ([7c64874](https://github.com/tomastrajan/releasebot/commit/7c64874))
* **deployment:** adjust deploy script ([52820ee](https://github.com/tomastrajan/releasebot/commit/52820ee))
* **deployment:** adjust secrets, add dummy express server ([875aa21](https://github.com/tomastrajan/releasebot/commit/875aa21))
* **deployment:** use docker to support puppeteer in now environment, enhance deploy script ([fd3968f](https://github.com/tomastrajan/releasebot/commit/fd3968f))
* **github:** order versions by semver ([fcf1f68](https://github.com/tomastrajan/releasebot/commit/fcf1f68))
* **handlers:** add changelog handler for retrieving changelogs ([69d03ee](https://github.com/tomastrajan/releasebot/commit/69d03ee))
* **project:** adjust init project logging ([633758f](https://github.com/tomastrajan/releasebot/commit/633758f))
* **release:** enhance logging info ([dc0ed24](https://github.com/tomastrajan/releasebot/commit/dc0ed24))
* **release:** enhance logging info, track release count since deploy ([694b3ec](https://github.com/tomastrajan/releasebot/commit/694b3ec))
* **release:** enhance logging messages ([70e8eab](https://github.com/tomastrajan/releasebot/commit/70e8eab))
* **release:** enhance logging, versions released since last deployment ([982019a](https://github.com/tomastrajan/releasebot/commit/982019a))
* **release:** log number of releases per project and latest release version ([34dd1f8](https://github.com/tomastrajan/releasebot/commit/34dd1f8))
* **release:** only log new releases ([9d61706](https://github.com/tomastrajan/releasebot/commit/9d61706))
* **release:** recover from failed new version tweet, process all new version and update DB regardless of outcome ([f6e6cf4](https://github.com/tomastrajan/releasebot/commit/f6e6cf4))
* **twitter:** add releasebutler hashtag ([dd05903](https://github.com/tomastrajan/releasebot/commit/dd05903))
* **twitter:** split stable release type into fix, feature and major ([a79b8ef](https://github.com/tomastrajan/releasebot/commit/a79b8ef))
* **twitter:** use anchor url for changelog.md releases ([0432411](https://github.com/tomastrajan/releasebot/commit/0432411))
* **url:** add url service and remove redundant url data from application ([6c67d25](https://github.com/tomastrajan/releasebot/commit/6c67d25))
* **www:** add ember logo ([faf685d](https://github.com/tomastrajan/releasebot/commit/faf685d))
* **www:** add GA changelog download tracking ([bf07721](https://github.com/tomastrajan/releasebot/commit/bf07721))
* **www:** add graphql ([7779a45](https://github.com/tomastrajan/releasebot/commit/7779a45))
* **www:** add marketing site ([07e5c2d](https://github.com/tomastrajan/releasebot/commit/07e5c2d))
* **www:** add redux and mobx projects ([fb5f083](https://github.com/tomastrajan/releasebot/commit/fb5f083))
* **www:** add retrieve changelog functionality ([2ca1d0b](https://github.com/tomastrajan/releasebot/commit/2ca1d0b))
* **www:** optimize images ([0f03b34](https://github.com/tomastrajan/releasebot/commit/0f03b34))
* **www:** randomize get changelog form ([46a93f3](https://github.com/tomastrajan/releasebot/commit/46a93f3))
* **www:** reduce images resolution, add favicon ([3320327](https://github.com/tomastrajan/releasebot/commit/3320327))
* **www:** reduce size of images ([6d3c55e](https://github.com/tomastrajan/releasebot/commit/6d3c55e))
* **www:** remove font awesome dependency, add smooth twitter timeline transition ([cb7d261](https://github.com/tomastrajan/releasebot/commit/cb7d261))
* **www:** show downloaded changelog image and add download button ([cd36e40](https://github.com/tomastrajan/releasebot/commit/cd36e40))
* **www:** style browser nav bar ([2b071e0](https://github.com/tomastrajan/releasebot/commit/2b071e0))
