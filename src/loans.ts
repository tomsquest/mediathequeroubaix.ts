import * as TE from "fp-ts/TaskEither";

// type Loans = {
//   username: string;
//   loans: {
//     title: string;
//   }[];
// }

export const listLoans = (): TE.TaskEither<Error, string> => {
  return TE.of("Getting loans");
  // return TE.left(new Error("Error getting loans"));
};
