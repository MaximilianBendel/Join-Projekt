async function showWelcomeScreen() {
    try {
        const activeUser = JSON.parse(localStorage.getItem('activeUser'));
        const hasShownWelcome = localStorage.getItem('hasShownWelcome');
        let userName = activeUser && activeUser.data.name ? activeUser.data.name : "Guest";

        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = userName;
        }

        if (window.innerWidth <= 1350 && hasShownWelcome === 'false') {
            const welcomeScreen = document.getElementById('welcomeScreen');
            const summaryContent = document.querySelector('.rightSide');
            if (welcomeScreen && summaryContent) {
                summaryContent.style.visibility = 'hidden'; // Temporarily hide the summary content

                welcomeScreen.classList.add('active');

                setTimeout(() => {
                    welcomeScreen.classList.remove('active');
                    welcomeScreen.classList.add('hidden');
                    summaryContent.style.visibility = 'visible'; // Show the summary content
                }, 3500); // 2.5s visible + 1s fade out

                localStorage.setItem('hasShownWelcome', 'true');
            }
        } else {
            const summaryContent = document.querySelector('.rightSide');
            if (summaryContent) {
                summaryContent.style.visibility = 'visible';
            }
        }
    } catch (error) {
        // Error handling can be improved by displaying a user-friendly message in the UI or taking appropriate action
    }
}
