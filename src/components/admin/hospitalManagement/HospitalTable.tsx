import { Button } from '@/components/ui/button';
import TableList from '@/components/ui/data-table';
import { Plus } from 'lucide-react';

const HospitalTable = ({ data, columns, onAddClick, inputPlaceholder }) => (
  <TableList
    data={data}
    columns={columns}
    showSearchInput
    rightElements={
      <Button onClick={onAddClick}>
        <Plus /> Add New Hospital
      </Button>
    }
    showFilter={true}
    inputPlaceholder={inputPlaceholder}
  />
);

export default HospitalTable;
