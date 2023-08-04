
import Component from '@xavisoft/react-component';
import { connect } from 'react-redux';
import { Button } from '@chakra-ui/react';
import actions from '../actions';
import PersonalDetailsForm from './PersonalDetailsForm';
import { ChakraProvider, Divider } from '@chakra-ui/react';
import ChakraStepper from './ChakraStepper';
import ChakraSelect from './ChakraSelect';
import capitalize from 'capitalize';
import { errorToast, successToast } from '../toast';
import ChakraCheckbox from './ChakraCheckbox';
import ViolationDetailsForm from './ViolationDetailsForm';
import ChakraTextBox from './ChakraTextbox';
import { CASE_SOURCES, PROVINCES } from '../backend-constants';
import MoreCaseInfoForm from './MoreCaseInfoForm';
import swal from 'sweetalert'
import { hideLoading, showLoading } from '../loading'
import request from '../request';
import { Case as CaseSchema } from '../reducer/schema';


function removeEmptyProperties(data) {

   if (Array.isArray(data)) {
      data.forEach(item => {
         removeEmptyProperties(item);
      });

      return;
   }

   if (typeof data !== 'object')
      return;

   Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (!value)
         delete data[key];
      else
         removeEmptyProperties(value);

   });

}

// helpers
async function getFilesData(files) {
  const filesData = [];

  for (const file of files) {
    const fileReader = new FileReader();
    const ext = file.name.split('.').pop().toLowerCase();

    // Read the contents of the file as a base64-encoded string
    const base64Data = await new Promise((resolve, reject) => {
      fileReader.onload = () => resolve(fileReader.result.split(',')[1]);
      fileReader.onerror = reject;
      fileReader.readAsDataURL(file);
    });

    // Add the file data to the array
    filesData.push({ ext, base64Data });
  }

  return filesData;
}

// constants
const steps = [
   { title: 'Applicant', _description: 'Information about the person reporting the case' },
   { title: 'Victim', _description: 'Information about the victim' },
   { title: 'Defendant', _description: 'Information about the person/insitution being accused' },
   { title: 'Violation', _description: 'Details about the violation' },
   { title: 'More', }
]

const CASE_TYPES = {
   GENERAL: 'general',
   ELECTORAL: 'electoral',
}


const defaultState = {
   stage: 1,
   caseType: CASE_TYPES.GENERAL,
   applicant: null,
   victim: null,
   defendant: null,
   violation: null,
   other: null,
   applicantIsVictim: false,
   title: '',
   source: '',
   province: '',
}


class UnconnectedCaseEditor extends Component {

   state = defaultState

   resetEditor = () => {
      return this.updateState(defaultState);
   }

