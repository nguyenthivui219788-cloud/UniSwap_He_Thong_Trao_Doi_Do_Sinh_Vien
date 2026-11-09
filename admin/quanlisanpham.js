// UniSwap Admin - quanlisanpham.js
// Quản lý sản phẩm sàn UniSwap

let allProducts = [];
let currentCategory = "Tất cả";
let searchQuery = "";
let campusFilter = "all";
const PRODUCTS_PER_PAGE = 5;
let productCurrentPage = 1;

// Format tiền tệ VNĐ
function formatVND(amount) {
    if (amount === 0) return "Tặng 0đ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace("₫", "đ");
}

// Đồng hồ hiển thị thời gian thực
function startLiveDateTime() {
    const display = document.getElementById("liveDateTimeDisplay");
    if (!display) return;
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    function update() {
        const now = new Date();
        const dayName = days[now.getDay()];
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        display.textContent = `${dayName}, ${d}/${m}/${y} | ${hh}:${mm}:${ss}`;
    }
    update();
    setInterval(update, 1000);
}

// Tải danh sách sản phẩm từ API
async function loadProducts() {
    const tbody = document.getElementById("productsTableBody");
    const countBadge = document.getElementById("productCountBadge");
    
    try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
            const data = await res.json();
            allProducts = data.products || [];
        } else {
            throw new Error("Không thể kết nối API");
        }
    } catch (e) {
        console.warn("Dùng dữ liệu dự phòng:", e);
        // Fallback demo data
        allProducts = [
            { id: "sp_1", title: "Giáo trình Giải tích 1 ĐH Bách Khoa", category: "Sách & giáo trình", price: 45000, isVerified: true, campusCheck: true, sellerName: "Nguyễn Văn Nam", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150" },
            { id: "sp_2", title: "Chuột không dây Logitech Silent", category: "Đồ công nghệ", price: 180000, isVerified: true, campusCheck: true, sellerName: "Lê Thị Thảo", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150" },
            { id: "sp_3", title: "Ấm siêu tốc Inox 1.8L phòng trọ", category: "Đồ phòng trọ", price: 65000, isVerified: false, campusCheck: false, sellerName: "Trần Văn Hưng", image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=150" },
            { id: "sp_4", title: "Balo phản quang chống nước sinh viên", category: "Thời trang", price: 95000, isVerified: true, campusCheck: true, sellerName: "Phạm Hải Đăng", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150" },
            { id: "sp_5", title: "Vợt cầu lông Yonex Carbon Pro", category: "Thể thao", price: 230000, isVerified: false, campusCheck: false, sellerName: "Vũ Đức Huy", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=150" }
        ];
    }
    
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById("productsTableBody");
    const countBadge = document.getElementById("productCountBadge");
    
    let filtered = allProducts.filter(p => {
        const matchCat = currentCategory === "Tất cả" || p.category === currentCategory;
        const matchQuery = !searchQuery || 
            (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
            (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase()));
        
        let matchCampus = true;
        if (campusFilter === "verified") matchCampus = (p.isVerified || p.campusCheck);
        if (campusFilter === "unverified") matchCampus = !(p.isVerified || p.campusCheck);
        
        return matchCat && matchQuery && matchCampus;
    });

    if (countBadge) {
        countBadge.textContent = `${filtered.length} / ${allProducts.length} sản phẩm`;
    }

    const footerInfoText = document.getElementById("footerInfoText");

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 48px; color: #94A3B8;">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
                </td>
            </tr>
        `;
        if (footerInfoText) footerInfoText.textContent = "Hiển thị 0 / 0 sản phẩm";
        renderProductPagination(0);
        return;
    }

    // Tính toán phân trang 5 sản phẩm mỗi trang
    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
    if (productCurrentPage > totalPages) productCurrentPage = totalPages;
    if (productCurrentPage < 1) productCurrentPage = 1;

    const startIdx = (productCurrentPage - 1) * PRODUCTS_PER_PAGE;
    const endIdx = Math.min(startIdx + PRODUCTS_PER_PAGE, filtered.length);
    const pageItems = filtered.slice(startIdx, endIdx);

    if (footerInfoText) {
        footerInfoText.textContent = `Hiển thị ${startIdx + 1} - ${endIdx} trong tổng số ${filtered.length} sản phẩm`;
    }

    tbody.innerHTML = pageItems.map(p => {
        const isVerified = (p.isVerified || p.campusCheck);
        const img = p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150';
        const seller = p.sellerName || p.author || 'Sinh viên UniSwap';
        const school = p.school || 'ĐHQG TP.HCM';

        return `
            <tr data-id="${p.id}">
                <td>
                    <div class="product-cell">
                        <img src="${img}" alt="${p.title}" class="product-img" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'">
                        <div>
                            <div class="product-title-text" title="${p.title}">${p.title}</div>
                            <div class="product-code-sub">MÃ: ${p.id}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category-pill">${p.category || 'Chưa phân loại'}</span>
                </td>
                <td>
                    <div style="font-weight: 600; color: #1E293B;">${seller}</div>
                    <div style="font-size: 11.5px; color: #94A3B8;">${school}</div>
                </td>
                <td>
                    <span class="price-tag">${formatVND(p.price || 0)}</span>
                </td>
                <td>
                    ${isVerified ? `
                        <span class="badge-check-ok">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            ĐÃ DUYỆT
                        </span>
                    ` : `
                        <span class="badge-check-pending">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            CHỜ DUYỆT
                        </span>
                    `}
                </td>
                <td>
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #10B981; margin-right: 6px;"></span>
                    <span style="font-size: 12.5px; color: #1E293B; font-weight: 500;">Đang hiển thị</span>
                </td>
                <td style="text-align: right;">
                    <div class="action-btns" style="justify-content: flex-end;">
                        <button class="btn-action-icon verify-toggle" title="${isVerified ? 'Hủy duyệt Campus Check' : 'Cấp duyệt Campus Check'}" onclick="toggleVerify('${p.id}')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </button>
                        <button class="btn-action-icon btn-delete" title="Xóa bài đăng vi phạm" onclick="deleteProduct('${p.id}')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    renderProductPagination(totalPages);
}

function renderProductPagination(totalPages) {
    const paginationNumbers = document.getElementById("paginationNumbers");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

    if (!paginationNumbers) return;
    paginationNumbers.innerHTML = "";

    if (totalPages <= 1) {
        if (prevPageBtn) prevPageBtn.disabled = true;
        if (nextPageBtn) nextPageBtn.disabled = true;
        if (totalPages === 1) {
            const singleBtn = document.createElement("button");
            singleBtn.className = "pagination-num-btn active";
            singleBtn.textContent = "1";
            paginationNumbers.appendChild(singleBtn);
        }
        return;
    }

    if (prevPageBtn) prevPageBtn.disabled = (productCurrentPage === 1);
    if (nextPageBtn) nextPageBtn.disabled = (productCurrentPage === totalPages);

    for (let i = 1; i <= totalPages; i++) {
        const numBtn = document.createElement("button");
        numBtn.className = `pagination-num-btn ${i === productCurrentPage ? "active" : ""}`;
        numBtn.textContent = i;
        numBtn.addEventListener("click", () => {
            productCurrentPage = i;
            renderTable();
        });
        paginationNumbers.appendChild(numBtn);
    }
}

// Bật / tắt kiểm duyệt Campus Check
async function toggleVerify(productId) {
    try {
        const res = await fetch("/api/admin/products/toggle-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: productId })
        });
        const target = allProducts.find(p => p.id === productId);
        if (target) {
            target.isVerified = !target.isVerified;
            target.campusCheck = target.isVerified;
            renderTable();
        }
    } catch (e) {
        console.error("Lỗi cập nhật:", e);
    }
}

// Xóa sản phẩm
async function deleteProduct(productId) {
    if (!confirm("Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này khỏi hệ thống UniSwap?")) return;
    try {
        await fetch("/api/admin/products/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: productId })
        });
        allProducts = allProducts.filter(p => p.id !== productId);
        renderTable();
    } catch (e) {
        console.error("Lỗi xóa:", e);
    }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    startLiveDateTime();
    loadProducts();

    // Lọc theo Category
    document.querySelectorAll(".category-filters-list .filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".category-filters-list .filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.getAttribute("data-category");
            productCurrentPage = 1;
            renderTable();
        });
    });

    // Tìm kiếm
    const searchInput = document.getElementById("productSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.trim();
            productCurrentPage = 1;
            renderTable();
        });
    }

    // Lọc Campus Check
    const campusSelect = document.getElementById("campusFilterSelect");
    if (campusSelect) {
        campusSelect.addEventListener("change", (e) => {
            campusFilter = e.target.value;
            productCurrentPage = 1;
            renderTable();
        });
    }

    // Nút phân trang Trước / Sau
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (productCurrentPage > 1) {
                productCurrentPage--;
                renderTable();
            }
        });
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            const filteredCount = allProducts.filter(p => {
                let matchCat = (currentCategory === "Tất cả" || p.category === currentCategory);
                let matchQuery = !searchQuery || 
                    (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase()));
                let matchCampus = true;
                if (campusFilter === "verified") matchCampus = (p.isVerified || p.campusCheck);
                if (campusFilter === "unverified") matchCampus = !(p.isVerified || p.campusCheck);
                return matchCat && matchQuery && matchCampus;
            }).length;
            const totalPages = Math.ceil(filteredCount / PRODUCTS_PER_PAGE);
            if (productCurrentPage < totalPages) {
                productCurrentPage++;
                renderTable();
            }
        });
    }

    // Modal Thêm sản phẩm
    const modal = document.getElementById("addProductModal");
    const openBtn = document.getElementById("openAddModalBtn");
    const closeBtn = document.getElementById("closeAddModalBtn");
    const cancelBtn = document.getElementById("cancelAddBtn");
    const form = document.getElementById("addProductForm");

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }
    if (cancelBtn && modal) {
        cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const newTitle = document.getElementById("newTitle").value.trim();
            const newCat = document.getElementById("newCategory").value;
            const newPrice = parseInt(document.getElementById("newPrice").value) || 0;
            const newImg = document.getElementById("newImageUrl").value.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150';
            const newCampus = document.getElementById("newCampusCheck").checked;

            const newProduct = {
                id: "sp_" + Date.now(),
                title: newTitle,
                category: newCat,
                price: newPrice,
                image: newImg,
                isVerified: newCampus,
                campusCheck: newCampus,
                sellerName: "Admin UniSwap",
                school: "ĐH Quốc Gia TP.HCM"
            };

            allProducts.unshift(newProduct);
            modal.classList.add("hidden");
            form.reset();
            renderTable();
        });
    }

    // User Dropdown & Logout
    const userDropdownBtn = document.getElementById("sidebarUserDropdownBtn");
    const userDropdownMenu = document.getElementById("userDropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    if (userDropdownBtn && userDropdownMenu) {
        userDropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle("hidden");
        });
        document.addEventListener("click", () => userDropdownMenu.classList.add("hidden"));
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            try {
                await fetch("/api/logout", { method: "POST" });
            } catch (err) {}
            window.location.href = "/";
        });
    }
});
