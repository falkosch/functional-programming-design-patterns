import { Demonstrator } from "../Demonstrator.meta-model";

const demonstrator: Demonstrator = async () =>
  [
    require("./functions-taking-functions").default,
    require("./functions-returning-functions").default,
    require("./currying").default
  ].reduce(
    (before, demonstrator) => before.then(() => demonstrator()),
    Promise.resolve()
  );

export default demonstrator;
