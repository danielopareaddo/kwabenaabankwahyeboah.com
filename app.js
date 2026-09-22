const menu = document.querySelector(".menu"),
  nav = document.querySelector("nav");
const hero = document.querySelector(".hero"),
  rebuildMessage = document.querySelector(".candidate-message"),
  principles = document.querySelector(".principles"),
  unityPanel = principles?.querySelector("article"),
  campaignBanner = document.querySelector(".ticker");
if (hero && principles && unityPanel && rebuildMessage && campaignBanner) {
  const unitySection = document.createElement("section");
  unitySection.className = "principles principle-single";
  unitySection.setAttribute("aria-label", "Unity");
  unitySection.append(unityPanel);
  campaignBanner.after(unitySection);
  principles.prepend(rebuildMessage);
}
menu.onclick = () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
};
nav.querySelectorAll("a").forEach(
  (a) =>
    (a.onclick = () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    }),
);
const reveal = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        reveal.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal,.principles article,.about,.quote")
  .forEach((el) => reveal.observe(el));
const thumbs = [...document.querySelectorAll(".carousel-thumbs button")],
  stage = document.querySelector(".carousel-image"),
  stageImg = stage?.querySelector("img"),
  caption = stage?.querySelector(".slide-caption"),
  number = document.querySelector(".slide-count b");
let slide = 0,
  timer;
function go(i, user = false) {
  if (!thumbs.length) return;
  slide = (i + thumbs.length) % thumbs.length;
  const t = thumbs[slide];
  stageImg.classList.add("changing");
  setTimeout(() => {
    stageImg.src = "assets/" + t.dataset.src;
    stageImg.alt = t.dataset.caption;
    caption.textContent = t.dataset.caption;
    number.textContent = String(slide + 1).padStart(2, "0");
    thumbs.forEach((x, j) => x.classList.toggle("active", j === slide));
    const strip = t.parentElement;
    const target = t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    stageImg.classList.remove("changing");
  }, 180);
  if (user) restart();
}
thumbs.forEach((t, i) => (t.onclick = () => go(i, true)));
document
  .querySelector(".carousel-arrow.previous")
  ?.addEventListener("click", () => go(slide - 1, true));
document
  .querySelector(".carousel-arrow.next")
  ?.addEventListener("click", () => go(slide + 1, true));
function restart() {
  clearInterval(timer);
  timer = setInterval(() => go(slide + 1), 6000);
}
restart();
document
  .querySelector(".carousel")
  ?.addEventListener("mouseenter", () => clearInterval(timer));
document.querySelector(".carousel")?.addEventListener("mouseleave", restart);
const dialog = document.querySelector("dialog");
function openLightbox(src, text) {
  dialog.querySelector("img").src = src;
  dialog.querySelector("img").alt = text;
  dialog.querySelector("p").textContent = text;
  dialog.showModal();
}
stage?.addEventListener("click", () =>
  openLightbox(stageImg.src, caption.textContent),
);
document
  .querySelectorAll(".material-cards button")
  .forEach(
    (b) =>
      (b.onclick = () =>
        openLightbox(
          b.querySelector("img").src,
          b.querySelector("span").textContent.replace(" ↗", ""),
        )),
  );
dialog.querySelector(".close").onclick = () => dialog.close();
document.querySelector("#prev").onclick = () => {
  go(slide - 1, true);
  openLightbox(stageImg.src, caption.textContent);
};
document.querySelector("#next").onclick = () => {
  go(slide + 1, true);
  openLightbox(stageImg.src, caption.textContent);
};
dialog.onclick = (e) => {
  if (e.target === dialog) dialog.close();
};
dialog.onkeydown = (e) => {
  if (e.key === "ArrowRight") document.querySelector("#next").click();
  if (e.key === "ArrowLeft") document.querySelector("#prev").click();
};
