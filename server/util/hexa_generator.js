'use strict';

const PersonDomain = require('../domain/person');

//const alphabet = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
const alphabet = ['3','4','5','6','7','8','9','A','B'];

let getHexa = () => {
  let color = '#';
  let length = alphabet.length;
  color += alphabet[Math.floor(Math.random() * length)] + '' + alphabet[Math.floor(Math.random() * length)] + '' + alphabet[Math.floor(Math.random() * length)] + '' + alphabet[Math.floor(Math.random() * length)] + '' + alphabet[Math.floor(Math.random() * length)] + '' + alphabet[Math.floor(Math.random() * length)];
  return color;
};

let getUniqueHexa = () => {
  let hexa = getHexa();
  let query = {
    "personColor" : hexa
  };
  console.log("HEXA GENERADO PARA BUSQUEDA: " + hexa);
  return new Promise((resolve, reject) => {
    PersonDomain
      .getPersonsFor(query)
      .then((persons) => {
        console.log("PERSONS ENCONTRADOS: " + persons);
        console.log("LENGTH: " + persons.length);
        if (persons.length === 0){
            console.log("HEXA RETORNADO: " + hexa);
            resolve(hexa);
        }else{
          resolve(getUniqueHexa());
        }
      })
      .catch((err) => reject(err));
  });


};

module.exports = {
  getUniqueHexa
};
