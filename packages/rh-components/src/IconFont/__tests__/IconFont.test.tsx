import { createRenderer } from 'react-test-renderer/shallow';
import IconFont from '../index';
// 参考：https://github.com/Jacky-Summer/monki-ui
it('IconFont renders correctly', () => {
  const renderer = createRenderer();
  const icon = <IconFont type="rh-icon-node-channel" />;
  renderer.render(icon);
  const result = renderer.getRenderOutput();

  expect(result).toMatchSnapshot();
});
