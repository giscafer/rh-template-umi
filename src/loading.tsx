import { Spin } from 'antd';

export default function LoadingPage() {
  return (
    <div>
      <Spin className="flex-center" tip="Loading…" />
    </div>
  );
}
