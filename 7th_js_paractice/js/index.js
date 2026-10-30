/* ======================================================
   صفحه اول (index.html)
   بخش ۱ سؤال: ساخت باکس محصولات با حلقه، از روی فایل JSON
   هر باکس شامل عکس محصول و عنوان آن است و با کلیک روی آن،
   صفحه گروه مربوطه با کد گروه (group_id) باز می‌شود.
   ====================================================== */

document.addEventListener("DOMContentLoaded", function () {
  var grid = document.getElementById("groupGrid");

  /* آیکون جایگزین برای زمانی که فایل عکس در پوشه images موجود نیست */
  var fallbackIcons = {
    "ساندویچ": "🍔",
    "پیتزا": "🍕",
    "کباب": "🍢",
  };

  loadProductGroups()
    .then(function (groups) {
      grid.innerHTML = "";

      // ---------- حلقه روی گروه‌های محصول ----------
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];

        // ساخت باکس محصول
        var card = document.createElement("a");
        card.className = "group-card";
        card.href = "group.html?group_id=" + group.group_id;   // ارسال کد گروه
        card.setAttribute("data-group-id", group.group_id);

        // ---- قسمت عکس ----
        var imageBox = document.createElement("div");
        imageBox.className = "group-card__img";

        var image = document.createElement("img");
        image.src = group.group_image;
        image.alt = group.group_title;

        // اگر فایل عکس وجود نداشت، به جای آن یک آیکون نمایش داده می‌شود
        (function (box, title) {
          image.addEventListener("error", function () {
            box.textContent = fallbackIcons[title] || "🍽";
          });
        })(imageBox, group.group_title);

        imageBox.appendChild(image);

        // ---- قسمت عنوان ----
        var titleBox = document.createElement("div");
        titleBox.className = "group-card__title";
        titleBox.innerHTML =
          group.group_title +
          ' <span class="group-card__count">(' +
          group.group_products.length +
          " محصول)</span>";

        card.appendChild(imageBox);
        card.appendChild(titleBox);
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
