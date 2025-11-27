// ================================
// Shared Supabase Auth for ACS PRO
// ================================
// ===============================
// Supabase Global Client
// ===============================

const SUPABASE_URL = "https://splyctvmbihdllbomrpg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbHljdHZtYmloZGxsYm9tcnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDg5MjYsImV4cCI6MjA3OTA4NDkyNn0.X5jMJVi5ZfOPAHorRuPlGWXS1tEke2DdNYXBTTf37Vw";

// Create global Supabase client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch current user once
async function getCurrentUser() {
  const { data: userData, error } = await window.supabaseClient.auth.getUser();
  if (error) {
    console.error("Supabase auth error:", error);
    return null;
  }
  return userData?.user || null;
}

// Make it globally available
window.getCurrentUser = getCurrentUser;

// --------------- CONFIG ---------------


// =======================================
// Inject CSS (desktop + mobile)
// =======================================
function injectAuthStyles() {
  if (document.getElementById("acs-auth-style")) return;

  const css = `
    #user-bar {
      position: relative;
      z-index: 9999;
    }

    .acs-bar {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: rgba(15,23,42,0.9);
      border-radius: 999px;
      padding: 8px 16px;
      border: 1px solid rgba(148,163,184,0.4);
      box-shadow: 0 14px 35px rgba(15,23,42,0.9);
      backdrop-filter: blur(18px);
    }

    .acs-left {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      cursor: pointer;
    }

    .acs-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .acs-chip-link {
      font-size: 13px;
      color: #e5e7eb;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid rgba(148,163,184,0.4);
      text-decoration: none;
      white-space: nowrap;
    }

    .acs-main-menu-btn {
      font-size: 13px;
      color: #e5e7eb;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid rgba(148,163,184,0.4);
      background: rgba(15,23,42,0.9);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .acs-notif-btn {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      border: 1px solid rgba(148,163,184,0.4);
      background: rgba(15,23,42,0.9);
      color: #e5e7eb;
      font-size: 15px;
      cursor: pointer;
    }

    .acs-logout-btn {
      padding: 6px 16px;
      border: none;
      border-radius: 999px;
      background: linear-gradient(90deg,#38bdf8,#6366f1);
      color: white;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
    }

    .acs-user-hello {
      color: #cbd5f5;
      font-size: 13px;
    }

    .acs-user-name {
      color: #e5e7eb;
      font-weight: 600;
      font-size: 15px;
    }

    .acs-workspace-label {
      color: #9ca3af;
      font-size: 11px;
      margin-top: 2px;
    }

    /* MOBILE */
    @media (max-width: 768px) {
      .acs-bar {
        max-width: 100%;
        margin: 0 8px;
        padding: 6px 10px;
        gap: 8px;
      }

      /* Hide desktop-only items */
      .acs-desktop-only {
        display: none !important;
      }

      .acs-main-menu-btn {
        padding: 6px 10px;
      }

      .acs-user-name {
        font-size: 14px;
      }

      .acs-workspace-label {
        display: none;
      }
    }

    /* MENU ITEMS */
    .acs-btn-row {
      width: 100%;
      background: transparent;
      border: none;
      padding: 8px 6px;
      text-align: right;
      color: #e5e7eb;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .acs-btn-row:hover {
      background: rgba(255,255,255,0.06);
    }
  `;

  const tag = document.createElement("style");
  tag.id = "acs-auth-style";
  tag.textContent = css;
  document.head.appendChild(tag);
}

