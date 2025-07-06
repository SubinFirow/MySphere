"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import {
  Person,
  Assignment,
  Inventory,
  TrendingUp,
  Security,
} from "@mui/icons-material";

interface ActivityItem {
  id: string;
  type: "user" | "task" | "inventory" | "analytics" | "security";
  title: string;
  description: string;
  timestamp: string;
  status?: "success" | "warning" | "error" | "info";
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "user",
    title: "New user registered",
    description: "John Doe joined the platform",
    timestamp: "2 minutes ago",
    status: "success",
  },
  {
    id: "2",
    type: "task",
    title: "Task completed",
    description: "Database backup task finished successfully",
    timestamp: "15 minutes ago",
    status: "success",
  },
  {
    id: "3",
    type: "inventory",
    title: "Low stock alert",
    description: "Product XYZ is running low on inventory",
    timestamp: "1 hour ago",
    status: "warning",
  },
  {
    id: "4",
    type: "analytics",
    title: "Traffic spike detected",
    description: "Website traffic increased by 45%",
    timestamp: "2 hours ago",
    status: "info",
  },
  {
    id: "5",
    type: "security",
    title: "Security scan completed",
    description: "No vulnerabilities found in latest scan",
    timestamp: "3 hours ago",
    status: "success",
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "user":
      return <Person />;
    case "task":
      return <Assignment />;
    case "inventory":
      return <Inventory />;
    case "analytics":
      return <TrendingUp />;
    case "security":
      return <Security />;
    default:
      return <Assignment />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "user":
      return "primary";
    case "task":
      return "success";
    case "inventory":
      return "warning";
    case "analytics":
      return "info";
    case "security":
      return "error";
    default:
      return "primary";
  }
};

export default function RecentActivity() {
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title="Recent Activity"
        titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
        action={
          <Chip label="Live" color="success" size="small" variant="outlined" />
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <List sx={{ width: "100%" }}>
          {mockActivities.map((activity, index) => (
            <ListItem
              key={activity.id}
              alignItems="flex-start"
              sx={{
                px: 0,
                borderBottom: index < mockActivities.length - 1 ? 1 : 0,
                borderColor: "divider",
                pb: 2,
                mb: index < mockActivities.length - 1 ? 2 : 0,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: `${getActivityColor(activity.type)}.main`,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {activity.title}
                    </Typography>
                    {activity.status && (
                      <Chip
                        label={activity.status}
                        size="small"
                        color={
                          activity.status as
                            | "default"
                            | "primary"
                            | "secondary"
                            | "error"
                            | "info"
                            | "success"
                            | "warning"
                        }
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {activity.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      {activity.timestamp}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
