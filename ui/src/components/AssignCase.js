import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import Component from "@xavisoft/react-component";
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import TaskAltIcon from '@mui/icons-material/TaskAlt';


export default class AssignCase extends Component {

   state = {
      officers: null,
   }

   assign = async (caseOfficer) => {

      try {
         showLoading();

         const data = { case_officer: caseOfficer._id };
         await request.post(`/api/cases/${this.props.caseId}/assignment`, data);
         this.props.close(caseOfficer);

      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }

   fetchOfficers = async () => {

      try {
         showLoading();

         const res = await request.get('/api/cases/officers');
         const officers = res.data;
         this.updateState({ officers });

      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {
      this.fetchOfficers();
   }

   render() {

      let dialogContent;

      if (this.state.officers) {

         const { officers } = this.state;

         if (officers.length > 0) {
            dialogContent = officers.map(officer => {
               return <div className="border-b-solid border-b-[1px] border-b-[#ccc] p-2 grid grid-cols-[1fr,auto] gap-3">
                  <div>
                     <div className="text-lg font-bold">
                        {officer.name} {officer.surname}
                     </div>

                     <div className="font-bold text-sm mt-2">
                        {officer.active_cases} <span className="text-gray-600">active cases</span>
                     </div>
                  </div>

                  <div className="v-align">
                     <IconButton 
                        className="text-orange-600 text-4xl" 
                        onClick={() => this.assign(officer)}>
                        <TaskAltIcon fontSize="inherit" />
                     </IconButton>
                  </div>
               </div>
            })
         } else {
            dialogContent = <p className="text-xl text-gray-600">
               No case officers added to the system yet.
            </p>
         }

      } else {
         dialogContent = <div className="h-[300px] aspect-square vh-align">
            <div>
               <p className="text-xl text-gray-600 my-3">
                  Failed to load the case officers.
               </p>
               <Button variant="outlined" onClick={this.fetchOfficers}>
                  RETRY
               </Button>
            </div>
         </div>
      }

      return <Dialog open>
         <DialogTitle className="text-gray-600 font-extrabold uppercase">
            Assign case
         </DialogTitle>
         
         <DialogContent dividers>
            {dialogContent}
         </DialogContent>

         <DialogActions>
            <Button onClick={() => this.props.close()}>
               CANCEL
            </Button>
         </DialogActions>
      </Dialog>
   }
}