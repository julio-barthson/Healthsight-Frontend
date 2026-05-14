import {
  adminNavLinks,
  clientNavLinks,
  landlordNavLinks,
  doctorNavLinks,
  nurseNavLinks,
  mlsNavLinks,
  himNavLinks,
  choNavLinks,
} from "./nav-links"

export const roleNavMap: Record<string, any[]> = {
  // Non-Healthsight roles
  CLIENT: clientNavLinks,
  LANDLORD: landlordNavLinks,
  ADMIN: adminNavLinks,

  // Doctor group
  MEDICAL_OFFICER: doctorNavLinks,
  CONSULTANT: doctorNavLinks,
  OBSTETRICIAN: doctorNavLinks,
  OPHTHALMOLOGIST: doctorNavLinks,
  OPTOMETRIST: doctorNavLinks,
  DENTIST: doctorNavLinks,

  // Nurse group
  NURSE: nurseNavLinks,
  MIDWIFE: nurseNavLinks,
  WARD_NURSE: nurseNavLinks,
  DENTAL_NURSE: nurseNavLinks,
  EMERGENCY_CARE_STAFF: nurseNavLinks,
  EMERGENCY_MEDICAL_TECHNICIAN: nurseNavLinks,

  // MLS group
  MEDICAL_LABORATORY_SCIENTIST: mlsNavLinks,
  MEDICAL_LABORATORY_TECHNICIAN: mlsNavLinks,

  // HIM group
  HEALTH_INFORMATION_MANAGEMENT_OFFICER: himNavLinks,
  HEALTH_INFORMATION_MANAGEMENT_TECHNICIAN: himNavLinks,

  // CHO group
  COMMUNITY_HEALTH_EXTENSION_WORKER: choNavLinks,
}
