import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useState } from "react";

interface ActivityItem {
  id: number;
  type: "transfer" | "bill_pay" | "member_send" | "loan_pay" | "cc_pay";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  fromAccount: string;
  toAccount: string;
}

const activities: ActivityItem[] = [
  { id: 1, type: "transfer", description: "Transfer to High-Yield Savings", amount: 5000.00, date: "Mar 30, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "High-Yield Savings" },
  { id: 2, type: "bill_pay", description: "Texas Electric Co.", amount: 284.50, date: "Mar 30, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "Texas Electric Co." },
  { id: 3, type: "member_send", description: "Sent to Sarah Lovrek", amount: 500.00, date: "Mar 28, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "Sarah Lovrek" },
  { id: 4, type: "bill_pay", description: "AT&T Wireless", amount: 189.99, date: "Mar 25, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "AT&T" },
  { id: 5, type: "loan_pay", description: "Auto Loan Payment", amount: 485.00, date: "Mar 22, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "Auto Loan" },
  { id: 6, type: "cc_pay", description: "ENT Visa Platinum Payment", amount: 1500.00, date: "Mar 20, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "Visa Platinum" },
  { id: 7, type: "transfer", description: "Transfer to Money Market", amount: 10000.00, date: "Mar 18, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "Money Market" },
  { id: 8, type: "bill_pay", description: "Chase Mortgage", amount: 4250.00, date: "Mar 15, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "Chase Mortgage" },
  { id: 9, type: "member_send", description: "Sent to Michael Torres", amount: 250.00, date: "Mar 12, 2026", status: "completed", fromAccount: "High-Yield Savings", toAccount: "Michael Torres" },
  { id: 10, type: "bill_pay", description: "Dallas Water Utilities", amount: 78.32, date: "Mar 10, 2026", status: "completed", fromAccount: "Premier Checking", toAccount: "Dallas Water" },
];

const typeLabels: Record<string, string> = {
  transfer: "Transfer",
  bill_pay: "Bill Payment",
  member_send: "Member Transfer",
  loan_pay: "Loan Payment",
  cc_pay: "Credit Card",
};

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  completed: { icon: CheckCircle, color: "text-green-600", label: "Completed" },
  pending: { icon: Clock, color: "text-amber-500", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-500", label: "Failed" },
};

export default function Activity() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = activities.filter((a) => {
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (search && !a.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalAmount = filtered.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="activity-page">
      <div>
        <h1 className="text-lg font-semibold">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">View your recent money movement activity</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" data-testid="input-activity-search" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-activity-type">
            <Filter size={14} className="mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="transfer">Transfers</SelectItem>
            <SelectItem value="bill_pay">Bill Payments</SelectItem>
            <SelectItem value="member_send">Member Transfers</SelectItem>
            <SelectItem value="loan_pay">Loan Payments</SelectItem>
            <SelectItem value="cc_pay">Credit Card Payments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{filtered.length} transactions</span>
        <span className="font-medium tabular-nums">Total: {formatCurrency(totalAmount)}</span>
      </div>

      {/* Activity list */}
      <Card>
        <CardContent className="p-0 divide-y">
          {filtered.map((item) => {
            const status = statusConfig[item.status];
            const StatusIcon = status.icon;
            return (
              <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors" data-testid={`activity-${item.id}`}>
                <div className={`p-2 rounded-lg bg-muted shrink-0`}>
                  <ArrowUpRight size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-[10px]">{typeLabels[item.type]}</Badge>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.fromAccount} → {item.toAccount}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">-{formatCurrency(item.amount)}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <StatusIcon size={12} className={status.color} />
                    <span className={`text-xs ${status.color}`}>{status.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No activity found matching your filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