// =======================================
// SMART MENU: dropdown or bottom sheet
// =======================================
function openMenu(menuEl, triggerBtn) {
  if (!menuEl || !triggerBtn) return;

  const rect = triggerBtn.getBoundingClientRect();
  const top = rect.top;
  const screenH = window.innerHeight;
  const isMobile = window.innerWidth <= 768;

  // Reset
  menuEl.style.position = "";
  menuEl.style.left = "";
  menuEl.style.right = "";
  menuEl.style.bottom = "";
  menuEl.style.top = "";
  menuEl.style.borderRadius = "16px";
  menuEl.style.margin = "";
  menuEl.style.maxWidth = "";
  menuEl.style.transform = "";
  menuEl.style.opacity = "0";

  // Always open DOWN (fixed)
  const shouldOpenDropdown = true;

  // DESKTOP or TOP → DROPDOWN
  if (!isMobile || shouldOpenDropdown) {
    menuEl.style.position = "absolute";
    menuEl.style.top = "110%";
    menuEl.style.right = "0";
    menuEl.style.display = "block";

    // MOBILE FIX: vertical scroll + fixed height
    if (isMobile) {
      menuEl.style.maxHeight = "300px";
      menuEl.style.overflowY = "auto";
      menuEl.style.webkitOverflowScrolling = "touch";
    }

    requestAnimationFrame(() => {
      menuEl.style.opacity = "1";
      menuEl.style.transform = "translateY(6px)";
    });
    return;
  }
}

function closeMenu(menuEl) {
  if (!menuEl || menuEl.style.display !== "block") return;

  menuEl.style.opacity = "0";
  menuEl.style.transform = "translateY(10px)";
  setTimeout(() => {
    menuEl.style.display = "none";
  }, 150);
}
// =======================================
// USER BAR (UI GENERATION)
// =======================================
function renderUserBar(user) {
  const bar = document.getElementById("user-bar");
  if (!bar) return;

  if (!user) {
    bar.innerHTML = "";
    return;
  }

  const email = user.email || "";
  const meta = user.user_metadata || {};
  const fullName =
    meta.full_name ||
    meta.name ||
    (email.includes("@") ? email.split("@")[0] : "عميل ACS PRO");

  let workspaceName =
    localStorage.getItem("acs_current_workspace") || "الافتراضية";

  bar.innerHTML = `
    <div class="acs-bar">
      <!-- LEFT: Avatar + name -->
      <div id="acsAvatarArea" class="acs-left">
        <img id="acsAvatarImage" src="/auth/wolf.png"
          style="width:40px;height:40px;border-radius:50%;object-fit:cover;box-shadow:0 0 10px rgba(56,189,248,0.8);"
        />
        <div>
          <span class="acs-user-hello">مرحباً،</span>
          <span id="acsUserNameLabel" class="acs-user-name">${fullName}</span>
          <span id="acsWorkspaceLabel" class="acs-workspace-label">المساحة: ${workspaceName}</span>
        </div>

        <!-- PROFILE MENU -->
        <div id="acsProfileMenu" style="
          position:absolute;top:110%;right:0;
          background:rgba(15,23,42,0.98);
          backdrop-filter:blur(18px);
          border-radius:16px;border:1px solid rgba(148,163,184,0.45);
          padding:8px 0;min-width:240px;display:none;
          z-index:999999;max-height:300px;overflow-y:auto;
          opacity:0;transform:translateY(10px);
          transition:opacity .18s,transform .18s;
        ">
          <div style="padding:6px 12px;border-bottom:1px solid rgba(148,163,184,0.3);">
            <div style="font-size:12px;color:#9ca3af;">الملف الشخصي</div>
            <button id="acsProfileWorkspace" class="acs-btn-row">🔁 تبديل المساحة</button>
            <button id="acsProfileUploadAvatar" class="acs-btn-row">📤 رفع صورة</button>
            <button id="acsProfileAccount" class="acs-btn-row">👤 حسابي</button>
          </div>

          <div style="padding:6px 12px;">
            <button id="acsProfileLogout" style="
              width:100%;padding:8px 6px;text-align:right;
              border:none;background:transparent;color:#f97373;
              cursor:pointer;font-size:13px;
            ">🚪 تسجيل الخروج</button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Desktop nav + main menu -->
      <div class="acs-right">
        <a href="/" class="acs-chip-link acs-desktop-only">الصفحة الرئيسية</a>
        <a href="/dashboard/" class="acs-chip-link acs-desktop-only">لوحة التحكم</a>
        <a href="/settings/" class="acs-chip-link acs-desktop-only">الإعدادات</a>

        <!-- MAIN MENU BUTTON -->
        <div style="position:relative;">
          <button id="acsMainMenuBtn" class="acs-main-menu-btn">القائمة ▾</button>

          <!-- MEGA MENU -->
          <div id="acsMainMenu" style="
            position:absolute;top:110%;right:0;
            background:rgba(15,23,42,0.98);
            backdrop-filter:blur(18px);
            border-radius:16px;border:1px solid rgba(148,163,184,0.45);
            padding:10px 0;min-width:280px;display:none;
            z-index:999999;max-height:300px;overflow-y:auto;
            opacity:0;transform:translateY(10px);
            transition:opacity .18s,transform .18s;
          ">
            <div style="padding:6px 12px;border-bottom:1px solid rgba(148,163,184,0.25);">
              <div style="font-size:12px;color:#9ca3af;">المحتوى</div>
              <button id="acsMenuMyBots" class="acs-btn-row">🤖 البوتات الخاصة بي</button>
              <button id="acsMenuCourses" class="acs-btn-row">📚 الدورات التعليمية</button>
            </div>

            <div style="padding:6px 12px;border-bottom:1px solid rgba(148,163,184,0.25);">
              <div style="font-size:12px;color:#9ca3af;">أدوات المطور</div>
              <button id="acsMenuDocs" class="acs-btn-row">📝 مستندات API</button>
              <button id="acsMenuDevExtra" class="acs-btn-row">🧰 أدوات متقدمة</button>
            </div>

            <div style="padding:6px 12px;">
              <div style="font-size:12px;color:#9ca3af;">الدعم</div>
              <button id="acsMenuHelp" class="acs-btn-row">❓ مساعدة</button>
              <button id="acsMenuSupport" class="acs-btn-row">📞 خدمة العملاء</button>
            </div>
          </div>
        </div>

        <!-- Notification (desktop only) -->
        <button id="acsNotifBtn" class="acs-notif-btn acs-desktop-only">🔔</button>

        <input id="acsAvatarFileInput" type="file" accept="image/*" style="display:none;" />
        <button onclick="logout()" class="acs-logout-btn acs-desktop-only">تسجيل الخروج</button>
      </div>
    </div>
  `;

  setupMenus(workspaceName);
}

