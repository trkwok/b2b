import pool from "../../database/db";

const createBankTransfer = async (req) => {
    const {
        deposited_from,
        deposited_to,
        transaction_date,
        enter_amount,
        transfer_type,
    } = req.body;
    const deposited_by = req.user.id;
    console.log(deposited_by);
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
        "INSERT INTO BankTransfer (deposited_from, deposited_to, transaction_date, enter_amount, transfer_type,transaction_file, deposited_by) VALUES (?, ?, ?, ?, ?,?,?)",
        [
            deposited_from,
            deposited_to,
            transaction_date,
            enter_amount,
            transfer_type,
            req.url,
            deposited_by,
        ]
    );
    connection.release();
    return rows;
};
const createChequeTransfer = async (req) => {
    const { check_number, bank_name, cheque_date, amount } = req.body;
    const deposited_by = req.user.id;
    console.log(deposited_by);
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
        "INSERT INTO ChequeDeposit (check_number,bank_name, cheque_date, amount,transaction_file, deposited_by) VALUES (?, ?, ?, ?, ?,?)",
        [
            check_number,
            bank_name,
            cheque_date,
            amount,
            deposited_by,
            req.url,
            deposited_by,
        ]
    );
    connection.release();
    return rows;
};
const createCashDeposit = async (req) => {
    const { depositor_name, reciever_name, amount } = req.body;
    const deposited_by = req.user.id;
    console.log(deposited_by);
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
        "INSERT INTO CashDeposit (depositor_name,reciever_name,amount,transaction_file, deposited_by) VALUES (?, ?, ?, ?,?)",
        [depositor_name, reciever_name, amount, req.url, deposited_by]
    );
    connection.release();
    return rows;
};
export const depositService = {
    createBankTransfer,
    createChequeTransfer,
    createCashDeposit,
};