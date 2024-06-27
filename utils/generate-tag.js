const getMiddleLetter = (str) => {
    const middle = str.slice(1, -1); 
    const randomIndex = Math.floor(Math.random() * middle.length); 
    return middle[randomIndex]; 
}

exports.generateTagShape = async (shapeName) => {
    const firstLetter = shapeName[0].toLowerCase(); 
    const lastLetter = shapeName[shapeName.length - 1].toLowerCase(); 
    const middleLetter = await getMiddleLetter(shapeName).toLowerCase();
    return `${firstLetter}${middleLetter}${lastLetter}`; 
}

exports.generateTagColour = (colour) =>   `col${colour.toLowerCase()}`;

exports.generateTagClarity = (clarity) => `cla${clarity.toLowerCase()}`;

exports.generateTagSize = (carat) => `car${carat}`;

exports.generateTagCurrencyMaster = (currency) => `${currency.toLowerCase()}`;

exports.generateTagCurrencyRate = (currency1,currency2) => `${currency1.toLowerCase()}${currency2.toLowerCase()}`;

const getFirstLetter = (asset) => {
    const words = asset.split(' ');
    let tag = "";
    for (const word of words) {
        tag += word.charAt(0);
    }
    return tag.toLowerCase();
}

exports.generateTagAsset = (asset) => `${getFirstLetter(asset)}`;
