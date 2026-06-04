import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format } from "date-fns";

interface Email {
  id: string;
  from_email: string;
  from_name: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  received_at: string;
}

interface Props {
  email: Email | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailViewerSheet({ email, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">{email?.subject || "(no subject)"}</SheetTitle>
        </SheetHeader>
        {email && (
          <div className="mt-4 space-y-4">
            <div className="text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">From:</span> {email.from_name ? `${email.from_name} <${email.from_email}>` : email.from_email}</div>
              <div><span className="font-medium text-foreground">Received:</span> {format(new Date(email.received_at), "PPpp")}</div>
            </div>
            <div className="border-t pt-4">
              {email.body_text ? (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{email.body_text}</pre>
              ) : email.body_html ? (
                <div className="prose prose-sm max-w-none text-sm" dangerouslySetInnerHTML={{ __html: email.body_html }} />
              ) : (
                <p className="text-sm text-muted-foreground italic">No body content.</p>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
