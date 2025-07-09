import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const FamilyMemberSelect: React.FC<Props> = ({ value, onChange, disabled = false }) => {
  const user = useAppSelector((state: RootState) => state.user);

  const memberList = [
    {
      patientId: user.EmpCode?.toString() || '',
      name: user.name,
      relation: 'Self',
      age: 30,
    },
  ];

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger disabled={disabled} className="w-full border border-blue-200 rounded-lg text-xs font-sans">
        <SelectValue placeholder="Select Member" />
      </SelectTrigger>

      <SelectContent>
        {memberList.map((member) => (
          <SelectItem key={member.patientId} value={member.patientId}>
            {member.name} ({member.relation}, Age: {member.age})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FamilyMemberSelect;
