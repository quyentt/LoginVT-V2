// Cổng thông tin sinh viên - Đông Á
document.addEventListener("DOMContentLoaded", function () {
  // Toggle hiển thị mật khẩu
  var toggle = document.querySelector(".aps-field__toggle");
  var pwd = document.getElementById("aps-password");
  if (toggle && pwd) {
    toggle.addEventListener("click", function () {
      var isText = pwd.type === "text";
      pwd.type = isText ? "password" : "text";
      toggle.classList.toggle("is-visible", !isText);
      toggle.setAttribute("aria-label", isText ? "Hiện mật khẩu" : "Ẩn mật khẩu");
    });
  }

  // Chặn submit mặc định (demo) - thay bằng call API thật khi tích hợp
  var form = document.getElementById("aps-login-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var user = document.getElementById("aps-username").value.trim();
      if (!user) {
        alert("Vui lòng nhập tài khoản hoặc email.");
        return;
      }
      // TODO: gọi API đăng nhập
      console.log("Đăng nhập:", user);
    });
  }
});
