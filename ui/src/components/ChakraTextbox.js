import { FormControl, FormLabel } from "@chakra-ui/react";


export default function ChakraTextBox(props) {

   const onChange = props.onChange || (() => {});

   const dataProps = {};

   Object.keys(props).forEach(prop => {
      if (prop.indexOf('data-') === 0) {
         dataProps[prop] = props[prop];
      }
   });

   let input;
   if (props.multiline) {
      input = <textarea
         type={props.type} 
         id={props.id}
         value={props.value}
         multiple={props.multiple}
         min={props.min}
         max={props.max}
         onChange={e => onChange(e.target.value)}
         placeholder={props.placeholder}
         className="w-full p-2 border border-gray-300 rounded"
         {...dataProps}
      />
   } else {
      input = <input 
         type={props.type} 
         id={props.id}
         value={props.value}
         multiple={props.multiple}
         min={props.min}
         max={props.max}
         onChange={e => onChange(e.target.value)}
         placeholder={props.placeholder}
         className="w-full p-2 border border-gray-300 rounded"
         {...dataProps}
      />
   }

   return <FormControl>
      <FormLabel className="text-gray-600 text-sm">{props.label}</FormLabel>
      {input}
   </FormControl>
}
