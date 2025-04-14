// Modal functionality
const modal = document.getElementById('modal-popup');
const modalMessage = document.getElementById('modal-message');

function showModal(message) {
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
    modal.style.opacity = '1';
    modal.style.transform = 'translateY(0)';
    setTimeout(hideModal, 4000); // Auto-hide after 4 seconds
}

function hideModal() {
    modal.style.opacity = '0';
    modal.style.transform = 'translateY(100%)';
    setTimeout(() => modal.classList.add('hidden'), 500); // Allow transition
}

// Validate form fields
function checkFormValidity() {
    const form = document.getElementById('signup-form');
    const submitButton = document.querySelector('.signup-form__button');

    const allFieldsFilled = Array.from(form.querySelectorAll('input')).every((input) => input.value.trim() !== '');
    submitButton.disabled = !allFieldsFilled;
}

// Attach input event listeners
document.querySelectorAll('.signup-form__input').forEach((input) => {
    input.addEventListener('input', checkFormValidity);
});

// Form submission
document.getElementById('signup-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData.entries());

  const { username, password, password_confirm, email } = formFields;

  // Validation logic
  const validations = [
    // Should contain exactly one '@'
    {
      condition: email.split("@").length !== 2,
      message: "Email format is invalid",
    },
    // Should match general email format
    {
      condition: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        email
      ),
      message: "Email format is invalid",
    },
    {
      condition: password.length < 8 || password.length > 20,
      message: "Password must be between 8 and 20 characters long",
    },
    {
      condition: !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },

    {
      condition: password !== password_confirm,
      message: "Password and Confirm Password do not match",
    },
    {
      condition: username.includes(" "),
      message: "Username cannot contain spaces",
    },
    {
      //Username should be alpha digit with dash, hyphen or dot only and limit in length (30 characters)
      condition: !/^[a-zA-Z0-9._-]{6,30}$/.test(username),

      message:
        "Username must be 6-30 characters with letters, numbers, dashes, hyphen, or dots only",
    },
  ];

  for (const { condition, message } of validations) {
    if (condition) {
      showModal(message);
      return;
    }
  }

  // Show loading spinner
  const spinner = document.getElementById("loading-spinner");
  const buttonText = document.querySelector(".signup-form__button-text");
  spinner.classList.remove("hidden");
  spinner.classList.remove("tbl:hidden");
  buttonText.textContent = "";

  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formFields),
    });

    if (response.ok) {
      const data = await response.json();
      showModal(data.message);
      document.getElementById("success-message").classList.remove("hidden");
      document.getElementsByClassName("signup")[0].classList.add("hidden");
    } else {
      const error = await response.json();
      showModal(error.message);
    }
  } catch (error) {
    console.error("Error during sign up:", error);
    showModal("Something went wrong. Please try again.");
  } finally {
    spinner.classList.add("hidden");
    spinner.classList.add("tbl:hidden");
    buttonText.textContent = "Sign Up";
  }
});
