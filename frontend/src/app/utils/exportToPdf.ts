import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { saveAs } from "file-saver" // ✅ FileSaver.js

interface ExportToPdfProps<T extends Record<string, string | number | boolean|Date|null>> {
  columns: { header: string; key: keyof T }[];
  data: T[];
  fileName?: string;
}

export const exportToPdf = <T extends Record<string, string | number | boolean>>(
  { columns, data, fileName = "export.pdf" }: ExportToPdfProps<T>
) => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((c) => String(row[c.key]))),
  });

  const pdfBlob = doc.output("blob");
  saveAs(pdfBlob, fileName);
};
