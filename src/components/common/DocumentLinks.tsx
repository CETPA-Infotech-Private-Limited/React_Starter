import { Paperclip } from 'lucide-react';
import React from 'react';

type DocumentItem = {
  category: string;
  remark?: string;
  pathUrl: string;
};

type DocumentLinksProps = {
  documentLists: DocumentItem[];
};

const DocumentLinks: React.FC<DocumentLinksProps> = ({ documentLists }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-primary mb-1 flex items-center gap-2">
        <Paperclip />
        Documents Attached
      </h2>
      <p className="text-gray-600 mb-4 text-sm">Please find the attached documents below.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documentLists.map((doc, index) => {
          const cleanUrl = doc.pathUrl.replace(/\\/g, '/');

          return (
            <div key={index} className="text-blue-700">
              <a href={cleanUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-900 hover:underline transition duration-200 font-medium">
                {doc.category || `Document ${index + 1}`}
              </a>
              {doc.remark && <div className="text-sm text-gray-500 mt-1">Remark: {doc.remark}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentLinks;
