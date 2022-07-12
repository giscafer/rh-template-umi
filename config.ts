/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-08 19:18:21
 * @description 提取出来因为在开发时，mfsu有奇葩bug，表现和生产环境不一样。
 * 做出菜单需要去做判断是否启用 mfsu
 */

import routes from './src/config/routes';
import theme from './src/config/theme';

const commonConfig = {
  define: { BASE_URL: 'https://api.github.com' },
  routes,
  theme,
  initialState: {},
  mfsu: {},
  layout: {
    layout: 'mix',
    fixedHeader: true,
    title: 'RootHub Scaffold',
  },
};

export default commonConfig;
