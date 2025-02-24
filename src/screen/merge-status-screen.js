const { selectButton } = require('../helper/NavigationHelper');
const DataHelper = require('../helper/DataHelper');
const { Table } = require('../component/Table');
const TableConfigMergeStatus = require('../config/table-config-merge-status');
const { Input } = require('../component/Input');
const { INPUT_TYPE_CHECKBOX } = require('../enum/InputEnum');
const { Label } = require('../component/Label');
const dayjs = require('dayjs');
const { ConfigHelper } = require('../helper/ConfigHelper');
const { RenderHelper } = require('../helper/RenderHelper');
const { refreshWatchingPullRequests } = require('../../puppeteer');

const _renderTable = async ($tableContainer, config = {}) => {
  const data = await DataHelper.getGroupedData(config);

  const $table = Table({
    classes: ['merge-status-table'],
    data,
    tableConfig: TableConfigMergeStatus,
  });

  $tableContainer.innerHTML = '';
  $tableContainer.appendChild($table);
};

const getLastUpdateTime = async () => {
  const latestFilename = await DataHelper.getLatestFilename();
  const [rawDate] = latestFilename.split('.');
  const [date, time] = rawDate.split('-');
  const newDate = `${date.split('_').join('-')} ${time.split('_').join(':')}`;

  return dayjs(newDate, 'YYYY-MM-DD HH:mm:ss', true).format('DD.MM.YYYY HH:mm:ss');
};

const render = async () => {
  selectButton('merge-status');

  const $app = document.querySelector('#app');

  const $appHeader = document.createElement('div');
  $appHeader.className = 'app-header';

  const $tableContainer = document.createElement('div');

  const $filterBranchInput = Input({ placeholder: 'filter branch' });
  const $filterAuthorInput = Input({ placeholder: 'filter user' });

  const $hideApprovedCheckbox = Input({
    classes: ['form-check-input', 'mt-0'],
    id: 'hide-approved-checkbox',
    type: INPUT_TYPE_CHECKBOX,
  });

  const $hideApprovedLabel = Label({
    classes: ['form-check-label', 'c-pointer'],
    for: 'hide-approved-checkbox',
    text: 'hide approved',
  });

  const $hideMineCheckbox = Input({
    classes: ['form-check-input', 'mt-0'],
    id: 'hide-mine',
    type: INPUT_TYPE_CHECKBOX,
  });

  const $hideMineLabel = Label({
    classes: ['form-check-label', 'c-pointer'],
    for: 'hide-mine',
    text: 'hide mine',
  });

  const _renderTableCallback = () => _renderTable($tableContainer, {
    filterAuthor: $filterAuthorInput.value,
    filterBranch: $filterBranchInput.value,
    baseFilter: {
      showApproved: !$hideApprovedCheckbox.checked,
      excludeMine: $hideMineCheckbox.checked,
    },
  });

  $filterBranchInput.oninput = _renderTableCallback;

  $filterAuthorInput.oninput = _renderTableCallback;

  $hideApprovedCheckbox.onchange = _renderTableCallback;

  $hideMineCheckbox.onchange = _renderTableCallback;

  const $lastUpdate = document.createElement('p');
  const formattedDate = await getLastUpdateTime();

  $lastUpdate.textContent = `Last update: ${formattedDate}`;
  $lastUpdate.style.margin = '0';

  const $content = document.querySelector('#app > #content');
  $content.innerHTML = '';

  const $appHeaderLeft = document.createElement('div');
  const $appHeaderRight = document.createElement('div');

  $appHeaderLeft.appendChild($filterBranchInput);
  $appHeaderLeft.appendChild($filterAuthorInput);
  $appHeaderLeft.appendChild($hideApprovedCheckbox);
  $appHeaderLeft.appendChild($hideApprovedLabel);
  $appHeaderLeft.appendChild($hideMineCheckbox);
  $appHeaderLeft.appendChild($hideMineLabel);
  $appHeaderRight.appendChild($lastUpdate);

  $appHeader.appendChild($appHeaderLeft);
  $appHeader.appendChild($appHeaderRight);

  $content.appendChild($appHeader);
  $content.appendChild($tableContainer);

  await _renderTable($tableContainer);

  const refreshTimer = await ConfigHelper.getConfig('refresh-timer');

  if (refreshTimer) {
    const interval = setInterval(async () => {
      await refreshWatchingPullRequests();
      await _renderTable($tableContainer);
      const formattedDate = await getLastUpdateTime();
      $lastUpdate.textContent = `Last update: ${formattedDate}`;
    }, refreshTimer * 1000 * 60);

    RenderHelper.addPrerenderCallback(() => {
      clearInterval(interval);
    });
  }
};

module.exports = {
  render,
};
