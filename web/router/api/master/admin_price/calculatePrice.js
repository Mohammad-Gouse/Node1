const { insert, query } = rootRequire("db").pg;
const { CONFIGURATIONS_TBL } = require("../../../../../constants/strings");

const calculateUserPriceService = async (ctx) => {
  try {
    // Fetch data using the new query
    const fetchQuery = `
      WITH user_prices_ranked AS (
          SELECT up.id, up.product_id, up.price, up.user_id, up.updated_at,
              ROW_NUMBER() OVER (PARTITION BY up.product_id, up.user_id ORDER BY up.updated_at DESC) AS rn
          FROM user_price AS up
      ),
      dcx_prices_ranked AS (
          SELECT dp.product_id, dp.price, dp.updated_at,
              ROW_NUMBER() OVER (PARTITION BY dp.product_id ORDER BY dp.updated_at DESC) AS rn
          FROM dcx_price AS dp
      ),
      prices_aggregated AS (
          SELECT 
              pm.id AS product_id,
              jsonb_agg(lup.price::numeric) AS prices
          FROM product_master AS pm
          LEFT JOIN underlying_asset AS ua ON ua.id = pm.underlying_id
          LEFT JOIN shapes AS sh ON sh.id = pm.shape
          LEFT JOIN sizes AS si ON si.id = pm.size
          LEFT JOIN colours AS co ON co.id = pm.colour
          LEFT JOIN claritys AS cl ON cl.id = pm.clarity
          LEFT JOIN user_prices_ranked AS lup ON lup.product_id = pm.id AND lup.rn = 1
          LEFT JOIN users AS us ON us.id = lup.user_id
          LEFT JOIN dcx_prices_ranked AS ldp ON ldp.product_id = pm.id AND ldp.rn = 1
          GROUP BY pm.id
      )
      SELECT 
          jsonb_agg(
              jsonb_build_object(
                  'product_id', product_id,
                  'array', prices
              )
          ) AS result
      FROM prices_aggregated
      WHERE jsonb_array_length(prices) > 0;
    `;

    const fetchData = await query(fetchQuery);
    const data = fetchData.rows[0].result;

    let fields = `percentage_status, percentage, count`;
    const value = await query(getCalculationTypeFromConfiguration(fields));
    let random_fields = `random_pecentage, round_off_digit`;
    const randomPercentageValue = await query(
      getCalculationTypeFromConfiguration(random_fields)
    );
    const randomPercentage = randomPercentageValue.rows[0].random_pecentage;
    const digit = randomPercentageValue.rows[0].round_off_digit;
    const status = value.rows[0].percentage_status;
    const percentage_value = value.rows[0].percentage;
    const count = value.rows[0].count;

    let results = [];

    for (let item of data) {
      let array = item.array.sort();
      let product_id = item.product_id;
      if (status) {
        let num = array_type(array.length);
        let median = calculation_of_median(array, num);
        let difference = (median * percentage_value) / 100;
        let value = calculate_percentage(array, difference, median, digit);
        let result = calculateRandomValue(randomPercentage, value, digit);
        results.push({ product_id, result });
      } else {
        let count_value = count;
        console.log(count_value * 2 + 1);
        console.log(array.length);
        if (array.length < count_value * 2 + 1) {
          const fetch_query = `select price from product_master where id='${product_id}'`;
          const fetchDatas = await query(fetch_query);
          const new_price = fetchDatas.rows[0].price;
          let price_type = "Algo";
          let admin_price = 0;
          results.push({ product_id, new_price, price_type, admin_price });
        } else {
          let num = array_type(array.length);
          let median = calculation_of_median(array, num);
          let values = calculate_percentage(array, count_value, median, digit);
          let new_price = calculateRandomValue(randomPercentage, values, digit);
          let price_type = "Algo";
          let admin_price = 0;
          results.push({ product_id, new_price, price_type, admin_price });
        }
      }
    }
    return ctx.success(ctx, results);
  } catch (error) {
    console.log(error);
    return ctx.error(ctx, error.message);
  }
};

const getCalculationTypeFromConfiguration = (fields) => {
  return `SELECT ${fields} FROM ${CONFIGURATIONS_TBL}`;
};

const handler = async (ctx, next) => {
  await calculateUserPriceService(ctx);
  await next();
};

function array_type(number) {
  if (number % 2 == 0) {
    let num1 = number / 2 - 1;
    let num2 = num1 + 1;
    return [num1, num2];
  } else {
    let num = number / 2 - 1;
    let num1 = Math.ceil(num);
    return [num1];
  }
}

function calculation_of_median(array, position) {
  if (position.length == 1) {
    let median = array[position[0]];
    return median;
  } else {
    let sum = (array[position[0]] + array[position[1]]) / 2;
    let median = sum;
    return median;
  }
}

function calculate_percentage(array, difference, median, digit) {
  let add_median = median + difference;
  let sub_median = median - difference;
  let count = 0;
  let sum = 0;
  for (let i = 0; i <= array.length - 1; i++) {
    if (array[i] < sub_median || array[i] > add_median) {
      array[i] = 0;
    } else {
      count = count + 1;
      sum = sum + array[i];
    }
  }

  let per_value = (sum / count).toFixed(digit);
  return per_value;
}

function getRandomNumberInRange(min, max, digit) {
  return (Math.random() * (max - min) + min).toFixed(digit);
}

function calculateRandomValue(percentage, value, digit) {
  const onePercent = (percentage * value) / 100;
  const randomFactor = parseFloat(
    getRandomNumberInRange(-onePercent, onePercent, digit)
  );
  const modifiedPrice = parseFloat(value) + randomFactor;
  return modifiedPrice.toFixed(digit);
}

async function hasCalculatedSystemDerivedPrice() {
  const change = await query(`
  UPDATE configurations SET base_product=true`);
  return change;
}

function hasCalculatedSystemDerivedPriceLogic(result) {
  console.log("calculate price");
  return result;
}

const getProductId = async () => {
  const fields = `id, correlation_factor, userInsertedPrice, systemDerivedPrice`;
  const product = await query(`SELECT ${fields} FROM product_master`);
  console.log(product.rows);
  return product.rows;
};

const comparePrice = async (new_product_id, new_price) => {
  const products = await getProductId();
  const newProductIndex = products.findIndex(
    (product) => product.id === new_product_id
  );
  if (newProductIndex === -1) {
    throw new Error("Product not found");
  }

  const newProduct = products[newProductIndex];
  let prevProduct = null;
  let nextProduct = null;

  for (let i = newProductIndex - 1; i >= 0; i--) {
    if (products[i].correlation_factor !== newProduct.correlation_factor) {
      prevProduct = products[i];
      break;
    }
  }

  for (let i = newProductIndex + 1; i < products.length; i++) {
    if (products[i].correlation_factor !== newProduct.correlation_factor) {
      nextProduct = products[i];
      break;
    }
  }

  if (prevProduct && nextProduct) {
    const prevCalculatedData = prevProduct.systemderivedprice;
    const nextCalculatedData = nextProduct.systemderivedprice;

    const lowerBound = Math.min(prevCalculatedData, nextCalculatedData);
    const upperBound = Math.max(prevCalculatedData, nextCalculatedData);

    if (new_price >= lowerBound && new_price <= upperBound) {
      return new_price;
    } else {
      console.log(products[newProductIndex].systemderivedprice);
      let result = products[newProductIndex].systemderivedprice;
      return result;
    }
  }
};

module.exports = {
  handler,
};
