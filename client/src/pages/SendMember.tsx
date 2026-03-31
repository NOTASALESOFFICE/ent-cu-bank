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
import { Send, CheckCircle2, Users, Search } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Account } from "@shared/schema";
import { useState } from "react";

interface SavedRecipient {
  id: string;
  name: string;
  memberId: string;
  lastSent: string;
}

const savedRecipients: SavedRecipient[] = [
  { id: "1", name: "Sarah Lovrek", memberId: "ENT-00391844", lastSent: "Mar 15, 2026" },
  { id: "2", name: "Michael Torres", memberId: "ENT-00127653", lastSent: "Feb 28, 2026" },
  { id: "3", name: "Jessica Chen", memberId: "ENT-00445512", lastSent: "Jan 20, 2026" },
];

export default function SendMember() {
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ["/api/accounts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/accounts");
      return res.json();
    },
  });

  const recipient = savedRecipients.find((r) => r.id === selectedRecipient);

  const handleSend = () => {
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setSelectedRecipient(""); setSelectedAccount(""); setAmount(""); setMemo(""); }, 3000);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto" data-testid="send-member-success">
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-lg font-semibold mb-2">Money Sent</h2>
            <p className="text-sm text-muted-foreground">{formatCurrency(parseFloat(amount))} sent to {recipient?.name}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-testid="send-member-page">
      <div>
        <h1 className="text-lg font-semibold">Send Money to a Member</h1>
        <p className="text-sm text-muted-foreground mt-1">Transfer funds to another ENT CU member</p>
      </div>

      {/* Saved recipients */}
      <div>
        <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Users size={14} /> Saved Recipients
        </h2>
        <div className="grid gap-2">
          {savedRecipients.map((r) => (
            <Card key={r.id} className={`cursor-pointer transition-all ${selectedRecipient === r.id ? "ring-2 ring-primary" : "hover:bg-muted/30"}`} onClick={() => setSelectedRecipient(r.id)}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                    {r.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.memberId}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Last sent {r.lastSent}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Or search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or search by member ID</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Enter member ID (ENT-XXXXXXXX)" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="pl-9" data-testid="input-member-search" />
      </div>

      {/* Payment form */}
      {selectedRecipient && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              Sending to <span className="font-medium text-foreground">{recipient?.name}</span> ({recipient?.memberId})
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">From Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger data-testid="select-send-from">
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
              <Label className="text-sm font-medium">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7 tabular-nums" data-testid="input-send-amount" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Memo <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input placeholder="What is this for?" value={memo} onChange={(e) => setMemo(e.target.value)} data-testid="input-send-memo" />
            </div>

            <Button className="w-full" disabled={!selectedAccount || !amount || parseFloat(amount) <= 0} onClick={handleSend} data-testid="button-send-member">
              <Send size={14} className="mr-2" />
              Send {amount ? formatCurrency(parseFloat(amount)) : "Money"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
