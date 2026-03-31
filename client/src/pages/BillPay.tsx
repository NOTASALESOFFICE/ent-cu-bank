import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Calendar,
  Building2,
  Zap,
  Wifi,
  Home,
  Car,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Bill {
  id: number;
  payee: string;
  category: string;
  amount: number;
  dueDate: string;
  status: "due" | "scheduled" | "paid";
  icon: typeof Zap;
}

const initialBills: Bill[] = [
  { id: 1, payee: "Texas Electric Co.", category: "Utilities", amount: 284.50, dueDate: "Apr 5, 2026", status: "due", icon: Zap },
  { id: 2, payee: "AT&T Wireless", category: "Telecom", amount: 189.99, dueDate: "Apr 8, 2026", status: "due", icon: Wifi },
  { id: 3, payee: "Chase Mortgage", category: "Housing", amount: 4250.00, dueDate: "Apr 1, 2026", status: "scheduled", icon: Home },
  { id: 4, payee: "BMW Financial", category: "Auto", amount: 1875.00, dueDate: "Apr 10, 2026", status: "due", icon: Car },
  { id: 5, payee: "Dallas Water Utilities", category: "Utilities", amount: 78.32, dueDate: "Apr 12, 2026", status: "due", icon: Building2 },
];

export default function BillPay() {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [payingBill, setPayingBill] = useState<Bill | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);
  const [paidTotal, setPaidTotal] = useState(12340.00);

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/accounts");
      return res.json();
    },
  });

  const payMutation = useMutation({
    mutationFn: async ({ accountId, bill }: { accountId: number; bill: Bill }) => {
      const res = await apiRequest("POST", "/api/bill-pay", {
        accountId,
        payee: bill.payee,
        category: bill.category,
        amount: bill.amount,
      });
      return res.json();
    },
    onSuccess: (_, { bill }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      // Mark bill as paid
      setBills((prev) =>
        prev.map((b) => (b.id === bill.id ? { ...b, status: "paid" as const } : b))
      );
      setPaidTotal((prev) => prev + bill.amount);
      setPaySuccess(true);
    },
    onError: () => {
      toast({
        title: "Payment failed",
        description: "Could not process this payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePayClick = (bill: Bill) => {
    setPayingBill(bill);
    setSelectedAccountId("");
    setPaySuccess(false);
  };

  const handleConfirmPay = () => {
    if (!payingBill || !selectedAccountId) return;
    payMutation.mutate({
      accountId: parseInt(selectedAccountId),
      bill: payingBill,
    });
  };

  const handleCloseDialog = () => {
    setPayingBill(null);
    setPaySuccess(false);
    setSelectedAccountId("");
  };

  const dueBills = bills.filter((b) => b.status === "due");
  const scheduledBills = bills.filter((b) => b.status === "scheduled");
  const dueTotal = dueBills.reduce((s, b) => s + b.amount, 0);
  const scheduledTotal = scheduledBills.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="bill-pay-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Bill Pay</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and pay your bills</p>
        </div>
        <Button size="sm" data-testid="button-add-payee">
          <Plus size={14} className="mr-1" />
          Add Payee
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Due This Month</p>
            <p className="text-xl font-bold tabular-nums" data-testid="text-due-total">
              {formatCurrency(dueTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Scheduled</p>
            <p className="text-xl font-bold tabular-nums" data-testid="text-scheduled-total">
              {formatCurrency(scheduledTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Paid This Month</p>
            <p className="text-xl font-bold tabular-nums text-primary" data-testid="text-paid-total">
              {formatCurrency(paidTotal)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bills list */}
      <Card>
        <CardContent className="p-0 divide-y">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={`flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors ${
                bill.status === "paid" ? "opacity-60" : ""
              }`}
              data-testid={`row-bill-${bill.id}`}
            >
              <div className="p-2 rounded-lg bg-muted shrink-0">
                <bill.icon size={18} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{bill.payee}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{bill.category}</span>
                  <span className="text-xs text-muted-foreground">&middot;</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={10} />
                    {bill.dueDate}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold tabular-nums">
                  {formatCurrency(bill.amount)}
                </p>
                <Badge
                  variant={
                    bill.status === "paid"
                      ? "secondary"
                      : bill.status === "scheduled"
                      ? "secondary"
                      : "outline"
                  }
                  className={`text-[10px] mt-1 ${
                    bill.status === "paid"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : bill.status === "scheduled"
                      ? ""
                      : "border-amber-300 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {bill.status === "paid" ? "Paid" : bill.status === "scheduled" ? "Scheduled" : "Due"}
                </Badge>
              </div>
              <Button
                size="sm"
                variant={bill.status === "paid" ? "ghost" : "outline"}
                className="shrink-0 hidden sm:flex"
                disabled={bill.status === "paid"}
                onClick={() => handlePayClick(bill)}
                data-testid={`button-pay-${bill.id}`}
              >
                {bill.status === "paid" ? (
                  <CheckCircle2 size={14} className="text-green-600" />
                ) : (
                  "Pay"
                )}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pay Bill Dialog */}
      <Dialog open={!!payingBill} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-pay-bill">
          {paySuccess ? (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-pay-success">Payment Successful</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {formatCurrency(payingBill?.amount ?? 0)} paid to{" "}
                <span className="font-medium text-foreground">{payingBill?.payee}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                This transaction will appear in your account history.
              </p>
              <Button onClick={handleCloseDialog} data-testid="button-done">Done</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Pay Bill</DialogTitle>
                <DialogDescription>
                  Confirm payment to {payingBill?.payee}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Payment summary */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payee</span>
                    <span className="font-medium">{payingBill?.payee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold tabular-nums text-lg">
                      {formatCurrency(payingBill?.amount ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Due Date</span>
                    <span>{payingBill?.dueDate}</span>
                  </div>
                </div>

                {/* Account selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Pay From</Label>
                  <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                    <SelectTrigger data-testid="select-pay-account">
                      <SelectValue placeholder="Select an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts?.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          <div className="flex items-center justify-between gap-4 w-full">
                            <span>{a.accountName} ({a.accountNumber})</span>
                            <span className="text-muted-foreground tabular-nums text-xs">
                              {formatCurrency(a.balance)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAccountId && accounts && (
                    <p className="text-xs text-muted-foreground">
                      Available:{" "}
                      {formatCurrency(
                        accounts.find((a) => a.id === parseInt(selectedAccountId))
                          ?.availableBalance ?? 0
                      )}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={handleCloseDialog} data-testid="button-cancel-pay">
                  Cancel
                </Button>
                <Button
                  disabled={!selectedAccountId || payMutation.isPending}
                  onClick={handleConfirmPay}
                  data-testid="button-confirm-pay"
                >
                  {payMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatCurrency(payingBill?.amount ?? 0)}`
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
