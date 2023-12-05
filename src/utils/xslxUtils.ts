import * as _XLSX from 'xlsx';

export const XLSX = _XLSX;
export type XLSX_Range = _XLSX.Range;

export const generateSheetInBook = (book: _XLSX.WorkBook, data: string[][], name = 'Hoja 1') => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(book, worksheet, name);
    return worksheet;
}

// const downloadAttachmentsTable = (list: T_AttachmentMetaData[], docName = "Lista de anexos") => {
//     const workbook = XLSX.utils.book_new();
//     const { data, merges } = generateExcelBookData(list)
//     generateSheetInBook(workbook, data)['!merges'] = merges;
//     XLSX.writeFile(workbook, `${docName}.xlsx`)
// }
