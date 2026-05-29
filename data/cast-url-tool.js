const castProfiles = [
  { id: "11", name: "さき", generation: "1期生", className: "赤組さん（年少組）", file: "images/cast/11_1_さき.png" },
  { id: "12", name: "はるかぜぽるん", generation: "1期生", className: "赤組さん（年少組）", file: "images/cast/12_1_はるかぜぽるん.png" },
  { id: "13", name: "うされいな", generation: "1期生", className: "黄組さん（年中組）", file: "images/cast/13_2_うされいな.png" },
  { id: "14", name: "こむ", generation: "1期生", className: "赤組さん（年少組）", file: "images/cast/14_1_こむ.png" },
  { id: "15", name: "とやうじゆうじ", generation: "1期生", className: "青組さん（年長組）", file: "images/cast/15_3_とやうじゆうじ.png" },
  { id: "16", name: "てすと", generation: "1期生", className: "黄組さん（年中組）", file: "images/cast/16_2_てすと.png" },
  { id: "17", name: "こひないちご", generation: "1期生", className: "黄組さん（年中組）", file: "images/cast/17_2_こひないちご.png" },
  { id: "18", name: "をみ", generation: "1期生", className: "黄組さん（年中組）", file: "images/cast/18_2_をみ.png" },
  { id: "21", name: "ねこたちこ", generation: "2期生", className: "黄組さん（年中組）", file: "images/cast/21_2_ねこたちこ.png" },
  { id: "22", name: "らんぷ", generation: "2期生", className: "黄組さん（年中組）", file: "images/cast/22_2_らんぷ.png" },
  { id: "23", name: "なお", generation: "2期生", className: "青組さん（年長組）", file: "images/cast/23_3_なお.png" },
  { id: "24", name: "うさみみか", generation: "2期生", className: "赤組さん（年少組）", file: "images/cast/24_1_うさみみか.png" },
  { id: "31", name: "ねむ", generation: "3期生", className: "青組さん（年長組）", file: "images/cast/31_3_ねむ.png" },
  { id: "32", name: "あるな", generation: "3期生", className: "青組さん（年長組）", file: "images/cast/32_3_あるな.png" },
  { id: "33", name: "めーら", generation: "3期生", className: "赤組さん（年少組）", file: "images/cast/33_1_めーら.png" },
  { id: "34", name: "こうめ", generation: "3期生", className: "黄組さん（年中組）", file: "images/cast/34_2_こうめ.png" },
  { id: "35", name: "ゆゆ", generation: "3期生", className: "黄組さん（年中組）", file: "images/cast/35_2_ゆゆ.png" },
  { id: "36", name: "ほしのすず", generation: "3期生", className: "赤組さん（年少組）", file: "images/cast/36_1_ほしのすず.png" },
  { id: "37", name: "さんださよ", generation: "3期生", className: "青組さん（年長組）", file: "images/cast/37_3_さんださよ.png" },
];

const grid = document.querySelector("#cast-tool-grid");
const output = document.querySelector("#cast-url-output");
const copyButton = document.querySelector("#copy-cast-url");
const openLink = document.querySelector("#open-cast-url");
const selectAllButton = document.querySelector("#select-all-casts");
const clearButton = document.querySelector("#clear-casts");
const copyStatus = document.querySelector("#cast-copy-status");
const query = new URLSearchParams(window.location.search);
const initialIds = (query.get("casts") || query.get("cast") || query.get("ids") || query.get("c") || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const getSelectUrl = (ids) => {
  const url = new URL("cast-select.html", window.location.href);
  return ids.length > 0 ? `${url.href}?casts=${ids.join(",")}` : url.href;
};

const getCheckedIds = () =>
  Array.from(document.querySelectorAll(".cast-tool-card input:checked")).map((input) => input.value);

const updateUrl = () => {
  const ids = getCheckedIds();
  const url = getSelectUrl(ids);
  output.value = url;
  openLink.href = url;
  copyStatus.textContent = ids.length > 0 ? `${ids.length}名を選択中です。` : "キャストを選択してください。";
};

const createCard = ({ id, name, generation, className, file }) => {
  const label = document.createElement("label");
  label.className = "cast-tool-card";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = id;
  checkbox.addEventListener("change", updateUrl);

  const image = document.createElement("img");
  image.src = file;
  image.alt = `${name}のキャラクター紹介`;
  image.loading = "lazy";

  const text = document.createElement("span");
  text.className = "cast-tool-name";
  const meta = document.createElement("small");
  meta.textContent = `${className} / No.${id}`;
  text.append(meta, name);

  label.append(checkbox, image, text);
  return label;
};

grid.append(...castProfiles.map(createCard));
document.querySelectorAll(".cast-tool-card input").forEach((input) => {
  input.checked = initialIds.includes(input.value);
});
updateUrl();

selectAllButton?.addEventListener("click", () => {
  document.querySelectorAll(".cast-tool-card input").forEach((input) => {
    input.checked = true;
  });
  updateUrl();
});

clearButton?.addEventListener("click", () => {
  document.querySelectorAll(".cast-tool-card input").forEach((input) => {
    input.checked = false;
  });
  updateUrl();
});

copyButton?.addEventListener("click", async () => {
  output.select();
  output.setSelectionRange(0, output.value.length);

  try {
    await navigator.clipboard.writeText(output.value);
    copyStatus.textContent = "URLをコピーしました。";
  } catch {
    document.execCommand("copy");
    copyStatus.textContent = "URLをコピーしました。";
  }
});
