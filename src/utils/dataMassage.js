import { curry, max, mean, min } from 'ramda';

const averageTwoElements = (item) => ({
  x: item[0].x,
  y: mean([item[0].y, item[1].y])
});

const pickHighest = (item) => ({
  x: item[0].x,
  y: max(item[0].y, item[1].y)
});

const pickLowest = (item) => ({
  x: item[0].x,
  y: min(item[0].y, item[1].y)
});

const copyX = (item) => ([
  { ...item[0] },
  { x: item[0].x, y: item[1].y }
]);

const takeNth = curry((n, item) => ({
  x: item[n].x,
  y: item[n].y,
}));

module.exports = {
  averageTwoElements,
  pickHighest,
  pickLowest,
  copyX,
  takeNth,
};
