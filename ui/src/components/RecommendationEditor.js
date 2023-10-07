import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { errorToast } from "../toast";
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import { delay } from "../utils";


export default class RecommendationEditor extends Component {


   submit = async () => {
      // extract
      const txtRecommendation = document.getElementById('txt-recommendation');
      const recommendation = txtRecommendation.value;

      if (!recommendation) {
         errorToast("Write your recommendation");
         return txtRecommendation.focus();
      }

      // check if anything changed (in edit mode)
      const { previousRecommendation } = this.props;

      if (previousRecommendation && previousRecommendation === recommendation) {
         errorToast("No changes made");
         return txtRecommendation.focus();
      }

      try {

         // send to backend
         showLoading();

         const data = { recommendation };
         const caseIdEncoded = encodeURIComponent(this.props.caseId);
         const url = `/api/cases/${caseIdEncoded}/recommendation`;

         await request.post(url, data);

         // report back
         this.props.close(recommendation);

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   async componentDidMount() {
      if (this.props.previousRecommendation) {
         await delay(200);
         document.getElementById('txt-recommendation').value = this.props.previousRecommendation;
      }
   }

   render() {

      let shrink;

      if (this.props.previousRecommendation)
         shrink = true;

      return <Dialog open>
         <DialogTitle>Recommendation</DialogTitle>
         <DialogContent>
            <TextField
               id="txt-recommendation"
               label="Recommendation"
               size="small"
               variant="standard"
               multiline
               InputLabelProps={{ shrink }}
            />
         </DialogContent>
         <DialogActions>
            <Button variant="contained" size="small" onClick={this.submit}>
               SAVE
            </Button>
            <Button size="small" onClick={() => this.props.close()}>
               CANCEL
            </Button>
         </DialogActions>
      </Dialog>
   }
}