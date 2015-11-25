import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { CounterButton, GithubButton } from 'components';
import {on,off} from 'redux/modules/light';
import { connect } from 'react-redux';

@connect(
  state => ({light: state.light}),
  {on,off})
export default class Switch extends Component {

  static propTypes = {
    gpio: PropTypes.number,
    light: PropTypes.object,
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired
  };

  onChangeOn(e){
    if(e.currentTarget.value == 'on') {
      this.props.on(this.props.gpio);
    }else{
      this.props.off(this.props.gpio);
    }
  }

  render() {
    const styles = require('./Switch.scss');
    const gpio = this.props.gpio;
    return (
      <div className={styles.switch + ' ' +  styles.white}>
        <div className="clearfix">
          <input type="radio" name={'switch-' + gpio} id="switch-off" onChange={this.onChangeOn.bind(this)} value="off"/>
          <input type="radio" name={'switch-' + gpio} id="switch-on" onChange={this.onChangeOn.bind(this)} value="on" defaultChecked/>
          <label for="switch-off">Off</label>
          <label for="switch-on">On</label>
          <span className={styles.toggle}> </span>
        </div>
      </div>
    );
  }
}
