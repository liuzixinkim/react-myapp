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
          <a 
          href="javascript:void(0)" 
          className={`tabLabel ${this.props.focused ? 'focusedColor' : ''} `}
          onClick={ this.props.tabOnPress }
          >
            <span className="tabText">{this.props.tabText}</span>
          </a>
        )
  }
}

export default Pages;
