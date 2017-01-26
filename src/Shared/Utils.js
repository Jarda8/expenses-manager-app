/* @flow */

function objectsAreSame(x: Object, y: Object): boolean {
  let objectsAreSame = true;
  let xKeys = Object.keys(x).sort();
  let yKeys = Object.keys(y).sort();

  if (!primitiveArraysAreSame(xKeys, yKeys)) {
    objectsAreSame = false
  } else {
    for(var propertyName in x) {
      if(x[propertyName] !== y[propertyName]) {
         objectsAreSame = false;
         break;
      }
    }
  }
  return objectsAreSame;
}

function arraysAreSame(x: Array<Object>, y: Array<Object>): boolean {
  let arraysAreSame = true;
  if ((x === undefined && y !== undefined) || (x !== undefined && y === undefined)) {
    arraysAreSame = false;
  } else if (x === undefined && y === undefined) {
    // do nothing
  } else if (x.length !== y.length) {
    arraysAreSame = false;
  } else {
    for (var i = 0; i < x.length; i++) {
      if(!objectsAreSame(x[i], y[i])) {
        arraysAreSame = false;
        break;
      }
    }
  }
  return arraysAreSame;
}

function primitiveArraysAreSame(x: Array<any>, y: Array<any>): boolean {
  let arraysAreSame = true;
  if ((x === undefined && y !== undefined) || (x !== undefined && y === undefined)) {
    arraysAreSame = false;
  } else if (x === undefined && y === undefined) {
    // do nothing
  } else if (x.length !== y.length) {
    arraysAreSame = false;
  } else {
    for (var i = 0; i < x.length; i++) {
      if(x[i] !== y[i]) {
        arraysAreSame = false;
        break;
      }
    }
  }
  return arraysAreSame;
}

export { objectsAreSame, arraysAreSame }
