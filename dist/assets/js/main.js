document.documentElement.classList.remove("no-js");

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const header = document.querySelector(".site-header");

function setMenu(open, restoreFocus = false) {
  if (!menu || !navigation) return;
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  navigation.classList.toggle("is-open", open);
  if (restoreFocus) menu.focus();
}

menu?.addEventListener("click", () =>
  setMenu(menu.getAttribute("aria-expanded") !== "true"),
);
navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.getAttribute("aria-expanded") === "true")
    setMenu(false, true);
});
document.addEventListener("click", (event) => {
  if (
    menu?.getAttribute("aria-expanded") === "true" &&
    !header.contains(event.target)
  )
    setMenu(false);
});
navigation?.addEventListener("focusout", (event) => {
  if (
    menu?.getAttribute("aria-expanded") === "true" &&
    !navigation.contains(event.relatedTarget) &&
    event.relatedTarget !== menu
  )
    setMenu(false);
});
const desktop = window.matchMedia("(min-width: 641px)");
desktop.addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

// One passive listener; no scroll-bound layout measurements or animation loops.
let scrolled = null;
function updateHeader() {
  const next = window.scrollY > 20;
  if (next !== scrolled) {
    header?.classList.toggle("is-scrolled", next);
    scrolled = next;
  }
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Keep useful old section links working after the move to separate pages.
const oldSections = {
  "#engineering": "/work/engineering/",
  "#community": "/work/community/",
  "#innovation": "/lab/",
  "#journey": "/about/#career-title",
  "#gallery": "/about/",
};
if (location.pathname === "/" && oldSections[location.hash])
  location.replace(oldSections[location.hash]);

// Disclosure state can be linked, copied and restored with browser back/forward.
const career = [...document.querySelectorAll(".career-list details")];
career.forEach((detail, index) => {
  detail.addEventListener("toggle", () => {
    const url = new URL(location.href);
    const expanded = career
      .map((item, i) => (item.open ? i : null))
      .filter((i) => i !== null);
    url.searchParams.set("career", expanded.join(","));
    history.replaceState(null, "", url);
  });
});
const expanded = new URLSearchParams(location.search).get("career");
if (expanded !== null) {
  const selected = expanded.split(",");
  career.forEach((detail, i) => {
    detail.open = selected.includes(String(i));
  });
}

let toastTimer;
export function toast(message) {
  const target = document.querySelector("#toast");
  if (!target) return;
  target.textContent = message;
  target.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => target.classList.remove("is-visible"), 3200);
}

export async function copyText(value, fallbackContainer) {
  try {
    await navigator.clipboard.writeText(value);
    toast("Copied to clipboard");
    return true;
  } catch {
    // Clipboard permission can be unavailable. Provide a selectable value instead.
    let input = fallbackContainer?.querySelector(".share-fallback");
    if (!input && fallbackContainer) {
      input = document.createElement("textarea");
      input.className = "share-fallback";
      input.readOnly = true;
      input.rows = value.includes("\n") ? 7 : 2;
      input.setAttribute("aria-label", "Select this text and copy it");
      fallbackContainer.append(input);
    }
    if (input) {
      input.value = value;
      input.focus();
      input.select();
    }
    toast("Select the text, then use your device’s copy command");
    return false;
  }
}
