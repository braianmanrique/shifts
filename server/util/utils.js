'use strict';

/**
 * Metodo que recorre una lista y por cada elemento de la lista se puede realizar comportamiento asincrono
 * @param  {[type]} list             [Lista a iterar]
 * @param  {[type]} iteratorCallback [Callback que se ejecuta en cada ciclo de la iteración]
 * @param  {[type]} finalCallback    [Callback que se ejecuta cuando termina el ciclo]
 */
let doAsyncRecursively = (list, iteratorCallback, finalCallback) => {

  let nextItemIndex = 0;

  let doNext = () => {
    nextItemIndex++;
    if (nextItemIndex === list.length && nextItemIndex !== 0)
      finalCallback();
    else
      iteratorCallback(list[nextItemIndex], doNext);
  };
  
  if(list.length === 0){
    finalCallback();
  }else{
    /*Se inicia la iteración desde la primera posición de la lista*/
    iteratorCallback(list[0], doNext);
  }
};

module.exports = {
  doAsyncRecursively
};

