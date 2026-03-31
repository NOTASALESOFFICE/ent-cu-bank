import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Target,
  BarChart3,
  LineChart,
  DollarSign,
  CreditCard,
  Home,
  Car,
  Plus,
  RefreshCw,
  Filter,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useState } from "react";

const insightsTabs = [
  "Accounts", "Transactions", "Spending", "Budgets", "Trends",
  "Debts", "Net Worth", "Goals", "Investments", "Cash Flow",
];

// Mock data for each section
const accountsSummary = [
  { name: "Checking", balance: 35235067.82, icon: Wallet, change: +2.3 },
  { name: "Savings", balance: 8742156.89, icon: PiggyBank, change: +1.1 },
  { name: "Money Market", balance: 2150000.00, icon: DollarSign, change: +0.8 },
];

const recentTransactions = [
  { id: 1, desc: "Whole Foods Market", amount: -342.18, date: "Mar 30", category: "Groceries" },
  { id: 2, desc: "Direct Deposit - Employer", amount: 12500.00, date: "Mar 28", category: "Income" },
  { id: 3, desc: "Tesla Supercharger", amount: -45.20, date: "Mar 27", category: "Auto" },
  { id: 4, desc: "Amazon.com", amount: -189.99, date: "Mar 26", category: "Shopping" },
  { id: 5, desc: "Transfer from Savings", amount: 5000.00, date: "Mar 25", category: "Transfer" },
  { id: 6, desc: "Starbucks", amount: -8.45, date: "Mar 25", category: "Dining" },
  { id: 7, desc: "Netflix", amount: -22.99, date: "Mar 24", category: "Entertainment" },
  { id: 8, desc: "Shell Gas Station", amount: -62.30, date: "Mar 23", category: "Auto" },
];

const spendingCategories = [
  { name: "Housing", amount: 4250, percent: 34, color: "bg-blue-500" },
  { name: "Auto & Transport", amount: 2360, percent: 19, color: "bg-green-500" },
  { name: "Food & Dining", amount: 1850, percent: 15, color: "bg-amber-500" },
  { name: "Shopping", amount: 1420, percent: 11, color: "bg-purple-500" },
  { name: "Bills & Utilities", amount: 890, percent: 7, color: "bg-red-500" },
  { name: "Entertainment", amount: 520, percent: 4, color: "bg-pink-500" },
  { name: "Other", amount: 1210, percent: 10, color: "bg-gray-400" },
];

const budgets = [
  { name: "Groceries", spent: 842, budget: 1200, icon: "🛒" },
  { name: "Dining Out", spent: 380, budget: 500, icon: "🍽️" },
  { name: "Entertainment", spent: 220, budget: 300, icon: "🎬" },
  { name: "Shopping", spent: 1420, budget: 1000, icon: "🛍️" },
  { name: "Auto & Gas", spent: 485, budget: 600, icon: "⛽" },
  { name: "Subscriptions", spent: 145, budget: 200, icon: "📱" },
];

const debts = [
  { name: "Chase Mortgage", balance: 485000, rate: "3.25%", monthly: 4250, type: "Mortgage", icon: Home },
  { name: "Auto Loan", balance: 28450, rate: "4.25%", monthly: 485, type: "Auto", icon: Car },
  { name: "Visa Platinum", balance: 4287, rate: "12.99%", monthly: 86, type: "Credit Card", icon: CreditCard },
  { name: "Cash Rewards", balance: 1520, rate: "15.49%", monthly: 30, type: "Credit Card", icon: CreditCard },
  { name: "Personal Loan", balance: 12800, rate: "6.99%", monthly: 325, type: "Personal", icon: DollarSign },
];

const goals = [
  { name: "Emergency Fund", current: 8742156.89, target: 10000000, icon: "🛡️" },
  { name: "Vacation Home", current: 2150000, target: 5000000, icon: "🏠" },
  { name: "Kids' College", current: 850000, target: 2000000, icon: "🎓" },
  { name: "New Car", current: 45000, target: 85000, icon: "🚗" },
];

const investments = [
  { name: "ENT Investment Account", value: 1245000, change: +4.2, type: "Brokerage" },
  { name: "Roth IRA", value: 385000, change: +6.8, type: "Retirement" },
  { name: "Traditional 401(k)", value: 892000, change: +3.1, type: "Retirement" },
];

