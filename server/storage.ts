import { accounts, transactions, transfers, billPayments, type Account, type Transaction, type Transfer, type BillPayment, type InsertAccount, type InsertTransaction, type InsertTransfer, type InsertBillPayment } from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

const sqlite = new Database("data.db");
const db = drizzle(sqlite);

export interface IStorage {
  getAccounts(): Account[];
  getAccount(id: number): Account | undefined;
  createAccount(account: InsertAccount): Account;
  updateAccountBalance(id: number, balance: number, availableBalance: number): void;
  getTransactions(accountId: number): Transaction[];
  createTransaction(transaction: InsertTransaction): Transaction;
  getTransfers(): Transfer[];
  createTransfer(transfer: InsertTransfer): Transfer;
  getBillPayments(): BillPayment[];
  createBillPayment(payment: InsertBillPayment): BillPayment;
  seedData(): void;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  getAccounts(): Account[] {
    return db.select().from(accounts).all();
  }

  getAccount(id: number): Account | undefined {
    return db.select().from(accounts).where(eq(accounts.id, id)).get();
  }

  createAccount(account: InsertAccount): Account {
    return db.insert(accounts).values(account).returning().get();
  }

  updateAccountBalance(id: number, balance: number, availableBalance: number): void {
    db.update(accounts)
      .set({ balance, availableBalance })
      .where(eq(accounts.id, id))
      .run();
  }

  getTransactions(accountId: number): Transaction[] {
    return db.select().from(transactions).where(eq(transactions.accountId, accountId)).all();
  }

  createTransaction(transaction: InsertTransaction): Transaction {
    return db.insert(transactions).values(transaction).returning().get();
  }

  getTransfers(): Transfer[] {
    return db.select().from(transfers).all();
  }

  createTransfer(transfer: InsertTransfer): Transfer {
    return db.insert(transfers).values(transfer).returning().get();
  }

  getBillPayments(): BillPayment[] {
    return db.select().from(billPayments).all();
  }

  createBillPayment(payment: InsertBillPayment): BillPayment {
    return db.insert(billPayments).values(payment).returning().get();
  }

  seedData(): void {
    const existing = db.select().from(accounts).all();
    if (existing.length > 0) return;

    const checking = this.createAccount({
      accountName: "Premier Checking",
      accountType: "checking",
      accountNumber: "****7842",
      routingNumber: "302075018",
      balance: 35235352.32,
      availableBalance: 35235352.32,
      ownerName: "Zackary Lovrek",
    });

    const savings = this.createAccount({
      accountName: "High-Yield Savings",
      accountType: "savings",
      accountNumber: "****3291",
      routingNumber: "302075018",
      balance: 8742156.89,
      availableBalance: 8742156.89,
      ownerName: "Zackary Lovrek",
    });

    const moneyMarket = this.createAccount({
      accountName: "Money Market",
      accountType: "money_market",
      accountNumber: "****5610",
      routingNumber: "302075018",
      balance: 2150000.00,
      availableBalance: 2150000.00,
      ownerName: "Zackary Lovrek",
    });

    const checkingTxns = [
      { date: "2026-03-30", description: "Wire Transfer - Investment Holdings", category: "Transfer", amount: 2500000.00, balance: 35235352.32, type: "credit", status: "posted" },
      { date: "2026-03-29", description: "ACH - Payroll Distribution", category: "Income", amount: 85000.00, balance: 32735352.32, type: "credit", status: "posted" },
      { date: "2026-03-28", description: "POS - Whole Foods Market #1042", category: "Groceries", amount: -342.87, balance: 32650352.32, type: "debit", status: "posted" },
      { date: "2026-03-27", description: "Wire Transfer - Property Holdings LLC", category: "Real Estate", amount: -125000.00, balance: 32650695.19, type: "debit", status: "posted" },
      { date: "2026-03-26", description: "ACH - Enterprise Cloud Services", category: "Business", amount: -4299.99, balance: 32775695.19, type: "debit", status: "posted" },
      { date: "2026-03-25", description: "Mobile Deposit - Check #4892", category: "Deposit", amount: 750000.00, balance: 32779995.18, type: "credit", status: "posted" },
      { date: "2026-03-24", description: "POS - Tesla Supercharger", category: "Auto", amount: -48.32, balance: 32029995.18, type: "debit", status: "posted" },
      { date: "2026-03-23", description: "Wire Transfer - Stock Dividend", category: "Investment", amount: 156000.00, balance: 32030043.50, type: "credit", status: "posted" },
      { date: "2026-03-22", description: "ACH - American Express Platinum", category: "Credit Card", amount: -28750.00, balance: 31874043.50, type: "debit", status: "posted" },
      { date: "2026-03-21", description: "Transfer from Savings", category: "Transfer", amount: 500000.00, balance: 31902793.50, type: "credit", status: "posted" },
      { date: "2026-03-20", description: "ACH - Insurance Premium", category: "Insurance", amount: -8500.00, balance: 31402793.50, type: "debit", status: "posted" },
      { date: "2026-03-19", description: "Wire Transfer - Real Estate Closing", category: "Real Estate", amount: 1250000.00, balance: 31411293.50, type: "credit", status: "posted" },
      { date: "2026-03-30", description: "POS - Starbucks Reserve #221", category: "Dining", amount: -12.45, balance: 35235364.77, type: "debit", status: "pending" },
      { date: "2026-03-30", description: "ACH - Digital Marketing Agency", category: "Business", amount: -15000.00, balance: 35250364.77, type: "debit", status: "pending" },
    ];

    for (const txn of checkingTxns) {
      this.createTransaction({ ...txn, accountId: checking.id });
    }

    const savingsTxns = [
      { date: "2026-03-30", description: "Interest Payment - Q1 2026", category: "Interest", amount: 42156.89, balance: 8742156.89, type: "credit", status: "posted" },
      { date: "2026-03-15", description: "Transfer to Checking", category: "Transfer", amount: -500000.00, balance: 8700000.00, type: "debit", status: "posted" },
      { date: "2026-03-01", description: "Automatic Deposit", category: "Deposit", amount: 200000.00, balance: 9200000.00, type: "credit", status: "posted" },
      { date: "2026-02-28", description: "Interest Payment - Feb 2026", category: "Interest", amount: 38500.00, balance: 9000000.00, type: "credit", status: "posted" },
    ];

    for (const txn of savingsTxns) {
      this.createTransaction({ ...txn, accountId: savings.id });
    }

    const mmTxns = [
      { date: "2026-03-30", description: "Dividend Reinvestment", category: "Investment", amount: 15000.00, balance: 2150000.00, type: "credit", status: "posted" },
      { date: "2026-03-15", description: "Monthly Interest", category: "Interest", amount: 8750.00, balance: 2135000.00, type: "credit", status: "posted" },
      { date: "2026-03-01", description: "Contribution", category: "Deposit", amount: 100000.00, balance: 2126250.00, type: "credit", status: "posted" },
    ];

    for (const txn of mmTxns) {
      this.createTransaction({ ...txn, accountId: moneyMarket.id });
    }
  }
}

export const storage = new DatabaseStorage();
