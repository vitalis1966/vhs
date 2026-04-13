

## Plan: Fix Booking Widget — Calendar Sync & Time Zone

### Problem 1: Staff calendar not synced
The `get-booking-slots` function uses `calendarView` which only shows existing **Bookings** appointments — it does **not** check each staff member's personal Outlook calendar for meetings, blocks, or out-of-office events. So a slot that's blocked on a staff member's calendar still appears as available.

**Fix:** Replace `calendarView` with the Microsoft Graph `getStaffAvailability` endpoint (`POST /solutions/bookingBusinesses/{id}/getStaffAvailability`). This endpoint checks the staff's actual Outlook calendar and returns available time windows, respecting all calendar events, not just Bookings appointments.

### Problem 2: UTC instead of MST
The `create-booking` function hardcodes `timeZone: "UTC"` in the appointment payload. The confirmation email from Microsoft then shows UTC. The business is configured for MST (America/Edmonton).

**Fix:** Change `timeZone` from `"UTC"` to `"America/Edmonton"` in both the `start` and `end` objects of the appointment payload in `create-booking`. Also update `get-booking-slots` to generate and compare slots in MST.

### Changes

**1. Rewrite `get-booking-slots/index.ts`**
- Fetch staff members list
- Call `POST .../getStaffAvailability` with the 7-day window and `timeZone: "America/Edmonton"`
- Parse the returned `availabilityItems` to build the slot grid — only slots within returned available windows are marked available
- Generate day labels and slot times in MST context
- Remove the old `calendarView` approach entirely

**2. Update `create-booking/index.ts`**
- Change `timeZone: "UTC"` → `timeZone: "America/Edmonton"` in both `start` and `end` objects
- This ensures the confirmation email Microsoft sends shows Mountain Time

**3. Update `BookingWidget.tsx`**
- Change the timezone label from `(ET)` to `(MT)` in the confirmation display

### Files Modified
- `supabase/functions/get-booking-slots/index.ts` — rewrite slot generation using `getStaffAvailability`
- `supabase/functions/create-booking/index.ts` — fix timezone to `America/Edmonton`
- `src/components/BookingWidget.tsx` — update timezone label display

### Deployment
- Both edge functions will be redeployed after changes

