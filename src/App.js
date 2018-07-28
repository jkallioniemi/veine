import React, { Component } from 'react';
import Chart from './components/chart';
import DataControls from './components/dataControls';
import myData from '../bpdata.csv';
import { __, pick, map, curry, reduce, assoc, keys, addIndex, filter, splitEvery, mean, clone, max, min } from 'ramda';
import parse from 'csv-parse/lib/sync';

let csvData = parse(myData, { columns: true });

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);

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
      eveningsOnly: false,
      pickHighest: false,
      pickLowest: false,
      averageMeasurements: true
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
    let massageFn;

    if (this.state.averageMeasurements) {
      massageFn = averageTwoElements;
    } else if (this.state.pickHighest) {
      massageFn = pickHighest;
    } else if (this.state.pickLowest) {
      massageFn = pickLowest;
    }

    if (massageFn) {
      data[0] = map(massageFn, data[0]);
      data[1] = map(massageFn, data[1]);
    } else {
      data[0] = map(copyX, data[0]);
      data[1] = map(copyX, data[1]);
      const newData = [map(takeNth(0), data[0])];
      newData.push(map(takeNth(1), data[0]));
      newData.push(map(takeNth(0), data[1]));
      newData.push(map(takeNth(1), data[1]));
      data = newData;
    }

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
    const data = this.filterData(clone(DATA));
    return (
      <div>
        <Chart height={600} width={900} data={data}/>
        <DataControls onFilterChange={this.handleFilterChange} />
      </div>
    );
  }
}

export default App;
