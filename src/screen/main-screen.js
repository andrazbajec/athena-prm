const { Spinner } = require('../component/Spinner');
const { refreshWatchingPullRequests } = require('../../puppeteer');
const { render: renderWatchedPRScreen } = require('./watched-pr-screen');
const { render: renderMyPRScreen } = require('./my-pr-screen');
const { render: renderMergeStatusScreen } = require('./merge-status-screen');
const renderHeader = ($app) => {
  const $header = document.createElement('div');
  $header.id = 'header';
  $header.className = 'd-flex justify-content-between';

  const $refreshContainer = document.createElement('div');
  $refreshContainer.id = 'refresh-container';

  const $refreshButton = document.createElement('button');
  $refreshButton.className = 'btn btn-primary';
  $refreshButton.id = 'refresh-data';
  $refreshButton.type = 'button';
  $refreshButton.textContent = 'Refresh data';

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

  const $watchedPullRequestsButton = document.createElement('button');
  $watchedPullRequestsButton.className = 'btn btn-dark';
  $watchedPullRequestsButton.id = 'watched-pull-requests';
  $watchedPullRequestsButton.type = 'button';
  $watchedPullRequestsButton.textContent = 'Watched pull requests';

  $watchedPullRequestsButton.addEventListener('click', async () => {
    await renderWatchedPRScreen();
  });

  const $myPullRequestsButton = document.createElement('button');
  $myPullRequestsButton.className = 'btn btn-secondary';
  $myPullRequestsButton.id = 'my-pull-requests';
  $myPullRequestsButton.type = 'button';
  $myPullRequestsButton.textContent = 'My pull requests';

  $myPullRequestsButton.addEventListener('click', async () => {
    await renderMyPRScreen();
  });

  const $mergeStatusButton = document.createElement('button');
  $mergeStatusButton.className = 'btn btn-secondary';
  $mergeStatusButton.id = 'merge-status';
  $mergeStatusButton.type = 'button';
  $mergeStatusButton.textContent = 'Merge status';

  $mergeStatusButton.addEventListener('click', async () => {
    await renderMergeStatusScreen();
  });

  const $settingsButton = document.createElement('button');
  $settingsButton.className = 'btn btn-secondary';
  $settingsButton.type = 'button';

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

  await renderWatchedPRScreen();
};

module.exports = {
  render,
};
