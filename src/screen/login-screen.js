const { Input } = require('../component/Input');
const { ConfigHelper } = require('../helper/ConfigHelper');
const { RenderHelper } = require('../helper/RenderHelper');
const { ScreenEnum } = require('../enum/ScreenEnum');
const { Button } = require('../component/Button');

const render = async () => {
  const $app = document.getElementById('app');

  const $container = document.createElement('div');
  $container.id = 'login-container';

  const $emailInput = Input({
    classes: ['form-control', 'w-25'],
    placeholder: 'email',
    type: 'email',
  });
  const $passwordInput = Input({
    classes: ['form-control', 'w-25'],
    placeholder: 'password',
    type: 'password',
  });

  const $continueButton = Button({
    classes: ['btn', 'btn-success', 'btn-sm', 'w-25'],
    textContent: 'continue',
  });

  $continueButton.onclick = async () => {
    await ConfigHelper.setConfig('email', $emailInput.value);
    await ConfigHelper.setConfig('password', $passwordInput.value);
    await RenderHelper.render(ScreenEnum.ROUTE_MAIN_SCREEN);
  };

  $app.innerHTML = '';
  $container.appendChild($emailInput);
  $container.appendChild($passwordInput);
  $container.appendChild($continueButton);
  $app.appendChild($container);
};

module.exports = { render };
