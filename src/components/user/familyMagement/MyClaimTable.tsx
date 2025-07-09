import TableList from '@/components/ui/data-table';
import { Plus } from 'lucide-react';

const MyClaimTable = ({ columns, data }) => {
  return (
    <TableList
      columns={columns}
      data={data}
      showFilter={true}
      showSearchInput
      // rightElements={
      //   <Button onClick={onAddClick}>
      //     <Plus /> New Advance Claim Request
      //   </Button>
      // }
    />
  );
};

export default MyClaimTable;
