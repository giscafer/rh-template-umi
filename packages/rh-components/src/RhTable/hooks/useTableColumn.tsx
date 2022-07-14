import { ProColumns } from '@ant-design/pro-components';
import { isArray } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import genOptionColumn from '../../common/option-column';
import { RhActionMeta } from '../../types';
import { convertDataIndex, evalFormula } from '../../utils';
import { RhColumns, RhTableMeta } from '../types';
import { RhObservable } from './useTable';

function useTableColumn(
  columns: RhColumns[],
  meta: RhTableMeta | undefined,
  actionObservable$: RhObservable<any>,
) {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (actionMeta: RhActionMeta, record: Record<string, any>) => {
      const { action, targetBlank, link = '' } = actionMeta;
      if (/^http/.test(link)) {
        return window.open(link);
      }
      if (targetBlank && link) {
        const realLink = evalFormula(link, record);
        return window.open(realLink);
      }
      if (!targetBlank && link) {
        const realLink = evalFormula(link, record);
        return navigate(realLink);
      }
      actionObservable$.next({
        type: action,
        payload: record,
      });
    },
    [],
  );

  const tableColumns: ProColumns[] = useMemo(() => {
    const cList = columns.map((c: any) => ({
      ...c,
      key: isArray(c.dataIndex) ? c.dataIndex.join(',') : c.dataIndex,
      dataIndex: convertDataIndex(c.dataIndex),
    }));
    if (!meta?.optionActions?.length) {
      return cList;
    }
    const actions = meta?.optionActions;
    const optionColumn = genOptionColumn(actions, handleClick);
    return cList.concat(optionColumn as RhColumns);
  }, [columns]);

  return { tableColumns };
}

export default useTableColumn;
