import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { CookieAgent } from "http-cookie-agent/undici";
import { CookieJar } from "tough-cookie";
import { Dispatcher, FormData, request } from "undici";

// type Loans = {
//   username: string;
//   loans: {
//     title: string;
//   }[];
// }

export const listLoans = (): TE.TaskEither<Error, string> => {
  return pipe(
    authenticate(
      "http://www.mediathequederoubaix.fr",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.USERNAME!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.PASSWORD!,
    ),
    TE.chain(getText),
  );
};

const authenticate = (url: string, user: string, pass: string) =>
  TE.tryCatch(
    () => {
      const cookieJar = new CookieJar();
      const agent = new CookieAgent({ cookies: { jar: cookieJar } });

      const data = new FormData();
      data.set("name", user);
      data.set("pass", pass);
      data.set("form_id", "user_login");

      return request(url, {
        method: "POST",
        body: data,
        dispatcher: agent,
      });
    },
    (reason) => new Error(`Unable to authenticate: ${String(reason)}`),
  );
const getText = TE.tryCatchK<Error, [Dispatcher.ResponseData], string>(
  async (resp) => {
    const text = await resp.body.text();
    console.log("text", text);
    return text;
  },
  (reason) => new Error(`Unable to : ${String(reason)}`),
);
