import React, { Component } from 'react';
import { List, WhiteSpace,
} from 'antd-mobile';
import './style.css';

const Item = List.Item;
const Brief = Item.Brief;

class CoinList extends Component {

	goDetail = ({name}) => {
		this.props.history.push(`/coindetail/${name}`)
	}

	render() {
		const {list} = this.props;
		return (
			<div>
				<List renderHeader={() => '币圈值得买列表'} className="my-list">
					{
						list && list.map(item => {
							return <Item
								arrow="horizontal"
								multipleLine
								onClick={() => this.goDetail(item)}
								key={item.id}
							>
									{item.id + 1}、{item.name}
									<Brief>{item.reason}</Brief>
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

export default CoinList;