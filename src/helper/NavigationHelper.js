const selectButton = (id) => {
  const buttons = document.querySelectorAll('#navigation > button');

  for (const $button of buttons || []) {
    $button.className = $button.id === id
      ? 'btn btn-dark'
      : 'btn btn-secondary';
  }
};

module.exports = {
  selectButton,
};
