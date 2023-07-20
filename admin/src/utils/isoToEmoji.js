export function isoToEmoji(code) {
  return code
    .split("")
    .splice(0, 2)
    .map((letter) => (letter.charCodeAt(0) % 32) + 0x1f1e5)
    .map((n) => String.fromCodePoint(n))
    .join("");
}
