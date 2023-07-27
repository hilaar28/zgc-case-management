

function _flattenDocumentUpdate({ result, level='', obj }) {

   for (let key in obj) {
      const value = obj[key];
      key = `${level}${key}`;

      if (typeof value === 'object') {
         _flattenDocumentUpdate({
            result,
            level: `${key}.`,
            obj: value,
         });
      } else {
         result[key] = value;
      }
   }

}
function flattenDocumentUpdate(update) {
   
   const result = {};
   _flattenDocumentUpdate({ result, obj: update });
   return result;
}

module.exports = {
   flattenDocumentUpdate,
}