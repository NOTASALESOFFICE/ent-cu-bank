import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Shield,
  Bell,
  Smartphone,
  Mail,
  Key,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [txnAlerts, setTxnAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const handleSave = (section: string) => {
    toast({ title: `${section} updated`, description: "Your changes have been saved." });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="settings-page">
      <div>
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="w-full justify-start" data-testid="settings-tabs">
          <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences" data-testid="tab-preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                  ZL
                </div>
                <div>
                  <p className="font-semibold">{user?.name || "Zackary Lovrek"}</p>
                  <p className="text-sm text-muted-foreground">
                    Member ID: {user?.memberId || "ENT-00482791"}
                  </p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Premier Member
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <Input defaultValue={user?.name || "Zackary Lovrek"} data-testid="input-fullname" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Username</Label>
                  <Input defaultValue={user?.username || "zlovrek"} disabled className="opacity-60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    defaultValue={user?.email || "zackary.lovrek@entcu.com"}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input
                    type="tel"
                    defaultValue={user?.phone || "(214) 555-0187"}
                    data-testid="input-phone"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium">Mailing Address</Label>
                  <Input defaultValue="4521 Cedar Springs Rd, Dallas, TX 75219" data-testid="input-address" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("Profile")} data-testid="button-save-profile">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Key size={16} className="text-primary" />
                Password
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Current Password</Label>
                  <Input type="password" placeholder="Enter current password" data-testid="input-current-password" />
                </div>
                <div />
                <div className="space-y-2">
                  <Label className="text-sm">New Password</Label>
                  <Input type="password" placeholder="Enter new password" data-testid="input-new-password" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Confirm Password</Label>
                  <Input type="password" placeholder="Confirm new password" data-testid="input-confirm-password" />
                </div>
              </div>
              <Button size="sm" onClick={() => handleSave("Password")} data-testid="button-change-password">
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Authenticator App</p>
                  <p className="text-xs text-muted-foreground">Use an authenticator app for 2FA codes</p>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactor && <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px]">Active</Badge>}
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} data-testid="switch-2fa" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Biometric Login</p>
                  <p className="text-xs text-muted-foreground">Use fingerprint or Face ID</p>
                </div>
                <Switch checked={biometric} onCheckedChange={setBiometric} data-testid="switch-biometric" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Login Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified of new device logins</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px]">Active</Badge>
                  <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} data-testid="switch-login-alerts" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Smartphone size={16} className="text-primary" />
                Trusted Devices
              </h3>
              {[
                { device: "MacBook Pro — Chrome", location: "Dallas, TX", last: "Active now", current: true },
                { device: "iPhone 15 Pro — Safari", location: "Dallas, TX", last: "2 hours ago", current: false },
                { device: "iPad Air — Safari", location: "Houston, TX", last: "3 days ago", current: false },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">
                      {d.device}
                      {d.current && (
                        <Badge variant="secondary" className="ml-2 text-[10px]">Current</Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{d.location} · {d.last}</p>
                  </div>
                  {!d.current && (
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive">
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Bell size={16} className="text-primary" />
                Notification Channels
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "zackary.lovrek@entcu.com"}</p>
                  </div>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} data-testid="switch-email-notifs" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">{user?.phone || "(214) 555-0187"}</p>
                  </div>
                </div>
                <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} data-testid="switch-sms-notifs" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Browser and mobile push alerts</p>
                  </div>
                </div>
                <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} data-testid="switch-push-notifs" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-sm font-semibold">Alert Types</h3>
              {[
                { label: "Transaction alerts", desc: "Notify on transactions over $500", enabled: txnAlerts, setter: setTxnAlerts },
                { label: "Low balance alerts", desc: "Alert when balance drops below $10,000", enabled: true, setter: () => {} },
                { label: "Bill due reminders", desc: "Remind 3 days before a bill is due", enabled: true, setter: () => {} },
                { label: "Security alerts", desc: "Suspicious activity and login attempts", enabled: loginAlerts, setter: setLoginAlerts },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={item.enabled} onCheckedChange={item.setter} />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => handleSave("Notifications")} data-testid="button-save-notifications">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREFERENCES TAB */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Globe size={16} className="text-primary" />
                Display Preferences
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Default Account View</p>
                  <p className="text-xs text-muted-foreground">Show all accounts on login</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Hide Balances by Default</p>
                  <p className="text-xs text-muted-foreground">Mask balances until you reveal them</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Compact Transaction View</p>
                  <p className="text-xs text-muted-foreground">Show more transactions per page</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Statements & Documents
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Paperless Statements</p>
                  <p className="text-xs text-muted-foreground">Receive statements electronically</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px]">Enrolled</Badge>
                  <Switch defaultChecked />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Tax Documents (1099-INT)</p>
                  <p className="text-xs text-muted-foreground">Available for download in January</p>
                </div>
                <Button variant="outline" size="sm">
                  View Documents
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle size={16} />
                Danger Zone
              </h3>
              <p className="text-xs text-muted-foreground">
                These actions are permanent and cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/5">
                  Close Account
                </Button>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/5">
                  Delete All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
