import React, { Component } from 'react';
import { List, WhiteSpace,
	Toast, ActivityIndicator,
	Card, Button,TextareaItem, WingBlank
} from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
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

class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detail: {},
			animating: false,
			message: '',
		};

		this.net = 'https://mainnet.nebulas.io';
		this.dappAddress='n1wjbbUn9i8o6sw8VgYkbG9xSxwb3tAVb5X';
		this.pending = false;
		this.timeout = 0;
	}

	componentDidMount() {
		this.switchNet(this.net);
		this.getTokenByName();
	}

	getTokenByName = () => {
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

	onSubmit = () => {
		const { match } = this.props;
		const { name } = match.params;
		this.props.form.validateFields((error, values) => {
			console.log(error, values);
			if (!error) {
				const {comment} = values;
				if (comment.trim() === '') {
					Toast.fail('请输入评论!', 1);
					return;
				}
				const nowTimeStamp = Date.now();
				const now = new Date(nowTimeStamp);
				const data = {
					remark: comment.trim(),
					date: moment(now).format('YYYY-MM-DD HH:mm:ss')
				}
				const value = '0';
				const callFunc = 'comment';
				const callArgs = JSON.stringify([name, data]);
				this.nebPayCall(callFunc, callArgs, value, () => {
					this.toggleToast(true, '正在查询交易，请稍等！');
				}, () => {
					this.toggleToast(false, '');
					Toast.success('操作成功 !!!', 1);
					this.getTokenByName();
					this.props.form.resetFields();
				})
			}
		})
	}

	toggleLike = () => {
		const { match } = this.props;
		const { name } = match.params;
		const value = '0';
		const callFunc = 'like';
		const callArgs = JSON.stringify([name]);
		this.nebPayCall(callFunc, callArgs, value, () => {
			this.toggleToast(true, '正在查询交易，请稍等！');
		}, () => {
			this.toggleToast(false, '');
			Toast.success('成功!', 1);
			this.getTokenByName();
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
				this.timer = null;
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
						this.timer = setInterval(() => {
							this.queryByHash(data.hash, successCb)
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

	cbPush = (res) => {
		const resObj = res;
		console.log(`res of push:${JSON.stringify(res)}`);
		const hash = resObj.txhash;
		console.error('timer', this.timer, this.queryTimer);
		if (!hash) {
			this.toggleToast(false, '');
			Toast.fail('取消交易!!', 1);
			return;
		}
		if (!isPC()) {
			return;
		}
		console.error('timer', this.timer, this.queryTimer);
		this.timer = setInterval(() => {
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
					Toast.success('操作成功 !!!', 1);
					clearInterval(this.timer);
					this.queryTimer && clearInterval(this.queryTimer);
					this.getVoteById();
				}
			});
		}, 10000);
	}

	toggleToast = (animating, message) => {
		this.setState({ animating, message});
	}

	render() {
		const {detail, message} = this.state;
		const { getFieldProps } = this.props.form;
		console.log(detail)
		return (
			<div>
				<ActivityIndicator
					toast
					text={message || 'Loading...'}
					animating={this.state.animating}
				/>
				<div className="name">
					<Link to='/token' className="icon"/>详情
				</div>
				<List renderHeader={() => 'Token详情'} className="my-list">
					{
						detail.name && <Item
							multipleLine
							onClick={() => {}}
						>
							{detail.name}
							<Brief>{detail.description} <br />By：{detail.author}</Brief>
						</Item>
					}
				</List>

				<WhiteSpace />

				<WingBlank size="lg">
					<WhiteSpace size="lg" />
					<Card>
						<Card.Header
							title={detail.rank}
							thumb={detail.icon}
							thumbStyle={{width: '50px', height: '50px', borderRadius: '50%'}}
							extra={<span>{detail.site}</span>}
						/>
						<Card.Body>
							<div>{detail.content}</div>
						</Card.Body>
						<Card.Footer
							content={<Button
								inline={true}
								className="like-btn"
								onClick={this.toggleLike}
								style={{ padding: '0 10px' }}
								icon={<img src={require('../../assets/heart.png')} alt="Like"/>}>
								{(detail.like || []).length}
							</Button>}
						/>
					</Card>
					<WhiteSpace size="lg" />
				</WingBlank>

				<List renderHeader={() => '评论'} className="my-list">
					{
						(detail.comments || []).map(item => {
							return <Item multipleLine extra={item.data.date} key={item.data.date}>
								{item.data.remark} <Brief>By: {item.author}</Brief>
							</Item>
						})
					}
				</List>
				<List renderHeader={() => '你怎么看'}>
					<TextareaItem
						placeholder='我的意见是...'
						{...getFieldProps('comment', {
							initialValue: '',
						})}
						rows={3}
						count={100}
					/>
					<Item>
						<Button type="primary" size="small" inline onClick={this.onSubmit}>提交</Button>
					</Item>
				</List>



				<WhiteSpace />

			</div>
		);
	}
}

export default  createForm()(Detail);