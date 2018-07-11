import React, { Component } from 'react';
import Chart from './components/chart';
import DataControls from './components/dataControls';
import myData from '../bpdata.csv';
import { __, pick, map, curry, reduce, assoc, keys, addIndex, filter, splitEvery, mean } from 'ramda';
import parse from 'csv-parse/lib/sync';

let csvData = parse(myData, { columns: true });

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);

const averageTwoElements = (item) => ({
  x: item[0].x,
  y: mean([item[0].y, item[1].y])
});

const getTimeAndColumn = (column) => {
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
    data[0] = map(averageTwoElements, data[0]);
    data[1] = map(averageTwoElements, data[1]);

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
