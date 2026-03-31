import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Download,
  Filter,
  Copy,
  Check,
} from "lucide-react";
import { formatCurrency, formatDate, accountTypeLabel } from "@/lib/format";
import type { Account, Transaction } from "@shared/schema";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AccountDetail() {
  const [, params] = useRoute("/accounts/:id");
  const accountId = parseInt(params?.id ?? "0");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: account, isLoading: accountLoading } = useQuery<Account>({
    queryKey: ["/api/accounts", accountId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/accounts/${accountId}`);
      return res.json();
    },
  });

  const { data: transactions, isLoading: txnLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/accounts", accountId, "transactions"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/accounts/${accountId}/transactions`);
      return res.json();
    },
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      toast({ title: "Copied to clipboard" });
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(() => {
      toast({ title: "Copy failed", variant: "destructive" });
    });
  };

  const filteredTxns = transactions
    ?.filter((t) => {
      if (filterType === "credit" && t.amount < 0) return false;
      if (filterType === "debit" && t.amount > 0) return false;
      if (searchQuery) {
        return t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               t.category.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      // pending first, then by date desc
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (accountLoading) {
    return (
      <div className="space-y-4 max-w-5xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Account not found</p>
        <Link href="/">
          <Button variant="link" className="mt-2">Go back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl" data-testid="account-detail">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon" className="shrink-0" data-testid="button-back">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold" data-testid="text-account-name">
            {account.accountName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {accountTypeLabel(account.accountType)} {account.accountNumber}
          </p>
        </div>
      </div>

      {/* Balance card */}
      <Card className="border-0 bg-gradient-to-br from-[hsl(215,35%,14%)] to-[hsl(215,30%,20%)] text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-white/50 mb-1">Current Balance</p>
              <p className="text-2xl font-bold tabular-nums" data-testid="text-current-balance">
                {formatCurrency(account.balance)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">Available Balance</p>
              <p className="text-2xl font-bold tabular-nums" data-testid="text-available-balance">
                {formatCurrency(account.availableBalance)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Account</span>
                <button
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                  onClick={() => copyToClipboard(account.accountNumber, "account")}
                  data-testid="button-copy-account"
                >
                  {account.accountNumber}
                  {copiedField === "account" ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Routing</span>
                <button
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
                  onClick={() => copyToClipboard(account.routingNumber, "routing")}
                  data-testid="button-copy-routing"
                >
                  {account.routingNumber}
                  {copiedField === "routing" ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction list */}
      <Card>
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b">
            <h2 className="text-sm font-semibold shrink-0">Transactions</h2>
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-sm"
                  data-testid="input-search-transactions"
                />
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
                {(["all", "credit", "debit"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      filterType === type
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`button-filter-${type}`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions table */}
          <div className="overflow-x-auto">
            {txnLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredTxns && filteredTxns.length > 0 ? (
              <table className="w-full text-sm" data-testid="table-transactions">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left font-medium text-xs text-muted-foreground px-4 py-2.5">Date</th>
                    <th className="text-left font-medium text-xs text-muted-foreground px-4 py-2.5">Description</th>
                    <th className="text-left font-medium text-xs text-muted-foreground px-4 py-2.5 hidden sm:table-cell">Category</th>
                    <th className="text-left font-medium text-xs text-muted-foreground px-4 py-2.5 hidden md:table-cell">Status</th>
                    <th className="text-right font-medium text-xs text-muted-foreground px-4 py-2.5">Amount</th>
                    <th className="text-right font-medium text-xs text-muted-foreground px-4 py-2.5 hidden lg:table-cell">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxns.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                      data-testid={`row-transaction-${txn.id}`}
                    >
                      <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`shrink-0 p-1 rounded ${
                              txn.amount >= 0
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {txn.amount >= 0 ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          </div>
                          <span className="font-medium truncate max-w-[240px]">{txn.description}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="secondary" className="text-xs font-normal">
                          {txn.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge
                          variant={txn.status === "pending" ? "outline" : "secondary"}
                          className={`text-xs ${txn.status === "pending" ? "border-amber-300 text-amber-600 dark:text-amber-400" : ""}`}
                        >
                          {txn.status === "pending" ? "Pending" : "Posted"}
                        </Badge>
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold tabular-nums whitespace-nowrap ${
                          txn.amount >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-foreground"
                        }`}
                      >
                        {txn.amount >= 0 ? "+" : ""}
                        {formatCurrency(Math.abs(txn.amount))}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground tabular-nums whitespace-nowrap hidden lg:table-cell">
                        {formatCurrency(txn.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
