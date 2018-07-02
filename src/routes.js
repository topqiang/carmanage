import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'

import UserList from './pages/Users/UserList.vue'
import Cars from './pages/Cars/CarsList.vue'
//资讯组件
import ArticalList from './pages/Artical/ArticalList.vue'
import AddArtical from './pages/Artical/AddArtical.vue'
//加盟商组件
import AllianceList from './pages/Alliance/AllianceList.vue'
// import Form from './pages/nav1/Form.vue'
// import user from './pages/nav1/user.vue'
import Page4 from './pages/nav2/Page4.vue'
import Page5 from './pages/nav2/Page5.vue'
import echarts from './pages/charts/echarts.vue'

// import echarts from './pages/charts/echarts.vue'
// import echarts from './pages/charts/echarts.vue'
// import echarts from './pages/charts/echarts.vue'
// import echarts from './pages/charts/echarts.vue'
// import echarts from './pages/charts/echarts.vue'
// import echarts from './pages/charts/echarts.vue'
// import echarts from './pages/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-address-book',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: UserList, name: '用户列表' }
            // { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'OBD状态管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '车辆管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/cars', component: Cars, name: '车辆记录' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '违章查询管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '轮播图管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '资讯管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/articalList', component: ArticalList, name: '资讯文章' },
            { path: '/addArtical', component: AddArtical, name: '添加资讯' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '后台权限管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '加盟商管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/allianceList', component: AllianceList, name: '加盟商列表' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;