'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  progress,
  color = 'primary',
}: StatsCardProps) {
  const theme = useTheme();

  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: getColorValue(color),
              }}
            >
              {value}
            </Typography>
            
            {trend && (
              <Chip
                label={`${trend.isPositive ? '+' : ''}${trend.value}%`}
                size="small"
                color={trend.isPositive ? 'success' : 'error'}
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
          
          <Avatar
            sx={{
              bgcolor: getColorValue(color),
              width: 56,
              height: 56,
              ml: 2,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        {progress !== undefined && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getColorValue(color),
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
