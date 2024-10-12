const { Icon } = require('../component/Icon');
const { COLOR_SUCCESS, COLOR_DANGER, COLOR_WARNING, COLOR_PRIMARY } = require('../enum/ColorEnum');
const { ICON_CIRCLE_CHECK, ICON_CIRCLE_XMARK, ICON_TYPE_SOLID, ICON_CIRCLE_QUESTION, ICON_EYE_SLASH, ICON_EYE } = require('../enum/IconEnum');

const TableConfigPR = [
  {
    style: ['text-align:center'],
    valueCallback: ({ _index }) => `${_index + 1}.`,
  },
  {
    title: 'author',
    column: 'author',
  },
  {
    title: 'branch',
    render: ({ branch, link }) => {
      const $link = document.createElement('a');
      $link.href = link;

      $link.onclick = async (event) => {
        event.preventDefault();

        await require('electron').shell.openExternal(link);
      };

      $link.textContent = branch;

      return $link;
    },
  },
  {
    title: 'repository',
    column: 'repository',
  },
  {
    title: 'created',
    valueCallback: ({ created }) => created || 'N/A',
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
    title: 'reviewers',
    column: 'reviewers',
    render: ({ reviewers }) => {
      const $content = document.createElement('span');

      for (const { approved, isSenior, name, requestChanges } of reviewers) {
        const $div = document.createElement('div');
        const $text = document.createElement('span');
        const $iconContainer = document.createElement('span');

        $div.style = 'display:grid;grid-template-columns:1fr 5fr';
        $text.textContent = name;

        if (isSenior) {
          $text.style = 'font-style:italic';
        }

        if (approved || requestChanges) {
          const $icon = Icon({
            color: approved ? COLOR_SUCCESS : COLOR_WARNING,
            icon: approved ? ICON_CIRCLE_CHECK : ICON_CIRCLE_QUESTION,
            type: ICON_TYPE_SOLID,
          });

          $iconContainer.appendChild($icon);
        }

        $div.appendChild($iconContainer);
        $div.appendChild($text);
        $content.appendChild($div);
      }

      return $content;
    },
  },
  {
    classes: ['align-middle', 'text-center'],
    render: (row, { reload } = {}) => {
      const $icon = Icon({
        classes: ['c-pointer'],
        color: row.hidden ? COLOR_DANGER : COLOR_PRIMARY,
        icon: row.hidden ? ICON_EYE_SLASH : ICON_EYE,
      });

      $icon.onclick = async () => {
        $icon.setIcon(row.hidden ? ICON_EYE : ICON_EYE_SLASH);
        row.hidden = !row.hidden;
        await reload();
      };

      return $icon;
    },
  },
];

module.exports = TableConfigPR;
