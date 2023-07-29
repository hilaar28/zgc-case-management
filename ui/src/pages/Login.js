
import { Button, TextField } from "@mui/material";
import Page from "./Page";
import { errorToast } from '../toast';
import request from '../request';
import { hideLoading, showLoading } from "../loading";
import swal from 'sweetalert'
import actions from "../actions";
import { decodeJWT } from "../utils";
import { getAuthToken } from '@xavisoft/auth/frontend/utils';
import { delay } from "../utils";
import logo from '../media/img/logo.png';

export default class Login extends Page {

   login = async () => {

      const txtEmail = document.getElementById('txt-email');
      const txtPassword = document.getElementById('txt-password');

      const email = txtEmail.value;
      const password = txtPassword.value;

      if (!email) {
         errorToast('Provide email');
         return txtEmail.focus();
      }

      if (!password) {
         errorToast('Provide password');
         return txtPassword.focus();
      }

      const data = { email, password };

      try {

         showLoading();

         await request.post('/api/login', data);
         actions.setAutheticated();
         window.App.redirect('/menu');

      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading();
      }
      
   }

   componentDidMount() {
      super.componentDidMount();
      checkAuthentication();
   }


   _render() {

      return <div className="page-size">

         <div className="h-full w-full vh-align">
            <div
               id="div-form" 
               className="w-[90%] max-w-[400px] rounded-xl p-3 [&>*]:my-3 shadow-lg bg-gray-100"
            >

               <div>
                  <img src={logo} alt="" className="w-[90%]" />
               </div>
            
               <span className="block text-xl text-orange-900 text-center font-bold">
                  CASE MANAGEMENT SYSTEM
               </span>

               <TextField
                  id="txt-email"
                  label="Email"
                  fullWidth
                  variant="filled"
                  size="small"
                  type="email"
               />

               <TextField
                  id="txt-password"
                  label="Password"
                  fullWidth
                  variant="filled"
                  size="small"
                  type="password"
               />

               <Button variant="contained" size="large" className="bg-orange-500 rounded-2xl" onClick={this.login} fullWidth>
                  LOGIN 
               </Button>

            </div>
         </div>
         
      </div>
   }
}


async function checkAuthentication() {

	// check if auth token is valid
	const accessToken = getAuthToken();
	
	if (!accessToken)
		return false;

	const { exp } = decodeJWT(accessToken);

	if (exp <= Date.now()) 
		return false;

	// consider as logged in
	actions.setAutheticated(true);
   await delay(200)
	window.App.redirect('/dashboard');
   
   return true;

}

export {
   checkAuthentication
}