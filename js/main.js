/* ==========================================================
   Menu di động
   ========================================================== */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  }

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();

/* ==========================================================
   Popup xem ảnh minh chứng
   Mỗi phần tử có thuộc tính data-proof="nhóm" sẽ mở popup.
   Nút Trước/Sau chỉ chuyển trong cùng nhóm
   (chứng chỉ ↔ chứng chỉ, giải thưởng ↔ giải thưởng).
   ========================================================== */
(function () {
  const dialog = document.getElementById("viewer");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const titleEl = document.getElementById("viewer-title");
  const metaEl = document.getElementById("viewer-meta");
  const imgEl = document.getElementById("viewer-img");
  const missingEl = document.getElementById("viewer-missing");
  const pathEl = document.getElementById("viewer-path");
  const countEl = document.getElementById("viewer-count");
  const prevBtn = document.getElementById("viewer-prev");
  const nextBtn = document.getElementById("viewer-next");
  const closeBtn = dialog.querySelector(".viewer__close");

  let list = [];
  let index = 0;

  function show(i) {
    index = (i + list.length) % list.length;
    const item = list[index];
    const src = item.dataset.img;

    titleEl.textContent = item.dataset.title || "";
    metaEl.textContent = item.dataset.meta || "";
    countEl.textContent = index + 1 + " / " + list.length;

    const single = list.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;

    // Đặt lại trạng thái ảnh
    imgEl.hidden = true;
    missingEl.hidden = true;
    imgEl.onload = () => {
      imgEl.hidden = false;
      missingEl.hidden = true;
    };
    imgEl.onerror = () => {
      imgEl.hidden = true;
      pathEl.textContent = src;
      missingEl.hidden = false;
    };
    imgEl.alt = "Ảnh minh chứng: " + (item.dataset.title || "");
    imgEl.src = src;
  }

  function open(trigger) {
    const group = trigger.dataset.proof;
    list = Array.from(document.querySelectorAll('[data-proof="' + group + '"]'));
    document.body.classList.add("is-locked");
    dialog.showModal();
    show(list.indexOf(trigger));
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-proof]");
    if (trigger) open(trigger);
  });

  closeBtn.addEventListener("click", () => dialog.close());
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));

  // Bấm ra vùng tối bên ngoài để đóng
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (e) => {
    if (list.length < 2) return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("is-locked");
    imgEl.removeAttribute("src");
  });
})();
