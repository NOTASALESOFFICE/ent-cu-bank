import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, BellRing, Mail, MessageSquare, Smartphone, Shield, DollarSign, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  icon: typeof Bell;
  email: boolean;
  sms: boolean;
  push: boolean;
  category: "account" | "security" | "billing";
}

const initialPrefs: NotificationPref[] = [
  { id: "large_transaction", label: "Large Transactions", description: "Notify when transactions exceed threshold", icon: DollarSign, email: true, sms: true, push: true, category: "account" },
  { id: "low_balance", label: "Low Balance Alerts", description: "Alert when balance drops below threshold", icon: AlertTriangle, email: true, sms: true, push: false, category: "account" },
  { id: "deposit_received", label: "Deposit Received", description: "Notification when deposits are credited", icon: CheckCircle, email: true, sms: false, push: true, category: "account" },
  { id: "card_transaction", label: "Card Transactions", description: "Real-time card purchase notifications", icon: CreditCard, email: false, sms: true, push: true, category: "account" },
  { id: "login_alert", label: "Login Alerts", description: "Notify on new device or location login", icon: Shield, email: true, sms: true, push: true, category: "security" },
  { id: "password_change", label: "Password Changes", description: "Confirmation when password is updated", icon: Shield, email: true, sms: true, push: false, category: "security" },
  { id: "bill_due", label: "Bill Due Reminders", description: "Remind before upcoming bill payments", icon: Bell, email: true, sms: false, push: true, category: "billing" },
  { id: "payment_confirmed", label: "Payment Confirmations", description: "Confirm when payments are processed", icon: CheckCircle, email: true, sms: false, push: false, category: "billing" },
];

const categories = [
  { key: "account", label: "Account Activity", icon: DollarSign },
  { key: "security", label: "Security", icon: Shield },
  { key: "billing", label: "Billing & Payments", icon: Bell },
];

export default function ManageNotifications() {
  const [prefs, setPrefs] = useState(initialPrefs);
  const [thresholdAmount, setThresholdAmount] = useState("500");
  const [lowBalanceAmount, setLowBalanceAmount] = useState("10000");
  const { toast } = useToast();

  const toggleChannel = (id: string, channel: "email" | "sms" | "push") => {
    setPrefs((prev) => prev.map((p) => p.id === id ? { ...p, [channel]: !p[channel] } : p));
  };

  const handleSave = () => {
    toast({ title: "Preferences saved", description: "Your notification preferences have been updated." });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="manage-notifications-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Manage Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose how and when you receive alerts</p>
        </div>
        <Button size="sm" onClick={handleSave} data-testid="button-save-notifs">Save Preferences</Button>
      </div>

      {/* Delivery channels summary */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm font-medium mb-3">Delivery Channels</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Mail size={16} className="text-primary" />
              <div>
                <p className="text-xs font-medium">Email</p>
                <p className="text-[10px] text-muted-foreground">zackary.lovrek@entcu.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <MessageSquare size={16} className="text-primary" />
              <div>
                <p className="text-xs font-medium">SMS</p>
                <p className="text-[10px] text-muted-foreground">(214) 555-0187</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Smartphone size={16} className="text-primary" />
              <div>
                <p className="text-xs font-medium">Push</p>
                <p className="text-[10px] text-muted-foreground">Mobile app</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thresholds */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-sm font-medium">Alert Thresholds</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Large Transaction Threshold</label>
              <Select value={thresholdAmount} onValueChange={setThresholdAmount}>
                <SelectTrigger className="h-9" data-testid="select-large-threshold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["100", "250", "500", "1000", "2500", "5000"].map((v) => (
                    <SelectItem key={v} value={v}>${parseInt(v).toLocaleString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Low Balance Threshold</label>
              <Select value={lowBalanceAmount} onValueChange={setLowBalanceAmount}>
                <SelectTrigger className="h-9" data-testid="select-low-threshold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["1000", "5000", "10000", "25000", "50000"].map((v) => (
                    <SelectItem key={v} value={v}>${parseInt(v).toLocaleString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification preferences by category */}
      {categories.map((cat) => (
        <Card key={cat.key}>
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-3 flex items-center gap-2">
              <cat.icon size={14} className="text-primary" />
              {cat.label}
            </h2>
            <div className="space-y-0 divide-y">
              {prefs.filter((p) => p.category === cat.key).map((pref) => (
                <div key={pref.id} className="flex items-center justify-between py-3" data-testid={`notif-pref-${pref.id}`}>
                  <div className="flex items-center gap-3">
                    <pref.icon size={14} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <Switch checked={pref.email} onCheckedChange={() => toggleChannel(pref.id, "email")} className="scale-75" />
                      <span className="text-[9px] text-muted-foreground">Email</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Switch checked={pref.sms} onCheckedChange={() => toggleChannel(pref.id, "sms")} className="scale-75" />
                      <span className="text-[9px] text-muted-foreground">SMS</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Switch checked={pref.push} onCheckedChange={() => toggleChannel(pref.id, "push")} className="scale-75" />
                      <span className="text-[9px] text-muted-foreground">Push</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
