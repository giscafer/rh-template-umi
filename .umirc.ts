import { defineConfig } from '@umijs/max';
import proxy from './proxy';
import routes from './src/config/routes';
import theme from './src/config/theme';

export default defineConfig({
  antd: {
    // https://ant.design/components/config-provider-cn/
    configProvider: {
      componentSize: 'middle',
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  mfsu: false,
  theme,
  layout: {
    layout: 'mix',
    fixedHeader: true,
    title: 'RootHub Scaffold',
  },
  /*   plugins: ["@alitajs/plugin-theme"],
  dynamicTheme: {
    type: "antd",
    themeVariables: ["@primary-color"],
  }, */
  routes: routes,
  proxy: proxy[process.env.NODE_ENV || 'development'],
  npmClient: 'yarn',
});
