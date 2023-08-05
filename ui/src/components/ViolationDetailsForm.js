import capitalize from "capitalize";
import { GENDER_VIOLATION_NATURE, VIOLATION_IMPACT, VIOLATION_NATURE } from "../backend-constants";
import ChakraAutoComplete from "./ChakraAutoComplete";
import ChakraCheckbox from "./ChakraCheckbox";
import ChakraSelect from "./ChakraSelect";
import ChakraTextBox from "./ChakraTextbox";


export default function ViolationDetailsForm(props) {

   // define fields
   const date = <ChakraTextBox
      id="txt-date"
      label="When did the violation happen?"
      type="date"
   />

   const continuing = <ChakraCheckbox
      id="txt-continuing"
      label="The violation is still continuing"
   />

   const nature = <ChakraSelect
      id="txt-nature"
      label="What's the nature of the violation?"
      allowDefaultEmptySelection
   >
      {
         Object.values(VIOLATION_NATURE)
            .map(value => {
               return <option key={value} value={value}>
                  {capitalize.words(value).replaceAll('_', ' ')}
               </option>
            })
      }
   </ChakraSelect>

   const natureGender = <ChakraSelect
      id="txt-nature-gender"
      label="What's the nature of the gender violation?"
      allowDefaultEmptySelection
   >
      {
         Object.values(GENDER_VIOLATION_NATURE)
            .map(value => {
               return <option key={value} value={value}>
                  {capitalize.words(value).replaceAll('_', ' ')}
               </option>
            })
      }
   </ChakraSelect>

   const details = <ChakraTextBox
      id="txt-details"
      label="Describe what happened in detail"
      multiline
   />

   const location = <ChakraTextBox
      id="txt-location"
      label="Where did it happen?"
   />

   const witnessDetails = <ChakraTextBox
      id="txt-witness-details"
      label="If someone witnessed the incidented, provide their details here"
      multiline
   />

   const impact = <ChakraAutoComplete
      id="txt-impact"
      label="How did the incident impact?"
      freeSolo
      items={
         Object
            .values(VIOLATION_IMPACT)
            .map(value => ({ 
               value, 
               caption: capitalize.words(value).replaceAll('_', ' '),
            }))
      }
   />

   // create form
   let form

   if (props.electoral) {
      form = <div className="grid grid-cols-2 gap-6">
         {details}
         {impact}
         {nature}
         {natureGender}
      </div>
   } else {
      form = <div className="grid grid-cols-2 gap-6">
         {date}
         {natureGender}
         {continuing}
         {location}
         {witnessDetails}
         {details}
      </div>
   }

   return form
}