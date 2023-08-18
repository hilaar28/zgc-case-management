import Component from "@xavisoft/react-component";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { errorToast } from '../toast';
import swal from 'sweetalert';
import { hideLoading, showLoading } from '../loading';
import request from '../request';


export default class CaseUpdateEditor extends Component {

   submit = async () => {

      const txtUpdate = document.getElementById('txt-update');
      const description = txtUpdate.value;

      if (!description) {
         errorToast('Describe the updates');
         return txtUpdate.focus();
      }

      try {
         showLoading();

         const { caseId } = this.props;

         let url = `/api/cases/${caseId}/updates`;
         let method, data, updateId;

         if (this.props.mode === 'edit') {
            updateId = this.props.update._id;
            url = `${url}/${updateId}`;
            method = "patch";
            data =  { set: { description }};
         } else {
            method = 'post';
            data = { description }
         }

         const res = await request[method](url, data);

         if (this.props.mode === 'add') {

            const { _id } = res.data;
            this.props.close({ 
               _id, 
               description, 
               createdAt: new Date()
            });

         } else {
            this.props.close({ description });
         }

      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {

      if (this.props.mode === 'edit') {
         setTimeout(() => {
            const { description } = this.props.update;
            document.getElementById('txt-update').value = description;
         }, 100)
      }
   }

   render() {

      const shrink = this.props.mode === 'edit' ? true : undefined;

      return <Dialog open>
         <DialogTitle>Case update</DialogTitle>

         <DialogContent dividers>
            <div className="w-[250px]">
               <TextField
                  id="txt-update"
                  label="What did you do?"
                  fullWidth
                  multiline
                  variant="standard"
                  size="small"
                  InputLabelProps={{
                     shrink,
                  }}
               />
            </div>
         </DialogContent>

         <DialogActions>
            <Button variant="contained" onClick={this.submit}>
               SAVE
            </Button>
            <Button onClick={() => this.props.close()}>
               CANCEL
            </Button>
         </DialogActions>
      </Dialog>
   }
}
