import { Button } from '@/components/ui/button';
import TableList from '@/components/ui/data-table';
import { Plus } from 'lucide-react';

const AdminTable = ({ data, columns, onAddClick }) => (
  <TableList
    data={data}
    columns={columns}
    rightElements={
      <Button onClick={onAddClick}>
        <Plus /> Add New Admin
      </Button>
    }
    isInputEnd={false}
    showFilter={false}
    inputPlaceholder="Search employee"
  />
);

export default AdminTable;
