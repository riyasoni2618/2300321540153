import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { TYPE_COLORS } from '../config/constants';
import type { Notification } from '../types/notification';

interface NotificationCardProps {
  notification: Notification;
  rank: number;
}

const typeIcons = {
  Placement: WorkOutlineIcon,
  Result: SchoolOutlinedIcon,
  Event: EventOutlinedIcon,
};

export function NotificationCard({ notification, rank }: NotificationCardProps) {
  const Icon = typeIcons[notification.Type];

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="overline" color="text.secondary">
              #{rank}
            </Typography>
            <Chip
              icon={<Icon fontSize="small" />}
              label={notification.Type}
              color={TYPE_COLORS[notification.Type]}
              size="small"
            />
          </Stack>

          <Typography variant="subtitle1" fontWeight={600}>
            {notification.Message}
          </Typography>

          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Timestamp
            </Typography>
            <Typography variant="body2">{notification.Timestamp}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
