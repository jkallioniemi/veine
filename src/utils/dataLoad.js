import { assoc, curry, keys, map, pick, reduce, splitEvery } from 'ramda';

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);

const getTimeAndColumn = (csvData, column) => {
  let data = map(pick(['Time', column]), csvData);
  const renames = { Time: 'x' };
  renames[column] = 'y';
  data = map(renameKeys(renames), data);
  data = map((x) => {
    x.x = x ? new Date(x.x) : x.x;
    return x;
  }, data);
  data = map((item) => {
    item.y = parseInt(item.y);
    return item;
  }, data);
  data = splitEvery(2, data);
  return data;
};

module.exports = {
  getTimeAndColumn
};
