export const money = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const number = (v: number) =>
  v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
export function localDate(s: string) {
  return s
    ? new Date(`${s}T12:00:00`).toLocaleDateString("pt-BR")
    : "Não informada";
}
