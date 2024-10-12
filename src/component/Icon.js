const Icon = ({ classes: customClasses = [], color = '', icon, type = 'regular' }) => {
  const $icon = document.createElement('i');
  const $iconContainer = document.createElement('span');
  const classes = [`fa-${type}`, `fa-${icon}`, ...customClasses];
  let styles = [];

  if (color) {
    styles.push(`color:${color}`);
  }

  $icon.className = classes.join(' ');

  if (styles.length) {
    $icon.style = styles.join(';');
  }

  $iconContainer.setIcon = (icon) => {
    $icon.className = classes.join(' ');
    $iconContainer.innerHTML = '';
    $iconContainer.appendChild($icon);
  };

  $iconContainer.appendChild($icon);

  return $iconContainer;
};

module.exports = {
  Icon,
};
