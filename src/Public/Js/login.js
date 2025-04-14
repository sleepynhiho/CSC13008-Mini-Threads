// Đảm bảo đã import axios (nếu dùng module)
// const axios = require("axios").default;
// sử dụng CDN

var signUpButton = document.querySelector(".sign-up__text-wrapper");
if (signUpButton) {
  signUpButton.addEventListener("click", function () {
    window.location.href = "/go-to-signup";
  });
}

// Lấy các phần tử input và nút login
const emailOrUsernameInput = document.querySelector('[name="username"]');
const passwordInput = document.querySelector('[name="password"]');
const loginButton = document.querySelector('button[type="submit"]');

// Hàm kiểm tra các trường nhập
function checkInputs() {
  if (
    emailOrUsernameInput.value.trim() !== "" &&
    passwordInput.value.trim() !== ""
  ) {
    loginButton.disabled = false; // Bật nút login
  } else {
    loginButton.disabled = true; // Tắt nút login
  }
}

// Lắng nghe sự kiện khi người dùng thay đổi giá trị trong các input
emailOrUsernameInput.addEventListener("input", checkInputs);
passwordInput.addEventListener("input", checkInputs);

// Kiểm tra lần đầu tiên khi trang tải
checkInputs();

document
  .getElementById("login_form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngừng reload trang khi submit

    const form = document.getElementById("login_form");
    const formFields = {
      username: form.querySelector('[name="username"]').value,
      password: form.querySelector('[name="password"]').value,
    };

    try {
      const response = await axios.post("/auth/login", formFields, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Nếu login thành công, lưu trữ access token và chuyển hướng
      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken); // Lưu token vào localStorage

        // Đăng nhập thành công, hiển thị thông báo
        showModal(response.data.message);

        // Chuyển hướng về trang home sau 1 s
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        showModal(response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response.status === 400 || error.response.status === 404) {
        showModal(error.response.data.message);
      } else {
        showModal("Login failed! Something went wrong.");
      }
    }
  });

// Hàm hiển thị modal
function showModal(message) {
  const modalMessage = document.getElementById("modal-message");
  const modal = document.getElementById("modal-popup");
  modalMessage.textContent = message;
  modal.classList.remove("hidden");
  modal.style.opacity = "1";
  modal.style.transform = "translateY(0)";
  setTimeout(hideModal, 4000); // Tự động ẩn modal sau 4 giây
}

// Hàm ẩn modal
function hideModal() {
  const modal = document.getElementById("modal-popup");
  modal.style.opacity = "0";
  modal.style.transform = "translateY(100%)";
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 500); // Đợi một chút để hoàn thành hiệu ứng
}

// Điều hướng đến trang đăng ký
document
  .querySelector(".sign-up__text-wrapper")
  .addEventListener("click", () => {
    window.location.href = "/go-to-signup";
  });

// Lấy các phần tử input và nút login
const usernameInput = document.querySelector('[name="username"]');
// const passwordInput = document.querySelector('[name="password"]');
// const loginButton = document.querySelector('button[type="submit"]');

// Hàm kiểm tra trạng thái nhập
function toggleLoginButtonState() {
  const isFormValid =
    usernameInput.value.trim() !== "" && passwordInput.value.trim() !== "";
  loginButton.disabled = !isFormValid; // Bật/tắt nút login dựa trên trạng thái form
}

// Gán sự kiện cho các trường input
usernameInput.addEventListener("input", toggleLoginButtonState);
passwordInput.addEventListener("input", toggleLoginButtonState);

// Kiểm tra trạng thái nút khi trang tải
toggleLoginButtonState();

// Xử lý sự kiện submit form
document
  .getElementById("login_form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn trang reload khi submit

    // Lấy dữ liệu từ form
    const formFields = {
      username: usernameInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    try {
      // Gửi yêu cầu đăng nhập
      const response = await axios.post("/auth/login", formFields, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        // Đăng nhập thành công
        localStorage.setItem("accessToken", response.data.accessToken); // Lưu token
        // lưu accesstoken vào Cookie
        // document.cookie = `accessToken=${response.data.accessToken}`;

        showModal(response.data.message);
        // Chuyển hướng về trang chính
        setTimeout(() => (window.location.href = "/"), 1000);
      } else {
        showModal(response.data.message); // Hiển thị thông báo từ server
      }
    } catch (error) {
      console.error("Error during login:", error);

      const errorMessage =
        error.response?.data?.message || "Login failed! Something went wrong.";
      showModal(errorMessage);
    }
  });

// Hàm hiển thị modal thông báo
function showModal(message) {
  const modal = document.getElementById("modal-popup");
  const modalMessage = document.getElementById("modal-message");

  modalMessage.textContent = message;
  modal.classList.remove("hidden");
  modal.style.opacity = "1";
  modal.style.transform = "translateY(0)";

  // Tự động ẩn sau 4 giây
  setTimeout(hideModal, 4000);
}

// Hàm ẩn modal
function hideModal() {
  const modal = document.getElementById("modal-popup");
  modal.style.opacity = "0";
  modal.style.transform = "translateY(100%)";

  // Đợi hoàn thành hiệu ứng trước khi ẩn
  setTimeout(() => modal.classList.add("hidden"), 500);
}
