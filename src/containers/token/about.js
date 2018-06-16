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
						multipleLine
					>
						1、什么是Token Master？
						<Brief>Token Master为发现优质区块链项目而生，
							<br />去中心化，人人都可以推荐项目，
							<br />根据社区共识进行排名，
							<br />人人都可以参与项目分析。
						</Brief>
					</Item>
					<Item
						arrow="horizontal"
						multipleLine
						onClick={() => this.download()}
					>
						2、使用前需要准备什么？
						<Brief>手机端需要安装星云钱包APP，点击去下载。</Brief>
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