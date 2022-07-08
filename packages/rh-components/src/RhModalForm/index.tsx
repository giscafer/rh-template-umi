import type { ModalFormProps } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button } from 'antd';
import type { ReactNode } from 'react';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type RhModalRef = React.Ref<{
  formRef: React.MutableRefObject<FormInstance<any> | undefined>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export type ModalPropType = {
  /**
   * Modal的按钮文字
   */
  text?: ReactNode;
  /**
   * Modal的标题
   */
  title?: ReactNode;
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
   * 根据最新的 asyncInitialValues 实时更新 form 的数据
   */
  asyncInitialValues?: Record<string, any>;

  /**
   * 关闭回调
   */
  onClose?: () => any;
  /**
   * 提交数据时触发，内部校验了数据。
   */
  onFinish?: (e: any) => Promise<boolean>;
};

/**
 * The handler to manage a modal returned by {@link useModal | useModal} hook.
 */

export type RhModalProps = Omit<ModalFormProps, 'onFinish'> & ModalPropType;

const RhModalForm = forwardRef(
  (
    {
      text,
      children = '',
      layout = 'vertical',
      width = 480,
      initialValues,
      asyncInitialValues,
      cancelText = '取消',
      confirmText = '确认',
      onFinish = () => Promise.resolve(false),
      onClose = () => {
        // This is intentional
      },
      ...restProps
    }: RhModalProps,
    ref: RhModalRef,
  ) => {
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

    const trigger: JSX.Element =
      text && typeof text === 'string' ? (
        <Button type="primary" ghost onClick={open}>
          {text}
        </Button>
      ) : (
        <div
          style={{ display: 'inline-block', cursor: 'pointer' }}
          onClick={open}
        >
          {text}
        </div>
      );

    const onCancel = () => {
      setVisible(false);
      formRef.current?.resetFields();
      onClose();
    };

    // eslint-disable-next-line no-param-reassign
    restProps.modalProps = {
      ...restProps.modalProps,
      destroyOnClose: !asyncInitialValues,
      maskClosable: false,
      onCancel: onCancel,
      afterClose: onCancel,
    };

    const modalFormProps: ModalFormProps = {
      formRef,
      visible,
      layout,
      width,
      labelCol: { span: 6 },
      trigger,
      submitter: {
        render: () => [
          <Button
            key="close"
            onClick={() => {
              setVisible(false);
              onClose();
              formRef.current?.resetFields();
            }}
          >
            {cancelText}
          </Button>,
          confirmText ? (
            <Button
              key="save"
              type="primary"
              onClick={async () => {
                formRef.current?.submit();
              }}
              loading={loading}
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
      <div>
        <ModalForm
          {...modalFormProps}
          initialValues={!asyncInitialValues ? initialValues : {}}
          preserve={!!asyncInitialValues}
          onVisibleChange={(v) => {
            if (!v) {
              formRef.current?.resetFields();
              onClose();
            }
          }}
        >
          {children}
        </ModalForm>
      </div>
    );
  },
);

export default RhModalForm;

/**
 * NiceModal 实现
 * TODO: promise
 */
export interface NiceModalHandler extends ModalPropType {
  show: (args?: Record<string, unknown>) => Promise<unknown>;

  hide: () => Promise<unknown>;

  resolve: (args?: unknown) => void;

  reject: (args?: unknown) => void;

  remove: () => void;
}

type NiceModalCallbacks = Record<
  string,
  {
    resolve?: (args: unknown) => void;
    reject?: (args: unknown) => void;
    promise: Promise<unknown>;
  }
>;

const MODAL_REGISTRY: Record<
  string,
  {
    comp: React.FC<any>;
    props?: Record<string, unknown>;
  }
> = {};

export const register = (
  id: string,
  comp: React.FC<any>,
  props?: Record<string, unknown>,
): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props };
  } else {
    MODAL_REGISTRY[id].props = props;
  }
};

export const unregister = (id: string): void => {
  delete MODAL_REGISTRY[id];
};

const modalCallbacks: NiceModalCallbacks = {};

const symModalId = Symbol('NiceRhModalId');

let uidSeed = 0;
const getUid = () => `_nice_rh_modal_${(uidSeed += 1)}`;

const getModalId = (modal: string | React.FC<any>): string => {
  if (typeof modal === 'string') return modal as string;
  if (!(modal as any)[symModalId]) {
    (modal as any)[symModalId] = getUid();
  }
  return (modal as any)[symModalId];
};

export const useModalForm = (): {
  RhModalForm: React.FC<RhModalProps>;
  modal: NiceModalHandler;
} => {
  const modalRef = useRef<any>();
  const modal = (props: RhModalProps) => {
    return <RhModalForm ref={modalRef as any} {...props} />;
  };
  return {
    RhModalForm: modal,
    modal: {
      show: () => {
        const modalId = getModalId(modal);
        if (!MODAL_REGISTRY[modalId]) {
          register(modalId, modal as React.FC);
        }
        modalRef.current?.setVisible(true);
        let theResolve;
        let theReject;
        const promise = new Promise((resolve, reject) => {
          theResolve = resolve;
          theReject = reject;
        });
        modalCallbacks[modalId] = {
          resolve: theResolve,
          reject: theReject,
          promise,
        };

        return modalCallbacks[modalId].promise;
      },
      hide: () => {
        modalRef.current?.setVisible(false);
        return Promise.resolve(true);
      },
      remove: () => {
        const modalId = getModalId(modal);
        if (!MODAL_REGISTRY[modalId]) {
          return;
        }
        delete MODAL_REGISTRY[modalId];
      },
      resolve: (args?: unknown) => {
        const modalId = getModalId(modal);
        modalCallbacks[modalId]?.resolve?.(args);
        delete modalCallbacks[modalId];
      },
      reject: (args?: unknown) => {
        const modalId = getModalId(modal);
        modalCallbacks[modalId]?.reject?.(args);
        delete modalCallbacks[modalId];
      },
    },
  };
};
