window.addEventListener('resize', adjustHeadingWidth);
window.addEventListener('DOMContentLoaded', adjustHeadingWidth);

function adjustHeadingWidth() {
    const tabletBreakpoint = 700;
    const contentSection = document.querySelector('.content-section');
    const headingSection = document.querySelector('.heading__section');
    const contentBorder = document.querySelector('.content-border');

    if (window.innerWidth > tabletBreakpoint) {
        const contentWidth = window.getComputedStyle(contentSection).width;
        headingSection.style.minWidth = contentWidth;
        contentBorder.style.minWidth = contentWidth;
    } else {
        headingSection.style.minWidth = '';
    }
}

const createModal = document.querySelector('.create-post-modal');
const overlay = document.querySelector('.overlay');
const createBtn = document.querySelector('.create-btn');
const navUtilityCreate = document.querySelector('.nav-utility-create');
const cancelBtn = document.querySelector('.create-post__header__cancel-btn');
const confirmDeleteModal = document.querySelector('.confirm-delete');
const startThreadBtn = document.querySelector('.start-thread');
const edit_form = document.querySelector('.edit-profile');
const follower_popup = document.querySelector('.follower-popup');
function showModal() {
    if (!accessToken) {
        showPopup('popup');
    } else {
        createModal.classList.remove('hidden');
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}
function hideModal() {
    createModal.classList.add('hidden');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if (confirmDeleteModal) {
        confirmDeleteModal.classList.add('hidden');
    }
    if (edit_form) {
        edit_form.classList.add('hidden');
    }
    if (follower_popup) {
        follower_popup.classList.add('hidden');
    }
}
createBtn.addEventListener('click', showModal);
navUtilityCreate.addEventListener('click', showModal);
if (startThreadBtn) {
    startThreadBtn.addEventListener('click', showModal);
}
overlay.addEventListener('click', hideModal);
cancelBtn.addEventListener('click', hideModal);

const moreBtn = document.querySelector('.navbar__setting-btn--more');
const moreMenu = document.querySelector('.navbar__setting-more-menu');
if (moreBtn) {
    moreBtn.addEventListener('click', function () {
        moreMenu.style.display = 'flex';
    });

    document.addEventListener('click', function (event) {
        if (!moreMenu.contains(event.target) && !moreBtn.contains(event.target)) {
            moreMenu.style.display = 'none';
        }
    });
}
const moreBtnTbl = document.querySelector('.top-nav__right-setting');
const moreMenuTbl = document.querySelector('.top-nav__setting-more-menu');
if (moreBtnTbl) {
    moreBtnTbl.addEventListener('click', function () {
        moreMenuTbl.style.display = 'flex';
    });

    document.addEventListener('click', function (event) {
        if (!moreMenuTbl.contains(event.target) && !moreBtnTbl.contains(event.target)) {
            moreMenuTbl.style.display = 'none';
        }
    });
}
/////
// LOGOUT PC
const logoutBtn = document.getElementById('menu-logout');
const accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
    logoutBtn.classList.add('hidden');
} else {
    logoutBtn.classList.remove('hidden');
}

logoutBtn.addEventListener('click', async function () {
    // fetch api logout
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data) {
            // xóa access token và chuyển hướng về trang login
            localStorage.removeItem('accessToken');
            window.location.href = '/';
        }
    } catch (error) {
        console.error(error);
    }
});

// LOGOUT MOBILE
const logoutBtnMobile = document.getElementById('menu-logout-mb');
const logoutContentMB = document.querySelector('.menu__btn-text--logout');
const loginContentMB = document.querySelector('.menu__btn-text--login');
if (!accessToken) {
    //   logoutBtnMobile.classList.add("hidden");
    //     loginContentMB.classList.remove("hidden");
    //     logoutContentMB.classList.add("hidden");

    logoutContentMB.classList.add('hidden');
    loginContentMB.classList.remove('hidden');
}
{
    // nếu có access token thì hiện nút logout và ẩn nút login
    logoutContentMB.classList.remove('hidden');
    loginContentMB.classList.add('hidden');
}

