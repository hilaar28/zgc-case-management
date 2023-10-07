
function deepFreezeObject(obj) {

   if (typeof obj === 'object') {

      for (let key in obj) {
         obj[key] = deepFreezeObject(obj[key]);
      }

      obj = Object.freeze(obj);
   }
   
   return obj;
}

module.exports = {
   deepFreezeObject
}