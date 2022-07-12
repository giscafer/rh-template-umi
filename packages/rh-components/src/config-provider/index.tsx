import useMemo from 'rc-util/lib/hooks/useMemo';
import {
  PageInfoConfig,
  RhConfigConsumer,
  RhConfigConsumerProps,
  RhConfigContext,
} from './context';

export interface RhConfigProviderProps extends RhConfigConsumerProps {
  children?: React.ReactNode;
}

interface ProviderChildrenProps extends RhConfigConsumerProps {
  parentContext: RhConfigConsumerProps;
}

const defaultTableRequest = {
  pageInfoConfig: {
    pageSizeField: 'limit',
    currentField: 'page',
  },
};

let globalTableRequest: {
  pageInfoConfig: PageInfoConfig;
};

function getGlobalTableRequest() {
  return globalTableRequest || defaultTableRequest;
}

const setGlobalConfig = ({
  tableRequest,
}: Pick<RhConfigProviderProps, 'tableRequest'>) => {
  if (tableRequest !== undefined) {
    globalTableRequest = Object.assign({}, defaultTableRequest, tableRequest);
  }
};

export const globalConfig = () => ({
  getGlobalTableRequest: getGlobalTableRequest,
});

const ProviderChildren: React.FC<ProviderChildrenProps> = (props) => {
  const { parentContext, children } = props;
  const config = {
    ...parentContext,
  };

  const childNode = children;

  // https://github.com/ant-design/ant-design/issues/27617
  const memoedConfig = useMemo(
    () => config,
    config,
    (prevConfig: Record<string, any>, currentConfig) => {
      const prevKeys = Object.keys(prevConfig);
      const currentKeys = Object.keys(currentConfig);
      return (
        prevKeys.length !== currentKeys.length ||
        prevKeys.some((key) => prevConfig[key] !== currentConfig[key])
      );
    },
  );

  return (
    <RhConfigContext.Provider value={memoedConfig}>
      {childNode}
    </RhConfigContext.Provider>
  );
};

const RhConfigProvider: React.FC<RhConfigProviderProps> & {
  ConfigContext: typeof RhConfigContext;
  config: typeof setGlobalConfig;
} = (props) => {
  return (
    <RhConfigConsumer>
      {(context) => <ProviderChildren parentContext={context} {...props} />}
    </RhConfigConsumer>
  );
};

(RhConfigProvider as any).ConfigContext = RhConfigContext;
(RhConfigProvider as any).config = setGlobalConfig;
export default RhConfigProvider;
