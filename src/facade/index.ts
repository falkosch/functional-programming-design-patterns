import { Demonstrator } from "../Demonstrator.meta-model";

const demonstrator: Demonstrator = async () =>
  [
    require("./immutable-value-representation").default,
    require("./functions-returning-functions").default,
  ].reduce(
    (before, demonstrator) => before.then(() => demonstrator()),
    Promise.resolve()
  );

export default demonstrator;
