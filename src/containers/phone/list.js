import React, { Component } from 'react';
import { List, WhiteSpace, Toast, ActivityIndicator, NavBar, Icon
} from 'antd-mobile';
import Nebulas from 'nebulas';
import './style.css';
const Account = Nebulas.Account;
const neb = new Nebulas.Neb();

const Item = List.Item;
const Brief = Item.Brief;

class phoneList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			animating: false,
			message: '',
			detail: {}
		};

		this.net = 'https://mainnet.nebulas.io';
		this.dappAddress='n2315uMgpeDLmsQ9DQvZPsm9GdJoJ6M4o5B';
	}

	componentDidMount() {
		this.switchNet(this.net);
		this.getPhoneList();
	}

	getPhoneList = () => {
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
				Toast.fail('暂无数据', 2);
				return;
			}
			result = JSON.parse(result);
			const list = result.filter(item => item).map(item => ({
				...item,
				type: Array.from(new Set(item.type))
			}));
			this.setState({list});
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

	render() {
		const {list, animating, message} = this.state;
		console.log(list)
		return (
			<div>
				<NavBar
					mode="light"
					icon={<Icon type="left" />}
					onLeftClick={() => this.props.history.push('/phone')}
				>标记列表</NavBar>
				<ActivityIndicator
					toast
					text={message || 'Loading...'}
					animating={animating}
				/>
				<List className="my-list">
					{
						list && list.filter(item => item).map((item, index) => {
							return <Item
								multipleLine
								onClick={() => this.goDetail(item)}
								key={item && item.phone}
							>
								{index + 1}、{item && item.phone}
								<Brief>{item && item.type.join('、')}</Brief>
							</Item>
						})
					}
				</List>



				<WhiteSpace />



				<WhiteSpace />

			</div>
		);
	}
}

export default phoneList;