const Table = ({ classes: extraClasses = [], data, reload, tableConfig }) => {
  const $table = document.createElement('table');
  $table.className = ['table', ...extraClasses].join(' ');

  const $thead = document.createElement('thead');
  const $tbody = document.createElement('tbody');
  const $headerRow = document.createElement('tr');

  for (const { title } of tableConfig) {
    const $headerColumn = document.createElement('th');
    $headerColumn.textContent = title;
    $headerRow.appendChild($headerColumn);
  }

  let index = 0;

  for (const row of data) {
    row._index = index++;
    const $row = document.createElement('tr');

    for (const { classes, column, render, style, valueCallback } of tableConfig) {
      const $column = document.createElement('td');
      let value = row[column];

      if (render) {
        $column.appendChild(render(row, { reload }));
      } else {
        if (valueCallback) {
          value = valueCallback(row);
        }

        $column.textContent = value;
      }

      $column.style = (style ?? []).join(';');
      $column.className = (classes ?? []).join(' ');
      $row.appendChild($column);
    }

    $tbody.appendChild($row);
  }

  $thead.appendChild($headerRow);
  $table.appendChild($thead);
  $table.appendChild($tbody);

  return $table;
};

module.exports = {
  Table,
};
