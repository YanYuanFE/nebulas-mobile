import React, { Component } from 'react';
import { SearchBar, ActivityIndicator, NavBar, WhiteSpace, WingBlank, Card } from 'antd-mobile';
import Nebulas from 'nebulas';
// import Home from './home';
// import List from './list';
// import About from './about';
import './style.css';
import phoneIcon from '../../assets/phone.svg';
import phoneEditIcon from '../../assets/phone-edit.svg';
import phoneMoreIcon from '../../assets/more.svg';
import bgImg from '../../assets/render_security_02.gif';

import {Toast} from "antd-mobile/lib/index";

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();

export default class Phone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			animating: false,
			message: '',
			detail: {},
			fullScreen: true,
		};

		this.net = 'https://mainnet.nebulas.io';
		this.dappAddress='n2315uMgpeDLmsQ9DQvZPsm9GdJoJ6M4o5B';
	}

	componentDidMount() {
		this.switchNet(this.net);
		// this.getTokenList();
	}

	getTokenList = () => {
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
		this.toggleToast(true, '正在从区块链上获取数据，请稍等！');
		neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
			let result = res.result;
			if (result === 'null') {
				this.result = [];
				return;
			}
			result = JSON.parse(result);
			this.setState({list: result});
			this.toggleToast(false);
		}).catch(err => {
			Toast.fail(`error:${err}，请重试`, 2);
			this.toggleToast(false);
		});
	}

	switchNet = (value) => {
		neb.setRequest(new Nebulas.HttpRequest(value));
	}

	toggleToast = (animating, message) => {
		this.setState({ animating, message});
	}

	onChange= (phone) => {
		this.setState({ phone });
	};

	handleSearch = () => {
		const {phone} = this.state;
		const from = Account.NewAccount().getAddressString();
		const value = '0';
		const nonce = '0';
		const gasPrice = '1000000';
		const gasLimit = '2000000';
		const callFunc = 'get';
		const callArgs = JSON.stringify([phone]);
		const contract = {
			function: callFunc,
			args: callArgs
		};
		this.toggleToast(true, '正在从区块链上获取数据，请稍等！');
		neb.api.call(from, this.dappAddress, value, nonce, gasPrice, gasLimit, contract).then((res) => {
			let result = res.result;
			if (result === 'null') {
				Toast.fail('号码未被标记', 2);
				return;
			}
			result = JSON.parse(result);
			this.setState({detail: result});
			this.toggleToast(false);
		}).catch(err => {
			Toast.fail(`error:${err}，请重试`, 2);
			this.toggleToast(false);
		});
	}

	render() {
		const { message, detail, phone } = this.state;
		console.log(detail);
		return (
			<div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
				<ActivityIndicator
					toast
					text={message || 'Loading...'}
					animating={this.state.animating}
				/>
				<NavBar
					mode="light"
					icon={<img src={phoneEditIcon} alt=""/>}
					rightContent={<img src={phoneMoreIcon} alt="" onClick={() => this.props.history.push('/phone/list')}/>}
					onLeftClick={() => this.props.history.push('/phone/edit')}
				>号码卫士</NavBar>
				<div className="phone-content">
					<WhiteSpace />
					<div className="logo-box">
						<img src={phoneIcon} alt="" className="phone-logo"/>
					</div>
					<WhiteSpace />
					<SearchBar
						value={phone}
						placeholder="Search"
						onSubmit={this.handleSearch}
						onClear={value => console.log(value, 'onClear')}
						onFocus={() => console.log('onFocus')}
						onBlur={() => console.log('onBlur')}
						onCancel={() => console.log('onCancel')}
						onChange={this.onChange} />
					<WhiteSpace />
					{
						detail.phone ? <WingBlank size="lg">
							<WhiteSpace size="lg" />
							<Card>
								<Card.Header
									title={detail.phone}
									extra={<span>{detail.type.join('、')}</span>}
								/>
								<Card.Body>
									<div>{detail.description || '暂无描述'}</div>
								</Card.Body>
								<Card.Footer content={`${detail.author.length}人标记了这个号码`} />
							</Card>
							<WhiteSpace size="lg" />
						</WingBlank> : null
					}
				</div>
			</div>
		);
	}
}