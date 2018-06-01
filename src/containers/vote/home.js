import React, { Component } from 'react';
import { List, InputItem, WhiteSpace,
  TextareaItem, DatePicker, Button, WingBlank,
	Toast
} from 'antd-mobile';
import { createForm } from 'rc-form';
import NebPay from 'nebpay.js';
import Nebulas from 'nebulas';
import './style.css';
import addIcon from '../../assets/Add.svg';
import reduceIcon from '../../assets/reduce.svg';
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

const Account = Nebulas.Account;
const neb = new Nebulas.Neb();
const nebPay = new NebPay();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
      fullScreen: true,
      date: now,
	    optionList: ['option1', 'option2']
    };
  }

  handleClick = () => {
    this.inputRef.focus();
  }

	addInput = () => {
    const { optionList } = this.state;
    const len = optionList.length;
    const addOption = `option${len + 1}`;
    const newOptions = optionList.concat(addOption);
    this.setState({optionList: newOptions});
  }

	handleReduceOption = (item) => {
		const { optionList } = this.state;
		if (optionList.length === 2) {
			Toast.info('投票至少需要两个选项!', 1);
    }
		const newOptions = optionList.filter(option => item === option);
		this.setState({optionList: newOptions});
  }

	handleSubmit = () => {

  }

  render() {
    const { getFieldProps } = this.props.form;
    const {optionList} = this.state;
    return (
          <div>
            <List renderHeader={() => '新建投票'}>
              <InputItem
                {...getFieldProps('title')}
                clear
                placeholder="请输入"
              >投票标题</InputItem>
              <TextareaItem
                {...getFieldProps('description')}
                title="补充描述"
                placeholder="选填"
                data-seed="logId"
                ref={el => this.autoFocusInst = el}
                autoHeight
              />
            </List>

            <List renderHeader={() => '选项'}>
              {
	              optionList.map(item => {
	                return <InputItem
                    key={item}
		                {...getFieldProps(item)}
		                placeholder="选项"
	                >
		                <div style={{
			                width: '22px',
			                height: '22px',
			                background: `url(${reduceIcon}) center center /  21px 21px no-repeat` }}
                         onClick={(item) => this.handleReduceOption(item)}
		                />
                  </InputItem>
                })
              }
	            <WingBlank>
		            <div className='addSelect' onClick={this.addInput}>
			            <div style={{
				            width: '22px',
				            height: '22px',
				            background: `url(${addIcon}) center center /  21px 21px no-repeat` }}
			            />
                  <span style={{
	                  marginLeft: '5px'}}>添加选项</span>
                </div>
              </WingBlank>
            </List>

            <WhiteSpace />

            <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
                <DatePicker
                value={this.state.date}
                onChange={date => this.setState({ date })}
                >
                <List.Item arrow="horizontal">截止时间</List.Item>
                </DatePicker>
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