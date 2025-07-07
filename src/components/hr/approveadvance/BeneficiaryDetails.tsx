import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type BeneficiaryDetails = {
  beneficiaryName: string;
  bankName: string;
  accountNo: string;
  sapRefNo: string;
  transactionDate: string;
  gstNo: string;
  ifscCode: string;
  utrNo: string;
};

export function BeneficiaryDetailsCard({
  beneficiaryName,
  bankName,
  accountNo,
  sapRefNo,
  transactionDate,
  gstNo,
  ifscCode,
  utrNo,
}: BeneficiaryDetails) {
  const renderField = (label: string, value: string) => (
    <div className="flex justify-between">
      <span className="font-medium">{label}</span>
      <span className="text-right text-muted-foreground">{value || "-"}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Beneficiary Details (Hospital)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {renderField("Beneficiary Name:", beneficiaryName)}
            {renderField("Bank Name:", bankName)}
            {renderField("Account No.:", accountNo)}
            {renderField("SAP Reference No.:", sapRefNo)}
            {renderField("Transaction Date:", transactionDate)}
          </div>
          <div className="space-y-4">
            {renderField("GST No.:", gstNo)}
            {renderField("IFSC Code:", ifscCode)}
            {renderField("UTR No.:", utrNo)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
