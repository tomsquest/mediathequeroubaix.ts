import * as TE from "fp-ts/TaskEither";
import { EOL } from "os";

export const usage = (
  errorMessage?: string,
): (() => TE.TaskEither<Error, string>) => {
  return () => {
    const messages: string[] = [];
    if (errorMessage) messages.push(errorMessage + EOL);
    messages.push(`Usage:`);
    messages.push(`loans: list the loans`);

    const messagesString = messages.join(EOL);
    if (errorMessage) return TE.left(new Error(messagesString));
    return TE.right(messagesString);
  };
};
