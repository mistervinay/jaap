const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebarMenu = document.getElementById("sidebarMenu");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");

hamburgerBtn.addEventListener("click", () => {
    sidebarMenu.classList.add("open");
    hamburgerBtn.classList.add("open");
    sidebarOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
});
function closeSidebar() {
    sidebarMenu.classList.remove("open");
    hamburgerBtn.classList.remove("open");
    sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
}
closeSidebarBtn.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
});

// tabs js 
clickTab.addEventListener("click", () => {
    clickTab.classList.add("active");
    historyTab.classList.remove("active");
    clickContent.classList.remove("hidden");
    historyContent.classList.add("hidden");
});

historyTab.addEventListener("click", () => {
    historyTab.classList.add("active");
    clickTab.classList.remove("active");
    clickContent.classList.add("hidden");
    historyContent.classList.remove("hidden");
    updateHistory();
});

// Sidebar menu actions
document.querySelectorAll('#sidebarMenu a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const action = this.getAttribute('data-action');
        closeSidebar();

        if (action === 'home') {
            clickTab.click();
        } else if (action === 'history') {
            historyTab.click();
        } else if (action === 'settings') {
            openSettingsPopup();
        }
    });
});

// Settings popup logic
function openSettingsPopup() {
    let popup = document.getElementById('settingsPopup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'settingsPopup';
        popup.innerHTML = `
            <div class="settings-popup-overlay"></div>
            <div class="settings-popup-content">
                <h2>Settings</h2>
                <label>
                    Jaap Mantra:
                    <input type="text" id="mantraInput" value="${localStorage.getItem('jaapMantra') || 'Om'}" />
                </label>
                <label>
                    Show Mantra:
                    <select id="showMantraSelect">
                        <option value="on">Show</option>
                        <option value="off">Hide</option>
                    </select>
                </label>
                <label>
                    Background Music:
                    <select id="bgSoundSelect">
                        <option value="on">On</option>
                        <option value="off">Off</option>
                    </select>
                </label>
                <label>
                    Vibrate on Click:
                    <select id="vibrateSelect">
                        <option value="on">On</option>
                        <option value="off">Off</option>
                    </select>
                </label>
                <button id="saveSettingsBtn">Save</button>
                <button id="closeSettingsBtn">Close</button>
            </div>
        `;
        document.body.appendChild(popup);

        // Set initial values
        document.getElementById('bgSoundSelect').value = localStorage.getItem('musicPlaying') === 'false' ? 'off' : 'on';
        document.getElementById('vibrateSelect').value = localStorage.getItem('vibrate') === 'off' ? 'off' : 'on';
        document.getElementById('showMantraSelect').value = localStorage.getItem('showMantra') === 'off' ? 'off' : 'on';

        // Save settings
        document.getElementById('saveSettingsBtn').onclick = function () {
            localStorage.setItem('jaapMantra', document.getElementById('mantraInput').value);

            // Save for 1 year (store timestamp)
            localStorage.setItem('musicPlaying', document.getElementById('bgSoundSelect').value === 'on' ? 'true' : 'false');
            localStorage.setItem('musicPlaying_ts', Date.now());
            localStorage.setItem('vibrate', document.getElementById('vibrateSelect').value === 'on' ? 'on' : 'off');
            localStorage.setItem('vibrate_ts', Date.now());
            localStorage.setItem('showMantra', document.getElementById('showMantraSelect').value);

            // Sync music toggle and mantra display immediately
            syncMusicToggle();
            updateMantraDisplay();
            alert('Settings saved!');
            closeSettingsPopup();
        };
        document.getElementById('closeSettingsBtn').onclick = closeSettingsPopup;
        popup.querySelector('.settings-popup-overlay').onclick = closeSettingsPopup;
    }
    popup.style.display = 'block';
}

function closeSettingsPopup() {
    const popup = document.getElementById('settingsPopup');
    if (popup) popup.style.display = 'none';
}

// Helper to sync music toggle button with setting
function syncMusicToggle() {
    let isMusicPlaying = localStorage.getItem('musicPlaying') !== 'false';
    if (typeof updateMusicState === 'function') {
        updateMusicState();
    }
    // Optionally update the select in popup if open
    const bgSoundSelect = document.getElementById('bgSoundSelect');
    if (bgSoundSelect) {
        bgSoundSelect.value = isMusicPlaying ? 'on' : 'off';
    }
}