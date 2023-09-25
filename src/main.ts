import { pipe } from "fp-ts/function";

import { getCommand } from "./command-line";

const main = (): void => {
  const command = pipe(process.argv.slice(2), getCommand);
  command();
};

main();
