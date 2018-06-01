import React, { Component } from 'react';
import { TabBar } from 'antd-mobile';
import Home from './home';
import './style.css';
import addSelectedIcon from '../../assets/file-add-selcted.svg';
import addIcon from '../../assets/file-add.svg';
import listSelectedIcon from '../../assets/tags-selected.svg';
import listIcon from '../../assets/tags.svg';

export default class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedTab: 'addTab',
        hidden: false,
        fullScreen: true,
    };
  }

  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          Click to show/hide tab-bar
        </a>
        <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              fullScreen: !this.state.fullScreen,
            });
          }}
        >
          Click to switch fullscreen
        </a>
      </div>
    );
  }

  render() {
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
            <Home/>
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
            {this.renderContent('Friend')}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}