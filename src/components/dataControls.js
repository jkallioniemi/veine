import React, { Component } from 'react';

class DataControls extends Component {
  constructor() {
    super();

    this.state = {
      morningsOnly: true,
      eveningsOnly: false,
      averageMeasurements: true,
      pickHighest: false,
      pickLowest: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    let { value } = event.target;
    value = (value === 'true');
    const newState = {
      ...this.state,
      [event.target.name]: !value
    };
    this.setState(newState);
    this.props.onFilterChange(event.target.name, !value);
  }

  render() {
    return (
      <div>
        <button
          className={this.state.morningsOnly ? 'btn btn-primary' : 'btn btn-default'}
          name="morningsOnly"
          type="button"
          value={this.state.morningsOnly}
          onClick={this.handleInputChange}
        >
          Mornings
        </button>
        <button
          className={this.state.eveningsOnly ? 'btn btn-primary' : 'btn btn-default'}
          name="eveningsOnly"
          type="button"
          value={this.state.eveningsOnly}
          onClick={this.handleInputChange}
        >
          Evenings
        </button>
        <button
          className={this.state.averageMeasurements ? 'btn btn-primary' : 'btn btn-default'}
          name="averageMeasurements"
          type="button"
          value={this.state.averageMeasurements}
          onClick={this.handleInputChange}
        >
          Average
        </button>
        <button
          className={this.state.pickHighest ? 'btn btn-primary' : 'btn btn-default'}
          name="pickHighest"
          type="button"
          value={this.state.pickHighest}
          onClick={this.handleInputChange}
        >
          Pick highest
        </button>
        <button
          className={this.state.pickLowest ? 'btn btn-primary' : 'btn btn-default'}
          name="pickLowest"
          type="button"
          value={this.state.pickLowest}
          onClick={this.handleInputChange}
        >
          Pick lowest
        </button>
      </div>
    );
  }
}

export default DataControls;
