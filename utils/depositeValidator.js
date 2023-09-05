import { body } from "express-validator";

export const validateBankTransfer = [
  body("deposited_from")
    .notEmpty()
    .withMessage("Deposited From is required")
    .isIn([
      "AB Bank Ltd.",
      "Agrani Bank",
      "Al-Arafah Islami Bank Ltd",
      "Ansar VDP unnayan Bank",
      "Basic Bank",
      "BRAC Bank",
      "Bangladesh Commerce Bank LTD.",
      "Bangladesh Development Bank",
      "Bangladesh Krishi Bank",
      "Bank Al-Falah",
      "Bank Asia LTD",
      "CITI BANK NA",
      "Commercial Bank of Ceylon",
      "Community Bank Bangladesh Limited",
      "Dhaka Bank Ltd",
      "Dutch Bangla Bank Limited",
      "EXIM Bank Ltd",
      "Eastern Bank Ltd",
      "First Security Islami Bank Ltd.",
      "Global Islami Bank Ltd.",
      "Grameen Bank",
      "HSBC",
      "Habib Bank Ltd",
      "ICB Islami Bank",
      "IFIC Bank Ltd",
      "Islami Bank Bangladesh Ltd.",
      "Jamuna Bank Ltd.",
      "Janata Bank Ltd.",
      "Jubilee Bank",
      "Karmashangosthan Bank",
      "Meghna Bank Ltd.",
      "Mercantile Bank",
      "Midland Bank Ltd.",
      "Modhumati Bank Ltd.",
      "Mutual Trust Bank Ltd.",
      "NCC Bank Ltd.",
      "NRB Bank Ltd.",
      "NRB Commercial Bank Ltd.",
      "National Bank Ltd.",
      "National Bank fo Pakistan Ltd.",
      "One Bank Ltd",
      "Padma bank Ltd.",
      "Palli Sanchay Bank Ltd.",
      "Prime Bank Ltd.",
      "Premier Bank Ltd.",
      "Pubali Bank Ltd.",
      "Rajshahi Krishi Unnayan Bank Ltd.",
      "Rupali Bank",
      "SBAC Bank Ltd.",
      "Shahjalal Islami Bank Ltd.",
      "Shimanto Bank Ltd.",
      "Social Islami Bank Ltd.",
      "Sonali Bank, Baridhara Branch",
      "Standard Chartered Bank, Progati Sharani SME Branch",
      "NCC Bank, Bashundhara Branch",
      "City Bank, Jomuna Future park Branch",
      "Modhumoti Bank, Sheikh Kamal Sarani Branch",
      "Dutch Bangla Bank, Bashundhara Branch",
    ])
    .withMessage("Invalid Deposited From"),

  body("deposited_to")
    .notEmpty()
    .withMessage("Deposited To is required")
    .isIn([
      "Islami Bank, Baridhara Branch Account Fly Far International 20503420100141709",
      "Brac Bank, Bashundhora Branch Fly Far International 1521204262962001",
      "Sonali Bank, Baridhara Branch Fly Far International 01081020006951",
      "Commercial Bank, Progati Sharani SME Branch Fly Far International 1813001751",
      "Standard Chartered Bank, Progati Sharani SME Branch Fly Far International 01886946302",
      "NCC Bank, Bashundhara Branch Fly Far International 00960210002554",
      "City Bank, Jomuna Future park Branch Fly Far International 1502553140001",
      "Modhumoti Bank, Sheikh Kamal Sarani Branch Fly Far International 112011100000223",
      "Dutch Bangla Bank, Bashundhara Branch Fly Far International 1471100016468",
    ])
    .withMessage("Invalid Deposited To"),

  body("transfer_type")
    .notEmpty()
    .withMessage("Transaction Type is required")
    .isIn(["NPSB", "BFTN", "RTGS", "EFT"])
    .withMessage("Invalid Transaction Type"),

  body("amount")
    .notEmpty()
    .withMessage("Enter Amount is required")
    .isNumeric()
    .withMessage("Enter Amount must be a number"),
];

export const validateChequeDeposit = [
  body("check_number")
    .notEmpty()
    .withMessage("Check Number is required")
    .isString()
    .withMessage("Check Number must be a string"),

  body("bank_name")
    .notEmpty()
    .withMessage("Bank Name is required")
    .isIn([
      "AB Bank Ltd.",
      "Agrani Bank",
      "Al-Arafah Islami Bank Ltd",
      "Ansar VDP unnayan Bank",
      "Basic Bank",
      "BRAC Bank",
      "Bangladesh Commerce Bank LTD.",
      "Bangladesh Development Bank",
      "Bangladesh Krishi Bank",
      "Bank Al-Falah",
      "Bank Asia LTD",
      "CITI BANK NA",
      "Commercial Bank of Ceylon",
      "Community Bank Bangladesh Limited",
      "Dhaka Bank Ltd",
      "Dutch Bangla Bank Limited",
      "EXIM Bank Ltd",
      "Eastern Bank Ltd",
      "First Security Islami Bank Ltd.",
      "Global Islami Bank Ltd.",
      "Grameen Bank",
      "HSBC",
      "Habib Bank Ltd",
      "ICB Islami Bank",
      "IFIC Bank Ltd",
      "Islami Bank Bangladesh Ltd.",
      "Jamuna Bank Ltd.",
      "Janata Bank Ltd.",
      "Jubilee Bank",
      "Karmashangosthan Bank",
      "Meghna Bank Ltd.",
      "Mercantile Bank",
      "Midland Bank Ltd.",
      "Modhumati Bank Ltd.",
      "Mutual Trust Bank Ltd.",
      "NCC Bank Ltd.",
      "NRB Bank Ltd.",
      "NRB Commercial Bank Ltd.",
      "National Bank Ltd.",
      "National Bank fo Pakistan Ltd.",
      "One Bank Ltd",
      "Padma bank Ltd.",
      "Palli Sanchay Bank Ltd.",
      "Prime Bank Ltd.",
      "Premier Bank Ltd.",
      "Pubali Bank Ltd.",
      "Rajshahi Krishi Unnayan Bank Ltd.",
      "Rupali Bank",
      "SBAC Bank Ltd.",
      "Shahjalal Islami Bank Ltd.",
      "Shimanto Bank Ltd.",
      "Social Islami Bank Ltd.",
      "Sonali Bank, Baridhara Branch",
      "Standard Chartered Bank, Progati Sharani SME Branch",
      "NCC Bank, Bashundhara Branch",
      "City Bank, Jomuna Future park Branch",
      "Modhumoti Bank, Sheikh Kamal Sarani Branch",
      "Dutch Bangla Bank, Bashundhara Branch",
    ])
    .withMessage("Invalid Bank Name"),

  body("cheque_date")
    .notEmpty()
    .withMessage("Cheque Date is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid Cheque Date"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
];
export const validateCashDeposit = [
  body("depositor_name").notEmpty().withMessage("Depositor name is required"),
  body("receiver_name").notEmpty().withMessage("Receiver name is required"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
];