// =======================================
// INTERACTIVITY
// =======================================
function setupMenus(initialWorkspace) {
  const avatarArea = document.getElementById("acsAvatarArea");
  const profileMenu = document.getElementById("acsProfileMenu");
  const mainMenu = document.getElementById("acsMainMenu");
  const mainMenuBtn = document.getElementById("acsMainMenuBtn");
  const notifBtn = document.getElementById("acsNotifBtn");
  const notifMenu = document.getElementById("acsNotificationsMenu");
  const avatarImg = document.getElementById("acsAvatarImage");
  const fileInput = document.getElementById("acsAvatarFileInput");
  const workspaceLabel = document.getElementById("acsWorkspaceLabel");

  let workspace = initialWorkspace;

  function toggle(menu, trigger) {
    if (!menu) return;
    const open = menu.style.display === "block";
    closeMenu(profileMenu);
    closeMenu(mainMenu);
    if (notifMenu) notifMenu.style.display = "none";
    if (!open) openMenu(menu, trigger);
  }

  avatarArea.addEventListener("click", e => {
    e.stopPropagation();
    toggle(profileMenu, avatarArea);
  });

  mainMenuBtn.addEventListener("click", e => {
    e.stopPropagation();
    toggle(mainMenu, mainMenuBtn);
  });

  if (notifBtn) {
    notifBtn.addEventListener("click", e => {
      e.stopPropagation();
      notifMenu.style.display =
        notifMenu.style.display === "block" ? "none" : "block";
    });
  }

  const byId = id => document.getElementById(id);

  byId("acsMenuMyBots").onclick =
    () => (window.location.href = "/dashboard/");
  byId("acsMenuCourses").onclick =
    () => alert("📚 سيتم إضافة الدورات التعليمية قريباً.");
  byId("acsMenuDocs").onclick =
    () => alert("📘 سيتم إضافة مستندات الـ API قريباً.");
  byId("acsMenuDevExtra").onclick =
    () => alert("🧰 سيتم إضافة أدوات المتقدمة قريباً.");
  byId("acsMenuHelp").onclick =
    () => alert("❓ سيتم إضافة صفحة المساعدة قريباً.");
  byId("acsMenuSupport").onclick =
    () => alert("📞 سيتم إضافة خدمة العملاء قريباً.");

  byId("acsProfileWorkspace").onclick = () => {
    const list = ["الافتراضية", "متجر الرياض", "فندق جدة"];
    const next = list[(list.indexOf(workspace) + 1) % list.length];
    workspace = next;
    workspaceLabel.textContent = "المساحة: " + next;
    localStorage.setItem("acs_current_workspace", next);
    closeMenu(profileMenu);
  };

  byId("acsProfileUploadAvatar").onclick = () => fileInput.click();

  fileInput.onchange = e => {
    const file = e.target.files[0];
    if (file) avatarImg.src = URL.createObjectURL(file);
    closeMenu(profileMenu);
  };

  byId("acsProfileAccount").onclick =
    () => (window.location.href = "/auth/account.html");

  byId("acsProfileLogout").onclick = () => logout();

  document.addEventListener("click", () => {
    closeMenu(profileMenu);
    closeMenu(mainMenu);
  });
}

