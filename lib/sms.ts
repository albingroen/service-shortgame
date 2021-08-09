import https from "https";
import qs from "querystring";

export async function sendSMS(postFields: {
  message: string;
  dryrun?: string;
  from: string;
  to: string;
}) {
  const username = process.env.ELKS_USERNAME;
  const password = process.env.ELKS_PASSWORD;

  const key = Buffer.from(username + ":" + password).toString("base64");
  const postData = qs.stringify(postFields);

  const options = {
    hostname: "api.46elks.com",
    path: "/a1/SMS",
    method: "POST",
    headers: {
      Authorization: "Basic " + key,
    },
  };

  const callback = (response: any) => {
    var str = "";
    response.on("data", (chunk: any) => {
      str += chunk;
    });

    response.on("end", () => {
      console.log(str);
    });
  };

  var request = https.request(options, callback);
  request.write(postData);
  request.end();

  return true;
}
