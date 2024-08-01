const defaultLine: Line[] = ['CT', 'CU', 'CM', 'AB', 'DEF']

export function parseDomain(domainString: string): DomainConfig {
  const domain: DomainConfig = {
    domain: "",
    subdomain: "@",
    lines: [...defaultLine],
  };

  const result = domainString.split("@");
  if (result.length === 1) {
    domain.domain = result[0];
    return domain;
  }
  if (result.length === 3) {
    domain.subdomain = result[0];
    domain.domain = result[1];
    domain.lines = result[2].split(",").filter((line) => defaultLine.includes(line as Line)) as Line[];
    return domain;
  }
  const [first, second] = result
  if (first.includes('.')) {
    domain.domain = first;
    domain.lines = second.split(",").filter((line) => defaultLine.includes(line as Line)) as Line[];
  } else {
    domain.subdomain = first;
    domain.domain = second;
  }
  return domain
}
