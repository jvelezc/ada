'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface ExitDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ExitDialog({ open, onClose, onConfirm }: ExitDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>Exit Edit Mode?</DialogTitle>
      <DialogContent>
        Are you sure you want to exit? All your changes will be lost.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error">
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  );
}