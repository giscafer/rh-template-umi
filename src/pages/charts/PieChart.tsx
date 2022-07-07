import {
  Axis,
  Chart,
  Coordinate,
  Interaction,
  Interval,
  Tooltip,
} from 'bizcharts';
import React from 'react';

function PieChart() {
  const data = [
    { item: '事例一', count: 40, percent: 0.4 },
    { item: '事例二', count: 21, percent: 0.21 },
    { item: '事例三', count: 17, percent: 0.17 },
    { item: '事例四', count: 13, percent: 0.13 },
    { item: '事例五', count: 9, percent: 0.09 },
  ];

  const cols = {
    percent: {
      formatter: (val: number) => {
        const newVal = val * 100 + '%';
        return newVal;
      },
    },
  };

  return (
    <Chart
      height={400}
      data={data}
      scale={cols}
      autoFit
      onGetG2Instance={(c: any) => {
        c.geometries[0].elements.forEach((e: any, idx: number) => {
          e.setState('selected', idx === 0 ? true : false);
        });
      }}
    >
      <Coordinate type="theta" radius={0.75} />
      <Tooltip showTitle={false} />
      <Axis visible={false} />
      <Interval
        position="percent"
        adjust="stack"
        color="item"
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
        label={[
          'count',
          {
            content: (d: any) => {
              return `${d.item}: ${d.percent * 100}%`;
            },
          },
        ]}
      />
      <Interaction type="element-single-selected" />
    </Chart>
  );
}
export default PieChart;
