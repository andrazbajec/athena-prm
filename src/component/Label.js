const Label = ({ classes = [], for: forAttribute, text } = {}) => {
  const $label = document.createElement('label');

  if (forAttribute) {
    $label.setAttribute('for', forAttribute);
  }

  if (classes.length) {
    $label.className = classes.join(' ');
  }

  $label.textContent = text;

  return $label;
};

module.exports = {
  Label,
};
