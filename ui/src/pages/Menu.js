import Page from "./Page";
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArticleIcon from '@mui/icons-material/Article';


function Option(props) {

   let onClick = props.onClick;

   if (!onClick) {
      onClick = () => {
         window.App.redirect(props.path);
      }
   }

   return <div 
      className="vh-align border-solid border-current border-2 aspect-square text-orange-900 cursor-pointer hover:scale-[1.03]"
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


export default class Menu extends Page {

   _render() {
      
      return <div className="page-size vh-align">
         <div className="w-[500px] grid grid-cols-2 gap-2">
            <Option icon={AddIcon} caption="Add case" onClick={() => alert("Not yet implemented")} />
            <Option icon={ArticleIcon} caption="View Cases" path="/cases" />
            <Option icon={PeopleIcon} caption="Manage users" path="/users" />
            <Option icon={AssessmentIcon} caption="Reports"  path="/reports" />
         </div>
      </div>
   }
}