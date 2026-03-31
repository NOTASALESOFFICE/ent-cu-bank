import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Plus, Building2, CheckCircle, Clock, Trash2, RefreshCw } from "lucide-react";
import { useState } from "react";

interface ExternalAccount {
  id: string;
  bankName: string;
  accountType: string;
  lastFour: string;
  status: "verified" | "pending";
  addedDate: string;
}

const externalAccounts: ExternalAccount[] = [
  { id: "1", bankName: "Chase Bank", accountType: "Checking", lastFour: "4821", status: "verified", addedDate: "Jan 15, 2026" },
  { id: "2", bankName: "Wells Fargo", accountType: "Savings", lastFour: "7392", status: "verified", addedDate: "Feb 20, 2026" },
  { id: "3", bankName: "Bank of America", accountType: "Checking", lastFour: "1156", status: "pending", addedDate: "Mar 28, 2026" },
];

export default function ExternalAccounts() {
  const [accounts] = useState(externalAccounts);

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-testid="external-accounts-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">My External Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage connected accounts at other financial institutions</p>
        </div>
        <Button size="sm" data-testid="button-add-external">
          <Plus size={14} className="mr-1" />
          Link Account
        </Button>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => (
          <Card key={account.id} data-testid={`external-account-${account.id}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Building2 size={18} className="text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{account.bankName}</p>
                      {account.status === "verified" ? (
                        <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle size={10} className="mr-0.5" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          <Clock size={10} className="mr-0.5" /> Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{account.accountType} ****{account.lastFour}</p>
                    <p className="text-xs text-muted-foreground">Added {account.addedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {account.status === "pending" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <RefreshCw size={14} />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Link2 size={24} className="mx-auto text-muted-foreground mb-2" />
          <h3 className="text-sm font-medium mb-1">Link a New Account</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Connect checking or savings accounts from other banks to transfer money easily.
          </p>
          <Button variant="outline" size="sm">
            <Plus size={14} className="mr-1" />
            Add External Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
