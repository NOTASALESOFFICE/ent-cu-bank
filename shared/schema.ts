import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  accountName: text("account_name").notNull(),
  accountType: text("account_type").notNull(),
  accountNumber: text("account_number").notNull(),
  routingNumber: text("routing_number").notNull(),
  balance: real("balance").notNull(),
  availableBalance: real("available_balance").notNull(),
  ownerName: text("owner_name").notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  accountId: integer("account_id").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  amount: real("amount").notNull(),
  balance: real("balance").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
});

export const transfers = sqliteTable("transfers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromAccountId: integer("from_account_id").notNull(),
  toAccountId: integer("to_account_id").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  memo: text("memo"),
  status: text("status").notNull(),
});

export const billPayments = sqliteTable("bill_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  accountId: integer("account_id").notNull(),
  payee: text("payee").notNull(),
  category: text("category").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(), // completed, scheduled, failed
});

export const insertAccountSchema = createInsertSchema(accounts).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });
export const insertTransferSchema = createInsertSchema(transfers).omit({ id: true });
export const insertBillPaymentSchema = createInsertSchema(billPayments).omit({ id: true });

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type InsertBillPayment = z.infer<typeof insertBillPaymentSchema>;
export type Account = typeof accounts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Transfer = typeof transfers.$inferSelect;
export type BillPayment = typeof billPayments.$inferSelect;
