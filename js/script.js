document.addEventListener("DOMContentLoaded", function() {
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");

    if (sidebarPlaceholder) {
        // 1. Tải menu về
        fetch(getPathToMenu()) 
            .then(response => {
                if (!response.ok) throw new Error("Không tìm thấy menu!");
                return response.text();
            })
            .then(html => {
                sidebarPlaceholder.innerHTML = html;
                
                // 2. Tô màu ngay khi vừa vào trang (Lần đầu tiên)
                highlightCurrentPage();

                // 3. QUAN TRỌNG: Lắng nghe sự kiện thay đổi hash (#)
                // Dòng này giúp cập nhật màu khi bạn bấm chuyển qua lại giữa các mục con 1.2.1, 1.2.2...
                window.addEventListener('hashchange', highlightCurrentPage);
            })
            .catch(error => console.error('Lỗi tải menu:', error));
    }
});

function getPathToMenu() {
    const path = window.location.pathname;
    if (path.includes("/NhanVienBanVe/") || path.includes("/QuanLy/")) {
        return "../../html/menu.html"; 
    }
    return "../menu.html"; 
}

function highlightCurrentPage() {
    // Lấy URL hiện tại, dùng decode để tránh lỗi ký tự lạ
    const currentUrl = decodeURIComponent(window.location.href); 
    const links = document.querySelectorAll('.sidebar a');

    // 1. RESET: Xóa sạch toàn bộ màu cũ
    links.forEach(link => {
        link.style.color = "";
        link.style.fontWeight = "";
        link.style.backgroundColor = "";
        link.style.borderRadius = "";
    });

    // 2. BẮT ĐẦU TÔ MÀU
    links.forEach(link => {
        // So sánh chính xác 100% (bao gồm cả dấu #)
        // Ví dụ: link là .../BanVe.html#chon-tau bằng với URL hiện tại
        if (decodeURIComponent(link.href) === currentUrl) {

            // --- TRƯỜNG HỢP 1: Chọn Link Cấp 2 (Mục cha) ---
            if (link.classList.contains('level-2-link')) {
                link.style.color = "#007bff";
                link.style.fontWeight = "bold";
                link.style.backgroundColor = "#e7f3ff"; // Tô nền xanh
                link.style.borderRadius = "5px";
            }

            // --- TRƯỜNG HỢP 2: Chọn Link Cấp 3 (Mục con) ---
            else if (link.classList.contains('level-3-link')) {
                
                // A. Tô màu chữ cho chính mục con (Không tô nền)
                link.style.color = "#007bff";
                link.style.fontWeight = "bold";

                // B. TÌM CHA ĐỂ TÔ (Logic này của bạn RẤT CHUẨN)
                // Tìm thẻ bao bọc (div class="level-2-item")
                const parentContainer = link.closest('.level-2-item');
                
                if (parentContainer) {
                    // Từ thẻ bao, tìm ngược lại thẻ a cấp 2 (Mục cha)
                    const parentLink = parentContainer.querySelector('.level-2-link');
                    
                    if (parentLink) {
                        // Tô nền + chữ cho Cha
                        parentLink.style.color = "#007bff";
                        parentLink.style.fontWeight = "bold";
                        parentLink.style.backgroundColor = "#e7f3ff"; // Nền xanh cho cha
                        parentLink.style.borderRadius = "5px";
                    }
                }
            }
        }
    });
}