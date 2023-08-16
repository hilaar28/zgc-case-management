
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
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { delay }  from '../utils';


function removeEmptyProperties(data) {

   if (!data)
      return;

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
      
      if (value === undefined || value === '' || value === null)
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
   { title: 'Complainant', _description: 'Information about the victim' },
   { title: 'Correspondent', _description: 'Information about the person/institution being accused' },
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
   defendants: null,
   defendantCount: 1,
   violation: null,
   other: null,
   applicantIsVictim: false,
   title: '',
   source: '',
   province: '',
   haveReportedToThirdParty: false,
}


class UnconnectedCaseEditor extends Component {

   state = defaultState

   incrementDefendantCount = (inc=1) => {
      const defendantCount = this.state.defendantCount + inc;
      return this.updateState({ defendantCount });
   }

   resetEditor = () => {
      return this.updateState(defaultState);
   }

   retrievePersonalDetails = (container=document) => {

      // presense check
      const txtName = container.querySelector('#txt-name');
      const txtSurname = container.querySelector('#txt-surname');
      const txtNationalID = container.querySelector('#txt-national-id');
      const txtGender = container.querySelector('#txt-gender');
      const txtPlaceOfBirth = container.querySelector('#txt-place-of-birth');
      const txtDOB = container.querySelector('#txt-dob');
      const txtMaritalStatus = container.querySelector('#txt-marital-status');
      const txtLocation = container.querySelector('#txt-location');
      const txtRelationshipToIncident = container.querySelector('#txt-relationship-to-incident');
      const txtTelephone = container.querySelector('#txt-telephone');
      const txtMobile = container.querySelector('#txt-mobile');
      const txtAddress = container.querySelector('#txt-address');
      const txtEmail = container.querySelector('#txt-email');
      const txtNextOfKinNumber = container.querySelector('#txt-next-of-kin-phone');
      const txtFriendNumber = container.querySelector('#txt-friend-phone');
      const txtInsititution = container.querySelector('#txt-institution-name');
      const txtRelationshipToVictim = container.querySelector('#txt-relationship-to-victim');
      const txtWhyCompletingOnBehalf = container.querySelector('#txt-why-completing-form-on-behalf');

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


      /// contact details
      const mobile = txtMobile ? txtMobile.value : undefined;
      const telephone = txtTelephone ? txtTelephone.value : undefined;
      const email = txtEmail ? txtEmail.value : undefined;
      const address = txtAddress ? txtAddress.value : undefined;
      const next_of_kin_phone = txtNextOfKinNumber ? txtNextOfKinNumber.value : undefined;
      const friend_phone = txtFriendNumber ? txtFriendNumber.value : undefined;

      /// institution, relationship to victim and reason for completing the form
      const institution_name = txtInsititution ? txtInsititution.value : undefined;
      const relationship_to_victim = txtRelationshipToVictim ? txtRelationshipToVictim.value : undefined;
      const why_completing_form_on_behalf = txtWhyCompletingOnBehalf ? txtWhyCompletingOnBehalf.value : undefined;

      /// return data
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
         telephone,
         mobile,
         email,
         address,
         next_of_kin_phone,
         friend_phone,
         institution_name,
         relationship_to_victim,
         why_completing_form_on_behalf,
      }

