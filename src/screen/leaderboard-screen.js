const { selectButton } = require('../helper/NavigationHelper');
const render = async () => {
  selectButton('leaderboard');
};

module.exports = {
  render,
};
