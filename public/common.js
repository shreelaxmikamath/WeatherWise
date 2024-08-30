document.addEventListener('DOMContentLoaded', () => {
    // Create the loading screen iframe
    const loadingScreen = document.createElement('iframe');
    loadingScreen.src = 'loading.html'; // Path to your loading screen HTML
    loadingScreen.style.position = 'fixed';
    loadingScreen.style.top = '0';
    loadingScreen.style.left = '0';
    loadingScreen.style.width = '100vw';  // Full viewport width
    loadingScreen.style.height = '100vh'; // Full viewport height
    loadingScreen.style.border = 'none';  // No border
    loadingScreen.style.zIndex = '9999';  // Ensure it's on top
    loadingScreen.style.overflow = 'hidden'; // Prevent scrollbars
    loadingScreen.style.transition = 'opacity 5s'; // Smooth transition
    loadingScreen.style.opacity = '1'; // Ensure loading screen is visible
    document.body.appendChild(loadingScreen);

    // Hide the loading screen after the window has loaded
    window.addEventListener('load', () => {
        loadingScreen.style.opacity = '0'; // Fade out
        setTimeout(() => {
            document.body.removeChild(loadingScreen); // Remove from view
        }, 1000); // Match the fade-out duration
    });
});
