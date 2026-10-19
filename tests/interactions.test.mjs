import test from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import labPage from "../src/pages/lab.mjs";

test("Lab interactions, URL state, clipboard, downloads and mobile menu semantics", async (t) => {
  const window = new Window({
    url: "https://samirchaulagain.com/lab/?tool=pipe&start=14&end=15.25&length=100",
    width: 390,
    height: 844,
    settings: {
      enableJavaScriptEvaluation: false,
      disableJavaScriptFileLoading: true,
      disableCSSFileLoading: true,
    },
  });
  const { document } = window;
  document.write(labPage());
  // Happy DOM treats download anchors as navigation; native browsers download them.
  document.addEventListener("click", (event) => {
    if (event.target.closest("a[download]")) event.preventDefault();
  });
  for (const [key, value] of Object.entries({
    window,
    document,
    location: window.location,
    history: window.history,
  }))
    globalThis[key] = value;
  Object.defineProperty(globalThis, "navigator", {
    value: window.navigator,
    configurable: true,
  });
  let clipboard = "";
  let download;
  Object.defineProperty(window.navigator, "clipboard", {
    value: {
      writeText: async (text) => {
        clipboard = text;
      },
    },
    configurable: true,
  });
  const oldCreate = URL.createObjectURL,
    oldRevoke = URL.revokeObjectURL;
  URL.createObjectURL = (blob) => {
    download = blob;
    return "blob:https://samirchaulagain.com/test-report";
  };
  URL.revokeObjectURL = () => {};
  t.after(async () => {
    URL.createObjectURL = oldCreate;
    URL.revokeObjectURL = oldRevoke;
    await window.happyDOM.close();
  });
  await import("../public/assets/js/lab.js");
  const byId = (id) => document.getElementById(id);
  const select = (tool) =>
    document.querySelector(`[data-tool="${tool}"]`).dispatchEvent(
      new window.MouseEvent("click", {
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
  const input = (id, value) => {
    byId(id).value = String(value);
    byId(id).dispatchEvent(new window.Event("input", { bubbles: true }));
  };
  const submit = (id) =>
    byId(id).dispatchEvent(
      new window.Event("submit", { bubbles: true, cancelable: true }),
    );
  const tick = () => new Promise((resolve) => setImmediate(resolve));

  await t.test("Initial deep link restores a rising pipe and its sign", () => {
    assert.equal(document.querySelector('[data-panel="pipe"]').hidden, false);
    assert.equal(byId("grade-result").textContent, "-1.25%");
    assert.match(byId("grade-direction").textContent, /rises/);
    assert.equal(
      document.querySelector('[data-tool="pipe"]').getAttribute("aria-current"),
      "page",
    );
  });
  await t.test("Switching tools updates URL, selection and focus", () => {
    select("stormwater");
    assert.equal(window.location.search, "?tool=stormwater");
    assert.equal(document.activeElement.id, "flow-title");
    assert.equal(document.querySelector('[data-panel="pipe"]').hidden, true);
    assert.equal(
      document.querySelector('[data-panel="stormwater"]').hidden,
      false,
    );
  });
  await t.test(
    "Numeric edits recalculate, reject invalid input and recover",
    () => {
      input("coefficient", 0.9);
      input("intensity", 100);
      input("area", 1);
      assert.equal(byId("flow-result").textContent, "250L/s");
      assert.equal(
        new URL(window.location.href).searchParams.get("coefficient"),
        "0.9",
      );
      input("coefficient", 2);
      assert.equal(byId("flow-result").textContent, "—");
      assert.equal(byId("coefficient").getAttribute("aria-invalid"), "true");
      assert.notEqual(
        byId("flow-form").querySelector(".field-error").textContent,
        "",
      );
      input("coefficient", 0.9);
      assert.equal(byId("flow-result").textContent, "250L/s");
      assert.equal(
        byId("flow-form").querySelector(".field-error").textContent,
        "",
      );
    },
  );
  await t.test(
    "Copy link and calculation download reflect the entered values",
    async () => {
      document
        .querySelector('[data-panel="stormwater"] [data-copy-link]')
        .click();
      await tick();
      assert.match(clipboard, /coefficient=0.9/);
      assert.match(clipboard, /intensity=100/);
      document
        .querySelector('[data-panel="stormwater"] [data-download]')
        .click();
      await tick();
      assert.match(await download.text(), /Peak runoff = 250 L\/s/);
    },
  );
  await t.test(
    "Earthworks keeps volume bases distinct and clears invalid stats",
    () => {
      select("earthworks");
      assert.equal(byId("balance-export").textContent, "240");
      input("cut", 500);
      input("reuse", 80);
      assert.equal(byId("balance-result").textContent, "600bank m³");
      assert.match(byId("balance-label").textContent, /required/);
      assert.equal(byId("balance-export").textContent, "120");
      input("yieldFactor", 0);
      assert.equal(byId("balance-result").textContent, "—");
      assert.equal(byId("balance-export").textContent, "—");
      input("yieldFactor", 0.9);
      assert.equal(byId("balance-export").textContent, "120");
    },
  );
  await t.test(
    "Review generation is local and context stays out of the URL",
    async () => {
      select("review");
      input("context", "Check the proposed outlet assumption.");
      submit("review-form");
      assert.match(
        byId("review-output").value,
        /Check the proposed outlet assumption/,
      );
      assert.match(byId("review-output").value, /Do not certify compliance/);
      assert.equal(window.location.search, "?tool=review");
      byId("copy-prompt").click();
      await tick();
      assert.match(clipboard, /Check the proposed outlet assumption/);
    },
  );
  await t.test(
    "Clipboard denial offers a selectable multiline brief",
    async () => {
      window.navigator.clipboard.writeText = async () => {
        throw new Error("Clipboard unavailable");
      };
      byId("copy-prompt").click();
      await tick();
      const fallback = document.querySelector(".share-fallback");
      assert.equal(fallback.tagName, "TEXTAREA");
      assert.equal(fallback.value, byId("review-output").value);
      assert.match(fallback.value, /\nFOCUS AREAS\n/);
    },
  );

  await t.test("Popstate restores the active tool and numeric values", () => {
    window.history.pushState(
      {},
      "",
      "/lab/?tool=pipe&start=15&end=14&length=100",
    );
    window.dispatchEvent(new window.PopStateEvent("popstate"));
    assert.equal(byId("grade-result").textContent, "1%");
    assert.match(byId("grade-secondary").textContent, /1 in 100/);
  });
  await t.test(
    "Menu button and Escape maintain expanded state and return focus",
    () => {
      const menu = document.querySelector(".menu-toggle");
      menu.click();
      assert.equal(menu.getAttribute("aria-expanded"), "true");
      document.dispatchEvent(
        new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      assert.equal(menu.getAttribute("aria-expanded"), "false");
      assert.equal(document.activeElement, menu);
      assert.equal(document.documentElement.classList.contains("no-js"), false);
    },
  );
});
