/* ======================================================
   خواندن فایل JSON
   ------------------------------------------------------
   اطلاعات محصولات در فایل data/products.json ذخیره شده است و
   با fetch خوانده و با JSON.parse به آبجکت جاوااسکریپت تبدیل می‌شود.

   نکته: اگر صفحه بدون وب‌سرور و با دابل‌کلیک (پروتکل file://) باز شود،
   مرورگرها اجازه fetch روی فایل محلی را نمی‌دهند؛ در این حالت از نسخه
   پشتیبان همان داده‌ها در فایل js/products-data.js استفاده می‌شود تا
   صفحه در هر دو حالت کار کند.
   ====================================================== */

var DATA_URL = "data/products.json";

function loadProductGroups() {
  return fetch(DATA_URL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("خطا در خواندن فایل JSON: " + response.status);
      }
      return response.text();           // متن خام فایل JSON
    })
    .then(function (text) {
      var data = JSON.parse(text);      // تبدیل رشته JSON به آبجکت
      return data.product_groups;
    })
    .catch(function (error) {
      console.warn("fetch انجام نشد، از داده پشتیبان استفاده می‌شود:", error.message);

      if (typeof PRODUCTS_FALLBACK !== "undefined") {
        return PRODUCTS_FALLBACK.product_groups;
      }
      throw error;
    });
}

/* جستجوی یک گروه بر اساس کد گروه (group_id) */
function findGroupById(groups, groupId) {
  for (var i = 0; i < groups.length; i++) {
    if (Number(groups[i].group_id) === Number(groupId)) {
      return groups[i];
    }
  }
  return null;
}

/* جدا کردن قیمت با کاما: 165000 ⇒ 165,000 */
function formatPrice(price) {
  return Number(price).toLocaleString("en-US");
}
