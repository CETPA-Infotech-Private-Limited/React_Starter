// src/components/claim/sections/DeclarationAndSubmit.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const DeclarationAndSubmit = ({
  isDeclared, setIsDeclared, onSubmit, disabledSubmit
}: {
  isDeclared: boolean;
  setIsDeclared: (v: boolean) => void;
  onSubmit: () => void;
  disabledSubmit?: boolean;
}) => {
  return (
    <Card className="shadow-lg border border-blue-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-blue-900">Declaration</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox id="decl" checked={isDeclared} onCheckedChange={(v)=>setIsDeclared(!!v)} />
          <label htmlFor="decl" className="text-blue-900 font-semibold">I the undersigned agree:</label>
        </div>
        <ol className="list-decimal pl-6 text-blue-900 space-y-2">
          <li>The amount claimed has not been claimed before and will not be claimed after</li>
          <li>Timing on trains has been shown as per Railway Time Table &amp; actual arrival of train</li>
          <li>T.A. has been claimed for the journey performed more than 8/60 KM</li>
          <li>The information given in this form is correct and complete to the best of my knowledge and belief</li>
          <li>The due amount can be deducted from my salary</li>
        </ol>

        <div className="flex justify-center pt-2">
          <Button
            className="bg-blue-600 text-white w-40"
            disabled={disabledSubmit}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default DeclarationAndSubmit;
