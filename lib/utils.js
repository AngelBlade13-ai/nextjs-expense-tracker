export const currencyFormatter = (amount) => {
  const formatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  });
  return formatter.format(amount);
};
