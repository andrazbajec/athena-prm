const Form = ({
  classes = [],
}) => {
  const $form = document.createElement('form');

  if (classes.length) {
    $form.className = classes.join(' ');
  }

  $form.getData = () => {
    const data = {};

    for (const $input of $form.querySelectorAll('input')) {
      const name = $input.name;

      if (!name) {
        continue;
      }

      data[name] = $input.value;
    }

    return data;
  }

  return $form;
};

module.exports = {
  Form,
};
