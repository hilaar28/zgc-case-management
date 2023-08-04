
import { connect } from 'react-redux';
import Page from './Page';
import { hideLoading, showLoading } from '../loading';
import swal from 'sweetalert';
import request from '../request';
import { normalize } from 'normalizr';
import { Case as CaseSchema } from '../reducer/schema';
import actions from '../actions';
import CaseThumbnail from '../components/CaseThumbnail';

class UnconnectedCases extends Page {

   fetchCases = async () => {

      try {

         showLoading();

         const res = await request.get('/api/cases');
         const normalizedCases = normalize(res.data, [ CaseSchema ]);
         actions.setEntities(CaseSchema, normalizedCases.entities.cases);

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
      return <div>
         <div className='text-2xl font-bold'>
            CASES
         </div>

         {
            this.props.cases.map(case_ => <CaseThumbnail {...case_} />)
         }
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