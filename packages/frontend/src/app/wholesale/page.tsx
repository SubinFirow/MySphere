"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { apiClient } from "@/lib/api";

interface WholesaleBatch {
  _id: string;
  date: string;
  investment_amount: number;
  boxes_purchased: number;
  profit_per_box: number;
  notes?: string;
  cost_per_box: number;
  total_potential_profit: number;
  profit_margin_percentage: string;
  selling_price_per_box: number;
  total_selling_value: number;
  createdAt: string;
  updatedAt: string;
}

interface WholesaleFormData {
  date: string;
  investment_amount: number | "";
  boxes_purchased: number | "";
  profit_per_box: number | "";
  notes: string;
}

export default function WholesalePage() {
  const [batches, setBatches] = useState<WholesaleBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<WholesaleBatch | null>(null);
  const [formData, setFormData] = useState<WholesaleFormData>({
    date: new Date().toISOString().split("T")[0],
    investment_amount: "",
    boxes_purchased: "",
    profit_per_box: 20,
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await apiClient.wholesale.getAll();
      const responseData = response.data as { data?: WholesaleBatch[] };
      setBatches(responseData.data || []);
    } catch (error) {
      console.error("Error loading wholesale batches:", error);
      setError("Failed to load wholesale batches");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (batch?: WholesaleBatch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        date: batch.date.split("T")[0],
        investment_amount: batch.investment_amount,
        boxes_purchased: batch.boxes_purchased,
        profit_per_box: batch.profit_per_box,
        notes: batch.notes || "",
      });
    } else {
      setEditingBatch(null);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        investment_amount: "",
        boxes_purchased: "",
        profit_per_box: 20,
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBatch(null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.investment_amount ||
        !formData.boxes_purchased ||
        !formData.profit_per_box
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const submitData = {
        date: formData.date,
        investment_amount: Number(formData.investment_amount),
        boxes_purchased: Number(formData.boxes_purchased),
        profit_per_box: Number(formData.profit_per_box),
        notes: formData.notes || undefined,
      };

      if (editingBatch) {
        await apiClient.wholesale.update(editingBatch._id, submitData);
        setSuccess("Wholesale batch updated successfully");
      } else {
        await apiClient.wholesale.create(submitData);
        setSuccess("Wholesale batch created successfully");
      }

      await loadBatches();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving wholesale batch:", error);
      setError("Failed to save wholesale batch");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;

    try {
      await apiClient.wholesale.delete(id);
      setSuccess("Wholesale batch deleted successfully");
      await loadBatches();
    } catch (error) {
      console.error("Error deleting wholesale batch:", error);
      setError("Failed to delete wholesale batch");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "₹0";
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getProfitMarginColor = (percentage: string | undefined) => {
    if (!percentage) return "default";
    const value = parseFloat(percentage);
    if (isNaN(value)) return "default";
    if (value < 20) return "error";
    if (value < 40) return "warning";
    return "success";
  };

  return (
    <Box>
      {/* Page Header */}
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            <BusinessIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Wholesale Business
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your wholesale investments and profit potential
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Batch
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      {/* Batches Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Wholesale Batches
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : batches.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No wholesale batches yet. Add your first batch to get started!
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Investment</TableCell>
                    <TableCell>Boxes</TableCell>
                    <TableCell>Cost/Box</TableCell>
                    <TableCell>Profit/Box</TableCell>
                    <TableCell>Margin</TableCell>
                    <TableCell>Total Profit</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch._id}>
                      <TableCell>{formatDate(batch.date)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(batch.investment_amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>{batch.boxes_purchased || 0}</TableCell>
                      <TableCell>
                        {formatCurrency(batch.cost_per_box)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="success.main">
                          {formatCurrency(batch.profit_per_box)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${batch.profit_margin_percentage || "0"}%`}
                          size="small"
                          color={getProfitMarginColor(
                            batch.profit_margin_percentage || "0"
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.main"
                        >
                          {formatCurrency(batch.total_potential_profit)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {batch.notes ? (
                          <Tooltip title={batch.notes}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(batch)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(batch._id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingBatch ? "Edit Wholesale Batch" : "Add Wholesale Batch"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Investment Amount (₹)"
                type="number"
                value={formData.investment_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    investment_amount: Number(e.target.value) || "",
                  })
                }
                required
                fullWidth
                slotProps={{ htmlInput: { step: 0.01, min: 0 } }}
              />
              <TextField
                label="Boxes Purchased"
                type="number"
                value={formData.boxes_purchased}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    boxes_purchased: Number(e.target.value) || "",
                  })
                }
                required
                fullWidth
                slotProps={{ htmlInput: { step: 1, min: 1 } }}
              />
            </Box>

            <TextField
              label="Profit per Box (₹)"
              type="number"
              value={formData.profit_per_box}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profit_per_box: Number(e.target.value) || "",
                })
              }
              required
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{ htmlInput: { step: 0.01, min: 0 } }}
            />

            <TextField
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              fullWidth
              placeholder="Optional notes about supplier, product type, etc..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBatch ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
