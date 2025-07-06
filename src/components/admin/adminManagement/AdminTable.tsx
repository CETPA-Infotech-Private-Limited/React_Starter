import { Button } from '@/components/ui/button';
import TableList from '@/components/ui/data-table';
import { Plus } from 'lucide-react';

const AdminTable = ({ data, columns, onAddClick, inputPlaceholder }) => (
  <TableList
    data={data}
    columns={columns}
    rightElements={
      <Button onClick={onAddClick}>
        <Plus /> New Role Map
      </Button>
    }
    isInputEnd={false}
    showFilter={false}
    inputPlaceholder={inputPlaceholder}
  />
);

export default AdminTable;
