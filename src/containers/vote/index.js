import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import Nebulas from 'nebulas';
import Home from './home';
import List from './list';
import About from './about';
import './style.css';
import addSelectedIcon from '../../assets/file-add-selcted.svg';
import addIcon from '../../assets/file-add.svg';
import listSelectedIcon from '../../assets/tags-selected.svg';
import listIcon from '../../assets/tags.svg';
import helpSelectedIcon from '../../assets/help-selected.svg';
import helpIcon from '../../assets/help.svg';

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();

export default class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedTab: 'addTab',
        hidden: false,
        fullScreen: true,
        list: []
    };

	  this.net = 'https://mainnet.nebulas.io';
	  this.dappAddress='n1mayin5cM5Tkm7itSLtLHS6UjNHXzpK6fE';
  }

	componentDidMount() {
		this.switchNet(this.net);
		this.getVoteList();
	}

	getVoteList = () => {
		const from = Account.NewAccount().getAddressString();
		const value = '0';
		const nonce = '0';
		const gasPrice = '1000000';
		const gasLimit = '2000000';
		const callFunc = 'getList';
		const callArgs = '';
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
			this.setState({list: result});
		}).catch(err => console.log(`error:${err}`));
	}

	switchNet = (value) => {
		neb.setRequest(new Nebulas.HttpRequest(value));
	}

  render() {
	  const {list} = this.state;
    return (
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="新建"
            key="Add"
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: `url(${addIcon}) center center /  21px 21px no-repeat` }}
            />
            }
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: `url(${addSelectedIcon}) center center /  21px 21px no-repeat` }}
            />
            }
            selected={this.state.selectedTab === 'addTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'addTab',
              });
            }}
            data-seed="logId"
          >
            <Home getVoteList={this.getVoteList}/>
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: `url(${listIcon}) center center /  21px 21px no-repeat` }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: `url(${listSelectedIcon}) center center /  21px 21px no-repeat` }}
              />
            }
            title="列表"
            key="List"
            selected={this.state.selectedTab === 'listTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'listTab',
              });
            }}
          >
            <List {...this.props} list={list}/>
          </TabBar.Item>
	        <TabBar.Item
		        icon={
			        <div style={{
				        width: '22px',
				        height: '22px',
				        background: `url(${helpIcon}) center center /  21px 21px no-repeat` }}
			        />
		        }
		        selectedIcon={
			        <div style={{
				        width: '22px',
				        height: '22px',
				        background: `url(${helpSelectedIcon}) center center /  21px 21px no-repeat` }}
			        />
		        }
		        title="帮助"
		        key="Help"
		        selected={this.state.selectedTab === 'helpTab'}
		        onPress={() => {
			        this.setState({
				        selectedTab: 'helpTab',
			        });
		        }}
	        >
		        <About />
	        </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}