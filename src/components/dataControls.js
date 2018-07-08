import React, { Component } from 'react';

class DataControls extends Component {
  constructor() {
    super();

    this.state = {
      morningsOnly: true,
      eveningsOnly: false,
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
          name='morningsOnly'
          type='button'
          value={this.state.morningsOnly}
          onClick={this.handleInputChange}>
          Mornings
        </button>
        <button
          className={this.state.eveningsOnly ? 'btn btn-primary' : 'btn btn-default'}
          name='eveningsOnly'
          type='button'
          value={this.state.eveningsOnly}
          onClick={this.handleInputChange}>
          Evenings
        </button>
      </div>
    );
  }
}

export default DataControls;
