## Goal
- Build a student-school management app with role-based dashboards; all data now persisted to Firebase collections with CRUD, filters, and grade/section auto-linking between modules.

## Constraints & Preferences
- No login or approval system — app opens directly to dashboard.
- Navbar role selector dropdown switches between all dashboards; role derived from URL path via `AuthContext`.
- All action buttons (Add, Edit, View, Delete, Save, Join, Post, Submit Fee, Take Fee, Save Marks, etc.) work with modals, inline forms, or live state updates.
- Text must be visible in both light and dark mode.
- File/image upload with preview/remove in Feed composer and Media tab.
- School Admin sidebar hides Subject, Attendance, Homework, Timetable.
- `addDoc` is NOT exported — use `setDoc` + `doc` with manual ID.
- Section dropdowns use static A–E across all pages.
- Teacher Grade/Section auto-filled from matched class (single source of truth) and disabled when editing.
- Parent records auto-created from student data (parent name + parentPhone) in `parents` collection.

## Progress
### Done
- All **74+ page files** created. Build passes (512+ modules).
- **AuthContext**: role from `useLocation` pathname; userProfile and sidebar update on switch.
- **Sidebar**: school name/logo/themeColor from Redux (synced from Firebase). Inline edit saves to Firestore + dispatches Redux immediately.
- **Navbar**: search removed; inline role info.
- **Firebase config** in `src/services/firebase.js` — `addDoc` not exported.
- **Classes** — Firebase CRUD (`classes` collection). Section A–E dropdown. Class Teacher dropdown populated from `teachers`. Teacher name on cards clickable → modal. Loading spinner.
- **Teachers** — Grade/Section disabled when editing, auto-filled from matched class. Filter bar: Class, Section, Name. Fetches `teachers` + `classes`.
- **Students** — Firebase CRUD. Filter bar: Grade, Section, Name. `handleSave` auto-creates/updates parent in `parents` collection. `handleDelete` removes student from parent's children.
- **Parents** — reads from `students` collection (no manual CRUD). Table: Student Name, Father's Name, Father's Phone, Address. Name search filter.
- **Fees** — Firebase CRUD (fee structures, records, quick fee, reports). Filter bar on Student Fee Records + Fee Collection Report. CSV export uses filtered records. Student ID shows `student.studentId`.
- **Events** — Firebase CRUD. Loading spinner.
- **Announcements** — Firebase CRUD. Full class (1–12) and section (A–E) dropdowns.
- **Moderation** — Firebase CRUD. Type + Status filter bar.
- **Teacher Marks** — 3-tab (Exams, Marksheet, Report Card) with full proforma. Fixed 500 error.
- **Teacher Attendance** — Date-only selector, P/A/L toggle buttons, saves to `attendance`.
- **Student pages** (all 13) — fetch from Firebase filtered by grade/section.
- **Customization** — fully wired to Firebase (`settings/school_customization` doc). Loads on mount, saves/loads school name, tagline, logo, theme color, sidebar position, compact mode. "Apply & Save" button dispatches to Redux for instant UI update. Loading/saving states + success toast.
- **App.jsx** — loads Firebase settings on mount and dispatches to Redux; sets `--theme-color` CSS variable on document.

### In Progress
- (none)

### Blocked
- Firestore security rules not updated — if writes fail, set rules to `allow read, write: if true;` in Firestore console's Rules tab (not Realtime Database).
- AI Assistant not yet wired to a real API.

## Key Decisions
- `addDoc` not used — `doc(collection(...)).id` + `setDoc` instead.
- Class/section split into two selects (1–12, A–E).
- Parent records auto-generated from student `parent`/`parentPhone` (source of truth in `students`).
- Teacher grade/section derived from class assignment (not stored on teacher record for display).
- Fee Student ID shows `student.studentId`, not Firebase doc ID.
- CSV export uses same filters as displayed table.
- Customization settings stored in `settings/school_customization` Firestore doc; loaded via Redux on app mount; sidebar inline edits also persist.

## Next Steps
- Wire AI Assistant to a real API.
- Set correct Firestore rules.
