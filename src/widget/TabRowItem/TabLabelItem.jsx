import React, { PureComponent } from 'react';

class Pages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //会在组件挂载后
  componentDidMount() {
  }

  render() {
        return (
            <div className="tabItemRow">
             {this.props.rowLabelData.map((v, k) => (
                <div key = {k}
                 onClick={()=> this.props.tabLabelItemOnPress( v, this.props.activeTab )  }>
                    <div className="tabItem">
                        <label className="tabLabelItem">
                            {typeof(v.name) == 'object' ? v.name.name : v.name}
                        </label>
                    </div>
                </div>
            ))}
            </div>
        );
  }
}

export default Pages;
