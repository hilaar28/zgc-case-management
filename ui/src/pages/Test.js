import SelectOrType from "../components/SelectOrType";
import Page from "./Page";


export default class Test extends Page {
   _render() {
      return <div className="p-8">
         <SelectOrType
            items={[
               { caption: 'A', value: 'A' },
               { caption: 'B', value: 'B' },
            ]}
            id="txt-select"
            label="Test me"
         />
      </div>
   }
}