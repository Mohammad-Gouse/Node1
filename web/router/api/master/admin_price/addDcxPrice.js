const { insert, query } = rootRequire("db").pg;
const {
  DCX_PRICE,
  CONFIGURATIONS_TBL,
  PRODUCT_MASTER_TBL,
} = require("../../../../../constants/strings");
const {
  createUpdate,
} = require("../../../../../globalFunction/createdUpdated");

const addPrice = async (ctx) => {
  try {
    const data = ctx.request.body;
    const price = ctx.request.body.price;
    const product_id = ctx.request.body.product_id;
    const product = await getProductId();
    // console.log(product)
    await insert({
      data: await createUpdate(data, ctx),
      tableName: DCX_PRICE,
      returnClause: ["id"],
    });
    // await hasCalculatedSystemDerivedPrice();
    await calculateSystemDerivedPrice(price, product_id, product);
    return ctx.success(ctx, "Price saved successfully if");
  } catch (error) {
    // console.log(error);
    return ctx.error(ctx, error.message);
  }
};

const handler = async (ctx, next) => {
  await addPrice(ctx);
  await next();
};

async function hasCalculatedSystemDerivedPrice() {
  const change = await query(`
  update configurations set base_product=true`);
  return change;
}

const getCalculationTypeFromConfiguration = (fields) => {
  return `select ${fields} from ${CONFIGURATIONS_TBL}`;
};

const calculateSystemDerivedPrice = async (
  base_price,
  product_id,
  products
) => {
  const userInsertedProduct = products.find((prod) => prod.id === product_id);
  if (!userInsertedProduct) return; // Product not found, exit

  const userInsertedCorrelationFactor = userInsertedProduct.corelation_factor;

  await query(
    `update ${PRODUCT_MASTER_TBL} set price=${base_price} where id='${product_id}';`
  );

  // Calculate calculated_data for all other products
  await Promise.all(
    products.map(async (product) => {
      if (product.id !== product_id) {
        const correlationFactor = product.corelation_factor;
        const calculatedData =
          (base_price * correlationFactor) / userInsertedCorrelationFactor;
        // Insert calculated data into calculatedData field for the specific product
        product.calculatedData = calculatedData;
        await query(
          `update ${PRODUCT_MASTER_TBL} set price=${calculatedData} where id='${product.id}';`
        );
      }
    })
  );
};

const getProductId = async () => {
  field = `id,corelation_factor,price`;
  const product = await query(`select ${field} from ${PRODUCT_MASTER_TBL}`);
  // console.log(product.rows)
  return product.rows;
};

module.exports = {
  handler,
  getProductId,
};
