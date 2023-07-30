
import { schema } from 'normalizr';


const opt = { idAttribute: '_id' }

// users
export const User = new schema.Entity('users', {}, opt);

// case updates
export const CaseUpdate = new schema.Entity('case_updates', {}, opt);

// cases
export const Case = new schema.Entity('cases', {
   updates: [ CaseUpdate ],
}, opt);



export const CaseList = [ Case ];
export const UserList = [ User ];

export const schemaList = [
   Case,
   CaseUpdate,
   User,
]


export class EntityUpdate {

   _filters = {}
   _pushes = {}
   _setters = {}

   /**
    * 
    * @param {string} attr 
    * @param {function} func 
    */
   addArrayFilter(attr, func) {

      if (typeof func !== 'function')
         throw new Error('"func" should be a function')

      this._filters[attr] = func;
   }

   /**
    * 
    * @param {string} attr 
    * @param {any} value 
    */
   addToArray(attr, value) {
      this._pushes[attr] = value;
   }

   /**
    * 
    * @param {string} attr 
    * @param {any} value 
    */
   setAttribute(attr, value) {
      this._setters[attr] = value;
   }

   getArrayPushes() {
      return this._pushes;
   }

   getSetAttributes() {
      return this._setters;
   }

   getArrayFilters() {
      return this._filters;
   }

}