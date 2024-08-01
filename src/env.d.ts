// CM - 移动，CU - 联通，CT - 电信，AB - 境外，DEF：默认
declare type Line = 'CM' | 'CT' | 'CU' | 'AB' | 'DEF';

declare interface CfIp {
  colo: string;
  ip: string;
  latency: number;
  line: Line;
  loss: number;
  node: string;
  speed: number;
  time: string;
}

declare interface DomainConfig {
  domain: string,
  subdomain: string,
  lines: Line[]
}

declare type CfIpWithLineGroup = {
  [key in Line]?: CfIp[]
}
