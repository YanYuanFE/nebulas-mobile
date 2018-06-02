import React, { Component } from 'react';
import { List, WhiteSpace} from 'antd-mobile';
import './style.css';

const Item = List.Item;
const Brief = Item.Brief;

class About extends Component {
	download = () => {
		window.location.href = 'https://mp.weixin.qq.com/s/XyWuc3ahCBNdvaPyw7OG4A'
	}

	render() {
		const {list} = this.props;
		console.log(list);
		return (
			<div>
				<List renderHeader={() => '使用说明'} className="my-list">
					<Item
						arrow="horizontal"
						multipleLine
						onClick={() => this.download()}
					>
						1、使用前需要准备什么？
						<Brief>手机端需要安装星云钱包APP，点击去下载。</Brief>
					</Item>
					<Item
						multipleLine
					>
						2、投票需要消耗NAS吗？
						<Brief>NO，投票只需要消耗少量gas，<br /> 请保证钱包内有少量NAS。</Brief>
					</Item>
					<Item
						multipleLine
					>
						3、投票只支持单选吗？
						<Brief>是的，目前只支持单选，<br />后续可能增加多选。</Brief>
					</Item>
					<Item
						multipleLine
					>
						5、如何参与投票？
						<Brief>点击首页中间Tab进入投票列表页，<br />点击对应的投票进入，点击相应的选项即可投票，<br />每项投票每人只能投一票。</Brief>
					</Item>
					<Item
						multipleLine
					>
						6、联系作者
						<Brief>微信： yanyuan950414，欢迎提交反馈</Brief>
					</Item>
				</List>



				<WhiteSpace />



				<WhiteSpace />

			</div>
		);
	}
}

export default About;