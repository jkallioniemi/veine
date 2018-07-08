import React, { Component } from 'react';
import Chart from './components/chart';
import DataControls from './components/dataControls';
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

const filterBasedOnHours = curry((min, max, item) => {
  const hours = item.x.getUTCHours();
  return hours >= min && hours <= max;
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      morningsOnly: true,
      eveningsOnly: false
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.filterData = this.filterData.bind(this);
  }

  handleFilterChange(name, value) {
    this.setState({
      ...this.state,
      [name]: value
    });
  }

  filterData(data) {
    if (this.state.morningsOnly) {
      const filterMorning = filterBasedOnHours(1, 8);
      return [filter(filterMorning, data[0]), filter(filterMorning, data[1])];
    }

    if (this.state.eveningsOnly) {
      const filterEvening = filterBasedOnHours(14, 23);
      return [filter(filterEvening, data[0]), filter(filterEvening, data[1])];
    }

    return data;
  }

  render() {
    const data = this.filterData(DATA);
    return (
      <div>
        <Chart height={600} width={900} data={data}/>
        <DataControls onFilterChange={this.handleFilterChange} />
      </div>
    );
  }
}

export default App;
