import React, { PureComponent } from 'react'

class LabelItem extends PureComponent {
    render() {

        return (
            <div className="sectionRow">
             {this.props.rowLabelData.map((v, k) => (
                <div className="sectionLabelWrap"
                  key = {k} onClick={()=> this.props.labelOnPress( v )  } >
                    <label className="sectionLabel" >
                        {v.name}
                    </label>
                </div>
            ))}
            </div>
        );
    }
}

export default LabelItem;
