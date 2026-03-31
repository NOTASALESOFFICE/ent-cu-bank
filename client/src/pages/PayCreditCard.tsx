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
import { CreditCard, Calendar, CheckCircle2, Info } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@shared/schema";
import { useState } from "react";

interface CreditCardAccount {
  id: string;
  name: string;
  balance: number;
  limit: number;
  minPayment: number;
  rate: string;
  nextDue: string;
  lastFour: string;
}

const creditCards: CreditCardAccount[] = [
  { id: "1", name: "ENT Visa Platinum", balance: 4287.32, limit: 25000, minPayment: 85.75, rate: "12.99%", nextDue: "Apr 18, 2026", lastFour: "4521" },
  { id: "2", name: "ENT Cash Rewards", balance: 1520.00, limit: 15000, minPayment: 30.40, rate: "15.49%", nextDue: "Apr 22, 2026", lastFour: "8834" },
];

export default function PayCreditCard() {
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [paymentType, setPaymentType] = useState("minimum");
  const [customAmount, setCustomAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/accounts");
      return res.json();
    },
  });

  const card = creditCards.find((c) => c.id === selectedCard);
  const payAmount = paymentType === "minimum" ? card?.minPayment ?? 0 : paymentType === "full" ? card?.balance ?? 0 : parseFloat(customAmount) || 0;

  const handlePay = () => {
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setSelectedCard(""); setSelectedAccount(""); setPaymentType("minimum"); setCustomAmount(""); }, 3000);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto" data-testid="pay-cc-success">
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-lg font-semibold mb-2">Payment Submitted</h2>
            <p className="text-sm text-muted-foreground">{formatCurrency(payAmount)} paid to {card?.name}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-testid="pay-credit-card-page">
      <div>
        <h1 className="text-lg font-semibold">Pay a Credit Card</h1>
        <p className="text-sm text-muted-foreground mt-1">Make a payment on your ENT CU credit cards</p>
      </div>

      <div className="grid gap-4">
        {creditCards.map((c) => (
          <Card key={c.id} className={`cursor-pointer transition-all ${selectedCard === c.id ? "ring-2 ring-primary" : "hover:bg-muted/30"}`} onClick={() => setSelectedCard(c.id)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-primary" />
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className="text-xs text-muted-foreground">****{c.lastFour}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(c.balance)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p className="text-sm font-medium tabular-nums">{formatCurrency(c.limit - c.balance)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Minimum</p>
                      <p className="text-sm font-medium tabular-nums">{formatCurrency(c.minPayment)}</p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Calendar size={10} className="mr-1" />
                  Due {c.nextDue}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCard && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pay From</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger data-testid="select-cc-pay-from">
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
              <Label className="text-sm font-medium">Payment Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "minimum", label: "Minimum", amt: card?.minPayment },
                  { value: "full", label: "Full Balance", amt: card?.balance },
                  { value: "custom", label: "Custom", amt: null },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPaymentType(opt.value)}
                    className={`p-3 rounded-lg border text-center transition-colors ${paymentType === opt.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
                    data-testid={`btn-${opt.value}`}
                  >
                    <p className="text-xs text-muted-foreground">{opt.label}</p>
                    {opt.amt != null && <p className="text-sm font-semibold tabular-nums mt-0.5">{formatCurrency(opt.amt)}</p>}
                  </button>
                ))}
              </div>
            </div>

            {paymentType === "custom" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input type="number" step="0.01" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} className="pl-7 tabular-nums" data-testid="input-cc-custom" />
                </div>
              </div>
            )}

            <Button className="w-full" disabled={!selectedAccount || payAmount <= 0} onClick={handlePay} data-testid="button-pay-cc">
              Pay {formatCurrency(payAmount)}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
