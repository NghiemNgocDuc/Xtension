document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("api");
  const btn = document.getElementById("save");

  chrome.storage.local.get("elevenLabsKey", (data) => {
    if (data && data.elevenLabsKey) input.value = data.elevenLabsKey;
  });

  btn.addEventListener("click", () => {
    const k = input.value.trim();
    chrome.storage.local.set({ elevenLabsKey: k }, () => {
      btn.textContent = "Saved";
      setTimeout(() => btn.textContent = "Save", 1000);
    });
  });
});
