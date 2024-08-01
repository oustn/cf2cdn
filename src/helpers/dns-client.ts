export class DnsClient {
  protected getIp(line: Line, ips: CfIpWithLineGroup) {
    if (ips[line]?.length) {
      const random = Math.floor(Math.random() * ips[line].length)
      return ips[line][random].ip
    }
    if (line === 'AB') {
      return '1.0.0.5'
    }
    const all = Object.values(ips).flat()
    const random = Math.floor(Math.random() * all.length)
    return all[random].ip
  }
}
