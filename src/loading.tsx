import { Spin } from 'antd';

export default function LoadingPage() {
  return (
    <div>
      <Spin
        className="flex-center align-center"
        style={{ height: 600 }}
        tip="Loading…"
      />
    </div>
  );
}
