const { FileHelper } = require('./src/helper/FileHelper');
const { ConfigHelper } = require('./src/helper/ConfigHelper');
const { ipcRenderer } = require('electron');
const { RenderHelper } = require('./src/helper/RenderHelper');
const { ScreenEnum } = require('./src/enum/ScreenEnum');

const boot = async () => {
  await FileHelper.setAppDataDirectory(await ipcRenderer.invoke('getAppDataDirectory'));
  const config = await ConfigHelper.getConfig();

  if (!config.email || !config.password) {
    await RenderHelper.render(ScreenEnum.ROUTE_LOGIN);
    return;
  }

  await RenderHelper.render(ScreenEnum.ROUTE_MAIN_SCREEN);
};

window.addEventListener('DOMContentLoaded', async () => {
  await boot();
});
