'use strict';

let jwt = require('jwt-simple');
let moment = require('moment');

let ensureAuth = function(req, res, next){
  if (!req.headers.authorization){
    return res.status(403).send({message: 'La petición no tiene la cabecera autenticación'});
  }

  let splittedToken = req.headers.authorization.split(' ');
  if (splittedToken.length == 2){
    let bearer = splittedToken[0];
    let token = splittedToken[1];
    if (/^Bearer$/i.test(bearer)){
      let payload;
      try{
        payload = jwt.decode(token,process.env.SHIFTS_SEC_KEY);

        if (payload.exp <= moment.utc().unix() ){
          return res.status(401).send({message: 'El token ha expirado'});
        }
      }catch(ex){
        return res.status(401).send({message: 'Token no válido'});
      }
      req.user = payload.user;
      next();
    }else{
      return res.status(401).send({message: 'Token no válido'});
    }
  }else{
    res.status(401).send({message: 'Token no válido'});
  }


};

module.exports = {
  ensureAuth
};
