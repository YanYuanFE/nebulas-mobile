import React, { Component } from 'react';
import { List, InputItem, WhiteSpace,
  TextareaItem, Button, WingBlank,
	Toast, ActivityIndicator, ImagePicker
} from 'antd-mobile';
import * as qiniu from 'qiniu-js';
import axios from 'axios';
import { createForm } from 'rc-form';
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import './style.css';
import logo from '../../assets/token.svg';
import {isPC} from "../../utils/utils";
const STATICDOMAIN = 'http://o9qn9041y.bkt.clouddn.com/';

const neb = new Nebulas.Neb();
const nebPay = new NebPay();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
	    files: [],
	    animating: false,
	    message: '',
    };

    this.net = 'https://mainnet.nebulas.io';
    this.dappAddress='n1wjbbUn9i8o6sw8VgYkbG9xSxwb3tAVb5X';
	  this.pending = false;
	  this.timeout = 0;
  }

  componentDidMount() {
	  this.switchNet(this.net);
  }

	switchNet = (value) => {
		neb.setRequest(new Nebulas.HttpRequest(value));
	}

	onChange = (files, type, index) => {
		console.log(files, type, index);
		this.qnUpload(files[0].file);
		this.setState({
			files,
		});
	}

	qnUpload = (file) => {
		axios.get('http://118.24.54.139:9000/api/uptoken')
			.then((res) => {
				const token = res.data.uptoken;
				let config = {
					useCdnDomain: true,
					region: null
				};
				let putExtra = {
					fname: '',
					params: {},
					mimeType: null
				};
				console.log(file);
				let observable = qiniu.upload(file, file.name, token, putExtra, config);
				const next = (response) => {
					let total = response.total;
					console.log(total);
				};
				const error = (err) => {
					console.log(err);
				};
				const complete = (res) => {
					this.upScuccess(res);
				};
				observable.subscribe(next, error, complete);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	upScuccess = (res) => {
		const url = STATICDOMAIN + res.key;
		this.url = url;
	}

  handleClick = () => {
    this.inputRef.focus();
  }

	handleSubmit = () => {
  	const { files } = this.state;
		this.props.form.validateFields((error, values) => {
			console.log(error, values);
			if (!error) {
				const { name, description, content, rank, site } = values;
				if (!name || !description || !content || !site) {
					Toast.fail('请输入相关信息!', 1);
					return;
				}
				if (!files.length) {
					Toast.fail('请上传Token Icon!', 1);
					return;
				}
				const value = '0';
				const callFunc = 'save';
				const callArgs = JSON.stringify([name, description, content, rank || '', site, this.url]);
				this.nebPayCall(callFunc, callArgs, value, () => {
					this.toggleToast(true, '正在查询交易，请稍等！');
				}, () => {
					this.toggleToast(false, '');
					Toast.success('操作成功 !!!', 1);
					this.props.getTokenList();
					this.props.form.resetFields();
					this.setState({
						files: []
					})
				})
			}
		});
  }

	queryByHash = (hash, successCb) => {
		neb.api.getTransactionReceipt({hash}).then((receipt) => {
			console.log(receipt);
			if (receipt.status === 0) {
				this.message = receipt.execute_error;
				this.pending = false;
				clearInterval(this.timer);
			}
			if (receipt.status === 2) {
				this.pending = true;
			}
			if (receipt.status === 1) {
				this.pending = false;
				console.error('clear', this.timer);
				clearInterval(this.timer);
				this.timer = null;
				successCb(receipt);
			}
		});
	}

	nebPayCall = (() => {
		return (callFunc, callArgs, value, cb, successCb) => {
			this.serialNumber = nebPay.call(this.dappAddress, value, callFunc, callArgs, {
				listener: (res) => {
					if (!isPC()) {
						return;
					}
					if (res.txhash) {
						const hash = res.txhash;
						if (this.timer) return;
						this.timer = setInterval(() => {
							this.queryByHash(hash, successCb);
							console.error('timer', this.timer);
						}, 5000)
					}
				}
			});
			if (!isPC()) {
				const queryTimer = setInterval(() => {
					const queryCb = (data) => {
						clearInterval(queryTimer);
						cb(data.hash);
						if (this.timer) return;
						this.timer = setInterval(() => {
							console.error('timer', this.timer);
							this.queryByHash(data.hash, successCb);
						}, 5000)
					}
					this.queryInterval(queryCb);
				}, 3000);
			}
		}
	})()

	queryInterval = (cb) => {
		nebPay.queryPayInfo(this.serialNumber)
			.then(res => {
				console.log(`tx result: ${res}`);
				const resObj = JSON.parse(res);
				console.log(resObj);
				if (resObj.msg === 'success') {
					cb && cb(resObj.data);
				}
			})
			.catch(function (err) {
				console.log('err', err);
			});
	}

	toggleToast = (animating, message) => {
		this.setState({ animating, message});
	}

  render() {
    const { getFieldProps } = this.props.form;
    const {files, message} = this.state;
    return (
          <div>
	          <WhiteSpace />
	          <WingBlank>
		          <div style={{display: 'flex'}}>
			          <img src={logo} alt="" className="logo"/>
			          <h3 style={{marginLeft: '10px'}}>Token Master</h3>
		          </div>
	          </WingBlank>
	          <WhiteSpace />
	          <ActivityIndicator
		          toast
		          text={message || 'Loading...'}
		          animating={this.state.animating}
	          />
            <List renderHeader={() => '提交Token'}>
              <InputItem
                {...getFieldProps('name')}
                clear
                placeholder="请输入"
              >Token名称</InputItem>
              <TextareaItem
                {...getFieldProps('description')}
                title="描述"
                placeholder="一句话"
                autoHeight
              />
	            <TextareaItem
		            {...getFieldProps('content')}
		            title="详细介绍"
		            placeholder="请输入"
		            autoHeight
	            />
	            <InputItem
		            {...getFieldProps('rank')}
		            clear
		            placeholder="请输入"
	            >评级</InputItem>
	            <TextareaItem
		            {...getFieldProps('site')}
		            title="网站"
		            placeholder="请输入"
		            autoHeight
	            />
            </List>

            <WhiteSpace />

	          <List renderHeader={() => 'Token Icon'}>
		          <ImagePicker
			          files={files}
			          onChange={this.onChange}
			          onImageClick={(index, fs) => console.log(index, fs)}
			          selectable={files.length < 1}
			          multiple={false}
		          />
		          <WhiteSpace />
	          </List>

            <WhiteSpace />

            <WingBlank>
                <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </WingBlank>
          </div>
    );
  }
}

export default createForm()(Home);