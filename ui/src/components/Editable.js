import Component from "@xavisoft/react-component";
import { v4 } from "uuid";
import { hideLoading } from "../loading";
import swal from "sweetalert";
import { errorToast } from "../toast";


export default class Editable extends Component {

   id = 'id-' + v4()

   state = {
      focused: false
   }


   focus = async () => {
      
      await this.updateState({ focused: true });

      const elem = document.getElementById(this.id);
      elem.focus();
      elem.value = this.props.content;

   }

   blur = () => {
      return this.updateState({ focused: false });
   }



   submit = async () => {

      const elem = document.getElementById(this.id);
      const value = elem.value;

      if (!value) {
         errorToast('You are trying to submit an empty field');
         return elem.focus();
      }
         
      try {

         await this.props.onBlur(value);
         this.blur();

      } catch (err) {
         await swal(String(err));
         this.focus();
      } finally {
         hideLoading();
      }
   }

   render () {

      let jsx;

      if (this.state.focused) {

         const commonProps = {
            className: 'p-1',
            id: this.id
         }

         if (this.props.multiline) {
            jsx = <textarea {...commonProps} />
         } else {
            jsx = <input {...commonProps} />
         }
         
      } else {
         jsx = this.props.content;
      }

      return <div
         onBlur={this.submit}
         onClick={this.focus}
      >
         {jsx}
      </div>
   }
}