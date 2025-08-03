let user = {
  name: "John",
  address: {
    country: "India",
    state: "India",
    education: {
      school: "APS",
      year: 2021,
    },
  },
};

// solution 1 --> using object.entries
function flattenObject(
  obj: Record<string, any> = {},
  prefixKey: string = "",
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefixKey ? `${prefixKey}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value))
      Object.assign(result, flattenObject(value, newKey));
    else result[newKey] = value;
  }
  return result;
}

// using reduce and Object.keys()
function flattenObject_two(
  obj: Record<string, any> = {},
  prefixKey: string = "",
): Record<string, any> {
  return Object.keys(obj).reduce(
    (acc: Record<string, any>, key: string) => {
      const value = obj[key];
      const newKey = prefixKey ? `${prefixKey}.${key}` : key;
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        Object.assign(acc, flattenObject_two(value, newKey));
      } else {
        acc[newKey] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
}

console.log(flattenObject(user, "user"));
console.log(flattenObject_two(user, "user"));
