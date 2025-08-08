// Expense Types
export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  paymentType: 'cash' | 'card' | 'upi';
  date: string;
  notes?: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  monthlyTotal: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentExpenses: number;
}

// Workout Types
export interface Workout {
  _id: string;
  date: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }>;
  duration: number;
  notes?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  currentWeek: number;
  completionRate: number;
  daysSinceStart: number;
}

// Body Weight Types
export interface BodyWeight {
  _id: string;
  date: string;
  weight: number;
  bmi?: number;
  notes?: string;
}

export interface BodyWeightStats {
  totalEntries: number;
  latestWeight: number;
  averageWeight: number;
  totalWeightChange: number;
  minWeight: number;
  maxWeight: number;
}

// Wholesale Types
export interface WholesaleBatch {
  _id: string;
  date: string;
  investmentAmount: number;
  boxesPurchased: number;
  profitPerBox: number;
  notes?: string;
}

export interface WholesaleStats {
  totalBatches: number;
  totalInvestment: number;
  totalPotentialProfit: number;
  averageInvestmentPerBatch: number;
  overallProfitMargin: string;
}

// Dashboard Summary
export interface DashboardSummary {
  expenses: ExpenseStats;
  workouts: WorkoutStats;
  bodyWeight: BodyWeightStats;
  wholesale: WholesaleStats;
}
