
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Divider } from "@mui/material";
import Component from "@xavisoft/react-component";
import DatePicker from "./DatePicker";
import { AGE_RANGES, CASE_STATUS, GENDER, PROVINCES } from "../backend-constants";
import { ageRangeToWords, delay } from "../utils";
import { v4 as uuid } from 'uuid';


function Label(props) {
   return <div className="text-gray-600 text-sm font-bold my-2">
      {props.children}
   </div>
}


export default class CaseFilter extends Component {

   id = 'div-' + uuid()

   state = {

   }

   submit = () => {
      const { from, to } = this.state;
      const status = document.getElementById('txt-status').value;
      const province = document.getElementById('txt-province').value;
      const gender = document.getElementById('txt-gender').value;
      const age_range = document.getElementById('txt-age-range').value;

      this.props.close({
         from,
         to,
         status,
         province,
         gender,
         age_range,
      });

   }

   reset = () => {

      this.updateState({ from: undefined, to: undefined });

      document
         .getElementById(this.id)
         .querySelectorAll('select')
         .forEach(elem => {
            elem.value = '';
         });

   }

   async componentDidMount() {

      const { from, to } = this.props.data;
      this.updateState({ from, to });

      await delay(100);

      Object
         .keys(this.props.data)
         .forEach(key => {
            try {
               const id = `txt-${key.replaceAll('_', '-')}`;
               document.getElementById(id).value = this.props.data[key];
            } catch (err) {
               console.log(err)
            }
         });

   }

   render() {
      return <Dialog open>
         <DialogTitle>
            FILTER
         </DialogTitle>

         <DialogContent dividers>

            <div id={this.id}>
               <div className="text-xs">
                  <Label>TIME RANGE</Label>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        FROM: <DatePicker
                           value={this.state.from}
                           onChange={from => this.updateState({ from })}
                        />
                     </div>

                     <div>
                        TO: <DatePicker
                           value={this.state.to}
                           onChange={to => this.updateState({ to })}
                        />
                     </div>
                  </div>

                  <Divider className="my-4" />

               </div>

               <div>
                  <Label>STATUS</Label>
                  <select 
                     className="border-solid border-[#ccc] border-[1px] rounded px-2 py-1 text-sm"
                     id="txt-status"
                  >
                     <option value="">ALL</option>
                     {
                        Object
                           .values(CASE_STATUS)
                           .map(value => {
                              return <option value={value} key={value}>
                                 {value}
                              </option>
                           })
                     }
                  </select>
                  <Divider className="my-4" />
               </div>

               <div>
                  <Label>PROVINCE</Label>
                  <select 
                     className="border-solid border-[#ccc] border-[1px] rounded px-2 py-1 text-sm"
                     id="txt-province"
                  >
                     <option value="">ALL</option>
                     {
                        Object
                           .values(PROVINCES)
                           .map(value => {
                              return <option value={value} key={value}>
                                 {value}
                              </option>
                           })
                     }
                  </select>
                  <Divider className="my-4" />
               </div>

               <div>
                  <Label>GENDER</Label>
                  <select 
                     className="border-solid border-[#ccc] border-[1px] rounded px-2 py-1 text-sm"
                     id="txt-gender"
                  >
                     <option value="">ALL</option>
                     {
                        Object
                           .keys(GENDER)
                           .map(key => {
                              const value = GENDER[key];
                              return <option value={value} key={value}>
                                 {key}
                              </option>
                           })
                     }
                  </select>
                  <Divider className="my-4" />
               </div>

               <div>
                  <Label>AGE RANGE</Label>
                  <select 
                     className="border-solid border-[#ccc] border-[1px] rounded px-2 py-1 text-sm"
                     id="txt-age-range"
                  >
                     <option value="">ALL</option>
                     {
                        AGE_RANGES
                           .map(value => {
                              return <option value={value} key={value}>
                                 {ageRangeToWords(value)}
                              </option>
                           })
                     }
                  </select>
                  <Divider className="my-4" />
               </div>
            </div>
         </DialogContent>

         <DialogActions>
            <Button variant="contained" onClick={this.submit}>
               SAVE
            </Button>
            <Button variant="outlined" onClick={this.reset}>
               RESET
            </Button>
            <Button onClick={() => this.props.close()}>
               CANCEL
            </Button>
         </DialogActions>
      </Dialog>
   }
}