import { useState } from "react";
import RightIcon from '@mui/icons-material/ChevronRight';
import DownIcon from '@mui/icons-material/ExpandMore';
import { Button, Chip } from "@mui/material";
import { Divider, IconButton } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Case from "./Case";


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


export default function CaseThumbnail(props) {

   const [ expanded, setExpanded ] = useState(false);
   const [ showingFullCase, setShowingFullCase ] = useState(false);
   const Icon = expanded ? DownIcon : RightIcon;

   let expandedJSX;

   if (expanded) {

      const { victim, applicant, defendant, recorded_by, case_officer } = props;

      let victimInfoPiece;

      if (victim) {
         victimInfoPiece = <InfoPiece
            label="Victim"
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

      let fullCase;

      if (showingFullCase) {
         fullCase = <Case
            _id={props._id}
            close={() => setShowingFullCase(false)}
         />
      } 

      expandedJSX = <div className="grid grid-cols-[1fr,auto]">
         <div>
            <p className="text-xs text-gray-600 my-2">
               {props.violation.details}
            </p>

            <div className="mt-3">

               {victimInfoPiece}

               <InfoPiece
                  label="Filed by"
                  info={`${applicant.name} ${applicant.surname}`}
               />

               <InfoPiece
                  label="Defendant"
                  info={`${defendant.name} ${defendant.surname}`}
               />

               <InfoPiece
                  label="Recorded by"
                  info={`${recorded_by.name} ${recorded_by.surname}`}
               />

               {caseOfficerPiece}

            </div>
         </div>

         <div className="flex items-end">
            <Button 
               variant="contained" 
               className="bg-orange-600" 
               endIcon={<ArrowForwardIcon />}
               size="small"
               onClick={() => setShowingFullCase(true)}
            >
               MORE
            </Button>

            {fullCase}
            
         </div>
      </div>
   }

   return <div className="py-4 px-3">
      <div className="grid grid-cols-[1fr,auto]">
         <div>
            <div>
               <span className="text-gray-600 text-sm inline-block ml-1 mr-4">
                  {props._id}
               </span>

               <Chip 
                  label={props.status} 
                  size="small" 
                  className="text-white text-xs font-bold bg-orange-700 px-1 py-2" 
               />
            </div>

            <div className="text-gray-700 text-xl font-bold pl-[3px]">
               {props.title}
            </div>
         </div>

         <div className="h-full v-align">
            <IconButton className="text-4xl text-gray-500" onClick={() => setExpanded(!expanded) }>
               <Icon fontSize="inherit" />
            </IconButton>
         </div>
      </div>

      {expandedJSX}

      <Divider className="my-4" />
   </div>
}