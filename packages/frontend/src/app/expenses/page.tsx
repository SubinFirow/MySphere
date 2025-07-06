"use client";

import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { Expense, CreateExpenseData, UpdateExpenseData } from "@/types/expense";
import api from "@/lib/api";

export default function ExpensesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingExpense(null);
  };

  const handleFormSubmit = async (
    data: CreateExpenseData | UpdateExpenseData
  ) => {
    try {
      if (editingExpense) {
        // Update existing expense
        await api.expenses.update(
          editingExpense._id,
          data as Record<string, unknown>
        );
      } else {
        // Create new expense
        await api.expenses.create(data as Record<string, unknown>);
      }

      // Refresh the list
      setRefreshTrigger((prev) => prev + 1);
      handleFormClose();
    } catch (error) {
      // Error handling is done in the form component
      throw error;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Expense Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your daily expenses with detailed analytics
        </Typography>
      </Box>

      <ExpenseList
        onAddExpense={handleAddExpense}
        onEditExpense={handleEditExpense}
        refreshTrigger={refreshTrigger}
      />

      <ExpenseForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        expense={editingExpense}
        mode={editingExpense ? "edit" : "create"}
      />
    </Container>
  );
}
