import Page from "./Page";
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArticleIcon from '@mui/icons-material/Article';
import request from '../request';
import actions from "../actions";
import { USER_ROLES } from "../backend-constants";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import { showLoading, hideLoading } from '../loading'


function thisRoleOrHigher(minRole, role) {
   const roles = [
      USER_ROLES.AGENT,
      USER_ROLES.CASE_OFFICER,
      USER_ROLES.INVESTIGATING_OFFICER,
      USER_ROLES.SUPERVISOR,
      USER_ROLES.SUPER_ADMIN,
   ];

   const minRolePos = roles.indexOf(minRole);
   if (minRolePos === -1)
      throw new Error('Unknown user role: ' + minRole);

   const rolePos = roles.indexOf(role);

   return rolePos >= minRolePos;
   
}


function Option(props) {

   let onClick = props.onClick;

   if (!onClick) {
      onClick = () => {
         window.App.redirect(props.path);
      }
   }

   const disabledClasses = props.disabled ? 'pointer-events-none opacity-50' : ''

   return <div 
      className={`vh-align border-solid border-current border-[1px] aspect-square text-orange-900 cursor-pointer hover:scale-[1.03] ${disabledClasses} rounded-${props.roundedCorner}-2xl`}
      onClick={onClick}
   >

      <div className="text-center">
         <div className="text-7xl text-gray-600">
            <props.icon fontSize="inherit" />
         </div>

         <div className="text-2xl mt-3">
            {props.caption}
         </div>
      </div>
   </div>
}


class UnconnectedMenu extends Page {


   fetchUserData = async () => {
      try {

         showLoading();
         
         const res = await request.get('/api/accounts');
         const user = res.data;
         actions.setUser(user);

      } finally {
         hideLoading();
      }
   }


   componentDidMount() {

      super.componentDidMount();

      this.fetchUserData();

   }

   _render() {


      let jsx;

      if (this.props.user) {

         const userRole = this.props.user.role;

         jsx = <div className="w-[500px] grid grid-cols-2 gap-2">
            <Option icon={AddIcon} caption="Add case" onClick={actions.openCaseEditor} roundedCorner='tl' />
            <Option icon={ArticleIcon} caption="View Cases" path="/cases" roundedCorner='tr' />
            <Option icon={PeopleIcon} caption="Manage users" path="/users" disabled={userRole !== USER_ROLES.SUPER_ADMIN} roundedCorner='bl' />
            <Option icon={AssessmentIcon} caption="Reports"  path="/reports" disabled={!thisRoleOrHigher(USER_ROLES.SUPERVISOR, userRole)} roundedCorner='br' />
         </div>
      } else {
         jsx = <div className="w-[300px]">
            <p className="text-gray-600 text-lg">
               Failed to load user data.
            </p>

            <Button onClick={this.fetchUserData}>
               TRY AGAIN
            </Button>
         </div>
      }
      
      return <div className="page-size vh-align">
         {jsx}
      </div>
   }
}


const mapStateToProps = (state) => {
   const { user } = state;
   return { user };
}


const Menu = connect(mapStateToProps)(UnconnectedMenu);
export default Menu;