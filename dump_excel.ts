import * as xlsx from 'xlsx';

const workbook = xlsx.readFile('./branches_for_sysadmin.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

console.log(JSON.stringify(data, null, 2));