logoutBtnMobile.addEventListener('click', async function () {
    // fetch api logout
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data) {
            // xóa access token và chuyển hướng về trang login
            localStorage.removeItem('accessToken');
            window.location.href = '/';
        }
    } catch (error) {
        console.error(error);
    }
});

// show popup
const showPopup = (id) => {
    const popup = document.getElementById(id);
    popup.classList.remove('hidden');
    // close popup when click outside
    window.onclick = (event) => {
        if (event.target == popup) {
            popup.classList.add('hidden');
        }
    };
};

// KHI CHƯA ĐĂNG NHẬP MÀ BẤM VÀO PROFILE VÀ ACTIVITY -> HIỆN POPUP
// hide popup
const hidePopup = (id) => {
    const popup = document.getElementById(id);
    popup.classList.add('hidden');
};
var continue_with_thread_button = document.querySelector('.continue_with_thread');
continue_with_thread_button.addEventListener('click', () => {
    window.location.href = '/auth/login';
});
// lấy ra element nav-utility-profile
const navUtilityProfile = document.querySelector('.nav-utility-profile');
// nếu bấm vào nút này thì chuyển hướng đến trang profile
navUtilityProfile.addEventListener('click', () => {
    // lấy ra access token từ localStorage
    const accessToken = localStorage.getItem('accessToken');
    // nếu không có access token thì hiện popup
    if (!accessToken) {
        showPopup('popup');
        return;
    } else {
        // nếu có access token thì chuyển hướng đến trang profile
        window.location.href = '/profile';
    }
});
// lấy ra element nav-utility-noti
const navUtilityActivity = document.querySelector('.nav-utility-noti');
// nếu bấm vào nút này thì chuyển hướng đến trang activity
navUtilityActivity.addEventListener('click', () => {
    // lấy ra access token từ localStorage
    const accessToken = localStorage.getItem('accessToken');
    // nếu không có access token thì hiện popup
    if (!accessToken) {
        showPopup('popup');
        return;
    } else {
        // nếu có access token thì chuyển hướng đến trang activity
        window.location.href = '/activity';
    }
});

// lấy ra element login_button
const login_button = document.querySelector('.login-btn');
// nếu bấm vào nút này thì chuyển hướng đến trang login
login_button.addEventListener('click', () => {
    window.location.href = '/auth/login';
});
// kiểm tra trang hiện tại đã đăng nhập hay chưa (tức là đã có access token còn hạn hay chưa), nếu có -> ẩn nút login

if (accessToken) {
    login_button.style.display = 'none';
}
const thread_start = document.querySelector('.start-thread');
// const accessToken = localStorage.getItem("accessToken");

