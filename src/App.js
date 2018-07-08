import React, { Component } from 'react';
import Chart from './components/chart';
import myData from '../bpdata.csv';
import { __, pick, map, curry, reduce, assoc, keys, addIndex, filter, splitEvery, mean } from 'ramda';
import parse from 'csv-parse/lib/sync';

const TIME_COLUMN_NAME = 'Time';

let csvData = parse(myData, { columns: true });

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);

const averageTwoElements = curry((column, item) =>
  ({
    [TIME_COLUMN_NAME]: item[0][TIME_COLUMN_NAME],
    [column]: mean([item[0][column], item[1][column]])
  })
);

const getTimeAndColumn = (column) => {
  let data = map(pick(['Time', column]), csvData);
  data = splitEvery(2, data);
  data = map(averageTwoElements(column), data);
  const renames = { Time: 'x' };
  renames[column] = 'y';
  data = map(renameKeys(renames), data);
  data = filter((x) => x.x !== '', data);
  data = map((x) => {
    x.x = new Date(x.x);
    return x;
  }, data);
  data = map((item) => {
    item.y = parseInt(item.y);
    return item;
  }, data);
  return data;
};

let DATA = [
  getTimeAndColumn('Systolic'),
  getTimeAndColumn('Diastolic')
];

class App extends Component {
  render() {
    console.log(DATA);
    return (
      <Chart height={600} width={900} data={DATA}/>
    );
  }
}

export default App;
