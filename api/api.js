require('../server.babel'); // babel registration (runtime transpilation for node)
const GPIO_STATE = {HIGH: 1, LOW: 0};
const GPIO_IN_WATER = 23;
const GPIO_OUT_NUMBER_WATER = 24;
const GPIO_OUT_CAPTEUR = 12;
const GPIO_IN_CAPTEUR = 16;
const WATERING = "@@WATERING";


import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import {mapUrl} from 'utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import {Gpio} from 'onoff';
import Nanotimer from 'nanotimer';

const queue = [];

/**
 * Declare the function interval
 */
const nanotimer = new Nanotimer();
const GPIO_WATER = new Gpio(GPIO_OUT_NUMBER_WATER,'out');

const GPIO_LED_1 = new Gpio(6,'out');
const GPIO_LED_2 = new Gpio(13,'out');
const GPIO_LED_3 = new Gpio(19,'out');

GPIO_LED_1.writeSync(1);
GPIO_LED_2.writeSync(1);
GPIO_LED_3.writeSync(1);


let pulse_state = 0;
function generate_pulse()
{
  GPIO_WATER.writeSync(++pulse_state%2);
}

var interval = null;
/**
 * Make the config GPIO data
 */
const pretty = new PrettyError();
const app = express();

const server = new http.Server(app);

const io = new SocketIo(server);
io.path('/ws');

app.use(function(req,res, next){
  res.header('Access-Control-Allow-Origin','http://localhost:3000');
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers','Content-Type');
  next();
});

app.use(session({
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.post('/tasks', function(req, res) {
  if(req.body.type === WATERING){
    queue.push({GPIO: req.body.gpio, size: req.body.size});
  }
  res.status(200).json({});
});

app.get('/tasks', function(req, res){
    res.status(200).json(queue);
});

app.post('/start', function(req, res){
  nanotimer.setInterval(generate_pulse,'','4.4m');
  res.status(200).json({});
});

app.post('/stop', function(req, res){
  pulse = 0;
  interval.clearInterval();
  res.status(200).json({});
});

app.post('/on/:id', function(req, res){
  const id = req.params.id;
  const current = new Gpio(id,'out');
  current.writeSync(GPIO_STATE.HIGH);
  res.status(200).json({id: id, state:GPIO_STATE.HIGH});
});

app.post('/off/:id', function(req, res){
  const id = req.params.id;
  const current = new Gpio(id,'out');
  current.writeSync(GPIO_STATE.LOW);
  res.status(200).json({id: id, state:GPIO_STATE.LOW});
});

app.post('/switch/:id', function(req, res){
  const id = req.params.id;
  const currentIn = new Gpio(id,'in');
  const state = currentIn.readSync();
  let next = null;
  if(state === GPIO_STATE.HIGH){
    next = GPIO_STATE.LOW;
  }else{
    next = GPIO_STATE.HIGH;
  }
  const currentOut = new Gpio(id,'out');
  currentOut.writeSync(next);
  res.status(200).json({id: id, state:next});
});


app.get('/state/:id', function(req, res){
  const id = req.params.id;
  const current = new Gpio(id,'in');
  const state = current.readSync();
  res.status(200).json({id: id, state: state});
});


/**
 * Send from socketIo the state of the water
 */

const WATER_GPIO_INSTANCE = new Gpio(GPIO_IN_WATER, 'in', 'both');
const CAPTEUR_GPIO_INSTANCE = new Gpio(GPIO_IN_CAPTEUR, 'in', 'both');

let last_state = GPIO_STATE.LOW;
let mid_pulse = 0;
let pulse = 0;

CAPTEUR_GPIO_INSTANCE.watch(function(err, value){
  if( value === GPIO_STATE.HIGH){
    pulse = 0;
    nanotimer.clearInterval();
    io.sockets.emit('stop',1);
    const currentOut = new Gpio(GPIO_OUT_CAPTEUR,'out');
    currentOut.writeSync(next);
  }
});

WATER_GPIO_INSTANCE.watch(function(err, value){
  pulse += 1;
  if(pulse % 450 === 0) {
    io.sockets.emit('pulse', {number: pulse / 450});
  }
});

/**
 * SocketIO config
 * @type {number}
 */
const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.listen(runnable);

} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}

/*
let iv = setInterval(function () {
  console.log(pulse);
}, 1000);
  */