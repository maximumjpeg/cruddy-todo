const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, id) {
    if (err) {
      throw ('error');
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, function(err) {
        if (err) {
          throw ('error');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, function(err, data) {
    if (err) {
      callback(err);
    } else {
      data = _.map(data, (fileName) => {
        return { id: fileName.slice(0, -4), text: fileName.slice(0, -4) };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', function(err, text) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, function(err) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};


