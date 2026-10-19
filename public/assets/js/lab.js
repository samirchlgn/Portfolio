import {
  rationalFlow,
  pipeGrade,
  earthworksBalance,
  buildReviewPrompt,
} from "./calculations.js";
import { copyText, toast } from "./main.js";

const names = ["stormwater", "pipe", "earthworks", "review"];
const panels = [...document.querySelectorAll("[data-panel]")];
const links = [...document.querySelectorAll(".lab-nav [data-tool]")];
const fields = {
  stormwater: ["coefficient", "area", "intensity"],
  pipe: ["start", "end", "length"],
  earthworks: ["cut", "fill", "reuse", "yieldFactor", "bulking"],
};
const forms = {
  stormwater: "flow-form",
  pipe: "grade-form",
  earthworks: "balance-form",
  review: "review-form",
};
const nf = (value, maximumFractionDigits = 2) =>
  new Intl.NumberFormat("en-NZ", { maximumFractionDigits }).format(
    Object.is(value, -0) ? 0 : value,
  );
const node = (id) => document.getElementById(id);
let active = "stormwater";
let report = {};

function values(tool) {
  const result = {};
  for (const id of fields[tool] || []) {
    const element = node(id);
    if (
      !element.validity.valid ||
      element.value.trim() === "" ||
      !Number.isFinite(element.valueAsNumber)
    ) {
      element.setAttribute("aria-invalid", "true");
      throw new RangeError(
        `${document.querySelector(`label[for="${id}"]`).textContent}: ${element.validationMessage || "enter a valid number."}`,
      );
    }
    element.removeAttribute("aria-invalid");
    result[id] = element.valueAsNumber;
  }
  return result;
}

function updateUrl(tool) {
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("tool", tool);
  if (tool !== "review") {
    for (const id of fields[tool])
      if (node(id).value !== "") url.searchParams.set(id, node(id).value);
  }
  history.replaceState({ tool }, "", url);
}

function validState(tool) {
  const form = node(forms[tool]);
  form.querySelector(".field-error").textContent = "";
  form
    .querySelectorAll("[aria-invalid]")
    .forEach((element) => element.removeAttribute("aria-invalid"));
}

function flow() {
  const input = values("stormwater");
  const result = rationalFlow(input);
  node("flow-result").innerHTML =
    `${nf(result.litresPerSecond, 2)}<small>L/s</small>`;
  node("flow-secondary").textContent =
    `${nf(result.cubicMetresPerSecond, 5)} m³/s`;
  report.stormwater = `QuickFlow | Rational Method\nC = ${input.coefficient}\nIntensity = ${input.intensity} mm/h\nArea = ${input.area} ha\nQ = C × i × A / 360 = ${result.cubicMetresPerSecond} m³/s\nPeak runoff = ${nf(result.litresPerSecond, 4)} L/s\n\nPreliminary calculation only. Confirm rainfall, method applicability, climate allowances and project requirements. No storage or routing is calculated.`;
}

function grade() {
  const input = values("pipe");
  const result = pipeGrade(input);
  node("grade-result").innerHTML = `${nf(result.percent, 3)}<small>%</small>`;
  document.querySelector(".grade-plot").hidden = false;
  const change =
    result.direction === "level"
      ? "No level difference"
      : `${nf(Math.abs(result.fall), 4)} m ${result.direction}`;
  const ratio = result.ratio === null ? "Level" : `1 in ${nf(result.ratio, 2)}`;
  node("grade-secondary").textContent = `${ratio} · ${change}`;
  node("grade-direction").textContent =
    result.direction === "rise"
      ? "The pipe rises from start to end. Check the entered direction."
      : result.direction === "level"
        ? "The entered levels are equal. No finite 1-in-N ratio."
        : "A positive grade falls from start to end.";
  const y1 =
    result.direction === "rise" ? 110 : result.direction === "level" ? 72 : 35;
  const y2 =
    result.direction === "rise" ? 35 : result.direction === "level" ? 72 : 110;
  node("grade-line").setAttribute("d", `M20 ${y1} 460 ${y2}`);
  node("grade-start").setAttribute("cy", y1);
  node("grade-end").setAttribute("cy", y2);
  report.pipe = `GradeCheck | Pipe grade and fall\nStart invert = ${input.start} m\nEnd invert = ${input.end} m\nHorizontal length = ${input.length} m\nSigned fall = ${result.fall} m\nGrade = ${nf(result.percent, 6)} %\n${ratio}; ${change}\n\nGeometry only. Hydraulic capacity, minimum grades, cover and construction tolerances require separate checks.`;
}

