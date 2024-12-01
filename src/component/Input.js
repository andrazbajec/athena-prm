const Input = ({
  classes = [],
  id,
  name,
  placeholder = '',
  readonly = false,
  type = 'text',
} = {}) => {
  const $input = document.createElement('input');
  $input.type = type;
  $input.placeholder = placeholder;

  if (id) {
    $input.id = id;
  }

  if (classes.length) {
    $input.className = classes.join(' ');
  }

  if (readonly) {
    $input.readOnly = true;
  }

  if (name) {
    $input.name = name;
  }

  return $input;
};

module.exports = {
  Input,
};
