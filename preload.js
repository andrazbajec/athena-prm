const { FileHelper } = require('./src/helper/FileHelper');
const { ConfigHelper } = require('./src/helper/ConfigHelper');
const { render: renderMainScreen } = require('./src/screen/main-screen');
const { render } = require('./src/screen/login-screen');
const { ipcRenderer } = require('electron');

const boot = async () => {
  await FileHelper.setAppDataDirectory(await ipcRenderer.invoke('getAppDataDirectory'));
  const config = await ConfigHelper.getConfig();

  if (!config.email || !config.password) {
    render();
    return;
  }

  await renderMainScreen();
};

window.addEventListener('DOMContentLoaded', async () => {
  await boot();
});
