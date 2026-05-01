const balanceService = require('../services/balanceService');

const getBalances = async (req, res) => {
  try {
    const balances = await balanceService.getNetBalances();
    res.json(balances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSettlements = async (req, res) => {
  try {
    const settlements = await balanceService.getSettlements();
    res.json(settlements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBalances, getSettlements };
