/* ======================================================
   صفحه سبد خرید (shop-cart.html)
   نمایش محصولاتی که کاربر انتخاب کرده است، تغییر تعداد هر محصول و
   حذف کامل یک محصول از سبد خرید. همه تغییرها روی Local Storage
   اعمال می‌شوند.
   ====================================================== */

function renderCartPage() {
  var table = document.getElementById("cart_table");
  var totalBox = document.getElementById("cart_total");
  var title = document.getElementById("cart_title");

  var cart = readCart();                 // خواندن آرایه از Local Storage

  title.textContent = "(" + toPersianNumber(cart.length) + ") مورد در سبد خرید";

  // ---------- سبد خالی ----------
  if (cart.length === 0) {
    table.innerHTML =
      '<p class="empty-cart">سبد خرید شما خالی است. ' +
      '<a href="index.html">رفتن به منوی غذا</a></p>';
    totalBox.textContent = "";
    return;
  }

  table.innerHTML = "";

  // ---------- ساخت ردیف هر محصول ----------
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];

    var row = document.createElement("div");
    row.className = "cart-row";

    // تعداد (دکمه‌های + و -)
    var stepper = document.createElement("div");
    stepper.className = "stepper";
    stepper.innerHTML =
      '<button type="button" class="step-plus">+</button>' +
      '<span class="step-value">' + toPersianNumber(item.count) + "</span>" +
      '<button type="button" class="step-minus">-</button>';

    // عکس محصول
    var imageBox = document.createElement("div");
    imageBox.className = "cart-row__img";
    setImageWithFallback(imageBox, item.image, item.icon || "🍽");

    // نام محصول به همراه سایز
    var name = document.createElement("div");
    name.className = "cart-row__name";
    name.innerHTML =
      '<a href="food_details.html?group=' + item.group +
      "&product=" + item.product + '">' + item.name +
      "(" + item.type + ")</a>";

    // قیمت واحد
    var price = document.createElement("div");
    price.className = "cart-row__price";
    price.textContent = toPersianNumber(item.price) + " تومان";

    // تعداد
    var count = document.createElement("div");
    count.className = "cart-row__count";
    count.textContent = toPersianNumber(item.count) + " عدد";

    // جمع ردیف
    var sum = document.createElement("div");
    sum.className = "cart-row__sum";
    sum.textContent = toPersianNumber(item.price * item.count) + " تومان";

    // دکمه حذف کامل محصول
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-row__remove";
    remove.title = "حذف از سبد خرید";
    remove.textContent = "🗑";

    row.appendChild(stepper);
    row.appendChild(imageBox);
    row.appendChild(name);
    row.appendChild(price);
    row.appendChild(count);
    row.appendChild(sum);
    row.appendChild(remove);
    table.appendChild(row);

    // ---------- رویدادهای هر ردیف ----------
    (function (key) {
      stepper.querySelector(".step-plus").addEventListener("click", function () {
        changeCartCount(key, +1);          // افزایش تعداد همین محصول
        renderCartPage();
      });

      stepper.querySelector(".step-minus").addEventListener("click", function () {
        changeCartCount(key, -1);          // کاهش تعداد (کمتر از ۱ نمی‌شود)
        renderCartPage();
      });

      remove.addEventListener("click", function () {
        removeFromCart(key);               // حذف کامل محصول از سبد خرید
        renderCartPage();
      });
    })(item.key);
  }

  // ---------- جمع کل ----------
  totalBox.innerHTML =
    "<span>جمع کل</span>" +
    "<strong>" + toPersianNumber(getCartTotal()) + " تومان</strong>";
}

document.addEventListener("DOMContentLoaded", renderCartPage);
