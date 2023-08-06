
import Component from "@xavisoft/react-component";
import AppBar from '@mui/material/AppBar';
import { connect } from "react-redux";
import logo from '../media/img/logo.png';
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import HomeIcon from '@mui/icons-material/Home';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Lock';
import QuitIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { deleteAuthTokens } from '../utils';
import actions from "../actions";


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

function DropDown(props) {

   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);

   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };


   let goToMenu;

   if (![ '/login', '/', '/menu' ].includes(props.currentRoute)) {
      goToMenu = <MenuItem 
         onClick={
            () => {
               window.App.redirect('/menu');
               handleClose();
            }
         } 
         disableRipple>
         <HomeIcon />
         Go to menu
      </MenuItem>
   }

   const user = props.user;
   let fullName, userAvailableOptions;

   if (user) {
      
      fullName = `${user.name} ${user.surname}`;

      userAvailableOptions = <>
         <MenuItem className="pointer-events-none capitalize">
            <MilitaryTechIcon />
            {user.role.replaceAll('_', ' ')}
         </MenuItem>

         <Divider sx={{ my: 0.5 }} />

         {goToMenu}

         <MenuItem 
            onClick={
               () => {
                  logout();
                  handleClose()
               }
            } 
            disableRipple
         >
            <LogoutIcon />
            Logout
         </MenuItem>
      </>

   } else {
      userAvailableOptions = goToMenu
   }

   return (
      <div>

         <Button
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            className="bg-gray-100 text-gray-600"
            disableElevation
            onClick={handleClick}
            endIcon={<ArrowDropDownIcon />}
         >
            {fullName}
         </Button>

         <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
               'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
         >
            
            {userAvailableOptions}

            <MenuItem 
               onClick={
                  () => {
                     exitApp();
                     handleClose();
                  }
               } 
               disableRipple>
               <QuitIcon />
               Exit App
            </MenuItem>


         </StyledMenu>
      </div>
  );
}


function logout() {
   deleteAuthTokens();
   actions.setAuthenticated(false);
   actions.setUser(null);
   window.App.redirect('/login');
}

function exitApp() {
   alert("Not yet implemented");
}


const routeToPageTitleMap = {
   '/': 'LOGIN',
   '/login': 'LOGIN',
   '/menu': 'MENU',
   '/users': 'MANAGE USERS',
   '/cases': 'MANAGE CASES',
   '/reports': 'REPORTS',
};


class NavbarUnconnected extends Component {


   state = {
      mobileNavOpen: false,
   }

   openMobileNav = () => {
      return this.updateState({ mobileNavOpen: true })
   }

   closeMobileNav = () => {
      return this.updateState({ mobileNavOpen: false })
   }

   setDimensions = () => {
      const navbar = document.getElementById('navbar');
      
      const width = navbar.scrollWidth + 'px';
      const height = navbar.scrollHeight + 'px';

      document.documentElement.style.setProperty('--navbar-width', width);
      document.documentElement.style.setProperty('--navbar-height', height);
   }

   componentWillUnmount() {
      this.resizeOberver.disconnect();
   }

   componentDidMount() {
      const resizeOberver = new window.ResizeObserver(this.setDimensions);
      resizeOberver.observe(document.getElementById('navbar'));
      this.resizeOberver = resizeOberver;

      this.setDimensions();
   }

   
   render() {


      let pageTitle;
      const title = routeToPageTitleMap[this.props.currentRoute];

      if (title) {
         pageTitle = <>
            <div className="ml-2 text-3xl text-orange-700">
               |
            </div>

            <div className="ml-2 text-xl text-gray-600 font-extrabold uppercase">
               {title}
            </div>
         </>
      }

      return <AppBar id="navbar" className="bg-transparent">
         <div className="grid grid-cols-[1fr,auto] m-2">
            <div className="v-align">
               <img
                  src={logo}
                  alt=""
                  className="w-[150px]"
               />

               <div className="ml-2 text-3xl text-orange-700 font-extrabold">
                  CASE MANAGEMENT 
               </div>

               {pageTitle}

            </div>

            <div className="h-full v-align ">
               <div className="w-full text-right">
                  <DropDown 
                     user={this.props.user} 
                     currentRoute={this.props.currentRoute}
                  />
               </div>
            </div>
         </div>
      </AppBar>
   }
}



function mapStateToProps(state) {
   const { authenticated, currentRoute, user } = state;
   return { authenticated, currentRoute, user }
}

const Navbar = connect(mapStateToProps)(NavbarUnconnected);
export default Navbar;