   retrievePersonalDetails = () => {

      // presense check
      const txtName = document.getElementById('txt-name');
      const txtSurname = document.getElementById('txt-surname');
      const txtNationalID = document.getElementById('txt-national-id');
      const txtGender = document.getElementById('txt-gender');
      const txtPlaceOfBirth = document.getElementById('txt-place-of-birth');
      const txtDOB = document.getElementById('txt-dob');
      const txtMaritalStatus = document.getElementById('txt-marital-status');
      const txtLocation = document.getElementById('txt-location');
      const txtRelationshipToIncident = document.getElementById('txt-relationship-to-incident');
      const txtResidentialAddress = document.getElementById('txt-residential-address');
      const txtWorkAddress = document.getElementById('txt-work-address');
      const txtPostalAddress = document.getElementById('txt-postal-address');
      const txtTelephone = document.getElementById('txt-telephone');
      const txtMobile = document.getElementById('txt-mobile');
      const txtFax = document.getElementById('txt-fax');
      const txtEmail = document.getElementById('txt-email');
      const txtNextOfKinNumber = document.getElementById('txt-next-of-kin-number');
      const txtFriendNumber = document.getElementById('txt-friend-number');
      const txtInsititution = document.getElementById('txt-institution');
      const txtRelationshipToVictim = document.getElementById('txt-relationship-to-victim');
      const txtWhyCompletingOnBehalf = document.getElementById('txt-why-completing-on-behalf');

      /// name and surname
      const name = txtName.value;
      const surname = txtSurname.value;

      if (!name) {
         txtName.focus();
         throw new Error('Enter name');
      }

      if (!surname) {
         txtSurname.focus();
         throw new Error('Enter surname');
      }

      /// national id
      let national_id;

      if (txtNationalID) {
         national_id = txtNationalID.value;
      }

      /// gender
      const gender = txtGender.value;

      if (!gender) {
         txtGender.focus();
         throw new Error('Select gender');
      }

      /// birth info
      const dob = txtDOB ? txtDOB.value : undefined;
      const place_of_birth = txtPlaceOfBirth ? txtPlaceOfBirth.value : undefined;

      /// marital status
      const marital_status = txtMaritalStatus ? txtMaritalStatus.value : undefined;

      /// location and relationship to incident
      const location = txtLocation ? txtLocation.value : undefined;
      const relationship_to_incident = txtRelationshipToIncident ? txtRelationshipToIncident.value : undefined;


      /// addresses
      const residential_address = txtResidentialAddress ? txtResidentialAddress.value : undefined;
      const work_address = txtWorkAddress ? txtWorkAddress.value : undefined;
      const postal_address = txtPostalAddress ? txtPostalAddress.value : undefined;

      /// contact details
      const mobile = txtMobile ? txtMobile.value : undefined;
      const telephone = txtTelephone ? txtTelephone.value : undefined;
      const fax = txtFax ? txtFax.value : undefined;
      const email = txtEmail ? txtEmail.value : undefined;
      const next_of_kin_phone = txtNextOfKinNumber ? txtNextOfKinNumber.value : undefined;
      const friend_phone = txtFriendNumber ? txtFriendNumber.value : undefined;

      /// institution, relationship to victim and reason for completing the form
      const insitution = txtInsititution ? txtInsititution.value : undefined;
      const relationship_to_victim = txtRelationshipToVictim ? txtRelationshipToVictim.value : undefined;
      const why_completing_form_on_behalf = txtWhyCompletingOnBehalf ? txtWhyCompletingOnBehalf.value : undefined;

      /// put data in state
      const data = {
         name,
         surname,
         national_id,
         gender,
         place_of_birth,
         dob,
         marital_status,
         location,
         relationship_to_incident,
         residential_address,
         work_address,
         postal_address,
         telephone,
         mobile,
         fax,
         email,
         next_of_kin_phone,
         friend_phone,
         insitution,relationship_to_victim,
         why_completing_form_on_behalf,
      }

      return data;

   }

   retrieveViolationDetails = () => {

      // extract data
      const txtDate = document.getElementById('txt-date');
      const txtContinuing = document.getElementById('txt-continuing');
      const txtNature = document.getElementById('txt-nature');
      const txtNatureGender = document.getElementById('txt-nature-gender');
      const txtDetails = document.getElementById('txt-details');
      const txtLocation = document.getElementById('txt-location');
      const txtWitnessDetails = document.getElementById('txt-witness-details');
      const txtImpact = document.getElementById('txt-impact');


      /// date
      const date = txtDate ? txtDate.value : undefined;
      
      /// continuing
      const continuing = txtContinuing ? txtContinuing.value : undefined;

      /// nature
      const nature = txtNature ? txtNature.value : undefined;
      const nature_gender = txtNatureGender ? txtNatureGender.value : undefined;

      /// details
      const details = txtDetails.value;

      if (!details) {
         txtDetails.focus();
         throw new Error('Provide details on the incident');
      }

      const location = txtLocation ? txtLocation.value : undefined; // location
      const witness_details = txtWitnessDetails ? txtWitnessDetails.value : undefined; // witness details
      const impact = txtImpact ? txtImpact.value : undefined; // impact

      return {
         date,
         continuing,
         nature,
         nature_gender,
         details,
         location,
         witness_details,
         impact,
      }
   }

