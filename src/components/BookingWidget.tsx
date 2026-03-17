import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Slot {
  time: string;
  available: boolean;
}

interface DaySlots {
  date: string;
  dayLabel: string;
  slots: Slot[];
}

export default function BookingWidget() {
  const { toast } = useToast();

  const [days, setDays] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [note, setNote] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState<{ date: string; time: string } | null>(null);

  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("get-booking-slots");
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      setDays(data || []);
      setSelectedDay(0);
      setSelectedTime(null);
    } catch (err: any) {
      setError(err.message || "Failed to load available slots.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !days[selectedDay]) return;

    setSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-booking", {
        body: {
          name,
          email,
          organization,
          date: days[selectedDay].date,
          time: selectedTime,
          note,
        },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setBooked({ date: days[selectedDay].dayLabel, time: selectedTime });
      toast({ title: "Call Booked", description: `Your discovery call is confirmed for ${days[selectedDay].dayLabel} at ${formatTime(selectedTime)}.` });
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
            {booked.date} at {formatTime(booked.time)} (ET)
          </p>
          <p className="text-sm text-muted-foreground">
            You'll receive a confirmation email with meeting details shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  // ── Loading state ──
  if (loading) {
    return (
      <Card className="border border-border/40 shadow-soft">
        <CardContent className="py-10 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <span className="text-sm text-muted-foreground">Loading available times…</span>
        </CardContent>
      </Card>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <Card className="border border-border/40 shadow-soft">
        <CardContent className="py-10 text-center space-y-4">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchSlots}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── No availability ──
  if (days.length === 0) {
    return (
      <Card className="border border-border/40 shadow-soft">
        <CardContent className="py-10 text-center space-y-3">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No available slots in the next 7 days. Please check back soon.</p>
        </CardContent>
      </Card>
    );
  }

  const currentDay = days[selectedDay];
  const availableSlots = currentDay?.slots.filter((s) => s.available) || [];

  return (
    <Card className="border border-border/40 shadow-soft overflow-hidden">
      <CardHeader className="border-b border-border/40 bg-secondary/10">
        <div className="flex items-center gap-3">
          <span className="text-accent"><Calendar className="h-5 w-5" /></span>
          <CardTitle className="font-display text-lg font-bold text-foreground">Book a Discovery Call</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Day selector */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Select a Day</p>
          <div className="flex flex-wrap gap-2">
            {days.map((day, i) => (
              <Badge
                key={day.date}
                variant={i === selectedDay ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1.5 text-sm transition-colors ${
                  i === selectedDay
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-secondary"
                }`}
                onClick={() => { setSelectedDay(i); setSelectedTime(null); }}
              >
                {day.dayLabel}
              </Badge>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Available Times — {currentDay?.dayLabel}
          </p>
          {availableSlots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No available slots on this day.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {currentDay.slots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  size="sm"
                  disabled={!slot.available}
                  className={`text-xs ${
                    !slot.available ? "line-through opacity-40 cursor-not-allowed" : ""
                  } ${selectedTime === slot.time ? "" : ""}`}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {formatTime(slot.time)}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Form — shown when a time is selected */}
        {selectedTime && (
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
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
              {submitting ? "Booking…" : `Confirm — ${currentDay.dayLabel} at ${formatTime(selectedTime)}`}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
