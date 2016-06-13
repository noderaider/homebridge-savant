'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeState = writeState;
exports.serviceRequest = serviceRequest;
exports.readState = readState;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeState(command, cb) {
    var p = _os2.default.platform();
    var ls = null;
    var outstring = '';
    var cmd = 'writestate,' + command;
    var arg = cmd.toString().split(',');

    if (p === 'linux') {
        //linux
        ls = _child_process2.default.spawn('/usr/local/bin/sclibridge', arg);
    } else if (p === 'darwin') {
        //mac osx
        ls = _child_process2.default.spawn('/Users/RPM/Applications/RacePointMedia/sclibridge', arg);
    } else {
        //other
        var err = new Error('Unsupported OS system...');
        cb(err, null);
    }

    ls.on('error', function (e) {
        var err = new Error('savant.writestate: there was an error while executing the writestate program. check the path or permissions...');
        cb(err, null);
    });

    ls.stdout.on('data', function (data) {
        outstring += String(data);
    });

    ls.stderr.on('data', function (data) {
        //sys.print('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        var result;
        result = code === 0 ? true : false;

        if (cb) {
            cb(null, result);
        }
    });
}

function serviceRequest(command, cb) {
    var p = _os2.default.platform();
    var ls = null;
    var outstring = '';
    var cmd = 'servicerequest,' + command;
    var arg = cmd.toString().split(',');

    if (p === 'linux') {
        //linux
        ls = _child_process2.default.spawn('/usr/local/bin/sclibridge', arg);
    } else if (p === 'darwin') {
        //mac osx
        ls = _child_process2.default.spawn('/Users/RPM/Applications/RacePointMedia/sclibridge', arg);
    } else {
        //other
        var err = new Error('Unsupported OS system...');
        cb(err, null);
    }

    ls.on('error', function (e) {
        var err = new Error('savant.serviceRequest: there was an error while executing the serviceRequest program. check the path or permissions...');
        cb(err, null);
    });

    ls.stdout.on('data', function (data) {
        outstring += String(data);
    });

    ls.stderr.on('data', function (data) {
        //sys.print('stderr: ' + data);
    });

    ls.on('exit', function (code) {
        var result;
        result = code === 0 ? true : false;

        if (cb) {
            cb(null, result);
        }
    });
}

function readState(command, cb) {
    var p = _os2.default.platform();
    var ls = null;
    var outstring = '';
    var cmd = 'readstate,' + command;
    var arg = cmd.toString().split(',');

    if (p === 'linux') {
        //linux
        ls = _child_process2.default.spawn('/usr/local/bin/sclibridge', arg);
    } else if (p === 'darwin') {
        //mac osx
        ls = _child_process2.default.spawn('/Users/RPM/Applications/RacePointMedia/sclibridge', arg);
    } else {
        //other
        var err = new Error('Unsupported OS system...');
        cb(err, null);
    }

    ls.on('error', function (e) {
        var err = new Error('savant.readstate: there was an error while executing the readstate program. check the path or permissions...');
        cb(err, null);
    });

    ls.stdout.on('data', function (data) {
        outstring += String(data);
    });

    //        ls.stderr.on('data', function (data) {
    //sys.print('stderr: ' + data);
    //        });

    ls.on('exit', function (code) {
        var result;
        result = outstring; //(code === 0) ? true : false;

        if (cb) {
            cb(null, result);
        }
    });
}