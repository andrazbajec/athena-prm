const { ScreenEnum } = require('../enum/ScreenEnum');

const routeMapping = {
  [ScreenEnum.ROUTE_LOGIN]: '../screen/login-screen',
  [ScreenEnum.ROUTE_WATCHED_PR]: '../screen/watched-pr-screen',
  [ScreenEnum.ROUTE_MAIN_SCREEN]: '../screen/main-screen',
  [ScreenEnum.ROUTE_MY_PR]: '../screen/my-pr-screen',
  [ScreenEnum.ROUTE_MERGE_STATUS]: '../screen/merge-status-screen',
  [ScreenEnum.ROUTE_SETTINGS]: '../screen/settings-screen',
};

class RenderHelper {
  static _prerenderCallbacks = [];

  static async render(route) {
    const filePath = routeMapping[route] ?? null;

    if (!filePath) {
      return;
    }

    const { render } = require(filePath);

    if (!render) {
      return;
    }

    for (const prerenderCallback of RenderHelper._prerenderCallbacks) {
      try {
        prerenderCallback();
      } catch (_) {
        // Fall through
      }
    }

    RenderHelper._prerenderCallbacks = [];

    await render();
  }

  static addPrerenderCallback(callback) {
    RenderHelper._prerenderCallbacks.push(callback);
  }
}

module.exports = {
  RenderHelper,
};
