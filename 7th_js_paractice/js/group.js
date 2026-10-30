/* ======================================================
   صفحه دوم (group.html)
   بخش ۲ سؤال: نمایش نام گروهِ محصولی که روی آن کلیک شده است،
               در قسمت «عنوان گروه غذا».
   بخش ۳ سؤال: نمایش همه محصولات همان گروه (اسم غذا، قیمت غذا و
               محتوای غذا) که از فایل JSON خوانده می‌شوند.
   ====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var titleElement = document.getElementById("groupTitle");
  var breadcrumbElement = document.getElementById("breadcrumbGroup");
  var productsTitle = document.getElementById("productsTitle");
  var grid = document.getElementById("productGrid");

  // ---------- خواندن کد گروه از آدرس صفحه ----------
  var params = new URLSearchParams(window.location.search);
  var groupId = params.get("group_id");

  loadProductGroups()
    .then(function (groups) {
      var group = findGroupById(groups, groupId);

      if (!group) {
        titleElement.textContent = "گروه غذا پیدا نشد";
        grid.innerHTML =
          '<p class="error-box">گروهی با کد ' +
          groupId +
          " در فایل JSON وجود ندارد.</p>";
        return;
      }

      // ---------- بخش ۲: نمایش عنوان گروه انتخاب‌شده ----------
      document.title = group.group_title;
      titleElement.textContent = group.group_title;
      breadcrumbElement.textContent = group.group_title;
      productsTitle.textContent = "محصولات گروه " + group.group_title;

      // ---------- بخش ۳: نمایش محصولات همان گروه با حلقه ----------
      grid.innerHTML = "";
      var products = group.group_products;

      for (var i = 0; i < products.length; i++) {
        var product = products[i];

        var card = document.createElement("div");
        card.className = "product-card";

        var info = document.createElement("div");
        info.className = "product-card__info";

        // اسم غذا
        var name = document.createElement("h3");
        name.className = "product-card__name";
        name.textContent = product.product_name;

        // محتوای غذا (آرایه‌ای از مواد تشکیل‌دهنده در فایل JSON)
        var content = document.createElement("p");
        content.className = "product-card__content";
        content.textContent = product.product_content.join("،");

        // قیمت غذا
        var price = document.createElement("span");
        price.className = "product-card__price";
        price.textContent = formatPrice(product.product_price) + " تومان";

        info.appendChild(name);
        info.appendChild(content);
        card.appendChild(info);
        card.appendChild(price);
        grid.appendChild(card);
      }
    })
    .catch(function (error) {
      grid.innerHTML =
        '<p class="error-box">خواندن فایل JSON با خطا روبه‌رو شد: ' +
        error.message +
        "</p>";
    });
});
