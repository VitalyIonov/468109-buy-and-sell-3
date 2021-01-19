'use strict';

const fs = require(`fs`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга`,
  `Продам новую приставку Sony Playstation 5`,
  `Продам отличную подборку фильмов на VHS`,
  `Куплю антиквариат`,
  `Куплю породистого кота`,
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `При покупке с меня бесплатная доставка в черте города.`,
];

const CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`,
];

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const MAX_COUNT = 1000;

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};

const getPictureItemNumber = (number) => {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
};

const getPictureFileName = (number) => {
  return `item${getPictureItemNumber(number)}.jpg`;
};

const generateOffers = (count) => {
  return Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(SENTENCES).slice(1, 5).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
  }));
};

const runGenerateData = (args) => {
  const [count] = args;
  const countData = Number.parseInt(count, 10) || DEFAULT_COUNT;

  if (countData > MAX_COUNT) {
    return console.error(`Не больше 1000 объявлений`);
  }

  const content = JSON.stringify(generateOffers(countData));

  return fs.writeFile(FILE_NAME, content, (err) => {
    if (err) {
      return console.error(`Can't write data to file...`);
    }

    return console.info(`Operation success. File created.`);
  });
};

module.exports = {
  name: `--generate`,
  run(args) {
    runGenerateData(args);
  }
};
