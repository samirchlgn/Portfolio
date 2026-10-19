/** Pure calculations. Units are explicit; no network or third-party services. */
function requireFinite(values) {
  if (
    values.some((value) => typeof value !== "number" || !Number.isFinite(value))
  )
    throw new RangeError("Enter a finite number in every field.");
}

export function rationalFlow({ coefficient, intensity, area }) {
  requireFinite([coefficient, intensity, area]);
  if (coefficient < 0 || coefficient > 1)
    throw new RangeError("Runoff coefficient must be between 0 and 1.");
  if (intensity < 0 || area < 0)
    throw new RangeError(
      "Rainfall intensity and catchment area cannot be negative.",
    );
  // mm/h × ha × (0.001 m/mm × 10,000 m²/ha ÷ 3,600 s/h).
  const cubicMetresPerSecond = (coefficient * intensity * area) / 360;
  const litresPerSecond = cubicMetresPerSecond * 1000;
  if (!Number.isFinite(litresPerSecond))
    throw new RangeError("The result is too large. Check the input units.");
  return { cubicMetresPerSecond, litresPerSecond };
}

export function pipeGrade({ start, end, length }) {
  requireFinite([start, end, length]);
  if (length <= 0)
    throw new RangeError("Horizontal length must be greater than zero.");
  const fall = start - end;
  const percent = (fall / length) * 100;
  const ratio = fall === 0 ? null : length / Math.abs(fall);
  if (!Number.isFinite(percent) || (ratio !== null && !Number.isFinite(ratio)))
    throw new RangeError("Check the levels and horizontal length.");
  return {
    fall,
    percent,
    ratio,
    direction: fall > 0 ? "fall" : fall < 0 ? "rise" : "level",
  };
}

export function earthworksBalance({ cut, fill, reuse, yieldFactor, bulking }) {
  requireFinite([cut, fill, reuse, yieldFactor, bulking]);
  if (cut < 0 || fill < 0)
    throw new RangeError("Cut and fill volumes cannot be negative.");
  if (reuse < 0 || reuse > 100)
    throw new RangeError("Reusable cut must be between 0 and 100 percent.");
  if (yieldFactor <= 0)
    throw new RangeError("Compacted yield must be greater than zero.");
  if (bulking < 1)
    throw new RangeError("Loose bulking factor must be at least 1.");
  const availableBank = (cut * reuse) / 100;
  const requiredBank = fill / yieldFactor;
  const rawBalance = availableBank - requiredBank;
  const balanceBank = Math.abs(rawBalance) < 1e-9 ? 0 : rawBalance;
  const unsuitableBank = cut - availableBank;
  const looseSurplus = Math.max(balanceBank, 0) * bulking;
  const looseUnsuitable = unsuitableBank * bulking;
  const importBank = Math.max(-balanceBank, 0);
  if (
    ![
      availableBank,
      requiredBank,
      balanceBank,
      looseSurplus,
      looseUnsuitable,
      importBank,
    ].every(Number.isFinite)
  )
    throw new RangeError(
      "The result is too large. Check the volumes and factors.",
    );
  return {
    availableBank,
    requiredBank,
    balanceBank,
    unsuitableBank,
    looseSurplus,
    looseUnsuitable,
    importBank,
    totalLooseExport: looseSurplus + looseUnsuitable,
  };
}

const reviewChecks = {
  Stormwater: [
    "Catchment boundaries, imperviousness and rainfall basis",
    "Treatment, retention, detention and discharge assumptions",
    "Overland-flow routes, levels, maintenance and downstream effects",
  ],
  Wastewater: [
    "Demand basis, network capacity and connection constraints",
    "Inverts, grade, cover, maintenance access and constructability",
    "Pumping assumptions, resilience and operational interfaces where relevant",
  ],
  "Water supply": [
    "Demand and firefighting requirements to be confirmed",
    "Network capacity, pressure, hydrants and service interfaces",
    "Backflow risk, material selection, access and commissioning",
  ],
  "Earthworks & roads": [
    "Survey quality, levels, boundaries and ground conditions",
    "Earthworks balance, geometry, access and retaining interfaces",
    "Drainage, pavement assumptions, construction staging and safety",
  ],
  "Integrated civil design": [
    "Survey, boundaries, levels and existing services",
    "Interfaces between earthworks, access and three-waters systems",
    "Approvals, constructability, maintenance and coordination risks",
  ],
};

export function buildReviewPrompt({ discipline, stage, context = "" }) {
  const checks = reviewChecks[discipline];
  if (!checks) throw new RangeError("Choose a discipline from the list.");
  if (
    !["Concept design", "Detailed design", "Construction review"].includes(
      stage,
    )
  )
    throw new RangeError("Choose a review stage from the list.");
  return `TECHNICAL REVIEW BRIEF\nDiscipline: ${discipline}\nStage: ${stage}\n\nCONTEXT\n${String(context).trim() || "Project context to be supplied by the reviewer."}\n\nREVIEW TASK\nSupport a qualified engineer reviewing the supplied material. Identify questions, inconsistencies, missing evidence and coordination risks. Do not certify compliance or replace professional judgement.\n\nFOCUS AREAS\n${checks.map((item) => "- " + item).join("\n")}\n- Safety in design, buildability, maintainability and whole-of-life implications\n- Assumptions, calculation inputs, units and the source of each requirement\n\nWORKING RULES\n1. Use only the documents and verified standards supplied for this project.\n2. Separate verified observations, assumptions, uncertainties and questions.\n3. Do not invent clause numbers, standard requirements, levels or design inputs.\n4. For each finding, identify the document location, engineering consequence and evidence needed to resolve it.\n5. Flag missing information before making a conclusion.\n6. Keep client and personal information within the organisation-approved environment.\n\nOUTPUT\nA concise review table: reference | observation | consequence | question or action | evidence required. Finish with unresolved decisions for the responsible engineer.\n\nHUMAN REVIEW\nThe responsible engineer must verify all technical statements, references and proposed actions before use.`;
}
