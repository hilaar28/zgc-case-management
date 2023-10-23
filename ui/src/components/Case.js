import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from "@mui/material";
import Component from "@xavisoft/react-component";
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import { useState } from "react";
import CollapsIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandIcon from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import CaseUpdateEditor from "./CaseUpdateEditor";
import TimeAgo from 'react-timeago';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ageRangeToWords, requestConfirmation } from '../utils'
import CloseIcon from '@mui/icons-material/Close';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import IosShareIcon from '@mui/icons-material/IosShare';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { CASE_STATUS, USER_ROLES } from "../backend-constants";
import actions from "../actions";
import { Case as CaseSchema } from "../reducer/schema";
import ReferCase from "./ReferCase";
import AssignCase from "./AssignCase";
import DoneIcon from '@mui/icons-material/Done';
import capitalize from "capitalize";
import anonymousImg from '../media/img/anonymous.png';
import ChakraCheckbox from "./ChakraCheckbox";
import { connect } from "react-redux";
import RecommendationEditor from "./RecommendationEditor";
import DownloadIcon from '@mui/icons-material/Download';
import { css } from '@emotion/css';


const hideButtonsCssClass = css({
   '& button': {
      opacity: `0 !important`
   }
})


// helpers
function stringifyNumericDate(date) {

   if (!date)
      return '';
   
   const { year, month, day } = date;
   date = '';

   if (year) {
      date = String(year);

      if (month) {
         date += `/${String(month).padStart(2, '0')}`;

         if (day)
            date += `/${String(day).padStart(2, '0')}`;
      }
   }

   return date
}

function timestampToReadableDateAndTime(timestamp) {

   const date = new Date(timestamp);

   const dayOfMonth = date.getDate().toString().padStart(2, 0);
   const month = (date.getMonth() + 1).toString().padStart(2, 0);
   const year = date.getFullYear();
   const strDate = `${year}/${month}/${dayOfMonth}`;
   
   const hour = date.getHours().toString().padStart(2, 0);
   const minute = date.getMinutes().toString().padStart(2, 0);
   const strTime = `${hour}:${minute}`

   return `${strDate} — ${strTime}`;

}

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

   const anonymous = details.anonymous;
   delete details.anonymous;

   const [ showAnyway, setShowAnyway ] = useState(!anonymous);
   let anonymityControl;

   if (anonymous) {

      if (!showAnyway) {
         try {
            for (const key in details) {
               const value = details[key];
               details[key] = value.replace(/\S/g, "●");
            }
         } catch (err) {}
      }

      anonymityControl = <div className="grid grid-cols-[auto,1fr] gap-4 mt-6">
         <img 
            src={anonymousImg} 
            alt="" 
            className="h-[50px]"
         />

         <ChakraCheckbox
            onChange={setShowAnyway}
            checked={showAnyway}
            label="Show anyway"
         />
      </div>

   }

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
                        <div className="uppercase text-gray-500 font-bold text-xs">
                           {key.replaceAll('_', ' ')}
                        </div>

                        <div className="text-gray-500 text-xs">
                           {details[key]}
                        </div>
                     </>
                  })
            }
         </div>
      </div>

      {anonymityControl}
   </div>
}

function Question(props) {

   const [ expanded, setExpanded ] = useState(false);

   const ultimateExpanded = props.forceExpand || expanded;
   const Icon = ultimateExpanded ? CollapsIcon : ExpandIcon;

   let answer;

   if (ultimateExpanded) {
      answer = <p className="text-sm">
         {props.answer}
      </p>
   }


   return <div className="grid grid-cols-[auto,1fr]">
      <div>
         <IconButton onClick={() => setExpanded(!expanded)}>
            <Icon />
         </IconButton>
      </div>
      <div className="mt-[10px]">
         <div className="text-sm font-bold">
            {props.question}
         </div>

         {answer}
      </div>
   </div>
}

function Tag(props) {
   return <span 
      className={`uppercase text-gray-600 bg-gray-100 text-xs px-3 py-1 font-bold rounded-lg inline-block ${props.className}`}
   >
      {props.children}
   </span>
}

