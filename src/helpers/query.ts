import {fetch} from 'undici'

const endpoint = 'https://api.hostmonit.com/get_optimization_ip'

export async function queryCfIp(key = 'o1zrmHAF'): Promise<CfIpWithLineGroup> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    body: JSON.stringify({
      key,
    })
  })
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await response.json() as { code: number, info: CfIpWithLineGroup, total: number }
  if (data.code !== 200) {
    console.log('获取优选IP失败', data)
    throw new Error('Failed to fetch data')
  }
  console.log(`获取优选IP成功，共 ${data.total} 条`)
  return data.info
}
