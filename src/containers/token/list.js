import React, { Component } from 'react';
import { List, WhiteSpace
} from 'antd-mobile';
import './style.css';

const Item = List.Item;
const Brief = Item.Brief;

class VoteList extends Component {

	goDetail = ({name}) => {
		this.props.history.push(`/tokendetail/${name}`)
	}

	render() {
		const {list} = this.props;
		const formatList = list.sort((a, b) => b.like.length - a.like.length);
		return (
			<div>
				<List renderHeader={() => 'Hot Token'} className="my-list">
					{
						formatList && formatList.map(item => {
							return <Item
								arrow="horizontal"
								multipleLine
								onClick={() => this.goDetail(item)}
								key={item.id}
							>
								<div style={{display: 'flex', alignItems: 'flex-start'}}>
									<div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', marginRight: '20px'}}>
										<img src={require('../../assets/heart.png')} alt="Like"/>
										<span>{(item.like || []).length}</span>
									</div>
									<span>{item.name}</span>
								</div>
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