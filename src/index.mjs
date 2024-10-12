// chuhaiList.jsからチューハイリストをインポート
import { chuhaiList } from "./chuhaiList.mjs";

// ブランドフィルターの初期化
function initializeBrandFilter() {
  console.log("initializeBrandFilter is called"); // 関数が呼ばれているか確認
  const brandSelect = document.getElementById("brand");
  const brands = [
    ...new Set(chuhaiList.map((chuhai) => chuhai.brand.toLowerCase())),
  ];
  console.log(brands);

  brandSelect.innerHTML =
    '<option value="">全てのブランド</option>' +
    brands
      .map((brand) => {
        // ブランド名に含まれる特殊文字や HTML タグをエスケープ
        const escapedBrand = brand
          .replace(/&/g, "&")
          .replace(/</g, "<")
          .replace(/>/g, ">");
        return `<option value="${brand}">${escapedBrand}</option>`;
      })
      .join("");
}

// アルコール度数のラベルを更新
function updateAlcoholLabel(id) {
  const value = document.getElementById(id).value;
  document.getElementById(id + "Value").textContent = value;
}

// フィルター機能
function filterChuhai() {
  const brand = document.getElementById("brand").value;
  const sugarContent = document.getElementById("sugarContent").value;
  const minAlcohol = parseInt(document.getElementById("minAlcohol").value);
  const maxAlcohol = parseInt(document.getElementById("maxAlcohol").value);
  const searchTerm = document.getElementById("searchTerm").value.toLowerCase();

  const filteredList = chuhaiList.filter(
    (chuhai) =>
      (!brand || chuhai.brand === brand) &&
      (!sugarContent || chuhai.sugarContent === sugarContent) &&
      chuhai.alcohol >= minAlcohol &&
      chuhai.alcohol <= maxAlcohol &&
      (searchTerm === "" ||
        chuhai.name.toLowerCase().includes(searchTerm) ||
        chuhai.description.toLowerCase().includes(searchTerm))
  );

  displayResults(filteredList);
}

// 結果を表示
function displayResults(results) {
  const resultCount = document.getElementById("resultCount");
  const chuhaiListElement = document.getElementById("chuhaiList");

  resultCount.textContent = results.length;
  chuhaiListElement.innerHTML = results
    .map(
      (chuhai) => `
    <li>
      <h3>${chuhai.name}</h3>
      <p>ブランド: ${chuhai.brand}</p>
      <p>アルコール度数: ${chuhai.alcohol}%</p>
      <p>容量: ${chuhai.volume}</p>
      <p>糖分: ${chuhai.sugarContent}</p>
      <p>${chuhai.description}</p>
    </li>
  `
    )
    .join("");
}

// タブ切り替え機能
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    // すべてのタブとコンテンツのアクティブクラスをリセット
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    // 現在のタブをアクティブ化
    tab.classList.add("active");

    // 対応するコンテンツを表示（nullチェック付き）
    const targetContent = document.getElementById(target);
    if (targetContent) {
      targetContent.classList.add("active");
    } else {
      console.error(`No element found with id: ${target}`);
    }
  });
});

// DOMコンテンツの読み込み後に初期化
document.addEventListener("DOMContentLoaded", () => {
  console.log(chuhaiList); // chuhaiList.mjsの内容が読み込まれているか確認
  initializeBrandFilter();
  filterChuhai();

  document.getElementById("brand").addEventListener("change", filterChuhai);
  document
    .getElementById("sugarContent")
    .addEventListener("change", filterChuhai);
  document.getElementById("minAlcohol").addEventListener("input", () => {
    updateAlcoholLabel("minAlcohol");
    filterChuhai();
  });
  document.getElementById("maxAlcohol").addEventListener("input", () => {
    updateAlcoholLabel("maxAlcohol");
    filterChuhai();
  });
  document.getElementById("searchTerm").addEventListener("input", filterChuhai);
});
