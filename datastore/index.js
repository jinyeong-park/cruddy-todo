const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  console.log(text);
  counter.getNextUniqueId((err, id) => {
    //make new file path
    let newTaskFile = path.join(exports.dataDir, `${id}.txt`);
    // write file to data directory
    fs.writeFile(newTaskFile, text, (err) => {
      if (err) {
        console.log('error on task create', err)
        callback(err);
      } else {
        items[id] = text;
        callback(null, { id, text });
      }
    })
  });
};

exports.readAll = (callback) => {
  // if there is no text in the data
   // return empty array
  // else  read all the text
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  //make path to id file in /data
  let newTaskFile = path.join(exports.dataDir, `${id}.txt`);
  // fs readfile
  fs.readFile(newTaskFile, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      text = text.toString();
      console.log({ id, text });
      callback(null, { id, text });
    }
  })
};

exports.update = (id, text, callback) => {
  let newTaskFile = path.join(exports.dataDir, `${id}.txt`);
  // read file to see if it exists
  fs.readFile(newTaskFile, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`))
    } else {
      // Then write file with new text
      fs.writeFile(newTaskFile, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  let newTaskFile = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(newTaskFile, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null)
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
