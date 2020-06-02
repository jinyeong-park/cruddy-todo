const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  //fs.readFile: Asynchronously reads the entire contents of a file
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////
// 1) use error first callback pattern
// // 2) use readCounter and writeCounter



exports.getNextUniqueId = (callback) => {
  //read file and set counter
  readCounter((err, data) => {
    if (err) {
      // console.log('Read Error at getNextUniqueId')
      callback(err)
    } else {
      counter = data;
      counter++;
      writeCounter(counter, (err, data) => {
        if (err) {
          // console.log('Write Error at getNextUniqueId')
          callback(err)
        } else {
          // console.log('The file has been saved!');
          callback(null, zeroPaddedNumber(counter))
        }
      })
    }
  })
};


// exports.getNextUniqueId = () => {
//   counter = counter + 1;
//   return zeroPaddedNumber(counter);
// };

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
