import { Button, IconButton } from "@mui/material";
import Page from "./Page";
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import RefreshIcon from '@mui/icons-material/Refresh';


Chart.register(ArcElement, Tooltip, Legend);


const backgroundColor = [
   '#8da2dd',
   '#4a2ac0',
   '#f9b3c7',
   '#fe5cb7',
   '#d539c5',
   '#dd3c3c',
   '#4ed9b6',
   '#d86500',
   '#e2f300',
   '#fc2a6e'
]


function Statistic(props) {

   return <div className="bg-gray-50 shadow rounded-xl overflow-hidden pb-6">
      <div className="bg-orange-600 text-white text-sm font-bold py-2 px-4 uppercase">
         {props.title}
      </div>

      {props.children || props.body}
   </div>
}


function PieChart(props) {

   const labels = [];
   const dataset = {
      data: [],
      backgroundColor,
   }

   Object.keys(props.data).forEach(label => {
      
      const value = props.data[label];
      dataset.data.push(value);
      labels.push(label);

   });

   const data = {
      labels,
      datasets: [ dataset ],
   }

  return <Pie data={data} options={{}} />;
};


export default class Reports extends Page {

   state = {
      summary: null
   }

   fetchSummaryStatistics = async () => {

      try {

         showLoading();

         const res = await request.get('/api/cases/summary');
         const summary = res.data;
         this.updateState({ summary });

      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {
      super.componentDidMount();
      this.fetchSummaryStatistics();
   }

   _render() {

      let jsx;

      if (this.state.summary) {

         jsx = <div className="h-full grid grid-rows-[1fr,auto]">
            <div className="h-full container overflow-auto">
               <div className="h-full">
                  <div className="grid grid-cols-2 gap-6 pt-6">
                     <Statistic title="CASES BY GENDER">
                        <div className="h-align">
                           <div className="w-[70%]">
                              <PieChart 
                                 data={{ 
                                    Male: this.state.summary.gender.male, 
                                    Female: this.state.summary.gender.female 
                                 }}
                              />
                           </div>
                        </div>
                     </Statistic>
                     <Statistic title="CASES BY STATUS">
                        <div className="h-align">
                           <div className="w-[70%]">
                              <PieChart 
                                 data={this.state.summary.status}
                              />
                           </div>
                        </div>
                     </Statistic>
                     <Statistic title="CASES BY PROVINCE">
                        <div className="h-align">
                           <div className="w-[70%]">
                              <PieChart 
                                 data={this.state.summary.province}
                              />
                           </div>
                        </div>
                     </Statistic>
                  </div>
               </div>
            </div>

            <div className="bg-orange-600 text-white text-right pr-2">
               <IconButton className="text-white text-3xl" onClick={this.fetchSummaryStatistics}>
                  <RefreshIcon fontSize="inherit" />
               </IconButton>
            </div>
         </div>

      } else {
         jsx = <div className="h-full vh-align">
            <div>
               <p className="text-xl text-gray-600 my-3">
                  Failed to load data.
               </p>
               <Button onClick={this.fetchSummaryStatistics} variant="outlined" size="small">
                  RETRY
               </Button>
            </div>
         </div>
      }
  
      return <div className="page-size">
         {jsx}
      </div>
   }
}