function balance() {
  const input = values("earthworks");
  const result = earthworksBalance(input);
  const deficit = result.balanceBank < 0;
  node("balance-label").textContent = deficit
    ? "Additional material required"
    : result.balanceBank === 0
      ? "Reusable material balanced"
      : "Reusable material surplus";
  node("balance-result").innerHTML =
    `${nf(Math.abs(result.balanceBank), 2)}<small>bank m³</small>`;
  node("balance-secondary").textContent = deficit
    ? "Import requirement in bank-equivalent volume"
    : result.balanceBank === 0
      ? "Available reusable cut equals fill demand"
      : "Surplus after meeting fill demand";
  node("balance-available").textContent = nf(result.availableBank);
  node("balance-required").textContent = nf(result.requiredBank);
  node("balance-unsuitable").textContent = nf(result.unsuitableBank);
  node("balance-export").textContent = nf(result.totalLooseExport);
  report.earthworks = `BalanceCheck | Material balance\nExcavation = ${input.cut} bank m³\nCompacted fill = ${input.fill} compacted m³\nReusable proportion = ${input.reuse}%\nCompacted yield = ${input.yieldFactor} compacted m³/bank m³\nBulking = ${input.bulking} loose m³/bank m³\n\nAvailable reusable cut = ${nf(result.availableBank, 4)} bank m³\nFill requirement = ${nf(result.requiredBank, 4)} bank m³\nReusable surplus (+) / deficit (−) = ${nf(result.balanceBank, 4)} bank m³\nImport requirement = ${nf(result.importBank, 4)} bank-equivalent m³\nUnsuitable cut = ${nf(result.unsuitableBank, 4)} bank m³\nLoose reusable surplus = ${nf(result.looseSurplus, 4)} loose m³\nLoose unsuitable export = ${nf(result.looseUnsuitable, 4)} loose m³\nTotal estimated export = ${nf(result.totalLooseExport, 4)} loose m³\n\nPreliminary single-material balance. Confirm reuse, yield and bulking with appropriate project information. Excludes topsoil, settlement, staging and material-specific factors.`;
}

function review() {
  const text = buildReviewPrompt({
    discipline: node("discipline").value,
    stage: node("stage").value,
    context: node("context").value,
  });
  node("review-output").value = text;
  report.review = text;
}

const calculators = {
  stormwater: flow,
  pipe: grade,
  earthworks: balance,
  review,
};

function calculate(tool, { sync = true, announce = false } = {}) {
  try {
    validState(tool);
    calculators[tool]();
    if (sync) updateUrl(tool);
    if (announce)
      toast(tool === "review" ? "Review brief ready" : "Calculation updated");
    return true;
  } catch (error) {
    const form = node(forms[tool]);
    form.querySelector(".field-error").textContent = error.message;
    report[tool] = null;
    if (tool !== "review") {
      const output = document.querySelector(`[data-panel="${tool}"] output`);
      output.textContent = "—";
      const secondary = document.querySelector(
        `[data-panel="${tool}"] .result-secondary`,
      );
      secondary.textContent = "Enter valid inputs to update this result.";
      if (tool === "pipe") document.querySelector(".grade-plot").hidden = true;
      if (tool === "earthworks") {
        for (const id of [
          "balance-available",
          "balance-required",
          "balance-unsuitable",
          "balance-export",
        ])
          node(id).textContent = "—";
      }
    }
    return false;
  }
}

function restoreInputs(tool) {
  const search = new URLSearchParams(location.search);
  for (const id of fields[tool] || []) {
    const field = node(id);
    const raw = search.get(id);
    field.value =
      raw !== null && raw.trim() !== "" && Number.isFinite(Number(raw))
        ? raw
        : field.defaultValue;
  }
}

function showTool(requested, { push = false, focus = false } = {}) {
  active = names.includes(requested) ? requested : "stormwater";
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== active;
  });
  links.forEach((link) => {
    if (link.dataset.tool === active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.title = `${links.find((link) => link.dataset.tool === active).querySelector("strong").textContent} — Samir Chaulagain`;
  if (push) {
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("tool", active);
    url.hash = "";
    history.pushState({ tool: active }, "", url);
  } else restoreInputs(active);
  calculate(active, { sync: false });
  if (focus)
    document
      .querySelector(`[data-panel="${active}"] h2`)
      .focus({ preventScroll: true });
}

links.forEach((link) =>
  link.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    showTool(link.dataset.tool, { push: true, focus: true });
  }),
);

for (const [tool, id] of Object.entries(forms)) {
  const form = node(id);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!calculate(tool, { announce: true }))
      form.querySelector('[aria-invalid="true"]')?.focus();
  });
  if (tool !== "review") form.addEventListener("input", () => calculate(tool));
  else
    form.addEventListener("input", () => {
      report.review = null;
      node("review-output").value = "";
    });
  form.addEventListener("reset", () =>
    queueMicrotask(() => calculate(tool, { announce: true })),
  );
}

window.addEventListener("popstate", () =>
  showTool(new URLSearchParams(location.search).get("tool")),
);
document.querySelectorAll("[data-copy-link]").forEach((button) =>
  button.addEventListener("click", () => {
    if (calculate(active))
      copyText(location.href, button.closest(".result-panel"));
  }),
);
node("copy-prompt").addEventListener("click", () => {
  if (!report.review) calculate("review");
  copyText(report.review, node("copy-prompt").closest(".result-panel"));
});
document.querySelectorAll("[data-download]").forEach((button) =>
  button.addEventListener("click", () => {
    if (!report[active] && !calculate(active)) return;
    const stamp = new Intl.DateTimeFormat("en-NZ", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Pacific/Auckland",
    }).format(new Date());
    const text = `${report[active]}\n\nSamir Chaulagain | samirchaulagain.com\nGenerated ${stamp} (New Zealand time)\n`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      active === "review"
        ? "samir-review-brief.txt"
        : `samir-${active}-calculation.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(
      active === "review"
        ? "Review brief downloaded"
        : "Calculation downloaded",
    );
  }),
);

showTool(new URLSearchParams(location.search).get("tool"));
