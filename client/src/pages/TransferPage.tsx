import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft, CheckCircle2, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TransferPage() {
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/accounts");
      return res.json();
    },
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/transfers", {
        fromAccountId: parseInt(fromId),
        toAccountId: parseInt(toId),
        amount: parseFloat(amount),
        memo: memo || undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFromId("");
        setToId("");
        setAmount("");
        setMemo("");
      }, 3000);
    },
    onError: (err: any) => {
      toast({
        title: "Transfer failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const fromAccount = accounts?.find((a) => a.id === parseInt(fromId));
  const canSubmit = fromId && toId && fromId !== toId && parseFloat(amount) > 0;

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto" data-testid="transfer-success">
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-lg font-semibold mb-2">Transfer Complete</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {formatCurrency(parseFloat(amount))} has been transferred successfully.
            </p>
            <p className="text-xs text-muted-foreground">
              The transaction will appear in your account history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6" data-testid="transfer-page">
      <div>
        <h1 className="text-lg font-semibold">Transfer Funds</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Move money between your ENT CU accounts
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          {/* From account */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">From Account</Label>
            <Select value={fromId} onValueChange={setFromId}>
              <SelectTrigger data-testid="select-from-account">
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)} disabled={String(a.id) === toId}>
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
            {fromAccount && (
              <p className="text-xs text-muted-foreground">
                Available: {formatCurrency(fromAccount.availableBalance)}
              </p>
            )}
          </div>

          {/* Swap icon */}
          <div className="flex justify-center">
            <div className="p-2 rounded-full bg-muted text-muted-foreground">
              <ArrowRightLeft size={16} />
            </div>
          </div>

          {/* To account */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">To Account</Label>
            <Select value={toId} onValueChange={setToId}>
              <SelectTrigger data-testid="select-to-account">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)} disabled={String(a.id) === fromId}>
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
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 tabular-nums"
                data-testid="input-amount"
              />
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Memo <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              placeholder="What is this transfer for?"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              data-testid="input-memo"
            />
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            disabled={!canSubmit || transferMutation.isPending}
            onClick={() => transferMutation.mutate()}
            data-testid="button-submit-transfer"
          >
            {transferMutation.isPending ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