   retrieveMoreDetails = async () => {

      // extract inputs
      const txtWhyIsViolationImportantToOurMandate = document.getElementById('txt-why-violation-isimportant-to-our-mandate');
      const txtExpectationsFromUs = document.getElementById('txt-expectations-from-us');
      const txtLawyerDetails = document.getElementById('txt-lawyer-details');
      const txtLanguage = document.getElementById('txt-language');
      const txtWhoReferredYouToUs = document.getElementById('txt-who-referred-you-to-us');
      const txtEvidence = document.getElementById('txt-evidence');
      const txtMoreAssistanceRequired = document.getElementById('txt-more-assistance-required');
      const txtOtherEntityReportedToDetails = document.getElementById('txt-other-entity-reported-to-details');
      const txtOtherEntityReportedToActions = document.getElementById('txt-other-entity-reported-to-actions');
      const txtOtherEntityReportedToWhyReportingToUsAsWell = document.getElementById('txt-other-entity-reported-to-why-reporting-to-us-as-well');

      const why_violation_is_important_to_our_mandate = txtWhyIsViolationImportantToOurMandate ? txtWhyIsViolationImportantToOurMandate.value : undefined;
      const expectations_from_us = txtExpectationsFromUs ? txtExpectationsFromUs.value : undefined;
      const lawyer_details = txtLawyerDetails ? txtLawyerDetails.value : undefined;
      const language = txtLanguage ? txtLanguage.value : undefined;
      const who_referred_you_to_us = txtWhoReferredYouToUs ? txtWhoReferredYouToUs.value : undefined;
      
      let evidence;

      if (txtEvidence) {
         if (txtEvidence.files && txtEvidence.files.length > 0) {
            evidence = await getFilesData(txtEvidence.files)
         }
      }

      const more_assistance_required = txtMoreAssistanceRequired ? txtMoreAssistanceRequired.value : undefined;

      const otherEntityReportedToDetails = txtOtherEntityReportedToDetails ? txtOtherEntityReportedToDetails.value : undefined;
      const otherEntityReportedToActions = txtOtherEntityReportedToActions ? txtOtherEntityReportedToActions.value : undefined;
      const otherEntityReportedToWhyReportingToUsAsWell= txtOtherEntityReportedToWhyReportingToUsAsWell ? txtOtherEntityReportedToWhyReportingToUsAsWell.value : undefined;

      let other_entity_reported_to;

      if (otherEntityReportedToDetails || otherEntityReportedToActions || otherEntityReportedToWhyReportingToUsAsWell) {
         other_entity_reported_to = {
            details: otherEntityReportedToDetails,
            actions: otherEntityReportedToActions,
            why_reporting_to_us_as_well: otherEntityReportedToWhyReportingToUsAsWell,
         }
      }

      return {
         why_violation_is_important_to_our_mandate,
         expectations_from_us,
         lawyer_details,
         language,
         who_referred_you_to_us,
         evidence,
         more_assistance_required,
         other_entity_reported_to,
      }
   }

   next = async () => {

      const newStage = Math.min(this.state.stage + 1, steps.length);

      const update = {
         stage: newStage,
      }

      try {
         switch (this.state.stage) {
            case 1:

               if (!this.state.title) {
                  document.getElementById('txt-title').focus();
                  throw new Error('Provide the case title');
               }

               if (!this.state.source) {
                  document.getElementById('txt-source').focus();
                  throw new Error('Provide the source');
               }

               if (!this.state.province) {
                  document.getElementById('txt-province').focus();
                  throw new Error('Select the province');
               }

               update.applicant = this.retrievePersonalDetails();
               break;

            case 2:
               if (this.state.applicantIsVictim)
                  update.victim = null;
               else
                  update.victim = this.retrievePersonalDetails();

               break;

            case 3:
               update.defendant = this.retrievePersonalDetails();
               break;

            case 4:
               update.violation = this.retrieveViolationDetails();
               break;

            case 5:
               {
                  const data = await this.retrieveMoreDetails();
                  
                  Object.keys(data).forEach(key => {
                     update[key] = data.key;
                  });

                  break;
               }

            default:
               break;

         }

      } catch (err) {
         console.log(err);
         return errorToast(err.message);
      }

      const currentStage = this.state.stage
      await this.updateState(update);

      // sumbit case
      if (currentStage === steps.length) {
         const {
            applicant,
            victim,
            defendant,
            violation,
            title,
            source,
            evidence,
            why_violation_is_important_to_our_mandate,
            more_assistance_required,
            language,
            expectations_from_us,
            lawyer_details,
            province,
         } = this.state;

         const data =  {
            applicant,
            victim,
            defendant,
            violation,
            title,
            province,
            source,
            evidence,
            why_violation_is_important_to_our_mandate,
            more_assistance_required,
            language,
            expectations_from_us,
            lawyer_details,
         }

         removeEmptyProperties(data);

         try {
            showLoading();

            const res = await request.post('/api/cases', data);
            const { _id } = res.data;
            data._id = _id

            actions.addEntity(CaseSchema, data);
            this.resetEditor();
            successToast('Case successfully added');

         } catch (err) {
            console.log(data);
            swal(String(err));
         } finally {
            hideLoading();
         }
      }

   }

   componentDidUpdate(prevProps) {
      if (this.props.open && !prevProps.open) {
         this.resetEditor();
      }
   }

