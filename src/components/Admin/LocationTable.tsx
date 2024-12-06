'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Paper,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocationData } from '@/types';

interface LocationTableProps {
  locations: LocationData[];
  onEdit: (id: number) => void;
  onApprove: (location: LocationData) => void;
  onReject: (id: number) => void;
  onDelete: (location: LocationData) => void;
  showApproveReject?: boolean;
}

export default function LocationTable({
  locations,
  onEdit,
  onApprove,
  onReject,
  onDelete,
  showApproveReject = false,
}: LocationTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Accessibility</TableCell>
            <TableCell>Submitted By</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="text.secondary">
                  No locations found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>
                  <Chip
                    label={location.accessibility_level?.toUpperCase() || 'UNKNOWN'}
                    color={
                      location.accessibility_level === 'high' ? 'success' :
                      location.accessibility_level === 'medium' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{location.submitted_by || 'Anonymous'}</TableCell>
                <TableCell>
                  {new Date(location.submitted_at!).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => onEdit(location.id!)}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <Tooltip title="Edit">
                      <EditIcon fontSize="small" />
                    </Tooltip>
                  </IconButton>
                  {showApproveReject && (
                    <>
                      <IconButton 
                        onClick={() => onApprove(location)}
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Tooltip title="Approve">
                          <CheckCircleIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                      <IconButton 
                        onClick={() => onReject(location.id!)}
                        color="error"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Tooltip title="Reject">
                          <CancelIcon fontSize="small" />
                        </Tooltip>
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    onClick={() => onDelete(location)}
                    color="error"
                    size="small"
                  >
                    <Tooltip title="Delete">
                      <DeleteIcon fontSize="small" />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}