



import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { errorToast } from "../toast";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import swal from "sweetalert";
import { delay } from "../utils";
import EditIcon from '@mui/icons-material/Edit';
import { v4 } from "uuid";

const STAGES = {
   EMAIL: 'email',
   CODE: 'code',
}

export default class ResetPassword extends Component {

   id = 'dlg-' + v4() 

   state = {
      stage: STAGES.EMAIL,
      email: '',
   }

   submitEmail = async (email) => {
      try {

         showLoading();

         const data = { email }
         await request.post('/api/accounts/password-reset', data);

         this.updateState({ email, stage: STAGES.CODE });
         return true;

      } catch (err) {
         swal(String(err));
         return false
      } finally {
         hideLoading();
      }
   }

   retrieveAndSubmitEmail = async () => {

      // presence check
      const txtEmail = document
         .getElementById(this.id)
         .querySelector('#txt-email');

      const email = txtEmail.value;

      if (!email) {
         errorToast('Provide your email');
         return txtEmail.focus();
      }

      const success = await this.submitEmail(email);

      if (success) {
         await delay(100);
         
         const txtCode = document
            .getElementById(this.id)
            .querySelector('#txt-code');

         txtCode.value = '';
      }

   }

   retrieveAndSubmitCode = async () => {

      // presence check
      const txtCode = document
         .getElementById(this.id)
         .querySelector('#txt-code');

      const code = txtCode.value;

      if (!code) {
         errorToast('Provide your reset code');
         return txtCode.focus();
      }

      try {

         showLoading();

         await request.post(`/api/accounts/password-reset/${code}/verification`);
         await swal('Password reset successfully');
         this.props.close();

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   render() {

      let dialogContent, submit;

      switch (this.state.stage) {

         case STAGES.EMAIL:
            dialogContent = <>
               <TextField
                  variant="standard"
                  size="small"
                  label="Your email"
                  id="txt-email"
                  type="email"
                  fullWidth
               />
            </>

            submit = this.retrieveAndSubmitEmail;

            break;

         case STAGES.CODE:
            dialogContent = <>

               <div className="text-gray-600 text-sm">
                  A new password and a reset code have been sent to <b>{this.state.email}</b>
                  <br />
                  <Button 
                     size="small" 
                     onClick={() => this.updateState({ stage: STAGES.EMAIL })}
                     startIcon={<EditIcon />}
                  >
                     CHANGE EMAIL
                  </Button>
               </div>

               <TextField
                  variant="standard"
                  size="small"
                  placeholder="Reset code"
                  id="txt-code"
                  type="text"
                  fullWidth
               />

               <div 
                  onClick={() => this.submitEmail(this.state.email)}
                  className="cursor-pointer underline text-blue-600 text-sm"
               >
                  Resend password and reset code
               </div>
            </>

            submit = this.retrieveAndSubmitCode;
            break;

         default:
            break;
      }

      return <Dialog open id={this.id}>

         <DialogTitle>Reset password</DialogTitle>

         <DialogContent>
            <div className="max-w-[400px] [&>*]:my-2">
               {dialogContent}
            </div>
         </DialogContent>

         <DialogActions>
            <Button variant="contained" size="small" onClick={submit}>
               SUBMIT
            </Button>

            <Button size="small" onClick={this.props.close}>
               CANCEL
            </Button>
         </DialogActions>
      </Dialog>
   }
}