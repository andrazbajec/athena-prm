const { mkdir, writeFile } = require('fs/promises');
const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const { log } = require('./logger');
const seniors = require('./config/seniors.json');
const { ConfigHelper } = require('./src/helper/ConfigHelper');

// region selectors
const SELECTOR_LOGIN_DROPDOWN = '#jsToggleNavbarMenu';
const SELECTOR_LOGIN_BUTTON = 'a[data-label-english="Log in"].imkt-navbar__collapsed-link-list-link';
const SELECTOR_EMAIL_INPUT = 'input[data-testid="username"]';
const SELECTOR_LOGIN_SUBMIT = 'button[id="login-submit"]';
const SELECTOR_PASSWORD_INPUT = 'input[data-testid="password"]';
const SELECTOR_LOGIN = 'button[id="login-submit"]';
const SELECTOR_SHOW_MORE = 'button[data-testid="expand-pr-list-button"]';
const SELECTOR_VIEW_ALL = 'a[data-testid="view-all-prs-link"]';
const SELECTOR_PR_ROW = 'tr[data-qa="pull-request-row"]';
const SELECTOR_PROFILE_CARD_TRIGGER = 'span[data-testid="profileCardTrigger"] > span';
const SELECTOR_PR_LINK = 'a[data-qa="pull-request-row-link"]';
const SELECTOR_BRANCH = 'td:first-child div[role="button"] span[aria-hidden="true"]';
const SELECTOR_AVATAR_GROUP = 'ul[aria-label="avatar group"] div[role="img"] > span[hidden][id]';
const SELECTOR_NEXT_PAGE = 'div[data-testid="workspace-pagination"] a[aria-label="next"]';
const SELECTOR_MFA_PROMOTE_DISMISS = 'button[id="mfa-promote-dismiss"]';
const SELECTOR_SELECT_PR_USER_FILTER = 'div[data-testid="select-pull-request-user-filter"]';
const SELECTOR_SELECT_PR_USER_FILTER_ALL = 'div[id="react-select-4-option-2"]';
// endregion

const delay = (delay = 1000) => new Promise((resolve) => setTimeout(resolve, delay));

const waitForVisible = async (page, selector, timeout = 30000) => {
  await page.waitForSelector(selector, { visible: false, timeout });
};

const navigateToPullRequestList = async (browser) => {
  await log('Opening new page in puppeteer');
  const page = (await browser.pages())[0];
  await log('Navigating to Bitbucket');
  await page.goto('https://bitbucket.org/');

  await waitForVisible(page, SELECTOR_LOGIN_DROPDOWN);
  await page.click(SELECTOR_LOGIN_DROPDOWN);

  await waitForVisible(page, SELECTOR_LOGIN_BUTTON);
  await delay();
  await page.click(SELECTOR_LOGIN_BUTTON);
  await log('Navigated to login');

  const { email, password } = await ConfigHelper.getConfig();

  await waitForVisible(page, SELECTOR_EMAIL_INPUT);
  await page.focus(SELECTOR_EMAIL_INPUT);
  await page.keyboard.type(email);
  await waitForVisible(page, SELECTOR_LOGIN_SUBMIT);
  await page.click(SELECTOR_LOGIN_SUBMIT);
  await delay(2000);
  await waitForVisible(page, SELECTOR_PASSWORD_INPUT);
  await page.focus(SELECTOR_PASSWORD_INPUT);
  await page.keyboard.type(password);
  await waitForVisible(page, SELECTOR_LOGIN);
  await page.click(SELECTOR_LOGIN);

  await log('Logged in');

  // try {
  //   await waitForVisible(page, SELECTOR_SHOW_MORE, 5000);
  // } catch (_) {
  //   await log("Show more selector not found");
  //   await log("Dismissing MFA promotion");
  //   await waitForVisible(page, SELECTOR_MFA_PROMOTE_DISMISS);
  //   await log("MFA promotion dismiss button found");
  //   await page.click(SELECTOR_MFA_PROMOTE_DISMISS);
  //   await log("MFA promotion dismiss button clicked");
  //   await waitForVisible(page, SELECTOR_SHOW_MORE);
  // }

  try {
    await waitForVisible(page, 'span[data-vc="icon-undefined"][aria-label="Dismiss"]', 5000);
    await log('Found popup to dismiss');
    await page.click('span[data-vc="icon-undefined"][aria-label="Dismiss"]');
    await log('Dismissed popup');
  } catch (_) {
    await log('No dismissible popup found');
  }

  // Could be implemented fully
  // try {
  //   await waitForVisible(page, 'div[role="alert"] div:has(> div > h2):has(> button) span[aria-label="Expand"]', 5000);
  //   await log("Found pipeline change reminder");
  //   await page.click('div[role="alert"] div:has(> div > h2):has(> button) span[aria-label="Expand"]');
  //   await log("Expanded popup");
  // } catch (_) {}
  //

  await page.waitForNetworkIdle();

  const $meta = await page.$('meta#bb-bootstrap');
  const displayName = await $meta?.evaluate((element) => JSON.parse(element.dataset.currentUser).displayName);

  if (displayName) {
    await ConfigHelper.setConfig('display-name', displayName);
  }

  await page.waitForNetworkIdle({ idleTime: 3000 });

  await log('Waiting to find dropdown trigger');
  await waitForVisible(page, 'button[data-testid="overflow-menu-trigger"]');
  await log('Dropdown triggered. Waiting to find pull requests button');
  await page.click('button[data-testid="overflow-menu-trigger"]');
  await waitForVisible(page, 'button[href*="pull-request"]');
  await log('Pull request button found, clicking');
  await page.click('button[href*="pull-request"]');
  await log('Pull request button was clicked');

  // await page.click(SELECTOR_SHOW_MORE);
  // await waitForVisible(page, SELECTOR_VIEW_ALL);
  // await page.click(SELECTOR_VIEW_ALL);

  await log('Navigated to pull request list');

  await waitForVisible(page, SELECTOR_SELECT_PR_USER_FILTER);
  await page.click(SELECTOR_SELECT_PR_USER_FILTER);

  await waitForVisible(page, SELECTOR_SELECT_PR_USER_FILTER_ALL);
  await page.click(SELECTOR_SELECT_PR_USER_FILTER_ALL);

  return { browser, page };
};

