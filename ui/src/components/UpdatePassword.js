
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { errorToast } from "../toast";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import swal from "sweetalert";


export default class UpdatePassword extends Component {


   submit = async () => {

      // presence check
      const txtOldPassword = document.getElementById('txt-old-password');
      const txtNewPassword = document.getElementById('txt-new-password');
      const txtConfirm = document.getElementById('txt-confirm');
      

      const old_password = txtOldPassword.value;
      const new_password = txtNewPassword.value;
      const confirm = txtConfirm.value;

      if (!old_password) {
         errorToast('Provide your current password');
         return txtOldPassword.focus();
      }

      if (!new_password) {
         errorToast('Provide your new password');
         return txtNewPassword.focus();
      }

      if (!confirm) {
         errorToast('Confirm your new password');
         return txtConfirm.focus();
      }

      if (confirm !== new_password) {
         errorToast('Passwords not matching');
         txtNewPassword.value = '';
         txtConfirm.value = '';
         return txtNewPassword.focus();
      }

      try {

         showLoading();

         const data = { new_password, old_password }

         await request.post('/api/accounts/new-password', data);
         swal('Password updated successfully');

         this.props.close();

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   render() {

      return <Dialog open>

         <DialogTitle>Update password</DialogTitle>

         <DialogContent>
            <div className="max-w-[400px] [&>*]:my-2">

               <TextField
                  variant="standard"
                  size="small"
                  label="Current password"
                  id="txt-old-password"
                  fullWidth
                  type="password"
               />

               <TextField
                  variant="standard"
                  size="small"
                  label="New password"
                  id="txt-new-password"
                  fullWidth
                  type="password"
               />

               <TextField
                  variant="standard"
                  size="small"
                  label="Confirm"
                  id="txt-confirm"
                  fullWidth
                  type="password"
               />
            </div>
         </DialogContent>

         <DialogActions>
            <Button variant="contained" size="small" onClick={this.submit}>
               SUBMIT
            </Button>

            <Button size="small" onClick={this.props.close}>
               CANCEL
            </Button>
         </DialogActions>
      </Dialog>
   }
}