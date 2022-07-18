const routes = [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },

  {
    path: '/welcome',
    name: '总览',
    icon: 'rh-icon-gongyezujian-yibiaopan',
    component: './dashboard/index',
  },
  {
    path: '/table',
    name: '表格示例',
    icon: 'rh-icon-liebiao',
    routes: [
      {
        path: '/table/simple',
        name: '精简查询表格',
        component: './table/simple',
      },
      {
        path: '/table/complex',
        name: '复杂查询表格',
        component: './table/complex',
      },
      {
        path: '/table/meta',
        name: '配置方式开发',
        component: './table/meta/index',
      },
      {
        name: '表格多选',
        path: '/table/selection',
        component: './table/selection/index',
      },
      {
        name: 'toolbar自定义',
        path: '/table/toolbar-menu',
        component: './table/toolbar-menu/index',
      },
    ],
  },
  {
    path: '/dynamic',
    name: 'Json动态渲染',
    icon: 'rh-icon-shiyongwendang',
    routes: [
      {
        path: '/dynamic/table',
        name: '表格',
        component: './dynamic/table/index',
      },
      {
        path: '/dynamic/descriptions',
        name: '高级详情页',
        component: './dynamic/descriptions/index',
      },
    ],
  },
  {
    path: '/origin',
    name: '原始开发写法',
    icon: 'rh-icon-shiyongwendang',
    routes: [
      {
        path: '/origin/basic-form',
        name: '基础表单',
        component: './origin/basic-form',
      },
      {
        path: '/origin/protable',
        name: 'ProTable 原生写法',
        component: './origin/protable/index',
      },
    ],
  },
  {
    path: '/charts',
    name: '图表',
    icon: 'rh-icon-tubiao-bingtu',
    component: './charts',
  },
  {
    name: 'Github',
    path: 'https://github.com/giscafer/rh-template-umi.git',
    icon: 'rh-icon-permission',
    isExternal: true,
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/demo',
    component: './demo',
  },
  {
    component: './404',
  },
];

export default routes;
