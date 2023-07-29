
import Component from "@xavisoft/react-component";
import AppBar from '@mui/material/AppBar';
import { connect } from "react-redux";


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

      return <AppBar id="navbar" className='bg-gradient-to-br from-white to-purple-300'>
         
      </AppBar>
   }
}



function mapStateToProps(state) {
   const { authenticated, currentRoute } = state;
   return { authenticated, currentRoute }
}

const Navbar = connect(mapStateToProps)(NavbarUnconnected);
export default Navbar;