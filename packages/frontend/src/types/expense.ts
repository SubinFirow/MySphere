export interface Expense {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  paymentType: "cash" | "card" | "upi";
  category: string;
  date: string;
  tags?: string[];
  isRecurring: boolean;
  recurringType?: "daily" | "weekly" | "monthly" | "yearly";
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  formattedAmount?: string;
  monthYear?: string;
}

export interface CreateExpenseData {
  title: string;
  description?: string;
  amount: number;
  paymentType: "cash" | "card" | "upi";
  category: string;
  date?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringType?: "daily" | "weekly" | "monthly" | "yearly";
  notes?: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {
  _id?: string;
}

export interface ExpenseCategory {
  value: string;
  label: string;
  icon: string;
}

export interface PaymentType {
  value: "cash" | "card" | "upi";
  label: string;
  icon: string;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  category?: string;
  paymentType?: "cash" | "card" | "upi";
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ExpensePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ExpenseListResponse {
  success: boolean;
  data: Expense[];
  pagination: ExpensePagination;
}

export interface ExpenseResponse {
  success: boolean;
  data: Expense;
  message?: string;
}

export interface ExpenseAnalyticsSummary {
  period: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalAmount: number;
    totalTransactions: number;
    averageAmount: number;
    percentageChange: number;
  };
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
    avgAmount: number;
  }>;
  paymentTypeBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  dailyExpenses: Array<{
    date: string;
    total: number;
    count: number;
  }>;
}

export interface ExpenseTrends {
  trends: Array<{
    month: string;
    total: number;
    count: number;
    average: number;
  }>;
}

export interface ExpenseStats {
  overall: {
    totalExpenses: number;
    totalAmount: number;
  };
  thisMonth: {
    total: number;
    count: number;
    average: number;
  };
  insights: {
    mostUsedPaymentType: string;
    topSpendingCategory: string;
    topCategoryAmount: number;
  };
}
