import { Checkbox } from "@chakra-ui/react";


export default function ChakraCheckbox(props) {


   const onChange = props.onChange || (() => {})
   
   return <div className="v-align">
      <Checkbox 
         type={props.type} 
         id={props.id} 
         value={props.value} 
         onChange={e => onChange(e.target.checked)}
         checked={props.checked}
      />
      
      <span className="inline-block text-gray-600 text-sm ml-2">{props.label}</span>
   </div>
}