import React, { Component } from 'react';
import { List, InputItem, WhiteSpace,
	TextareaItem, Picker, Button, WingBlank,NavBar, Icon,
	Toast, ActivityIndicator
} from 'antd-mobile';
import { createForm } from 'rc-form';
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import './style.css';
import {isPC} from "../../utils/utils";

const neb = new Nebulas.Neb();
const nebPay = new NebPay();

const types = [{
	label: '诈骗电话',
	value: '诈骗电话',
}, {
	label: '房产中介',
	value: '房产中介',
}, {
	label: '广告推销',
	value: '广告推销',
}, {
	label: '快递外卖',
	value: '快递外卖',
}, {
	label: '出租车',
	value: '出租车',
}, {
	label: '自定义',
	value: '自定义',
}];

class PhoneEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'redTab',
			hidden: false,
			fullScreen: true,
			animating: false,
			message: '',
		};

		this.net = 'https://mainnet.nebulas.io';
		this.dappAddress='n2315uMgpeDLmsQ9DQvZPsm9GdJoJ6M4o5B';
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

	handleBack = () => {
		this.props.history.push('/phone');
	}

	handleSubmit = () => {
		this.props.form.validateFields((error, values) => {
			console.log(error, values);
			if (!error) {
				const {phone, type, description} = values;
				if(!(/^[0-9][0-9][0-9]\d{2,8}$/.test(phone))){
					Toast.fail('请输入正确的号码', 1);
					return false;
				}
				if (!type) {
					Toast.fail('请选择标记类型', 1);
					return false;
				}
				const value = '0';
				const callFunc = 'save';
				const callArgs = JSON.stringify([phone, type, description || '']);
				this.nebPayCall(callFunc, callArgs, value, () => {
					this.toggleToast(true, '正在查询交易，请稍等！');
				}, () => {
					this.toggleToast(false, '');
					Toast.success('号码标记成功', 1);
					this.props.form.resetFields();
				})
			}
		});
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
				console.error('clear', this.timer);
				clearInterval(this.timer);
				this.timer = null;
				successCb(receipt);
			}
		});
	}

	nebPayCall = (() => {
		return (callFunc, callArgs, value, cb, successCb) => {
			this.serialNumber = nebPay.call(this.dappAddress, value, callFunc, callArgs, {
				listener: (res) => {
					console.log(res);
					if (!isPC()) {
						return;
					}
					if (res.txhash) {
						const hash = res.txhash;
						if (this.timer) return;
						this.timer = setInterval(() => {
							this.queryByHash(hash, successCb);
							console.error('timer', this.timer);
						}, 5000)
					}
				}
			});
			if (!isPC()) {
				const queryTimer = setInterval(() => {
					const queryCb = (data) => {
						clearInterval(queryTimer);
						cb(data.hash);
						if (this.timer) return;
						this.timer = setInterval(() => {
							console.error('timer', this.timer);
							this.queryByHash(data.hash, successCb);
						}, 5000)
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
			});
	}

	toggleToast = (animating, message) => {
		this.setState({ animating, message});
	}

	render() {
		const { getFieldProps } = this.props.form;
		const {message, animating} = this.state;
		return (
			<div>
				<NavBar
					mode="light"
					icon={<Icon type="left" />}
					onLeftClick={() => this.props.history.push('/phone')}
				>标记号码</NavBar>
				<WhiteSpace />
				<WhiteSpace />
				<ActivityIndicator
					toast
					text={message || 'Loading...'}
					animating={animating}
				/>
				<List>
					<InputItem
						{...getFieldProps('phone')}
						clear
						placeholder="请输入"
					>号码</InputItem>
					<Picker data={types} cols={1} {...getFieldProps('type')} className="forss">
						<List.Item arrow="horizontal">标记类型</List.Item>
					</Picker>
					<TextareaItem
						{...getFieldProps('description')}
						title="补充描述"
						placeholder="选填"
						autoHeight
					/>
				</List>

				<WhiteSpace />

				<WhiteSpace />

				<WingBlank>
					<Button type="primary" style={{ marginRight: '4px' }} onClick={this.handleSubmit}>提交</Button>
				</WingBlank>
			</div>
		);
	}
}

export default createForm()(PhoneEdit);