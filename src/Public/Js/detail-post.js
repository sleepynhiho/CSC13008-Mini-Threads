// Lấy các phần tử cần thiết
const mainPostMoreBtn = document.querySelector('.view-activity-btn');
const postActivityWrapper = document.querySelector('.post-activity-wrapper');
const postActivityBackBtn = document.querySelector('.post-activity-back-btn');

// Hiển thị `post-activity-wrapper` khi bấm vào `view-activity-btn`
if (mainPostMoreBtn) {
    mainPostMoreBtn.addEventListener('click', () => {
        postActivityWrapper.classList.remove('hidden'); // Bỏ `hidden`
        postActivityWrapper.classList.add('flex'); // Thêm `flex`

        // Thêm class `overflow-hidden` vào <body> để chặn cuộn trang
        document.body.classList.add('overflow-hidden');
    });
}
// Ẩn `post-activity-wrapper` khi bấm vào `post-activity-back-btn` hoặc ngoài `post-activity`
if (postActivityWrapper) {
    postActivityWrapper.addEventListener('click', (event) => {
        // Kiểm tra nếu bấm ngoài vùng `post-activity` hoặc bấm vào nút Back
        if (
            event.target === postActivityWrapper || // Bấm ngoài vùng `post-activity`
            event.target.closest('.post-activity-back-btn') // Bấm vào nút Back
        ) {
            postActivityWrapper.classList.add('hidden'); // Thêm `hidden`
            postActivityWrapper.classList.remove('flex'); // Bỏ `flex`

            // Xóa class `overflow-hidden` khỏi <body> khi đóng modal
            document.body.classList.remove('overflow-hidden');
        }
    });
}

// Lấy các phần tử cần dùng
const moreButton = document.querySelector('.main-post-more-btn');
const moreList = document.querySelector('.main-post-more-list');

// Hàm để hiển thị và ẩn danh sách
function toggleMoreList(event) {
    if (moreList.classList.contains('flex')) {
        moreList.classList.remove('flex');
        moreList.classList.add('hidden');
    } else {
        moreList.classList.remove('hidden');
        moreList.classList.add('flex');
    }
}

// Ẩn danh sách khi bấm ra ngoài hoặc cuộn
document.addEventListener('click', (event) => {
    if (!moreButton.contains(event.target)) {
        moreList.style.display = 'none';
    }
});

// Thêm sự kiện click vào nút More để hiển thị danh sách
moreButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    toggleMoreList();
});

document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các nút và danh sách liên quan
    const buttons = document.querySelectorAll('.replies-post-more-btn');

    buttons.forEach((button) => {
        const dropdown = button.querySelector('.replies-post-more-list');

        // Gắn sự kiện click vào nút
        button.addEventListener('click', (event) => {
            event.stopPropagation();

            // Ẩn tất cả các danh sách khác
            buttons.forEach((btn) => {
                const otherDropdown = btn.querySelector('.replies-post-more-list');
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
            const dropdown = button.querySelector('.replies-post-more-list');
            dropdown.style.display = 'none'; // Ẩn tất cả danh sách
        });
    });
});

// Like và unlike comment
document.addEventListener('DOMContentLoaded', () => {
    const commentLikes = document.querySelectorAll('.like-comment');

    commentLikes.forEach((likeButton) => {
        likeButton.addEventListener('click', () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                showPopup('popup');
                return;
            }

            const commentId = likeButton.id.replace('like-comment-', '');
            const svg = likeButton.querySelector('svg path');
            const likeNum = likeButton.querySelector('.like-comment-num');
            const currentLikes = parseInt(likeNum.textContent.trim(), 10) || 0;

            if (svg.getAttribute('fill') === 'red') {
                // Unlike comment
                fetch(`/post/like-comment/${commentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'unlike' }),
                }).then(() => {
                    svg.setAttribute('fill', 'none');
                    svg.setAttribute('stroke', 'currentColor');
                    likeNum.textContent = currentLikes - 1;
                    likeNum.style.color = '#ccc';
                    if (currentLikes - 1 === 0) likeNum.classList.add('hidden');
                });
            } else {
                // Like comment
                fetch(`/post/like-comment/${commentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'like' }),
                }).then(() => {
                    svg.setAttribute('fill', 'red');
                    svg.setAttribute('stroke', 'red');
                    likeNum.textContent = currentLikes + 1;
                    likeNum.style.color = 'red';
                    likeNum.classList.remove('hidden');
                });
            }
        });
    });
});

// Xoá comment
document.querySelectorAll('.delete-comment').forEach((deleteCommentButton) => {
    deleteCommentButton.addEventListener('click', (e) => {
        const commentNum = document.querySelector('.comment-num');

        // Lấy các phần tử liên quan đến confirm delete và overlay
        const confirmDeleteBox = document.querySelector('.confirm-delete');
        const overlay = document.querySelector('.overlay');
        const confirmTitle = document.querySelector('.delete-title');
        confirmTitle.textContent = 'Delete comment';
        const confirmContent = document.querySelector('.delete-content');
        confirmContent.textContent = "If you delete this comment, you won't be able to restore it.";
        const confirmCancelBtn = document.querySelector('.confirm-cancel-btn');
        const confirmDeleteBtn = document.querySelector('.confirm-delete-btn');
        const loadingToast = document.querySelector('.loading-post-toast');
        const toastContent = document.querySelector('.toast__loading-content');

        // Hiển thị hộp xác nhận
        confirmDeleteBox.classList.remove('hidden');
        overlay.classList.remove('hidden');

        const commentId = e.target.closest('.delete-comment').getAttribute('comment-id').split('-')[2];

        // Sự kiện hủy bỏ
        confirmCancelBtn.addEventListener('click', () => {
            confirmDeleteBox.classList.add('hidden');
            overlay.classList.add('hidden');
        });

        // Thêm sự kiện chỉ một lần cho button delete
        const handleDelete = async () => {
            loadingToast.classList.remove('hidden');
            toastContent.textContent = 'Deleting comment...';

            try {
                // Gửi yêu cầu DELETE đến server
                await fetch(`/post/delete-comment/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(() => {
                    loadingToast.classList.add('hidden');
                    const commentContainer = document.querySelector(`#comment-${commentId}`);
                    if (commentContainer) {
                        commentContainer.remove();
                    }
                    confirmDeleteBox.classList.add('hidden');
                    overlay.classList.add('hidden');
                    commentNum.textContent = parseInt(commentNum.textContent, 10) - 1;
                });
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the comment.');
            }
        };

        confirmDeleteBtn.addEventListener('click', handleDelete, { once: true });
    });
});

// Xử lý sự kiện click vào nút follow/unfollow
document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.querySelectorAll('.user-liked-follow-btn');
    followBtn.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const userId = btn.getAttribute('follow-id').replace('follow-', '');
            const followText = btn.innerText;
            fetch(`/profile/follow/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
                .then((response) => {
                    if (response.ok) {
                        if (followText === 'Follow') {
                            btn.innerText = 'Following';
                            btn.style.color = '#777777';
                        } else {
                            btn.innerText = 'Follow';
                            btn.style.color = '#f3f5f7';
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    });
});
