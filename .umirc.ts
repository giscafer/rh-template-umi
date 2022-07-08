import { defineConfig } from '@umijs/max';
import proxy from './proxy';
import routes from './src/config/routes';
import theme from './src/config/theme';
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const resolvePackage = (relativePath: string) =>
  path.join(__dirname, relativePath);

const getWorkspaceAlias = () => {
  const basePath = path.resolve(__dirname, './');
  const pkg = fs.readJSONSync(path.resolve(basePath, 'package.json')) || {};
  const results: any = {};
  const workspaces = pkg.workspaces;
  if (Array.isArray(workspaces)) {
    workspaces.forEach((pattern) => {
      const packagesPath = new glob.sync(pattern, { cwd: basePath });

      packagesPath.forEach((name) => {
        const pkg = fs.readJSONSync(
          path.resolve(basePath, name, './package.json'),
        );
        results[pkg.name] = path.resolve(basePath, name, './src');
      });
    });
  }
  console.log('alias=', results);

  return results;
};

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
  // https://github.com/umijs/umi/issues/6576
  chainWebpack: (config: any, { webpack }) => {
    const alias = getWorkspaceAlias();

    const includeArr: string[] = [];
    for (const key in alias) {
      // 设置 alias
      config.resolve.alias.set(key, alias[key]);
      // path.join([path1][, path2][, ...]) 用于连接路径
      // path.relative(from, to) 用于将绝对路径转为相对路径，返回从 from 到 to 的相对路径（基于当前工作目录）。
      includeArr.push(
        path.join(__dirname, path.relative(__dirname, alias[key])),
      );
    }
    // undefined 了，不可用
    // config.module.rules.get('ts-in-node_modules').include.add(includeArr);
  },
});
