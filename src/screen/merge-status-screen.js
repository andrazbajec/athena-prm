const { selectButton } = require("../helper/NavigationHelper");
const DataHelper = require("../helper/DataHelper");
const { Table } = require("../component/Table");
const TableConfigMergeStatus = require("../config/table-config-merge-status");
const { Input } = require("../component/Input");
const { INPUT_TYPE_CHECKBOX } = require("../enum/InputEnum");
const { Label } = require("../component/Label");
const dayjs = require("dayjs");

const _renderTable = async ($tableContainer, config = {}) => {
  const data = await DataHelper.getGroupedData(config);

  const $table = Table({
    classes: ["merge-status-table"],
    data,
    tableConfig: TableConfigMergeStatus,
  });

  $tableContainer.innerHTML = "";
  $tableContainer.appendChild($table);
};

const render = async () => {
  selectButton("merge-status");

  const $app = document.querySelector("#app");

  const $appHeader = document.createElement("div");
  $appHeader.className = "app-header";

  const $tableContainer = document.createElement("div");

  const $filterBranchInput = Input({ placeholder: "filter branch" });
  const $filterAuthorInput = Input({ placeholder: "filter user" });

  const $hideApprovedCheckbox = Input({
    classes: ["form-check-input", "mt-0"],
    id: "hide-approved-checkbox",
    type: INPUT_TYPE_CHECKBOX,
  });

  const $hideApprovedLabel = Label({
    classes: ["form-check-label", "c-pointer"],
    for: "hide-approved-checkbox",
    text: "hide approved",
  });

  $filterBranchInput.oninput = () => {
    _renderTable($tableContainer, {
      filterAuthor: $filterAuthorInput.value,
      filterBranch: $filterBranchInput.value,
      baseFilter: {
        showApproved: !$hideApprovedCheckbox.checked,
      },
    });
  };

  $filterAuthorInput.oninput = ({ target: { value } }) => {
    _renderTable($tableContainer, {
      filterAuthor: $filterAuthorInput.value,
      filterBranch: $filterBranchInput.value,
      baseFilter: {
        showApproved: !$hideApprovedCheckbox.checked,
      },
    });
  };

  $hideApprovedCheckbox.onchange = ({ target: { value } }) => {
    _renderTable($tableContainer, {
      filterAuthor: $filterAuthorInput.value,
      filterBranch: $filterBranchInput.value,
      baseFilter: {
        showApproved: !$hideApprovedCheckbox.checked,
      },
    });
  };

  const latestFilename = await DataHelper.getLatestFilename();
  const [rawDate] = latestFilename.split(".");
  const [date, time] = rawDate.split("-");
  const newDate = `${date.split("_").join("-")} ${time.split("_").join(":")}`;

  const formattedDate = dayjs(newDate, "YYYY-MM-DD HH:mm:ss", true).format("DD.MM.YYYY HH:mm:ss");

  const $lastUpdate = document.createElement("p");
  $lastUpdate.textContent = `Last update: ${formattedDate}`;
  $lastUpdate.style.margin = 0;

  const $content = document.querySelector("#app > #content");
  $content.innerHTML = "";

  const $appHeaderLeft = document.createElement("div");
  const $appHeaderRight = document.createElement("div");

  $appHeaderLeft.appendChild($filterBranchInput);
  $appHeaderLeft.appendChild($filterAuthorInput);
  $appHeaderLeft.appendChild($hideApprovedCheckbox);
  $appHeaderLeft.appendChild($hideApprovedLabel);
  $appHeaderRight.appendChild($lastUpdate);

  $appHeader.appendChild($appHeaderLeft);
  $appHeader.appendChild($appHeaderRight);

  $content.appendChild($appHeader);
  $content.appendChild($tableContainer);

  await _renderTable($tableContainer);
};

module.exports = {
  render,
};
