import crypto from 'crypto';

export function sha256Base64(input) {
  return crypto.createHash('sha256').update(input).digest('base64');
}

export function stableStringify(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}
