import React, { Component } from 'react';
import { HashRouter, BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import asyncComponent from '../utils/asyncComponent';

import home from "../pages/Home/index";
const citys = asyncComponent(() => import("../pages/Citys/index"));
const anliInfo = asyncComponent(() => import("../pages/Anli/index"));
const picInfo =  asyncComponent(() => import("../pages/Pic/index"));
const designerInfo = asyncComponent(() => import("../pages/Designer/index"));
const pirceOrder = asyncComponent(() => import("../pages/Price/index"));

// react-router4 不再推荐将所有路由规则放在同一个地方集中式路由，
//子路由应该由父组件动态配置，组件在哪里匹配就在哪里渲染，更加灵活
export default class RouteConfig extends Component{
  render(){
    // return(
    //   <HashRouter >
    //     <Switch>
    //       <Route path="/" exact component={home} />
    //       <Route path="/info" component={info} />
    //       <Redirect to="/" />
    //     </Switch>
    //   </HashRouter>
    // )

    return(
      <BrowserRouter basename="/tuku">
        <Switch>
          <Route path="/" exact component={home} />
          <Route path="/citys/" component={citys} />
          <Route path="/anli/info/:id" component={anliInfo} />
          <Route path="/pic/info/:id" component={picInfo} />
          <Route path="/designer/info/:id/:agenttype" component={ designerInfo } />
          <Route path="/price/order" component={ pirceOrder } />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    )



  }
}
