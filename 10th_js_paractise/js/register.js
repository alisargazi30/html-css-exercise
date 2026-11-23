/* ======================================================
   صفحه ثبت نام (register.html)

   بخش ۳ سؤال: با کلیک روی آیکن + فرم با انیمیشن باز می‌شود و آیکن
               به ✕ تبدیل می‌شود تا فرم بسته شود (تصویر شماره ۳).
   بخش ۴ سؤال: با زدن دکمه «ثبت نام» اعتبارسنجی انجام می‌شود و خطاها
               نمایش داده می‌شوند (تصویر شماره ۴):
                 * خالی بودن هر یک از فیلدها
                 * نادرست بودن قالب شماره موبایل
               قالب موبایل: ابتدا 09، سپس یکی از ارقام ۱ یا ۲ یا ۳ و
               بعد ۸ رقم دلخواه ⇒ در مجموع ۱۱ رقم.
   ====================================================== */

// الگوی شماره موبایل: 09 + (1|2|3) + هشت رقم دلخواه
var MOBILE_PATTERN = /^09[123][0-9]{8}$/;

document.addEventListener("DOMContentLoaded", function () {
  var wrapper = document.getElementById("form_wrapper");
  var toggleButton = document.getElementById("toggle_btn");
  var toggleIcon = document.getElementById("toggle_icon");
  var form = document.getElementById("register_form");
  var errorList = document.getElementById("error_list");
  var successMessage = document.getElementById("success_message");

  var fields = {
    first_name: document.getElementById("first_name"),
    last_name: document.getElementById("last_name"),
    mobile: document.getElementById("mobile"),
  };

  /* ---------------- باز و بسته کردن فرم با انیمیشن ---------------- */
  function openForm() {
    wrapper.classList.add("open");
    toggleIcon.textContent = "✕";
    toggleButton.title = "بستن فرم";
    fields.first_name.focus();
  }

  function closeForm() {
    wrapper.classList.remove("open");
    toggleIcon.textContent = "+";
    toggleButton.title = "باز کردن فرم";
    clearMessages();
  }

  toggleButton.addEventListener("click", function () {
    if (wrapper.classList.contains("open")) {
      closeForm();
    } else {
      openForm();
    }
  });

  /* ---------------- پاک کردن پیام‌ها ---------------- */
  function clearMessages() {
    errorList.innerHTML = "";
    errorList.classList.remove("show");
    successMessage.textContent = "";
    successMessage.classList.remove("show");

    for (var key in fields) {
      fields[key].classList.remove("invalid");
    }
  }

  /* ---------------- اعتبارسنجی فرم ---------------- */
  function validateForm() {
    var errors = [];

    var firstName = fields.first_name.value.trim();
    var lastName = fields.last_name.value.trim();
    var mobile = fields.mobile.value.trim();

    // ۱) خالی نبودن فیلدها
    if (firstName === "") {
      errors.push({ field: "first_name", message: "فیلد نام نباید خالی بماند" });
    }

    if (lastName === "") {
      errors.push({ field: "last_name", message: "فیلد نام خانوادگی نباید خالی بماند" });
    }

    if (mobile === "") {
      errors.push({ field: "mobile", message: "فیلد موبایل نباید خالی بماند" });
    }

    // ۲) درست بودن قالب موبایل
    if (!MOBILE_PATTERN.test(mobile)) {
      errors.push({ field: "mobile", message: "قالب موبایل نادرست است" });
    }

    return errors;
  }

  /* ---------------- نمایش خطاها ---------------- */
  function showErrors(errors) {
    errorList.innerHTML = "";

    for (var i = 0; i < errors.length; i++) {
      var item = document.createElement("li");
      item.textContent = errors[i].message;
      errorList.appendChild(item);

      if (fields[errors[i].field]) {
        fields[errors[i].field].classList.add("invalid");
      }
    }

    errorList.classList.add("show");
  }

  /* ---------------- ارسال فرم ---------------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();               // جلوگیری از ارسال پیش‌فرض فرم
    clearMessages();

    var errors = validateForm();

    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    // فرم معتبر است
    successMessage.textContent =
      "ثبت نام با موفقیت انجام شد؛ خوش آمدید " +
      fields.first_name.value.trim() + " " + fields.last_name.value.trim();
    successMessage.classList.add("show");
    form.reset();
  });

  /* ---------------- پاک شدن خطای یک فیلد هنگام تایپ ---------------- */
  for (var key in fields) {
    fields[key].addEventListener("input", function () {
      this.classList.remove("invalid");
    });
  }

  // فقط رقم در فیلد موبایل پذیرفته شود
  fields.mobile.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
});
