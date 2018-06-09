import React, { Component } from 'react';
import {
	HashRouter,
  Route,
  Switch
} from 'react-router-dom';
import {
	Modal
} from 'antd-mobile';
// import VConsole from 'vconsole';
import './App.css';
// import DashBoard from './containers/dashboard';
import Vote from './containers/vote';
import Coin from './containers/coin';
import VoteDetail from './containers/vote/vote';
import CoinDetail from './containers/coin/detail';
// const vConsole = new VConsole();
const {alert} = Modal;

class App extends Component {
	state = {
		modal: false
	}

  componentDidMount() {
    const isWeixin = this.isWexin();
    if (isWeixin) {
	    alert('提示', <div style={{ height: 100 }}>
		    <p>检测到你在微信内打开</p>
		    <p>为保证正常使用，请点击右上角选择在浏览器打开！</p>
	    </div>, [
		    { text: 'Ok', onPress: () => console.log('ok') },
	    ])
    }
  }

	isWexin = () => {
		const ua = navigator.userAgent.toLowerCase();

		if (/micromessenger/.test(ua)) {
			return true;
		}
		return false;
	}

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Vote} />
          <Route path="/vote" component={Vote} />
          <Route path="/votedetail/:id" component={VoteDetail} />
	        <Route path="/coin" component={Coin} />
	        <Route path="/coindetail/:name" component={CoinDetail} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
