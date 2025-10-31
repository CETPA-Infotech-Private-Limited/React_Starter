// src/components/claim/sections/DocumentPreview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const DocumentPreview = ({ pdfUrl }: { pdfUrl?: string }) => {
  return (
    <Card className="relative shadow-lg border border-blue-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-blue-900">Document Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        <iframe
          src={pdfUrl || "about:blank"}
          className="w-full h-[400px] border-0 bg-gray-50"
          title="PDF Viewer"
        />
        <div className="p-4 flex justify-end gap-3 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-blue-100">
          <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md rounded-lg px-6 py-2">
            Tour Amendment
          </Button>
          <Button variant="outline" className="bg-white border-2 border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold shadow-md rounded-lg px-6 py-2">
            <Upload className="h-4 w-4 mr-2 text-blue-600" />
            Upload File(Optional)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default DocumentPreview;
