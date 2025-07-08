import { Input } from '../ui/input';
import { Label } from '../ui/label';

const InputField = ({
  label,
  value,
  onChange,
  placeholder = '',
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <Label className="text-blue-800 text-sm font-semibold">{label}</Label>
    <Input
      className={`border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 ${readOnly ? 'bg-gray-100' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </div>
);

export default InputField;
