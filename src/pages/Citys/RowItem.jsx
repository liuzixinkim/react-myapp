/**
 * description: 
 * 数据分组为行 
 * 按行 数据渲染
 */
import React, { PureComponent } from 'react'
import LabelItem from './LabelItem.jsx'

class RowItem extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){
    }

    getRowData(){
        let propData = Object.assign([], this.props.itemData)
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
        //最近访问/热门城市 列表
        let rowData = this.getRowData()

        //字母顺序城市列表 this.props.isLetterRow = true
        let letterRowData = Object.assign([], this.props.itemData2)
        return (
            <div>
            {this.props.isLetterRow ? (
                <div>
                <div className="sortLettersWrap" >
                    <label className="sortLetters">{this.props.letter}</label>
                </div>
                {letterRowData.map((v, k, array) =>(
                        <div className="spellNameWrap"
                             key={k}
                            onClick={ ()=> this.props.labelOnPress( v )  } >
                            <label className="spellName" >{v.name}</label>
                        </div>

                ))}
                </div>
            ) : (
                <div >
                    {rowData.map((v, k) => (
                        <LabelItem 
                            key = {k}
                            {...this.props}
                            rowLabelData = { v } />
                    ))}
                </div>
            )}
            </div>
        );
    }
}

export default RowItem;