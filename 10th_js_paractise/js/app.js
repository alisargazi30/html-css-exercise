/* ======================================================
   توابع مشترک دو صفحه
   ------------------------------------------------------
   فایل js/data.js (همان فایل data.json تمرین) دو متغیر رشته‌ای
   به نام‌های data و discount_data در اختیار ما می‌گذارد که با
   JSON.parse به آبجکت تبدیل می‌شوند.
   ====================================================== */

/* ---------- خواندن گروه‌های محصول ---------- */
function getProductGroups() {
  return JSON.parse(data).product_groups;
}

/* ---------- خواندن جدول تخفیف‌ها ---------- */
function getDiscounts() {
  return JSON.parse(discount_data).Discounts;
}

/* ---------- پیدا کردن درصد تخفیف یک گروه ----------
   در فایل تخفیف‌ها، group_id از صفر شروع می‌شود و با شماره‌ای که در
   Query String استفاده می‌کنیم (اندیس گروه) متناظر است؛ برای اطمینان
   بیشتر، عنوان گروه هم مقایسه می‌شود. */
function getGroupDiscount(group, groupIndex) {
  var discounts = getDiscounts();

  for (var i = 0; i < discounts.length; i++) {
    if (discounts[i].group_title === group.group_title) {
      return discounts[i].discount;
    }
  }

  for (var j = 0; j < discounts.length; j++) {
    if (Number(discounts[j].group_id) === Number(groupIndex)) {
      return discounts[j].discount;
    }
  }

  return 0;
}

/* ---------- محاسبه قیمت بعد از تخفیف ---------- */
function applyDiscount(price, discount) {
  return Math.round((price * (100 - discount)) / 100);
}

/* ---------- نمایش عدد با ارقام فارسی ---------- */
function toPersianNumber(value) {
  return Number(value).toLocaleString("fa-IR");
}

/* ---------- خواندن پارامترهای Query String ----------
   نمونه آدرس: food_details.html?group=1&product=0 */
function getQueryParams() {
  var params = new URLSearchParams(window.location.search);
  return {
    group: Number(params.get("group")),
    product: Number(params.get("product")),
  };
}

/* ---------- آیکون جایگزین وقتی فایل عکس موجود نیست ---------- */
var GROUP_ICONS = { "ساندویچ": "🍔", "پیتزا": "🍕", "کباب": "🍢" };

function setImageWithFallback(box, source, icon) {
  var image = document.createElement("img");
  image.src = source;
  image.alt = icon || "";
  image.addEventListener("error", function () {
    box.textContent = icon || "🍽";
  });
  box.appendChild(image);
}