if (thread_start && !accessToken) {
    thread_start.classList.add('hidden');
}
const create_btn = document.querySelector('.create-btn');
create_btn.addEventListener('click', () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        showPopup('popup');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('.create-post__info-post__status');
    const postButton = document.querySelector('.create-post__footer__post-btn');
    const imageInput = document.getElementById('imageInput');
    const selectedImage = document.getElementById('selectedImage');
    const imageContainer = document.querySelector('.create-post__info-post__img');
    const removeImageButton = document.querySelector('.create-post__info-post__remove-img');
    const loadingToast = document.querySelector('.loading-post-toast');
    const toastContent = document.querySelector('.toast__loading-content');

    const checkButtonState = () => {
        const hasContent = textarea.value.trim().length > 0 || !imageContainer.classList.contains('hidden');
        if (hasContent) {
            postButton.classList.replace('cursor-not-allowed', 'cursor-pointer');
            postButton.classList.replace('tbl:cursor-not-allowed', 'tbl:cursor-pointer');
            postButton.classList.remove('opacity-30');
            postButton.classList.remove('pointer-events-none');
            postButton.classList.add('pointer-events-auto');
        } else {
            postButton.classList.replace('tbl:cursor-pointer', 'tbl:cursor-not-allowed');
            postButton.classList.replace('cursor-pointer', 'cursor-not-allowed');
            postButton.classList.add('opacity-30');
            postButton.classList.remove('pointer-events-auto');
            postButton.classList.add('pointer-events-none');
        }
    };

    document.querySelector('.create-post__utilities-icon').addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                selectedImage.src = e.target.result;
                imageContainer.classList.remove('hidden');
                checkButtonState();
            };
            reader.readAsDataURL(file);
        }
    });

    removeImageButton.addEventListener('click', () => {
        selectedImage.src = '';
        imageContainer.classList.add('hidden');
        imageInput.value = '';
        checkButtonState();
    });

    textarea.addEventListener('input', checkButtonState);

    postButton.addEventListener('click', () => {
        createModal.classList.add('hidden');
        toastContent.innerText = 'Posting...';
        overlay.classList.add('hidden');
        loadingToast.classList.remove('hidden');
        let postContent = textarea.value.trim();
        const postImage = imageInput.files[0];

        if (postContent.length > 0 || postImage) {
            const formData = new FormData();
            postContent = postContent.replace(/<\/?script[^>]*>/gim, '');
            formData.append('post_quote', postContent);
            if (postImage) formData.append('post_image', postImage);

            fetch('/post/newpost', { method: 'POST', body: formData })
                .then((response) => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(() => {
                    loadingToast.classList.add('hidden');
                    window.location.reload();
                })
                .catch((error) => console.error('Error occurred:', error));
        } else {
            console.warn('Post content and image are both empty. Nothing to post.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const timeElements = document.querySelectorAll('.post-time-stamp');
    timeElements.forEach((element) => {
        const createdAt = new Date(element.getAttribute('data-created-at'));
        const now = new Date();
        const diffInSeconds = Math.floor((now - createdAt) / 1000);
        let timeAgo = '';

        if (diffInSeconds < 60) {
            timeAgo = `${diffInSeconds}s`;
        } else if (diffInSeconds < 3600) {
            timeAgo = `${Math.floor(diffInSeconds / 60)}m`;
        } else if (diffInSeconds < 86400) {
            timeAgo = `${Math.floor(diffInSeconds / 3600)}h`;
        } else {
            timeAgo = `${Math.floor(diffInSeconds / 86400)}d`;
        }

        element.innerText = timeAgo;
    });
});

//Hiển thị hoặc ẩn danh sách lọc
document.addEventListener('DOMContentLoaded', () => {
    const refreshOption = document.getElementById('refresh-option');
    const refreshList = document.getElementById('refresh-list');
    if (!refreshOption || !refreshList) return;
    // Hiển thị hoặc ẩn danh sách khi nhấn vào nút
    refreshOption.addEventListener('click', (event) => {
        event.stopPropagation(); // Ngăn không cho sự kiện lan ra ngoài
        const isVisible = refreshList.classList.contains('opacity-100');

        // Đặt trạng thái ẩn/hiện
        if (isVisible) {
            refreshList.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            refreshList.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
        } else {
            refreshList.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none');
            refreshList.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    });

    // Ẩn danh sách khi nhấn ra ngoài
    document.addEventListener('click', () => {
        refreshList.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        refreshList.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
    });
});

//more list của post
document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các nút và danh sách liên quan
    const buttons = document.querySelectorAll('.main-post-more-btn');

    buttons.forEach((button) => {
        const dropdown = button.querySelector('.main-post-more-list');

        // Gắn sự kiện click vào nút
        button.addEventListener('click', (event) => {
            event.stopPropagation();

            // Ẩn tất cả các danh sách khác
            buttons.forEach((btn) => {
                const otherDropdown = btn.querySelector('.main-post-more-list');
                if (otherDropdown !== dropdown) {
                    otherDropdown.style.display = 'none'; // Ẩn danh sách khác
                }
            });

            // Toggle trạng thái hiện/ẩn danh sách của nút hiện tại
            dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
        });
    });

    // Khi bấm ra ngoài, ẩn tất cả danh sách
    document.addEventListener('click', () => {
        buttons.forEach((button) => {
            const dropdown = button.querySelector('.main-post-more-list');
            dropdown.style.display = 'none'; // Ẩn tất cả danh sách
        });
    });
});

//clip link to clipboard
function copyLinkToClipboard(path) {
    const link = `${window.location.origin}${path}`;
    const loadingToast = document.querySelector('.loading-post-toast');
    const toastIcon = document.querySelector('.toast__loading-icon');
    const toastContent = document.querySelector('.toast__loading-content');
    toastIcon.classList.add('hidden');
    loadingToast.classList.remove('hidden');
    toastContent.innerText = 'Link copied to clipboard';
    setTimeout(() => {
        loadingToast.classList.add('hidden');
        toastIcon.classList.remove('hidden');
    }, 1000);
    navigator.clipboard.writeText(link);
}

//Like post
document.addEventListener('DOMContentLoaded', () => {
    const postLikes = document.querySelectorAll('.post-like');

    postLikes.forEach((postLike) => {
        postLike.addEventListener('click', (e) => {
            e.stopPropagation();
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                showPopup('popup');
                return;
            }

            const postId = postLike.id.replace('like-button-', ''); // Sửa biến `button` thành `postLike`
            const svg = postLike.querySelector('svg path');
            const likeNum = postLike.querySelector('.like-num');
            const currentLikes = parseInt(likeNum.textContent.trim(), 10);

            // Kiểm tra trạng thái hiện tại của nút
            if (svg.getAttribute('fill') === 'red') {
                // Nếu đã like thì gửi yêu cầu API để "unlike"
                fetch(`/post/like-post/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: postId, // Gửi postId trong request body
                        action: 'unlike', // Đưa thêm action để biết đây là yêu cầu unlike
                    }),
                });

                // Bỏ thích trên UI
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
                likeNum.textContent = currentLikes - 1; // Giảm số lượt thích
                if (likeNum.textContent === '0') likeNum.classList.add('hidden');
                likeNum.style.color = '#ccc';
            } else {
                // Nếu chưa thích thì gửi yêu cầu API để "like"
                fetch(`/post/like-post/${postId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: postId, // Gửi postId trong request body
                        action: 'like', // Đưa thêm action để biết đây là yêu cầu like
                    }),
                });

                // Thích trên UI
                svg.setAttribute('fill', 'red');
                svg.setAttribute('stroke', 'red');
                likeNum.textContent = currentLikes + 1; // Tăng số lượt thích
                if (likeNum.textContent !== '0') likeNum.classList.remove('hidden');
                likeNum.style.color = 'red';
            }
        });
    });
});

