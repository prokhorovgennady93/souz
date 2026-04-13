import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('C:/Users/автошкола/.gemini/antigravity/brain/46f937b8-666e-4159-98e7-e944e1d02c5b/camera_report.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

console.log(JSON.stringify(data, null, 2));
