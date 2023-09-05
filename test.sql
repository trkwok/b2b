-- Active: 1693880300510@@127.0.0.1@3306@b2b


    CREATE TABLE BankTransfer (
    id VARCHAR(100) DEFAULT REPLACE(UUID(), '-', '') PRIMARY KEY,
     banktransfer_id VARCHAR(10) GENERATED ALWAYS AS (CONCAT('BT', 1000 + id)),
deposited_from ENUM(
      'AB Bank Ltd.',
        'Agrani Bank',
        'Al-Arafah Islami Bank Ltd',
        'Ansar VDP unnayan Bank',
        'Basic Bank',
        'BRAC Bank',
        'Bangladesh Commerce Bank LTD.',
        'Bangladesh Development Bank',
        'Bangladesh Krishi Bank',
        'Bank Al-Falah',
        'Bank Asia LTD',
        'CITI BANK NA',
        'Commercial Bank of Ceylon',
        'Community Bank Bangladesh Limited',
        'Dhaka Bank Ltd',
        'Dutch Bangla Bank Limited',
        'EXIM Bank Ltd',
        'Eastern Bank Ltd',
        'First Security Islami Bank Ltd.',
        'Global Islami Bank Ltd.',
        'Grameen Bank',
        'HSBC',
        'Habib Bank Ltd',
        'ICB Islami Bank',
        'IFIC Bank Ltd',
        'Islami Bank Bangladesh Ltd.',
        'Jamuna Bank Ltd.',
        'Janata Bank Ltd.',
        'Jubilee Bank',
        'Karmashangosthan Bank',
        'Meghna Bank Ltd.',
        'Mercantile Bank',
        'Midland Bank Ltd.',
        'Modhumati Bank Ltd.',
        'Mutual Trust Bank Ltd.',
        'NCC Bank Ltd.',
        'NRB Bank Ltd.',
        'NRB Commercial Bank Ltd.',
        'National Bank Ltd.',
        'National Bank fo Pakistan Ltd.',
        'One Bank Ltd',
        'Padma bank Ltd.',
        'Palli Sanchay Bank Ltd.',
        'Prime Bank Ltd.',
        'Premier Bank Ltd.',
        'Pubali Bank Ltd.',
        'Rajshahi Krishi Unnayan Bank Ltd.',
        'Rupali Bank',
        'SBAC Bank Ltd.',
        'Shahjalal Islami Bank Ltd.',
        'Shimanto Bank Ltd.',
        'Social Islami Bank Ltd.',
        'Sonali Bank, Baridhara Branch',
        'Standard Chartered Bank, Progati Sharani SME Branch',
        'NCC Bank, Bashundhara Branch',
        'City Bank, Jomuna Future park Branch',
        'Modhumoti Bank, Sheikh Kamal Sarani Branch',
        'Dutch Bangla Bank, Bashundhara Branch'
    ) NOT NULL,
    deposited_to ENUM(
          'Islami Bank, Baridhara Branch Account Fly Far International 20503420100141709',
            'Brac Bank, Bashundhora Branch Fly Far International 1521204262962001',
            'Sonali Bank, Baridhara Branch Fly Far International 01081020006951',
            'Commercial Bank, Progati Sharani SME Branch Fly Far International 1813001751',
            'Standard Chartered Bank, Progati Sharani SME Branch Fly Far International 01886946302',
            'NCC Bank, Bashundhara Branch Fly Far International 00960210002554',
            'City Bank, Jomuna Future park Branch Fly Far International 1502553140001',
            'Modhumoti Bank, Sheikh Kamal Sarani Branch Fly Far International 112011100000223',
            'Dutch Bangla Bank, Bashundhara Branch Fly Far International 1471100016468'
       
    ) NOT NULL,
   transaction_date DATE NOT NULL,
    enter_amount DECIMAL(10, 2) NOT NULL,
    transfer_type ENUM('NPSB', 'BFTN', 'RTGS', 'EFT') NOT NULL,
    deposited_by VARCHAR(100) NOT NULL,
    transaction_file VARCHAR(255) NOT NULL
);
ALTER TABLE BankTransfer
ADD COLUMN transaction_file VARCHAR(255) NOT NULL;

ALTER TABLE BankTransfer
ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';

CREATE TABLE ChequeDeposit (
    id VARCHAR(100) DEFAULT REPLACE(UUID(), '-', '') PRIMARY KEY,
    cheque_id VARCHAR(10) GENERATED ALWAYS AS (CONCAT('CD', 1000 + id)),
     check_number VARCHAR(50) NOT NULL,
    bank_name ENUM(
        'AB Bank Ltd.',
        'Agrani Bank',
        'Al-Arafah Islami Bank Ltd',
        'Ansar VDP unnayan Bank',
        'Basic Bank',
        'BRAC Bank',
        'Bangladesh Commerce Bank LTD.',
        'Bangladesh Development Bank',
        'Bangladesh Krishi Bank',
        'Bank Al-Falah',
        'Bank Asia LTD',
        'CITI BANK NA',
        'Commercial Bank of Ceylon',
        'Community Bank Bangladesh Limited',
        'Dhaka Bank Ltd',
        'Dutch Bangla Bank Limited',
        'EXIM Bank Ltd',
        'Eastern Bank Ltd',
        'First Security Islami Bank Ltd.',
        'Global Islami Bank Ltd.',
        'Grameen Bank',
        'HSBC',
        'Habib Bank Ltd',
        'ICB Islami Bank',
        'IFIC Bank Ltd',
        'Islami Bank Bangladesh Ltd.',
        'Jamuna Bank Ltd.',
        'Janata Bank Ltd.',
        'Jubilee Bank',
        'Karmashangosthan Bank',
        'Meghna Bank Ltd.',
        'Mercantile Bank',
        'Midland Bank Ltd.',
        'Modhumati Bank Ltd.',
        'Mutual Trust Bank Ltd.',
        'NCC Bank Ltd.',
        'NRB Bank Ltd.',
        'NRB Commercial Bank Ltd.',
        'National Bank Ltd.',
        'National Bank fo Pakistan Ltd.',
        'One Bank Ltd',
        'Padma bank Ltd.',
        'Palli Sanchay Bank Ltd.',
        'Prime Bank Ltd.',
        'Premier Bank Ltd.',
        'Pubali Bank Ltd.',
        'Rajshahi Krishi Unnayan Bank Ltd.',
        'Rupali Bank',
        'SBAC Bank Ltd.',
        'Shahjalal Islami Bank Ltd.',
        'Shimanto Bank Ltd.',
        'Social Islami Bank Ltd.',
        'Sonali Bank, Baridhara Branch',
        'Standard Chartered Bank, Progati Sharani SME Branch',
        'NCC Bank, Bashundhara Branch',
        'City Bank, Jomuna Future park Branch',
        'Modhumoti Bank, Sheikh Kamal Sarani Branch',
        'Dutch Bangla Bank, Bashundhara Branch'
    ) NOT NULL,
    cheque_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_file VARCHAR(255) NOT NULL,
    deposited_by VARCHAR(100) NOT NULL
);


CREATE TABLE CashDeposit (
    id VARCHAR(100) DEFAULT REPLACE(UUID(), '-', '') PRIMARY KEY,
    cash_id VARCHAR(10) GENERATED ALWAYS AS (CONCAT('CA', 1000 + id)),
    depositor_name VARCHAR(100) NOT NULL,
    receiver_name VARCHAR(100),
    amount DECIMAL(10, 2),
    transaction_file VARCHAR(255),
    deposited_by VARCHAR(100) NOT NULL
);