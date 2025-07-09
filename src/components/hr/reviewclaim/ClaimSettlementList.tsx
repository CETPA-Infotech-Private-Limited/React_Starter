import TableList from '@/components/ui/data-table';

const ClaimSettlementList = ({ columns, claimList }) => {
  return <TableList data={claimList} columns={columns} />;
};

export default ClaimSettlementList;
