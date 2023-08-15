import { useState } from "react";
import RightIcon from '@mui/icons-material/ChevronRight';
import DownIcon from '@mui/icons-material/ExpandMore';
import OpenIcon from '@mui/icons-material/Launch';
import { Chip } from "@mui/material";
import { Divider, IconButton } from "@mui/material";
import Case from "./Case";
import { connect } from "react-redux";


function InfoPiece(props) {

   return <div className="inline-block mr-[50px] my-2">
      <span className="inline-block mr-2 text-[10px] text-gray-500 uppercase">
         {props.label}
      </span>
      <span className="inline-block py-2 px-3 text-[10px] text-gray-600 font-bold bg-gray-100 rounded-[5px] capitalize">
         {props.info}
      </span>
   </div>
}


function UnconnectedCaseThumbnail(props) {

   const [ expanded, setExpanded ] = useState(false);
   const [ showingFullCase, setShowingFullCase ] = useState(false);
   const Icon = expanded ? DownIcon : RightIcon;

   let expandedJSX;

   if (expanded) {

      // info pieces
      const { victim, applicant, defendants, recorded_by, case_officer } = props;
      let victimInfoPiece;

      if (victim) {
         victimInfoPiece = <InfoPiece
            label="Complainant"
            info={`${victim.name} ${victim.surname}`}
         />
      }

      let caseOfficerPiece

      if (case_officer) {
         caseOfficerPiece = <InfoPiece
            label="Case officer"
            info={`${case_officer.name} ${case_officer.surname}`}
         />
      }

      let filedByInfoPiece;

      if (applicant) {
         filedByInfoPiece = <InfoPiece
            label="Filed by"
            info={`${applicant.name} ${applicant.surname}`}
         />
      }

      let defendantInfoPiece;

      if (Array.isArray(defendants) && defendants.length > 0) {

         const info = defendants
            .map(defendant => `${defendant.name} ${defendant.surname}`)
            .join(', ');

         defendantInfoPiece = <InfoPiece
            label="Correspondent"
            info={info}
         />
      }

      let recordedByInfoPiece;

      if (recorded_by) {
         recordedByInfoPiece = <InfoPiece
            label="Recorded by"
            info={`${recorded_by.name} ${recorded_by.surname}`}
         />
      }


      let fullCase;

      if (showingFullCase) {
         fullCase = <Case
            _id={props._id}
            close={() => setShowingFullCase(false)}
         />
      } 

      expandedJSX = <div className="grid grid-cols-[1fr,auto]">
         <div>
            <p className="text-xs text-gray-600 my-2 mx-1">
               {props.violation.details}
            </p>

            <div className="mt-3 mx-1">

               {victimInfoPiece}
               {filedByInfoPiece}
               {defendantInfoPiece}
               {recordedByInfoPiece}
               {caseOfficerPiece}

            </div>
         </div>

         <div className="flex items-end">
            <IconButton 
               className="text-orange-600"
               size="large"
               onClick={() => setShowingFullCase(true)}
            >
               <OpenIcon />
            </IconButton>

            {fullCase}
            
         </div>
      </div>
   }

   const DAY_MILLIS = 24 * 3600 * 1000;
   const createdAtDate = new Date(props.createdAt);
   const today = new Date();
   const diffMillis = today - createdAtDate;
   const diffDays = diffMillis / DAY_MILLIS;
   const overdue = diffDays >= props.caseDuration;

   return <div className={`pt-8 px-3 ${overdue ? 'bg-red-50' : ''}`}>
      <div className="grid grid-cols-[1fr,auto]">
         <div>

            <div className="text-gray-700 text-xl font-bold pl-[3px]">
               {props.title}
            </div>

            <div className="mt-2">
               <span className="text-gray-600 text-sm inline-block ml-1 mr-4">
                  {props._id}
               </span>

               <Chip 
                  label={props.status} 
                  size="small" 
                  className="text-white text-xs font-bold bg-orange-700 px-1 py-2" 
               />
            </div>

         </div>

         <div className="h-full v-align">
            <IconButton className="text-4xl text-gray-500" onClick={() => setExpanded(!expanded) }>
               <Icon fontSize="inherit" />
            </IconButton>
         </div>
      </div>

      {expandedJSX}

      <Divider className="mt-4" />
   </div>
}


const mapStateToProps = state => {
   const caseDuration = (state.user || {}).case_duration || 10;
   return { caseDuration }
}

const CaseThumbnail = connect(mapStateToProps)(UnconnectedCaseThumbnail);
export default CaseThumbnail;