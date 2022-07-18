import type { PieConfig } from '@ant-design/charts';
import { Pie } from '@ant-design/charts';
import numberFormat from '@roothub/helper/utils/number-format';
import { Card, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import React from 'react';
import type { DataItem } from '../data.d';
import styles from '../style.less';

const { Text } = Typography;

const ProportionSales = ({
  loading,
  salesPieData,
}: {
  loading: boolean;
  dropdownGroup: React.ReactNode;
  salesType: 'all' | 'online' | 'stores';
  salesPieData: DataItem[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => {
  const pieConfig: PieConfig = {
    autoFit: true,
    height: 300,
    data: salesPieData,
    radius: 1,
    innerRadius: 0.64,
    angleField: 'y',
    colorField: 'x',
    legend: false,
    label: {
      type: 'spider',
      formatter: (text, item) => {
        // eslint-disable-next-line no-underscore-dangle
        return `${item._origin.x}: ${numberFormat().format(item._origin.y)}`;
      },
    },
    statistic: {
      title: {
        content: '销售额',
      },
    },
  };

  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title="销售额类别占比"
      style={{
        height: '100%',
      }}
    >
      <div>
        <Text>销售额</Text>
        <Pie {...pieConfig} />
      </div>
    </Card>
  );
};

export default ProportionSales;
