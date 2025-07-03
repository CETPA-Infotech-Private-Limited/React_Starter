import Heading from '@/components/ui/heading';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <Heading type={4}>Dashboard</Heading>
          <p className="text-gray-500">Sub Heading</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
