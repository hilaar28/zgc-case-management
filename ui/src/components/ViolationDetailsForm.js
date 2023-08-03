import ChakraCheckbox from "./ChakraCheckbox";
import ChakraSelect from "./ChakraSelect";
import ChakraTextBox from "./ChakraTextbox";


export default function ViolationDetailsForm(props) {

   // define fields
   const date = <ChakraTextBox
      id="txt-date"
      label="When did the violation happen?"
   />

   const continuing = <ChakraCheckbox
      id="txt-continuing"
      label="The violation is still continuing"
   />

   const nature = <ChakraSelect
      id="txt-nature"
      label="What's the nature of the violation?"
   >
   </ChakraSelect>

   const natureGender = <ChakraSelect
      id="txt-nature-gender"
      label="What's the nature of the gender violation?"
   >
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

   const impact = <ChakraSelect
      id="txt-impact"
      label="How did the incident impact?"
   >

   </ChakraSelect>

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
         {continuing}
         {location}
         {witnessDetails}
         {details}
      </div>
   }

   return form
}