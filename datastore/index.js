const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // folder is dataDir
  // each entry is its own file, maybe using fs.writeFile()
  // id is filename, use getNextUniqueId
  // todo text is only thing in the file
  // path.join(dataDir/...whatever the file is called from the writeFile function)
  // DO NOT STORE AN OBJECT


  counter.getNextUniqueId(function(err,id) {
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


  // items[id] = text;clear
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
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
