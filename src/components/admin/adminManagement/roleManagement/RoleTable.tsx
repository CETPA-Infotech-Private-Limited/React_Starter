import { Button } from '@/components/ui/button';
import TableList from '@/components/ui/data-table';
import { Plus } from 'lucide-react';

const RoleTable = ({ data, columns, onAddClick }) => (
  <TableList
    data={data}
    columns={columns}
    rightElements={
      <Button onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" /> Add New Role
      </Button>
    }
    isInputEnd={false}
    showFilter={false}
    inputPlaceholder="Search roles"
  />
);

export default RoleTable;
