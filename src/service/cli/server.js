'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;

const {
  HttpCode
} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        const messages = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${messages}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

const runServer = (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

  http.createServer(onClientConnect)
    .listen(port)
    .on(`listening`, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера`, err));
      }

      return console.info(chalk.green(`Ожидаю соединение на ${port}`));
    });
};

module.exports = {
  name: `--server`,
  run(args) {
    runServer(args);
  }
};
