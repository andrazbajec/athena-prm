const { Input } = require('../component/Input');
const { ConfigHelper } = require('../helper/ConfigHelper');
const { render: renderMainScreen } = require('../screen/main-screen');

const render = () => {
  const $app = document.getElementById('app');

  const $container = document.createElement('div');
  $container.id = 'login-container';

  const $emailInput = Input({ placeholder: 'email', type: 'email' });
  const $passwordInput = Input({ placeholder: 'password', type: 'password' });

  const $continueButton = document.createElement('button');
  $continueButton.className = 'btn btn-success btn-sm';
  $continueButton.textContent = 'continue';

  $continueButton.onclick = async () => {
    await ConfigHelper.saveConfig({ email: $emailInput.value, password: $passwordInput.value });
    await renderMainScreen();
  };

  $app.innerHTML = '';
  $container.appendChild($emailInput);
  $container.appendChild($passwordInput);
  $container.appendChild($continueButton);
  $app.appendChild($container);
};

module.exports = { render };
