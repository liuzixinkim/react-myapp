import React, { PureComponent } from 'react';

class Pages extends PureComponent {
  constructor(props) {
    super(props);
        this.state = {
             
        };
  }

  //会在组件挂载后
  componentDidMount() {

  }

  render() {
        let cityList = Object.assign([], this.props.searchResultList)
        return (
            <div className="citylist-wrap">
                {cityList&&cityList.length>0 ? (
                    <div className="sectionView">
                        <label className="sectionText">搜索结果</label>

                        {cityList.map((v, k, array) =>(
                            <div className="spellNameWrap" 
                             key={k} onClick={ ()=> this.props.onSelectCity( v )  }>
                                <label className="spellName" >{v.name}</label>
                            </div>
                        )) }

                    </div>

                ) : ''}

            </div>
        )
  }
}

export default Pages;
