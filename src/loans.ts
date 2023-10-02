import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { Dispatcher, request } from "undici";

// type Loans = {
//   username: string;
//   loans: {
//     title: string;
//   }[];
// }

export const listLoans = (): TE.TaskEither<Error, string> => {
  const post = (url: string) =>
    TE.tryCatch(
      () => request(url),
      (reason) => new Error(`Unable to fetch loans: ${String(reason)}`),
    );
  const parseJson = TE.tryCatchK<Error, [Dispatcher.ResponseData], string>(
    (resp) => resp.body.text(),
    (reason) => new Error(`Unable to : ${String(reason)}`),
  );

  return pipe(post("http://www.mediathequederoubaix.fr"), TE.chain(parseJson));
};
