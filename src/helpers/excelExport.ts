import toast from "react-hot-toast";
import * as XLSX from "xlsx";

interface ExportData {
  name: string;
  transactionCount: number;
  income: number;
  expense: number;
  net: number;
  avgTransaction: number;
  limitUsage: number | null;
}

export const exportToExcel = (data: ExportData[], fileName: string) => {
  try {
    const excelData = data.map((item) => ({
      Kategori: item.name,
      "İşlem Sayısı": item.transactionCount,
      Gelir: `₺${item.income.toLocaleString()}`,
      Gider: `₺${item.expense.toLocaleString()}`,
      Net: `₺${item.net.toLocaleString()}`,
      "Ortalama İşlem": `₺${item.avgTransaction.toLocaleString()}`,
      "Limit Kullanımı": item.limitUsage
        ? `%${item.limitUsage.toFixed(0)}`
        : "-",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    const colWidths = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Bütçe Raporu");

    XLSX.writeFile(
      wb,
      `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  } catch (error) {
    console.error("Excel export error:", error);
    toast.error("Excel dosyası oluşturulurken bir hata oluştu!");
  }
};
