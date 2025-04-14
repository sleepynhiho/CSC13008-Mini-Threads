document.querySelectorAll('.post-username').forEach((username) => {
    const userCard = username.querySelector('.user-card');

    username.addEventListener('mouseenter', () => {
        userCard.classList.remove('hidden');
        userCard.classList.remove('opacity-0');
        userCard.classList.add('opacity-100');
    });

    username.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!userCard.matches(':hover')) {
                userCard.classList.add('opacity-0');
                userCard.classList.remove('opacity-100');
                userCard.classList.add('hidden');
            }
        }, 100);
    });

    userCard.addEventListener('mouseleave', () => {
        userCard.classList.add('opacity-0');
        userCard.classList.remove('opacity-100');
        userCard.classList.add('hidden');
    });
});

document.querySelectorAll('.close-user').forEach((button) => {
    button.addEventListener('click', function (e) {
        e.stopPropagation();

        const suggestionProfile = button.closest('.suggestion-profile');

        if (suggestionProfile) {
            suggestionProfile.remove();
        }
    });
});

// Xử lý sự kiện click vào nút follow/unfollow
document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.querySelectorAll('.suggest-follow-btn');
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
                            btn.classList.remove('text-black');
                            btn.classList.add('text-[#777777]');
                            btn.classList.remove('bg-white');
                            btn.classList.add('bg-[#1E1E1E]');
                        } else {
                            btn.innerText = 'Follow';
                            btn.classList.add('text-black');
                            btn.classList.remove('text-[#777777]');
                            btn.classList.add('bg-white');
                            btn.classList.remove('bg-[#1E1E1E]');
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });
    });
});
