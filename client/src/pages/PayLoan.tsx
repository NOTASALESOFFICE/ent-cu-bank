import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Info, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@shared/schema";
import { useState } from "react";

interface Loan {
  id: string;
  name: string;
  balance: number;
  monthlyPayment: number;
  rate: string;
  nextDue: string;
  accountNumber: string;
}

const loans: Loan[] = [
  { id: "1", name: "Auto Loan", balance: 28450.00, monthlyPayment: 485.00, rate: "4.25%", nextDue: "Apr 15, 2026", accountNumber: "****6781" },
  { id: "2", name: "Personal Loan", balance: 12800.00, monthlyPayment: 325.00, rate: "6.99%", nextDue: "Apr 10, 2026", accountNumber: "****3392" },
];

export default function PayLoan() {
  const [selectedLoan, setSelectedLoan] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/accounts");
      return res.json();
    },
  });

  const loan = loans.find((l) => l.id === selectedLoan);

  const handlePay = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedLoan("");
      setSelectedAccount("");
      setAmount("");
    }, 3000);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto" data-testid="pay-loan-success">
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-lg font-semibold mb-2">Loan Payment Submitted</h2>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(parseFloat(amount))} payment to {loan?.name} has been processed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-testid="pay-loan-page">
      <div>
        <h1 className="text-lg font-semibold">Pay a Loan</h1>
        <p className="text-sm text-muted-foreground mt-1">Make a payment toward your ENT CU loans</p>
      </div>

      {/* Loan cards */}
      <div className="grid gap-4">
        {loans.map((l) => (
          <Card key={l.id} className={`cursor-pointer transition-all ${selectedLoan === l.id ? "ring-2 ring-primary" : "hover:bg-muted/30"}`} onClick={() => { setSelectedLoan(l.id); setAmount(String(l.monthlyPayment)); }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-primary" />
                    <span className="text-sm font-semibold">{l.name}</span>
                    <span className="text-xs text-muted-foreground">{l.accountNumber}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(l.balance)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly</p>
                      <p className="text-sm font-medium tabular-nums">{formatCurrency(l.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="text-sm font-medium">{l.rate}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    <Calendar size={10} className="mr-1" />
                    Due {l.nextDue}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment form */}
      {selectedLoan && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <Info size={14} />
              <span>Paying <span className="font-medium text-foreground">{loan?.name}</span> — minimum payment: {formatCurrency(loan?.monthlyPayment ?? 0)}</span>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Pay From</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger data-testid="select-pay-from">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.accountName} ({a.accountNumber}) — {formatCurrency(a.balance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 tabular-nums"
                  data-testid="input-loan-amount"
                />
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!selectedAccount || !amount || parseFloat(amount) <= 0}
              onClick={handlePay}
              data-testid="button-pay-loan"
            >
              Pay {amount ? formatCurrency(parseFloat(amount)) : ""}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
