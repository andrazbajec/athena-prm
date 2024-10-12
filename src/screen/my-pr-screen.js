const { Table } = require('../component/Table');
const TableConfigPR = require('../config/table-config-pr');
const DataHelper = require('../helper/DataHelper');
const { selectButton } = require('../helper/NavigationHelper');
const { Input } = require('../component/Input');
const { INPUT_TYPE_CHECKBOX } = require('../enum/InputEnum');
const { Label } = require('../component/Label');

let showApproved = true;
let showHidden = false;
let $contentContainer = null;

const refreshTable = async () => {
  const data = await DataHelper.getFilteredData({ excludeOthers: true, showApproved, showHidden });
  const $table = Table({ data, reload: refreshTable, tableConfig: TableConfigPR });
  $contentContainer.innerHTML = '';
  $contentContainer.appendChild($table);
};

const render = async () => {
  selectButton('my-pull-requests');

  const $app = document.querySelector('#app');
  const $appHeader = document.createElement('div');
  $appHeader.className = 'app-header';

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

  $showHiddenCheckbox.onchange = () => {
    showHidden = $showHiddenCheckbox.checked;
    refreshTable();
  };

  const $content = document.querySelector('#app > #content');
  $content.innerHTML = '';

  $contentContainer = document.createElement('div');
  const $appHeaderLeft = document.createElement('div');

  $appHeaderLeft.appendChild($showHiddenCheckbox);
  $appHeaderLeft.appendChild($showHiddenLabel);
  $appHeader.appendChild($appHeaderLeft);
  $content.appendChild($appHeader);
  $content.appendChild($contentContainer);

  await refreshTable();
};

module.exports = {
  render,
};
