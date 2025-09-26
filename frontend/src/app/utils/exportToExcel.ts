// utils/exportToExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export type ExportData = Record<string, any>[];

export const exportToExcel = (data: ExportData, fileName: string = "data.xlsx"): void => {
  if (!data || data.length === 0) return;

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob: Blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, fileName);
};
