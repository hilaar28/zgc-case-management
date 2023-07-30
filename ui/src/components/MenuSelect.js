import { Button, Menu, MenuItem } from "@mui/material";
import Component from "@xavisoft/react-component";
import DropDownIcon from '@mui/icons-material/ArrowDropDown';
import { v4 as uuid } from 'uuid';


export default class MenuSelect extends Component {

   id = 'mnu-' + uuid();

   state = {
      open: false
   }

   openMenu = () => {
      return this.updateState({ open: true })
   }

   closeMenu = () => {
      return this.updateState({ open: false })
   }

   render() {

      let menu;

      if (this.state.open) {
         menu = <Menu 
            open 
            anchorEl={() => document.getElementById(this.id) }
         >
            {
               this.props.options.map(option => {

                  const { value, caption } = option;
                  return <MenuItem 
                     key={value} 
                     value={value} 
                     onClick={
                        () => {
                           this.props.onSelect(value);
                           this.closeMenu();
                        }
                     }
                  >
                     {caption}
                  </MenuItem>
               })
            }
         </Menu>
      }

      return <>
         <Button 
            endIcon={<DropDownIcon />} 
            variant="outlined" 
            onClick={this.openMenu} 
            id={this.id}
         >
            {this.props.current}
         </Button>
         {menu}
      </>

      
   }
}