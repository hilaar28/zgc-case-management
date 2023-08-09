import { FormControl, FormLabel, Select } from "@chakra-ui/react";


export default function ChakraSelect(props) {


   const onChange = props.onChange || (() => {});
   let defaultSelection;

   if (props.allowDefaultEmptySelection) {
      defaultSelection = <option value="" disabled selected>
         {props.placeholder || ""}
      </option>
   }

   const dataProps = {};

   Object.keys(props).forEach(prop => {
      if (prop.indexOf('data-') === 0) {
         dataProps[prop] = props[prop];
      }
   });
   
   return <FormControl>
      <FormLabel className="text-gray-600 text-sm">{props.label}</FormLabel>
      <Select 
         type={props.type} 
         id={props.id} 
         value={props.value} 
         onChange={e => onChange(e.target.value)}
         {...dataProps}
      >
         {defaultSelection}
         {props.children}
      </Select>
   </FormControl>
}