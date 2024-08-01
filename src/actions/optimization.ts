import {Command} from "commander";
import {DNSPodClient} from "../helpers/dns-pod";
import {parseDomain} from "../helpers/utils";
import {queryCfIp} from "../helpers/query";

export async function optimization(
  domainRecords: string[],
  _: unknown,
  command: Command
) {
  const options: {
    key: string,
    secretId: string,
    secretKey: string,
  } = command.optsWithGlobals()
  const domains = domainRecords.map(parseDomain)
  const availableDomains = domains.filter((domain) => domain.domain && domain.subdomain && domain.lines.length)
  if (!availableDomains.length) {
    console.log('没有合法的域名配置')
    return
  }

  const cfIp = await queryCfIp(options.key)

  const dnsPod = new DNSPodClient(options.secretId, options.secretKey)

  await Promise.all(availableDomains.map(async (domain) => dnsPod.optimize(domain, cfIp)))
}
