import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Calendar as CalendarIcon, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Slot {
  time: string;
  available: boolean;
}

interface DaySlots {
  date: string;
  dayLabel: string;
  slots: Slot[];
}

interface BookingWidgetProps {
  sessionId?: string;
  bookedBy?: "client" | "admin";
}

export default function BookingWidget({ sessionId, bookedBy }: BookingWidgetProps) {
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [daySlots, setDaySlots] = useState<DaySlots | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [note, setNote] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState<{ date: string; time: string } | null>(null);

  // Calendar constraints
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const fetchSlotsForDate = useCallback(async (date: Date) => {
    setLoading(true);
    setDaySlots(null);
    setSelectedTime(null);
    try {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;

      const { data, error: fnError } = await supabase.functions.invoke("get-booking-slots", {
        body: { date: dateStr },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      const days: DaySlots[] = data || [];
      setDaySlots(days.length > 0 ? days[0] : { date: dateStr, dayLabel: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }), slots: [] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to load slots.", variant: "destructive" });
      setDaySlots(null);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate, fetchSlotsForDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !daySlots) return;

    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-booking", {
        body: {
          name,
          email,
          organization,
          date: daySlots.date,
          time: selectedTime,
          note,
        },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setBooked({ date: daySlots.dayLabel, time: selectedTime });

      if (sessionId) {
        await supabase
          .from("assessment_sessions" as any)
          .update({ meeting_booked: true, meeting_booked_by: bookedBy || "client" } as any)
          .eq("id", sessionId);
      }

      toast({ title: "Call Booked", description: `Your discovery call is confirmed for ${daySlots.dayLabel} at ${formatTime(selectedTime)}.` });
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.message || "Could not complete booking. Please try again.", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  // ── Success state ──
  if (booked) {
    return (
      <Card className="border border-border/40 shadow-soft">
        <CardContent className="py-10 text-center space-y-4">
          <CheckCircle className="h-10 w-10 text-accent mx-auto" />
          <h4 className="font-display text-lg font-bold text-foreground">Discovery Call Confirmed</h4>
          <p className="text-sm text-muted-foreground">
            {booked.date} at {formatTime(booked.time)} (MT)
          </p>
          <p className="text-sm text-muted-foreground">
            You'll receive a confirmation email with meeting details shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  const availableSlots = daySlots?.slots.filter((s) => s.available) || [];

  return (
    <Card className="border border-border/40 shadow-soft overflow-hidden">
      <CardHeader className="border-b border-border/40 bg-secondary/10">
        <div className="flex items-center gap-3">
          <span className="text-accent"><CalendarIcon className="h-5 w-5" /></span>
          <CardTitle className="font-display text-lg font-bold text-foreground">Book a Discovery Call</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Calendar picker */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Select a Date</p>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d < today || d > endOfYear || isWeekend(d);
            }}
            fromDate={today}
            toDate={endOfYear}
            className={cn("rounded-md border pointer-events-auto")}
          />
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-6">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                <span className="text-sm text-muted-foreground">Loading available times…</span>
              </div>
            ) : daySlots ? (
              <>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Available Times — {daySlots.dayLabel}
                </p>
                {availableSlots.length === 0 ? (
                  <div className="text-center py-4 space-y-2">
                    <AlertTriangle className="h-6 w-6 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">No available slots on this day.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {daySlots.slots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        size="sm"
                        disabled={!slot.available}
                        className={`text-xs ${!slot.available ? "line-through opacity-40 cursor-not-allowed" : ""}`}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {formatTime(slot.time)}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* Form — shown when a time is selected */}
        {selectedTime && daySlots && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-border/40 pt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Full Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Dr. Jane Smith" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@clinic.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Organization</Label>
              <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Clinic or practice name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Note (optional)</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Anything we should know before the call?" />
            </div>
            <Button type="submit" disabled={submitting || !name || !email} className="w-full">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarIcon className="mr-2 h-4 w-4" />}
              {submitting ? "Booking…" : `Confirm — ${daySlots.dayLabel} at ${formatTime(selectedTime)}`}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
