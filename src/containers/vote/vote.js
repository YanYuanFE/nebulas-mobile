import React, { Component } from 'react';
import { List, WhiteSpace,
	Toast, ActivityIndicator
} from 'antd-mobile';
import { Link } from 'react-router-dom'
import moment from 'moment';
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import './style.css';


const Item = List.Item;
const Brief = Item.Brief;

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();

class Vote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detail: {},
			animating: false,
			message: '',
		};

		this.net = 'https://mainnet.nebulas.io';
		this.dappAddress='n1mayin5cM5Tkm7itSLtLHS6UjNHXzpK6fE';
		this.pending = false;
		this.timeout = 0;
	}

	componentDidMount() {
		this.switchNet(this.net);
		this.getVoteById();
	}

	getVoteById = () => {
		this.toggleToast(true);
		const { match } = this.props;
		const { id } = match.params;
		const from = Account.NewAccount().getAddressString();
		const value = '0';
		const nonce = '0';
		const gasPrice = '1000000';
		const gasLimit = '2000000';
		const callFunc = 'get';
		const callArgs = JSON.stringify([id]);
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
		const to = this.dappAddress;
		const value = '0';
		const callFunc = 'vote';
		const callArgs = JSON.stringify([id, option]);
		this.serialNumber = nebPay.call(to, value, callFunc, callArgs, {
			listener: this.cbPush
		});
		this.queryTimer = setInterval(() => {
			this.queryInterval();
		}, 10000);
	}

	cbPush = (res) => {
		const resObj = res;
		console.log(`res of push:${JSON.stringify(res)}`);
		const hash = resObj.txhash;
		if (!hash) {
			this.toggleToast(false, '');
			Toast.fail('取消交易!!', 1);
			clearInterval(this.queryTimer);
		}
	}

	queryInterval () {
		if (!this.serialNumber) return;
		if(!this.pending) {
			this.toggleToast(true, '正在查询交易，请等待！');
		}
		// if (this.timeout > 1) {
		// 	this.toggleToast(false, '');
		// 	Toast.fail('取消交易!!', 1);
		// 	clearInterval(this.queryTimer);
		// }
		this.pending = true;
		nebPay.queryPayInfo(this.serialNumber)
			.then(res => {
				console.log(`tx result: ${res}`);
				const resObj = JSON.parse(res);
				console.log(resObj);
				if (resObj.code === 0 && resObj.data.status === 1) {
					Toast.success('操作成功 !!!', 1);
					this.pending = false;
					this.toggleToast(false, '');
					this.getVoteById();
					clearInterval(this.queryTimer);
				}
				if (resObj.code === 1) {
					this.timeout += 1;
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
		console.log(detail);
		let all = 0;
		detail.data && detail.data.forEach(item => {
			all += item.list.length;
		})
		console.log(all)
		return (
			<div>
				<ActivityIndicator
					toast
					text={message || 'Loading...'}
					animating={this.state.animating}
				/>
				<div className="name">
					<Link to='/vote' className="icon"/>详情
				</div>
				<List renderHeader={() => '投票详情'} className="my-list">
					{
						detail.title && <Item
							multipleLine
							onClick={() => {}}
						>
							标题：{detail.title}
							<Brief>描述：{detail.description} <br />发起人：{detail.author}</Brief>
						</Item>
					}
				</List>
				<List renderHeader={() => `投票列表${moment().isBefore(detail.date) ? '': '(已截止)'}`} className="my-list">
					{
						detail.data && detail.data.map(item => {
							return <Item
								multipleLine
								onClick={() => this.vote(detail.id, item, detail.date)}
								key={item.option}
								extra={`${item.list.length}票  ${all && parseInt(item.list.length * 100/all, 10)}%`}
							>
								{item.option}
								<Brief>{item.list.join('、')}</Brief>
							</Item>
						})
					}
				</List>
				<div className="date">
					投票截止：{moment(detail.date).format('YYYY-MM-DD HH:mm')}
				</div>



				<WhiteSpace />



				<WhiteSpace />

			</div>
		);
	}
}

export default Vote;