import * as tencentCloud from "tencentcloud-sdk-nodejs"
import {DnsClient} from "./dns-client";

const DnsPodClient = tencentCloud.dnspod.v20210323.Client

const LINE_MAP: Record<Line, string> = {
  "CM": "移动", "CU": "联通", "CT": "电信", "AB": "境外", "DEF": "默认"
}

export function createClient(
  secretId: string,
  secretKey: string,
  region: string = 'ap-shanghai'
) {
  return new DnsPodClient({
    credential: {
      secretId,
      secretKey
    },
    region,
    profile: {
      signMethod: "TC3-HMAC-SHA256",
      httpProfile: {
        reqMethod: "POST",
      },
    },
  })
}

export class DNSPodClient extends DnsClient {
  private client: ReturnType<typeof createClient>

  constructor(private secretId: string, private secretKey: string) {
    super()
    this.client = createClient(secretId, secretKey)
  }

  async removeRecord(domain: string, recordId: number) {
    return this.client.DeleteRecord({
      Domain: domain,
      RecordId: recordId
    })
  }

  async getRecord(domain: string, subDomain: string, type: string | undefined = undefined, limit: number = 20) {
    return await this.client.DescribeRecordList({
      Domain: domain,
      Subdomain: subDomain,
      RecordType: type,
      Limit: limit
    })
  }

  async optimize(domain: DomainConfig, cfIp: CfIpWithLineGroup) {
    console.log(`开始优化 ${domain.domain} 的解析`)
    const record = await this.getRecord(domain.domain, domain.subdomain)
    console.log(`获取 ${domain.domain} 的解析成功`)
    // 1. 删除 CNAME
    await Promise.all(
      record.RecordList?.filter(
        record => record.Type === 'CNAME'
      )
        .map(
          record => this.removeRecord(domain.domain, record.RecordId)
        ) ?? []
    )

    // 循环处理线路
    await Promise.all(
      domain.lines.map(line => {
        const name = LINE_MAP[line]
        console.log(`处理 ${domain.domain} 的 ${name} 解析`)
        const aRecord = record.RecordList?.find(
          record => record.Type === 'A' && record.Line === name
        )
        if (aRecord) {
          return this.modifyRecord(domain.domain, domain.subdomain, aRecord.RecordId, name, this.getIp(line, cfIp))
        } else {
          return this.addRecord(domain.domain, domain.subdomain, name, this.getIp(line, cfIp))
        }
      })
    )
  }

  private async modifyRecord(domain: string, subdomain: string, RecordId: number, line: string, ip: string) {
    console.log(`修改 ${domain} 的 ${subdomain} 解析记录 ${ip}`)
    return this.client.ModifyRecord({
      Domain: domain,
      RecordId,
      SubDomain: subdomain,
      RecordType: 'A',
      RecordLine: line,
      Value: ip
    })
  }

  private async addRecord(domain: string, subdomain: string, line: string, ip: string) {
    console.log(`添加 ${domain} 的 ${subdomain} 解析记录 ${ip}`)
    return this.client.CreateRecord({
      Domain: domain,
      SubDomain: subdomain,
      RecordType: 'A',
      RecordLine: line,
      Value: ip
    })
  }
}
