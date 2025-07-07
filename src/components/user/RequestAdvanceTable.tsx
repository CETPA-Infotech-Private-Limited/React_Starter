import TableList from '../ui/data-table';

const RequestAdvanceTable = ({ columns, data }) => {
  return <TableList columns={columns} data={data} showFilter={true} showSearchInput />;
};

export default RequestAdvanceTable;
