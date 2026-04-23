import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';

export type SsrfCheckResult = { ok: true; hostname: string } | { ok: false; reason: string };

const BLOCKED_HOSTNAMES = new Set(['localhost', 'ip6-localhost', 'ip6-loopback']);

function ipv4ToNumber(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let result = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n < 0 || n > 255) return null;
    result = (result << 8) + n;
  }
  return result >>> 0;
}

function isPrivateIPv4(ip: string): boolean {
  const n = ipv4ToNumber(ip);
  if (n === null) return false;
  if (n >>> 24 === 0) return true; // 0.0.0.0/8
  if (n >>> 24 === 10) return true; // 10.0.0.0/8
  if (n >>> 24 === 127) return true; // 127.0.0.0/8 (loopback)
  if (n >>> 16 === 0xa9fe) return true; // 169.254.0.0/16 (link-local)
  if (n >>> 20 === 0xac1) return true; // 172.16.0.0/12
  if (n >>> 16 === 0xc0a8) return true; // 192.168.0.0/16
  if (n >>> 22 === 0x191) return true; // 100.64.0.0/10 (CGNAT)
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::' || lower === '::1') return true;
  if (/^f[cd]/.test(lower)) return true; // fc00::/7 (unique-local)
  if (/^fe[89ab]/.test(lower)) return true; // fe80::/10 (link-local)
  const v4mapped = /^::ffff:([0-9.]+)$/.exec(lower);
  if (v4mapped && v4mapped[1]) return isPrivateIPv4(v4mapped[1]);
  return false;
}

export async function checkUrlAllowed(url: URL): Promise<SsrfCheckResult> {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, reason: `Only http and https URLs are allowed (got ${url.protocol})` };
  }

  const rawHostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(rawHostname)) {
    return { ok: false, reason: `Blocked hostname: ${rawHostname}` };
  }

  const bracketless = rawHostname.replace(/^\[|\]$/g, '');
  const ipVersion = isIP(bracketless);

  if (ipVersion === 4 && isPrivateIPv4(bracketless)) {
    return { ok: false, reason: `Blocked private IPv4: ${bracketless}` };
  }
  if (ipVersion === 6 && isPrivateIPv6(bracketless)) {
    return { ok: false, reason: `Blocked private IPv6: ${bracketless}` };
  }
  if (ipVersion !== 0) {
    return { ok: true, hostname: bracketless };
  }

  try {
    const addresses = await dns.lookup(rawHostname, { all: true });
    for (const addr of addresses) {
      if (addr.family === 4 && isPrivateIPv4(addr.address)) {
        return { ok: false, reason: `${rawHostname} resolves to private IPv4 ${addr.address}` };
      }
      if (addr.family === 6 && isPrivateIPv6(addr.address)) {
        return { ok: false, reason: `${rawHostname} resolves to private IPv6 ${addr.address}` };
      }
    }
  } catch {
    return { ok: false, reason: `DNS lookup failed for ${rawHostname}` };
  }

  return { ok: true, hostname: rawHostname };
}
