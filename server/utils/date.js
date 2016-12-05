'use strict';

exports.isDate = (d)=>{

  if(typeof string !== 'string'){
    return false;
  }

  const parts = string.split('.');
  let stringIsDate = false;
  const date = new Date();

  if(parts.length > 0){

    const dayNum = parseInt(parts[0]);
    const monthNum = parseInt(parts[1])+1;
    const yearNum = parseInt(parts[2]);

    console.log(dayNum,monthNum,yearNum);

    if(dayNum > 0 && dayNum < 33 && monthNum > 0 && monthNum < 13 && yearNum > 1000){

      stringIsDate = true;

    }

  }

  return stringIsDate;

};