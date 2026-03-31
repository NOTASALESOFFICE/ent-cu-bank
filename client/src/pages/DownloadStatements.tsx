import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Calendar, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Statement {
  id: string;
  month: string;
  year: string;
  account: string;
  type: "monthly" | "tax";
  date: string;
  size: string;
}

const statements: Statement[] = [
  { id: "1", month: "March", year: "2026", account: "Premier Checking (****7842)", type: "monthly", date: "Mar 31, 2026", size: "124 KB" },
  { id: "2", month: "March", year: "2026", account: "High-Yield Savings (****3291)", type: "monthly", date: "Mar 31, 2026", size: "98 KB" },
  { id: "3", month: "February", year: "2026", account: "Premier Checking (****7842)", type: "monthly", date: "Feb 28, 2026", size: "156 KB" },
  { id: "4", month: "February", year: "2026", account: "High-Yield Savings (****3291)", type: "monthly", date: "Feb 28, 2026", size: "87 KB" },
  { id: "5", month: "January", year: "2026", account: "Premier Checking (****7842)", type: "monthly", date: "Jan 31, 2026", size: "142 KB" },
  { id: "6", month: "January", year: "2026", account: "High-Yield Savings (****3291)", type: "monthly", date: "Jan 31, 2026", size: "91 KB" },
  { id: "7", month: "2025", year: "2025", account: "All Accounts", type: "tax", date: "Jan 15, 2026", size: "245 KB" },
];

export default function DownloadStatements() {
  const [accountFilter, setAccountFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("2026");
  const { toast } = useToast();

  const filtered = statements.filter((s) => {
    if (accountFilter !== "all" && !s.account.includes(accountFilter)) return false;
    if (yearFilter !== "all" && s.year !== yearFilter) return false;
    return true;
  });

  const handleDownload = (statement: Statement) => {
    toast({
      title: "Download started",
      description: `${statement.month} ${statement.year} statement for ${statement.account}`,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="download-statements-page">
      <div>
        <h1 className="text-lg font-semibold">Download Statements</h1>
        <p className="text-sm text-muted-foreground mt-1">Access your monthly and tax statements</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="w-64" data-testid="select-stmt-account">
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            <SelectItem value="7842">Premier Checking (****7842)</SelectItem>
            <SelectItem value="3291">High-Yield Savings (****3291)</SelectItem>
            <SelectItem value="5610">Money Market (****5610)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-32" data-testid="select-stmt-year">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Paperless enrollment banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Paperless Statements</p>
            <p className="text-xs text-muted-foreground">You are enrolled in paperless statements. Receive statements electronically.</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Enrolled
          </Badge>
        </CardContent>
      </Card>

      {/* Statements list */}
      <Card>
        <CardContent className="p-0 divide-y">
          {filtered.map((stmt) => (
            <div key={stmt.id} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors" data-testid={`statement-${stmt.id}`}>
              <div className={`p-2 rounded-lg shrink-0 ${stmt.type === "tax" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-muted"}`}>
                <FileText size={18} className={stmt.type === "tax" ? "text-amber-600" : "text-muted-foreground"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {stmt.type === "tax" ? "Tax Document (1099-INT)" : `${stmt.month} ${stmt.year} Statement`}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{stmt.account}</span>
                  <span className="text-xs text-muted-foreground">&middot;</span>
                  <span className="text-xs text-muted-foreground">{stmt.date}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{stmt.size}</span>
              <Button variant="ghost" size="sm" onClick={() => handleDownload(stmt)} data-testid={`download-${stmt.id}`}>
                <Download size={14} className="mr-1" /> PDF
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No statements found for the selected filters.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
