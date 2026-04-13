

## Plan: Replace Day Badges with a Full Calendar Picker

### Current State
The "Select a Day" section uses small Badge chips showing only the next 7 weekdays. Users cannot browse further into the future.

### Changes

**1. Update `BookingWidget.tsx`**
- Replace the Badge-based day selector with the shadcn `Calendar` component (already in the project)
- Use a Popover or inline calendar showing a full month view
- Disable past dates and dates beyond December 31 of the current year
- Disable weekends (Saturday/Sunday) since slots are only generated for weekdays
- When a date is selected, fetch slots for that specific date from the edge function
- Add `selectedDate` state (a `Date`) instead of `selectedDay` index

**2. Update `get-booking-slots/index.ts`**
- Accept an optional `date` parameter (YYYY-MM-DD) in the request body
- When provided, fetch staff availability for just that single date instead of a 7-day window
- When no date is provided, keep the existing 7-day behavior as fallback
- This allows the calendar to request slots for any future date the user picks

**3. UI Layout**
- Show the calendar inline (not in a popover) within the card, replacing the day badges
- Once a date is picked, show the time slots grid below it (same as current behavior)
- The calendar will visually highlight the selected date

### Files Modified
- `src/components/BookingWidget.tsx` — replace day badges with Calendar component, add date-based slot fetching
- `supabase/functions/get-booking-slots/index.ts` — accept optional `date` param for single-day queries