const getPullRequests = async (page, pullRequests = []) => {
  await log('Fetching pull requests');
  await waitForVisible(page, SELECTOR_PR_ROW);

  for (const $row of await page.$$(SELECTOR_PR_ROW)) {
    const $profileCardTrigger = await $row.$(SELECTOR_PROFILE_CARD_TRIGGER);
    const $prLink = await $row.$(SELECTOR_PR_LINK);
    const $branch = await $row.$(SELECTOR_BRANCH);
    const $created = await $row.$('td:nth-child(2) > span');
    const created = await $created?.evaluate((element) => element.textContent?.trim());

    const author = await $profileCardTrigger.evaluate((element) => element.textContent);
    const branch = await $branch.evaluate((element) => element.textContent);
    const link = await $prLink.evaluate((element) => element.getAttribute('href'));
    const reviewers = [];
    const repository = link.replace(/\/[^/]*\//, '').match(/[^/]*/)[0] ?? null;
    let approves = 0;
    let requestingChanges = 0;
    let seniorApproves = 0;

    for (const $avatar of await $row.$$(SELECTOR_AVATAR_GROUP)) {
      const textContent = await $avatar.evaluate((element) => element.textContent);
      const approved = textContent.includes('(approved)');
      const name = textContent.split(/ approved| requested/)[0];
      const isSenior = seniors.includes(name);
      const requestChanges = textContent.includes('requested changes');

      if (approved) {
        approves++;

        if (isSenior) {
          seniorApproves++;
        }
      }

      if (requestChanges) {
        requestingChanges++;
      }

      reviewers.push({
        approved,
        name,
        isSenior,
        requestChanges,
      });
    }

    pullRequests.push({
      approves,
      author,
      branch,
      created,
      link: `https://bitbucket.org${link}`,
      readyToMerge: approves >= 2 && seniorApproves >= 1 && !requestingChanges,
      repository,
      reviewers,
      seniorApproves,
    });
  }

  // let hasNextPage = false;
  //
  // try {
  //   await page.click(SELECTOR_NEXT_PAGE, { timeout: 10000 });
  //   hasNextPage = true;
  //   await page.waitForSelector(SELECTOR_NEXT_PAGE, {
  //     timeout: 10000,
  //     visible: false,
  //   });
  // } catch (_) {
  //   // Fall through
  // }
  //
  // if (hasNextPage) {
  //   await getPullRequests(page, pullRequests);
  // }

  return pullRequests;
};

const getNumberOfPages = async (page) => {
  const selector = 'div[data-testid="workspace-pagination"] li:last-child span';
  await waitForVisible(page, selector);
  const $button = await page.$(selector);
  const lastPage = await $button.evaluate((element) => element.textContent);
  return Number(lastPage);
};

const parseUrl = async (browser, url) => {
  const page = await browser.newPage();
  await page.goto(url);
  return await getPullRequests(page);
};

module.exports = {
  refreshWatchingPullRequests: async () => {
    await log('Opening puppeteer');
    const browser = await puppeteer.launch({ headless: process.env.HEADLESS === 'true' });

    try {
      const { page } = await navigateToPullRequestList(browser);
      const numberOfPages = await getNumberOfPages(page);
      const baseUrl = page.url();
      const promises = [];

      for (let pageNumber = 1; pageNumber <= numberOfPages; pageNumber++) {
        const url = `${baseUrl}&page=${pageNumber}`;

        promises.push(parseUrl(browser, url));
      }

      const values = await Promise.all(promises);
      const pullRequests = values.flat();

      // const pullRequests = await getPullRequests(page);
      await log('Pull requests fetched');
      const folder = 'data/pr-watching';

      try {
        await mkdir(folder, { recursive: true });
      } catch (_) {
        // Fall through
      }

      const filePath = `${folder}/${dayjs().format('YYYY_MM_DD-HH_mm_ss')}.json`;
      await writeFile(filePath, JSON.stringify(pullRequests, null, 4), {
        encoding: 'utf8',
      });
      await log(`Pull request data saved to file (${filePath})`);
      await browser.close();
      await log('Puppeteer browser closed');
    } catch (error) {
      await log(`${error.message} (${error.stack})`);
      await browser.close();
    }
  },
};
