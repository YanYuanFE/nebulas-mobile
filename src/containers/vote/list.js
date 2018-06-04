import React, { Component } from 'react';
import { List, WhiteSpace,
} from 'antd-mobile';
import './style.css';

const Item = List.Item;
const Brief = Item.Brief;

class VoteList extends Component {

	goDetail = ({id}) => {
		this.props.history.push(`/votedetail/${id}`)
	}

	render() {
		const {list} = this.props;
		return (
			<div>
				<List renderHeader={() => '投票列表'} className="my-list">
					{
						list && list.map(item => {
							return <Item
								arrow="horizontal"
								multipleLine
								onClick={() => this.goDetail(item)}
								key={item.id}
							>
									{item.id + 1}、{item.title}
									<Brief>{item.description}</Brief>
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

export default VoteList;