import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { errorToast } from '../toast';
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import actions from "../actions";
import { User as UserSchema } from "../reducer/schema";
import { NON_SU_ROLES } from "../constants";


export default class UserEditor extends Component {

   state = { role: '' }

   onRoleChange = (event) => {
      const role = event.target.value;
      this.updateState({ role });
   }

   submit = async () => {
      // presense check
      const txtName = document.getElementById('txt-name');
      const txtSurname = document.getElementById('txt-surname');
      const txtEmail = document.getElementById('txt-email');
      const txtRole = document.getElementById('txt-role');

      const name = txtName.value;
      const surname = txtSurname.value;
      const email = txtEmail.value;
      const role = this.state.role;

      if (!name) {
         errorToast('Provide the name of the user');
         return txtName.focus();
      }

      if (!surname) {
         errorToast('Provide the surname of the user');
         return txtSurname.focus();
      }
      
      if (!email) {
         errorToast('Provide the email of the user');
         return txtEmail.focus();
      }
      
      if (!role) {
         errorToast('Select the role of the user');
         return txtRole.focus();
      }

      // save data
      try {

         showLoading();

         // submit
         const data = { name, surname, email, role };
         const res = await request.post('/api/users', data);
         
         // add to store
         const { _id } = res.data;

         data._id = _id;
         actions.addEntity(UserSchema, data);

         // close
         this.props.close();
         
      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   render() {

      return <Dialog open>
         <DialogTitle className="text-gray-600 font-extrabold">
            ADD USER
         </DialogTitle>

         <DialogContent dividers>
            <div className="max-w-[400px] grid grid-cols-2 gap-6">
               <TextField
                  id="txt-name"
                  label="Name"
                  variant="outlined"
                  size="small"
                  fullWidth
               />

               <TextField
                  id="txt-surname"
                  label="Surname"
                  variant="outlined"
                  size="small"
                  fullWidth
               />
               
               <TextField
                  id="txt-email"
                  label="Email"
                  variant="outlined"
                  size="small"
                  type="email"
                  fullWidth
               />
               
               <TextField
                  id="txt-role"
                  label="Role"
                  variant="outlined"
                  size="small"
                  fullWidth
                  select
                  value={this.state.role}
                  onChange={this.onRoleChange}
               >
                  {
                     Object.values(NON_SU_ROLES).map(role => {
                        return <MenuItem value={role} id={role}>
                           {role.replaceAll('_', ' ').toUpperCase()}
                        </MenuItem>
                     })
                  }
               </TextField>
            </div>
         </DialogContent>

         <DialogActions>

            <Button onClick={this.submit} variant="contained" size="small">
               SAVE
            </Button>

            <Button onClick={this.props.close}>
               CLOSE
            </Button>
         </DialogActions>
      </Dialog>
   }
}