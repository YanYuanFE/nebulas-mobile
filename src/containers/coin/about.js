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
						2、币圈值得买是做什么的？
						<Brief>币圈值得买为推荐价值币种而生，<br />每个人都可以推荐价值币，用户可以通过点赞<br />或者反对，还可以评论分析，<br />评选出用户心中的价值币。</Brief>
					</Item>
					<Item
						multipleLine
					>
						3、使用需要消耗NAS吗？
						<Brief>NO，使用只需要消耗少量gas作为手续费，<br /> 请保证钱包内有少量NAS。</Brief>
					</Item>
					<Item
						multipleLine
					>
						4、联系作者
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