
import Component from "@xavisoft/react-component";
import { connect } from "react-redux";



function Copyright() {
   return <div className="text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Zimbabwe Gender Commission
   </div>
}


function Developers() {
   return <div className="text-right pr-6 text-xs text-gray-500">
      Developers: <a 
         href="https://qurious.consulting"
         className="no-underline text-orange-800 font-bold"
      >Quorious Consulting</a> & <a 
         href="https://xavisoft.co.zw"
         className="no-underline text-orange-800 font-bold"
      >Xavisoft Digital</a>
   </div>
}


class FooterUnconnected extends Component {

   setDimensions = () => {
      const footer = document.getElementById('footer');
      
      const width = footer.scrollWidth + 'px';
      const height = footer.scrollHeight + 'px';

      document.documentElement.style.setProperty('--footer-width', width);
      document.documentElement.style.setProperty('--footer-height', height);
   }

   componentWillUnmount() {
      this.resizeOberver.disconnect();
   }

   componentDidMount() {
      const resizeOberver = new window.ResizeObserver(this.setDimensions);
      resizeOberver.observe(document.getElementById('footer'));
      this.resizeOberver = resizeOberver;

      this.setDimensions();
   }

   render() {

      let jsx = <div 
            className="py-7 bg-gradient-to-br from-orange-300 to-white" 
      >
         <Copyright />
         <Developers />
      </div>

      return <footer id="footer">
         {jsx}
      </footer> 
   }
}

function mapStateToProps(state) {
   const { currentRoute } = state;
   return { currentRoute }
}

const Footer = connect(mapStateToProps)(FooterUnconnected)
export default Footer