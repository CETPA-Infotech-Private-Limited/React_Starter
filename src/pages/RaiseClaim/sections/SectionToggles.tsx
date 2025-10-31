import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const Row = ({
  id, label, checked, onChange,
}: { id: string; label: string; checked: boolean; onChange: (v:boolean)=>void }) => (
  <label htmlFor={id} className="flex items-center gap-3 cursor-pointer">
    <Checkbox id={id} checked={checked} onCheckedChange={(v)=>onChange(!!v)} />
    <span className="text-blue-900 font-medium">{label}</span>
  </label>
);

const SectionToggles = ({
  showAccommodation, setShowAccommodation,
  showDA, setShowDA,
  showLeave, setShowLeave,
}: {
  showAccommodation: boolean; setShowAccommodation: (v:boolean)=>void;
  showDA: boolean; setShowDA: (v:boolean)=>void;
  showLeave: boolean; setShowLeave: (v:boolean)=>void;
}) => {
  return (
    <Card className="shadow-lg border border-blue-200 rounded-xl">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-blue-900">Show / Hide Sections</CardTitle>
      </CardHeader>
      <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Row id="toggle-accommodation" label="Accommodation" checked={showAccommodation} onChange={setShowAccommodation}/>
        <Row id="toggle-da" label="Daily Allowance" checked={showDA} onChange={setShowDA}/>
        <Row id="toggle-leave" label="Leave (with/between tour)" checked={showLeave} onChange={setShowLeave}/>
      </CardContent>
    </Card>
  );
};
export default SectionToggles;
