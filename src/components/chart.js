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
import '../../node_modules/react-vis/dist/style.css';

let width;
let height;

class Chart extends Component {
  constructor(props) {
    super();
    this.state = {
      data: props.data,
      crosshairValues: []
    };

    width = props.width;
    height = props.height;

    this._onNearestX = this._onNearestX.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  _onNearestX(value, { index }) {
    this.setState({ ...this.state, crosshairValues: this.state.data.map(d => d[index]) });
  }

  _onMouseLeave() {
    this.setState({ ...this.state, crosshairValues: [] });
  }

  render() {

    return (
      <div className='app' style={{
        'margin-left': 'auto',
        'margin-right': 'auto',
        'width': width
      }}>
        <XYPlot
          onMouseLeave={this._onMouseLeave}
          height={height}
          width={width}
          xType={'time'}>
          <VerticalGridLines/>
          <HorizontalGridLines/>
          <XAxis/>
          <YAxis/>
          <LineSeries
            onNearestX={this._onNearestX}
            data={this.state.data[0]} />
          <LineSeries data={this.state.data[1]} />
          {this.state.crosshairValues.length > 0 ? (
            <Crosshair values={this.state.crosshairValues} className={'test-class-name'}>
              <table className='table table-condensed' style={{ backgroundColor: '#000000' }}>
                <tr>
                  <td>Sys</td>
                  <td>{this.state.crosshairValues[0].y}</td>
                </tr>
                <tr>
                  <td>Dia</td>
                  <td>{this.state.crosshairValues[1].y}</td>
                </tr>
              </table>
            </Crosshair>
          ) : null }
        </XYPlot>
      </div>
    );
  }
}

export default Chart;
