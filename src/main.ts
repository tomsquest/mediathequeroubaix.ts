import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { EOL } from "os";

import { getCommand } from "./command-line";

const main = async (): Promise<void> => {
  const args = process.argv.slice(2);

  const result = await pipe(
    args,
    getCommand,
    (cmd) => cmd(),
    TE.match(
      (error) => `An error occurred!${EOL}${error.message}`,
      (unkn) => unkn,
    ),
  )();
  console.log(result);
};

await main();
