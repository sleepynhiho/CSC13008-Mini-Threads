// Lấy các phần tử cần thiết từ DOM
const inputField = document.querySelector('.reset-password__form-input');
const sendButton = document.getElementById('sendLoginLinkButton');
const spinner = document.getElementById('loading-spinner');
const buttonText = document.querySelector('.send-button-text');

// Hàm hiển thị trạng thái loading và khóa nút gửi
function toggleLoadingState(isLoading) {
    sendButton.disabled = isLoading;
    spinner.classList.toggle('hidden', !isLoading);
    spinner.classList.toggle('tbl:hidden', !isLoading);
    buttonText.textContent = isLoading ? '' : 'Send login link';
}

// Hàm gửi yêu cầu reset mật khẩu
async function handleSendButtonClick() {
    toggleLoadingState(true);

    try {
        const response = await fetch('/auth/forgotPassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: inputField.value.trim() }),
        });

        if (response.ok) {
            showModal('We have sent you a link to reset your password. Please check your email.');
        } else {
            showModal('This email address is not associated with any account.');
        }
    } catch (error) {
        showModal('An error occurred. Please try again.');
        console.error('Error during password reset request:', error);
    } finally {
        toggleLoadingState(false);
    }
}

// Kích hoạt hoặc vô hiệu hóa nút gửi dựa trên giá trị input
function handleInputChange() {
    sendButton.disabled = inputField.value.trim() === '';
}

// Hiển thị modal thông báo
function showModal(message) {
    const modalMessage = document.getElementById('modal-message');
    const modal = document.getElementById('modal-popup');

    modalMessage.textContent = message;
    modal.classList.remove('hidden');
    modal.style.opacity = '1';
    modal.style.transform = 'translateY(0)';

    setTimeout(hideModal, 4000); // Tự động ẩn sau 4 giây
}

// Ẩn modal thông báo
function hideModal() {
    const modal = document.getElementById('modal-popup');

    modal.style.opacity = '0';
    modal.style.transform = 'translateY(100%)';

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 500); // Đợi hoàn thành hiệu ứng trước khi ẩn
}

// Gắn sự kiện cho các phần tử
sendButton.addEventListener('click', handleSendButtonClick);
inputField.addEventListener('input', handleInputChange);

// Kiểm tra trạng thái nút gửi khi trang tải
handleInputChange();
