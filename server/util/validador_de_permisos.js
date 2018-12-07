'use strict';

let validarPermisos = (views, view, operation) => {
  let permitido = false;
  for (let viewAux of views){
    if (viewAux.name === view){
      for (let operationAux of viewAux.operations){
        if (operationAux === operation){
          permitido = true;
          break;
        }
      }
      if (permitido){
        break;
      }
    }
  }
  return permitido;
};

module.exports = {
  validarPermisos
};