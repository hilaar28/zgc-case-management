import { FormControl, FormLabel, Select } from "@chakra-ui/react";


export default function ChakraSelect(props) {


   const onChange = props.onChange || (() => {})
   
   return <FormControl>
      <FormLabel className="text-gray-600 text-sm">{props.label}</FormLabel>
      <Select 
         type={props.type} 
         id={props.id} 
         children={props.children} 
         value={props.value} 
         onChange={e => onChange(e.target.value)} />
   </FormControl>
}