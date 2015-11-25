import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { CounterButton, GithubButton } from 'components';
import {on} from 'redux/modules/arrosage';
import { connect } from 'react-redux';
import {ProgressBar} from 'react-bootstrap';

@connect(
  state => ({arrosage: state.arrosage}),
  {on})
export default class Arrosage extends Component {

  static propTypes = {
    gpio: PropTypes.number,
    arrosage: PropTypes.object,
    on: PropTypes.func.isRequired
  };

  state = {
    min : 0,
    max : 0,
    value : 0,
  };

  onClick = (e) => {
    console.log('init');
    if (socket && !this.onMsgListener) {
    }
    this.onMsgListener = socket.on('pulse', this.onMessageReceived);
    this.onStopListener = socket.on('stop', this.onStop);
    this.props.on();
  };

  onStop = () => {
    if (socket && this.onMsgListener) {
      socket.removeListener('on', this.onMsgListener);
      this.onMsgListener = null;
    }
    alert('STOPP !!');
  };

  onMessageReceived = (data) => {
    this.setState({min : parseInt(this.state.min), max: parseInt(this.state.max), value: parseInt(data.number)});
  };

  onChange = (e) => {

    this.setState({min : parseInt(this.state.min), max: parseInt(e.currentTarget.value), value:parseInt(this.state.value)});
    console.log(this.state);
  };
  render() {
    const styles = require('./Switch.scss');
    const gpio = this.props.gpio;
    const {min, max, value} = this.state;
    return (
      <div>
        <div className="form-group">
          <input type="number" className="form-control" onChange={this.onChange.bind(this)}/>
        </div>
        <ProgressBar bsStyle="info" active={true} min={min} max={max} now={value} />
        <button className="btn btn-primary" onClick={this.onClick.bind(this)}> Envoyer </button>
      </div>
    );
  }
}
