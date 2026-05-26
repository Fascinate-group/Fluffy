const castProfiles = {
  15: { name: "ゆうじ", generation: "1期生", file: "images/cast/15_ゆうじ.png" },
  21: { name: "ねこたちこ", generation: "2期生", file: "images/cast/21_ねこたちこ.png" },
  22: { name: "らんぷ", generation: "2期生", file: "images/cast/22_らんぷ.png" },
  23: { name: "なお", generation: "2期生", file: "images/cast/23_なお.png" },
  24: { name: "うさみみか", generation: "2期生", file: "images/cast/24_うさみみか.png" },
  31: { name: "ねむ", generation: "3期生", file: "images/cast/31_ねむ.png" },
  32: { name: "あるな", generation: "3期生", file: "images/cast/32_あるな.png" },
  33: { name: "めーら", generation: "3期生", file: "images/cast/33_めーら.png" },
  34: { name: "こうめ", generation: "3期生", file: "images/cast/34_こうめ.png" },
  35: { name: "ゆゆ", generation: "3期生", file: "images/cast/35_ゆゆ.png" },
  36: { name: "ほしのすず", generation: "3期生", file: "images/cast/36_ほしのすず.png" },
  37: { name: "さんださよ", generation: "3期生", file: "images/cast/37_さんださよ.png" },
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
  meta.textContent = `${profile.generation} / No.${id}`;
  caption.append(meta, profile.name);

  figure.append(image, caption);
  return figure;
};

if (!rawIds || ids.length === 0) {
  const empty = document.createElement("div");
  empty.className = "cast-empty";

  const title = document.createElement("p");
  title.className = "small-title";
  title.textContent = "キャスト番号を指定してください";

  const example = document.createElement("p");
  example.append("例: ");
  const code = document.createElement("code");
  code.textContent = "cast-select.html?casts=15,21,31";
  example.append(code);

  empty.append(title, example);
  summary.append(empty);
} else {
  const result = document.createElement("p");
  const count = document.createElement("strong");
  count.textContent = String(knownCasts.length);
  result.append(count, "件のキャスト画像を表示しています。");
  summary.append(result);

  if (unknownIds.length > 0) {
    const warning = document.createElement("p");
    warning.className = "cast-warning";
    warning.textContent = `未登録の番号: ${unknownIds.join(", ")}`;
    summary.append(warning);
  }

  grid.append(...knownCasts.map(createCard));
}
