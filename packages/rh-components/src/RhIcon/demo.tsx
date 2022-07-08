import { FormOutlined } from '@ant-design/icons';
import RhIcon from '.';

function Demo() {
  return (
    <>
      <div>
        <RhIcon src="icon-network">客服</RhIcon>
        <RhIcon src={<FormOutlined />}>编辑</RhIcon>
      </div>
      <br />
      <div>
        <RhIcon
          src="https://gw.alicdn.com/tfs/TB1HxCbreL2gK0jSZPhXXahvXXa-65-70.gif"
          fontSize={24}
          imageSize={36}
        >
          图片链接
        </RhIcon>
      </div>
    </>
  );
}

export default Demo;
