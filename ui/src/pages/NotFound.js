import Page from "./Page";


export default class NotFound extends Page {

   _render() {

      return <div className="page-size vh-align">
         <div className="text-xl text-orange-600 tracking-wider">
            <b>404</b> | NOT FOUND
         </div>
      </div>
   }
}