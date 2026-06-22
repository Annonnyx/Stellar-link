import {
  SERVICES,
  VOLUME_DAYS,
  COMPLEXITY_MULTIPLIER,
  URGENCY_MULTIPLIER,
  REVISION_MULTIPLIER,
  EXCLUSIVE_RIGHTS_MULTIPLIER,
  COMMERCIAL_MULTIPLIER,
  MODIFICATION_DISCOUNT,
} from "@nova-studio/shared";
import type { PricingParams, PriceEstimate, PriceBreakdownItem } from "@nova-studio/shared";

export function calculateEstimate(params: PricingParams): PriceEstimate {
  const {
    serviceTypes,
    volume,
    complexity,
    urgency,
    isModification,
    revisionsCount,
    isCommercial,
    exclusiveRights,
  } = params;

  const breakdown: PriceBreakdownItem[] = [];
  let totalMin = 0;
  let totalMax = 0;

  const days = VOLUME_DAYS[volume];

  // Base price per service type
  for (const svc of serviceTypes) {
    const service = SERVICES.find((s) => s.category === svc);
    if (!service) continue;

    const baseMin = service.basePriceMin * days.min;
    const baseMax = service.basePriceMax * days.max;
    totalMin += baseMin;
    totalMax += baseMax;

    breakdown.push({
      label: `${service.label} (base)`,
      value: `${baseMin.toFixed(0)}€ — ${baseMax.toFixed(0)}€`,
    });
  }

  // Complexity
  const cMult = COMPLEXITY_MULTIPLIER[complexity];
  if (cMult !== 1) {
    totalMin *= cMult;
    totalMax *= cMult;
    breakdown.push({
      label: "Complexité",
      value: `×${cMult}`,
      multiplier: cMult,
    });
  }

  // Urgency
  const uMult = URGENCY_MULTIPLIER[urgency];
  if (uMult !== 1) {
    totalMin *= uMult;
    totalMax *= uMult;
    breakdown.push({
      label: "Urgence",
      value: `×${uMult}`,
      multiplier: uMult,
    });
  }

  // Revisions
  const rMult = REVISION_MULTIPLIER[revisionsCount];
  if (rMult !== 1) {
    totalMin *= rMult;
    totalMax *= rMult;
    breakdown.push({
      label: "Révisions",
      value: `×${rMult}`,
      multiplier: rMult,
    });
  }

  // Modification discount
  if (isModification) {
    totalMin *= MODIFICATION_DISCOUNT;
    totalMax *= MODIFICATION_DISCOUNT;
    breakdown.push({
      label: "Modification (réduction)",
      value: `×${MODIFICATION_DISCOUNT}`,
      multiplier: MODIFICATION_DISCOUNT,
    });
  }

  // Commercial usage
  if (isCommercial) {
    totalMin *= COMMERCIAL_MULTIPLIER;
    totalMax *= COMMERCIAL_MULTIPLIER;
    breakdown.push({
      label: "Usage commercial",
      value: `×${COMMERCIAL_MULTIPLIER}`,
      multiplier: COMMERCIAL_MULTIPLIER,
    });
  }

  // Exclusive rights
  if (exclusiveRights) {
    totalMin *= EXCLUSIVE_RIGHTS_MULTIPLIER;
    totalMax *= EXCLUSIVE_RIGHTS_MULTIPLIER;
    breakdown.push({
      label: "Droits exclusifs",
      value: `×${EXCLUSIVE_RIGHTS_MULTIPLIER}`,
      multiplier: EXCLUSIVE_RIGHTS_MULTIPLIER,
    });
  }

  return {
    min: Math.round(totalMin),
    max: Math.round(totalMax),
    breakdown,
    note: "Cette estimation est indicative. Le prix final sera confirmé après étude de votre projet.",
  };
}
