const { FormControl, FormLabel, Input, Textarea } = require("@chakra-ui/react");


export default function ChakraTextBox(props) {

   const InputComponent = props.multiline ? Textarea : Input;
   const onChange = props.onChange || (() => {})

   return <FormControl>
      <FormLabel className="text-gray-600 text-sm">{props.label}</FormLabel>
      <InputComponent 
         type={props.type} 
         id={props.id}
         value={props.value}
         multiple={props.multiple}
         onChange={e => onChange(e.target.value)}
      />
   </FormControl>
}