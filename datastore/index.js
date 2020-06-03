const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
Promise.promisify(fs.readFile);

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
  //read folder
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err)
    }
      //loop over files and read them
    var data = _.map(files, (file) => {
      //readfile at path
      var filePath = path.join(exports.dataDir, file);
      //basename(slice): remove .txt and take only id
      var id = path.basename(file, '.txt');
      return new Promise(function(resolve, reject) {
        return fs.readFile(filePath, (err, fileData) => {
          //check for err
          if (err) {
            reject(err);
          } else {
            resolve({
              id: id,
              text: fileData.toString()
            })
          }
        })
      })
    });
    //items : result
    Promise.all(data).then(function(items) {
      callback(null, items)
    }).catch(function(err) {
      callback(err)
    })
  })
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
