/* ======================================================
   صفحه تهیه پیتزا (pizza.html)

   موضوع تمرین: drag and drop به‌همراه async و sync

   ۱) داده‌های مواد تشکیل‌دهنده پیتزا به صورت غیرهمزمان (async/await + fetch)
      از فایل data/ingredients.json خوانده می‌شوند؛ تا پیش از آماده شدن داده‌ها
      پیام «در حال بارگذاری» نمایش داده می‌شود و صفحه قفل نمی‌شود.
   ۲) کاربر هر ماده‌ای را از ستون چپ روی خمیر پیتزا drag می‌کند و در نقطه‌ای که
      ماوس را رها کرده است، همان ماده قرار می‌گیرد.
   ۳) با هر افزودن یا حذف، قیمت و میزان کالری در ستون راست به‌روز می‌شود.
   ====================================================== */

/* ---------------- حالت برنامه ---------------- */
var pizzaBase = null;       // اطلاعات خمیر پیتزا
var ingredients = [];       // لیست مواد از فایل JSON
var toppings = [];          // مواد اضافه‌شده روی پیتزا

/* ---------------- ابزار نمایش ---------------- */
function toPersianNumber(value) {
  return Number(Math.round(value)).toLocaleString("fa-IR");
}

/* ======================================================
   بخش async: خواندن داده‌ها از فایل JSON
   ------------------------------------------------------
   تابع زیر asynchronous است؛ با await منتظر پاسخ fetch می‌ماند اما
   مرورگر در این مدت بسته نمی‌شود و بقیه صفحه کار می‌کند.
   (در مقابل، کد sync مثل یک حلقه طولانی، کل صفحه را قفل می‌کند.)
   ====================================================== */
async function loadData() {
  var response = await fetch("data/ingredients.json");

  if (!response.ok) {
    throw new Error("خطا در خواندن فایل JSON: " + response.status);
  }

  var data = await response.json();
  return data;
}

/* اگر صفحه بدون وب‌سرور (پروتکل file://) باز شود، fetch اجازه کار ندارد؛
   در این حالت از نسخه پشتیبان داده‌ها در js/pizza-data.js استفاده می‌شود. */
async function getData() {
  try {
    return await loadData();
  } catch (error) {
    console.warn("fetch انجام نشد؛ داده پشتیبان استفاده می‌شود:", error.message);

    if (typeof PIZZA_DATA !== "undefined") {
      return PIZZA_DATA;
    }
    throw error;
  }
}

/* ======================================================
   ساخت ستون مواد تشکیل‌دهنده
   ====================================================== */
function renderIngredients(list) {
  var box = document.getElementById("ingredient_list");
  box.innerHTML = "";

  for (var i = 0; i < list.length; i++) {
    var item = list[i];

    var chip = document.createElement("div");
    chip.className = "ingredient";
    chip.setAttribute("draggable", "true");          // قابلیت کشیدن
    chip.setAttribute("data-id", item.id);
    chip.title = item.name + " ـ " + toPersianNumber(item.price) + " تومان";

    // عکس ماده؛ اگر فایل عکس نبود، آیکن جایگزین نمایش داده می‌شود
    var image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    (function (element, icon, img) {
      img.addEventListener("error", function () {
        var fallback = document.createElement("span");
        fallback.className = "ingredient__icon";
        fallback.textContent = icon;
        element.replaceChild(fallback, img);      // فقط عکس جایگزین می‌شود
      });
    })(chip, item.icon, image);

    chip.appendChild(image);

    var label = document.createElement("span");
    label.className = "ingredient__name";
    label.textContent = item.name;
    chip.appendChild(label);

    // ---------- رویداد شروع کشیدن ----------
    chip.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", this.getAttribute("data-id"));
      event.dataTransfer.effectAllowed = "copy";
      this.classList.add("dragging");
    });

    chip.addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });

    box.appendChild(chip);
  }
}

/* ======================================================
   drag and drop روی خمیر پیتزا
   ====================================================== */
function setupDropZone() {
  var dough = document.getElementById("pizza_dough");
  var hint = document.getElementById("dough_hint");

  // اجازه رها کردن؛ بدون preventDefault رویداد drop اجرا نمی‌شود
  dough.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    dough.classList.add("over");
  });

  dough.addEventListener("dragleave", function () {
    dough.classList.remove("over");
  });

  dough.addEventListener("drop", function (event) {
    event.preventDefault();
    dough.classList.remove("over");

    var id = Number(event.dataTransfer.getData("text/plain"));
    var ingredient = findIngredient(id);
    if (!ingredient) {
      return;
    }

    // ---------- محاسبه مختصات ماوس نسبت به خمیر پیتزا ----------
    var box = dough.getBoundingClientRect();
    var x = event.clientX - box.left;
    var y = event.clientY - box.top;

    addTopping(ingredient, x, y, dough);
    if (hint) {
      hint.style.display = "none";
    }
  });
}

