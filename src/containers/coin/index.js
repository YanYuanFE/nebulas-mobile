import React, { Component } from 'react';
import { Tabs, WhiteSpace } from 'antd-mobile';
import Home from './home';
import List from './list';
import About from './about';
import Nebulas from 'nebulas';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();

const tabs = [
	{ title: '推荐', sub: '1' },
	{ title: '列表', sub: '2' },
	{ title: '帮助', sub: '3' },
];


export default class Coin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: []
		};
		this.net = 'https://mainnet.nebulas.io';
		this.dappAddress='n1feRHe7gmEB2sm8LkGZmVMPYcZ1wJCBG2J';
	}

	getCoinList = () => {
		const from = Account.NewAccount().getAddressString();
		const value = '0';
		const nonce = '0';
		const gasPrice = '1000000';
		const gasLimit = '2000000';
		const callFunc = 'list';
		const callArgs = '';
		const contract = {
			function: callFunc,
			args: callArgs
		};
		neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
			let result = res.result;
			if (result === 'null') {
				this.result = [];
				return;
			}
			result = JSON.parse(result);
			this.setState({list: result});
		}).catch(err => console.log(`error:${err}`));
	}

	componentDidMount() {
		this.switchNet(this.net);
		this.getCoinList();
	}

	switchNet = (value) => {
		neb.setRequest(new Nebulas.HttpRequest(value));
	}


	render() {
		const {list} = this.state;
		console.log(list)
		return <div>
			<Tabs tabs={tabs}
			      initialPage={0}
			      onChange={(tab, index) => { console.log('onChange', index, tab); }}
			      onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
			>
				<div>
					<Home getCoinList = {this.getCoinList}/>
				</div>
				<div>
					<List list={list} {...this.props}/>
				</div>
				<div>
					<About/>
				</div>
			</Tabs>
			<WhiteSpace />
			<WhiteSpace />
		</div>
	}
}
