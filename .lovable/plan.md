
Goal: fix responsive CTA behavior and label consistency for the exact button set you listed, without changing routing or unrelated content.

1) Standardize responsive CTA behavior on the listed pages/buttons
- Apply a consistent “long-label CTA” class pattern to the specified buttons so text wraps cleanly instead of overflowing:
  - `w-full sm:w-auto`
  - `whitespace-normal`
  - `h-auto py-3`
  - `text-center leading-snug`
- Keep icon alignment stable with inline-flex centering so wrapped labels stay visually balanced.
- Use this on:
  - Homepage: “Start Your Strategic Assessment”
  - Solutions: “Explore New Practice Solutions”, “Explore Existing Practice Solutions”
  - Medical/Dental/Veterinary self-identification cards:
    - “Start Your Build Strategy Assessment”
    - “Start Your Performance Assessment”
  - Planning & Building: “Start Your Build Strategy Assessment”
  - Operating, Growing & Advising: “Start Your Performance Assessment”
  - Surgical Facilities CTA buttons in Medical/Dental/Veterinary callouts.

2) Remove duplicate arrow characters where icon arrows already exist
- In listed CTAs currently using both text arrow (`→`) and icon arrow, remove the text arrow and keep only the icon.
- This will be applied in:
  - `src/pages/SolutionsNewClinics.tsx`
  - `src/pages/SolutionsExistingClinics.tsx`
  - `src/pages/solutions/NHSF.tsx` facility type CTA labels (data strings).

3) Fix Surgical Facilities CTA wording consistency
- Normalize “Explore…” spelling and keep CTA naming consistent across:
  - Medical, Dental, Veterinary surgical-facility callouts.
- Update NHSF facility-type card CTA labels to clean, non-redundant wording (no trailing `→`) and corrected spacing/wording for:
  - Medical NHSF Advisory
  - Dental Surgical Facility Advisory
  - Veterinary Surgical Facility Advisory

4) Files to update
- `src/components/home/HeroSection.tsx`
- `src/pages/Solutions.tsx`
- `src/pages/SolutionsNewClinics.tsx`
- `src/pages/SolutionsExistingClinics.tsx`
- `src/pages/solutions/Medical.tsx`
- `src/pages/solutions/Dental.tsx`
- `src/pages/solutions/Veterinary.tsx`
- `src/pages/solutions/NHSF.tsx`

5) Validation (end-to-end responsive QA)
- Verify all listed CTAs at: 390, 768, 1024, 1280, 1366, 1536 widths.
- Confirm:
  - No overflow/clipping
  - Text wraps cleanly
  - Buttons remain aligned in cards/rows
  - CTA labels match updated wording
  - No routing/logic changes introduced.

Technical details
- I will not modify global button variant behavior to avoid side effects on other pages.
- Changes are scoped to per-button classNames and targeted CTA label strings only.
- Existing routes (`to="..."`) remain unchanged.
