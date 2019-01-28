// False sanity check indicates failure
const sanityCheckCreator = fn => (...args) =>
  args.reduce((acc, itm) => acc && fn(itm), true);

module.exports = {
  sanityCheckCreator,
};
