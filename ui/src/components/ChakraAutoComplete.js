import { FormControl, FormLabel } from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";


export default function ChakraAutoComplete(props) {

   // AutoCompleteInput props
   const autoCompleteInputProps = {}

   if (props.id)
      autoCompleteInputProps.id = props.id;
   if (props.value)
      autoCompleteInputProps.value = props.value;

   const dataProps = {};

   Object.keys(props).forEach(prop => {
      if (prop.indexOf('data-') === 0) {
         dataProps[prop] = props[prop];
      }
   });

   const onChange = props.onChange || (() => {});
   
   return <FormControl>

      <FormLabel className="text-gray-600 text-sm">{props.label}</FormLabel>

      <AutoComplete 
         freeSolo={props.freeSolo}
         openOnFocus
         onSelectOption={e => onChange(e.item.value)}
      >
         <AutoCompleteInput 
            {...autoCompleteInputProps}
            {...dataProps}
            onChange={e => onChange(e.target.value)}
            className={props.disabled ? 'opacity-50 pointer-events-none' : ''}
            placeholder={props.placeholder}
         />
         <AutoCompleteList>
            {props.items.map(({ caption, value }) => (
               <AutoCompleteItem
                  key={value}
                  value={value}
               >
                  {caption}
               </AutoCompleteItem>
            ))}
         </AutoCompleteList>
      </AutoComplete>
   </FormControl>
}