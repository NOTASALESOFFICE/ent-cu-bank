import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Landmark,
  PiggyBank,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { formatCurrency, accountTypeLabel } from "@/lib/format";
import type { Account } from "@shared/schema";
import { useState } from "react";

const accountIcons: Record<string, typeof Landmark> = {
  checking: Landmark,
  savings: PiggyBank,
  money_market: TrendingUp,
};

const accountColors: Record<string, string> = {
  checking: "bg-primary text-primary-foreground",
  savings: "bg-[hsl(215,55%,45%)] text-white",
  money_market: "bg-[hsl(280,50%,50%)] text-white",
};

export default function AccountOverview() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/accounts");
      return res.json();
    },
  });

  const totalBalance = accounts?.reduce((sum, a) => sum + a.balance, 0) ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl" data-testid="account-overview">
      {/* Total balance hero card */}
      <Card className="border-0 bg-gradient-to-br from-[hsl(215,35%,14%)] to-[hsl(215,30%,20%)] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(0,72%,30%)]/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[hsl(0,72%,30%)]/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        <CardContent className="p-6 lg:p-8 relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/60 font-medium mb-1">Total Balance</p>
              <div className="flex items-center gap-3">
                <h1
                  className="text-3xl lg:text-4xl font-bold tabular-nums tracking-tight"
                  data-testid="text-total-balance"
                >
                  {balanceVisible ? formatCurrency(totalBalance) : "••••••••"}
                </h1>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  data-testid="button-toggle-balance"
                >
                  {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <p className="text-sm text-white/50 mt-2">
                Across {accounts?.length} accounts
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
              <Wallet size={14} />
              <span className="text-xs font-medium">Zackary Lovrek</span>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-white/40 mb-0.5">Checking</p>
              <p className="text-sm font-semibold tabular-nums">
                {balanceVisible
                  ? formatCurrency(accounts?.find((a) => a.accountType === "checking")?.balance ?? 0)
                  : "••••••"}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Savings</p>
              <p className="text-sm font-semibold tabular-nums">
                {balanceVisible
                  ? formatCurrency(accounts?.find((a) => a.accountType === "savings")?.balance ?? 0)
                  : "••••••"}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Money Market</p>
              <p className="text-sm font-semibold tabular-nums">
                {balanceVisible
                  ? formatCurrency(accounts?.find((a) => a.accountType === "money_market")?.balance ?? 0)
                  : "••••••"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts?.map((account) => {
            const Icon = accountIcons[account.accountType] || Landmark;
            const colorClass = accountColors[account.accountType] || accountColors.checking;

            return (
              <Link key={account.id} href={`/accounts/${account.id}`}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                  data-testid={`card-account-${account.id}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-lg ${colorClass}`}>
                        <Icon size={18} />
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {account.accountName}
                      </p>
                      <p className="text-sm text-muted-foreground/60 mb-2">
                        {account.accountNumber}
                      </p>
                      <p
                        className="text-xl font-bold tabular-nums"
                        data-testid={`text-balance-${account.id}`}
                      >
                        {balanceVisible ? formatCurrency(account.balance) : "••••••"}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-xs text-muted-foreground">Available</span>
                        <span className="text-xs font-medium tabular-nums">
                          {balanceVisible
                            ? formatCurrency(account.availableBalance)
                            : "••••••"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Transfer", icon: ArrowUpRight, href: "/transfer", color: "text-primary" },
            { label: "Pay Bills", icon: ArrowDownRight, href: "/bill-pay", color: "text-[hsl(215,55%,45%)]" },
            { label: "Statements", icon: Landmark, href: "/", color: "text-[hsl(280,50%,50%)]" },
            { label: "Cards", icon: Wallet, href: "/", color: "text-[hsl(45,80%,50%)]" },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="cursor-pointer hover:shadow-sm transition-all group" data-testid={`card-action-${action.label.toLowerCase()}`}>
                <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                  <div className={`p-2 rounded-lg bg-muted ${action.color}`}>
                    <action.icon size={18} />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
