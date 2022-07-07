import { CopyrightOutlined } from '@ant-design/icons';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.footer}>
      <div>
        Copyright <CopyrightOutlined /> 2018-2021 RootHub. All rights reserved.
        RootHub 版权所有
      </div>
      <div>粤ICP备1000xxx72号-1号-1</div>
    </div>
  );
};
