import React, { Component } from 'react';
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import './index.scss';

class AnliDetailSwiper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            currentIdx: 0,
            currentItem: {},
            height: 0
        };
    }
    //会在组件挂载后
    componentWillMount() {
        let _this = this;
        let picArrs = [], idx = 0;

        //console.log(this.props.data.list, _this.props.data.item)
        if (_this.props.data.type === "pic") {
            picArrs = _this.props.data.list;
        } else {
            _this.props.data.list.map((v, k) => {
                picArrs = picArrs.concat(v.data);
            })
        }

        picArrs.map((item, index) => {
            if (item.id === _this.props.data.item.id) {
                idx = index
            }
        })
        _this.setState({
            list: picArrs,
            currentItem: _this.props.data.item
        }, () => {
            new Swiper('.swiper-container', {
                loop: false,
                lazy: true,
                initialSlide: idx,
                pagination: {
                    el: '.swiper-pagination'
                }, on: {
                    slideChange: function () {
                        if (this.activeIndex >= 0 && this.activeIndex <= picArrs.length) {
                            _this.setState({
                                currentIdx: this.activeIndex,
                                currentItem: picArrs[this.activeIndex]
                            })
                        }

                    },
                }
            })
        }
        )
    }
    componentDidMount() {

    }

    preventDefualtFn = (e) => {
        console.log(e);
        e.stopPropagation();
    }

    render() {
        let { list, currentIdx, currentItem } = this.state;
        return (
            <div className="bigImgBox" style={{ height: window.innerHeight }} onClick={() => this.props.parentFn()}>
                <div className="bigImgBoxHeader" id="img_header" onClick={(e)=>this.preventDefualtFn(e)}>
                    <img onClick={() => this.props.parentFn()} className="backBtn" src='http://zx.jiaju.sina.com.cn/App/RN/app/KanTuZhuangXiu/app/img/arrow@3x.png' alt="img" />
                    <div className="desc">{currentItem.space_name}</div>
                </div>
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {
                            list.map((item, key) => (
                                <div key={key} className="swiper-slide">

                                    <div className="box">
                                        <img data-src={item.url} className="swiper-lazy"  onClick={(e)=>this.preventDefualtFn(e)}/>
                                        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>

                                    </div>
                                </div>

                            ))
                        }
                    </div>
                </div>
                <div className="imgFooter" onClick={(e)=>this.preventDefualtFn(e)}>
                    <div className="number">({currentIdx + 1}/{list.length})</div>
                    <div className="desc ellipse">{currentItem.description}</div>
                </div>
            </div>
        )
    }
}

export default AnliDetailSwiper;
