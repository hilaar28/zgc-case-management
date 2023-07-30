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

   fetchUsers = async () => {
      try {

         showLoading();
         
         const res = await request.get('/api/users');
         const users = res.data;
         const normalizedUsers = normalize(users, [ UserSchema ]).entities[UserSchema.key];
         actions.setEntities(UserSchema, normalizedUsers);

         console.log(normalizedUsers);

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {
      super.componentDidMount();
      this.fetchUsers();
   }

   _render() {
      
      let jsx;

      if (this.props.users.length) {

         let userEditor;

         if (this.state.addingUser) {
            userEditor = <UserEditor
               close={this.closeUserEditor}
            />
         }

         const ownUserId = this.props.user._id;

         jsx = <>
            <h1 className="text-3xl font-extrabold">Users</h1>

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

                        const disabled = user._id === ownUserId;

                        const textColorClass = disabled ? 'text-gray-600 opacity-30' :'text-red-400'

                        return <TableRow key={user._id}>
                           <TableCell>{user.name}</TableCell>
                           <TableCell>{user.surname}</TableCell>
                           <TableCell>{user.email}</TableCell>
                           <TableCell>{user.role.replaceAll('_', ' ').toUpperCase()}</TableCell>

                           <TableCell>
                              <IconButton disabled={disabled} className={textColorClass}>
                                 <DeleteIcon />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     })
                  }
               </TableBody>
            </Table>

            {userEditor}

            <Fab 
               className="bg-orange-600 text-white absolute bottom-[30px] right-[30px]" 
               onClick={this.openUserEditor}
               size="small"
            >
               <AddIcon />
            </Fab>
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

      return <div className="page-size relative">
         {jsx}
      </div>
   }
}

const mapStateToProps = state => {

   let { users } = state.entities;
   users = Object.values(users);
   const user = state.user;

   return { users, user };

}

const Users = connect(mapStateToProps)(UnconnectedUsers);
export default Users;