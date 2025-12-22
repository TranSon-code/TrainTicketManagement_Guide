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
                
                // 2. Gán ID để quản lý
                assignIdsToDetails();

                // 3. Khôi phục trạng thái (Nếu người dùng từng mở thủ công thì giữ nguyên)
                restoreMenuState();

                // 4. Tô màu link trang hiện tại (NHƯNG KHÔNG TỰ MỞ NỮA)
                highlightCurrentPage();

                // 5. Lắng nghe hành động đóng mở
                setupStateListener();
            })
            .catch(error => console.error('Lỗi tải menu:', error));
    }
});

function getPathToMenu() {
    const path = window.location.pathname;
    // Logic xác định đường dẫn tương đối
    if (path.includes("/NhanVienBanVe/") || path.includes("/QuanLy/")) {
        return "../../html/menu.html"; 
    }
    return "../menu.html"; 
}

function assignIdsToDetails() {
    const details = document.querySelectorAll('details');
    details.forEach((el, index) => {
        if (!el.id) el.id = "menu-group-" + index;
    });
}

function restoreMenuState() {
    const details = document.querySelectorAll('details');
    details.forEach(el => {
        // Chỉ mở nếu trong quá khứ người dùng đã CỐ TÌNH mở nó
        const isOpen = sessionStorage.getItem(el.id);
        if (isOpen === 'true') {
            el.setAttribute('open', '');
        } else if (isOpen === 'false') {
            el.removeAttribute('open');
        }
    });
}

function highlightCurrentPage() {
    // Lấy tên file hiện tại
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll('.sidebar a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        // So sánh tương đối, bỏ qua các ký tự ../
        if (href && href.indexOf(currentPage) !== -1) {
            
            // CHỈ THỰC HIỆN TÔ MÀU
            link.style.color = "#007bff";
            link.style.fontWeight = "bold";

            // --- ĐÃ XÓA ĐOẠN CODE TỰ ĐỘNG MỞ MENU Ở ĐÂY ---
            // Bây giờ nó chỉ tô màu thôi, còn đóng hay mở kệ nó.
        }
    });
}

function setupStateListener() {
    const details = document.querySelectorAll('details');
    details.forEach(el => {
        // Xử lý riêng cho click vào thẻ a trong summary
        // Để tránh việc bấm chuyển trang mà nó lại hiểu nhầm là đóng/mở menu
        const summaryLink = el.querySelector('summary a');
        if(summaryLink) {
            summaryLink.addEventListener('click', function(e) {
                // Khi bấm vào link chuyển trang, không làm thay đổi trạng thái đóng mở hiện tại
                e.stopPropagation(); 
            });
        }

        el.addEventListener('toggle', function() {
            // Chỉ lưu trạng thái khi thực sự bấm vào mũi tên
            sessionStorage.setItem(el.id, el.open);
        });
    });
}