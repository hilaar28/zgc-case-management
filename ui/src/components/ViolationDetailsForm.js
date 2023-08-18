import capitalize from "capitalize";
import { AGE_RANGES, VIOLATION_IMPACT } from "../backend-constants";
import ChakraCheckbox from "./ChakraCheckbox";
import ChakraSelect from "./ChakraSelect";
import ChakraTextBox from "./ChakraTextbox";
import DateInput from "./DateInput";
import { ageRangeToWords, ageToAgeRange } from "../utils";
import ViolationNatureInput from "./ViolationNatureInput";
import SelectOrType from "./SelectOrType";
import { Divider } from "@chakra-ui/react";


export default function ViolationDetailsForm(props) {

   // define fields
   const date = <DateInput
      id="txt-date"
      label="When did the violation happen?"
      max={new Date()}
      onChange={
         (date) => {

            if (!props.victimDOB)
               return;
            if (!date)
               return;

            const txtVictimAgeRange = document.getElementById('txt-victim-age-range'); 
            if (!txtVictimAgeRange)
               return;

            let { year, month=1, day=1 } = date;
            month = month - 1;

            const violationDate = new Date(year, month, day);
            const dob = new Date(props.victimDOB);
            const age = violationDate.getFullYear() - dob.getFullYear();
            const ageRange = ageToAgeRange(age);
            txtVictimAgeRange.value = ageRange;
         }
      }
   />

   const victimAgeRange = <ChakraSelect
      id="txt-victim-age-range"
      label="Complainant age at time of incident"
      allowDefaultEmptySelection
   >
      {
         AGE_RANGES
            .map(value => {
               return <option key={value} value={value}>
                  {ageRangeToWords(value)}
               </option>
            })
      }
   </ChakraSelect>

   const continuing = <ChakraCheckbox
      id="txt-continuing"
      label="The violation is still continuing"
   />

   const natures = <div className="my-6">

      <div className="text-sm font-bold text-gray-600 mt-6 mb-2">
         NATURE OF THE VIOLATION
      </div>
      <ViolationNatureInput
         id="txt-natures"
      />

   </div>

   const details = <ChakraTextBox
      id="txt-details"
      label="Describe what happened in detail"
      multiline
   />

   const location = <ChakraTextBox
      id="txt-location"
      label="Where did it happen?"
   />

   const witnessDetails = <div className="mt-6">
      <div className="text-sm font-bold text-gray-600 mt-6 mb-2">
         WITNESS
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div>
            <ChakraTextBox
               id="txt-witness-details"
               label="Name and contact info"
               data-source-target-attribute="witness.details"
               multiline
            />

            <div className="mt-5">
               <ChakraCheckbox
                  id="txt-witness-anonymity"
                  label="Keep these details anonymous"
                  data-source-target-attribute="witness.anonymous"
               />
            </div>
         </div>
      </div>
   </div>

   const impact = <SelectOrType
      id="txt-impact"
      label="Incident impact"
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
      form = <>
         {natures}
         <div className="grid grid-cols-2 gap-6">
            {victimAgeRange}
            {details}
            {impact}
         </div>
      </>
   } else {
      form = <>

         {natures}

         <Divider className="my-6" />

         <div className="text-sm font-bold text-gray-600 mt-6 mb-2">
            OTHER DETAILS
         </div>

         <div className="grid grid-cols-2 gap-6">
            {date}
            {victimAgeRange}
            {impact}
            {continuing}
            {location}
            {details}
         </div>

         <Divider className="my-6" />

         {witnessDetails}

      </>
   }

   return form
}