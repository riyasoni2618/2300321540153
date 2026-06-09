import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { TOP_N_OPTIONS, TYPE_OPTIONS } from '../config/constants';
import type { NotificationType } from '../types/notification';

interface FilterBarProps {
  topN: number;
  typeFilter: string;
  loading: boolean;
  onTopNChange: (value: number) => void;
  onTypeChange: (value: string) => void;
  onRefresh: () => void;
}

export function FilterBar({
  topN,
  typeFilter,
  loading,
  onTopNChange,
  onTypeChange,
  onRefresh,
}: FilterBarProps) {
  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Top N</InputLabel>
          <Select
            label="Top N"
            value={topN}
            onChange={(e) => onTopNChange(Number(e.target.value))}
          >
            {TOP_N_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                Top {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select
            label="Type"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {TYPE_OPTIONS.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
          sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
        >
          Refresh Inbox
        </Button>
      </Stack>
    </Box>
  );
}

export function resolveTypeFilter(value: string): NotificationType | undefined {
  if (value === 'All') {
    return undefined;
  }

  return value as NotificationType;
}
