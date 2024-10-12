/**
 * @param {string|null} color
 * @returns {HTMLDivElement}
 * @constructor
 */
const Spinner = ({ color = null } = {}) => {
  const $spinnerBorder = document.createElement('div');
  const spinnerBorderClasses = ['spinner-border'];
  $spinnerBorder.role = 'status';

  if (color) {
    spinnerBorderClasses.push(`text-${color}`);
  }

  $spinnerBorder.className = spinnerBorderClasses.join(' ');

  const $visuallyHidden = document.createElement('span');
  $visuallyHidden.className = 'visually-hidden';
  $visuallyHidden.textContent = 'Loading...';

  return $spinnerBorder;
};

module.exports = {
  Spinner,
};
