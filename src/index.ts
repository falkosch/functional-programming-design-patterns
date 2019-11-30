[
  require("./strategy").default, 
  require("./facade").default
].reduce(
  (before, demonstrator) => before.then(() => demonstrator()),
  Promise.resolve()
);
