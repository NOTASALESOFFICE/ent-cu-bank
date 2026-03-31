import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/auth";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
import AccountOverview from "./pages/AccountOverview";
import AccountDetail from "./pages/AccountDetail";
import TransferPage from "./pages/TransferPage";
import BillPay from "./pages/BillPay";
import SettingsPage from "./pages/SettingsPage";
import PayLoan from "./pages/PayLoan";
import PayCreditCard from "./pages/PayCreditCard";
import SendMember from "./pages/SendMember";
import Activity from "./pages/Activity";
import ExternalAccounts from "./pages/ExternalAccounts";
import ManageCards from "./pages/ManageCards";
import ManageNotifications from "./pages/ManageNotifications";
import MoneyInsights from "./pages/MoneyInsights";
import DownloadStatements from "./pages/DownloadStatements";
import ExploreProducts from "./pages/ExploreProducts";
import NotFound from "./pages/not-found";

function AuthenticatedApp() {
  return (
    <Router hook={useHashLocation}>
      <DashboardLayout>
        <Switch>
          {/* Accounts */}
          <Route path="/" component={AccountOverview} />
          <Route path="/accounts/:id" component={AccountDetail} />

          {/* Move Money */}
          <Route path="/move-money/transfer" component={TransferPage} />
          <Route path="/move-money/pay-loan" component={PayLoan} />
          <Route path="/move-money/pay-credit-card" component={PayCreditCard} />
          <Route path="/move-money/pay-bills" component={BillPay} />
          <Route path="/move-money/send-member" component={SendMember} />
          <Route path="/move-money/activity" component={Activity} />
          <Route path="/move-money/external-accounts" component={ExternalAccounts} />

          {/* Self Service */}
          <Route path="/self-service/profile" component={SettingsPage} />
          <Route path="/self-service/manage-cards" component={ManageCards} />
          <Route path="/self-service/manage-notifications" component={ManageNotifications} />

          {/* Money Insights */}
          <Route path="/money-insights" component={MoneyInsights} />

          {/* Top-level */}
          <Route path="/download-statements" component={DownloadStatements} />
          <Route path="/explore-products" component={ExploreProducts} />

          {/* Legacy routes (redirect-compatible) */}
          <Route path="/transfer" component={TransferPage} />
          <Route path="/bill-pay" component={BillPay} />
          <Route path="/settings" component={SettingsPage} />

          <Route component={NotFound} />
        </Switch>
      </DashboardLayout>
    </Router>
  );
}

function AppGate() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppGate />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
