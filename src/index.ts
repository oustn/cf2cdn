import {program} from 'commander'

import packageJson from '../package.json'
import {optimization, list} from './actions'

program
  .name('cf2dns')
  .description('Cloudflare 域名解析批量操作工具')
  .option('-K, --key <key>', '优选 IP 查询 key', 'o1zrmHAF')
  .version(packageJson.version)


program
  .command('optimize')
  .description('优化解析记录')
  .argument('<domains...>', `需要配置的域名，"子域名@域名@线路1,线路2," 格式，支持配置多个；线路: CM - 移动，CU - 联通，CT - 电信，AB - 境外，DEF：默认`)
  .option('--secretId <secretId>', 'DNS open API key')
  .option('--secretKey <secretKey>', 'DNS open API secret')
  .action(optimization)

program
  .command('list')
  .description('列出优选 IP')
  .action(list)

program.parse();
