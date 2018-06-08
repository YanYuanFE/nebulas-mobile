import React, { Component } from 'react';
import { List, InputItem, WhiteSpace,
	TextareaItem, Button, WingBlank,
	Toast, ActivityIndicator
} from 'antd-mobile';
import { createForm } from 'rc-form';
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import './style.css';
import logo from '../../assets/bitcoin.png';
import {isPC} from "../../utils/utils";
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const neb = new Nebulas.Neb();
const nebPay = new NebPay();

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
	}

	switchNet = (value) => {
		neb.setRequest(new Nebulas.HttpRequest(value));
	}

	handleClick = () => {
		this.inputRef.focus();
	}

	addInput = () => {
		const { optionList } = this.state;
		const len = +optionList[optionList.length - 1].substr(-1, 1);
		const addOption = `option${len + 1}`;
		const newOptions = optionList.concat(addOption);
		this.setState({optionList: newOptions});
	}

	handleReduceOption = (item) => {
		console.log(item)
		const { optionList } = this.state;
		if (optionList.length === 2) {
			Toast.info('投票至少需要两个选项!', 1);
		}
		const newOptions = optionList.filter(option => item !== option);
		this.setState({optionList: newOptions});
	}

	handleSubmit = () => {
		this.props.form.validateFields((error, values) => {
			console.log(error, values);
			if (!error) {
				const {name, reason, platform} = values;
				if (!name || !reason || !platform) {
					Toast.fail('请输入相关信息!', 1);
					return;
				}
				// const to = this.dappAddress;
				const value = '0';
				const callFunc = 'save';
				const callArgs = JSON.stringify([name, reason, platform]);
				this.nebPayCall(callFunc, callArgs, value, () => {
					this.toggleToast(true, '正在查询交易，请稍等！');
				}, () => {
					this.toggleToast(false, '');
					Toast.success('操作成功 !!!', 1);
					this.props.getCoinList();
					this.props.form.resetFields();
				})
			}
		});
	}

	queryByHash = (hash, successCb) => {
		neb.api.getTransactionReceipt({hash}).then((receipt) => {
			console.log(receipt);
			if (receipt.status === 0) {
				const error = receipt.execute_error;
				Toast.fail(error, 3);
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
		const { getFieldProps } = this.props.form;
		const { message } = this.state;

		return (
			<div>
				<WhiteSpace />
				<WingBlank>
					<div style={{display: 'flex'}}>
						<img src={logo} alt="" className="logo"/>
						<h3 style={{marginLeft: '10px'}}>币圈什么值得买</h3>
					</div>
				</WingBlank>
				<WhiteSpace />
				<ActivityIndicator
					toast
					text={message || 'Loading...'}
					animating={this.state.animating}
				/>
				<List renderHeader={() => '我要推荐'}>
					<InputItem
						{...getFieldProps('name')}
						clear
						placeholder="请输入"
					>币种名称</InputItem>
					<TextareaItem
						{...getFieldProps('reason')}
						title="推荐理由"
						placeholder="请输入"
						autoHeight
					/>
					<InputItem
						{...getFieldProps('platform')}
						clear
						placeholder="请输入"
					>交易平台</InputItem>
				</List>

				<WhiteSpace />

				<WingBlank>
					<Button type="primary" onClick={this.handleSubmit}>提交</Button>
				</WingBlank>
			</div>
		);
	}
}

export default createForm()(Home);