import type { DrawerFormProps } from '@ant-design/pro-form';
import { DrawerForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button } from 'antd';
import React, {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';

type RhDrawRef = React.Ref<{
  formRef: React.MutableRefObject<FormInstance<any> | undefined>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export type DrawerPropType = {
  /**
   * 抽屉的标题
   */
  text?: ReactNode;
  /**
   * 取消按钮Label
   */
  cancelText?: string;
  /**
   * 确认按钮Label
   * 如果 传 false，则隐藏
   */
  confirmText?: string | boolean;
  /**
   * 确认按钮是否禁用
   * 如果 传 true，则禁用
   */
  disabled?: boolean;
  /**
   * 根据最新的 asyncInitialValues 实时更新 form 的数据
   */
  asyncInitialValues?: Record<string, any>;
  /**
   * 关闭回调
   */
  onClose?: (e: any) => any;
  /**
   * 提交数据时触发，内部校验了数据。
   */
  onFinish?: (e: any) => Promise<boolean>;
};

export type RhDrawerProps = Omit<DrawerFormProps, 'onFinish'> & DrawerPropType;

function RhDrawerForm(
  {
    text,
    children = '',
    layout = 'vertical',
    width = 480,
    initialValues,
    asyncInitialValues,
    cancelText = '取消',
    confirmText = '确认',
    disabled = false,
    onFinish = () => Promise.resolve(false),
    onClose = () => {
      // This is intentional
    },
    ...restProps
  }: RhDrawerProps,
  ref: RhDrawRef
) {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<FormInstance>();

  useImperativeHandle(ref, () => {
    return {
      formRef,
      setVisible,
    };
  });

  useEffect(() => {
    if (asyncInitialValues) {
      formRef.current?.setFieldsValue(asyncInitialValues);
    }
  }, [asyncInitialValues]);

  const open = () => {
    formRef.current?.resetFields(); // 保证每次都能清空
    setVisible(true);
  };

  const trigger = useMemo(() => {
    if (text === null) return null;
    if (typeof text === 'string')
      return (
        <Button type='primary' ghost onClick={open}>
          {text}
        </Button>
      );
    return (
      <div
        style={{ display: 'inline-block', cursor: 'pointer' }}
        onClick={open}
      >
        {text}
      </div>
    );
  }, [text]);

  // eslint-disable-next-line no-param-reassign
  restProps.drawerProps = {
    destroyOnClose: !asyncInitialValues,
    ...restProps.drawerProps,
    maskClosable: false,
    onClose: (e) => {
      setVisible(false);
      formRef.current?.resetFields();
      onClose(e);
    },
  };
  const drawerFormProps: DrawerFormProps = {
    formRef,
    visible,
    layout,
    width,
    labelCol: { span: 6 },
    trigger: trigger as JSX.Element,
    submitter: {
      render: () => [
        <Button
          key='close'
          onClick={() => {
            setVisible(false);
            onClose(false);
            formRef.current?.resetFields();
          }}
        >
          {cancelText}
        </Button>,
        confirmText ? (
          <Button
            key='save'
            type='primary'
            onClick={async () => {
              formRef.current?.submit();
            }}
            loading={loading}
            disabled={disabled}
          >
            {confirmText}
          </Button>
        ) : (
          ''
        ),
      ],
    },
    onFinish: async () => {
      const values = await formRef.current?.validateFields();
      setLoading(true);
      try {
        const canClose = await onFinish(values);
        // 操作成功才会清除
        if (canClose) {
          formRef.current?.resetFields();
          setVisible(false);
        }
        setLoading(false);
      } catch {
        // formRef.current?.resetFields();
        setLoading(false);
      }
    },
    ...restProps,
  };

  return (
    <div className='rh-drawer'>
      <DrawerForm
        {...drawerFormProps}
        initialValues={!asyncInitialValues ? initialValues : {}}
        preserve={!!asyncInitialValues}
        onVisibleChange={(v) => {
          if (!v) {
            formRef.current?.resetFields();
            onClose(v);
          }
          if (restProps.onVisibleChange) {
            restProps.onVisibleChange(v);
          }
        }}
      >
        {children}
      </DrawerForm>
    </div>
  );
}

export default forwardRef(RhDrawerForm);