   render() {

      if (!this.props.open)
         return;

      let form;
      const formIsElectoral = this.state.caseType === CASE_TYPES.ELECTORAL;

      switch (this.state.stage) {
         case 1:
            form = <>

               <div className='text-lg text-gray-600 font-extrabold mt-5'>
                  CASE INFO
               </div>

               <div className='mt-4'>
                  <ChakraSelect
                     value={this.state.caseType}
                     label="Case type"
                     onChange={caseType => this.updateState({ caseType })}
                  >
                     {
                        Object.values(CASE_TYPES).map(type => {
                           return <option value={type}>
                              {capitalize.words(type)}
                           </option>
                        })
                     }
                  </ChakraSelect>
                  
                  <div className='grid grid-cols-2 gap-6 my-6'>
                     <ChakraTextBox
                        id="txt-title"
                        label="Case title"
                        value={this.state.title}
                        onChange={title => this.updateState({ title })}
                     />

                     <ChakraSelect
                        id="txt-source"
                        label="Source"
                        value={this.state.source}
                        onChange={source => this.updateState({ source })}
                        allowDefaultEmptySelection
                     >
                        {
                           Object.values(CASE_SOURCES).map(type => {
                              return <option value={type}>
                                 {capitalize.words(type).replaceAll('_', ' ')}
                              </option>
                           })
                        }
                     </ChakraSelect>

                     <ChakraSelect
                        id="txt-province"
                        label="Which province did the case occur?"
                        value={this.state.province}
                        onChange={province => this.updateState({ province })}
                        allowDefaultEmptySelection
                     >
                        {
                           Object.values(PROVINCES).map(province => {
                              return <option value={province}>
                                 {province}
                              </option>
                           })
                        }
                     </ChakraSelect>
                  </div>
               </div>

               <Divider className='mt-5' />

               <div className='text-lg text-gray-600 font-extrabold mt-5'>
                  APPLICANT DETAILS
               </div>

               <PersonalDetailsForm 
                  electoral={formIsElectoral}
                  displayInstitutionField={!formIsElectoral}
                  displayRelationshipToVictimField={!formIsElectoral}
                  displayWhyCompletingFormOnBehalfField={!formIsElectoral}
                  displayRelationshipToIncidentField={formIsElectoral}
                  displayLocationField={formIsElectoral}
               />
               
            </>

            break;

         case 2:
            {
               const personalDetailsForm = this.state.applicantIsVictim ? undefined : <PersonalDetailsForm 
                  electoral={formIsElectoral} 
               />
               
               form = <>

                  <div className='text-lg text-gray-600 font-extrabold mt-5'>
                     VICTIM DETAILS
                  </div>

                  <div>
                     <ChakraCheckbox
                        label="The applicant is the victim"
                        value={this.state.applicantIsVictim}
                        onChange={applicantIsVictim => this.updateState({ applicantIsVictim })}
                     />
                  </div>

                  {personalDetailsForm}
                  
               </>
            }

            break;
      
         case 3:
            
            form = <>

               <div className='text-lg text-gray-600 font-extrabold mt-5'>
                  DEFENDANT DETAILS
               </div>

               <PersonalDetailsForm 
                  electoral={formIsElectoral} 
               />
               
            </>

            break;

         case 4:
            
            form = <>
               <div className='text-lg text-gray-600 font-extrabold mt-5'>
                  VIOLATION DETAILS
               </div>

               <ViolationDetailsForm
                  electoral={formIsElectoral}
               />
            </>
            break;

         case 5:
            
            form = <>
               <div className='text-lg text-gray-600 font-extrabold mt-5'>
                  MORE DETAILS
               </div>

               <MoreCaseInfoForm
                  electoral={formIsElectoral}
               />
            </>
            break;
      
         default:
            break;
      }


      return <ChakraProvider>
         <div className='fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.95)] z-[1100] vh-align'>
            <div 
               className='w-[70%] h-[90%] max-w-[900px] grid grid-rows-[auto,1fr,auto] bg-white rounded-xl shadow-xl'
            >

               <div className='shadow-sm px-8 py-4'>
                  <h2 className='font-extrabold text-4xl'>ADD NEW CASE</h2>

                  <div className='my-4'>
                     <ChakraStepper
                        steps={steps}
                        activeStep={this.state.stage - 1}
                     />
                  </div>
               </div>

               <div className='overflow-y-auto p-8'>
                  {form}
               </div>

               <div className='text-right shadow-xl px-8 py-4 border-[1px] border-solid'>
                  <Button onClick={this.next} className='bg-orange-600 text-white'>
                     NEXT
                  </Button>

                  <Button onClick={actions.closeCaseEditor}>
                     CLOSE
                  </Button>
               </div>
            </div>
         </div>
      </ChakraProvider>

   }
}


const mapStateToProps = state => {
   const { caseEditorOpen: open } = state;
   return { open };
}

const CaseEditor = connect(mapStateToProps)(UnconnectedCaseEditor);
export default CaseEditor;