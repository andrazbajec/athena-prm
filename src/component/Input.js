const Input = ({
  classes = [],
  id,
  placeholder = '',
  type = "text",
} = {}) => {
  const $input = document.createElement('input');
  $input.type = type;
  $input.placeholder = placeholder;

  if (id) {
    $input.id = id;
  }

  if (classes.length) {
    $input.className = classes.join(" ");
  }

  return $input;
};

module.exports = {
  Input,
};
