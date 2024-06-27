const { getDataToExcel } = require("./query");
const ExcelJS = require('exceljs');
const { query } = rootRequire('db').pg;
const {format } = require('date-fns');

const configPayload = (ctx) => {
  const { underlying_id, shape, clarity, colour, size } = ctx.request.query;
  const queryParams = { underlying_id, shape, clarity, colour, size };
  let productData = {};
  for (const key in queryParams) {
    if (queryParams[key]) {
      productData[key] = queryParams[key];
    }
  }
  return productData;
}

const whereCondition = (payload) => {
  const whereClause = {};
  const keys = Object.keys(payload);
  const whereText = keys.map((key, index) => {
    return `${key} = $${index + 1}`;
  }).join(' AND ');

  whereClause.text = `${whereText}`;
  whereClause.values = Object.values(payload);

  return whereClause;
}

const createExcelFile = async(ctx) => {
  try {
    const payload = configPayload(ctx);
    const whereClause = whereCondition(payload);
    const data = await query(getDataToExcel(whereClause.text),whereClause.values);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    worksheet.columns = [
      { header: 'ProductId', key: 'productid' },
      { header: 'Underlying Asset', key: 'underlying_asset' },
      { header: 'Shape', key: 'shape' },
      { header: 'Carat', key: 'carat' },
      { header: 'Colour', key: 'colour' },
      { header: 'Clarity', key: 'clarity' },
      { header: 'Co-Relation Factor', key: 'corelation_factor' },
      { header: 'Price', key: 'price' },
    ];
    
    await data.rows.forEach((row) => {
      worksheet.addRow(row);
    });
  
    return workbook;

  } catch (error) {
    throw new Error(error.message);
  }
}

const downloadExcel = async (ctx) => {
  try {
    const workbook = await createExcelFile(ctx);
    const timeStamp = format(new Date, 'ddmmyyhhss');
    const filename = `DCX_List_${timeStamp}.xlsx`;
    ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    ctx.set('Content-Disposition', `attachment; filename=${filename}`);

    ctx.body = await workbook.xlsx.writeBuffer();
    return ctx.success(ctx, 'File Downloaded');
  } catch (error) {
    return ctx.error(ctx, error.message);
  }
}

const handler = async (ctx, next) => {
  await downloadExcel(ctx);
  await next();
}

module.exports = {
  handler,
}