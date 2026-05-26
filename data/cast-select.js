const castProfiles = {
  11: { name: "さき", generation: "1期生", className: "赤組さん", file: "images/cast/11_1_さき.png" },
  12: { name: "はるかぜぽるん", generation: "1期生", className: "赤組さん", file: "images/cast/12_1_はるかぜぽるん.png" },
  13: { name: "うされいな", generation: "1期生", className: "黄組さん", file: "images/cast/13_2_うされいな.png" },
  14: { name: "こむ", generation: "1期生", className: "赤組さん", file: "images/cast/14_1_こむ.png" },
  15: { name: "とやうじゆうじ", generation: "1期生", className: "青組さん", file: "images/cast/15_3_とやうじゆうじ.png" },
  16: { name: "てすと", generation: "1期生", className: "黄組さん", file: "images/cast/16_2_てすと.png" },
  17: { name: "こひないちご", generation: "1期生", className: "黄組さん", file: "images/cast/17_2_こひないちご.png" },
  18: { name: "をみ", generation: "1期生", className: "黄組さん", file: "images/cast/18_2_をみ.png" },
  21: { name: "ねこたちこ", generation: "2期生", className: "黄組さん", file: "images/cast/21_2_ねこたちこ.png" },
  22: { name: "らんぷ", generation: "2期生", className: "黄組さん", file: "images/cast/22_2_らんぷ.png" },
  23: { name: "なお", generation: "2期生", className: "青組さん", file: "images/cast/23_3_なお.png" },
  24: { name: "うさみみか", generation: "2期生", className: "赤組さん", file: "images/cast/24_1_うさみみか.png" },
  31: { name: "ねむ", generation: "3期生", className: "青組さん", file: "images/cast/31_3_ねむ.png" },
  32: { name: "あるな", generation: "3期生", className: "青組さん", file: "images/cast/32_3_あるな.png" },
  33: { name: "めーら", generation: "3期生", className: "赤組さん", file: "images/cast/33_1_めーら.png" },
  34: { name: "こうめ", generation: "3期生", className: "黄組さん", file: "images/cast/34_2_こうめ.png" },
  35: { name: "ゆゆ", generation: "3期生", className: "黄組さん", file: "images/cast/35_2_ゆゆ.png" },
  36: { name: "ほしのすず", generation: "3期生", className: "赤組さん", file: "images/cast/36_1_ほしのすず.png" },
  37: { name: "さんださよ", generation: "3期生", className: "青組さん", file: "images/cast/37_3_さんださよ.png" },
};

const summary = document.querySelector("#cast-result-summary");
const grid = document.querySelector("#cast-selected-grid");
const query = new URLSearchParams(window.location.search);
const rawIds =
  query.get("casts") ||
  query.get("cast") ||
  query.get("ids") ||
  query.get("c") ||
  window.location.search.replace(/^\?/, "");

const ids = rawIds
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const selectedCasts = ids.map((id) => ({ id, profile: castProfiles[id] }));
const knownCasts = selectedCasts.filter(({ profile }) => profile);
const unknownIds = selectedCasts.filter(({ profile }) => !profile).map(({ id }) => id);

const createCard = ({ id, profile }) => {
  const figure = document.createElement("figure");
  figure.className = "cast-profile-card cast-selected-card";

  const image = document.createElement("img");
  image.src = profile.file;
  image.alt = `${profile.name}のキャラクター紹介`;
  image.loading = "lazy";

  const caption = document.createElement("figcaption");
  const meta = document.createElement("span");
  meta.textContent = `${profile.generation} ${profile.className}`;
  caption.append(meta, profile.name);

  figure.append(image, caption);
  return figure;
};

if (!rawIds || ids.length === 0) {
  const empty = document.createElement("div");
  empty.className = "cast-empty";

  const title = document.createElement("p");
  title.className = "small-title";
  title.textContent = "当日遊んでいただく当保育園の園児たちを準備中です";

  const note = document.createElement("p");
  note.textContent = "案内されたURLからもう一度開いてください。";

  empty.append(title, note);
  summary.append(empty);
} else {
  const result = document.createElement("p");
  const count = document.createElement("strong");
  count.textContent = String(knownCasts.length);
  result.append("当日遊んでいただく当保育園の園児たち: ", count, "名");
  summary.append(result);

  if (unknownIds.length > 0) {
    const warning = document.createElement("p");
    warning.className = "cast-warning";
    warning.textContent = "表示できない園児が含まれています。";
    summary.append(warning);
  }

  grid.append(...knownCasts.map(createCard));
}
