import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, TrendingUp, PieChart, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 gradient-bg rounded-xl">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ExpenseFlow</span>
          </div>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button variant="hero" size="sm">
              {user ? "Dashboard" : "Get Started"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Smart Financial Tracking
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Take Control of Your{' '}
              <span className="gradient-text">Finances</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track expenses, visualize spending patterns, and gain intelligent insights to make better financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="xl">
                  Start Tracking Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: "Smart Analytics", desc: "Beautiful charts and insights into your spending patterns" },
              { icon: PieChart, title: "Budget Tracking", desc: "Set budgets and track progress with visual indicators" },
              { icon: Shield, title: "Secure & Private", desc: "Your financial data is encrypted and protected" },
            ].map((feature, i) => (
              <Card key={i} variant="stat" className="p-6 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="p-3 gradient-bg rounded-xl w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2024 ExpenseFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
