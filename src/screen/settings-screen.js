const { selectButton } = require('../helper/NavigationHelper');
const { Input } = require('../component/Input');
const { Button } = require('../component/Button');
const { Label } = require('../component/Label');
const { Form } = require('../component/Form');
const { ConfigHelper } = require('../helper/ConfigHelper');
const { RenderHelper } = require('../helper/RenderHelper');
const { ScreenEnum } = require('../enum/ScreenEnum');

const FORM_LEFT_COLUMN_SIZE = 4;
const FORM_RIGHT_COLUMN_SIZE = 8;

const delay = (delay = 1000) => new Promise((resolve) => setTimeout(resolve, delay));

const renderRefreshInputGroup = async ($form) => {
  const refreshTimer = await ConfigHelper.getConfig('refresh-timer');

  const $refreshInputGroup = document.createElement('div');
  $refreshInputGroup.className = 'form-group row';

  const $refreshInputLabel = Label({
    classes: ['col-form-label', `col-sm-${FORM_LEFT_COLUMN_SIZE}`],
    for: 'refresh-timer',
    text: 'Refresh timer (min)',
  });

  const $refreshInput = Input({
    classes: ['form-control'],
    id: 'refresh-timer',
    name: 'refresh-timer',
    placeholder: 'refresh timer',
    type: 'number',
  });

  $refreshInput.value = refreshTimer;

  const $div = document.createElement('div');
  $div.className = `col-sm-${FORM_RIGHT_COLUMN_SIZE}`;

  $div.appendChild($refreshInput);
  $refreshInputGroup.appendChild($refreshInputLabel);
  $refreshInputGroup.appendChild($div);
  $form.appendChild($refreshInputGroup);
};

const renderLicenseKeyInput = ($form) => {
  const $licenseKeyInputGroup = document.createElement('div');
  $licenseKeyInputGroup.className = 'form-group row';

  const $licenseKeyInputLabel = Label({
    classes: ['col-form-label', `col-sm-${FORM_LEFT_COLUMN_SIZE}`],
    for: 'license key',
    text: 'License key',
  });

  const $licenseKeyInput = Input({
    classes: ['form-control'],
    id: 'license-key',
    placeholder: 'license key',
    readonly: true,
  });

  const $div = document.createElement('div');
  $div.className = `col-sm-${FORM_RIGHT_COLUMN_SIZE}`;

  $div.appendChild($licenseKeyInput);
  $licenseKeyInputGroup.appendChild($licenseKeyInputLabel);
  $licenseKeyInputGroup.appendChild($div);
  $form.appendChild($licenseKeyInputGroup);
};

const renderDisplayName = async ($form) => {
  const displayName = await ConfigHelper.getConfig('display-name');

  const $displayNameInputGroup = document.createElement('div');
  $displayNameInputGroup.className = 'form-group row';

  const $licenseKeyInputLabel = Label({
    classes: ['col-form-label', `col-sm-${FORM_LEFT_COLUMN_SIZE}`],
    for: 'display name',
    text: 'Display name',
  });

  const $displayNameInput = Input({
    classes: ['form-control'],
    id: 'display-name',
    placeholder: 'display name',
    readonly: true,
  });
  $displayNameInput.value = displayName;

  const $div = document.createElement('div');
  $div.className = `col-sm-${FORM_RIGHT_COLUMN_SIZE}`;

  $div.appendChild($displayNameInput);
  $displayNameInputGroup.appendChild($licenseKeyInputLabel);
  $displayNameInputGroup.appendChild($div);
  $form.appendChild($displayNameInputGroup);
};

const render = async () => {
  selectButton('settings');

  const $content = document.querySelector('#app > #content');

  const $contentContainer = document.createElement('div');

  const $form = Form({
    classes: ['col-sm-6'],
  });
  $form.style = 'display: flex; flex-direction: column; gap: 10px';

  await renderRefreshInputGroup($form);
  await renderDisplayName($form);
  renderLicenseKeyInput($form);

  const $saveButton = Button({
    classes: ['btn', 'btn-success'],
    textContent: 'Save',
    type: 'submit',
  });

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { 'refresh-timer': refreshTimer } = $form.getData();

    $saveButton.loading(true);
    await ConfigHelper.setConfig('refresh-timer', Number(refreshTimer) || null);
    await delay(300);
    $saveButton.loading(false);
  });

  $form.appendChild($saveButton);

  const $loginButton = Button({
    classes: ['btn btn-link'],
    textContent: 'Change username/password',
  });

  $loginButton.addEventListener('click', async () => {
    await RenderHelper.render(ScreenEnum.ROUTE_LOGIN);
  });

  $contentContainer.appendChild($form);
  $contentContainer.appendChild($loginButton);

  $content.innerHTML = '';

  $content.appendChild($contentContainer);
};

module.exports = {
  render,
};
