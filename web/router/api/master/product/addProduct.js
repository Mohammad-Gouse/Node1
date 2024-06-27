const {
  PRODUCT_MASTER_TBL: PRODUCT_MASTER,
  SHAPE_TBL,
  CLARITY_TBL,
  COLOUR_TBL,
  SIZE_TBL,
} = require("../../../../../constants/strings");
const { bulkInsert, query } = require("../../../../../db/pg");
const xlsx = require("xlsx");
const { selectQuery, selectSizeQuery } = require("./query");
const fs = require("fs");

const specificColumns = [
  "Shape",
  "Clarity",
  "Colour",
  "Size Range",
  "Price ($ in 1 CT)",
  "Co-Relation Factor",
  "created_by",
  "updated_by",
];

const columns = [
  "shape",
  "clarity",
  "colour",
  "size",
  "price",
  "corelation_factor",
  "created_by",
  "updated_by",
];

const getDataFunction = async (tableName, queryFunction) => {
  try {
    const result = await query(queryFunction(tableName));
    if (result.rows.length === 0) throw new Error("No data found!");
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchData = async () => {
  try {
    const shape = await getDataFunction(SHAPE_TBL, selectQuery);
    const clarity = await getDataFunction(CLARITY_TBL, selectQuery);
    const colour = await getDataFunction(COLOUR_TBL, selectQuery);
    const size = await getDataFunction(SIZE_TBL, selectSizeQuery);
    return { shape, clarity, colour, size };
  } catch (error) {
    throw new Error(error.message);
  }
};

const mapData = async (row, ctx) => {
  try {
    const { shape, clarity, colour, size } = await fetchData();
    row["Shape"] =
      shape.find((data) => data.name === row["Shape"])?.id || row["Shape"];
    row["Clarity"] =
      clarity.find((data) => data.name === row["Clarity"])?.id ||
      row["Clarity"];
    row["Colour"] =
      colour.find((data) => data.name === row["Colour"])?.id || row["Colour"];
    row["Size Range"] =
      size.find((data) => data.carat == row["Size Range"])?.id ||
      row["Size Range"];
    const rowValues = {};
    specificColumns.forEach((columnName, index) => {
      const key = columns[index];
      rowValues[key] =
        key === "created_by" || key === "updated_by"
          ? ctx.userId
          : row[columnName];
    });

    return rowValues;
  } catch (error) {
    throw new Error(error.message);
  }
};

const productData = async (ctx, sheetData) => {
  try {
    let processedData = [];
    const allProduct = await query(
      `Select shape, clarity, colour, size FROM ${PRODUCT_MASTER} Where is_active=true`
    );
    await Promise.all(
      sheetData.map(async (row) => {
        const processedRow = await mapData(row, ctx);
        const isUnique = allProduct.rows.every((product) => {
          return (
            processedRow.shape !== product.shape ||
            processedRow.clarity !== product.clarity ||
            processedRow.colour !== product.colour ||
            processedRow.size !== product.size
          );
        });

        if (isUnique) {
          processedData.push(processedRow);
        }
      })
    );

    return processedData;
  } catch (error) {
    throw new Error(error.message);
  }
};

const fileRead = async (filePath) => {
  const data = await fs.promises.readFile(filePath);
  const workBook = xlsx.read(data.buffer, { type: "buffer" });
  const sheet = workBook.Sheets[workBook.SheetNames[0]];
  return sheet;
};

function normalizeColumnName(name) {
  name = name.replace(/\(.*?\)/g, "");
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

const validateFileColumn = (fileColumns) => {
  const requiredColumns = [
    "shape",
    "sizerange",
    "endrange",
    "colour",
    "clarity",
    "price",
    "corelationfactor",
  ];
  if (requiredColumns.length > fileColumns.length) return false;

  const normalizedFileColumns = fileColumns.map(normalizeColumnName);

  const allColumnsPresent = requiredColumns.every((col) =>
    normalizedFileColumns.includes(col)
  );
  return allColumnsPresent;
};

const addProductFromExcel = async (ctx) => {
  try {
    await query("BEGIN");

    const filePath = ctx.request.files.file.filepath;
    const sheet = await fileRead(filePath);
    const column = xlsx.utils.sheet_to_json(sheet, { header: 1 }).splice(1);
    let columnNames = column.shift();

    const outcome = validateFileColumn(columnNames);
    if (!outcome) return ctx.error(ctx, "File does not have required column");

    const sheetData = xlsx.utils
      .sheet_to_json(sheet, { header: columnNames })
      .splice(2);

    let expandedSheetData = [];
    sheetData.forEach((row) => {
      const sizeRange = parseFloat(row["Size Range"]);
      const endRange = parseFloat(row["End Range"]);

      for (let size = sizeRange; size <= endRange + 0.001; size += 0.01) {
        const expandedRow = { ...row, "Size Range": size.toFixed(2) };
        expandedSheetData.push(expandedRow);
      }
    });

    const batchSize = 1000;
    const totalRecords = expandedSheetData.length;
    let insertedRecords = 0;

    while (insertedRecords < totalRecords) {
      const dataBatch = expandedSheetData.slice(
        insertedRecords,
        insertedRecords + batchSize
      );
      const data = await productData(ctx, dataBatch);

      if (data.length < 1) {
        insertedRecords += batchSize;
        continue;
      }

      const result = await bulkInsert({
        tableName: PRODUCT_MASTER,
        data: data,
        returnClause: ["id"],
      });

      insertedRecords += result.rowCount;

      await query("COMMIT");
    }

    return ctx.success(
      ctx,
      `File uploaded. Total records inserted: ${insertedRecords}`
    );
  } catch (error) {
    await query("ROLLBACK");
    return ctx.error(
      ctx,
      "Error while uploading the excel file",
      error.message
    );
  }
};

const handler = async (ctx, next) => {
  await addProductFromExcel(ctx);
  await next();
};

module.exports = {
  handler,
};
