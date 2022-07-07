import { defineConfig } from '@umijs/max';
import routes from './src/config/routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  mfsu: false,
  layout: {
    title: '@umijs/max',
  },
/*   plugins: ["@alitajs/plugin-theme"],
  dynamicTheme: {
    type: "antd",
    themeVariables: ["@primary-color"],
  }, */
  routes: routes,
  npmClient: 'yarn',
});

