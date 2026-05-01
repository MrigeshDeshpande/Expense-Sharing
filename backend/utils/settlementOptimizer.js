const optimizeSettlements = (balances) => {
  const debtors = [];
  const creditors = [];

  balances.forEach(b => {
    if (b.netBalance > 0.01) {
      creditors.push({ name: b.name, amount: b.netBalance });
    } else if (b.netBalance < -0.01) {
      debtors.push({ name: b.name, amount: Math.abs(b.netBalance) });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const payer = debtors[i];
    const payee = creditors[j];

    const amount = Math.min(payer.amount, payee.amount);
    const fixedAmount = Number(amount.toFixed(2));

    if (fixedAmount > 0) {
      transactions.push({
        from: payer.name,
        to: payee.name,
        amount: fixedAmount
      });
    }

    payer.amount = Number((payer.amount - fixedAmount).toFixed(2));
    payee.amount = Number((payee.amount - fixedAmount).toFixed(2));

    if (payer.amount < 0.01) i++;
    if (payee.amount < 0.01) j++;
  }

  return transactions;
};

module.exports = { optimizeSettlements };
