import React, { Component } from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  Crosshair
} from 'react-vis';
import './node_modules/react-vis/dist/style.css';

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

const PLOT_WIDTH = 900;

class App extends Component {
  constructor(props) {
    super();
    this.state = { crosshairValues: [] };

    this._onNearestX = this._onNearestX.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  _onNearestX(value, { index }) {
    this.setState({ crosshairValues: DATA.map(d => d[index]) });
  }

  _onMouseLeave() {
    this.setState({ crosshairValues: [] });
  }

  render() {

    return (
      <div className='app' style={{
        'margin-left': 'auto',
        'margin-right': 'auto',
        'width': PLOT_WIDTH
      }}>
        <XYPlot
          onMouseLeave={this._onMouseLeave}
          height={600}
          width={PLOT_WIDTH}>
          <VerticalGridLines/>
          <HorizontalGridLines/>
          <XAxis/>
          <YAxis/>
          <LineSeries
            onNearestX={this._onNearestX}
            data={DATA[0]} />
          <LineSeries data={DATA[1]} />
          <Crosshair values={this.state.crosshairValues} className={'test-class-name'} />
        </XYPlot>
      </div>
    );
  }
}

export default App;
