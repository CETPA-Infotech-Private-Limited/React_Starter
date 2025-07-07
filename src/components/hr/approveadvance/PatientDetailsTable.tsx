import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type PatientDetailsProps = {
  name: string;
  relation: string;
  dob: string;
  gender: string;
};

export function PatientDetailsCard({ name, relation, dob, gender }: PatientDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Patient Details</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary text-white hover:bg-primary">
            <TableRow>
              <TableHead className="text-white">Patient Name</TableHead>
              <TableHead className="text-white">Relation</TableHead>
              <TableHead className="text-white">Date of Birth</TableHead>
              <TableHead className="text-white">Gender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{name}</TableCell>
              <TableCell>{relation}</TableCell>
              <TableCell>{dob}</TableCell>
              <TableCell>{gender}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
