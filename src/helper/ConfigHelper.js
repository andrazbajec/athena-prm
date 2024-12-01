const { FileHelper } = require('./FileHelper');

class ConfigHelper {
  static _config;

  static async getConfig(key = null) {
    if (!ConfigHelper._config ?? null) {
      let config = {};

      try {
        config = JSON.parse(await FileHelper.readFile('config.json'));
      } catch (_) {
        // Fall through
      }

      ConfigHelper._config = config;
    }

    if (key) {
      return ConfigHelper._config[key] ?? null;
    }

    return ConfigHelper._config;
  }

  static async saveConfig(config) {
    await FileHelper.writeFile('config.json', JSON.stringify(config));
  }

  static async setConfig(key, value) {
    const config = await ConfigHelper.getConfig();

    config[key] = value;

    await ConfigHelper.saveConfig(config);
  }
}

module.exports = { ConfigHelper };
