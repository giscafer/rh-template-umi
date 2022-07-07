import { iconFontUrl } from '@/config/constant';
import { createFromIconfontCN } from "@ant-design/icons";

// !!! 如需要添加图标，请联系 giscafer 邀请加入协助
const IconFont = createFromIconfontCN({
  scriptUrl: iconFontUrl,
});

export default IconFont;
