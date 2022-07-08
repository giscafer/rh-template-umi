/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-05-26 10:36:53
 * @description 树形组件封装，简易使用，使用方式见文档说明 `./index.md`
 */

import {
  CaretDownOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Dropdown, Input, Menu, Popconfirm, Tooltip, Tree } from 'antd';
import type { TreeProps } from 'antd/lib/tree';
import { compact, debounce, flattenDepth, isArray, uniq } from 'lodash';
import type { Key } from 'react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import IconFont from '../IconFont';
import RhIcon from '../RhIcon';
import RhSearchInput from '../RhSearchInput';
import './styles.less';
import type { ILeafNode, IRhTree, RhEditableTreeRef } from './type';
import useTreeHeight from './useTreeHeight';
import { isNotEmptyArray, translateDataToTree } from './utils';

const INPUT_ID = 'inputId';

const RhTree = (
  {
    debug = false,
    isRenderTitle = false,
    list,
    expandedKeys,
    selectedKeys = [],
    collapsedKeys,
    searchPlaceholder,
    editable = false,
    search = false,
    autoExpandParent = true,
    showAddMenu = false,
    showAddBtn = false,
    showDeleteMenu = false,
    collapse = false,
    theme = 'gray',
    deleteTooltipText = '子节点将一起删除，是否继续？',
    rootParentId = 0,
    singleSelect = false,
    highlightText = '',
    containerSelector,
    height,
    menuProps,
    statisticsAllProps = {},
    isExpandedAllKeys = false,
    onEdit,
    onCreate,
    onDelete,
    onSelect,
    iconRender,
    addMenuRender,
    customEditCallback,
    onClick,
    addBtnCallback = () => {},
    onSelectedStatisticAll = () => {},
    ...props
  }: IRhTree & TreeProps,
  ref: React.Ref<RhEditableTreeRef>,
) => {
  const [isInputShow, toggleInputShow] = useState(true);
  const [nodeType, setNodeType] = useState('');
  const [isUpdated, toggleUpdated] = useState(false);
  const [lineList, setLineList] = useState<ILeafNode[]>([]);
  const [treeList, setTreeList] = useState<ILeafNode[]>([]);
  const [expandKeys, setExpandKeys] = useState<any[]>([]);
  const [selectKeys, setSelectKeys] = useState<Key[]>(selectedKeys);
  const [autoExpand, setAutoExpand] = useState(autoExpandParent);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [displaySelectedAllStyle, setDisplaySelectedAllStyle] = useState(false);

  useTreeHeight(containerSelector, !height);

  // 遍历树数据，获取所有的树节点key
  const expandAllKeys = (treeDataList: any, iterateAttr = 'children') => {
    const keys: string[] = [];
    (treeDataList || []).forEach((treeItem: any) => {
      if (treeItem.id) {
        keys.push(treeItem.id);
        if (treeItem[iterateAttr]?.length) {
          expandAllKeys(treeItem[iterateAttr], iterateAttr);
        }
      }
    });
    return keys;
  };

  useEffect(() => {
    const lineLeafList: ILeafNode[] = isNotEmptyArray(list)
      ? list.map((item) => ({
          ...item,
          key: item.id,
          title: item.name,
          isCreate: false,
          isEdit: false,
          children: [],
        }))
      : [];
    setLineList(lineLeafList);
    // 当默认的expandedKeys不存在时，isExpandedAllKeys为true，默认展示所有的节点
    if (isExpandedAllKeys && !expandedKeys?.length) {
      setExpandKeys(expandAllKeys(lineLeafList));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  useEffect(() => {
    const listObj = JSON.parse(JSON.stringify(lineList));
    const treeNodeList = translateDataToTree(listObj);

    setTreeList(treeNodeList);

    // expandedKeys的优先级比autoExpand高
    if (autoExpand) {
      setExpandKeys([treeNodeList[0]?.key]);
    }
  }, [autoExpand, lineList]);

  useEffect(() => {
    if (expandedKeys && isArray(expandedKeys)) {
      setExpandKeys(expandedKeys);
    }
  }, [expandedKeys]);

  useImperativeHandle(ref, () => {
    return {
      selectKeys,
      setSelectKeys,
    };
  });

  const inputNode = useCallback(
    (input: any) => {
      if (isInputShow && input) {
        input.focus();
      }
    },
    [isInputShow],
  );

  const toggleLeafEdit = (key: Key, isEdit: boolean) => {
    const leafList = lineList.map((leaf) => ({
      ...leaf,
      isCreate: false,
      isEdit: leaf.key === key ? isEdit : false,
    }));
    toggleUpdated(false);
    setLineList(leafList);
    toggleInputShow(isEdit);
  };

  const handleExpand = (keys: Key[]) => {
    const keyList = uniq(keys);
    setExpandKeys([...keyList]);
    setAutoExpand(false);
  };

  const toggleLeafCreate = (key: Key, type: string, isCreate: boolean) => {
    setNodeType(type);
    const leafList = lineList.map((leaf) => ({
      ...leaf,
      isEdit: false,
      // type: leaf.key === key ? type : leaf.type,
      isCreate: leaf.key === key ? isCreate : false,
    }));
    setLineList(leafList);
    toggleInputShow(isCreate);
    handleExpand([...expandKeys, key]);
  };

  const handleLeafEdit = (value: string, key: Key) => {
    toggleLeafEdit(key, false);
    setInputValue('');
    if (isUpdated && onEdit) {
      onEdit(value, key);
    }
  };

  const handleLeafCreate = (value: string, parentId: Key, type: string) => {
    toggleLeafCreate(parentId, type, false);
    setInputValue('');
    if (onCreate) {
      onCreate(value, type, parentId);
    }
  };

  const handleLeafDelete = (key: Key) => {
    if (onDelete) {
      onDelete(key);
    }
  };

  const handleTreeNodeClick = (
    e: React.MouseEvent,
    node: Partial<any & { name: string }>,
  ) => {
    e.stopPropagation();
    setDisplaySelectedAllStyle(false);
    if (onClick && node) {
      let n = node;
      // node 不含原始字段，这里做一层赋值
      list.forEach((item) => {
        if (item.id === node.key) {
          n = Object.assign(n, item);
        }
      });
      onClick(n);
    }
  };

  const handleTreeNodeSelect = (
    keys: (string | number)[],
    info?: { nativeEvent: MouseEvent },
  ) => {
    const inputId: any = (info?.nativeEvent?.target as HTMLInputElement)?.id;
    // 防止选中input所在的节点
    if (inputId !== INPUT_ID) {
      if (singleSelect) {
        if (keys[0]) {
          // 只有点击另外的菜单才重新设置
          setSelectKeys(keys);
        }
      } else {
        setSelectKeys(keys);
      }
    }
    if (onSelect && keys.length) {
      onSelect(keys, info);
    }
  };

  const getParentKey = useCallback(
    (id: number | string | null) => {
      const parentKey: any[] = [];
      const iterateFn = (pId: number | string | null) => {
        lineList.forEach((item) => {
          if (item.id === pId) {
            parentKey.push(item.id);
            if (item.parentId !== rootParentId) {
              iterateFn(item.parentId);
            }
          }
        });
      };

      iterateFn(id);
      return parentKey;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineList],
  );

  // 防抖
  const delaySearch = debounce((value) => {
    if (!value) {
      setSearchValue('');
    } else {
      const keys = lineList.map((item: any) => {
        if (item.title?.indexOf(value) > -1) {
          return getParentKey(item.parentId);
        }
        return null;
      });
      const expKeys = compact(flattenDepth(keys));

      setExpandKeys(expKeys);
      setSearchValue(value);
    }
  }, 200);

  const onSearchChange = useCallback(
    (e: any) => {
      delaySearch(e);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineList, delaySearch],
  );

  function highLightSearchTitle(item: ILeafNode) {
    let searchText = searchValue;
    if (!search) {
      searchText = highlightText?.trim?.();
    }
    if (!searchText) return <span>{item.name}</span>;
    const index = item.name.indexOf(searchText);
    const beforeStr = item.name.substr(0, index);
    const afterStr = item.name.substr(index + searchText.length);
    const title =
      index > -1 ? (
        <span>
          {beforeStr}
          <span className="site-tree-search-value">{searchText}</span>
          {afterStr}
        </span>
      ) : (
        <span>{item.name}</span>
      );
    return title;
  }

  const actionElement = (leaf: ILeafNode) => {
    return (
      <span className="action" onClick={(e) => e.stopPropagation()}>
        <>
          {addMenuRender
            ? addMenuRender((type: string) => {
                toggleLeafCreate(leaf.key, type, true);
              })
            : showAddMenu && (
                <IconFont type="icon-tree-create" className="icon" />
              )}

          <IconFont
            type="icon-tree-edit"
            className="icon"
            onClick={() => {
              if (customEditCallback) {
                customEditCallback(leaf.key, leaf);
              } else {
                toggleLeafEdit(leaf.key, true);
                setInputValue(leaf.name);
              }
            }}
          />
          {showDeleteMenu && (
            <Popconfirm
              placement="top"
              title={deleteTooltipText}
              onConfirm={() => {
                handleLeafDelete(leaf.id);
              }}
            >
              <IconFont type="icon-tree-delete" className="icon" />
            </Popconfirm>
          )}
        </>
      </span>
    );
  };

  const renderTree: any = (
    leafList: ILeafNode[],
    idx: number,
    parentId: Key,
    isCreate: boolean,
  ) => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('treeList=', treeList);
    }

    const tree = leafList.map((leaf: any) => ({
      key: leaf.key,
      number: leaf?.number,
      disabled: leaf?.disabled,
      // icon: leaf.icon || '',
      className: [
        !leaf.parentId && !(leaf.children && leaf.children.length)
          ? 'rh-tree-parent-no-children'
          : '',
        leaf.type ? `rh-tree-node-${leaf.type}` : '',
      ].join(' '),
      /* 如需渲染菜单：必须满足 1.菜单选项(menuProps) 2.命中菜单类型或有 default 属性 3.可编辑 */
      title: !leaf.isEdit ? (
        <div className="tree-leaf">
          {iconRender ? (
            typeof iconRender(leaf.type) === 'string' ? (
              <img src={iconRender(leaf.type)} />
            ) : (
              iconRender(leaf.type)
            )
          ) : (
            leaf.icon && (
              <IconFont type={leaf.icon as string} className="leaf-icon" />
            )
          )}
          {highLightSearchTitle(leaf)}
          {!menuProps && editable && !leaf.disabled && actionElement(leaf)}
          {menuProps && editable && menuProps.types[leaf.type || 'default'] && (
            <Dropdown
              className="rh-editable-tree-menu"
              overlay={
                <Menu
                  onClick={(e: any) => {
                    e.domEvent.stopPropagation();
                    menuProps.onClick(leaf, e);
                  }}
                >
                  {menuProps.types[leaf.type || 'default']}
                </Menu>
              }
              trigger={['click']}
            >
              <a onClick={(e) => e.stopPropagation()}>
                {menuProps.trigger || (
                  <EllipsisOutlined rotate={90} className="text-base" />
                )}
              </a>
            </Dropdown>
          )}
        </div>
      ) : (
        <Input
          id={INPUT_ID}
          maxLength={10}
          ref={inputNode}
          value={inputValue}
          placeholder="输入限制为10个字符"
          suffix={<span>{inputValue.length}/10</span>}
          onChange={({ currentTarget }) => {
            const val = currentTarget.value;
            setInputValue(val);
            toggleUpdated(val !== leaf.name);
          }}
          onPressEnter={({ currentTarget }) => {
            handleLeafEdit(currentTarget.value, leaf.key);
          }}
          onBlur={({ currentTarget }) => {
            handleLeafEdit(currentTarget.value, leaf.key);
          }}
        />
      ),
      children: leaf.children
        ? renderTree(leaf.children, idx + 1, leaf.key, leaf.isCreate)
        : renderTree([], idx + 1, leaf.key, leaf.isCreate),
    }));

    return isCreate
      ? tree.concat({
          key: idx - 1000000,
          number: '0',
          disabled: false,
          // icon: '',
          className: '',
          title: (
            <Input
              maxLength={10}
              id={INPUT_ID}
              ref={inputNode}
              value={inputValue}
              placeholder={
                nodeType === 'NODE' ? '请输入节点名称' : '请输入属性名称'
              }
              // placeholder="输入限制为10个字符"
              suffix={<span>{inputValue.length}/10</span>}
              onChange={({ currentTarget }) => {
                setInputValue(currentTarget.value);
              }}
              onBlur={({ currentTarget }) => {
                handleLeafCreate(currentTarget.value, parentId, nodeType);
              }}
              onPressEnter={({ currentTarget }: any) => {
                handleLeafCreate(currentTarget.value, parentId, nodeType);
              }}
            />
          ),
          children: null,
        })
      : tree;
  };

  const styleObj = useMemo(() => {
    const obj = {
      backgroundColor: '',
      height: height ? `${height}px` : '',
    };
    if (theme === 'light') {
      obj.backgroundColor = '#fff';
    }
    return obj;
  }, [height, theme]);

  /**
   * @description 树的展开或者收起事件
   * @param {boolean} isCollapse true:收起 false: 展开
   */
  const onTreeCollapse = useCallback(
    (isCollapse: boolean) => {
      if (isCollapse) {
        setExpandKeys(collapsedKeys || []);
      } else {
        setExpandKeys(expandAllKeys(list));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list],
  );

  /**
   * @description 自定义树节点超出省略展示并hover显示全部
   */

  const titleRenderFn = (nodeData: any) => {
    const title = nodeData.title.props.children[1].props?.children || '-';
    const isRenderNumb = nodeData?.number;
    return (
      <div className="flex items-center">
        {/** nodeData.title.props?.children[0] 表示图标按钮 */}
        {nodeData.title.props?.children[0] || ''}
        <div className="ant-tree-title-fix" title={title}>
          {title}
        </div>
        <div className="ant-tree-title-extra">
          {isRenderNumb ? `（${nodeData?.number}）` : ''}
        </div>
        {/** nodeData.title.props?.children[3] 表示节点的menuProps */}
        {nodeData.title.props?.children[3] || ''}
      </div>
    );
  };

  let titleRenderProps = {};
  if (isRenderTitle) {
    titleRenderProps = {
      titleRender: (nodeData: any) => titleRenderFn(nodeData),
    };
  }

  const onStatisticAll = () => {
    // 取消树节点选中事件
    handleTreeNodeSelect([]);
    onSelectedStatisticAll();
    setDisplaySelectedAllStyle(true);
  };

  return (
    <div className="rh-editable-tree" style={styleObj}>
      {(search || showAddBtn) && (
        <div className="searchInput">
          {search && (
            <RhSearchInput
              bordered={false}
              placeholder={searchPlaceholder || '请输入关键字'}
              size="large"
              onChange={onSearchChange}
            />
          )}
          {showAddBtn && (
            <Tooltip placement="top" title="新增">
              <PlusCircleOutlined
                className="pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // toggleLeafCreate();
                  addBtnCallback();
                }}
              />
            </Tooltip>
          )}
        </div>
      )}
      {statisticsAllProps?.visible && (
        <>
          <div
            className={`${
              displaySelectedAllStyle ? 'ant-tree-statistics-click' : null
            } ant-tree-statistics flex justify-between items-center`}
            onClick={onStatisticAll}
          >
            <div className="flex justify-center items-center">
              <div className="ant-tree-statistics-icon">
                <RhIcon
                  fontSize={16}
                  src={statisticsAllProps?.leftIcon || ''}
                />
              </div>
              <div>{statisticsAllProps.title}</div>
              <div>{`（${statisticsAllProps.number}）`}</div>
            </div>
            <div>
              <RhIcon fontSize={16} src={statisticsAllProps?.rightIcon || ''} />
            </div>
          </div>
          <div className="ant-tree-statistics-boder" />
        </>
      )}
      {collapse && (
        <div style={{ marginLeft: 10, marginBottom: 10 }}>
          <a style={{ marginRight: 20 }} onClick={() => onTreeCollapse(false)}>
            全部展开
          </a>
          <a onClick={() => onTreeCollapse(true)}>全部收起</a>
        </div>
      )}
      {treeList.length > 0 && (
        <Tree
          showLine={{ showLeafIcon: false }}
          switcherIcon={<CaretDownOutlined />} // 默认
          {...props}
          {...titleRenderProps}
          blockNode
          selectedKeys={selectKeys}
          expandedKeys={compact(expandKeys)}
          treeData={renderTree(treeList)}
          onExpand={handleExpand}
          onSelect={handleTreeNodeSelect}
          onClick={handleTreeNodeClick}
          autoExpandParent={autoExpand}
        />
      )}
    </div>
  );
};

export default forwardRef(RhTree);
