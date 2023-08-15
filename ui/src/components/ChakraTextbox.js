const { FormControl, FormLabel, Input, Textarea } = require("@chakra-ui/react");


export default function ChakraTextBox(props) {

   const InputComponent = props.multiline ? Textarea : Input;
   const onChange = props.onChange || (() => {});

   const dataProps = {};

   Object.keys(props).forEach(prop => {
      if (prop.indexOf('data-') === 0) {
         dataProps[prop] = props[prop];
      }
   });

   return <FormControl>
      <FormLabel className="text-gray-600 text-sm">{props.label}</FormLabel>
      <InputComponent 
         type={props.type} 
         id={props.id}
         value={props.value}
         multiple={props.multiple}
         min={props.min}
         max={props.max}
         onChange={e => onChange(e.target.value)}
         {...dataProps}
      />
   </FormControl>
}