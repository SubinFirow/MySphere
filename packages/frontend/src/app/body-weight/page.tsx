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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as WeightIcon,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { apiClient } from "@/lib/api";

interface BodyWeightEntry {
  _id: string;
  weight: number;
  unit: string;
  date: string;
  notes?: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
  bmi?: number;
  createdAt: string;
  updatedAt: string;
}

interface BodyWeightFormData {
  weight: number | "";
  unit: string;
  date: string;
  notes: string;
  bodyFatPercentage: number | "";
  muscleMass: number | "";
}

export default function BodyWeightPage() {
  const [entries, setEntries] = useState<BodyWeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BodyWeightEntry | null>(
    null
  );
  const [formData, setFormData] = useState<BodyWeightFormData>({
    weight: "",
    unit: "kg",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    bodyFatPercentage: "",
    muscleMass: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.bodyWeight.getAll();
      const responseData = response.data as { data?: BodyWeightEntry[] };
      setEntries(responseData.data || []);
    } catch (error) {
      console.error("Error loading body weight entries:", error);
      setError("Failed to load body weight entries");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (entry?: BodyWeightEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        weight: entry.weight,
        unit: entry.unit,
        date: entry.date.split("T")[0],
        notes: entry.notes || "",
        bodyFatPercentage: entry.bodyFatPercentage || "",
        muscleMass: entry.muscleMass || "",
      });
    } else {
      setEditingEntry(null);
      setFormData({
        weight: "",
        unit: "kg",
        date: new Date().toISOString().split("T")[0],
        notes: "",
        bodyFatPercentage: "",
        muscleMass: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEntry(null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.weight) {
        setError("Weight is required");
        return;
      }

      const submitData = {
        weight: Number(formData.weight),
        unit: formData.unit,
        date: formData.date,
        notes: formData.notes || undefined,
        bodyFatPercentage: formData.bodyFatPercentage
          ? Number(formData.bodyFatPercentage)
          : undefined,
        muscleMass: formData.muscleMass
          ? Number(formData.muscleMass)
          : undefined,
      };

      if (editingEntry) {
        await apiClient.bodyWeight.update(editingEntry._id, submitData);
        setSuccess("Body weight entry updated successfully");
      } else {
        await apiClient.bodyWeight.create(submitData);
        setSuccess("Body weight entry created successfully");
      }

      await loadEntries();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving body weight entry:", error);
      setError("Failed to save body weight entry");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await apiClient.bodyWeight.delete(id);
      setSuccess("Body weight entry deleted successfully");
      await loadEntries();
    } catch (error) {
      console.error("Error deleting body weight entry:", error);
      setError("Failed to delete body weight entry");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return null;
    return current > previous ? (
      <TrendingUp color="error" fontSize="small" />
    ) : current < previous ? (
      <TrendingDown color="success" fontSize="small" />
    ) : null;
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
            <WeightIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Body Weight Tracking
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your body weight progress over time
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Entry
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

      {/* Entries Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Weight Entries
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : entries.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No weight entries yet. Add your first entry to get started!
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>BMI</TableCell>
                    <TableCell>Body Fat %</TableCell>
                    <TableCell>Muscle Mass</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Trend</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.map((entry, index) => (
                    <TableRow key={entry._id}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {entry.weight} {entry.unit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {entry.bmi ? (
                          <Chip
                            label={entry.bmi.toFixed(1)}
                            size="small"
                            color={
                              entry.bmi < 18.5
                                ? "warning"
                                : entry.bmi < 25
                                ? "success"
                                : entry.bmi < 30
                                ? "warning"
                                : "error"
                            }
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.bodyFatPercentage
                          ? `${entry.bodyFatPercentage}%`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {entry.muscleMass ? `${entry.muscleMass} kg` : "-"}
                      </TableCell>
                      <TableCell>
                        {entry.notes ? (
                          <Typography variant="body2" noWrap>
                            {entry.notes}
                          </Typography>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {getTrendIcon(entry.weight, entries[index + 1]?.weight)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(entry)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(entry._id)}
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
          {editingEntry ? "Edit Weight Entry" : "Add Weight Entry"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Weight"
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: Number(e.target.value) || "",
                  })
                }
                required
                fullWidth
                inputProps={{ step: 0.1, min: 0 }}
              />
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={formData.unit}
                  label="Unit"
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                >
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="lbs">lbs</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
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
                label="Body Fat %"
                type="number"
                value={formData.bodyFatPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bodyFatPercentage: Number(e.target.value) || "",
                  })
                }
                inputProps={{ step: 0.1, min: 0, max: 100 }}
              />
              <TextField
                label="Muscle Mass (kg)"
                type="number"
                value={formData.muscleMass}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    muscleMass: Number(e.target.value) || "",
                  })
                }
                inputProps={{ step: 0.1, min: 0 }}
              />
            </Box>

            <TextField
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              fullWidth
              placeholder="Optional notes about this measurement..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEntry ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
