import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, User, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import entLogoUrl from "@assets/EntE_ColorLogo_Square300x300.jpg";
import servicePhotoUrl from "@assets/commitment-to-service.jpg";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left panel — branding with photo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden bg-[hsl(215,35%,12%)]">
        {/* Background photo */}
        <img
          src={servicePhotoUrl}
          alt="ENT Credit Union — Commitment to Service"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />

        <div className="relative p-12 flex flex-col justify-between h-full">
          {/* Top — logo and title */}
          <div>
            <img
              src={entLogoUrl}
              alt="ENT Credit Union"
              className="w-16 h-16 rounded-xl shadow-lg"
              data-testid="img-ent-logo"
            />
            <h1 className="text-3xl font-bold mt-6 text-white drop-shadow-lg">ENT Credit Union</h1>
            <p className="text-white/70 text-sm mt-1 drop-shadow">Online Banking Portal</p>
          </div>

          {/* Bottom — trust badges */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/15 backdrop-blur-sm shrink-0 mt-0.5">
                  <Shield size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Bank-Level Security</p>
                  <p className="text-xs text-white/60">256-bit encryption protects your data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/15 backdrop-blur-sm shrink-0 mt-0.5">
                  <Lock size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">FDIC Insured</p>
                  <p className="text-xs text-white/60">Deposits insured up to $250,000</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/40">
              &copy; 2026 ENT Credit Union. All rights reserved. NMLS #407985
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <img
              src={entLogoUrl}
              alt="ENT Credit Union"
              className="w-14 h-14 rounded-xl shadow mx-auto"
            />
            <h1 className="text-xl font-bold mt-4">ENT Credit Union</h1>
            <p className="text-sm text-muted-foreground">Online Banking</p>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to access your accounts
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" data-testid="alert-error">
                    <AlertCircle size={14} />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-9"
                      autoComplete="username"
                      autoFocus
                      data-testid="input-username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10"
                      autoComplete="current-password"
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(c) => setRememberMe(c === true)}
                      data-testid="checkbox-remember"
                    />
                    <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
                      Remember this device
                    </Label>
                  </div>
                  <button type="button" className="text-xs text-primary hover:underline" data-testid="link-forgot-password">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-black/90 text-white"
                  disabled={loading}
                  data-testid="button-login"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Need help? Call <span className="font-medium text-foreground">(800) 525-9623</span>
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Shield size={12} className="text-primary" />
              <span>Secured with 256-bit TLS encryption</span>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
