import React, { Component } from 'react';
import Chart from './components/chart';
import myData from '../bpdata.csv';
import { __, pick, map, curry, reduce, assoc, keys, addIndex } from 'ramda';
import parse from 'csv-parse/lib/sync';

let csvData = parse(myData, { columns: true });

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);

const getTimeAndColumn = (column) => {
  let data = map(pick(['Time', column]), csvData);
  const renames = { Time: 'x' };
  renames[column] = 'y';
  data = map(renameKeys(renames), data);
  data = addIndex(map)((val, idx) => {
    val.x = idx;
    return val;
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
    return (
      <Chart height={600} width={900} data={DATA}/>
    );
  }
}

export default App;
