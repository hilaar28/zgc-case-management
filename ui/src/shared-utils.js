
export const deepFreezeObject = (obj) => {
   Object.keys(obj).forEach(prop => {
      if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop]))
         deepFreezeObject(obj[prop]);
   });
   return Object.freeze(obj);
}
