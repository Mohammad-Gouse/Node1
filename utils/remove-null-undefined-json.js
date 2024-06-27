exports.removeNullUndefinedFromJSON = (obj) => {
  if (Array.isArray(obj)) {
    for (var i = obj.length - 1; i >= 0; i--) {
      if (obj[i] === null || obj[i] === 'null' || obj[i] === undefined || obj[i] === 'undefined' || obj[i] === '') {
        obj.splice(i, 1);
      } else if (typeof obj[i] === "object") {
        this.removeNullUndefinedFromJSON(obj[i]);
      }
    }
  } else if (typeof obj === "object") {
    for (var key in obj) {
      if (obj[key] === null || obj[key] === 'null' || obj[key] === undefined || obj[key] === 'undefined' || obj[key] === '') {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        this.removeNullUndefinedFromJSON(obj[key]);
      }
    }
  }
  return obj;
};
