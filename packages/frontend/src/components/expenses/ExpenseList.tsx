"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Menu,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  Expense,
  ExpenseFilters,
  ExpenseCategory,
  PaymentType,
} from "@/types/expense";
import api from "@/lib/api";

interface ExpenseListProps {
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  refreshTrigger?: number;
}

export default function ExpenseList({
  onAddExpense,
  onEditExpense,
  refreshTrigger,
}: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Filters and pagination
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    paymentType: undefined,
    sortBy: "date",
    sortOrder: "desc",
  });
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

  // Load categories and payment types
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [categoriesRes, paymentTypesRes] = await Promise.all([
          api.expenses.getCategories(),
          api.expenses.getPaymentTypes(),
        ]);
        setCategories((categoriesRes.data as { data: ExpenseCategory[] }).data);
        setPaymentTypes((paymentTypesRes.data as { data: PaymentType[] }).data);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };
    loadFilterData();
  }, []);

  // Load expenses
  const loadExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.expenses.getAll(
        filters as Record<string, unknown>
      );
      setExpenses((response.data as { data: Expense[] }).data);
      setTotalItems(
        (response.data as { pagination: { totalItems: number } }).pagination
          .totalItems
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to load expenses"
          : "Failed to load expenses";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [filters, refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (field: keyof ExpenseFilters, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field !== "page" ? 1 : (value as number), // Reset to first page when changing filters
    }));
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      await api.expenses.delete(expenseToDelete._id);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
      loadExpenses();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to delete expense"
          : "Failed to delete expense";
      setError(errorMessage);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    expense: Expense
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedExpense(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getPaymentTypeIcon = (type: string) => {
    const paymentType = paymentTypes.find((pt) => pt.value === type);
    return paymentType?.icon || "💳";
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category);
    return cat?.icon || "📦";
  };

  if (loading && expenses.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="rectangular" width={120} height={36} />
          </Box>
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={60}
              sx={{ mb: 1 }}
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ReceiptIcon color="primary" />
            <Typography variant="h5" fontWeight={600}>
              My Expenses
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddExpense}
            sx={{ borderRadius: 2 }}
          >
            Add Expense
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "2fr 1fr 1fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            size="small"
          />

          <FormControl size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category || ""}
              onChange={(e) =>
                handleFilterChange("category", e.target.value || undefined)
              }
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{category.icon}</span>
                    {category.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Payment Type</InputLabel>
            <Select
              value={filters.paymentType || ""}
              onChange={(e) =>
                handleFilterChange("paymentType", e.target.value || undefined)
              }
              label="Payment Type"
            >
              <MenuItem value="">All Types</MenuItem>
              {paymentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{type.icon}</span>
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Expenses Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {expense.title}
                      </Typography>
                      {expense.description && (
                        <Typography variant="caption" color="text.secondary">
                          {expense.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary"
                    >
                      {formatCurrency(expense.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        categories.find((c) => c.value === expense.category)
                          ?.label || expense.category
                      }
                      icon={<span>{getCategoryIcon(expense.category)}</span>}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        paymentTypes.find(
                          (pt) => pt.value === expense.paymentType
                        )?.label || expense.paymentType
                      }
                      icon={
                        <span>{getPaymentTypeIcon(expense.paymentType)}</span>
                      }
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(expense.date), "MMM dd, yyyy")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(expense.date), "hh:mm a")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, expense)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={totalItems}
          page={(filters.page || 1) - 1}
          onPageChange={(_, newPage) => handleFilterChange("page", newPage + 1)}
          rowsPerPage={filters.limit || 10}
          onRowsPerPageChange={(e) =>
            handleFilterChange("limit", parseInt(e.target.value))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />

        {/* Action Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              if (selectedExpense) onEditExpense(selectedExpense);
              handleMenuClose();
            }}
          >
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setExpenseToDelete(selectedExpense);
              setDeleteDialogOpen(true);
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Expense</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &quot;{expenseToDelete?.title}
              &quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteExpense}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
