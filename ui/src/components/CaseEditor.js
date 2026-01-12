
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
import { CASE_SOURCES, CASE_STATUS, CASE_TYPE, PROVINCES } from '../backend-constants';
import MoreCaseInfoForm from './MoreCaseInfoForm';
import swal from 'sweetalert'
import { hideLoading, showLoading } from '../loading'
import request from '../request';
import { Case as CaseSchema } from '../reducer/schema';
import { ArrowBackIcon, ArrowForwardIcon, ChevronDownIcon } from '@chakra-ui/icons';
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
   { title: 'Respondent', _description: 'Information about the person/institution being accused' },
   { title: 'Violation', _description: 'Details about the violation' },
   { title: 'More', }
]


const defaultState = {
   stage: 1,
   caseType: CASE_TYPE.GENERAL,
   applicant: null,
   victim: null,
   defendants: null,
   defendantCount: 1,
   doesntKnowDefendants: false,
   violation: null,
   other: null,
   applicantIsVictim: false,
   title: '',
   source: '',
   province: '',
   district: '',
   ward: '',
   village: '',
   haveReportedToThirdParty: false,
   showScrollIndicator: false,
   autoGenerateCaseNumber: true,
   manualCaseNumber: '',
}


class UnconnectedCaseEditor extends Component {

   state = { ...defaultState }

   incrementDefendantCount = (inc=1) => {
      const defendantCount = this.state.defendantCount + inc;
      return this.updateState({ defendantCount });
   }

   resetEditor = () => {
      return this.overwriteState({ ...defaultState });
   }

   retrievePersonalDetails = (container=document) => {

      // presense check
      const txtAnonymous = document.getElementById('txt-anonymous');
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

      /// anonymity
      const anonymous = txtAnonymous ? txtAnonymous.checked : undefined;

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

      if (email) {
         if (!(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))) {
            txtEmail.focus();
            throw new Error("Invalid email");
         }
      }
      const address = txtAddress ? txtAddress.value : undefined;
      const next_of_kin_phone = txtNextOfKinNumber ? txtNextOfKinNumber.value : undefined;
      const friend_phone = txtFriendNumber ? txtFriendNumber.value : undefined;

      /// institution, relationship to victim and reason for completing the form
      const institution_name = txtInsititution ? txtInsititution.value : undefined;
      const relationship_to_victim = txtRelationshipToVictim ? txtRelationshipToVictim.value : undefined;
      const why_completing_form_on_behalf = txtWhyCompletingOnBehalf ? txtWhyCompletingOnBehalf.value : undefined;

