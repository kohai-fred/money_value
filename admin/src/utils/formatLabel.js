import { isoToEmoji } from "./isoToEmoji";
export function formatLabel(exchange) {
  const label = `${isoToEmoji(exchange.currency_1.code)} ${exchange.currency_1.name} → ${
    exchange.currency_2.name
  } ${isoToEmoji(exchange.currency_2.code)}`;
  return label;
}
