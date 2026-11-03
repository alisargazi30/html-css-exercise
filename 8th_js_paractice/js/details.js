/* ======================================================
   صفحه جزئیات غذا (food_details.html)

   بخش ۲ سؤال: اعمال درصد تخفیف گروه روی قیمت هر نوع از غذا.
   بخش ۳ سؤال: قرار دادن عکس‌های محصول در دو div با آیدی‌های
               image_large و image_small.
   بخش ۴ سؤال: نمایش نام محصول در سه قسمت مشخص‌شده، با توجه به
               شماره گروه و شماره محصول موجود در Query String.
   بخش ۵ سؤال: نمایش آرایه product_content در تگ p با آیدی food_content.
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

  /* ---------- بخش ۴: نمایش نام محصول در سه قسمت ---------- */
  document.title = product.product_name;
  document.getElementById("food_title").textContent = product.product_name;
  document.getElementById("food_title_breadcrumb").textContent = product.product_name;
  document.getElementById("food_name").textContent = product.product_name;

  // عنوان گروه غذا
  document.getElementById("group_tag").textContent = group.group_title;

  /* ---------- بخش ۵: مواد تشکیل‌دهنده غذا ---------- */
  document.getElementById("food_content").textContent =
    product.product_content.join("،");

  /* ---------- بخش ۲: قیمت هر نوع (اندازه) با تخفیف گروه ---------- */
  var priceList = document.getElementById("price_list");
  priceList.innerHTML = "";

  for (var i = 0; i < product.product_price.length; i++) {
    var price = product.product_price[i];
    var type = product.product_type[i] || "normal";

    var row = document.createElement("li");
    row.innerHTML =
      '<span class="type">' + type + "</span>" +
      "<del>" + toPersianNumber(price) + " تومان</del>" +
      '<span class="final">' +
      toPersianNumber(applyDiscount(price, discount)) + " تومان</span>";

    priceList.appendChild(row);
  }

  /* ---------- بخش ۳: عکس بزرگ و عکس‌های کوچک محصول ---------- */
  var largeBox = document.getElementById("image_large");
  var smallBox = document.getElementById("image_small");
  var icon = GROUP_ICONS[group.group_title] || "🍽";

  largeBox.innerHTML = "";
  smallBox.innerHTML = "";

  // عکس بزرگ: اولین عکس محصول
  setImageWithFallback(largeBox, product.product_image[0], icon);

  // عکس‌های کوچک: همه عکس‌های محصول
  for (var j = 0; j < product.product_image.length; j++) {
    var thumb = document.createElement("div");
    thumb.className = "thumb" + (j === 0 ? " active" : "");
    setImageWithFallback(thumb, product.product_image[j], icon);

    // با کلیک روی هر عکس کوچک، همان عکس در قسمت بزرگ نمایش داده می‌شود
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
