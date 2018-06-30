import React, { Component } from 'react';
import Chart from './components/chart';

const DATA = [
  [
    {x: 0, y: 158},
    {x: 1, y: 143},
    {x: 2, y: 148},
    {x: 3, y: 136},
    {x: 4, y: 143},
    {x: 5, y: 144},
    {x: 6, y: 141},
    {x: 7, y: 140},
    {x: 8, y: 137},
    {x: 9, y: 146}
  ],
  [
    {x: 0, y: 93},
    {x: 1, y: 95},
    {x: 2, y: 99},
    {x: 3, y: 92},
    {x: 4, y: 91},
    {x: 5, y: 92},
    {x: 6, y: 96},
    {x: 7, y: 93},
    {x: 8, y: 87},
    {x: 9, y: 90}
  ]
];

class App extends Component {
  render() {
    return (
      <Chart height={600} width={900} data={DATA}/>
    );
  }
}

export default App;
