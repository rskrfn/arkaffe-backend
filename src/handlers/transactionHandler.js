const transactionModel = require('../models/transactionModel');
const responseStandard = require('../helpers/response');

const addTransaction = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { payment, code, setTime, deliveryTable } = req.body;

    const transaction = {
      cart_id: cartId,
      payment_method: payment,
      code_transaction: code,
      set_time: setTime,
      delivery_table: deliveryTable,
    };

    if (!payment || !code || !!deliveryTable) {
      responseStandard(res, 'Some fields can not be empty', {}, 400, false);
    }

    const addTransaction = await transactionModel.addTransaction(transaction);

    if (!addTransaction) {
      responseStandard(res, 'Transaction failed', {}, 400, false);
      return;
    }

    return responseStandard(res, 'Transaction success', {}, 200, true);
  } catch (err) {
    console.log(err);
    return responseStandard(res, err, {}, 500, false);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { payment, code, setTime, deliveryTable } = req.body;

    await transactionModel.updateTransaction(
      payment,
      code,
      setTime,
      deliveryTable,
      cartId,
    );

    return responseStandard(res, 'Transaction updated', {}, 200, true);
  } catch (err) {
    responseStandard(res, err, {}, 500, false);
  }
};

module.exports = {
  addTransaction,
  updateTransaction,
};
