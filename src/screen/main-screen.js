const { Spinner } = require('../component/Spinner');
const { refreshWatchingPullRequests } = require('../../puppeteer');
const { Button } = require('../component/Button');
const { RenderHelper } = require('../helper/RenderHelper');
const { ScreenEnum } = require('../enum/ScreenEnum');

const renderHeader = ($app) => {
  const $header = document.createElement('div');
  $header.id = 'header';
  $header.className = 'd-flex justify-content-between';

  const $refreshContainer = document.createElement('div');
  $refreshContainer.id = 'refresh-container';

  const $refreshButton = Button({
    classes: ['btn', 'btn-primary'],
    id: 'refresh-data',
    textContent: 'Refresh data',
  });

  $refreshButton.addEventListener('click', async () => {
    const $spinner = Spinner({ color: 'primary' });

    $refreshContainer.appendChild($spinner);
    $refreshButton.disabled = true;

    await refreshWatchingPullRequests();

    $spinner.remove();
    $refreshButton.disabled = false;
  });

  const $navigation = document.createElement('div');
  $navigation.id = 'navigation';

  const $watchedPullRequestsButton = Button({
    classes: ['btn', 'btn-dark'],
    id: 'watched-pull-requests',
    textContent: 'Watched pull requests',
  });

  $watchedPullRequestsButton.addEventListener('click', async () => {
    await RenderHelper.render(ScreenEnum.ROUTE_WATCHED_PR);
  });

  const $myPullRequestsButton = Button({
    classes: ['btn', 'btn-secondary'],
    id: 'my-pull-requests',
    textContent: 'My pull requests',
  });

  $myPullRequestsButton.addEventListener('click', async () => {
    await RenderHelper.render(ScreenEnum.ROUTE_MY_PR);
  });

  const $mergeStatusButton = Button({
    classes: ['btn', 'btn-secondary'],
    id: 'merge-status',
    textContent: 'Merge status',
  });

  $mergeStatusButton.addEventListener('click', async () => {
    await RenderHelper.render(ScreenEnum.ROUTE_MERGE_STATUS);
  });

  const $settingsButton = Button({
    classes: ['btn', 'btn-secondary'],
    id: 'settings',
  });

  $settingsButton.addEventListener('click', async () => {
    await RenderHelper.render(ScreenEnum.ROUTE_SETTINGS);
  });

  // $settingsButton.addEventListener('click')

  const $settingsIcon = document.createElement('i');
  $settingsIcon.className = 'fa-solid fa-gear';

  $settingsButton.appendChild($settingsIcon);
  $refreshContainer.appendChild($refreshButton);
  $navigation.appendChild($watchedPullRequestsButton);
  $navigation.appendChild($myPullRequestsButton);
  $navigation.appendChild($mergeStatusButton);
  $navigation.appendChild($settingsButton);
  $header.appendChild($refreshContainer);
  $header.appendChild($navigation);
  $app.appendChild($header);
};

const renderContentContainer = ($app) => {
  const $contentContainer = document.createElement('div');
  $contentContainer.id = 'content';

  $app.appendChild($contentContainer);
};

const render = async () => {
  const $app = document.getElementById('app');

  $app.innerHTML = '';

  renderHeader($app);
  renderContentContainer($app);

  await RenderHelper.render(ScreenEnum.ROUTE_WATCHED_PR);
};

module.exports = {
  render,
};
