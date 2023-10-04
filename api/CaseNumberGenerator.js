const Case = require("./db/Case");
const logger = require("./logger");



class CaseNumberGenerator {

   static _initialized = false;
   static _currentNumber = null;
   static _currentYear = null;

   static getCurrentYear(now=new Date()) {

      const year = now.toLocaleString('en-US', { 
         timeZone: 'Europe/Paris', 
         year: 'numeric' 
      });

      return parseInt(year);

   }

   static async generate() {

      if (!this.isInitialized())
         throw new Error("Case number generator not yet initialized");

      // get year
      const fullYear = this.getCurrentYear();

      if (fullYear != this._currentYear) {
         // reset count if the year just changed
         this._currentYear = fullYear;
         this._currentNumber = 1;
      }

      const year = fullYear % 1000;

      return `ZGC/${this._currentNumber}/${year}`;
   }

   static increment() {
      this._currentNumber++;
   }

   static decrement() {
      this._currentNumber--;
   }

   static isInitialized() {
      return this._initialized;
   }

   static async init() {

      const date = new Date();
      const originalDate = new Date(date);

      // Set the month and day to January 1st
      date.setUTCMonth(0);
      date.setUTCDate(1);
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);

      // Adjust the hours for GMT+2
      date.setUTCHours(date.getUTCHours() + 2);

      const count = await Case
         .countDocuments()
         .where({
            createdAt: {
               $gte: date
            }
         });

      this._currentNumber = count + 1;
      this._initialized = true;

      // we're passing the date just in case the year changed 
      // between the creation of the date object and the
      // completion of  the query. We would like this to reflect
      // the year of the date used in the query
      this._currentYear = this.getCurrentYear(originalDate); 

   }
}


module.exports = CaseNumberGenerator;