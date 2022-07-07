import ProCard from '@ant-design/pro-card';
import MultipleLine from './MultipleLine';
import PieChart from './PieChart';

function Charts() {
  return (
    <>
      <ProCard
        title="图表示例"
        subTitle="使用：https://www.bizcharts.net"
        extra="2021年10月22日"
        split={'vertical'}
        bordered
        headerBordered
      >
        <ProCard title="多色折线图" colSpan="50%">
          <div style={{ height: 400 }}>
            <MultipleLine />
          </div>
        </ProCard>
        <ProCard title="饼图默认选中">
          <div style={{ height: 400 }}>
            <PieChart />
          </div>
        </ProCard>
      </ProCard>
    </>
  );
}

export default Charts;
