export function isMacPlatform(): boolean {
  return /mac/i.test(navigator.platform || navigator.userAgent);
}
