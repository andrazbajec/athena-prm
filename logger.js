const dayjs = require('dayjs');
const { appendFile, mkdir } = require('fs/promises');

const log = async (message, addTimestamp = true) => {
  const folder = 'log';

  try {
    await mkdir(folder, { recursive: true });
  } catch (_) {
    // Fall through
  }

  const today = dayjs().format('YYYY_MM_DD');

  if (addTimestamp) {
    const now = dayjs().format('YYYY-MM-DD hh:mm:ss');
    message = `[${now}] ${message}`;
  }

  message += '\n';

  await appendFile(`${folder}/${today}.log`, message, { encoding: 'utf8' });
};

module.exports = {
  log,
};
