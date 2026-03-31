import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(server: Server, app: Express) {
  // --- Auth (demo - just validates against hardcoded user) ---
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    // Demo credentials
    if (username === "zlovrek" && password === "Ent2026!") {
      res.json({
        success: true,
        user: {
          name: "Zackary Lovrek",
          username: "zlovrek",
          email: "zackary.lovrek@entcu.com",
          phone: "(214) 555-0187",
          memberSince: "2019",
          memberId: "ENT-00482791",
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  });

  app.post("/api/auth/logout", (_req, res) => {
    res.json({ success: true });
  });

  // --- Accounts ---
  app.get("/api/accounts", (_req, res) => {
    const accounts = storage.getAccounts();
    res.json(accounts);
  });

  app.get("/api/accounts/:id", (req, res) => {
    const account = storage.getAccount(parseInt(req.params.id));
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json(account);
  });

  app.get("/api/accounts/:id/transactions", (req, res) => {
    const txns = storage.getTransactions(parseInt(req.params.id));
    res.json(txns);
  });

  // --- Transfers ---
  app.post("/api/transfers", (req, res) => {
    const { fromAccountId, toAccountId, amount, memo } = req.body;

    const fromAccount = storage.getAccount(fromAccountId);
    const toAccount = storage.getAccount(toAccountId);

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (fromAccount.availableBalance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const now = new Date().toISOString().split("T")[0];

    const transfer = storage.createTransfer({
      fromAccountId,
      toAccountId,
      amount,
      date: now,
      memo: memo || null,
      status: "completed",
    });

    storage.updateAccountBalance(
      fromAccountId,
      fromAccount.balance - amount,
      fromAccount.availableBalance - amount
    );
    storage.updateAccountBalance(
      toAccountId,
      toAccount.balance + amount,
      toAccount.availableBalance + amount
    );

    storage.createTransaction({
      accountId: fromAccountId,
      date: now,
      description: `Transfer to ${toAccount.accountName}`,
      category: "Transfer",
      amount: -amount,
      balance: fromAccount.balance - amount,
      type: "transfer",
      status: "posted",
    });

    storage.createTransaction({
      accountId: toAccountId,
      date: now,
      description: `Transfer from ${fromAccount.accountName}`,
      category: "Transfer",
      amount: amount,
      balance: toAccount.balance + amount,
      type: "transfer",
      status: "posted",
    });

    res.json(transfer);
  });

  app.get("/api/transfers", (_req, res) => {
    const transfers = storage.getTransfers();
    res.json(transfers);
  });

  // --- Bill Pay ---
  app.post("/api/bill-pay", (req, res) => {
    const { accountId, payee, category, amount } = req.body;

    const account = storage.getAccount(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.availableBalance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const now = new Date().toISOString().split("T")[0];

    // Create bill payment record
    const payment = storage.createBillPayment({
      accountId,
      payee,
      category,
      amount,
      date: now,
      status: "completed",
    });

    // Deduct from account
    storage.updateAccountBalance(
      accountId,
      account.balance - amount,
      account.availableBalance - amount
    );

    // Create transaction record
    storage.createTransaction({
      accountId,
      date: now,
      description: `Bill Pay - ${payee}`,
      category: "Bill Payment",
      amount: -amount,
      balance: account.balance - amount,
      type: "debit",
      status: "posted",
    });

    res.json(payment);
  });

  app.get("/api/bill-payments", (_req, res) => {
    const payments = storage.getBillPayments();
    res.json(payments);
  });

  // --- Notifications (demo) ---
  app.get("/api/notifications", (_req, res) => {
    res.json([
      { id: 1, title: "Large Deposit Received", message: "Wire transfer of $2,500,000.00 posted to Premier Checking", time: "2 hours ago", read: false, type: "info" },
      { id: 2, title: "Bill Due Soon", message: "Chase Mortgage payment of $4,250.00 due Apr 1", time: "5 hours ago", read: false, type: "warning" },
      { id: 3, title: "Security Alert", message: "New device login detected from Dallas, TX", time: "1 day ago", read: true, type: "security" },
      { id: 4, title: "Statement Ready", message: "Your February 2026 statement is available", time: "2 days ago", read: true, type: "info" },
      { id: 5, title: "Interest Credited", message: "Q1 2026 interest of $42,156.89 credited to Savings", time: "3 days ago", read: true, type: "success" },
    ]);
  });
}
