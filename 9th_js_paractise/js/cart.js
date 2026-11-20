/* ======================================================
   سبد خرید با Local Storage
   ------------------------------------------------------
   قانون کار با storage (طبق صورت تمرین):
   در هر بار اضافه یا حذف کردن یک محصول، ابتدا localStorage را
   می‌خوانیم، آن را درون یک آرایه می‌ریزیم، به آرایه اضافه یا از آن کم
   می‌کنیم و دوباره آرایه را به localStorage برمی‌گردانیم.

   هر عضو آرایه سبد خرید:
   {
     key, group, product, name, type, price, oldPrice, image, count
   }
   ====================================================== */

var CART_KEY = "shopping_cart";

/* ---------- خواندن سبد خرید از Local Storage ---------- */
function readCart() {
  try {
    var saved = localStorage.getItem(CART_KEY);
    var cart = saved ? JSON.parse(saved) : [];
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    console.warn("خواندن سبد خرید با خطا روبه‌رو شد:", error.message);
    return [];
  }
}

/* ---------- نوشتن آرایه سبد خرید در Local Storage ---------- */
function writeCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("ذخیره سبد خرید با خطا روبه‌رو شد:", error.message);
  }
  renderCartBadge();
}

/* ---------- ساخت کلید یکتا برای هر «محصول + سایز» ---------- */
function makeCartKey(groupIndex, productIndex, type) {
  return groupIndex + "-" + productIndex + "-" + type;
}

/* ---------- پیدا کردن یک آیتم در آرایه ---------- */
function findCartIndex(cart, key) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].key === key) {
      return i;
    }
  }
  return -1;
}

/* ---------- افزودن محصول (یک سایز مشخص) به سبد خرید ----------
   اگر همان محصول با همان سایز از قبل در سبد باشد، فقط تعداد همان آیتم
   زیاد می‌شود و به تعداد اقلام سبد خرید (عدد کنار آیکن) چیزی اضافه نمی‌شود. */
function addToCart(item, quantity) {
  var cart = readCart();                       // ۱) خواندن از Local Storage
  var count = Number(quantity) || 1;
  var index = findCartIndex(cart, item.key);

  if (index === -1) {
    item.count = count;
    cart.push(item);                           // ۲) افزودن آیتم جدید به آرایه
  } else {
    cart[index].count += count;                // ۲) فقط افزایش تعداد همان آیتم
  }

  writeCart(cart);                             // ۳) بازگرداندن آرایه به Local Storage
  return cart;
}

/* ---------- تغییر تعداد یک آیتم سبد خرید ---------- */
function changeCartCount(key, delta) {
  var cart = readCart();
  var index = findCartIndex(cart, key);

  if (index !== -1) {
    cart[index].count += delta;
    if (cart[index].count < 1) {
      cart[index].count = 1;                   // کمتر از یک نمی‌شود
    }
    writeCart(cart);
  }

  return cart;
}

/* ---------- حذف کامل یک محصول از سبد خرید ---------- */
function removeFromCart(key) {
  var cart = readCart();
  var index = findCartIndex(cart, key);

  if (index !== -1) {
    cart.splice(index, 1);                     // حذف از آرایه
    writeCart(cart);
  }

  return cart;
}

/* ---------- تعداد اقلام سبد خرید (عدد کنار آیکن) ----------
   برابر تعداد «محصول + سایز»های متفاوت است. */
function getCartItemsCount() {
  return readCart().length;
}

/* ---------- جمع کل مبلغ سبد خرید ---------- */
function getCartTotal() {
  return readCart().reduce(function (sum, item) {
    return sum + item.price * item.count;
  }, 0);
}

/* ---------- به‌روزرسانی عدد کنار آیکن سبد خرید ---------- */
function renderCartBadge() {
  var badge = document.getElementById("cart_count");
  if (badge) {
    badge.textContent = "(" + toPersianNumber(getCartItemsCount()) + ")";
  }
}

/* عدد سبد خرید در همه صفحه‌ها هنگام بارگذاری نمایش داده می‌شود */
document.addEventListener("DOMContentLoaded", renderCartBadge);

/* اگر سبد خرید در تب دیگری تغییر کند، این تب هم به‌روز می‌شود */
window.addEventListener("storage", function (event) {
  if (event.key === CART_KEY) {
    renderCartBadge();
    if (typeof renderCartPage === "function") {
      renderCartPage();
    }
  }
});
