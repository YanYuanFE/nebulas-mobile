import React, { Component } from 'react';
import { List, WhiteSpace,
	Toast, ActivityIndicator
} from 'antd-mobile';
import { Link } from 'react-router-dom'
import moment from 'moment';
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import {isPC } from '../../utils/utils';
import './style.css';


const Item = List.Item;
const Brief = Item.Brief;

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();

class CoinDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detail: {},
			animating: false,
			message: '',
		};

		this.net = 'https://mainnet.nebulas.io';
		this.dappAddress='n1feRHe7gmEB2sm8LkGZmVMPYcZ1wJCBG2J';
		this.pending = false;
		this.timeout = 0;
	}

	componentDidMount() {
		this.switchNet(this.net);
		this.getCoinByName();
	}

	getCoinByName = () => {
		this.toggleToast(true);
		const { match } = this.props;
		const { name } = match.params;
		const from = Account.NewAccount().getAddressString();
		const value = '0';
		const nonce = '0';
		const gasPrice = '1000000';
		const gasLimit = '2000000';
		const callFunc = 'get';
		const callArgs = JSON.stringify([name]);
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
			this.setState({detail: result});
			this.toggleToast(false);
		}).catch(err => console.log(`error:${err}`));
	}

	switchNet = (value) => {
		neb.setRequest(new Nebulas.HttpRequest(value));
	}

	vote = (id, { option }, date) => {
		if (!moment().isBefore(date)) {
			Toast.fail('投票已截止!', 1);
			return;
		}
		// const to = this.dappAddress;
		const value = '0';
		const callFunc = 'vote';
		const callArgs = JSON.stringify([id, option]);
		this.nebPayCall(callFunc, callArgs, value, () => {
			this.toggleToast(true, '正在查询交易，请稍等！');
		}, () => {
			this.toggleToast(false, '');
			Toast.success('操作成功!', 1);
			this.getVoteById();
		})
	}

	queryByHash = (hash, successCb) => {
		neb.api.getTransactionReceipt({hash}).then((receipt) => {
			console.log(receipt);
			if (receipt.status === 0) {
				this.message = receipt.execute_error;
				this.pending = false;
				clearInterval(this.timer);
			}
			if (receipt.status === 2) {
				this.pending = true;
			}
			if (receipt.status === 1) {
				this.pending = false;
				clearInterval(this.timer);
				successCb(receipt);
				console.log(this.timer);
			}
		});
	}

	nebPayCall = (() => {
		return (callFunc, callArgs, value, cb, successCb) => {
			this.serialNumber = nebPay.call(this.dappAddress, value, callFunc, callArgs, {
				listener: (res) => {
					if (!isPC()) {
						return;
					}
					if (res.txhash) {
						const hash = res.txhash;
						this.timer = setInterval(() => {
							this.queryByHash(hash, successCb);
						}, 5000)
					}
				}
			});
			if (!isPC()) {
				const queryTimer = setInterval(() => {
					const queryCb = (data) => {
						clearInterval(queryTimer);
						cb(data.hash);
						this.timer = setInterval(() => this.queryByHash(data.hash, successCb), 5000)
					}
					this.queryInterval(queryCb);
				}, 3000);
			}
		}
	})()

	queryInterval = (cb) => {
		nebPay.queryPayInfo(this.serialNumber)
			.then(res => {
				console.log(`tx result: ${res}`);
				const resObj = JSON.parse(res);
				console.log(resObj);
				if (resObj.msg === 'success') {
					cb && cb(resObj.data);
				}
			})
			.catch(function (err) {
				console.log('err', err);
				clearInterval(this.queryTimer);
			});
	}

	toggleToast = (animating, message) => {
		this.setState({ animating, message});
	}

	render() {
		const {detail, message} = this.state;
		console.log(detail)

		return (
			<div>
				<ActivityIndicator
					toast
					text={message || 'Loading...'}
					animating={this.state.animating}
				/>
				<div className="name">
					<Link to='/coin' className="icon"/>详情
				</div>
				<List renderHeader={() => '推荐详情'} className="my-list">
					{
						detail.name && <Item
							multipleLine
							onClick={() => {}}
						>
							币种名称：{detail.name}
							<Brief>推荐原因：{detail.reason} <br />推荐人：{detail.author}</Brief>
						</Item>
					}
				</List>



				<WhiteSpace />



				<WhiteSpace />

			</div>
		);
	}
}

export default  CoinDetail;