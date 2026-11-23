/* ======================================================
   صفحه جستجو (search.html)

   بخش ۱ سؤال: با کلیک روی علامت ذره‌بین، باکس سرچ با انیمیشن
               باز می‌شود (تصویر شماره ۱) و با کلیک روی ✕ بسته می‌شود.
   بخش ۲ سؤال: با تایپ نام غذا و فشردن کلید Enter، جستجو در فایل
               داده انجام می‌شود؛ اگر نام غذا (یا بخشی از آن) پیدا شد
               اطلاعات غذا نمایش داده می‌شود، در غیر این صورت عبارت
               «غذایی یافت نشد».
   ====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var bar = document.getElementById("search_bar");
  var toggle = document.getElementById("search_toggle");
  var closeButton = document.getElementById("search_close");
  var input = document.getElementById("search_input");
  var submit = document.getElementById("search_submit");
  var resultSection = document.getElementById("search_result");
  var resultBody = document.getElementById("result_body");

  /* ---------------- باز و بسته کردن باکس جستجو ---------------- */
  function openSearch() {
    bar.classList.add("open");          // انیمیشن باز شدن در CSS
    input.focus();
  }

  function closeSearch() {
    bar.classList.remove("open");
    input.value = "";
    resultSection.classList.remove("show");
  }

  toggle.addEventListener("click", function () {
    if (bar.classList.contains("open")) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  closeButton.addEventListener("click", closeSearch);

  // بستن باکس جستجو با کلید Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSearch();
    }
  });

  /* ---------------- جستجو با کلید Enter ---------------- */
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      doSearch(input.value);
    }
  });

  submit.addEventListener("click", function () {
    doSearch(input.value);
  });

  /* ---------------- عملیات جستجو ---------------- */
  function doSearch(term) {
    var text = term.trim();

    resultSection.classList.add("show");
    resultBody.innerHTML = "";

    if (text === "") {
      resultBody.innerHTML = '<p class="not-found">لطفاً نام غذا را وارد کنید.</p>';
      return;
    }

    var matches = findProducts(text);

    if (matches.length === 0) {
      resultBody.innerHTML = '<p class="not-found">غذایی یافت نشد</p>';
      return;
    }

    for (var i = 0; i < matches.length; i++) {
      resultBody.appendChild(buildResultRow(matches[i]));
    }
  }

  /* ---------------- جستجوی نام غذا در داده‌ها ----------------
     نام کامل یا بخشی از نام غذا (product_name) جستجو می‌شود. */
  function findProducts(term) {
    var groups = getProductGroups();
    var needle = term.toLowerCase();
    var found = [];

    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];

      for (var p = 0; p < group.group_products.length; p++) {
        var product = group.group_products[p];

        if (product.product_name.toLowerCase().indexOf(needle) !== -1) {
          found.push({ group: group, groupIndex: g, product: product, index: p });
        }
      }
    }

    return found;
  }

  /* ---------------- ساخت ردیف نتیجه ----------------
     فقط عکس اول، سایز normal و قیمت همان سایز نمایش داده می‌شود. */
  function buildResultRow(match) {
    var product = match.product;

    // پیدا کردن سایز normal؛ اگر نبود، اولین سایز موجود
    var typeIndex = product.product_type.indexOf("normal");
    if (typeIndex === -1) {
      typeIndex = 0;
    }

    var type = product.product_type[typeIndex];
    var price = product.product_price[typeIndex];

    var row = document.createElement("div");
    row.className = "result-row";

    // عکس اول محصول
    var imageBox = document.createElement("div");
    imageBox.className = "result-row__img";
    setImageWithFallback(imageBox, product.product_image[0],
      GROUP_ICONS[match.group.group_title] || "🍽");

    // نام غذا
    var name = document.createElement("div");
    name.className = "result-row__name";
    name.textContent = product.product_name;

    // سایز
    var size = document.createElement("div");
    size.className = "result-row__type";
    size.textContent = type;

    // قیمت همان سایز
    var priceBox = document.createElement("div");
    priceBox.className = "result-row__price";
    priceBox.textContent = toPersianNumber(price) + " تومان";

    row.appendChild(imageBox);
    row.appendChild(name);
    row.appendChild(size);
    row.appendChild(priceBox);

    return row;
  }
});
