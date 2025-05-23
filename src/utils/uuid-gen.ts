export const uuidGen = () => {
  return Date.now().toString(36) + '-' + (Date.now() - 1).toString(36);
};
