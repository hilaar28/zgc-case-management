
import Component from '@xavisoft/react-component';
import { v4 } from 'uuid';


const OTHER = 'other';

export default class SelectOrType extends Component {
   
   state = {
      selected: '', // the value on the dropdown
      value: '', // the actual value
   }

   id = 'txt-' + v4();

   getId = () => this.props.id || this.id;

   getSelectedFromValue = (value) => {

      if (value === '') {
         if (this.state.selected === OTHER)
            return OTHER;
         else
            return '';
      }

      let selected = OTHER;

      for (let i in this.props.items) {
         if (this.props.items[i].value === value) {
            selected = value;
            break;
         }
      }

      return selected;
      
   }

   syncStateWithPropsValue = () => {
      
      const propsValue = this.props.value;
      const value = this.state.value;

      if (!propsValue)
         return;

      if (propsValue === value)
         return;

      const selected = this.getSelectedFromValue(propsValue)
      this.updateState({ value: propsValue, selected });

   }

   onSelectChange = async (e) => {

      const selected = e.target.value;
      const value = selected === OTHER ? '' : selected;

      await this.updateState({ selected, value });
      this.dispatchOnChangeEvent(value);

   }

   dispatchOnChangeEvent = (value) => {
      if (typeof this.props.onChange === 'function')
         this.props.onChange(value);
   }

   onTextChange = async (e) => {
      const value = e.target.value;
      await this.updateState({ value });
      this.dispatchOnChangeEvent(value);
   }

   componentDidUpdate() {
      this.syncStateWithPropsValue();
   }

   componentDidMount() {

      // sync value with props
      this.syncStateWithPropsValue();

      // setup value interceptors
      const id = this.getId();
      const elem = document.getElementById(id);

      try {
         Object.defineProperty(elem, 'value', {
            set: (value) => {

               // return if controlled
               if (this.props.value)
                  return;

               // update state
               const selected = this.getSelectedFromValue(value);
               this.updateState({ value, selected });

            },
            get: () => {
               return this.state.value;
            }
         });
      } catch (err) {}
   }

   render() {

      let textbox, gridCols, selectBg;
      const inputPy = 'py-1';

      if (this.state.selected === OTHER) {

         textbox = <div className={`px-2 ${inputPy}`}>
            <input
               value={this.state.value}
               onChange={this.onTextChange}
               className='outline-none w-full'
            />
         </div>

         gridCols = "grid-cols-[auto,1fr]";
         selectBg = 'bg-[#ccc] shadow text-gray-600 font-bold';
      } else {
         gridCols = "grid-cols-1"
      }

      const select = <div className={`px-2 ${inputPy} ${selectBg}`}>
         <select
            onChange={this.onSelectChange}
            value={this.state.selected}
            className='outline-none w-full bg-transparent'
         >
            <option value="" />

            {
               this.props.items.map(item => {
                  const { value, caption } = item;

                  return <option key={value} value={value}>
                     {caption}
                  </option>
               })
            }

            <option value={OTHER}>
               Other
            </option>
         </select>
      </div>

      return <div id={this.getId()} data-input>
         <div className="text-gray-600 text-sm font-[500] mb-2">{this.props.label}</div>
         <div 
            className={`grid ${gridCols} rounded border-solid border-[#ccc] border-[1px]`}
         >
            {select}
            {textbox}
         </div>
      </div>
   }
}