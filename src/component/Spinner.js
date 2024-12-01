/**
 * @param {Array<string>} classes
 * @param {string|null} color
 * @returns {HTMLDivElement}
 * @constructor
 */
const Spinner = ({
  classes = [],
  color = null,
} = {}) => {
  const $spinnerBorder = document.createElement('div');
  $spinnerBorder.role = 'status';

  if (!classes.includes('spinner-border')) {
    classes.push('spinner-border');
  }

  if (color) {
    classes.push(`text-${color}`);
  }

  $spinnerBorder.className = classes.join(' ');

  const $visuallyHidden = document.createElement('span');
  $visuallyHidden.className = 'visually-hidden';
  $visuallyHidden.textContent = 'Loading...';

  return $spinnerBorder;
};

module.exports = {
  Spinner,
};
