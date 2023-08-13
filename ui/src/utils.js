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
      closeOnEsc: false,
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


function objectToQueryString(obj={}) {
   return Object
      .keys(obj)
      .map(key => {
         return `${key}=${obj[key]}`
      }).join('&');
}

// function convertEpochToYYYYMMDD(epochTimestamp) {
//   const date = new Date(epochTimestamp);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}/${month}/${day}`;
// }

// function convertEpochToYYYYMMDD(epochTimestamp) {
//   const date = new Date(epochTimestamp);
//   const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
//   const formattedDate = date.toLocaleDateString(undefined, options).replace(/\//g, '-');
//   return formattedDate;
// }

function convertEpochToYYYYMMDD(epochTimestamp) {
   const date = new Date(epochTimestamp);
   const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
   const formattedDate = date.toLocaleDateString(undefined, options);
   return formattedDate
      .split('/')
      .reverse()
      .join('/');
}


function getMidnightTimestamp(date) {
   const d = new Date(date);
   d.setHours(0, 0, 0, 0);
   return d.getTime();
}


function ageRangeToWords(range) {

   if (range.charAt(0) === '<') {
      return `Under ${range.substring(1)}`
   } 

   const [ lo, hi ] = range.split('_');

   if (lo && hi)
      return `${lo} to ${hi}`
   
   const splitted = range.split('+');

   if (splitted.length === 2 && splitted[1] === '') {
      return `Over ${splitted[0]}`
   }

   throw new Error('Invalid range');

}


export {
   ageRangeToWords,
   convertEpochToYYYYMMDD,
   decodeJWT,
   delay,
   deleteAuthTokens,
   getAttributeFromElementHierachy,
   getMidnightTimestamp,
   objectToQueryString,
   requestConfirmation,
}