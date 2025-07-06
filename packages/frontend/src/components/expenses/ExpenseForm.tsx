"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  InputAdornment,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  CreateExpenseData,
  UpdateExpenseData,
  Expense,
  ExpenseCategory,
  PaymentType,
} from "@/types/expense";
import api from "@/lib/api";

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseData | UpdateExpenseData) => Promise<void>;
  expense?: Expense | null;
  mode: "create" | "edit";
}

export default function ExpenseForm({
  open,
  onClose,
  onSubmit,
  expense,
  mode,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<CreateExpenseData>({
    title: "",
    description: "",
    amount: 0,
    paymentType: "upi",
    category: "other",
    date: new Date().toISOString(),
    tags: [],
    isRecurring: false,
    notes: "",
  });

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  // Load categories and payment types
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, paymentTypesRes] = await Promise.all([
          api.expenses.getCategories(),
          api.expenses.getPaymentTypes(),
        ]);
        setCategories((categoriesRes.data as { data: ExpenseCategory[] }).data);
        setPaymentTypes((paymentTypesRes.data as { data: PaymentType[] }).data);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };
    loadData();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && expense) {
      setFormData({
        title: expense.title,
        description: expense.description || "",
        amount: expense.amount,
        paymentType: expense.paymentType,
        category: expense.category,
        date: expense.date,
        tags: expense.tags || [],
        isRecurring: expense.isRecurring,
        recurringType: expense.recurringType,
        notes: expense.notes || "",
      });
    } else if (mode === "create") {
      setFormData({
        title: "",
        description: "",
        amount: 0,
        paymentType: "upi",
        category: "other",
        date: new Date().toISOString(),
        tags: [],
        isRecurring: false,
        notes: "",
      });
    }
  }, [mode, expense, open]);

  const handleInputChange = (
    field: keyof CreateExpenseData,
    value: unknown
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (formData.amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      await onSubmit(formData);
      onClose();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight={600}>
            {mode === "create" ? "Add New Expense" : "Edit Expense"}
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "grid", gap: 3 }}>
              {/* Title */}
              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                fullWidth
                placeholder="e.g., Lunch at Restaurant"
              />

              {/* Amount and Payment Type */}
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    handleInputChange("amount", parseFloat(e.target.value) || 0)
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />

                <FormControl required>
                  <InputLabel>Payment Type</InputLabel>
                  <Select
                    value={formData.paymentType}
                    onChange={(e) =>
                      handleInputChange("paymentType", e.target.value)
                    }
                    label="Payment Type"
                  >
                    {paymentTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <span>{type.icon}</span>
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Category and Date */}
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <FormControl required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <span>{category.icon}</span>
                          {category.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <DateTimePicker
                  label="Date & Time"
                  value={dayjs(formData.date)}
                  onChange={(date) =>
                    handleInputChange(
                      "date",
                      date?.toISOString() || new Date().toISOString()
                    )
                  }
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                    },
                  }}
                />
              </Box>

              {/* Description */}
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                multiline
                rows={2}
                placeholder="Optional description..."
              />

              {/* Tags */}
              <Box>
                <TextField
                  label="Add Tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Press Enter to add tag"
                  InputProps={{
                    endAdornment: (
                      <Button onClick={handleAddTag} size="small">
                        Add
                      </Button>
                    ),
                  }}
                />
                {formData.tags && formData.tags.length > 0 && (
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Recurring */}
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isRecurring}
                      onChange={(e) =>
                        handleInputChange("isRecurring", e.target.checked)
                      }
                    />
                  }
                  label="Recurring Expense"
                />

                {formData.isRecurring && (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Recurring Type</InputLabel>
                    <Select
                      value={formData.recurringType || ""}
                      onChange={(e) =>
                        handleInputChange("recurringType", e.target.value)
                      }
                      label="Recurring Type"
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>

              {/* Notes */}
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                multiline
                rows={3}
                placeholder="Additional notes..."
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Add Expense"
                : "Update Expense"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
