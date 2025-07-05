import React, { useMemo } from 'react';
import TableList from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';

const ClaimSettlementList = ({ columns, claimList }) => {
  return <TableList data={claimList} columns={columns} />;
};

export default ClaimSettlementList;