function CaseUpdate(props) {

   let createdAt;

   if (props.showActualTime)
      createdAt = timestampToReadableDateAndTime(props.createdAt);
   else
      createdAt = <TimeAgo date={props.createdAt} />

   return <div className="my-4 mx-3 bg-gray-50 shadow p-3">
      <p className="text-xs mb-2">
         {props.description}
      </p>

      <div className="grid grid-cols-[auto,1fr]">

         <div>
            <Tag>
               {createdAt}
            </Tag>
         </div>
            
         <div className="text-right pr-3">
            <IconButton className="text-sm" onClick={props.edit}>
               <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton className="text-sm" onClick={props.delete} color="error">
               <DeleteIcon fontSize="inherit" />
            </IconButton>
         </div>
      </div>

   </div>
}

function WitnessDetails(props) {

   let { anonymous, details } = props;
   const [ showAnyway, setShowAnyway ] = useState(!anonymous);

   let anonymityControl;

   if (anonymous) {
      if (!showAnyway) {
         details = details.replace(/\S/g, "●");
      }

      anonymityControl = <div className="grid grid-cols-[auto,1fr] gap-4 mt-3">
         <img 
            src={anonymousImg} 
            alt="" 
            className="h-[32px]"
         />

         <ChakraCheckbox
            onChange={setShowAnyway}
            checked={showAnyway}
            label="Show anyway"
         />
      </div>
   }

   

   const body = <div>
      <p className="text-xs text-gray-600">
         {details}
      </p>
      {anonymityControl}
   </div>

   return <Section
      title={"WITNESS DETAILS"}
      body={body}
   />
}

function canUpdateCase(_case, user) {

   if (_case.status !== CASE_STATUS.IN_PROGRESS)
      return false;

   const role = user.role;
   if ([ USER_ROLES.DIRECTOR, USER_ROLES.MANAGER, USER_ROLES.SUPER_ADMIN ].includes(role))
      return true;

   if (role === USER_ROLES.INVESTIGATING_OFFICER) {
      if (user._id === _case.assigned_to._id)
         return true;
      else
         return false;
   }

   return false;
}

function canAddRecommendation(role) {
   return [ USER_ROLES.MANAGER, USER_ROLES.SUPER_ADMIN].includes(role);
}

// the component
class UnconnectedCase extends Component {

   state = {
      case_: null,
      updateEditorMode: null,
      updateBeingUpdated: null,
      caseReferralModalOpen: false,
      assignCaseModalOpen: false,
      recommendationEditorOpen: false,
      generatingPDF: false,
   }

   openRecommendationEditor = () => {
      return this.updateState({ recommendationEditorOpen: true });
   }

   closeRecommendationEditor = (recommendation) => {

      const updates = { recommendationEditorOpen: false };

      if (recommendation) {
         updates.case_ = { ...this.state.case_, recommendation };
      }

      return this.updateState(updates);
   }

   openAssignCaseModal = () => {
      return this.updateState({ assignCaseModalOpen: true })
   }

   closeAssignCaseModal  = (assigned_to) => {
      const updates = { assignCaseModalOpen: false };

      if (assigned_to) {
         const caseUpdate = { assigned_to, status: CASE_STATUS.IN_PROGRESS }
         updates.case_ = { ...this.state.case_, ...caseUpdate };
         actions.updateEntity(CaseSchema, this.props._id, caseUpdate );
      }

      return this.updateState(updates)
   }

   openCaseReferralModal = () => {
      return this.updateState({ caseReferralModalOpen: true })
   }

   closeCaseReferralModal = (data) => {
      const updates = { caseReferralModalOpen: false };

      if (data) {
         updates.case_ = { ...this.state.case_, ...data };
      }

      return this.updateState(updates)
   }

   openUpdateEditor = (updateEditorMode, updateBeingUpdated=null) => {
      return this.updateState({ updateEditorMode, updateBeingUpdated })
   }

   closeUpdateEditor = (data) => {

      const updates = {
         updateEditorMode: null,
         updateBeingUpdated: null,
      }

      if (data) {

         let caseUpdates;

         if (this.state.updateEditorMode === 'add') {
            caseUpdates = [ ...this.state.case_.updates, data];
         } else {
            const updateId = this.state.updateBeingUpdated._id;

            caseUpdates = this.state.case_.updates.map(update => {
               if (update._id === updateId) {
                  return { ...update, ...data }
               }

               return update;
            });
         }


         updates.case_ = { ...this.state.case_, updates: caseUpdates }
      }

      return this.updateState(updates)
   }

