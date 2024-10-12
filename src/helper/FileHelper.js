const { mkdir, readFile, writeFile } = require('fs/promises');
const { ipcRenderer } = require('electron');

class FileHelper {
  static _appDataDirectory;

  static getAppDataDirectory() {
    return FileHelper._appDataDirectory;
  }

  static async setAppDataDirectory(directory) {
    FileHelper._appDataDirectory = `${directory}/Athena PRM`;

    try {
      await mkdir(FileHelper.getAppDataDirectory());
    } catch (_) {
      // Fall through
    }
  }

  static async readFile(fileName) {
    let encryptedBuffer = null;
    try {
      encryptedBuffer = await readFile(`${FileHelper.getAppDataDirectory()}/${fileName}`);
    } catch (_) {
      // Fall through
    }

    return await ipcRenderer.invoke('decrypt', encryptedBuffer);
  }

  static async writeFile(fileName, data) {
    const encryptedBuffer = await ipcRenderer.invoke('encrypt', data);

    return await writeFile(`${FileHelper.getAppDataDirectory()}/${fileName}`, encryptedBuffer);
  }
}

module.exports = { FileHelper };
