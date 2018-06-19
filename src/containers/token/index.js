import React, { Component } from 'react';
import { TabBar, ActivityIndicator } from 'antd-mobile';
import Nebulas from 'nebulas';
import Home from './home';
import List from './list';
import About from './about';
import './style.css';
import addSelectedIcon from '../../assets/token-edit-selected.png';
import addIcon from '../../assets/token-edit.png';
import listSelectedIcon from '../../assets/browser-selected.png';
import listIcon from '../../assets/browser.png';
import helpSelectedIcon from '../../assets/about-selected.png';
import helpIcon from '../../assets/about.png';
import {Toast} from "antd-mobile/lib/index";

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();

export default class Token extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'addTab',
      hidden: false,
      fullScreen: true,
      list: [],
	    animating: false,
	    message: '',
    };

	  this.net = 'https://mainnet.nebulas.io';
	  this.dappAddress='n1wjbbUn9i8o6sw8VgYkbG9xSxwb3tAVb5X';
  }

	componentDidMount() {
		this.switchNet(this.net);
		this.getTokenList();
	}

	getTokenList = () => {
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
				this.result = [];
				return;
			}
			result = JSON.parse(result);
			this.setState({list: result});
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
	  const {list, message } = this.state;
    return (
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
	      <ActivityIndicator
		      toast
		      text={message || 'Loading...'}
		      animating={this.state.animating}
	      />
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            key="Add"
            icon={<div style={{
              width: '30px',
              height: '30px',
              background: `url(${addIcon}) center center /  30px 30px no-repeat` }}
            />
            }
            selectedIcon={<div style={{
              width: '30px',
              height: '30px',
              background: `url(${addSelectedIcon}) center center /  30px 30px no-repeat` }}
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
            <Home getTokenList={this.getTokenList}/>
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '30px',
                height: '30px',
                background: `url(${listIcon}) center center /  30px 30px no-repeat` }}
              />
            }
            selectedIcon={
              <div style={{
                width: '30px',
                height: '30px',
                background: `url(${listSelectedIcon}) center center /  30px 30px no-repeat` }}
              />
            }
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
				        width: '30px',
				        height: '30px',
				        background: `url(${helpIcon}) center center /  30px 30px no-repeat` }}
			        />
		        }
		        selectedIcon={
			        <div style={{
				        width: '30px',
				        height: '30px',
				        background: `url(${helpSelectedIcon}) center center /  30px 30px no-repeat` }}
			        />
		        }
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