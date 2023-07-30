import swal from "sweetalert";
import { LOCAL_STORAGE_KEY } from "@xavisoft/auth/constants";

function requestConfirmation({
   question,
   confirmButtonCaption='Yes',
   cancelButtonCaption="Cancel",
}) {
   return swal({
      text: question,
      buttons: [
         {
            text: confirmButtonCaption,
            value: true,
            className: "bg-red-600 text-white",
            visible: true,
         },
         {
            text: cancelButtonCaption,
            value: false,
            visible: true,
            className: "bg-white primary-text"
         }
      ],
      closeOnClickOutside: false,
   });
}

function getAttributeFromElementHierachy(target, attr) {

   let attribute = target.getAttribute(attr);

   while (!attribute) {
      target = target.parentElement;

      if (!target)
         break;

      attribute = target.getAttribute(attr);

   }

   return attribute;
}


function deleteAuthTokens() {
   window.localStorage.removeItem(LOCAL_STORAGE_KEY);
}

function decodeJWT(token) {
   var base64Url = token.split('.')[1];
   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));

   return JSON.parse(jsonPayload);
}

function delay(millis) {
   return new Promise(resolve => {
      setTimeout(resolve, millis)
   });
}

export {
   decodeJWT,
   delay,
   deleteAuthTokens,
   getAttributeFromElementHierachy,
   requestConfirmation,
}