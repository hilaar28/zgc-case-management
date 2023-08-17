
export default function ChakraCheckbox(props) {

   const onChange = props.onChange || (() => {});

   const dataProps = {};

   Object.keys(props).forEach(prop => {
      if (prop.indexOf('data-') === 0) {
         dataProps[prop] = props[prop];
      }
   });
   
   return <div className="v-align">
      <input  
         id={props.id} 
         type="checkbox" 
         onChange={e => onChange(e.target.checked)}
         checked={props.checked}
         defaultChecked={props.defaultChecked}
         {...dataProps}
      />
      
      <span className="inline-block text-gray-600 text-sm ml-2 font-[500]">{props.label}</span>
   </div>
}