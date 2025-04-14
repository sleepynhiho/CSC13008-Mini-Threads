// Modal functionality
const modal = document.getElementById("modal-popup");
const modalMessage = document.getElementById("modal-message");

function showModal(message) {
  modalMessage.textContent = message;
  modal.classList.remove("hidden");
  modal.style.opacity = "1";
  modal.style.transform = "translateY(0)";
  setTimeout(hideModal, 4000); // Automatically hide modal after 4 seconds
}

function hideModal() {
  modal.style.opacity = "0";
  modal.style.transform = "translateY(100%)";
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 500); // Delay for transition completion
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("change-password-form");
  const inputs = form.querySelectorAll(".change-password-form__input");
  const submitButton = form.querySelector(".change-password-form__button");

  // Check if all form fields are filled
  const checkFormValidity = () => {
    const isValid = Array.from(inputs).every(
      (input) => input.value.trim() !== ""
    );
    submitButton.disabled = !isValid; // Enable/disable submit button
  };

  // Attach input event listeners to fields
  inputs.forEach((input) => input.addEventListener("input", checkFormValidity));

  // Initial validation on page load
  checkFormValidity();

  // Handle form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const password = form.password.value;
    const passwordConfirm = form.password_confirm.value;
    // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validate password
    if (!passwordPattern.test(password)) {
      showModal(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    // Validate passwords
    if (password !== passwordConfirm) {
      showModal("Passwords do not match.");
      return;
    }

    // Extract token from URL
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      showModal("Invalid token.");
      return;
    }

    const data = {
      password,
      password_confirm: passwordConfirm,
      token,
    };

    try {
      const response = await fetch("/auth/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        showModal(result.message);
        setTimeout(() => (window.location.href = "/auth/login"), 1000);
      } else {
        showModal(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      showModal("An error occurred. Please try again later.");
    }
  });
});
