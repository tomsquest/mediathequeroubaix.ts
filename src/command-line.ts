import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

import { getLoans } from "./loans";
import { usage } from "./usage";

type Command = () => void;

export const getCommand = (args: string[]): Command => {
  return pipe(
    args,
    first,
    O.match(
      () => usage(),
      (name) => {
        if (name === "loans") return getLoans;
        return usage(`unknown command: ${name}`);
      },
    ),
  );
};

const first = <T>(values: T[]): O.Option<T> =>
  values.length ? O.some(values[0]) : O.none;
