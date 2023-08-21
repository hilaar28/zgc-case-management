
import Component from '@xavisoft/react-component';
import actions from '../actions';

class Page extends Component {

   componentDidMount() {

      let route;

      if (window.electron) {
         route = window.location.hash.substring(1);
      } else {
         route = window.location.pathname;
      }

      if (!route)
         route = '/';

      actions.setCurrentRoute(route);
      window.scrollTo(0, 0);
      
   }

   _render() {
      return <div>Please implement <code>_render()</code></div>
   }

   render() {
      return <main>
         <div className='page'>
            {this._render()}
         </div>
      </main>
   }

}

export default Page;