export default function MoneyInsights() {
  const [activeTab, setActiveTab] = useState("Accounts");
  const totalAssets = accountsSummary.reduce((s, a) => s + a.balance, 0) + investments.reduce((s, i) => s + i.value, 0);
  const totalDebts = debts.reduce((s, d) => s + d.balance, 0);
  const netWorth = totalAssets - totalDebts;

  return (
    <div className="space-y-6" data-testid="money-insights-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Money Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-1" /> Sync</Button>
          <Button variant="outline" size="sm"><Filter size={14} className="mr-1" /> Filter accounts</Button>
          <Button size="sm"><Plus size={14} className="mr-1" /> Add an Account</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {insightsTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-xs px-3 py-1.5" data-testid={`tab-${tab.toLowerCase().replace(/ /g, "-")}`}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ACCOUNTS */}
        <TabsContent value="Accounts" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accountsSummary.map((acc) => (
              <Card key={acc.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <acc.icon size={16} className="text-primary" />
                      <span className="text-sm font-medium">{acc.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] text-green-600">
                      <ArrowUpRight size={10} className="mr-0.5" />+{acc.change}%
                    </Badge>
                  </div>
                  <p className="text-xl font-bold tabular-nums">{formatCurrency(acc.balance)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Add a Cash Account", "Add an Investment Account", "Add a Property", "Add a Credit Card", "Add a Mortgage", "Add a Loan", "Add a Line of Credit"].map((label) => (
              <Button key={label} variant="outline" size="sm" className="text-xs justify-start h-auto py-2">
                <Plus size={12} className="mr-1 shrink-0" /> {label}
              </Button>
            ))}
          </div>
        </TabsContent>

        {/* TRANSACTIONS */}
        <TabsContent value="Transactions" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0 divide-y">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-muted/20" data-testid={`insight-txn-${t.id}`}>
                  <div>
                    <p className="text-sm font-medium">{t.desc}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px]">{t.category}</Badge>
                      <span className="text-xs text-muted-foreground">{t.date}</span>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${t.amount >= 0 ? "text-green-600" : ""}`}>
                    {t.amount >= 0 ? "+" : ""}{formatCurrency(Math.abs(t.amount))}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SPENDING */}
        <TabsContent value="Spending" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-1">March 2026 Spending</h3>
              <p className="text-2xl font-bold tabular-nums mb-4">{formatCurrency(12500)}</p>
              <div className="space-y-3">
                {spendingCategories.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{cat.name}</span>
                      <span className="font-medium tabular-nums">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BUDGETS */}
        <TabsContent value="Budgets" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((b) => {
              const pct = Math.min(100, Math.round((b.spent / b.budget) * 100));
              const over = b.spent > b.budget;
              return (
                <Card key={b.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{b.icon} {b.name}</span>
                      <Badge variant={over ? "destructive" : "secondary"} className="text-[10px]">
                        {over ? "Over Budget" : `${pct}%`}
                      </Badge>
                    </div>
                    <Progress value={pct} className={`h-2 ${over ? "[&>div]:bg-destructive" : ""}`} />
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span className="tabular-nums">{formatCurrency(b.spent)} spent</span>
                      <span className="tabular-nums">{formatCurrency(b.budget)} budget</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TRENDS */}
        <TabsContent value="Trends" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Avg Monthly Income</p>
                <p className="text-xl font-bold tabular-nums text-green-600">{formatCurrency(25000)}</p>
                <div className="flex items-center gap-1 mt-1"><ArrowUpRight size={12} className="text-green-600" /><span className="text-xs text-green-600">+8.2% vs last year</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Avg Monthly Expenses</p>
                <p className="text-xl font-bold tabular-nums">{formatCurrency(12500)}</p>
                <div className="flex items-center gap-1 mt-1"><ArrowDownRight size={12} className="text-red-500" /><span className="text-xs text-red-500">+3.1% vs last year</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Avg Monthly Savings</p>
                <p className="text-xl font-bold tabular-nums text-primary">{formatCurrency(12500)}</p>
                <div className="flex items-center gap-1 mt-1"><ArrowUpRight size={12} className="text-green-600" /><span className="text-xs text-green-600">+15.4% vs last year</span></div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-4">6-Month Spending Trend</h3>
              <div className="flex items-end gap-3 h-32">
                {[8200, 11500, 9800, 13200, 10400, 12500].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/20 rounded-t" style={{ height: `${(val / 14000) * 100}%` }}>
                      <div className="w-full h-full bg-primary/60 rounded-t" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEBTS */}
        <TabsContent value="Debts" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Debt</p>
                <p className="text-xl font-bold tabular-nums">{formatCurrency(totalDebts)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Monthly Payments</p>
                <p className="text-xl font-bold tabular-nums">{formatCurrency(debts.reduce((s, d) => s + d.monthly, 0))}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-0 divide-y">
              {debts.map((d) => (
                <div key={d.name} className="flex items-center gap-4 p-4 hover:bg-muted/20">
                  <div className="p-2 rounded-lg bg-muted"><d.icon size={16} className="text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{d.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px]">{d.type}</Badge>
                      <span className="text-xs text-muted-foreground">{d.rate} APR</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{formatCurrency(d.balance)}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{formatCurrency(d.monthly)}/mo</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NET WORTH */}
        <TabsContent value="Net Worth" className="space-y-4 mt-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Net Worth</p>
              <p className="text-3xl font-bold tabular-nums">{formatCurrency(netWorth)}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-sm text-green-600">+3.2% this month</span>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
                <p className="text-lg font-bold tabular-nums text-green-600">{formatCurrency(totalAssets)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Liabilities</p>
                <p className="text-lg font-bold tabular-nums text-red-500">{formatCurrency(totalDebts)}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* GOALS */}
        <TabsContent value="Goals" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              return (
                <Card key={g.name}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{g.icon} {g.name}</span>
                      <span className="text-xs font-semibold text-primary">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="tabular-nums">{formatCurrency(g.current)}</span>
                      <span className="tabular-nums">Goal: {formatCurrency(g.target)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Button variant="outline" className="w-full"><Plus size={14} className="mr-2" />Create New Goal</Button>
        </TabsContent>

        {/* INVESTMENTS */}
        <TabsContent value="Investments" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Investments</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(investments.reduce((s, i) => s + i.value, 0))}</p>
            </CardContent>
          </Card>
          <div className="space-y-3">
            {investments.map((inv) => (
              <Card key={inv.name}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{inv.name}</p>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">{inv.type}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{formatCurrency(inv.value)}</p>
                    <span className="text-xs text-green-600">+{inv.change}% YTD</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full"><Plus size={14} className="mr-2" />Add an Investment Account</Button>
        </TabsContent>

        {/* CASH FLOW */}
        <TabsContent value="Cash Flow" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Income (March)</p>
                <p className="text-xl font-bold tabular-nums text-green-600">{formatCurrency(25000)}</p>
                <div className="flex items-center gap-1 mt-1"><TrendingUp size={12} className="text-green-600" /><span className="text-xs text-green-600">Consistent</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Expenses (March)</p>
                <p className="text-xl font-bold tabular-nums">{formatCurrency(12500)}</p>
                <div className="flex items-center gap-1 mt-1"><TrendingDown size={12} className="text-amber-500" /><span className="text-xs text-amber-500">+5% vs Feb</span></div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-1">Net Cash Flow</h3>
              <p className="text-2xl font-bold tabular-nums text-primary">{formatCurrency(12500)}</p>
              <p className="text-xs text-muted-foreground mt-1">You saved 50% of your income this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-4">Monthly Cash Flow (6 months)</h3>
              <div className="space-y-2">
                {[
                  { month: "Oct", income: 25000, expense: 8200 },
                  { month: "Nov", income: 25000, expense: 11500 },
                  { month: "Dec", income: 27500, expense: 9800 },
                  { month: "Jan", income: 25000, expense: 13200 },
                  { month: "Feb", income: 25000, expense: 10400 },
                  { month: "Mar", income: 25000, expense: 12500 },
                ].map((m) => (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">{m.month}</span>
                    <div className="flex-1 flex gap-1 h-5">
                      <div className="bg-green-500/30 rounded" style={{ width: `${(m.income / 30000) * 100}%` }} />
                      <div className="bg-red-500/30 rounded" style={{ width: `${(m.expense / 30000) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium tabular-nums w-20 text-right text-primary">+{formatCurrency(m.income - m.expense)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-green-500/30" /> Income</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-red-500/30" /> Expenses</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
