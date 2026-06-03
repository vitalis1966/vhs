**Rename footer login links and align admin-facing labels for platform separation.**

This is a labeling-only change with no functional or routing changes.

## Changes

1. **Footer (`src/components/Footer.tsx`)**
   - Rename "Employee Login" → "Vitalis OS Login" (href remains `/employee-login`)
   - Rename "Admin Login" → "VHS Login" (href remains `/admin/login`)

2. **Admin Dashboard (`src/pages/admin/AdminDashboard.tsx`)**
   - Rename the "VHS Management" card title → "VHS Administration" to match the user's description of the 2-card dashboard ("VHS Administration and Vitalis OS")

3. **Admin Login page (`src/pages/admin/AdminLogin.tsx`)**
   - Rename page heading "Admin Login" → "VHS Login" for consistency with the footer link

4. **VHS Management page (`src/pages/admin/VHSManagement.tsx`)**
   - Rename page heading "VHS Management" → "VHS Administration" for consistency

No routing, guard logic, or database changes.