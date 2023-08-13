import Component from "@xavisoft/react-component";
import { css } from '@emotion/css';
import { v4 as uuid } from 'uuid';

const months = [];

for (let i = 1; i <= 12; i++)
   months.push(i);


const selectContainerStyle = css({
   '&>select': {
      padding: '2px 10px',
      border: '1px solid #ccc',
      borderRadius: 5
   },
   '&>select:not(:first-child)': {
      marginLeft: 10,
   },
})

export default class DateInput extends Component {

   id = 'txt-' + uuid();
   txtYearId = 'txt-' + uuid();
   txtMonthId = 'txt-' + uuid();
   txtDayId = 'txt-' + uuid();

   state = {
      maxDay: 0,
   }

   getNumberOfDaysInAMonth(month, year) {
      
      if (month === 2) {
         return year % 4 === 0 ? 29 : 28;
      } else if (month <= 7) {
         return month % 2 === 0 ? 30 : 31;
      } else {
         return month % 2 === 0 ? 31 : 30;
      }
   }

   onChange = async (event) => {

      // determine max number of days in the month
      const txtYear = document.getElementById(this.txtYearId);
      const txtMonth = document.getElementById(this.txtMonthId);
      const txtDay = document.getElementById(this.txtDayId);

      const year = parseInt(txtYear.value) || 0;
      const month = parseInt(txtMonth.value) || 0;
      let day = parseInt(txtDay.value) || 0;

      if (!event || event.target.id !== this.txtDayId) {

         let maxDay;

         if (year && month) {
            maxDay = this.getNumberOfDaysInAMonth(month, year);
            day = Math.min(day, maxDay);
         } else {
            day = '';
            maxDay = 0;
         }

         await this.updateState({ maxDay });
         txtDay.value = day;

      }

      // fire onchange event
      let value = {}

      if (year)
         value.year = year;
   
      if (month)
         value.month = month;

      if (day)
         value.day = day;

      if (Object.keys(value).length === 0)
         value = undefined;

      if (typeof this.props.onChange === 'function') {
         this.props.onChange(value);
      }

      // set value to the container
      const elem = document.getElementById(this.props.id || this.id);
      elem.value = {
         value,
         ignore: true,
      };

   }

   componentDidMount() {
      
      try {

         const elem = document.getElementById(this.props.id || this.id);

         Object.defineProperty(elem, 'value', {
            get: function() {
               return this.__value;
            },
            set: (v) => {

               if (v && v.ignore) {
                  elem.__value = v.value;
               } else {

                  const {
                     year='',
                     month='',
                     day='',
                  } = v || {};

                  document.getElementById(this.txtYearId).value = year;
                  document.getElementById(this.txtMonthId).value = month;
                  document.getElementById(this.txtDayId).value = day;

                  this.onChange();
               }
               
            }
         });
      } catch (err) {
         console.log(err);
      }

   }

   render() {

      const thisYear = new Date().getFullYear();
      const years = [];
      
      for (let i = thisYear; i >= thisYear - 20; i--)
         years.push(i);

      const days = [];
      
      for (let i = 1; i <= this.state.maxDay; i++)
         days.push(i);

      return <div id={this.props.id || this.id} data-input>
         <span className="text-gray-600 text-sm">{this.props.label}</span>
         <div
            className={selectContainerStyle}
         >
            <select id={this.txtYearId} onChange={this.onChange}>
               <option></option>
               {
                  years.map(value => {
                     return <option key={value} value={value}>
                        {value}
                     </option>
                  })
               }
            </select>

            <select id={this.txtMonthId} onChange={this.onChange}>
               <option></option>
               {
                  months.map(value => {
                     return <option key={value} value={value}>
                        {value}
                     </option>
                  })
               }
            </select>

            <select id={this.txtDayId} onChange={this.onChange}>
               <option></option>
               {
                  days.map(value => {
                     return <option key={value} value={value}>
                        {value}
                     </option>
                  })
               }
            </select>

         </div>
      </div>
   }
}
