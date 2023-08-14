
import { connect } from 'react-redux';
import Page from './Page';
import { hideLoading, showLoading } from '../loading';
import swal from 'sweetalert';
import request from '../request';
import { normalize } from 'normalizr';
import { Case as CaseSchema } from '../reducer/schema';
import actions from '../actions';
import CaseThumbnail from '../components/CaseThumbnail';
import { Button, Checkbox, Fab, IconButton, MenuItem, Pagination, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CASE_STATUS } from '../backend-constants';
import capitalize from 'capitalize';
import RefreshIcon from '@mui/icons-material/Refresh';
import { objectToQueryString } from '../utils';

const PAGE_SIZE = 50;
const ALL_STATUS_FILTER = 'all';


class UnconnectedCases extends Page {


   state = {
      page: 1,
      numberOfCases: 1,
      status: ALL_STATUS_FILTER,
      showOverdueOnly: false,
   }

   fetchCases = async (page=this.state.page, status=this.state.status, showOverdueOnly=this.state.showOverdueOnly) => {

      try {

         showLoading();

         const offset = (page - 1) * PAGE_SIZE;
         const statusFilter = status === ALL_STATUS_FILTER ? '' : status;
         const overdue = showOverdueOnly ? true: undefined;

         const queryOptions = {
            offset,
            status: statusFilter,
            overdue,
            limit: PAGE_SIZE,
         }

         const queryString = objectToQueryString(queryOptions)
         const res = await request.get(`/api/cases?${queryString}`);

         const normalizedCases = normalize(res.data.cases, [ CaseSchema ]).entities[CaseSchema.key] || {};
         actions.setEntities(CaseSchema, normalizedCases);

         const numberOfCases = res.data.count;
         this.updateState({ numberOfCases, page, status, showOverdueOnly });

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {
      super.componentDidMount();

      if (!this.props.cases)
         this.fetchCases();
   }

   _render() {

      let cases;

      if (this.props.cases) {

         if (this.props.cases.length > 0) {
            cases = this.props.cases.map(case_ => <CaseThumbnail {...case_} />);
         } else {
            cases = <p className='text-gray-600 text-2xl px-4'>
               No cases yet.
            </p>
         }

      } else {
         cases = <div className='h-full vh-align'>
            <div className='w-[300px]'>
               <p className='text-lg text-gray-600'>
                  Failed to load cases.
               </p>

               <Button onClick={this.fetchCases}>
                  RETRY
               </Button>
            </div>
         </div>
      }

      return <div className='page-size grid grid-rows-[1fr,auto]'>
         <div className='overflow-auto py-5'>
            {cases}
         </div>

         <div className='bg-orange-700 text-white grid grid-cols-[1fr,auto] py-3'>
            <div className='[&_*]:text-white v-align'>
               <Pagination
                  page={this.state.page}
                  count={Math.ceil(this.state.numberOfCases / PAGE_SIZE)}
                  onChange={(e, page) => this.fetchCases(page)}
               />

               <span className='text-xs font-bold pl-10'>
                  FILTER BY STATUS
               </span>

               <Select
                  value={this.state.status}
                  onChange={e => this.fetchCases(1, e.target.value)}
                  select
                  size="small"
                  className='ml-5 border-[#FFF]'
               >
                  <MenuItem value={ALL_STATUS_FILTER}>All</MenuItem>
                  {
                     Object
                        .values(CASE_STATUS)
                        .map(value => (
                           <MenuItem key={value} value={value}>
                              {capitalize.words(value.replaceAll('_', ' '))}
                           </MenuItem>
                        ))
                  }
               </Select>

               <div className='inline-block mx-3'>
                  <Checkbox
                     onChange={e => this.fetchCases(1, ALL_STATUS_FILTER, e.target.checked)}
                     checked={this.state.showOverdueOnly}
                  />
                  <span className='text-sm font-bold'>Only show overdue</span>
               </div>

               <IconButton className='ml-5 text-3xl' onClick={this.fetchCases}>
                  <RefreshIcon fontSize='inherit' />
               </IconButton>
            </div>

            <div className='h-full v-align pr-3'>
               <Fab
                  onClick={actions.openCaseEditor}
                  size='small'
                  className='bg-white text-orange-700'
               >
                  <AddIcon />
               </Fab>
            </div>
         </div>
      </div>
   }
}

const mapStateToProps =(state) => {

   let { cases } = state.entities;

   if (cases)
      cases = Object.values(cases)

   return { cases }
}

const Cases = connect(mapStateToProps)(UnconnectedCases);
export default Cases;