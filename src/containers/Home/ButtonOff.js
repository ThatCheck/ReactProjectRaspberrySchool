import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { CounterButton, GithubButton } from 'components';
import {on,off} from 'redux/modules/light';
import { connect } from 'react-redux';
import {Button, Row, Col} from 'react-bootstrap'
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

  onCcick(e){
    console.log('click');
    this.props.on(this.props.gpio);
  }

  render() {
    const styles = require('./Switch.scss');
    const gpio = this.props.gpio;
    return (
      <Row>
        <Col xs={12}>
          <button onClick={this.onCcick.bind(this)} className="btn btn-danger col-xs-12" >Cuve vide</button>
        </Col>
      </Row>
    );
  }
}
