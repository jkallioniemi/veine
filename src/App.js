import React, { Component } from 'react';
import parse from 'csv-parse/lib/sync';
import Chart from './components/chart';
import DataControls from './components/dataControls';
import myData from '../bpdata.csv';
import { map, addIndex, filter, clone } from 'ramda';
import {
  averageTwoElements, pickHighest, pickLowest,
  takeNth, copyX
} from './utils/dataMassage';
import { getTimeAndColumn } from './utils/dataLoad';
import { filterBasedOnHours } from './utils/dataFilter';

let csvData = parse(myData, { columns: true });
let DATA = [
  getTimeAndColumn(csvData, 'Systolic'),
  getTimeAndColumn(csvData, 'Diastolic')
];

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
