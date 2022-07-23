import { defineConfig } from '@umijs/max';
import routes from './src/config/routes';
import theme from './src/config/theme';

const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const getWorkspaceAlias = () => {
  const basePath = path.resolve(__dirname, './');
  const pkg = fs.readJSONSync(path.resolve(basePath, 'package.json')) || {};
  const results: any = {};
  const workspaces = pkg.workspaces;
  if (Array.isArray(workspaces)) {
    workspaces.forEach((pattern) => {
      const packagesPath = new glob.sync(pattern, { cwd: basePath });

      packagesPath.forEach((name: string) => {
        const pkg = fs.readJSONSync(path.resolve(basePath, name, './package.json'));
        results[pkg.name] = path.resolve(basePath, name, './src');
      });
    });
  }
  return results;
};

export default defineConfig({
  define: {
    MOCK: true, // mock，不校验token
    BASE_URL: process.env.NODE_ENV === 'production' ? 'https://api.github.com' : '',
  },
  routes,
  theme,
  initialState: {},
  layout: {
    layout: 'mix',
    fixedHeader: true,
    title: 'RootHub Scaffold',
  },
  antd: {
    // https://ant.design/components/config-provider-cn/
    configProvider: {
      componentSize: 'middle',
    },
  },
  access: {},
  model: {},
  request: {},

  /*   plugins: ["@alitajs/plugin-theme"],
  dynamicTheme: {
    type: "antd",
    themeVariables: ["@primary-color"],
  }, */
  npmClient: 'yarn',
  monorepoRedirect: { srcDir: ['packages', 'src'] },
  // https://github.com/umijs/umi/issues/6576
  chainWebpack: (config: any, { webpack }) => {
    const alias = getWorkspaceAlias();

    // const includeArr: string[] = [];
    for (const key in alias) {
      // 设置 alias
      config.resolve.alias.set(key, alias[key]);
      // includeArr.push(path.join(__dirname, path.relative(__dirname, alias[key])));
    }

    // monaco-editor
    config.plugin('monaco-editor-webpack-plugin').use(MonacoWebpackPlugin, [
      // 按需配置
      { languages: ['html', 'css', 'javascript', 'tsx', 'typescript'] },
    ]);
    return config;
  },
});
