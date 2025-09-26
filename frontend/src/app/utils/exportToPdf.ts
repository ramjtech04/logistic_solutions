import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { saveAs } from "file-saver" // ✅ FileSaver.js

interface ExportToPdfProps {
  columns: { header: string; key: string }[]
  data: Record<string, any>[]
  fileName?: string
}

export const exportToPdf = ({
  columns,
  data,
  fileName = "export.pdf",
}: ExportToPdfProps) => {
  const doc = new jsPDF()

  // Create table
  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: data.map((row) => columns.map((c) => row[c.key])),
  })

  // Create a Blob
  const pdfBlob = doc.output("blob")

  // Save file with Save As dialog
  saveAs(pdfBlob, fileName)
}
