const optimizeSettlements = (netBalances) => {
  const usersWhoOwe = [];
  const usersWhoAreOwed = [];

  for (const [userId, balance] of Object.entries(netBalances)) {
    if (balance > 0.01) {
      usersWhoAreOwed.push({ id: userId, amount: balance });
    } else if (balance < -0.01) {
      usersWhoOwe.push({ id: userId, amount: Math.abs(balance) });
    }
  }

  usersWhoOwe.sort((a, b) => b.amount - a.amount);
  usersWhoAreOwed.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let oweIndex = 0;
  let owedIndex = 0;

  while (oweIndex < usersWhoOwe.length && owedIndex < usersWhoAreOwed.length) {
    const payer = usersWhoOwe[oweIndex];
    const receiver = usersWhoAreOwed[owedIndex];

    const transferAmount = Math.min(payer.amount, receiver.amount);
    const roundedAmount = Number(transferAmount.toFixed(2));

    if (roundedAmount > 0) {
      transactions.push({
        from: payer.id,
        to: receiver.id,
        amount: roundedAmount
      });
    }

    payer.amount -= roundedAmount;
    receiver.amount -= roundedAmount;

    if (payer.amount < 0.01) oweIndex++;
    if (receiver.amount < 0.01) owedIndex++;
  }

  return transactions;
};

module.exports = { optimizeSettlements };
