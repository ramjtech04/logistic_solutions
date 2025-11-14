// utils/exportToExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Use unknown instead of any
export type ExportData = Record<string, string | number | boolean | Date | null>[];

export const exportToExcel = (data: ExportData, fileName: string = "data.xlsx"): void => {
  if (!data || data.length === 0) return;

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer: ArrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob: Blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, fileName);
};
