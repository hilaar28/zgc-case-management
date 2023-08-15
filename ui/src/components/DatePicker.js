

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker(props) {

   return <ReactDatePicker
      selected={props.value}
      onChange={props.onChange}
      className="bg-gray-50 rounded border-solid border-[1px] border-[#ccc] px-2 py-1 text-gray-600"
      placeholderText={props.placeholder || 'yyyy/mm/dd'}
      dateFormat="yyyy/MM/dd"
      todayButton
      minDate={props.min}
      maxDate={props.max}
   />
}