   deleteCaseUpdate = async (_id) => {

      const question = 'Are you sure?';
      const confirm = await requestConfirmation({ question });

      if (!confirm)
         return;

      try {

         showLoading();

         const caseIdEncoded = window.encodeURIComponent(this.props._id);
         await request.delete(`/api/cases/${caseIdEncoded}/updates/${_id}`);
         
         const updates = this.state.case_.updates.filter(update => update._id !== _id);
         const case_ = { ...this.state.case_, updates };

         this.updateState({ case_ });

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      } 
   }

   markAsResolved = async () => {
      try {

         showLoading();

         const update = { status: CASE_STATUS.RESOLVED };
         const caseIdEncoded = window.encodeURIComponent(this.props._id);
         
         await request.post(`/api/cases/${caseIdEncoded}/status`, update);
         
         const case_ = { ...this.state.case_, ...update };
         actions.updateEntity(CaseSchema, this.props._id, update);

         this.updateState({ case_ });

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
       
   }

   fetchData = async () => {

      try {

         showLoading();

         const caseIdEncoded = window.encodeURIComponent(this.props._id);
         const res = await request.get(`/api/cases/${caseIdEncoded}`);

         const case_ = res.data;

         this.updateState({ case_ });

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   reject = async () => {

      const question = "Are you sure to reject this case?";
      const confirm = await requestConfirmation({ question });

      if (!confirm)
         return;

      try {

         showLoading();

         const update = { status: CASE_STATUS.REJECTED };
         
         const caseIdEncoded = window.encodeURIComponent(this.props._id);
         await request.post(`/api/cases/${caseIdEncoded}/status`, update);
         
         const case_ = { ...this.state.case_, ...update };
         this.updateState({ case_ });
         actions.updateEntity(CaseSchema, this.props._id, update)

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   refer = async () => {
      this.openCaseReferralModal();
   }

   assign = async () => {
      this.openAssignCaseModal();
   }

   generatePDF = async () => {

      // set generatingPDF to true
      // so that collapsed elements expand
      await this.updateState({ generatingPDF: true });

      // generate PDF
      const { Worker } = require('html-to-pdf-js');

      const elem = document.getElementById('dialog-content');
      
      const worker = new Worker({
         filename: `Case ${this.props._id}.pdf`,
         pagebreak: { mode: 'avoid-all' }
      });

      worker.from(elem).save();

      // set generatingPDF to false
      await this.updateState({ generatingPDF: false });

   }

   componentDidMount() {

      if (!this.props.user) {
         window.App.redirect('/login');
         return;
      }

      this.fetchData();
   }

   render() {

      let dialogContent;


      const caseToPdfButton = <IconButton onClick={this.generatePDF}>
         <DownloadIcon />
      </IconButton>
      
      const actionButtons = [ caseToPdfButton ];

      if (this.state.case_) {

         // action buttons
         /// add update button
         const { status } = this.state.case_;
         const { user } = this.props;
         const isDirector = [ USER_ROLES.DIRECTOR, USER_ROLES.SUPER_ADMIN ].includes(user.role);

         let referButton, rejectButton, assignButton, markAsResolvedButton;

         if (isDirector) {
            rejectButton = <Button 
               variant="outlined" 
               size="small" 
               startIcon={<ThumbDownIcon />} 
               className="text-orange-600 border-current rounded-full px-6"
               onClick={this.reject}
            >
               REJECT
            </Button>

            assignButton = <Button 
               variant="contained" 
               size="small" 
               startIcon={<PersonAddIcon />} 
               className="bg-orange-600 border-current rounded-full px-6"
               onClick={this.assign}
            >
               ASSIGN
            </Button>

            referButton = <Button 
               variant="outlined" 
               size="small" 
               startIcon={<IosShareIcon />} 
               className="text-orange-600 border-current rounded-full px-6"
               onClick={this.refer}
            >
               REFER
            </Button>

            markAsResolvedButton = <Button 
               variant="contained" 
               size="small" 
               startIcon={<DoneIcon />} 
               className="bg-orange-600 rounded-full px-6"
               onClick={this.markAsResolved}
               >
               RESOLVED
            </Button>
            
         }

         const updateButton = <Button 
            variant="contained" 
            size="small" 
            startIcon={<AddIcon />} 
            className="bg-orange-600 rounded-full px-6"
            onClick={() => this.openUpdateEditor('add')}
         >
            UPDATE
         </Button>

         if (status === CASE_STATUS.IN_PROGRESS) {

            if (!this.state.case_.assigned_to)
               actionButtons.push(assignButton);

            if (canUpdateCase(this.state.case_, user))
               actionButtons.push(updateButton);

            if (this.state.case_.updates.length > 0) {
               actionButtons.push(markAsResolvedButton);
            }
         } else if (status === CASE_STATUS.NOT_ASSESSED) {
            actionButtons.push(rejectButton, assignButton, referButton);
         }

         // personal details
         const { victim, applicant, defendants } = this.state.case_;

         const applicantDetails = <PersonalDetails
            title={"COMPLAINANT" + (victim ? " REPRESENTATIVE" : "")}
            details={applicant}
         />


         let defendantDetails;

         if (Array.isArray(defendants) && defendants.length > 0) {
            defendantDetails = defendants
               .map((defendant, i) => {
                  return <PersonalDetails
                     title={`RESPONDENT #${i+1}`}
                     details={defendant}
                  />
               });
         }

         let victimDetails;

         if (victim) {
            victimDetails = <PersonalDetails
               title="COMPLAINANT"
               details={victim}
            />
         }

         // case officer and recorded by
         let recordedBy, assignedTo;
         const { assigned_to, recorded_by } = this.state.case_;

         if (assigned_to) {
            assignedTo = <InfoPiece
               label="ASSIGNED TO"
               info={`${assigned_to.name} ${assigned_to.surname}`}
            />
         }

         if (recorded_by) {
            recordedBy = <InfoPiece
               label="Recorded By"
               info={`${recorded_by.name} ${recorded_by.surname}`}
            />
         }

         // recommendation section
         let recommendationSectionBody;
         const { recommendation } = this.state.case_;
         const canRecommend = canAddRecommendation(user.role);

         if (recommendation) {

            let editButton;

            if (canRecommend) {
               editButton = <div className="text-right">
                  <IconButton onClick={this.openRecommendationEditor}>
                     <EditIcon className="text-lg" />
                  </IconButton>
               </div>
            }

            recommendationSectionBody = <div>
               <p>
                  {recommendation}
               </p>
               {editButton}
            </div>
         } else {
            recommendationSectionBody = <div className="mt-2">
               <Button 
                  variant="contained" 
                  size="small" 
                  className={`bg-orange-600 ${canRecommend ? '' : 'opacity-50 pointer-events-none'}`}
                  onClick={this.openRecommendationEditor} 
                  startIcon={<AddIcon />} 
               >
                  ADD
               </Button>
            </div>
         }

         let recommendationSection;

         if (!this.state.generatingPDF || recommendation) {
            recommendationSection = <Section
               title="RECOMMENDATION"
               body={recommendationSectionBody}
            />
         }

         // referred to section
         const { referred_to } = this.state.case_;
         let referredToSection;

         if (referred_to) {
            referredToSection = <Section
               title="REFERRED TO"
               body={referred_to}
            />
         }

         // geographic details
         const { province, district, ward, village } = this.state.case_;
         const geographicDetails = { province, district, ward, village };

         const geographicSectionBody = <div className="grid grid-cols-[auto,1fr] gap-2 my-3">
            {
               Object
                  .keys(geographicDetails)
                  .map(key => {
                     const value = geographicDetails[key];

                     if (!value)
                        return undefined;

                     return <>
                        <div className="text-xs text-gray-600 font-bold">
                           {key.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-600">
                           {capitalize.words(value.replaceAll('_', ' '))}
                        </div>
                     </>
                  })
            }
         </div>

         const geographicSection = <Section
            title="GEOGRAPHIC DETAILS"
            body={geographicSectionBody}
         />

         // violation section
         const { violation } = this.state.case_;

         let violationDates;

         if (violation.dates) {
            
            const { from, to } = violation.dates;
            const fromString = stringifyNumericDate(from);
            const toString = stringifyNumericDate(to);

            let info;

            if (fromString || toString) {
               info = `${fromString} — ${toString}`
            }

            if (info) {
               violationDates = <InfoPiece
                  label="DATES"
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

         let violationImpact;

         if (violation.impact) {
            violationImpact = <InfoPiece
               label="IMPACT"
               info={capitalize.words(violation.impact.replaceAll('_', ' '))}
            />
         }

         let violationNatures;

         if (Array.isArray(violation.natures) && violation.natures.length > 0) {
            violationNatures = <div className="grid grid-cols-[auto,1fr] gap-2">
               <span className="font-bold text-gray-600 text-sm">
                  NATURE:
               </span>
               <span className="text-gray-600 text-sm">
                  {
                     violation.natures
                        .map(nature => {
                           let text = nature.nature;

                           if (nature.sub_nature)
                              text += `(${nature.sub_nature})`

                           return text;
                        })
                        .join(', ')
                  }
               </span>
            </div>
         }
         
         let victimAgeRange;

         if (violation.victim_age_range) {
            victimAgeRange = <InfoPiece
               label="COMPLAINANT AGE"
               info={ageRangeToWords(violation.victim_age_range)}
            />
         }

         const violationSectionBody = <>
         
            <p className="text-sm my-3 text-gray-600 mb-3">
               {violation.details}
            </p>

            <div className="my-3">
               {violationNatures}
            </div>

            <div className="my-3">
               {violationDates}
               {violationLocation}
               {violationImpact}

               <InfoPiece
                  label="Still continuing"
                  info={violation.continuing ? 'YES' : 'NO'}
               />

               {victimAgeRange}
            </div>

         </>

         const violationSection = <Section
            title="VIOLATION"
            body={violationSectionBody}
         />

         // witness details
         const { witness } = violation;

         let witnessDetails;

         if (witness) {
            witnessDetails = <WitnessDetails {...witness } />
         }

         // other-entity-reported-to section
         const { other_entity_reported_to } = this.state.case_
         let otherEntityReportedToSection;

         if (other_entity_reported_to) {

            const { details, actions, why_reporting_to_us_as_well } = other_entity_reported_to;

            let actionsJSX;

            if (actions) {
               actionsJSX = <div className="grid grid-cols-[auto,1fr] mt-3">
                  <span className="text-gray-600 font-bold pr-3 text-xs">
                     ACTIONS:
                  </span>
                  <p className="text-xs">
                     {actions}
                  </p>
               </div>
            }

            let whyReportingToUsJSX;

            if (why_reporting_to_us_as_well) {
               whyReportingToUsJSX = <div className="mt-3">
                  <div className="text-xs font-bold text-gray-600">
                     WHY REPORTING TO US AS WELL
                  </div>
                  <p className="text-xs">
                     {why_reporting_to_us_as_well}
                  </p>
               </div>
            }

            const body = <div className="mt-2">
               <p className="text-sm">
                  {details}
               </p>

               {actionsJSX}
               {whyReportingToUsJSX}
            </div>

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

         // questions sections
         const questions = [];

         const {
            why_violation_is_important_to_our_mandate,
            who_referred_you_to_us,
            expectations_from_us,
            more_assistance_required,
         } = this.state.case_;

         if (why_violation_is_important_to_our_mandate) {
            questions.push({
               question: "Why is the violation mentioned a barrier to gender equality?",
               answer: why_violation_is_important_to_our_mandate,
            });
         }

         if (who_referred_you_to_us) {
            questions.push({
               question: "How did you get to know about ZGC?",
               answer: who_referred_you_to_us
            });
         }

         if (expectations_from_us) {
            questions.push({
               question: "What remedy are you expecting to get from the ZGC in this case?",
               answer: expectations_from_us
            });
         }

         if (more_assistance_required) {
            questions.push({
               question: "What other assistance/services do you need?",
               answer: more_assistance_required
            });
         }

         let questionsSection;

         if (questions.length > 0) {
            questionsSection = <Section
               title="QUESTIONS"
               body={
                  questions
                     .map(question => {
                        return <Question
                           {...question}
                           forceExpand={this.state.generatingPDF}
                        />
                     })
               }
            />
         }

         // updates
         let caseUpdatesSectionBody;

         if (this.state.case_.updates.length > 0) {
            caseUpdatesSectionBody = this.state.case_.updates.map(update => {
               return <CaseUpdate 
                  {...update}
                  edit={() => this.openUpdateEditor('edit', update)}
                  delete={() => this.deleteCaseUpdate(update._id)}
                  showActualTime={this.state.generatingPDF}
               />
            });
         } else {
            caseUpdatesSectionBody = <p className="text-sm text-gray-600">
               No updates yet
            </p>
         }

         const caseUpdatesSection = <Section
            title="UPDATES"
            body={caseUpdatesSectionBody}
         />

         // modals
         /// update editor modal
         let updateEditorModal;

         if (this.state.updateEditorMode) {
            updateEditorModal = <CaseUpdateEditor
               mode={this.state.updateEditorMode}
               caseId={this.props._id}
               update={this.state.updateBeingUpdated}
               close={this.closeUpdateEditor}
            />
         }

         /// case referral modal
         let caseReferralModal;

         if (this.state.caseReferralModalOpen) {
            caseReferralModal = <ReferCase
               caseId={this.props._id}
               close={this.closeCaseReferralModal}
            />
         }

         /// assign case modal
         let assignCaseModal;

         if (this.state.assignCaseModalOpen) {
            assignCaseModal = <AssignCase
               caseId={this.props._id}
               close={this.closeAssignCaseModal}
            />
         }

         /// recommendation modal
         let recommendationModal;

         if (this.state.recommendationEditorOpen) {
            recommendationModal = <RecommendationEditor
               caseId={this.props._id}
               previousRecommendation={this.state.case_.recommendation}
               close={this.closeRecommendationEditor}
            />
         }

         // dialog content
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

               <Tag className="text-white bg-orange-600 ml-5">
                  {this.state.case_.status.replaceAll('_', ' ')}
               </Tag>

               <Tag className="ml-5">
                  {this.state.case_.source.replaceAll('_', ' ')}
               </Tag>

               <div className="ml-5 text-sm text-gray-600 font-bold">
                  FILED @ <Tag>
                  {timestampToReadableDateAndTime(this.state.case_.createdAt)}
               </Tag>
               </div>
               
            </div>

            <div className="grid grid-cols-2 gap-6 mt-5">
               {applicantDetails}
               {victimDetails}
               {defendantDetails}
            </div>

            <div className="mt-2">
               {assignedTo}
               {recordedBy}
            </div>

            <Divider className="my-5" />

            {recommendationSection}
            {referredToSection}
            {geographicSection}
            {violationSection}
            {witnessDetails}
            {otherEntityReportedToSection}
            {lawyerDetailsSection}
            {languageSection}
            {questionsSection}
            {caseUpdatesSection}

            {updateEditorModal}
            {caseReferralModal}
            {assignCaseModal}
            {recommendationModal}


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
            <div className="grid grid-cols-[1fr,auto]">
               <div>
                  <b>Case #</b><span className="text-gray-600">{this.props._id}</span>
               </div>

               <div>
                  <IconButton onClick={this.props.close}>
                     <CloseIcon fontSize="large" />
                  </IconButton>
               </div>
            </div>
         </DialogTitle>

         <DialogContent 
            dividers 
            id="dialog-content" 
            className={this.state.generatingPDF ? hideButtonsCssClass : ''}
         >
            {dialogContent}
         </DialogContent>

         <DialogActions>
            <div className="my-2">
               {
                  actionButtons.map(btn => {
                     return <div className="inline-block mx-2">
                        {btn}
                     </div>
                  })
               }
            </div>
         </DialogActions>
      </Dialog>
   }
}

const mapStateToProps = state => {
   const { user} = state;
   return { user }
} 

const Case = connect(mapStateToProps)(UnconnectedCase);
export default Case;