      return data;

   }

   retrieveViolationDetails = () => {

      // extract data
      const txtDate = document.getElementById('txt-date');
      const txtVictimAgeRange = document.getElementById('txt-victim-age-range');
      const txtContinuing = document.getElementById('txt-continuing');
      const txtNatures = document.getElementById('txt-natures');
      const txtDetails = document.getElementById('txt-details');
      const txtLocation = document.getElementById('txt-location');
      const txtWitnessDetails = document.getElementById('txt-witness-details');
      const txtImpact = document.getElementById('txt-impact');

      /// natures
      const natures = txtNatures.value
         .filter(nature => {
            if (!nature || !nature.nature)
               return false;
            return true;
         });
      
      if (natures.length === 0) {
         txtNatures.focus();
         throw new Error('Provide at least one violation nature');
      }

      /// date
      const date = txtDate ? txtDate.value : undefined;

      /// age range
      const victim_age_range = txtVictimAgeRange ? txtVictimAgeRange.value : undefined;

      if (!victim_age_range) {
         txtVictimAgeRange.focus();
         throw new Error('Victim age range is required');
      }
      
      /// continuing
      const continuing = txtContinuing ? txtContinuing.checked : undefined;

      // impact
      const impact = txtImpact.value

      if (!impact) {
         txtImpact.focus();
         throw new Error('Select the incident\'s impact');
      }

      /// details
      const details = txtDetails.value;

      if (!details) {
         txtDetails.focus();
         throw new Error('Provide details on the incident');
      }

      const location = txtLocation ? txtLocation.value : undefined; // location
      const witness_details = txtWitnessDetails ? txtWitnessDetails.value : undefined; // witness details

      const data = {
         date,
         continuing,
         natures,
         details,
         location,
         witness_details,
         impact,
         victim_age_range,
      }

      return data;
   }

   retrieveMoreDetails = async () => {

      // extract inputs
      const txtWhyIsViolationImportantToOurMandate = document.getElementById('txt-why-violation-is-important-to-our-mandate');
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

      const data = {
         why_violation_is_important_to_our_mandate,
         expectations_from_us,
         lawyer_details,
         language,
         who_referred_you_to_us,
         evidence,
         more_assistance_required,
         other_entity_reported_to,
      }

      return data;

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
               {
                  const defendants = [];

                  for (let i = 1; i <= this.state.defendantCount; i++) {
                     const div = document.getElementById(`div-defendant-${i}`);
                     const defendant = this.retrievePersonalDetails(div);
                     defendants.push(defendant);
                  }


                  update.defendants = defendants;
                  break;
               }

            case 4:
               update.violation = this.retrieveViolationDetails();
               break;

            case 5:
               {
                  const data = await this.retrieveMoreDetails();
                  
                  Object.keys(data).forEach(key => {
                     update[key] = data[key];
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

      // scroll form to top
      document.getElementById('div-form-container').scrollTo(0, 0);

      // submit case
      if (currentStage === steps.length) {
         const {
            applicant,
            victim,
            defendants,
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
            who_referred_you_to_us,
            other_entity_reported_to,
         } = this.state;

         const data =  {
            applicant,
            victim,
            defendants,
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
            who_referred_you_to_us,
            other_entity_reported_to,
         }

         console.log(JSON.stringify(data, 0, 3))
         removeEmptyProperties(data);

         console.log(data);

         try {
            showLoading();

            const res = await request.post('/api/cases', data);
            const { _id } = res.data;
            data._id = _id

            actions.addEntity(CaseSchema, data);
            this.resetEditor();
            successToast('Case successfully added');
            

         } catch (err) {
            swal(String(err));
         } finally {
            hideLoading();
         }
      } else {
         await delay(100);
         this.hydrateForm();
      }

   }


   setInputValues = (source, containerId='div-form-container') => {
      // get all input elements
      const divForm = document.getElementById(containerId);
      const inputs = Array.from(divForm.querySelectorAll('input, textarea, select, [data-input]'));

      // hydrate
      for (let i in inputs) {
         try {
            const input = inputs[i];

            if (!input.id)
               continue;

            const elementTargetAttribute = input.type === 'checkbox' ? 'checked' : 'value';
            let sourceTargetAttribute = input.getAttribute('data-source-target-attribute');

            if (!sourceTargetAttribute) {
               const id = input.id;
               const indexOfFirstHyphen = id.indexOf('-');
               sourceTargetAttribute = id.substring(indexOfFirstHyphen + 1).replaceAll('-', '_');
            }

            let value = source;
            const splitted = sourceTargetAttribute.split('.');

            for (let i in splitted) {
               const key = splitted[i];
               value = value[key];
            }

            if (value)
               input[elementTargetAttribute] = value;

         } catch (err) {
            console.log(err);
         }
      }
   }

   hydrateForm = () => {


      switch (this.state.stage) {
         case 1:
            this.setInputValues(this.state.applicant);            
            return;

         case 2:
            this.setInputValues(this.state.victim);            
            return;

         case 3:
            
            if (Array.isArray(this.state.defendants)) {
               this.state.defendants.forEach((defendant, i) => {
                  this.setInputValues(defendant, `div-defendant-${i+1}`);
               });
            }
                    
            return;

         case 4:
            this.setInputValues(this.state.violation);
            return;

         default:
            this.setInputValues(this.state);
            return;
      }
      
   }

   previous = async () => {
      
      const stage = Math.max(this.state.stage - 1, 1);
      await this.updateState({ stage });
      await delay(100);
      this.hydrateForm();

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
                  COMPLAINANT REPRESENTATIVE DETAILS
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
                     COMPLAINANT DETAILS
                  </div>

                  <div className='mt-4'>
                     <ChakraCheckbox
                        label="The applicant is the victim"
                        checked={this.state.applicantIsVictim}
                        onChange={applicantIsVictim => this.updateState({ applicantIsVictim })}
                     />
                  </div>

                  {personalDetailsForm}
                  
               </>
            }

            break;
      
         case 3:
            
            {

               const defendants = [];

               const removeLastDefendant = <div className='text-right'>
                  <Button
                     onClick={() => this.incrementDefendantCount(-1)}
                     className='bg-transparent text-[#1976D2]'
                     size={"sm"}
                  >
                     REMOVE
                  </Button>
               </div>

               for (let i = 1; i <= this.state.defendantCount; i++) {
                  defendants.push(
                     <div id={`div-defendant-${i}`} key={i}>
                        <div className='text-lg text-gray-600 font-extrabold mt-5'>
                           CORRESPONDENT #{i} DETAILS
                        </div>

                        <PersonalDetailsForm 
                           electoral={formIsElectoral} 
                        />

                        {(this.state.defendantCount > 1 && this.state.defendantCount === i) ? removeLastDefendant: undefined }

                        <Divider className='my-4' />

                     </div>
                  );
               }

               form = <>

                  {defendants}

                  <div className='text-right'>
                     <Button
                        onClick={() => this.incrementDefendantCount()}
                        className='bg-transparent text-[#1976D2]'
                        size={"sm"}
                     >
                        ADD ANOTHER DEFENDANT
                     </Button>
                  </div>
               </>;
            }

            break;

         case 4:
            
            form = <>
               <div className='text-lg text-gray-600 font-extrabold mt-5'>
                  VIOLATION DETAILS
               </div>

               <ViolationDetailsForm
                  electoral={formIsElectoral}
                  victimDOB={
                     (() => {

                        const victim = this.state.victim || this.state.applicant;

                        if (victim && victim.dob)
                           return victim.dob;
                     })()
                  }
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
                  onHaveReportedToThirdPartyChanged={haveReportedToThirdParty => this.updateState({ haveReportedToThirdParty })}
                  haveReportedToThirdParty={this.state.haveReportedToThirdParty}
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

               <div className='overflow-y-auto p-8' id='div-form-container'>
                  {form}
               </div>

               <div className='text-right shadow-xl px-8 py-4 border-[1px] border-solid'>
                  <Button 
                     onClick={this.previous} 
                     className={`mr-2 ${this.state.stage === 1 ? 'pointer-events-none opacity-30': '' }`}
                     size={"sm"}
                     colorScheme='gray'
                     leftIcon={<ArrowBackIcon />}
                  >
                     BACK
                  </Button>

                  <Button 
                     onClick={this.next} 
                     size={"sm"}
                     colorScheme='orange'
                     rightIcon={<ArrowForwardIcon />}
                  >
                     {this.state.stage === steps.length ? 'SUBMIT' : 'NEXT'}
                  </Button>

                  <Button 
                     onClick={actions.closeCaseEditor}
                     className='bg-transparent text-[#1976D2]'
                     size={"sm"}
                  >
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