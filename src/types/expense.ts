export type ExpenseCategory = 
  | 'food' 
  | 'transport' 
  | 'rent' 
  | 'shopping' 
  | 'health' 
  | 'education' 
  | 'entertainment' 
  | 'utilities' 
  | 'others';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: ExpenseCategory;
  custom_category_id?: string | null;
  description?: string | null;
  payment_method: PaymentMethod;
  expense_date: string;
  expense_time: string;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category?: ExpenseCategory | null;
  amount: number;
  period: string;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryInfo {
  value: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { value: 'food', label: 'Food & Dining', icon: '🍔', color: 'hsl(var(--chart-1))' },
  { value: 'transport', label: 'Transport', icon: '🚗', color: 'hsl(var(--chart-2))' },
  { value: 'rent', label: 'Rent & Bills', icon: '🏠', color: 'hsl(var(--chart-3))' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'hsl(var(--chart-4))' },
  { value: 'health', label: 'Health', icon: '💊', color: 'hsl(var(--chart-5))' },
  { value: 'education', label: 'Education', icon: '📚', color: 'hsl(160 70% 40%)' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'hsl(280 60% 55%)' },
  { value: 'utilities', label: 'Utilities', icon: '💡', color: 'hsl(200 70% 50%)' },
  { value: 'others', label: 'Others', icon: '📦', color: 'hsl(220 10% 50%)' },
];

export const PAYMENT_METHODS = [
  { value: 'cash' as PaymentMethod, label: 'Cash', icon: '💵' },
  { value: 'upi' as PaymentMethod, label: 'UPI', icon: '📱' },
  { value: 'card' as PaymentMethod, label: 'Card', icon: '💳' },
  { value: 'bank' as PaymentMethod, label: 'Bank Transfer', icon: '🏦' },
];
