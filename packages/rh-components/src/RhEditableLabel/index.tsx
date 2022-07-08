import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import RhIcon from '../RhIcon';
import './styles.less';

export type IEditableLabel = {
  /**
   * 权限控制类型，与accessible同时存在生效
   */
  accessType?: string | undefined | null;
  /**
   * 是否拥有权限，与accessType同时存在生效
   * @default true
   */
  accessible?: boolean;
  /**
   * 值
   */
  value: string;
  /**
   * 字体样式
   */
  textStyle?: any;
  /**
   * 最大字符长度
   * @default 64
   */
  maxLength?: number;
  /**
   * 是否可编辑
   * @default true
   * @type boolean
   */
  editable?: boolean;
  /**
   * 位置
   * @default 'bottom'
   * @type string
   */
  placement?: 'top' | 'bottom';
  /**
   * 修改前判断回调
   * @type  () => Promise<boolean>;
   */
  beforeUpdate?: (v: string) => Promise<boolean>;
  /**
   * 值改变回调
   * @type  (v: string) => void
   */
  onChange?: (v: string) => void;
};

function RhEditableLabel(props: IEditableLabel, ref: any) {
  const [editValue, setEditValue] = useState('');
  const [editing, setEditing] = useState(false); // 是否在编辑中
  const [confirming, setConfirming] = useState(false); // 是否确定中

  const {
    value = '',
    maxLength = 64,
    textStyle = {},
    editable = true,
    accessible,
    accessType,
    placement = 'bottom',
    beforeUpdate = () => {
      // This is intentional
    },
    onChange = () => {
      // This is intentional
    },
  } = props;

  const onConfirm = useCallback(async () => {
    if (confirming) {
      return;
    }

    if (editValue.length > maxLength) {
      message.error(`最大长度${maxLength}`);
      return;
    }

    setConfirming(true);

    try {
      const shouldUpdate = await beforeUpdate(editValue);

      if (shouldUpdate) {
        setEditing(false);
        onChange(editValue);
      }

      setConfirming(false);
    } catch (error) {
      setConfirming(false);
    }
  }, [confirming, editValue, maxLength, beforeUpdate, onChange]);

  const onEdit = useCallback(() => {
    // 开启权限控制时，无权限，权限控制类型为提示时，直接提示信息并返回
    if (accessType === 'prompt' && !accessible) {
      message.warn('暂无此操作权限，请联系管理员添加');
      return;
    }
    setEditing(true);
    setEditValue(value);
  }, [accessType, accessible, value]);

  const onCancel = useCallback(() => {
    setEditing(false);
    setEditValue(value);
  }, [value]);

  useImperativeHandle(ref, () => ({
    onCancel: () => {
      if (ref) {
        onCancel();
      }
    },
  }));

  /**
   * 渲染编辑按钮
   * @returns JSX.Element
   */
  const RenderEditPan = () => {
    if (editable) {
      return (
        <RhIcon
          src="icon-editpan"
          onClick={onEdit}
          className="icon-edit pointer"
        />
      );
    } else {
      return null;
    }
  };

  /**
   * 渲染受权限控制的编辑按钮
   * @returns JSX.Element
   */
  const AccessEditPan = () => {
    if (accessType === 'hide') {
      return <>{accessible ? <RenderEditPan /> : null}</>;
    } else {
      return <RenderEditPan />;
    }
  };

  return (
    <div className="RhEditableLabel">
      {editing && (
        <>
          <Input
            maxLength={maxLength}
            value={editValue}
            onInput={(e: any) => {
              setEditValue(e.target.value);
            }}
          />
          <div
            className={`popover-panel ${
              placement === 'top' ? 'top' : 'bottom'
            }`}
          >
            <div className="icon-box icon-check-box" onClick={onConfirm}>
              {confirming ? (
                <RhIcon src="loading" />
              ) : (
                <RhIcon src={<CheckOutlined />} />
              )}
            </div>
            <div className="icon-box icon-close-box" onClick={onCancel}>
              <RhIcon src={<CloseOutlined />} />
            </div>
          </div>
        </>
      )}
      {!editing && (
        <>
          <div className="label-text" style={textStyle ? textStyle : {}}>
            {value}
          </div>
          {accessType ? <AccessEditPan /> : <RenderEditPan />}
        </>
      )}
    </div>
  );
}

export default forwardRef(RhEditableLabel);
