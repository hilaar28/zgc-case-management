
import Component from '@xavisoft/react-component';
import { GENDER, MARITAL_STATUS, RELATIONSHIP_TO_INCIDENT } from '../backend-constants';
import ChakraTextBox from './ChakraTextbox';
import { Divider } from '@chakra-ui/react'
import ChakraSelect from './ChakraSelect';
import capitalize from 'capitalize';
import ChakraAutoComplete from './ChakraAutoComplete';


function FieldGroupLabel(props) {
   return <div className='text-sm text-gray-500 font-extrabold mt-5'>
      {props.children}
   </div>
}

export default class PersonalDetailsForm extends Component {

   render() {

      // define fields
      const name = <ChakraTextBox
         id='txt-name'
         label="Name"
      />
      
      const surname = <ChakraTextBox
         id='txt-surname'
         label="Surname"
      /> 

      const nationalId = <ChakraTextBox
         id='txt-national-id'
         label="National ID"
      />

      const gender = <ChakraSelect
         id='txt-gender'
         label="Gender"
         allowDefaultEmptySelection
      >
         {
            Object.keys(GENDER).map(key => {

               const gender = GENDER[key];

               return <option value={gender} key={gender}>
                  {capitalize(key)}
               </option>
            })
         }
      </ChakraSelect>

      const placeOfBirth = <ChakraTextBox
         id='txt-place-of-birth'
         label="Place of Birth"
      />

      const dob = <ChakraTextBox
         id='txt-dob'
         label="Date of Birth"
         size='small'
         variant='standard'
         type="date"
         max={new Date().toLocaleDateString().split('/').reverse().join('-')}
         InputLabelProps={{ shrink: true }}
         fullWidth
      />

      const maritalStatus = <ChakraSelect
         id='txt-marital-status'
         label="Marital Status"
         allowDefaultEmptySelection
      >
         {
            Object.values(MARITAL_STATUS).map(status => {
               return <option value={status} key={status}>
                  {status.toUpperCase()}
               </option>
            })
         }
      </ChakraSelect>

      const address = <ChakraTextBox
         id='txt-address'
         label="Address"
         multiline
      />

      const telephone = <ChakraTextBox
         id='txt-telephone'
         label="Telephone Number"
         type="number"
      />

      const mobile = <ChakraTextBox
         id='txt-mobile'
         label="Mobile Number"
         type="number"
      />

      const email =<ChakraTextBox
         id='txt-email'
         label="Email address"
         type="email"
      />

      const nextOfKinPhone = <ChakraTextBox
         id='txt-next-of-kin-phone'
         label="Next of kin phone number"
         type="number"
      />

      const friendPhone = <ChakraTextBox
         id='txt-friend-phone'
         label="Friend phone number"
         size='small'
         type="number"
      />


      const insitution = <ChakraTextBox
         id='txt-institution-name'
         label="Institution"
      />

      const location = <ChakraTextBox
         id='txt-location'
         label="Location"
      />

      const relationshipToVictim = <ChakraTextBox
         id='txt-relationship-to-victim'
         label="Relationship to complainant"
      />

      const relationshipToIncident = <ChakraAutoComplete
         id='txt-relationship-to-incident'
         label="Relationship to incident"
         freeSolo
         items={
            Object
               .values(RELATIONSHIP_TO_INCIDENT)
               .map(value => ({ 
                  value, 
                  caption: capitalize.words(value).replaceAll('_', ' '),
               }))
         }
      />

      const whyCompletingFormOnBehalf = <ChakraTextBox
         id='txt-why-completing-form-on-behalf'
         label="Why are you completing the form on behalf of the complainant?"
         multiline
      />

      // create form
      let form;

      if (this.props.electoral) {

         const relationshipToIncidentJSX = this.props.displayRelationshipToIncidentField ? relationshipToIncident : undefined;
         const locationJSX = this.props.displayLocationField ? location : undefined;

         form = <div className="grid grid-cols-2 gap-6">
            {name}
            {surname}

            {dob}
            {gender}

            {mobile}
            {email}
            
            {locationJSX}
            {relationshipToIncidentJSX}

            {address}

         </div>
      } else {

         const insitutionJSX = this.props.displayInstitutionField ? insitution : undefined;
         const relationshipToVictimJSX = this.props.displayRelationshipToVictimField ? relationshipToVictim : undefined;
         const whyCompletingFormOnBehalfJSX = this.props.displayWhyCompletingFormOnBehalfField ? whyCompletingFormOnBehalf : undefined;

         let moreFields

         if (insitutionJSX || relationshipToVictimJSX || whyCompletingFormOnBehalfJSX) {
            moreFields = <>
               <FieldGroupLabel>
                  MORE INFO
               </FieldGroupLabel>

               <div className='grid grid-cols-2 gap-6'>
                  {insitutionJSX}
                  {relationshipToVictimJSX}
                  {whyCompletingFormOnBehalfJSX}
               </div>
            </>
         }

         form = <>
            <FieldGroupLabel>
               BASIC INFO
            </FieldGroupLabel>

            <div className='grid grid-cols-2 gap-6'>
               {name}
               {surname}
            </div>
            
            <div className='grid grid-cols-2 gap-6'>
               {nationalId}
               {gender}
            </div>

            <div className='grid grid-cols-2 gap-6'>
               {placeOfBirth}
               {dob}
            </div>

            <div className='grid grid-cols-2 gap-6'>
               {maritalStatus}
            </div>

            <Divider />

            <Divider />

            <FieldGroupLabel>
               CONTACT DETAILS
            </FieldGroupLabel>

            <div className='grid grid-cols-2 gap-6'>
               {telephone}
               {mobile}
            </div>

            <div className='grid grid-cols-2 gap-6'>
               {address}
               {email}
            </div>

            <div className='grid grid-cols-2 gap-6'>
               {nextOfKinPhone}
               {friendPhone}
            </div>

            {moreFields}

         </>
      }

      return <div className='[&>*]:my-5'>
         {form}
      </div>
   }
}