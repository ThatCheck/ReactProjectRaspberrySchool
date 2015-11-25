import React, { Component } from 'react';
import { Link } from 'react-router';
import { CounterButton, GithubButton } from 'components';
import {Col, Row, Panel} from 'react-bootstrap';

import Switch from './Switch';
import Arrosage from './Arrosage';
import ButtonOff from './ButtonOff';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    return (
      <div className={styles.home + ' ' + 'container'}>
        <Row>
          <h2> Eclairage </h2>
          <Col md={4}>
            <h3> Lumière 1 </h3>
            <Switch gpio={6}/>
          </Col>
          <Col md={4}>
            <h3> Lumière 2 </h3>
            <Switch  gpio={13} />
          </Col>
          <Col md={4}>
            <h3> Lumière 3 </h3>
            <Switch gpio={19}/>
          </Col>
        </Row>
        <Row>
          <h2>Arrosage</h2>
          <Col md={12}>
            <h2> Arrosage 1 </h2>
            <Arrosage gpio={4} />
          </Col>
          <Col md={12}>
            <h2> Arrosage 2 </h2>
            <Arrosage gpio={12} />
          </Col>
        </Row>
        <ButtonOff gpio={12}/>
      </div>
    );
  }
}
