import React, { Component } from 'react';
import { List, InputItem, WhiteSpace,
    TextareaItem, DatePicker, Button, WingBlank
} from 'antd-mobile';
import { createForm } from 'rc-form';
import './style.css';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedTab: 'redTab',
        hidden: false,
        fullScreen: true,
        date: now,
    };
  }

  handleClick = () => {
    this.inputRef.focus();
  }
  
  render() {
    const { getFieldProps } = this.props.form;
    return (
          <div>
            <List renderHeader={() => '新建投票'}>
              <InputItem
                {...getFieldProps('autofocus')}
                clear
                placeholder="请输入"
                ref={el => this.autoFocusInst = el}
              >投票标题</InputItem>
              <TextareaItem
                {...getFieldProps('focus')}
                title="补充描述"
                placeholder="选填"
                data-seed="logId"
                ref={el => this.autoFocusInst = el}
                autoHeight
              />
            </List>
    
            <List renderHeader={() => '选项'}>
              <InputItem
                {...getFieldProps('control')}
                placeholder="选项"
              >选项</InputItem>
              <InputItem
                {...getFieldProps('control')}
                placeholder="选项"
              >选项</InputItem>
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
                <Button type="primary">提交</Button>
            </WingBlank>
          </div>
    );
  }
}

export default createForm()(Home);