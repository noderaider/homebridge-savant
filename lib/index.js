'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavantAccessory = exports.SavantPlatform = undefined;

exports.default = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerPlatform('homebridge-platform-savant', 'Savant', SavantPlatform);
};

var _savant = require('./savant');

var _savant2 = _interopRequireDefault(_savant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Service = null;
var Characteristic = null;

var SavantPlatform = exports.SavantPlatform = function SavantPlatform(log, config) {
  var _this = this;

  _classCallCheck(this, SavantPlatform);

  this.accessories = function (callback) {
    _this.log('Fetching Savant devices...');
    //For each device, create an accessory!
    var foundAccessories = _this.config.accessories;
    //create array of accessories
    var myAccessories = [];

    for (var i = 0; i < foundAccessories.length; i++) {
      _this.log('Parsing accessory ' + i + ' of ' + foundAccessories.length);
      _this.log('Push new device ' + foundAccessories[i].name);
      //Call accessoryConstruction
      var accessory = new SavantAccessory(_this.log, foundAccessories[i]);
      _this.log('Created ' + accessory.name + ' Accessory');
      myAccessories.push(accessory);
    }
    _this.log('Returning ' + myAccessories.length + ' accessories');
    callback(myAccessories);
  };

  this.log = log;
  this.config = config;
};

var SavantAccessory = exports.SavantAccessory = function SavantAccessory(log, config) {
  var _this2 = this;

  _classCallCheck(this, SavantAccessory);

  this.setState = function (powerOn, callback) {
    var accessory = _this2;
    var state = powerOn ? 'on' : 'off';
    var prop = state + 'Command';
    var command = accessory[prop].replace(/''/g, '"');
    _this2.log('Command: ' + command);
    _savant2.default.serviceRequest(command, done);

    function done(err, rtn) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + state));
      } else {
        accessory.log('Set ' + accessory.name + ' to ' + state);
        callback(null);
      }
    }
  };

  this.getPowerState = function (callback) {
    _this2.log('Calling the function to get current state...');
    var accessory = _this2;
    var getsavant = _this2.queryCommand.replace(/''/g, '"');

    _savant2.default.readState(getsavant, done);

    function done(err, rtn) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
      } else {
        if (rtn == 0) {
          accessory.log('The ' + accessory.name + ' is Off ');
          callback(null, false);
        } else {
          accessory.log('The ' + accessory.name + ' is On: ');
          callback(null, true);
        }
      }
    }
  };

  this.getCurrentHeatingCoolingState = function (callback) {
    _this2.log('Calling the function to get current state...');
    var accessory = _this2;
    var getsavant = _this2.queryStateCommand.replace(/''/g, '"');

    _savant2.default.readState(getsavant, done);

    function done(err, rtn) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
      } else {
        if (rtn == 0) {
          accessory.log('getCurrentHeatingCoolingState :', 'Off ');
          //this.CurrentHeatingCoolingState = parseInt('0');
          //callback(null, Characteristic.CurrentHeatingCoolingState.OFF);
          callback(null, 0);
        } else if (rtn == 1) {
          accessory.log('getCurrentHeatingCoolingState :', 'Cool ');
          //this.CurrentHeatingCoolingState = parseInt('2');
          //callback(null, Characteristic.CurrentHeatingCoolingState.COOL);
          callback(null, 2);
        } else if (rtn == 2) {
          accessory.log('getCurrentHeatingCoolingState :', 'Heat ');
          //this.CurrentHeatingCoolingState = parseInt('1');
          //callback(null, Characteristic.CurrentHeatingCoolingState.HEAT);
          callback(null, 1);
        } else {
          accessory.log('getCurrentHeatingCoolingState :', 'Cool ');
          //this.CurrentHeatingCoolingState = parseInt('2');
          //callback(null, Characteristic.CurrentHeatingCoolingState.COOL);
          callback(null, 2);
        }
      }
    }
  };

  this.setTargetHeatingCoolingState = function (value, callback) {
    _this2.log('Valor: ' + value);
    var accessory = _this2;

    if (value == 0) {
      var state = 'off';
      //return Characteristic.CurrentHeatingCoolingState.OFF;
    } else if (value == 1) {
        var state = 'heat';
        //return Characteristic.CurrentHeatingCoolingState.HEAT;
      } else {
          var state = 'cool';
          //return Characteristic.CurrentHeatingCoolingState.COOL;
        }
    _this2.log('Valor: ' + value + ' / Estado: ' + state);
    var prop = state + 'Command';
    var command = accessory[prop].replace(/''/g, '"');

    _savant2.default.serviceRequest(command, done);

    function done(err, rtn) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
      } else {
        accessory.log('setTarget :', rtn);
        accessory.log('setTargetHeatingCoolingState from/to:', this.targetHeatingCoolingState, value);
        accessory.targetHeatingCoolingState = value;
        callback(null, this.targetHeatingCoolingState);
      }
    }
  };

  this.getCurrentTemperature = function (callback) {
    _this2.log('Calling the function to get current temperature...');
    var accessory = _this2;
    var getsavant = _this2.queryTempCommand.replace(/''/g, '"');

    _savant2.default.readState(getsavant, done);

    function done(err, rtn) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
      } else {
        accessory.log('getCurrentTemperature :', rtn);
        this.temperature = parseInt(rtn);
        callback(null, this.temperature);
      }
    }
  };

  this.setTargetTemperature = function (value, callback) {
    _this2.log('Valor: ' + value);
    var accessory = _this2;
    var state = String(value);
    var prop = 'setCommand';
    var commandTemp = accessory[prop].replace(/''/g, '"');
    var command = commandTemp.replace(/VARTEMP/g, state);

    _savant2.default.serviceRequest(command);

    _this2.log('setTargetTemperature from/to', _this2.targetTemperature, value);
    _this2.targetTemperature = parseInt(value);
    _this2.temperature = parseInt(value);
    callback(null, _this2.targetTemperature);
  };

  this.getTemperatureDisplayUnits = function (callback) {
    _this2.log('getTemperatureDisplayUnits :', _this2.temperatureDisplayUnits);
    var error = null;
    callback(error, _this2.temperatureDisplayUnits);
  };

  this.setLevelState = function (brightness, callback) {
    _this2.log('Level: ' + brightness);
    var accessory = _this2;
    var level = String(brightness);
    var prop = 'setCommand';
    var commandTemp = accessory[prop].replace(/''/g, '"');
    var command = commandTemp.replace(/VARLEVEL/g, level);

    _savant2.default.serviceRequest(command, done);

    function done(err, rtn) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + level));
      } else {
        accessory.log('Set ' + accessory.name + ' to ' + level);
        callback(null, level);
      }
    }
  };

  this.getLevelState = function (callback) {
    _this2.log('Calling the function to get current Light Level...');
    var accessory = _this2;
    var getsavant = _this2.queryCommand.replace(/''/g, '"');

    _savant2.default.readState(getsavant, done);

    function done(err, rtn) {
      if (err) {
        accessory.log('Error: ' + err);
        callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
      } else {
        accessory.log('getLevelState :', rtn);
        this.brightness = parseInt(rtn);
        callback(null, this.brightness);
      }
    }
  };

  this.getServices = function () {
    var type = _this2.config.type;

    var informationService = new Service.AccessoryInformation();
    informationService.setCharacteristic(Characteristic.Manufacturer, 'Savant').setCharacteristic(Characteristic.Model, 'Pro Host').setCharacteristic(Characteristic.SerialNumber, 'Savant Serial Number');

    if (type == 'switch') {
      var switchService = new Service.Switch(_this2.name);
      switchService.getCharacteristic(Characteristic.On).on('get', _this2.getPowerState.bind(_this2)).on('set', _this2.setState.bind(_this2));

      return [switchService];
    } else if (type == 'thermostat') {
      var thermostatService = new Service.Thermostat(_this2.name);
      // Required Characteristics
      thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).on('get', _this2.getCurrentHeatingCoolingState.bind(_this2));

      thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState).on('set', _this2.setTargetHeatingCoolingState.bind(_this2));

      thermostatService.getCharacteristic(Characteristic.CurrentTemperature).on('get', _this2.getCurrentTemperature.bind(_this2));

      thermostatService.getCharacteristic(Characteristic.TargetTemperature).on('set', _this2.setTargetTemperature.bind(_this2));

      thermostatService.getCharacteristic(Characteristic.TemperatureDisplayUnits).on('get', _this2.getTemperatureDisplayUnits.bind(_this2));

      return [thermostatService];
    } else if (type == 'lightbulb') {
      var lightbulbService = new Service.Lightbulb(_this2.name);
      lightbulbService.getCharacteristic(Characteristic.On).on('get', _this2.getPowerState.bind(_this2)).on('set', _this2.setState.bind(_this2));
      lightbulbService.addCharacteristic(Characteristic.Brightness).on('get', _this2.getLevelState.bind(_this2)).on('set', _this2.setLevelState.bind(_this2));
      return [lightbulbService];
    }
  };

  this.log = log;
  this.config = config;
  this.name = config.name;
  if (config.type == 'switch') {
    //Switch thing
    this.onCommand = config['on'];
    this.offCommand = config['off'];
    this.queryCommand = config['query'];
  } else if (config.type == 'thermostat') {
    //Thermostat thing
    //Characteristic.TemperatureDisplayUnits.CELSIUS = 0;
    //Characteristic.TemperatureDisplayUnits.FAHRENHEIT = 1;
    this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS;
    this.temperature = 19;
    //this.relativeHumidity = 0.70;
    // The value property of CurrentHeatingCoolingState must be one of the following:
    //Characteristic.CurrentHeatingCoolingState.OFF = 0;
    //Characteristic.CurrentHeatingCoolingState.HEAT = 1;
    //Characteristic.CurrentHeatingCoolingState.COOL = 2;
    this.heatingCoolingState = Characteristic.CurrentHeatingCoolingState.COOL;
    this.targetTemperature = 21;
    //this.targetRelativeHumidity = 0.5;
    this.heatingThresholdTemperature = 22;
    this.coolingThresholdTemperature = 19;
    // The value property of TargetHeatingCoolingState must be one of the following:
    //Characteristic.TargetHeatingCoolingState.OFF = 0;
    //Characteristic.TargetHeatingCoolingState.HEAT = 1;
    //Characteristic.TargetHeatingCoolingState.COOL = 2;
    //Characteristic.TargetHeatingCoolingState.AUTO = 3;
    this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.COOL;

    //Temp:
    this.offCommand = config['off'];
    this.coolCommand = config['cool'];
    this.heatCommand = config['heat'];
    this.setCommand = config['set'];
    this.queryTempCommand = config['queryTemp'];
    this.queryStateCommand = config['queryState'];
  } else if (config.type == 'lightbulb') {
    //Dimmer thing
    this.onCommand = config['on'];
    this.offCommand = config['off'];
    this.setCommand = config['set'];
    this.queryCommand = config['query'];
  }
}

//**************Switch**************


//**************Thermostat**************
// Required


//**************LightBulb**************
;