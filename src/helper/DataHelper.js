const { readdir, readFile, mkdir } = require('fs/promises');
const { ConfigHelper } = require('./ConfigHelper');

class DataHelper {
  static _data = null;

  static async getData() {
    if (DataHelper._data) {
      return DataHelper._data;
    }

    const folder = 'data/pr-watching';
    const latestFile = await DataHelper.getLatestFilename();
    let data = [];

    if (latestFile) {
      const content = await readFile(`${folder}/${latestFile}`, {
        encoding: 'utf8',
      });
      data = JSON.parse(content);
    }

    DataHelper._data = data;

    return data;
  }

  static async getLatestFilename() {
    const folder = 'data/pr-watching';

    try {
      await mkdir(folder, { recursive: true });
    } catch (_) {
      // Fall through
    }

    const directory = await readdir(folder);
    return directory?.at(-1);
  }

  static async getFilteredData({ excludeMine = false, excludeOthers = false, showApproved = true, showHidden = true, showNotWatched = true }) {
    const data = await DataHelper.getData();
    const displayName = await ConfigHelper.getConfig('display-name');

    return (
      data.filter(({ author, hidden, reviewers }) => {
        let showCurrent = true;

        if ((excludeMine && author === displayName) || (excludeOthers && author !== displayName)) {
          return false;
        }

        if (!showHidden && hidden) {
          return false;
        }

        if (!showApproved) {
          showCurrent = !reviewers.filter(({ approved, name }) => approved && displayName === name).length;
        }

        if (showCurrent && !showNotWatched) {
          showCurrent = reviewers.filter(({ name }) => displayName === name).length;
        }

        return showCurrent;
      }) ?? []
    );
  }

  static async getGroupedData({ baseFilter = {}, filterAuthor, filterBranch } = {}) {
    // const data = await DataHelper.getData();
    const data = await DataHelper.getFilteredData(baseFilter);
    const groupedData = {};

    for (const pullRequest of data) {
      const author = pullRequest.author;
      const branch = pullRequest.branch;

      if (filterBranch && !branch.toLocaleLowerCase().includes(filterBranch.toLocaleLowerCase())) {
        continue;
      }

      if (filterAuthor && !author.toLocaleLowerCase().includes(filterAuthor.toLocaleLowerCase())) {
        continue;
      }

      if (!groupedData[branch]) {
        groupedData[branch] = {
          author: author,
          branch,
          readyToMerge: true,
          pullRequests: [],
        };
      }

      groupedData[branch].pullRequests.push(pullRequest);

      if (!pullRequest.readyToMerge) {
        groupedData[branch].readyToMerge = false;
      }
    }

    return Object.values(groupedData);
  }
}

module.exports = DataHelper;
