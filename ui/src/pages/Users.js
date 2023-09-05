import { normalize } from "normalizr";
import actions from "../actions";
import { hideLoading, showLoading } from "../loading";
import { User as UserSchema } from "../reducer/schema";
import request from "../request";
import Button from '@mui/material/Button';
import swal from 'sweetalert'
import { Fab, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Page from "./Page";
import { connect } from "react-redux";
import UserEditor from "../components/UserEditor";
import AddIcon from '@mui/icons-material/Add';
import { requestConfirmation } from '../utils'
import capitalize from 'capitalize';
import MenuSelect from "../components/MenuSelect";
import Component from "@xavisoft/react-component";
import Editable from "../components/Editable";
import RefreshIcon from '@mui/icons-material/Refresh';
import { NON_SU_ROLES } from "../constants";


class RoleSelector extends Component {

   static roleOptions = Object.values(NON_SU_ROLES).map(role => ({
      value: role,
      caption: role.replaceAll('_', ' ').toUpperCase(),
   }));

   onUserRoleChange = async (role) => {

      if (role === this.props.role)
         return;
      
      try {
         showLoading();

         const userId = this.props._id;
         await request.patch(`/api/users/${userId}`, { set: { role }});

         actions.updateEntity(UserSchema, userId, { role });

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   render() {


      return <MenuSelect
         options={RoleSelector.roleOptions}
         current={this.props.role.replaceAll('_', ' ')}
         onSelect={this.onUserRoleChange}
         disabled={this.props.disabled}
      />
   }
}



class UnconnectedUsers extends Page {

   state = {
      addingUser: false,
   }

   openUserEditor = () => {
      return this.updateState({ addingUser: true });
   }

   closeUserEditor = () => {
      return this.updateState({ addingUser: false });
   }

   deleteUser = async (event) => {
      const _id = event.currentTarget.getAttribute('data-id');
      const user = this.props.users.find(user => user._id === _id);

      if (!user)
         return;

      const fullName = capitalize.words(`${user.name} ${user.surname}`);
      const question = `Do you really want to delete user "${fullName}"`
      const confirmation = await requestConfirmation({ question });

      if (!confirmation)
         return;

      try {

         showLoading();

         await request.delete(`/api/users/${_id}`);
         actions.deleteEntity(UserSchema, _id);
         
      } catch (err) {
         swal(String(err))
      } finally {
         hideLoading();
      }
   }

   attributeUpdatorGenerator = (attribute, _id, currentValue) => {

      return async function(value) {

         if (value === currentValue)
            return;

         const data = {
            set: {
               [attribute]: value
            }
         }

         showLoading();
         
         await request.patch(`/api/users/${_id}`, data);
         actions.updateEntity(UserSchema, _id, data.set);

      }
   }

   fetchUsers = async () => {
      try {

         showLoading();
         
         const res = await request.get('/api/users');
         const users = res.data;
         const normalizedUsers = normalize(users, [ UserSchema ]).entities[UserSchema.key] || {};
         actions.setEntities(UserSchema, normalizedUsers);

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {
      super.componentDidMount();

      if (!this.props.users)
         this.fetchUsers();
   }

   _render() {
      
      let jsx;
      let addUserButton;

      if (this.props.users) {

         let userEditor;

         addUserButton = <Fab 
            className="bg-white" 
            onClick={this.openUserEditor}
            size="small"
         >
            <AddIcon className="text-orange-600" />
         </Fab>

         if (this.state.addingUser) {
            userEditor = <UserEditor
               close={this.closeUserEditor}
            />
         }

         const ownUserId = this.props.user ? this.props.user._id : '';

         jsx = <>

            <Table>

               <TableHead>
                  <TableRow>
                     <TableCell><b>NAME</b></TableCell>
                     <TableCell><b>SURNAME</b></TableCell>
                     <TableCell><b>EMAIL</b></TableCell>
                     <TableCell><b>ROLE</b></TableCell>
                     <TableCell></TableCell>
                  </TableRow>
               </TableHead>

               <TableBody>
                  {
                     this.props.users.map(user => {

                        const { _id, name, surname, email } = user;
                        const disabled = _id === ownUserId;
                        const textColorClass = disabled ? 'text-gray-600 opacity-30' : 'text-red-400';
                        const rowClassName = disabled ? 'pointer-events-none' : '';

                        return <TableRow key={_id} className={rowClassName}>
                           <TableCell>
                              <Editable 
                                 content={name} 
                                 onBlur={this.attributeUpdatorGenerator('name', _id, name)} 
                              />
                           </TableCell>

                           <TableCell>
                              <Editable 
                                 content={surname} 
                                 onBlur={this.attributeUpdatorGenerator('surname', _id, surname)} 
                              />
                           </TableCell>

                           <TableCell>
                              <Editable 
                                 content={email} 
                                 onBlur={this.attributeUpdatorGenerator('email', _id, email)} 
                              />
                           </TableCell>
                           
                           <TableCell>
                              <RoleSelector _id={_id} role={user.role} disabled={disabled} />
                           </TableCell>

                           <TableCell>
                              <IconButton 
                                 disabled={disabled} 
                                 className={textColorClass}
                                 data-id={user._id}
                                 onClick={this.deleteUser}
                              >
                                 <DeleteIcon />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     })
                  }
               </TableBody>
            </Table>

            {userEditor}

         </>

      } else {
         jsx = <div className="h-full w-full vh-align">
            <div className="w-[300px]">
               <p className="text-gray-600">
                  Failed to load users.
               </p>

               <Button onClick={this.fetchUsers}>
                  TRY AGAIN
               </Button>
            </div>
         </div>
      }

      return <div className="page-size grid grid-rows-[1fr,auto]"> 
         <div>
            {jsx}
         </div>

         <div className="bg-orange-600 p-2 text-right">

            <IconButton 
               className="text-white text-4xl mr-3" 
               onClick={this.fetchUsers}
               size="small"
            >
               <RefreshIcon fontSize="inherit" />
            </IconButton>

            {addUserButton}
         </div>
      </div>
   }
}

const mapStateToProps = state => {

   let { users } = state.entities;

   if (users)
      users = Object.values(users);

   const user = state.user;
   return { users, user };

}

const Users = connect(mapStateToProps)(UnconnectedUsers);
export default Users;