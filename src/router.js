import AsyncComponent from './components/acync-component';

export default [
	{
		name: '首页',
		icon: 'home',
		path: '/',
		component: AsyncComponent(() => import('./containers/vote'))
	},
	{
		name: '首页',
		icon: 'home',
		path: '/vote',
		component: AsyncComponent(() => import('./containers/vote'))
	},
	{
		name: '详情',
		icon: 'detail',
		path: '/votedetail/:id',
		component: AsyncComponent(() => import('./containers/vote/vote'))
	},
	{
		name: '首页',
		icon: 'home',
		path: '/coin',
		component: AsyncComponent(() => import('./containers/coin'))
	},
	{
		name: '详情',
		icon: 'detail',
		path: '/coindetail/:name',
		component: AsyncComponent(() => import('./containers/coin/detail'))
	},
	{
		name: 'Token',
		icon: 'token',
		path: '/token',
		component: AsyncComponent(() => import('./containers/token'))
	},
	{
		name: 'Token详情',
		icon: 'detail',
		path: '/tokendetail/:name',
		component: AsyncComponent(() => import('./containers/token/detail'))
	},
]