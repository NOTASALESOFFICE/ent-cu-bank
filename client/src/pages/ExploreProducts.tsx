import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  PiggyBank,
  CreditCard,
  Home,
  Car,
  TrendingUp,
  Shield,
  ArrowRight,
  Star,
  Percent,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  rate: string;
  rateLabel: string;
  icon: typeof Wallet;
  category: string;
  featured: boolean;
  benefits: string[];
}

const products: Product[] = [
  {
    id: "1",
    name: "Premier Checking",
    description: "Full-featured checking with premium benefits and no monthly fee with qualifying balance.",
    rate: "0.05%",
    rateLabel: "APY",
    icon: Wallet,
    category: "Checking",
    featured: true,
    benefits: ["No monthly fee with $1,500 balance", "Free checks", "ATM fee rebates up to $25/mo"],
  },
  {
    id: "2",
    name: "High-Yield Savings",
    description: "Earn competitive rates on your savings with no minimum balance requirement.",
    rate: "4.25%",
    rateLabel: "APY",
    icon: PiggyBank,
    category: "Savings",
    featured: true,
    benefits: ["No minimum balance", "Unlimited transfers", "FDIC insured"],
  },
  {
    id: "3",
    name: "Money Market Account",
    description: "Higher yields for higher balances with check-writing privileges.",
    rate: "4.50%",
    rateLabel: "APY",
    icon: TrendingUp,
    category: "Savings",
    featured: false,
    benefits: ["Tiered interest rates", "Check writing", "$10,000 minimum"],
  },
  {
    id: "4",
    name: "Visa Platinum Credit Card",
    description: "Low rate card perfect for balance transfers and everyday purchases.",
    rate: "12.99%",
    rateLabel: "APR",
    icon: CreditCard,
    category: "Credit Cards",
    featured: true,
    benefits: ["No annual fee", "0% intro APR for 12 months", "Fraud protection"],
  },
  {
    id: "5",
    name: "Cash Rewards Credit Card",
    description: "Earn cash back on every purchase with bonus categories.",
    rate: "1.5%",
    rateLabel: "Cash Back",
    icon: CreditCard,
    category: "Credit Cards",
    featured: false,
    benefits: ["1.5% unlimited cash back", "3% on gas & groceries", "No annual fee"],
  },
  {
    id: "6",
    name: "Home Mortgage",
    description: "Competitive rates on fixed and adjustable-rate mortgages.",
    rate: "6.25%",
    rateLabel: "APR",
    icon: Home,
    category: "Loans",
    featured: false,
    benefits: ["Fixed & ARM options", "First-time buyer programs", "No prepayment penalties"],
  },
  {
    id: "7",
    name: "Auto Loan",
    description: "Finance your next vehicle with competitive rates and flexible terms.",
    rate: "4.25%",
    rateLabel: "APR",
    icon: Car,
    category: "Loans",
    featured: false,
    benefits: ["New & used vehicles", "Up to 84-month terms", "Rate discounts for autopay"],
  },
  {
    id: "8",
    name: "Certificate (CD)",
    description: "Lock in a guaranteed rate for a fixed term.",
    rate: "4.75%",
    rateLabel: "APY",
    icon: Shield,
    category: "Savings",
    featured: false,
    benefits: ["12-month term", "FDIC insured", "$1,000 minimum"],
  },
];

const categories = ["All", "Checking", "Savings", "Credit Cards", "Loans"];

import { useState } from "react";

export default function ExploreProducts() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="explore-products-page">
      <div>
        <h1 className="text-lg font-semibold">Explore Products</h1>
        <p className="text-sm text-muted-foreground mt-1">Discover accounts, cards, and loans tailored for you</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            data-testid={`filter-${cat.toLowerCase().replace(/ /g, "-")}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Featured banner */}
      {selectedCategory === "All" && (
        <Card className="bg-gradient-to-r from-[hsl(215,35%,14%)] to-[hsl(215,30%,22%)] text-white border-0">
          <CardContent className="p-6">
            <Badge className="bg-amber-500/20 text-amber-300 border-0 mb-2">
              <Star size={10} className="mr-1" /> Featured
            </Badge>
            <h2 className="text-lg font-bold mb-1">High-Yield Savings at 4.25% APY</h2>
            <p className="text-sm text-white/70 mb-4">Open an account today and start earning more on your savings. No minimum balance required.</p>
            <Button variant="secondary" size="sm">
              Learn More <ArrowRight size={14} className="ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow" data-testid={`product-${product.id}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <product.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{product.name}</h3>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">{product.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary tabular-nums">{product.rate}</p>
                  <p className="text-[10px] text-muted-foreground">{product.rateLabel}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{product.description}</p>

              <div className="space-y-1 mb-4">
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">Apply Now</Button>
                <Button size="sm" variant="outline">Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
