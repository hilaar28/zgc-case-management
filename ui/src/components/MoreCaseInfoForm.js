
import ChakraCheckbox from "./ChakraCheckbox";
import ChakraTextBox from "./ChakraTextbox";
import { Divider } from "@chakra-ui/react";


export default function MoreCaseInfoForm(props) {


   // define fields
   const whyViolationIsImportantToOurMandate = <ChakraTextBox
      id="txt-why-violation-is-important-to-our-mandate"
      label="Why you think the act or omission detailed above constitutes a barrier prejudicial to gender equality, gender equity or gender mainstreaming?"
      multiline
   />

   const expectationsFromUs = <ChakraTextBox
      id="txt-expectations-from-us"
      label="What remedy you are expecting to get from the ZGC?"
      multiline
   />

   const lawyerDetails = <ChakraTextBox
      id="txt-lawyer-details"
      label="Your lawyer details in this case"
      multiline
   />

   const language = <ChakraTextBox
      id="txt-language"
      label="What language do you prefer to be assisted in?"
   />

   const whoReferredYouToUs = <ChakraTextBox
      id="txt-who-referred-you-to-us"
      label="Who referred you to us?"
   />

   const evidence = <ChakraTextBox
      id="txt-evidence"
      label="Picture or video evidence"
      type="file"
      multiple
   />

   const moreAssistanceRequired = <ChakraTextBox
      id="txt-more-assistance-required"
      label="Do you need assistance with anything else?"
      multiline
   />

   const otherEntityReportedToDetails = <ChakraTextBox
      id="txt-other-entity-reported-to-details"
      label="Institution name, contact person, and contact details"
      multiline
      data-source-target-attribute="other_entity_reported_to.details"
   />

   const otherEntityReportedToActions = <ChakraTextBox
      id="txt-other-entity-reported-to-actions"
      label="What did they do to help?"
      multiline
      data-source-target-attribute="other_entity_reported_to.actions"
   /> 

   const otherEntityReportedToWhyReportingToUsAsWell = <ChakraTextBox
      id="txt-other-entity-reported-to-why-reporting-to-us-as-well"
      label="Why are you reporting to us as well"
      multiline
      data-source-target-attribute="other_entity_reported_to.why_reporting_to_us_as_well"
   />


   const haveReportedToThirdParty = props.haveReportedToThirdParty;

   const iHaveReportedToOtherEntity = <ChakraCheckbox
      checked={haveReportedToThirdParty}
      onChange={props.onHaveReportedToThirdPartyChanged}
      label="I have reported this case to another party"
   />

   // create form
   let form;

   if (props.electoral) {
      form = <div className="grid grid-cols-2 gap-6">
         {evidence}
         {moreAssistanceRequired}
      </div>
   } else {

      let thirdPartyFields;

      if (haveReportedToThirdParty) {
         thirdPartyFields = <div className="grid grid-cols-2 gap-6">
            {otherEntityReportedToDetails}
            {otherEntityReportedToActions}
            {otherEntityReportedToWhyReportingToUsAsWell}
         </div>
      }

      form = <>
         <div className="grid grid-cols-2 gap-6">
            {whyViolationIsImportantToOurMandate}
            {expectationsFromUs}
            {lawyerDetails}
            {language}
            {whoReferredYouToUs}


         </div>

         
         <Divider className="my-5" />

         <div className="text-sm font-bold text-gray-600">
            THIRDY PARTY INSITUTION REPORTED TO
         </div>
         <div className="my-5">
            {iHaveReportedToOtherEntity}
         </div>
         {thirdPartyFields}
      </>
   }

   return form;
}