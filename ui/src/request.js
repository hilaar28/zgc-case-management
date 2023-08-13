

import axios from 'axios';
import initAuth from '@xavisoft/auth/frontend';
import { schemaList } from './reducer/schema';
import actions from './actions';


class AxiosError extends Error {

   toString() {
      return this.message;
   }

   constructor(msg, status) {
      super(msg);
      this.status = status;
   }
}

const request = axios.create({});


initAuth({
   axios: request,
});

request.interceptors.request.use(config => {

   if (process.env.NODE_ENV === 'development')
      config.url = `http://localhost:8081${config.url}`
   else if (window.cordova) {
      config.url = `${process.env.REACT_APP_BACKEND}${config.url}`
   }

   return config
})

request.interceptors.response.use(null, err => {

   if (err && err.response) {
      const msg = typeof err.response.data === 'string' ? err.response.data : err.response.statusText;;
      err = new AxiosError(msg, err.response.status);
   }

   throw err;
});

request.interceptors.response.use(null, err => {

   if (err.status === 401) {

      schemaList.forEach(Entity => {
         actions.setEntities(Entity, null);
      });

      window.App.redirect('/login');
   }

   throw err;
   
});


export default request;
