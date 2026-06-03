import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  fromMeeting?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function DeleteTaskDialog({ open, onOpenChange, count, fromMeeting, onConfirm }: Props) {
  const title = count > 1 ? `Delete ${count} tasks?` : "Delete this task?";
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone.
            {fromMeeting && count === 1 && (
              <>
                <br />
                <span className="text-xs">This task was created from a meeting. Deleting it will not delete the source record.</span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
