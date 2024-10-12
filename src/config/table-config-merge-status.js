const { Icon } = require('../component/Icon');
const { COLOR_SUCCESS, COLOR_DANGER } = require('../enum/ColorEnum');
const { ICON_CIRCLE_CHECK, ICON_CIRCLE_XMARK, ICON_TYPE_SOLID, ICON_GRADUATION_CAP, ICON_HASHTAG, ICON_CODE } = require('../enum/IconEnum');
const TableConfigMergeStatus = [
  {
    style: ['text-align:center'],
    valueCallback: ({ _index }) => `${_index + 1}.`,
  },
  {
    title: 'ticket',
    valueCallback: ({ branch }) => {
      return branch.match(/[A-Z]{2,}-\d*/)?.[0] ?? 'N/A';
    },
    render: ({ branch, link }) => {
      const ticketNumber = branch.match(/[A-Z]{2,}-\d*/)?.[0] ?? null;
      let $element;

      if (ticketNumber) {
        const link = `https://preskok.atlassian.net/browse/${ticketNumber}`;

        $element = document.createElement('a');
        $element.href = link;
        $element.onclick = async (event) => {
          event.preventDefault();
          await require('electron').shell.openExternal(link);
        };
      } else {
        $element = document.createElement('span');
      }

      $element.textContent = ticketNumber ?? 'N/A';

      return $element;
    },
  },
  {
    title: 'branch',
    column: 'branch',
  },
  {
    title: 'author',
    column: 'author',
  },
  {
    title: 'ready to merge',
    classes: ['align-middle', 'text-center'],
    render: ({ readyToMerge }) => {
      return Icon({
        color: readyToMerge ? COLOR_SUCCESS : COLOR_DANGER,
        icon: readyToMerge ? ICON_CIRCLE_CHECK : ICON_CIRCLE_XMARK,
        type: ICON_TYPE_SOLID,
      });
    },
  },
  {
    title: 'pull requests',
    render: ({ pullRequests }) => {
      const $container = document.createElement('div');
      $container.className = 'pull-request-list';

      for (const { approves, link, repository, seniorApproves } of pullRequests) {
        const $link = document.createElement('a');
        $link.href = link;
        $link.textContent = repository;

        $link.onclick = async (event) => {
          event.preventDefault();
          await require('electron').shell.openExternal(link);
        };

        const $seniorIcon = Icon({
          color: seniorApproves ? COLOR_SUCCESS : COLOR_DANGER,
          icon: ICON_GRADUATION_CAP,
          type: ICON_TYPE_SOLID,
        });

        const $approveIcon = Icon({
          color: approves >= 2 ? COLOR_SUCCESS : COLOR_DANGER,
          icon: ICON_CODE,
          type: ICON_TYPE_SOLID,
        });

        $container.appendChild($seniorIcon);
        $container.appendChild($approveIcon);
        $container.appendChild($link);
      }

      return $container;
    },
  },
];

module.exports = TableConfigMergeStatus;
