import React, { PureComponent } from 'react';
import TabLabelItem from './TabLabelItem.jsx'
class Pages extends PureComponent {
  constructor(props) {
    super(props);
    this.state={};
  }
  //会在组件挂载后
  componentDidMount() {
  }

  getRowData(){
      let propData = Object.assign([], this.props.modalData)
      let mapData = []
      for (let i=0; i<propData.length; i=i+4){
          let arr = []
          if (propData[i]) { arr.push( propData[i])}
          if (propData[i+1]) { arr.push( propData[i+1])}
          if (propData[i+2]) { arr.push( propData[i+2])}
          if (propData[i+3]) { arr.push( propData[i+3])}

          if (arr && arr.length > 0) {
              mapData.push( arr )
          }
      }
      return mapData
  }

  render() {
        let rowData = this.getRowData();
        return (
            <div>
                {rowData.map((v, k) => (
                    <TabLabelItem 
                        key = {k}
                        {...this.props}
                        rowLabelData = { v }
                    />
                ))}
            </div>
        );
  }
}

export default Pages;
