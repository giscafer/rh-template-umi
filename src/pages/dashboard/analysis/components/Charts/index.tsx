import numberFormat from '@roothub/helper/utils/number-format';
import ChartCard from './ChartCard';
import Field from './Field';

const yuan = (val: number | string) => `¥ ${numberFormat().format(val)}`;

const Charts = {
  yuan,
  ChartCard,
  Field,
};

export { Charts as default, yuan, ChartCard, Field };