// xoá bài viết
const deletePostButtons = document.querySelectorAll('.delete-post');
deletePostButtons.forEach((deletePostButton) => {
    deletePostButton.addEventListener('click', (e) => {
        // Lấy các phần tử liên quan đến confirm delete và overlay
        const confirmDeleteBox = document.querySelector('.confirm-delete');
        const overlay = document.querySelector('.overlay');
        const confirmTitle = document.querySelector('.delete-title');
        confirmTitle.textContent = 'Delete post';
        const confirmContent = document.querySelector('.delete-content');
        confirmContent.textContent = "If you delete this post, you won't be able to restore it.";
        const confirmCancelBtn = document.querySelector('.confirm-cancel-btn');
        const confirmDeleteBtn = document.querySelector('.confirm-delete-btn');
        const loadingToast = document.querySelector('.loading-post-toast');
        const toastContent = document.querySelector('.toast__loading-content');

        // Hiển thị hộp xác nhận
        confirmDeleteBox.classList.remove('hidden');
        overlay.classList.remove('hidden');

        const postId = e.target.closest('.delete-post').getAttribute('post-id').split('-')[2];

        confirmCancelBtn.addEventListener('click', () => {
            confirmDeleteBox.classList.add('hidden');
            overlay.classList.add('hidden');
        });

        // Thêm sự kiện chỉ một lần cho button delete
        const handleDelete = async () => {
            loadingToast.classList.remove('hidden');
            toastContent.textContent = 'Deleting post...';
            try {
                await fetch(`/post/delete-post/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(() => {
                    loadingToast.classList.add('hidden');
                    const postContainer = e.target.closest('.post-container');
                    if (postContainer) {
                        postContainer.remove();
                    } else {
                        window.location.href = '/';
                    }
                    confirmDeleteBox.classList.add('hidden');
                    overlay.classList.add('hidden');
                });
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the post.');
            }
        };

        confirmDeleteBtn.addEventListener('click', handleDelete, { once: true });
    });
});
