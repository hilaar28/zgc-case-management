import Component from "@xavisoft/react-component";
import { v4 } from "uuid";
import ChakraAutoComplete from "./ChakraAutoComplete";
import { VIOLATION_NATURE } from "../backend-constants";
import { IconButton } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';


function ViolationNature(props) {

   const { nature, sub_nature } = props;
   const _onChange = props.onChange || (() => {})

   const onChange = (nature, sub_nature) => {

      if (!nature)
         return _onChange(undefined);

      _onChange({ nature, sub_nature });

   }

   return <div className="grid grid-cols-[1fr,1fr,auto] gap-6 my-2">
      <ChakraAutoComplete
         value={nature}
         placeholder="Type"
         onChange={nature => onChange(nature, sub_nature) }
         items={
            Object
               .keys(VIOLATION_NATURE)
               .map(value => ({
                  caption: value,
                  value,
               }))
         }
      />
      <ChakraAutoComplete
         value={sub_nature}
         placeholder="Sub-type"
         onChange={sub_nature => onChange(nature, sub_nature) }
         disabled={!(nature && VIOLATION_NATURE[nature])}
         items={
            VIOLATION_NATURE[nature] ? 
               VIOLATION_NATURE[nature].map(value => ({ value, caption: value })) : []
         }
      />

      <div className="v-align h-full">
         <IconButton
            colorScheme='blue'
            icon={<DeleteIcon />}
            onClick={props.delete}
            disabled={props.disableDelete}
            variant={"outline"}
            className={props.disableDelete ? 'pointer-events-none opacity-50' : ''}
            size={"lg"}
         />
      </div>
   </div>
}


export default class ViolationNatureInput extends Component {

   id = 'txt-' + v4()

   state = {
      natures: [ undefined ]
   }

   getId = () => this.props.id || this.id

   updateNature = (position, value) => {
      const natures = [ ...this.state.natures ]
      natures[position] = value;
      return this.updateState({ natures });
   }

   removeNature = (position) => {
      const natures = this.state.natures
         .slice(0, position)
         .concat(this.state.natures.slice(position + 1));

      return this.updateState({ natures });
   }

   addNature = () => {
      const natures = [ ...this.state.natures, undefined ];
      return this.updateState({ natures });
   }

   componentDidMount() {
      // add proxy on .value
      try {
         const id = this.getId();
         const elem = document.getElementById(id);

         Object.defineProperty(elem, 'value', {
            set: (natures) => {
               // validate natures
               if (!Array.isArray(natures))
                  return;
               
               this.updateState({ natures });
            },
            get: () => {
               return this.state.natures;
            }
         })
      } catch (err) {
         console.log(err);
      }
   }

   render() {

      return <div id={this.getId()} data-input>
         <label>{this.props.label}</label>

         {
            this.state.natures
               .map((nature, i) => {
                  return <ViolationNature
                     nature={nature ? nature.nature : ''}
                     sub_nature={nature ? nature.sub_nature : ''}
                     onChange={nature => this.updateNature(i, nature)}
                     delete={() => this.removeNature(i)}
                     disableDelete={this.state.natures.length === 1}
                  />
               })
         }

         <div className="text-right border-t-solid border-t-[#ccc] border-t-[1px] pt-1">
            <IconButton
               colorScheme='blue'
               variant={"outline"}
               icon={<AddIcon />}
               onClick={this.addNature}
               size={"sm"}
            />
         </div>

      </div>
   }
}