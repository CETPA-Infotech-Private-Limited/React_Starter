import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import TableList from '../ui/data-table';

const RequestAdvanceTable = ({ columns, data, onAddClick }) => {
  return (
    <TableList
      columns={columns}
      data={data}
      showFilter={true}
      showSearchInput
      rightElements={
        <Button onClick={onAddClick}>
          <Plus /> New Advance Claim Request
        </Button>
      }
    />
  );
};

export default RequestAdvanceTable;
