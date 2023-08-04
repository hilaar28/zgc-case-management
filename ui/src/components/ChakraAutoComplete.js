import { FormControl, FormLabel } from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";


export default function ChakraAutoComplete(props) {

   // AutoCompleteInput props
   const autoCompleteInputProps = {}

   if (props.id)
      autoCompleteInputProps.id = props.id;
   if (props.value)
      autoCompleteInputProps.value = props.value;

   const onChange = props.onChange || (() => {});


   return <FormControl>

      <FormLabel className="text-gray-600 text-sm">{props.label}</FormLabel>

      <AutoComplete 
         freeSolo={props.freeSolo}
         openOnFocus
      >
         <AutoCompleteInput 
            {...autoCompleteInputProps}
            onChange={e => onChange(e.target.value)}
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