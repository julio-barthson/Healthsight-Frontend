export const SCREENING_TYPE_LABELS: Record<string, string> = {
  HYPERTENSION: "Hypertension",
  DIABETES: "Diabetes",
  CERVICAL_CANCER: "Cervical Cancer",
  BREAST_CANCER: "Breast Cancer",
  PSA: "Prostate-Specific Antigen (PSA)",
}

export function getScreeningLabel(type: string): string {
  return SCREENING_TYPE_LABELS[type] ?? type.replace(/_/g, " ")
}
