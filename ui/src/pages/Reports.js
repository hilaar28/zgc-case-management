import { Button, IconButton } from "@mui/material";
import Page from "./Page";
import swal from "sweetalert";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimelineIcon from '@mui/icons-material/Timeline';
import CaseTrend from "../components/CaseTrend";
import { getMidnightTimestamp, objectToQueryString } from "../utils";
import EditIcon from "@mui/icons-material/Edit";
import CaseFilter from "../components/CaseFilter";


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

   return <div className="bg-gray-50 shadow rounded-xl overflow-hidden pb-6 h-full min-h-[300px]">
      <div className="bg-orange-600 text-white text-sm font-bold py-2 px-4 uppercase">
         {props.title}
      </div>

      {props.children || props.body}
   </div>
}

function NumberedCard(props) {

   const {
      text,
      number,
      bgClassname="bg-orange-600"
   } = props;
   return <div className={`rounded-xl p-4 ${bgClassname}`}>
      <div className="text-3xl text-white font-bold">
         {number}
      </div>
      <div className="text-lg text-gray-300">
         {text}
      </div>
   </div>
}


function PieChart(props) {

   const sum = Object
      .values(props.data)
      .reduce((sum, current) => sum + current, 0);

   if (sum === 0) {
      return <div className="h-full vh-align">
         <div className="text-5xl font-bold text-gray-600">
            0
         </div>
         <div className="ml-2 text-sm">
            CASES
         </div>
      </div>
   }


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

   return <div className="h-align">
      <div className="w-[70%]">
         <Pie data={data} />
      </div>
   </div>
};


export default class Reports extends Page {

   state = {
      summary: null,
      summaryStatisticsFilter: {},
      filterModalOpen: false,
      showingTrend: false,
   }

   closeFilterModal = async (data) => {
      const update = { filterModalOpen: false };

      let reload;
      if (data) {
         update.summaryStatisticsFilter = data;
         
         const keys = Object.keys(data);

         for (let i in keys) {
            const key = keys[i];
            
            if (data[key] !== this.state.summaryStatisticsFilter[key]) {
               reload = true;
               break;
            }
         }
      }

      await this.updateState(update);

      if (reload)
         await this.fetchSummaryStatistics();

   }

   fetchSummaryStatistics = async () => {

      try {

         showLoading();

         // build query
         const { from, to, status, age_range, province, gender } = this.state.summaryStatisticsFilter;
         let query = { status, age_range, province, gender };
         

         if (from)
            query.from = getMidnightTimestamp(from);

         if (to)
            query.to = getMidnightTimestamp(to) + 24 * 3600 * 1000 - 1;

         query = objectToQueryString(query);

         const res = await request.get(`/api/cases/summary?${query}`);
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

         // modals
         let trendModal;

         if (this.state.showingTrend) {
            trendModal = <CaseTrend
               close={() => this.updateState({ showingTrend: false })}
            />
         }

         let filterModal;

         if (this.state.filterModalOpen) {
            filterModal = <CaseFilter
               close={this.closeFilterModal}
               data={this.state.summaryStatisticsFilter}
            />
         }

         // stats
         /// by gender
         let byGender;
         const { gender } = this.state.summary;

         if (gender) {
            byGender = <Statistic title="CASES BY GENDER">
               <PieChart 
                  data={{ 
                     Male: gender.male, 
                     Female: gender.female 
                  }}
               />
            </Statistic>
         }

         /// by status
         let byStatus;
         const { status } = this.state.summary;

         if (status) {
            byStatus = <Statistic title="CASES BY STATUS">
               <PieChart 
                  data={status}
               />
            </Statistic>
         }

         /// by province
         let byProvince;
         const { province } = this.state.summary;

         if (province) {
            byProvince = <Statistic title="CASES BY PROVINCE">
               <PieChart 
                  data={province}
               />
            </Statistic>
         }

         /// by age range
         let byAgeRange;
         const { age_range } = this.state.summary;

         if (age_range) {
            byAgeRange = <Statistic title="CASES BY AGE RANGE">
               <PieChart 
                  data={age_range}
               />
            </Statistic>
         }

         jsx = <div className="h-full grid grid-rows-[1fr,auto]">
            <div className="h-full container overflow-auto">
               <div className="h-full">

                  <div className="border-solid border-[1px] border-[#CCC] rounded-xl mt-6 text-right p-2 text-gray-500 text-xs">

                     <span className="text-sm">
                        FILTERS
                     </span>

                     {
                        Object
                           .keys(this.state.summaryStatisticsFilter)
                           .map(key => {
                              
                              let value = this.state.summaryStatisticsFilter[key];

                              if (!value)
                                 return undefined;

                              if (value instanceof Date)
                                 value = value.toISOString().split('T')[0];

                              return <>
                                 <span className="font-bold text-gray-600 px-2">
                                    {key.replace('_', ' ').toUpperCase()}:
                                 </span>
                                 <span className="text-gray-600">
                                    {value}
                                 </span>
                              </>
                           })
                     }

                     <IconButton onClick={() => this.updateState({ filterModalOpen: true })}>
                        <EditIcon />
                     </IconButton>

                     {filterModal}
                  </div>

                  <div className="my-6">
                     <NumberedCard
                        number={this.state.summary.overdue}
                        text="Overdue cases"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6">
                     {byGender}
                     {byStatus}
                     {byProvince}
                     {byAgeRange}
                  </div>
               </div>
            </div>

            <div className="bg-orange-600 text-white text-right pr-2">
               <Button 
                  variant="contained"
                  size="small"
                  className="bg-white text-orange-600 mr-3"
                  startIcon={<TimelineIcon />} 
                  onClick={() => this.updateState({ showingTrend: true })}
               >
                  TREND
               </Button>
               
               {trendModal}

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