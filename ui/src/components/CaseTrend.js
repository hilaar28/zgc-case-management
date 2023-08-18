
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Component from "@xavisoft/react-component";
import { hideLoading, showLoading } from "../loading";
import { convertEpochToYYYYMMDD, getMidnightTimestamp, objectToQueryString } from "../utils";
import request from "../request";
import swal from "sweetalert";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DatePicker from "./DatePicker";
import { TREND_PERIODS } from "../backend-constants";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



export default class CaseTrend extends Component {

   state = {
      data: null,
      from: undefined,
      to: undefined,
      period: TREND_PERIODS.MONTHLY,
   }

   fetchData = async () => {

      try {

         showLoading();

         let query = {
            period: this.state.period
         };

         if (this.state.from)
            query.from = getMidnightTimestamp(this.state.from);

         if (this.state.to)
            query.to = getMidnightTimestamp(this.state.to) + 24 * 3600 * 1000 - 1;

         query = objectToQueryString(query);

         const res = await request.get(`/api/cases/trend?${query}`);
         const data = res.data;
         this.updateState({ data });

      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }

   async componentDidMount() {

      // set time range
      const monthBefore = new Date();
      monthBefore.setDate(monthBefore.getDate() - 30);

      const from = monthBefore;
      const to = new Date();

      await this.updateState({ from, to });

      // fetch data
      this.fetchData();
   }
   
   render() {

      let dialogContent;

      if (this.state.data) {

         const labels = [];
         const dataset = {
            data: [],
            backgroundColor: '#FB8C00',
            borderColor: '#FB8C00',
            label: 'Case count'
         }

         this.state.data.forEach(item => {

            const label = convertEpochToYYYYMMDD(item.start);
            const value = item.count;
            
            dataset.data.push(value);
            labels.push(label);

         });

         const data = {
            labels,
            datasets: [ dataset ],
         }
         
         dialogContent = <div className="p-8">

            <div className="border-solid border-[1px] border-[#CCC] rounded-xl mt-6 text-center py-2 text-gray-500 text-xs font-bold">

               <div className="inline-grid grid-cols-[auto,auto,auto] gap-4">
                  <div>
                     FROM: <DatePicker
                        value={this.state.from}
                        max={this.state.to || new Date()}
                        onChange={
                           async (from) => {
                              await this.updateState({ from });
                              this.fetchData();
                           }
                        }
                     />
                  </div>

                  <div>
                     TO: <DatePicker
                        value={this.state.to}
                        min={this.state.from}
                        max={new Date()}
                        onChange={
                           async (to) => {
                              await this.updateState({ to });
                              this.fetchData();
                           }
                        }
                     />
                  </div>

                  <div>
                     <span className="pl-6">PERIOD:</span>
                     <select 
                        value={this.state.period} 
                        className="rounded px-2 py-1 bg-gray-50 border-solid border-[1px] border-[#ccc]"
                        onChange={
                           async (e) => {
                              const period = e.target.value;
                              await this.updateState({ period });
                              this.fetchData();
                           }
                        }
                     >
                        {
                           Object
                              .values(TREND_PERIODS)
                              .map(value => {
                                 return <option value={value} key={value}>
                                    {value}
                                 </option>
                              })
                        }
                     </select>
                  </div>
               </div>
            </div>

            <div className="h-align mt-[60px]">
               <div className="w-[70%]">
                  <Line
                     data={data}
                     options={{
                        scales: {
                           y: {
                              ticks: {
                                 precision: 0,
                              }
                           }
                        }
                     }}
                  />
               </div>
            </div>
         </div>
      } else {
         dialogContent = <div className="h-full vh-align">
            <div>
               <p className="text-xl text-gray-600 py-2">
                  Failed to load data.
               </p>

               <Button variant="outlined" onClick={this.fetchData} size="small">
                  RETRY
               </Button>
            </div>
         </div>
      }

      return <Dialog open fullScreen>

         <DialogTitle className="text-gray-600 font-extrabold">
            CASE TREND
         </DialogTitle>

         <DialogContent dividers>
            {dialogContent}
         </DialogContent>

         <DialogActions>
            <Button onClick={this.props.close}>
               CLOSE
            </Button>
         </DialogActions>
      </Dialog>
   }
}