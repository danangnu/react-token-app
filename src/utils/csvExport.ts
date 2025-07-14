import { unparse } from "papaparse";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToCsv(filename: string, rows: any[]) {
  const csv = unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
