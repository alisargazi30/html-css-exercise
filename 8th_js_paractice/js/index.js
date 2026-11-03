/* ======================================================
   صفحه اصلی (index.html)
   بخش ۱ سؤال: عنوان هر محصول قابل کلیک باشد و با کلیک روی آن،
   صفحه مخصوص همان غذا باز شود؛ شماره گروه و شماره محصول هم به
   صورت Query String به انتهای آدرس اضافه شود:
       food_details.html?group=1&product=0
   بخش ۲ سؤال: قیمت هر محصول با درصد تخفیف همان گروه نمایش داده شود.
   ====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var wrapper = document.getElementById("groupsWrapper");

  try {
    var groups = getProductGroups();
    wrapper.innerHTML = "";

    // ---------- حلقه روی گروه‌ها ----------
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
      var discount = getGroupDiscount(group, g);

      var block = document.createElement("section");
      block.className = "group-block";

      // ---- عنوان گروه + درصد تخفیف آن ----
      var head = document.createElement("div");
      head.className = "group-block__head";
      head.innerHTML =
        "<h2>" + group.group_title + "</h2>" +
        '<span class="discount-badge">' + toPersianNumber(discount) +
        "٪ تخفیف</span>";
      block.appendChild(head);

      // ---- محصولات این گروه ----
      var grid = document.createElement("div");
      grid.className = "product-grid";

      for (var p = 0; p < group.group_products.length; p++) {
        var product = group.group_products[p];

        var card = document.createElement("article");
        card.className = "product-card";

        var info = document.createElement("div");

        // عنوان محصول به صورت لینک با Query String
        var link = document.createElement("a");
        link.className = "product-card__name";
        link.textContent = product.product_name;
        link.href = "food_details.html?group=" + g + "&product=" + p;
        info.appendChild(link);

        // مواد تشکیل‌دهنده غذا
        var content = document.createElement("p");
        content.className = "product-card__content";
        content.textContent = product.product_content.join("،");
        info.appendChild(content);

        // قیمت کمترین نوع، قبل و بعد از تخفیف گروه
        var priceBox = document.createElement("div");
        priceBox.className = "product-card__price";
        var basePrice = product.product_price[0];
        priceBox.innerHTML =
          "<del>" + toPersianNumber(basePrice) + " تومان</del>" +
          "<span>" + toPersianNumber(applyDiscount(basePrice, discount)) +
          " تومان</span>";

        card.appendChild(info);
        card.appendChild(priceBox);
        grid.appendChild(card);
      }

      block.appendChild(grid);
      wrapper.appendChild(block);
    }
  } catch (error) {
    wrapper.innerHTML =
      '<p class="loading">خواندن داده‌ها با خطا روبه‌رو شد: ' + error.message + "</p>";
  }
});
