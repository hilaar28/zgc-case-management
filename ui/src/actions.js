import { ACTION_TYPES } from "./constants";
import store from "./store";


function setCurrentRoute(route) {
   store.dispatch({
      type: ACTION_TYPES.SET_CURRENT_ROUTE,
      payload: route
   });
}

function setAuthenticated(authenticated=true) {
   store.dispatch({
      type: ACTION_TYPES.SET_AUTHENTICATED,
      payload: authenticated
   });
}

function setUser(user) {
   store.dispatch({
      type: ACTION_TYPES.SET_USER,
      payload: user,
   });
}

function openCaseEditor() {
   const action = {
      type: ACTION_TYPES.OPEN_CASE_EDITOR
   }

   store.dispatch(action);
}

function closeCaseEditor() {
   const action = {
      type: ACTION_TYPES.CLOSE_CASE_EDITOR
   }

   store.dispatch(action);
}


/**
 * 
 * @param {import("normalizr").schema.Entity} Entity 
 * @param {String | Number} _id 
 * @param {Object} updates 
 */
function updateEntity(Entity, _id, updates={}) {

   const action = {
      type: `update-${Entity.key}`,
      payload: { _id, updates }
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
 * @param {string|integer} _id 
 */
function deleteEntity(Entity, _id) {

   const action = {
      type: `delete-${Entity.key}`,
      payload: _id
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
   closeCaseEditor,
   deleteEntity,
   openCaseEditor,
   setAuthenticated,
   setCurrentRoute,
   setEntities,
   setUser,
   updateEntity,
}

export default actions;