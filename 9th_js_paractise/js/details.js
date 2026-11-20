/* ======================================================
   صفحه جزئیات غذا (food_details.html)

   - نمایش نام محصول، مواد تشکیل‌دهنده، عکس‌ها و قیمت هر سایز با
     تخفیف گروه (ادامه تمرین قبل).
   - تمرین ۶: برای هر سایز از هر محصول یک دکمه «افزودن» وجود دارد که
     آن سایز را به سبد خرید (Local Storage) اضافه می‌کند.
   ====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var query = getQueryParams();          // ?group=..&product=..
  var groups = getProductGroups();

  var group = groups[query.group];
  var product = group ? group.group_products[query.product] : null;

  if (!product) {
    document.querySelector(".details-grid").innerHTML =
      '<p class="error-box">محصولی با آدرس «?group=' + query.group +
      "&product=" + query.product + "» پیدا نشد.</p>";
    return;
  }

  var discount = getGroupDiscount(group, query.group);
  var icon = GROUP_ICONS[group.group_title] || "🍽";

  /* ---------- نام محصول در سه قسمت ---------- */
  document.title = product.product_name;
  document.getElementById("food_title").textContent = product.product_name;
  document.getElementById("food_title_breadcrumb").textContent = product.product_name;
  document.getElementById("food_name").textContent = product.product_name;
  document.getElementById("group_tag").textContent = group.group_title;

  /* ---------- مواد تشکیل‌دهنده غذا ---------- */
  document.getElementById("food_content").textContent =
    product.product_content.join("،");

  /* ---------- قیمت هر سایز + دکمه افزودن به سبد خرید ---------- */
  var priceList = document.getElementById("price_list");
  var message = document.getElementById("add_message");
  var selectedIndex = 0;                 // سایز انتخاب‌شده (پیش‌فرض: اولی)

  priceList.innerHTML = "";

  for (var i = 0; i < product.product_price.length; i++) {
    var price = product.product_price[i];
    var type = product.product_type[i] || "normal";
    var finalPrice = applyDiscount(price, discount);

    var row = document.createElement("li");
    row.className = "price-row" + (i === 0 ? " selected" : "");
    row.innerHTML =
      '<span class="type">' + type + "</span>" +
      "<del>" + toPersianNumber(price) + " تومان</del>" +
      '<span class="final">' + toPersianNumber(finalPrice) + " تومان</span>" +
      '<button type="button" class="add-size">افزودن</button>';

    priceList.appendChild(row);

    // با کلیک روی هر ردیف، همان سایز انتخاب می‌شود
    (function (index, element) {
      element.addEventListener("click", function () {
        selectSize(index);
      });

      // دکمه «افزودن» همان سایز را مستقیم به سبد خرید اضافه می‌کند
      element.querySelector(".add-size").addEventListener("click", function (event) {
        event.stopPropagation();
        selectSize(index);
        addSizeToCart(index, 1);
      });
    })(i, row);
  }

  function selectSize(index) {
    selectedIndex = index;
    var rows = priceList.querySelectorAll(".price-row");
    for (var k = 0; k < rows.length; k++) {
      rows[k].classList.toggle("selected", k === index);
    }
  }

  /* ---------- افزودن یک سایز به سبد خرید ---------- */
  function addSizeToCart(index, quantity) {
    var type = product.product_type[index] || "normal";
    var basePrice = product.product_price[index];

    var item = {
      key: makeCartKey(query.group, query.product, type),
      group: query.group,
      product: query.product,
      name: product.product_name,
      type: type,
      price: applyDiscount(basePrice, discount),
      oldPrice: basePrice,
      image: product.product_image[0],
      icon: icon,
    };

    var before = getCartItemsCount();
    addToCart(item, quantity);             // خواندن، تغییر و نوشتن دوباره در Local Storage
    var after = getCartItemsCount();

    // پیام مناسب: آیا قلم جدیدی اضافه شد یا فقط تعداد زیاد شد؟
    if (after > before) {
      message.textContent =
        "«" + product.product_name + " (" + type + ")» به سبد خرید اضافه شد.";
    } else {
      message.textContent =
        "تعداد «" + product.product_name + " (" + type + ")» در سبد خرید افزایش یافت.";
    }

    message.classList.add("show");
    setTimeout(function () {
      message.classList.remove("show");
    }, 2500);
  }

  /* ---------- شمارنده تعداد کنار دکمه اصلی ---------- */
  var quantity = 1;
  var quantityValue = document.getElementById("qty_value");

  function showQuantity() {
    quantityValue.textContent = toPersianNumber(quantity);
  }

  document.getElementById("qty_plus").addEventListener("click", function () {
    quantity++;
    showQuantity();
  });

  document.getElementById("qty_minus").addEventListener("click", function () {
    if (quantity > 1) {
      quantity--;
      showQuantity();
    }
  });

  document.getElementById("add_to_cart").addEventListener("click", function () {
    addSizeToCart(selectedIndex, quantity);
    quantity = 1;
    showQuantity();
  });

  showQuantity();

  /* ---------- عکس بزرگ و عکس‌های کوچک محصول ---------- */
  var largeBox = document.getElementById("image_large");
  var smallBox = document.getElementById("image_small");

  largeBox.innerHTML = "";
  smallBox.innerHTML = "";

  setImageWithFallback(largeBox, product.product_image[0], icon);

  for (var j = 0; j < product.product_image.length; j++) {
    var thumb = document.createElement("div");
    thumb.className = "thumb" + (j === 0 ? " active" : "");
    setImageWithFallback(thumb, product.product_image[j], icon);

    (function (source, element) {
      element.addEventListener("click", function () {
        largeBox.innerHTML = "";
        setImageWithFallback(largeBox, source, icon);

        var thumbs = smallBox.querySelectorAll(".thumb");
        for (var k = 0; k < thumbs.length; k++) {
          thumbs[k].classList.remove("active");
        }
        element.classList.add("active");
      });
    })(product.product_image[j], thumb);

    smallBox.appendChild(thumb);
  }

  /* ---------- ارزش انرژی و پروتئین ---------- */
  var energy = Number(product.product_energy);
  var protein = Number(product.product_protein);

  document.getElementById("energy_value").textContent =
    toPersianNumber(energy * 10) + " کیلو کالری";
  document.getElementById("protein_value").textContent =
    toPersianNumber(protein) + " گرم";

  var energyBar = document.getElementById("energy_bar");
  var proteinBar = document.getElementById("protein_bar");

  energyBar.style.width = energy + "%";
  energyBar.textContent = toPersianNumber(energy) + "٪";
  proteinBar.style.width = protein + "%";
  proteinBar.textContent = toPersianNumber(protein) + "٪";
});
