import { combineReducers } from "redux";
import { EntityUpdate, schemaList } from "./schema";


function deepCopy(object) {

   if (!object)
      return object;

   if (Array.isArray(object))
      return object.map(item => deepCopy(item));

   if (typeof object === 'object') {
      const newObject = {}

      for (let key in object) {
         newObject[key] = deepCopy(object[key])
      }

      return newObject;
   }

   return object;

}

function updateReducer(entities, payload) {

   const { _id, updates } = payload
   const updatedEntity = entities[_id]

   let setters = {}, pushes = {}, filters = {};

   if (updates instanceof EntityUpdate) {
      setters = updates.getSetAttributes();
      pushes = updates.getArrayPushes();
      filters = updates.getArrayFilters();
   } else {
      setters = updates;
   }

   Object.keys(setters).forEach(attr => {
      updatedEntity[attr] = setters[attr]
   });

   Object.keys(pushes).forEach(attr => {
      const value = pushes[attr]
      updatedEntity[attr].push(value);
   });

   Object.keys(filters).forEach(attr => {
      updatedEntity[attr] = updatedEntity[attr].filter(filters[attr]);
   });

   entities[_id] = updatedEntity;

   return entities;
}

/**
 * 
 * @param {import("normalizr").schema.Entity} Entity 
 * @returns 
 */

function createEntityReducer(Entity) {

   return function entityReducer(entities=null, action) {

      entities = deepCopy(entities);

      switch (action.type) {
         case `add-${Entity.key}`:
            const { _id:newEntityId } = action.payload
            entities = { ...entities, [newEntityId]: action.payload }
            return entities

         case `update-${Entity.key}`:
            return updateReducer(entities, action.payload);

         case `delete-${Entity.key}`:
            const idBeingDeleted = action.payload
            delete entities[idBeingDeleted];
            entities = { ...entities }
            return entities;

         case `set-${Entity.key}`:
            return action.payload;
      
         default:
            return entities;
      }

   }
}

const reducers = {};

schemaList.forEach(Entity => {
   reducers[Entity.key] = createEntityReducer(Entity);
});


const entitiesReducer = combineReducers(reducers);

export default entitiesReducer;