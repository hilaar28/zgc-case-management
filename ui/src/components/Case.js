import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import Component from "@xavisoft/react-component";
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";


function InfoPiece(props) {
   return <div className="mr-5 inline-block">
      <span className="text-sm text-gray-500 font-bold uppercase">
         {props.label}:
      </span>
      <span className="text-sm text-gray-500 inline-block ml-2">
         {props.info}
      </span>
   </div>
}


function SectionTitle(props) {
   return <div className="text-gray-600 text-sm font-bold">
      {props.children}
   </div>
}

function Section(props) {

   return <div>
      <SectionTitle>
         {props.title}
      </SectionTitle>
      
      <p className="text-sm">
         {props.children}
      </p>

      {props.body}

      <Divider className="my-5" />

   </div>
}


function PersonalDetails(props) {

   const details = { ...props.details };

   const { name, surname, national_id } = details;
   delete details.name;
   delete details.surname;
   delete details.national_id;

   return <div className="p-3">
      <h2 className="bg-orange-600 text-white font-bold text-xs p-3 rounded-t-xl">
         {props.title}
      </h2>

      <div className="px-1">
         <div className="capitalize text-xl font-bold mt-3">
            {name} {surname}
         </div>

         <div className="uppercase text-xl font-bold text-gray-600">
            {national_id}
         </div>

         <div className="inline-grid grid-cols-2 gap-x-2 gap-y-[5px] my-2">
            {
               Object.keys(details)
                  .map(key => {
                     return <>
                        <div className="uppercase text-gray-500 font-bold text-sm">
                           {key.replaceAll('_', ' ')}
                        </div>

                        <div className="text-gray-500">
                           {details[key]}
                        </div>
                     </>
                  })
            }
         </div>
      </div>
   </div>
}


export default class Case extends Component {

   state = {
      case_: null,
   }

   fetchData = async () => {

      try {

         showLoading();

         const res = await request.get(`/api/cases/${this.props._id}`);
         const case_ = res.data;

         this.updateState({ case_ });
         console.log(case_)

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {
      this.fetchData();
   }

   render() {

      let dialogContent;

      if (this.state.case_) {

         // personal details
         const { victim, applicant, defendant } = this.state.case_;

         const applicantDetails = <PersonalDetails
            title="APPLICANT"
            details={applicant}
         />

         const defendantDetails = <PersonalDetails
            title="DEFENDANT"
            details={defendant}
         />

         let victimDetails;

         if (victim) {
            victimDetails = <PersonalDetails
               title="VICTIM"
               details={victim}
            />
         }

         // violation section
         const { violation } = this.state.case_;
         const { witness_details } = violation;

         let witnessDetails;

         if (witness_details) {
            witnessDetails = <div className="grid grid-cols-[auto,1fr] gap-6">
               <span className="text-gray-500 font-bold text-xs">
                  WITNESS DETAILS:
               </span>
               <p className="text-xs text-gray-600">
                  {witness_details}
               </p>
            </div>
         }

         let violationDates;

         if (violation.date) {
            
            let info;

            if (Array.isArray(violation.date)) {
               if (violation.date.length > 0) {
                  info = violation.date.join(', ');
               }
            } else {
               info = violation.date;
            }

            if (info) {
               violationDates = <InfoPiece
                  label="DATE(S)"
                  info={info}
               />
            }
         }

         let violationLocation;

         if (violation.location) {
            violationLocation = <InfoPiece
               label="LOCATION"
               info={violation.location}
            />
         }

         const violationSectionBody = <>
            <p className="text-sm my-3 text-gray-600 mb-3">
               {violation.details}
            </p>


            {witnessDetails}

            <div className="my-3">
               {violationDates}
               {violationLocation}

               <InfoPiece
                  label="Still continuing"
                  info={violation.continuing ? 'YES' : 'NO'}
               />
            </div>

         </>

         const violationSection = <Section
            title="VIOLATION"
            body={violationSectionBody}
         />

         // other-entity-reported-to section
         const { other_entity_reported_to } = this.state.case_
         let otherEntityReportedToSection;

         if (other_entity_reported_to) {

            const { details, actions, why_reporting_to_us_as_well } = other_entity_reported_to;

            let actionsJSX;

            if (actions) {
               actionsJSX = <div className="grid grid-cols-[auto,1fr]">
                  <span className="text-gray-600 font-bold pr-3">
                     ACTIONS:
                  </span>
                  <p className="text-xs">
                     {actions}
                  </p>
               </div>
            }

            let whyReportingToUsJSX;

            if (why_reporting_to_us_as_well) {
               whyReportingToUsJSX = <>
                  <div className="text-lg font-bold text-gray-600">
                     WHY REPORTING TO US AS WELL
                  </div>
                  <p className="text-sm">
                     {why_reporting_to_us_as_well}
                  </p>
               </>
            }

            const body = <>
               <p className="text-sm">
                  {details}
               </p>

               {actionsJSX}
               {whyReportingToUsJSX}
            </>

            otherEntityReportedToSection = <Section
               title="OTHER PARTY REPORTED TO"
               body={body}
            />
         }

         // language and lawyer details sections
         const { lawyer_details, language } = this.state.case_;

         let lawyerDetailsSection;

         if (lawyer_details) {
            lawyerDetailsSection = <Section title='LAWYER DETAILS'>
               {lawyer_details}
            </Section>
         }

         let languageSection;

         if (language) {
            languageSection = <Section title='PREFERRED LANGUAGE'>
               {language}
            </Section>
         }

         dialogContent = <div>

            <h1 className="text-3xl text-gray-700 font-extrabold">
               {this.state.case_.title}
            </h1>

            <div className="v-align mt-5">
               <span className="font-bold text-lg pr-2">
                  Case No
               </span>
               <span className="text-sm text-gray-600">
                  {this.state.case_._id}
               </span>

               <span className="text-white bg-orange-600 text-xs px-3 py-1 font-bold rounded-lg inline-block ml-5">
                  {this.state.case_.status.replaceAll('_', ' ')}
               </span>

               <span className="text-gray-600 bg-gray-100 text-xs px-3 py-1 font-bold rounded-lg inline-block ml-5">
                  {this.state.case_.source.replaceAll('_', ' ')}
               </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-5">
               {applicantDetails}
               {victimDetails}
               {defendantDetails}

            </div>

            <Divider className="my-5" />

            {violationSection}
            {otherEntityReportedToSection}
            {lawyerDetailsSection}
            {languageSection}


         </div>
      } else {
         dialogContent = <div className="h-full vh-align">
            <div className="w-[300px]">
               <p className="text-lg text-gray-600">
                  Failed to load case data
               </p>

               <Button onClick={this.fetchData}>
                  RETRY
               </Button>
            </div>
         </div>
      }

      return <Dialog open fullScreen>

         <DialogTitle>
            <b>Case #</b><span className="text-gray-600">{this.props._id}</span>
         </DialogTitle>

         <DialogContent dividers>
            {dialogContent}
         </DialogContent>

         <DialogActions>
            <Button onClick={this.props.close}>
               CLOSE
            </Button>
         </DialogActions>
      </Dialog>
   }
}