      /// return data
      const data = {
         anonymous,
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
      const txtDateFrom = document.getElementById('txt-date-from');
      const txtDateTo = document.getElementById('txt-date-to');
      const txtVictimAgeRange = document.getElementById('txt-victim-age-range');
      const txtContinuing = document.getElementById('txt-continuing');
      const txtNatures = document.getElementById('txt-natures');
      const txtDetails = document.getElementById('txt-details');
      const txtLocation = document.getElementById('txt-location');
      const txtWitnessDetails = document.getElementById('txt-witness-details');
      const txtWitnessAnonymity = document.getElementById('txt-witness-anonymity');
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

      /// dates
      const dateFrom = txtDateFrom ? txtDateFrom.value : undefined;
      const dateTo = txtDateTo ? txtDateTo.value : undefined;

      let dates;

      if (dateFrom || dateTo) {
         dates = {
            from: dateFrom,
            to: dateTo,
         }
      }

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
      const witnessDetails = txtWitnessDetails ? txtWitnessDetails.value : undefined; 
       
      // witness details
      const witnessAnonymity = txtWitnessAnonymity ? txtWitnessAnonymity.checked : undefined;

      let witness;

      if (witnessDetails) {
         witness = {
            details: witnessDetails,
            anonymous: witnessAnonymity,
         }
      }

      const data = {
         dates,
         continuing,
         natures,
         details,
         location,
         witness,
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
      const who_referred_you_to_us = txtWhoReferredYouToUs.value;

      if (!who_referred_you_to_us) {
         txtWhoReferredYouToUs.focus();
         throw new Error('Provide how you got to know about us');
      }
       
      let evidence;

      if (txtEvidence) {
         if (txtEvidence.files && txtEvidence.files.length > 0) {
            evidence = await getFilesData(txtEvidence.files)
         }
      }

      const more_assistance_required = txtMoreAssistanceRequired ? txtMoreAssistanceRequired.value : undefined;


      let other_entity_reported_to;

      if (this.state.haveReportedToThirdParty) {
         const details = txtOtherEntityReportedToDetails.value;
         const actions = txtOtherEntityReportedToActions.value;
         const why_reporting_to_us_as_well = txtOtherEntityReportedToWhyReportingToUsAsWell.value;

         if (!details) {
            txtOtherEntityReportedToDetails.focus();
            throw new Error("Provide the details of the party you reported to");
         }

         if (!actions) {
            txtOtherEntityReportedToActions.focus();
            throw new Error("Describe what the party you reported to did to help the situation");
         }

         if (!why_reporting_to_us_as_well) {
            txtOtherEntityReportedToWhyReportingToUsAsWell.focus();
            throw new Error("Explain why you are also reporting the case to ZGC");
         }

         other_entity_reported_to = { details, actions, why_reporting_to_us_as_well };
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

               if (!this.state.district) {
                  document.getElementById('txt-district').focus();
                  throw new Error('Select the district');
               }

               if (!this.state.ward) {
                  document.getElementById('txt-ward').focus();
                  throw new Error('Type in the ward');
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

                  if (this.state.doesntKnowDefendants) {
                     update.defendants = [];
                     break;
                  }

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
         return errorToast(err.message);
      }

      const currentStage = this.state.stage
      await this.updateState(update);

      // scroll form to top
      document.getElementById('div-form-container').scrollTo(0, 0);
      await this.shouldIShowScrollIndicator()

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
            district,
            ward,
            village,
            who_referred_you_to_us,
            other_entity_reported_to,
            caseType,
         } = this.state;

         const data =  {
            type: caseType,
            applicant,
            victim,
            defendants,
            violation,
            title,
            province,
            district,
            ward,
            village,
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

         // add case number if manually provided
         if (!this.state.autoGenerateCaseNumber && this.state.manualCaseNumber) {
            data.case_number = this.state.manualCaseNumber;
         }

         removeEmptyProperties(data);

         try {
            showLoading();

            const res = await request.post('/api/cases', data);
            const { _id } = res.data;
            data._id = _id;
            data.status = CASE_STATUS.NOT_ASSESSED;

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


   shouldIShowScrollIndicator = () => {

      const divFormContainer = document.getElementById('div-form-container');
      const offset = divFormContainer.offsetHeight - divFormContainer.clientHeight;

      let showScrollIndicator;
      if (divFormContainer.scrollTop < (divFormContainer.scrollHeight - divFormContainer.offsetHeight - offset)) {
         // The div is not scrolled to the bottom
         showScrollIndicator = true;
      } else {
         // The div is scrolled to the bottom
         showScrollIndicator = false;
          
      }

      return this.updateState({ showScrollIndicator });

   }


   componentDidUpdate(prevProps) {
      // just got opened
      if (this.props.open && !prevProps.open) {
         this.resetEditor();
         this.shouldIShowScrollIndicator();
      }
   }

   render() {

      if (!this.props.open)
         return;

      let form;
      const formIsElectoral = this.state.caseType === CASE_TYPE.ELECTORAL;

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
                        Object.values(CASE_TYPE).map(type => {
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

                     <div className='col-span-2'>
                        <ChakraCheckbox
                           label="Auto-generate case number"
                           checked={this.state.autoGenerateCaseNumber}
                           onChange={autoGenerateCaseNumber => this.updateState({ autoGenerateCaseNumber })}
                        />
                     </div>

                     {!this.state.autoGenerateCaseNumber && (
                        <ChakraTextBox
                           id="txt-case-number"
                           label="Case Number"
                           value={this.state.manualCaseNumber}
                           onChange={manualCaseNumber => this.updateState({ manualCaseNumber })}
                           placeholder="e.g., ZGC/123/25"
                        />
                     )}

                     <ChakraSelect
                        id="txt-province"
                        label="Which province did the case occur?"
                        value={this.state.province}
                        onChange={province => this.updateState({ province, district: '' })}
                        allowDefaultEmptySelection
                     >
                        {
                           Object.keys(PROVINCES).map(province => {
                              return <option value={province}>
                                 {capitalize.words(province.replace('_', ' '))}
                              </option>
                           })
                        }
                     </ChakraSelect>

                     <ChakraSelect
                        id="txt-district"
                        label="District"
                        value={this.state.district}
                        onChange={district => this.updateState({ district })}
                        allowDefaultEmptySelection
                     >
                        {
                           (PROVINCES[this.state.province] || []).map(province => {
                              return <option value={province}>
                                 {province}
                              </option>
                           })
                        }
                     </ChakraSelect>

                     <ChakraTextBox
                        id="txt-ward"
                        label="Ward"
                        type="number"
                        min={1}
                        value={this.state.ward}
                        onChange={ward => this.updateState({ ward })}
                     />

                     <ChakraTextBox
                        id="txt-village"
                        label="Village"
                        value={this.state.village}
                        onChange={village => this.updateState({ village })}
                     />
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
                  displayAnonymityField={true}
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

                  <div className='my-6'>
                     <ChakraCheckbox
                        label="The applicant is the victim"
                        checked={this.state.applicantIsVictim}
                        onChange={
                           async applicantIsVictim => {
                              await this.updateState({ applicantIsVictim });
                              await this.shouldIShowScrollIndicator();
                           }
                        }
                     />
                  </div>

                  {personalDetailsForm}
                  
               </>
            }

            break;
       
         case 3:
             
            {

               let defendantsJSX;

               if (!this.state.doesntKnowDefendants) {

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
                              RESPONDENT #{i} DETAILS
                           </div>

                           <PersonalDetailsForm 
                              electoral={formIsElectoral} 
                           />

                           {(this.state.defendantCount > 1 && this.state.defendantCount === i) ? removeLastDefendant: undefined }

                           <Divider className='my-4' />

                        </div>
                     );
                  }

                  defendantsJSX = <>
                     {defendants}

                     <div className='text-right'>
                        <Button
                           onClick={() => this.incrementDefendantCount()}
                           className='bg-transparent text-[#1976D2]'
                           size={"sm"}
                        >
                           ADD ANOTHER RESPONDENT
                        </Button>
                     </div>
                   </>

               }

               form = <>

                  <div className='my-6'>
                     <ChakraCheckbox
                        label="I do not know the respondent(s)"
                        checked={this.state.doesntKnowDefendants}
                        onChange={
                           async doesntKnowDefendants => {
                              await this.updateState({ doesntKnowDefendants });
                              await this.shouldIShowScrollIndicator();
                           }
                        }
                     />
                  </div>

                  {defendantsJSX}
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
               <div className='text-lg text-gray-600 font-extrabold my-5'>
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


      let scrollIndicator;

      if (this.state.showScrollIndicator) {
         scrollIndicator = <div className='inline-block absolute bottom-[10px] left-[50%] transform -translate-x-[50%]'>
            <ChevronDownIcon 
               boxSize={6} 
               className='rounded-full bg-orange-600 text-white' 
            />
         </div>
      }


      return <ChakraProvider>
         <div className='fixed top-0 left-0 h-screen w-screen bg-[rgba(0,0,0,0.95)] z-[1100] vh-align'>
            <div 
               className='w-[70%] h-[90%] max-w-[900px] grid grid-rows-[auto,1fr,auto] bg-white rounded-xl shadow-xl'
            >

               <div className='shadow-sm px-8 py-4'>
                  <h2 className='font-extrabold text-3xl my-8 text-gray-600'>ADD NEW CASE</h2>

                  <div className='my-4'>
                     <ChakraStepper
                        steps={steps}
                        activeStep={this.state.stage - 1}
                     />
                  </div>
               </div>

               <div className='relative overflow-hidden'>
                  <div className='overflow-y-auto p-8 h-full' id='div-form-container' onScroll={this.shouldIShowScrollIndicator}>
                     {form}
                     {scrollIndicator}
                  </div>
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
