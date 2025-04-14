var button_done = document.querySelector('.edit-profile__button');
var mobile_cancel_btn = document.querySelector('.edit-info__cancel');
var edit = document.querySelector('.edit-btn');
var profile_info = document.querySelector('.profile__info');
var top_nav_right_setting = document.querySelector('.top-nav__right-setting');
var profile_follower = document.querySelector('.information__follower');
var close_follower = document.querySelector('.follower-popup__header__close-btn');

if (close_follower) {
    close_follower.addEventListener('click', function () {
        overlay.classList.add('hidden');
        follower_popup.classList.add('hidden');
    });
}

if (profile_follower) {
    profile_follower.addEventListener('click', function () {
        overlay.classList.remove('hidden');
        follower_popup.classList.remove('hidden');
    });
}

if (mobile_cancel_btn) {
    mobile_cancel_btn.addEventListener('click', function () {
        edit_form.classList.add('hidden');
        overlay.classList.add('hidden');
    });
}

// click button edit -> display form and overlay block
if (edit) {
    edit.addEventListener('click', function () {
        //kiểm tra thiết thị
        if (window.innerWidth < 700) {
            // add class hidden to form block
            edit_form.classList.remove('hidden');
            top_nav_right_setting.classList.add('hidden');
        } else {
            // remove class hidden to display form block
            edit_form.classList.remove('hidden');
            overlay.classList.remove('hidden');
        }
    });
}

window.addEventListener('resize', function () {
    if (window.innerWidth < 700) {
        if (!edit_form.classList.contains('hidden')) {
            overlay.classList.add('hidden');
        }
    } else {
        if (!edit_form.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các nút follow có id bắt đầu bằng 'follow-'
    const followButtons = document.querySelectorAll('[id^="follow-"]');

    followButtons.forEach((followButton) => {
        followButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngừng sự kiện lan truyền

            const userId = followButton.id.replace('follow-', '');

            fetch(`/profile/follow/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
                .then((response) => {
                    if (response.ok) {
                        // Cập nhật tất cả các nút có cùng userId sau khi gọi API thành công
                        const allFollowButtons = document.querySelectorAll(`[id^="follow-${userId}"]`);

                        allFollowButtons.forEach((button) => {
                            const buttonText = button.querySelector('span') || button; // Nếu có span thì lấy text từ span, nếu không lấy trực tiếp button text
                            const followersCountText = button.closest('.user-profile__info').querySelector('.user-profile__followers-count');
                            const currentFollowersCount = parseInt(followersCountText.textContent.trim(), 10);

                            if (buttonText.textContent === 'Following') {
                                buttonText.textContent = 'Follow';
                                button.style.color = '#f3f5f7';
                                followersCountText.textContent = `${currentFollowersCount - 1} followers`;
                            } else {
                                buttonText.textContent = 'Following';
                                button.style.color = '#777777';
                                followersCountText.textContent = `${currentFollowersCount + 1} followers`;
                            }
                        });
                    } else {
                        alert('Failed to follow');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('An error occurred');
                });
        });
    });
});

function handleFollowClick(userId, event) {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        showPopup('popup');
        return;
    }

    event.stopPropagation();
    fetch(`/profile/follow/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
    })
        .then((response) => {
            if (response.ok) {
                window.location.reload();
                //document.querySelector('.follow-btn1 p').textContent = 'Following';
            } else {
                alert('Failed to follow');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred');
        });
}
