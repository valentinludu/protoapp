"use client";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Link,
  Box,
} from "@mui/material";
import type { DialogProps } from "@mui/material/Dialog";
import { CanvasQRCode } from "../common/QRCode";

export function FarcasterLoginModal({
  url,
  ...props
}: Omit<DialogProps, "children"> & { url?: string }) {
  return (
    <Dialog
      open={props.open && !!url}
      onClose={props.onClose}
      title="Sign in with Warpcast"
    >
      <DialogTitle>Sign in with Warpcast</DialogTitle>
      <DialogContent sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
        <DialogContentText variant="body1">
          Scan with your phone&apos;s camera to continue.
        </DialogContentText>
        <Box m={{ sm: "auto" }}>
          <CanvasQRCode uri={url || ""} />
        </Box>
        <DialogActions sx={{ justifyContent: "start", p: 0 }}>
          <Link href={url}>I&apos;m using my phone →</Link>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
