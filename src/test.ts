import { FormData, request } from "undici";

const data = new FormData();
data.set("name", "X0002412030");
data.set("pass", "03/11/1980");
data.set("form_id", "user_login");

const resp = await request("http://www.mediathequederoubaix.fr", {
  method: "POST",
  body: data,
});

const text = await resp.body.text();

console.log("text", text);
