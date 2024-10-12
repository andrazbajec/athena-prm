const { FileHelper } = require('./FileHelper');

class ConfigHelper {
  static _config;

  static async getConfig() {
    if (!ConfigHelper._config ?? null) {
      let config = {};

      try {
        config = JSON.parse(await FileHelper.readFile('config.json'));
      } catch (_) {
        // Fall through
      }

      ConfigHelper._config = config;
    }

    return ConfigHelper._config;
  }

  static async saveConfig(config) {
    await FileHelper.writeFile('config.json', JSON.stringify(config));
  }
}

module.exports = { ConfigHelper };
