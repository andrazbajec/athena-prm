const { Spinner } = require('./Spinner');
const Button = ({
  classes = [],
  id,
  textContent = '',
  type = 'button',
} = {}) => {
  const $button = document.createElement('button');

  if (classes.length) {
    $button.className = classes.join(' ');
  }

  if (id) {
    $button.id = id;
  }

  $button.type = type;
  $button.textContent = textContent;

  let previousInnerHtml;

  $button.loading = (status) => {
    if (status) {
      previousInnerHtml = $button.innerHTML;

      const $spinner = Spinner({
        classes: ['spinner-border', 'spinner-border-sm'],
      });

      $button.innerHTML = '';
      $button.disabled = true;
      $button.appendChild($spinner);
    } else if (previousInnerHtml) {
      $button.innerHTML = previousInnerHtml;
      $button.disabled = false;
      previousInnerHtml = null;
    }
  };

  return $button;
};

module.exports = {
  Button,
};