// =======================================
// NAV CTA UPDATE
// =======================================
function applyAuthUIForNav(user) {
  const loggedIn = !!user;

  const loginLinks = document.querySelectorAll(
    'a[href$="auth/login.html"], a[href$="/auth/login.html"]'
  );

  const signupLinks = document.querySelectorAll(
    'a[href="auth/signup.html"], a[href$="/auth/signup.html"]'
  );

  if (loggedIn) {
    signupLinks.forEach(el => (el.style.display = "none"));
    loginLinks.forEach(el => {
      el.textContent = "حسابي";
      el.href = "/auth/account.html";
    });
  } else {
    loginLinks.forEach(el => {
      el.textContent = "تسجيل الدخول";
      el.href = "/auth/login.html";
    });
    signupLinks.forEach(el => (el.style.display = ""));
  }
}

// =======================================
// LOGOUT
// =======================================
async function logout() {
  try {
    await window.supabaseClient.auth.signOut();
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    window.location.href = "/";
  }
}

// =======================================
// INIT
// =======================================
async function initAuthUI() {
  injectAuthStyles();

  let user = null;
  try {
    const { data } = await window.supabaseClient.auth.getUser();
    if (data && data.user) user = data.user;
  } catch (e) {
    console.error("getUser failed:", e);
  }

  renderUserBar(user);
  applyAuthUIForNav(user);
}

document.addEventListener("DOMContentLoaded", initAuthUI);
// =====================================================
// ACS PRO – Auth Helpers for Bots and Dashboard
// =====================================================

window.acsAuth = window.acsAuth || {};

/**
 * Get current logged-in user.
 */
window.acsAuth.getCurrentUser = async function () {
  try {
    const { data, error } = await window.supabaseClient.auth.getUser();
    if (error) {
      console.error("[acsAuth] getCurrentUser error:", error.message);
      return null;
    }
    return data?.user ?? null;
  } catch (err) {
    console.error("[acsAuth] getCurrentUser exception:", err);
    return null;
  }
};

/**
 * Require auth for protected pages.
 * If not logged in → redirect to login page.
 */
window.acsAuth.requireAuth = async function () {
  const user = await window.acsAuth.getCurrentUser();
  if (!user) {
    const currentUrl = window.location.pathname + window.location.search;
    window.location.href = "../auth/login.html?redirect=" + encodeURIComponent(currentUrl);
    return null;
  }
  return user;
};

