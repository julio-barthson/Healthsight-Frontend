import {
  IconBell,
  IconBookmark,
  IconBuildingSkyscraper,
  IconCalendar,
  IconCircleCheck,
  IconClipboardList,
  IconLayoutDashboard,
  IconShieldCheck,
  IconUsers,
  IconUsersGroup,
  IconHomeDot,
  IconFileText,
  IconCurrencyNaira,
  IconClipboardCheck,
  IconWallet,
  IconPigMoney,
  IconClipboardText,
  IconMap,
  IconClipboardData,
  IconStethoscope,
  IconUserSearch,
  IconReportMedical,
  IconUserCheck,
  IconMessage,
} from "@tabler/icons-react"

// ── Healthsight staff nav (fallback) ──────────────────────────────────────────

export const healthStaffNavLinks = [
  {
    label: "Dashboard",
    slug: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    label: "My Assessments",
    slug: "/assessment",
    icon: IconClipboardText,
  },
]

// ── Clinical nav ───────────────────────────────────────────────────────────────

const clinicalBase = [
  { label: "Dashboard", slug: "/dashboard", icon: IconLayoutDashboard },
  { label: "My Assessments", slug: "/assessment", icon: IconClipboardText },
  { label: "Patients", slug: "/patients", icon: IconUserSearch },
]

export const doctorNavLinks = [
  ...clinicalBase,
  { label: "Screenings", slug: "/screenings", icon: IconStethoscope },
  { label: "Appointments", slug: "/appointments", icon: IconCalendar },
  { label: "Reports", slug: "/reports", icon: IconReportMedical },
]

export const nurseNavLinks = [
  ...clinicalBase,
  { label: "Screenings", slug: "/screenings", icon: IconStethoscope },
]

export const mlsNavLinks = [
  ...clinicalBase,
  { label: "Screenings", slug: "/screenings", icon: IconStethoscope },
]

export const himNavLinks = [
  ...clinicalBase,
  { label: "Appointments", slug: "/appointments", icon: IconCalendar },
  { label: "Reports", slug: "/reports", icon: IconReportMedical },
]

export const choNavLinks = [
  ...clinicalBase,
  { label: "Screenings", slug: "/screenings", icon: IconStethoscope },
  { label: "Dividers", slug: "/dividers", icon: IconUsersGroup },
  { label: "Volunteers", slug: "/volunteers", icon: IconUserCheck },
]

// ── Admin nav (Healthsight) ────────────────────────────────────────────────────

export const adminNavLinks = [
  {
    label: "Dashboard",
    slug: "/admin/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    label: "Users",
    slug: "/admin/users",
    icon: IconUsers,
  },
  {
    label: "Pending Approvals",
    slug: "/admin/pending-users",
    icon: IconCircleCheck,
  },
  {
    label: "PHC Facilities",
    slug: "/admin/phcs",
    icon: IconBuildingSkyscraper,
  },
  {
    label: "PHC Map",
    slug: "/admin/phcs/map",
    icon: IconMap,
  },
  {
    label: "General Assessment",
    slug: "/admin/assessment/general",
    icon: IconClipboardList,
  },
  {
    label: "SafeCare Assessment",
    slug: "/admin/assessment/safecare",
    icon: IconShieldCheck,
  },
  {
    label: "Roles",
    slug: "/admin/roles",
    icon: IconUsersGroup,
  },
  // Clinical
  { label: "SMS Logs", slug: "/admin/sms", icon: IconMessage },
  // Clinical
  { label: "Patients", slug: "/patients", icon: IconUserSearch },
  { label: "Screenings", slug: "/screenings", icon: IconStethoscope },
  { label: "Appointments", slug: "/appointments", icon: IconCalendar },
  { label: "Reports", slug: "/reports", icon: IconReportMedical },
  { label: "Dividers", slug: "/dividers", icon: IconUsersGroup },
  { label: "Volunteers", slug: "/volunteers", icon: IconUserCheck },
]
