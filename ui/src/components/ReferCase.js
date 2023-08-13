
import Component from '@xavisoft/react-component';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import swal from 'sweetalert';
import { hideLoading, showLoading } from '../loading';
import request from '../request';
import { errorToast } from '../toast';
import { CASE_STATUS } from '../backend-constants';


export default class ReferCase extends Component {

   submit = async () => {

      const txtReferTo = document.getElementById('txt-refer-to');
      const refer_to = txtReferTo.value;

      if (!refer_to) {
         errorToast('Fill in this field');
         return txtReferTo.focus();
      }

      try {

         showLoading();
         await request.post(`/api/cases/${this.props.caseId}/referral`, { refer_to });
         this.props.close({ referred_to: refer_to, status: CASE_STATUS.IN_PROGRESS });

      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }

   render() {

      return <Dialog open>
         <DialogTitle>
            Refer case
         </DialogTitle>

         <DialogContent>
            <div className='w-[300px]'>
               <TextField
                  id='txt-refer-to'
                  label="Who are you referring to?"
                  size='small'
                  variant='standard'
                  fullWidth
               />
            </div>
         </DialogContent>

         <DialogActions>
            <Button onClick={this.submit} variant='contained'>
               SUBMIT
            </Button>

            <Button onClick={() => this.props.close()}>
               CANCEL
            </Button>
         </DialogActions>
      </Dialog>
   }
}