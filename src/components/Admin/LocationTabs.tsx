'use client';

import { Tabs, Tab, Box } from '@mui/material';

interface LocationTabsProps {
  activeTab: number;
  pendingCount: number;
  approvedCount: number;
  onChange: (newValue: number) => void;
}

export default function LocationTabs({
  activeTab,
  pendingCount,
  approvedCount,
  onChange,
}: LocationTabsProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={activeTab} onChange={(_, value) => onChange(value)}>
        <Tab label={`Pending (${pendingCount})`} />
        <Tab label={`Approved (${approvedCount})`} />
      </Tabs>
    </Box>
  );
}