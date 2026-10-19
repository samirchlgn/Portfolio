import test from "node:test";
import assert from "node:assert/strict";
import {
  rationalFlow,
  pipeGrade,
  earthworksBalance,
  buildReviewPrompt,
} from "../public/assets/js/calculations.js";
const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≠ ${expected}`);

test("Rational Method converts hectares and mm/h to the correct flow units", () => {
  const result = rationalFlow({ coefficient: 0.9, intensity: 100, area: 1 });
  close(result.cubicMetresPerSecond, 0.25);
  close(result.litresPerSecond, 250);
  close(
    rationalFlow({ coefficient: 1, intensity: 1, area: 1 }).litresPerSecond,
    1000 / 360,
  );
});
test("Rational Method handles zero and rejects impossible inputs", () => {
  assert.equal(
    rationalFlow({ coefficient: 0, intensity: 75, area: 2 }).litresPerSecond,
    0,
  );
  for (const input of [
    { coefficient: 1.1, intensity: 75, area: 1 },
    { coefficient: -0.1, intensity: 75, area: 1 },
    { coefficient: 0.5, intensity: -1, area: 1 },
    { coefficient: 0.5, intensity: 75, area: -1 },
    { coefficient: 0.5, intensity: NaN, area: 1 },
    { coefficient: 0.5, intensity: 75, area: Infinity },
  ])
    assert.throws(() => rationalFlow(input), RangeError);
});
test("GradeCheck distinguishes falling, rising and level pipes", () => {
  const fall = pipeGrade({ start: 15.25, end: 14, length: 100 });
  close(fall.fall, 1.25);
  close(fall.percent, 1.25);
  close(fall.ratio, 80);
  assert.equal(fall.direction, "fall");
  const rise = pipeGrade({ start: 14, end: 15.25, length: 100 });
  close(rise.percent, -1.25);
  close(rise.ratio, 80);
  assert.equal(rise.direction, "rise");
  const level = pipeGrade({ start: 14, end: 14, length: 100 });
  assert.equal(level.ratio, null);
  assert.equal(level.direction, "level");
});
test("GradeCheck allows negative datums but rejects zero length and non-finite levels", () => {
  close(pipeGrade({ start: -2, end: -3, length: 50 }).percent, 2);
  assert.throws(() => pipeGrade({ start: 1, end: 0, length: 0 }), RangeError);
  assert.throws(
    () => pipeGrade({ start: Infinity, end: 0, length: 50 }),
    RangeError,
  );
});
test("BalanceCheck does not compare compacted and bank volumes directly", () => {
  const r = earthworksBalance({
    cut: 1200,
    fill: 900,
    reuse: 90,
    yieldFactor: 0.9,
    bulking: 1.2,
  });
  close(r.availableBank, 1080);
  close(r.requiredBank, 1000);
  close(r.balanceBank, 80);
  close(r.looseSurplus, 96);
  close(r.unsuitableBank, 120);
  close(r.looseUnsuitable, 144);
  close(r.totalLooseExport, 240);
});
test("BalanceCheck handles import demand, unsuitable export and exact balance", () => {
  const r = earthworksBalance({
    cut: 500,
    fill: 900,
    reuse: 80,
    yieldFactor: 0.9,
    bulking: 1.2,
  });
  close(r.importBank, 600);
  close(r.looseSurplus, 0);
  close(r.totalLooseExport, 120);
  const zero = earthworksBalance({
    cut: 1000,
    fill: 900,
    reuse: 100,
    yieldFactor: 0.9,
    bulking: 1.2,
  });
  assert.equal(zero.balanceBank, 0);
  assert.equal(zero.totalLooseExport, 0);
  const none = earthworksBalance({
    cut: 500,
    fill: 900,
    reuse: 0,
    yieldFactor: 0.9,
    bulking: 1.2,
  });
  close(none.importBank, 1000);
  close(none.totalLooseExport, 600);
});
test("BalanceCheck rejects invalid volume and factor combinations", () => {
  const base = {
    cut: 500,
    fill: 900,
    reuse: 80,
    yieldFactor: 0.9,
    bulking: 1.2,
  };
  for (const patch of [
    { cut: -1 },
    { fill: -1 },
    { reuse: 101 },
    { reuse: -1 },
    { yieldFactor: 0 },
    { bulking: 0.9 },
    { cut: NaN },
  ])
    assert.throws(() => earthworksBalance({ ...base, ...patch }), RangeError);
});
test("Review briefs are discipline-specific and preserve human verification", () => {
  const r = buildReviewPrompt({
    discipline: "Stormwater",
    stage: "Detailed design",
    context: "Check the outlet assumption.",
  });
  assert.match(r, /Check the outlet assumption/);
  assert.match(r, /retention, detention/);
  assert.match(r, /Do not certify compliance/);
  assert.match(r, /Do not invent clause numbers/);
  const water = buildReviewPrompt({
    discipline: "Water supply",
    stage: "Concept design",
  });
  assert.match(water, /Backflow risk/);
  assert.match(water, /context to be supplied/);
  assert.throws(
    () =>
      buildReviewPrompt({ discipline: "invented", stage: "Concept design" }),
    RangeError,
  );
  assert.throws(
    () => buildReviewPrompt({ discipline: "Stormwater", stage: "invented" }),
    RangeError,
  );
});
