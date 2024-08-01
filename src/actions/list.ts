import {queryCfIp} from "../helpers/query";

export async function list(...rest: unknown[]) {
  console.log(rest)
  const data = await queryCfIp()
  console.log(data)
}
