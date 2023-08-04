
import { connect } from 'react-redux';
import Page from './Page';
import { hideLoading, showLoading } from '../loading';
import swal from 'sweetalert';
import request from '../request';
import { normalize } from 'normalizr';
import { Case as CaseSchema } from '../reducer/schema';
import actions from '../actions';
import CaseThumbnail from '../components/CaseThumbnail';
import { Fab, Pagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PAGE_SIZE = 50;

class UnconnectedCases extends Page {


   state = {
      page: 1,
      numberOfCases: 1,
   }

   fetchCases = async (page=this.state.page) => {

      try {

         showLoading();

         const offset = (page - 1) * PAGE_SIZE;
         const res = await request.get(`/api/cases?offset=${offset}&limit=${PAGE_SIZE}`);
         const normalizedCases = normalize(res.data.cases, [ CaseSchema ]);
         actions.setEntities(CaseSchema, normalizedCases.entities.cases);

         const numberOfCases = res.data.count;
         this.updateState({ numberOfCases, page });

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {
      super.componentDidMount();
      this.fetchCases();
   }

   _render() {
      return <div className='page-size grid grid-rows-[1fr,auto]'>
         <div className='overflow-auto'>

            {
               this.props.cases.map(case_ => <CaseThumbnail {...case_} />)
            }
         </div>

         <div className='bg-orange-700 text-white grid grid-cols-[1fr,auto] py-3'>
            <div className='[&_*]:text-white v-align'>
               <Pagination
                  page={this.state.page}
                  count={Math.ceil(this.state.numberOfCases / PAGE_SIZE)}
                  onChange={(e, page) => this.fetchCases(page)}
               />
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
   cases = Object.values(cases)

   return { cases }
}

const Cases = connect(mapStateToProps)(UnconnectedCases);
export default Cases;