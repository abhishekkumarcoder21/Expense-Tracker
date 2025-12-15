import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useExpenses } from '@/hooks/useExpenses';
import { useBudgets } from '@/hooks/useBudgets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, Plus, TrendingUp, TrendingDown, LogOut, Trash2 } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS, ExpenseCategory, PaymentMethod } from '@/types/expense';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval, subDays } from 'date-fns';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { expenses, isLoading, addExpense, deleteExpense } = useExpenses();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    category: 'food' as ExpenseCategory,
    description: '',
    payment_method: 'cash' as PaymentMethod,
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    expense_time: format(new Date(), 'HH:mm'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExpense.mutateAsync({
      ...form,
      amount: parseFloat(form.amount),
    });
    setOpen(false);
    setForm({ ...form, amount: '', description: '' });
  };

  // Calculate stats
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const monthlyExpenses = expenses.filter(e => 
    isWithinInterval(new Date(e.expense_date), { start: monthStart, end: monthEnd })
  );
  
  const totalThisMonth = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const todayTotal = expenses
    .filter(e => e.expense_date === format(now, 'yyyy-MM-dd'))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  // Chart data
  const categoryData = CATEGORIES.map(cat => ({
    name: cat.label,
    value: monthlyExpenses.filter(e => e.category === cat.value).reduce((sum, e) => sum + Number(e.amount), 0),
    color: cat.color,
  })).filter(d => d.value > 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(now, 6 - i);
    const dayExpenses = expenses.filter(e => e.expense_date === format(date, 'yyyy-MM-dd'));
    return {
      day: format(date, 'EEE'),
      amount: dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    };
  });

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
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="stat" className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Today</p>
            <p className="text-2xl font-bold">₹{todayTotal.toLocaleString()}</p>
          </Card>
          <Card variant="stat" className="p-6">
            <p className="text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-2xl font-bold">₹{totalThisMonth.toLocaleString()}</p>
          </Card>
          <Card variant="stat" className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Transactions</p>
            <p className="text-2xl font-bold">{monthlyExpenses.length}</p>
          </Card>
          <Card variant="stat" className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Avg/Day</p>
            <p className="text-2xl font-bold">₹{Math.round(totalThisMonth / 30).toLocaleString()}</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <CardTitle className="mb-4">Spending by Category</CardTitle>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <CardTitle className="mb-4">Last 7 Days</CardTitle>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Transactions</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" size="sm">
                  <Plus className="h-4 w-4" /> Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v: ExpenseCategory) => setForm({...form, category: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={form.payment_method} onValueChange={(v: PaymentMethod) => setForm({...form, payment_method: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map(p => <SelectItem key={p.value} value={p.value}>{p.icon} {p.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={form.expense_date} onChange={e => setForm({...form, expense_date: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional note" />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={addExpense.isPending}>
                    {addExpense.isPending ? 'Adding...' : 'Add Expense'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No expenses yet. Add your first one!</div>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 10).map(expense => {
                const cat = CATEGORIES.find(c => c.value === expense.category);
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat?.icon}</span>
                      <div>
                        <p className="font-medium">{cat?.label}</p>
                        <p className="text-sm text-muted-foreground">{expense.description || format(new Date(expense.expense_date), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">₹{Number(expense.amount).toLocaleString()}</span>
                      <Button variant="ghost" size="icon" onClick={() => deleteExpense.mutate(expense.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
