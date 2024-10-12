const { Input } = require('../component/Input');
const { INPUT_TYPE_CHECKBOX } = require('../enum/InputEnum');
const { Label } = require('../component/Label');
const { Table } = require('../component/Table');
const DataHelper = require('../helper/DataHelper');
const TableConfigPR = require('../config/table-config-pr');
const { selectButton } = require('../helper/NavigationHelper');

const elements = {};
let showApproved = true;
let showHidden = false;
let data = null;
let $contentContainer = null;

const refreshTable = async () => {
  const data = await DataHelper.getFilteredData({ excludeMine: true, showApproved, showHidden, showNotWatched: false });
  const $table = Table({ data, reload: refreshTable, tableConfig: TableConfigPR });

  $contentContainer.innerHTML = '';
  $contentContainer.appendChild($table);
};

const render = async () => {
  selectButton('watched-pull-requests');

  data = await DataHelper.getData();

  const $app = document.getElementById('app');
  const $header = document.createElement('div');
  $header.className = 'app-header';

  const $hideApprovedCheckbox = Input({
    classes: ['form-check-input', 'mt-0'],
    id: 'filter-checkbox',
    type: INPUT_TYPE_CHECKBOX,
  });

  const $hideApprovedLabel = Label({
    classes: ['form-check-label', 'c-pointer'],
    for: 'filter-checkbox',
    text: 'hide approved',
  });

  const $showHiddenCheckbox = Input({
    classes: ['form-check-input', 'mt-0'],
    id: 'show-hidden-checkbox',
    type: INPUT_TYPE_CHECKBOX,
  });

  const $showHiddenLabel = Label({
    classes: ['form-check-label', 'c-pointer'],
    for: 'show-hidden-checkbox',
    text: 'show hidden',
  });

  const $headerLeft = document.createElement('div');

  $headerLeft.appendChild($hideApprovedCheckbox);
  $headerLeft.appendChild($hideApprovedLabel);
  $headerLeft.appendChild($showHiddenCheckbox);
  $headerLeft.appendChild($showHiddenLabel);

  $header.appendChild($headerLeft);

  $hideApprovedCheckbox.onchange = () => {
    showApproved = !$hideApprovedCheckbox.checked;
    refreshTable();
  };

  $showHiddenCheckbox.onchange = () => {
    showHidden = $showHiddenCheckbox.checked;
    refreshTable();
  };

  elements.$filterCheckbox = $hideApprovedCheckbox;
  elements.$showHiddenCheckbox = $showHiddenCheckbox;

  const $content = document.querySelector('#app > #content');
  $content.innerHTML = '';

  $contentContainer = document.createElement('div');

  $content.appendChild($header);
  $content.appendChild($contentContainer);

  await refreshTable();
};

module.exports = {
  render,
};
