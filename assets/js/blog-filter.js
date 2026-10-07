// /blog/ 글 목록 즉시 찾기: 제목·카테고리·태그에 검색어가 모두 들어 있는 글만 남깁니다.
(function () {
  var input = document.getElementById("post-filter");
  if (!input) return;
  var rows = Array.prototype.slice.call(document.querySelectorAll(".post-row"));
  var years = document.querySelectorAll(".post-year");
  var count = document.getElementById("post-filter-count");
  var empty = document.getElementById("post-filter-empty");

  function apply() {
    var words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    rows.forEach(function (row) {
      var text = row.getAttribute("data-filter");
      var match = words.every(function (w) { return text.indexOf(w) !== -1; });
      row.hidden = !match;
      if (match) shown++;
    });
    years.forEach(function (year) {
      var n = year.querySelectorAll(".post-row:not([hidden])").length;
      year.hidden = n === 0;
      year.querySelector(".post-year__count").textContent = n;
    });
    count.textContent = shown;
    empty.hidden = shown > 0;
  }

  input.addEventListener("input", apply);
  if (input.value) apply(); // 뒤로 가기로 돌아와 입력값이 남아 있을 때
})();