function findIngredient(id) {
  for (var i = 0; i < ingredients.length; i++) {
    if (Number(ingredients[i].id) === id) {
      return ingredients[i];
    }
  }
  return null;
}

/* ---------------- افزودن یک ماده روی خمیر ---------------- */
function addTopping(ingredient, x, y, dough) {
  var piece = document.createElement("div");
  piece.className = "topping";

  // ماده دقیقاً در نقطه‌ای که ماوس رها شده قرار می‌گیرد (مرکز تصویر روی آن نقطه)
  piece.style.left = x + "px";
  piece.style.top = y + "px";
  piece.title = ingredient.name + " (برای حذف کلیک کنید)";

  var image = document.createElement("img");
  image.src = ingredient.image;
  image.alt = ingredient.name;
  image.addEventListener("error", function () {
    image.remove();
    piece.textContent = ingredient.icon;         // آیکن جایگزین عکس
    piece.classList.add("topping--icon");
  });
  piece.appendChild(image);

  // با کلیک روی ماده، از روی پیتزا حذف می‌شود
  piece.addEventListener("click", function () {
    removeTopping(piece);
  });

  dough.appendChild(piece);

  toppings.push({ ingredient: ingredient, element: piece });
  updateSummary();
}

/* ---------------- حذف یک ماده از روی خمیر ---------------- */
function removeTopping(element) {
  for (var i = 0; i < toppings.length; i++) {
    if (toppings[i].element === element) {
      toppings.splice(i, 1);
      break;
    }
  }

  element.remove();
  updateSummary();

  var hint = document.getElementById("dough_hint");
  if (toppings.length === 0 && hint) {
    hint.style.display = "";
  }
}

/* ======================================================
   به‌روزرسانی قیمت و کالری (ستون راست)
   ====================================================== */
function updateSummary() {
  var price = pizzaBase ? pizzaBase.price : 0;
  var calories = pizzaBase ? pizzaBase.calories : 0;
  var counter = {};

  for (var i = 0; i < toppings.length; i++) {
    var item = toppings[i].ingredient;
    price += item.price;
    calories += item.calories;
    counter[item.name] = (counter[item.name] || 0) + 1;
  }

  document.getElementById("total_price").textContent = toPersianNumber(price);
  document.getElementById("total_calories").textContent = toPersianNumber(calories);

  // لیست مواد انتخاب‌شده
  var list = document.getElementById("chosen_list");
  list.innerHTML = "";

  var baseItem = document.createElement("li");
  baseItem.innerHTML = "<span>" + (pizzaBase ? pizzaBase.title : "خمیر پیتزا") +
    "</span><span>" + toPersianNumber(pizzaBase ? pizzaBase.price : 0) + "</span>";
  list.appendChild(baseItem);

  for (var name in counter) {
    var row = document.createElement("li");
    row.innerHTML = "<span>" + name + " ×" + toPersianNumber(counter[name]) +
      "</span><span>" + toPersianNumber(priceOf(name) * counter[name]) + "</span>";
    list.appendChild(row);
  }
}

function priceOf(name) {
  for (var i = 0; i < ingredients.length; i++) {
    if (ingredients[i].name === name) {
      return ingredients[i].price;
    }
  }
  return 0;
}

/* ======================================================
   دکمه‌های پاک کردن و ثبت سفارش
   ====================================================== */
function setupButtons() {
  var message = document.getElementById("order_message");

  document.getElementById("reset_btn").addEventListener("click", function () {
    for (var i = 0; i < toppings.length; i++) {
      toppings[i].element.remove();
    }
    toppings = [];

    var hint = document.getElementById("dough_hint");
    if (hint) {
      hint.style.display = "";
    }

    message.textContent = "";
    message.classList.remove("show");
    updateSummary();
  });

  document.getElementById("order_btn").addEventListener("click", function () {
    if (toppings.length === 0) {
      message.textContent = "اول چند ماده روی پیتزا بگذارید.";
    } else {
      message.textContent = "سفارش شما با " + toPersianNumber(toppings.length) +
        " ماده ثبت شد.";
    }
    message.classList.add("show");
  });
}

/* ======================================================
   شروع برنامه (async)
   ====================================================== */
document.addEventListener("DOMContentLoaded", async function () {
  var loading = document.getElementById("loading_box");

  try {
    var data = await getData();          // منتظر داده‌ها می‌مانیم (غیرهمزمان)

    pizzaBase = data.pizza_base;
    ingredients = data.ingredients;

    if (loading) {
      loading.remove();
    }

    renderIngredients(ingredients);
    setupDropZone();
    setupButtons();
    updateSummary();
  } catch (error) {
    if (loading) {
      loading.textContent = "خواندن داده‌ها با خطا روبه‌رو شد: " + error.message;
    }
  }
});
