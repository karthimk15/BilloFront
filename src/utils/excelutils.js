// src/utils/excelUtils.js
import ExcelJS from "exceljs";

/**
 * Convert Excel file (xlsx) to JSON array
 * @param {File} file - File object from input[type="file"]
 * @returns {Promise<Array>} - JSON array of rows
 */
export const excelToJson = async (file, shop_id) => {
  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer(); // read file as ArrayBuffer
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0]; // first sheet
  const jsonData = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // skip header row

    const [
      ,
      name,
      sku,
      barcode,
      hsn_code,
      MRP_Price,
      price,
      stock_quantity,
      cgst_per,
      sgst_per,
      reorder_level,
      track_batch,
    ] = row.values.slice(1); // ExcelJS row.values is 1-based, slice(1) to ignore first empty value

    jsonData.push({
      shop_id,
      name,
      sku,
      barcode,
      hsn_code,
      MRP_Price,
      price,
      stock_quantity,
      cgst_per,
      sgst_per,
      reorder_level,
      track_batch: track_batch === true || track_batch === "true", // normalize boolean
    });
  });

  return jsonData;
};

/**
 * Generate Excel template for bulk upload
 */
export const generateBulkTemplate = () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("BulkItems");

  sheet.addRow([
    "SI.No",
    "name",
    "sku",
    "barcode",
    "hsn_code",
    "MRP_Price",
    "price",
    "stock_quantity",
    "cgst_per",
    "sgst_per",
    "reorder_level",
    "track_batch",
  ]);

  return workbook.xlsx.writeBuffer();
};
