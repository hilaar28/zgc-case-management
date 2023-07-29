import { ACTION_TYPES } from "./constants";
import store from "./store";


function setCurrentRoute(route) {
   store.dispatch({
      type: ACTION_TYPES.SET_CURRENT_ROUTE,
      payload: route
   });
}

function setAutheticated(authenticated=true) {
   store.dispatch({
      type: ACTION_TYPES.SET_AUTHENTICATED,
      payload: authenticated
   });
}

/**
 * 
 * @param {import("normalizr").schema.Entity} Entity 
 * @param {String | Number} id 
 * @param {Object} updates 
 */
function updateEntity(Entity, id, updates={}) {

   const action = {
      type: `update-${Entity.key}`,
      payload: { id, updates }
   }

   store.dispatch(action);

}

/**
 * 
 * @param {import("normalizr").schema.Entity} Entity 
 * @param {object} entity 
 */
function addEntity(Entity, entity) {

   const action = {
      type: `add-${Entity.key}`,
      payload: entity
   }

   store.dispatch(action);
   
}


/**
 * 
 * @param {import("normalizr").schema.Entity} Entity 
 * @param {string|integer} id 
 */
function deleteEntity(Entity, id) {

   const action = {
      type: `delete-${Entity.key}`,
      payload: id
   }

   store.dispatch(action);
   
}


/**
 * 
 * @param {import("normalizr").schema.Entity} Entity 
 * @param {Array<Object>} entities
 */
function setEntities(Entity, entities) {

   const action = {
      type: `set-${Entity.key}`,
      payload: entities
   }

   store.dispatch(action);
   
}


const actions = {
   addEntity,
   deleteEntity,
   setAutheticated,
   setCurrentRoute,
   setEntities,
   updateEntity,
}

export default actions;