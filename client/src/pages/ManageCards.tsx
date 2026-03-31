import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Lock, Unlock, Eye, EyeOff, Settings, Smartphone, Globe } from "lucide-react";
import { useState } from "react";

interface CardInfo {
  id: string;
  name: string;
  lastFour: string;
  type: "debit" | "credit";
  network: "Visa" | "Mastercard";
  expiry: string;
  status: "active" | "frozen";
  digitalWallet: boolean;
  internationalEnabled: boolean;
}

const cards: CardInfo[] = [
  { id: "1", name: "Premier Checking Debit", lastFour: "7842", type: "debit", network: "Visa", expiry: "08/28", status: "active", digitalWallet: true, internationalEnabled: true },
  { id: "2", name: "ENT Visa Platinum", lastFour: "4521", type: "credit", network: "Visa", expiry: "11/27", status: "active", digitalWallet: true, internationalEnabled: false },
  { id: "3", name: "ENT Cash Rewards", lastFour: "8834", type: "credit", network: "Mastercard", expiry: "03/29", status: "active", digitalWallet: false, internationalEnabled: true },
];

export default function ManageCards() {
  const [cardStates, setCardStates] = useState<Record<string, CardInfo>>(() => {
    const map: Record<string, CardInfo> = {};
    cards.forEach((c) => { map[c.id] = { ...c }; });
    return map;
  });
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});

  const toggleFreeze = (id: string) => {
    setCardStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: prev[id].status === "active" ? "frozen" : "active" },
    }));
  };

  const toggleShow = (id: string) => {
    setShowNumbers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-testid="manage-cards-page">
      <div>
        <h1 className="text-lg font-semibold">Manage Cards</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage your debit and credit cards</p>
      </div>

      <div className="space-y-4">
        {Object.values(cardStates).map((card) => (
          <Card key={card.id} className={card.status === "frozen" ? "opacity-70" : ""} data-testid={`card-${card.id}`}>
            <CardContent className="p-5">
              {/* Card visual */}
              <div className={`rounded-xl p-5 mb-4 text-white ${card.type === "debit" ? "bg-gradient-to-br from-[hsl(210,50%,25%)] to-[hsl(210,60%,35%)]" : card.network === "Visa" ? "bg-gradient-to-br from-[hsl(0,72%,25%)] to-[hsl(0,72%,35%)]" : "bg-gradient-to-br from-[hsl(30,40%,25%)] to-[hsl(30,50%,35%)]"}`}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-medium opacity-80">{card.type === "debit" ? "DEBIT" : "CREDIT"}</span>
                  <span className="text-xs font-semibold">{card.network}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} />
                  <span className="text-base font-mono tracking-widest">
                    {showNumbers[card.id] ? `**** **** **** ${card.lastFour}` : `•••• •••• •••• ${card.lastFour}`}
                  </span>
                  <button onClick={() => toggleShow(card.id)} className="ml-auto opacity-70 hover:opacity-100">
                    {showNumbers[card.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] opacity-60">CARD HOLDER</p>
                    <p className="text-xs font-medium">ZACKARY LOVREK</p>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-60">EXPIRES</p>
                    <p className="text-xs font-medium">{card.expiry}</p>
                  </div>
                </div>
              </div>

              {/* Card info */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold">{card.name}</p>
                  <p className="text-xs text-muted-foreground">****{card.lastFour}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={card.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}
                >
                  {card.status === "active" ? "Active" : "Frozen"}
                </Badge>
              </div>

              {/* Card controls */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {card.status === "active" ? <Lock size={14} className="text-muted-foreground" /> : <Unlock size={14} className="text-muted-foreground" />}
                    <span className="text-sm">{card.status === "active" ? "Freeze Card" : "Unfreeze Card"}</span>
                  </div>
                  <Switch checked={card.status === "frozen"} onCheckedChange={() => toggleFreeze(card.id)} data-testid={`switch-freeze-${card.id}`} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-muted-foreground" />
                    <span className="text-sm">Digital Wallet</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {card.digitalWallet ? "Added" : "Not Added"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-muted-foreground" />
                    <span className="text-sm">International Transactions</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {card.internationalEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings size={14} className="mr-1" /> Card Settings
                </Button>
                <Button variant="outline" size="sm" className="flex-1">Report Lost/Stolen</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
