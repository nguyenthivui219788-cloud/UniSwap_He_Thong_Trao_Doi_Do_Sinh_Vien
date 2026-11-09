/**
 * UniSwap Admin - Quản lý Báo cáo vi phạm
 * File: baocaovipham.js
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Quản lý trạng thái
    let allReports = [];
    let currentFilter = "all";
    let searchQuery = "";
    const REPORTS_PER_PAGE = 5;
    let currentPage = 1;

    // 2. Tham chiếu DOM
    const liveDateTimeEl = document.getElementById("liveDateTime");
    const searchInput = document.getElementById("searchInput");
    const filterTabsContainer = document.getElementById("filterTabs");
    const tableBody = document.getElementById("reportsTableBody");
    const tableHeaderBadge = document.getElementById("tableHeaderBadge");
    const footerInfoText = document.getElementById("footerInfoText");
    const refreshBtn = document.getElementById("refreshBtn");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const paginationNumbers = document.getElementById("paginationNumbers");

    // KPI Elements
    const kpiTotalReports = document.getElementById("kpiTotalReports");
    const kpiPendingReports = document.getElementById("kpiPendingReports");
    const kpiResolvedReports = document.getElementById("kpiResolvedReports");
    const kpiDismissedReports = document.getElementById("kpiDismissedReports");

    // Filter count elements
    const countAll = document.getElementById("countAll");
    const countPending = document.getElementById("countPending");
    const countSpam = document.getElementById("countSpam");
    const countRules = document.getElementById("countRules");

    // 3. Khởi tạo Đồng hồ thời gian thực
    function updateClock() {
        if (!liveDateTimeEl) return;
        const now = new Date();
        const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        const dayName = days[now.getDay()];
        const dateStr = now.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        const timeStr = now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
        liveDateTimeEl.textContent = `${dayName}, ${dateStr} | ${timeStr}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 4. Định dạng ngày giờ
    function formatDateTime(dateStr) {
        if (!dateStr) return "Mới đây";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ss = String(d.getSeconds()).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const mo = String(d.getMonth() + 1).padStart(2, '0');
            const yy = d.getFullYear();
            return `${hh}:${mm}:${ss} ${dd}/${mo}/${yy}`;
        } catch(e) {
            return dateStr;
        }
    }

    // 5. Tải danh sách báo cáo từ API
    async function loadReports() {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    Đang tải dữ liệu báo cáo vi phạm...
                </td>
            </tr>
        `;

        try {
            const res = await fetch("/api/admin/reports");
            let serverReports = [];
            if (res.ok) {
                const data = await res.json();
                serverReports = data.reports || [];
            }

            // Dữ liệu mẫu chuẩn hóa bổ sung để có đầy đủ phân trang 5 bài
            const sampleReports = [
                {
                    id: "rep_1793462687823",
                    product_id: "Vợt cầu lông Yonex Astrox",
                    target_id: "target_001",
                    user_id: "demo-profile-0",
                    reason: "Nội dung spam / lừa đảo sinh viên",
                    created: "2026-10-31T16:04:47.000Z",
                    status: "pending"
                },
                {
                    id: "rep_1793462688910",
                    product_id: "Tai nghe Sony WH-1000XM4 giá 200k",
                    target_id: "target_002",
                    user_id: "2305CT0661",
                    reason: "Giá sai lệch / nghi vấn hàng giả",
                    created: "2026-10-31T18:22:15.000Z",
                    status: "pending"
                },
                {
                    id: "rep_1793462689123",
                    product_id: "Bán thuốc lá điện tử pod mod KTX",
                    target_id: "target_003",
                    user_id: "demo-profile-2",
                    reason: "Hàng cấm / Vi phạm quy chế KTX",
                    created: "2026-10-30T14:10:00.000Z",
                    status: "pending"
                },
                {
                    id: "rep_1793462690412",
                    product_id: "Tài liệu thi TOEIC kèm link đa cấp",
                    target_id: "target_004",
                    user_id: "student_hcmut_99",
                    reason: "Nội dung spam / lừa đảo sinh viên",
                    created: "2026-10-30T09:45:00.000Z",
                    status: "pending"
                },
                {
                    id: "rep_1793462691550",
                    product_id: "Bếp từ công suất lớn cấm dùng KTX",
                    target_id: "target_005",
                    user_id: "2201CS0142",
                    reason: "Hàng cấm / Vi phạm quy chế KTX",
                    created: "2026-10-29T21:30:00.000Z",
                    status: "pending"
                },
                {
                    id: "rep_1793462692110",
                    product_id: "Spam link cờ bạc tài xỉu trong bài ôn thi",
                    target_id: "target_006",
                    user_id: "demo-profile-4",
                    reason: "Nội dung spam / lừa đảo sinh viên",
                    created: "2026-10-29T11:15:00.000Z",
                    status: "resolved"
                },
                {
                    id: "rep_1793462693888",
                    product_id: "Thanh lý xe máy không giấy tờ",
                    target_id: "target_007",
                    user_id: "2102IT0891",
                    reason: "Hàng cấm / Sai nguồn gốc xuất xứ",
                    created: "2026-10-28T16:00:00.000Z",
                    status: "resolved"
                }
            ];

            // Gộp báo cáo từ server (nếu có bài mới) và mẫu
            const map = new Map();
            sampleReports.forEach(r => map.set(r.id, r));
            serverReports.forEach(r => map.set(r.id, r));
            allReports = Array.from(map.values());

            updateSummaryKPIs();
            renderTable();
        } catch (e) {
            console.error("Lỗi tải báo cáo:", e);
        }
    }

    // 6. Cập nhật các chỉ số KPI
    function updateSummaryKPIs() {
        const total = allReports.length;
        const pending = allReports.filter(r => r.status === "pending").length;
        const resolved = allReports.filter(r => r.status === "resolved").length;
        const dismissed = allReports.filter(r => r.status === "dismissed").length;

        if (kpiTotalReports) kpiTotalReports.textContent = `${total} báo cáo`;
        if (kpiPendingReports) kpiPendingReports.textContent = `${pending} đơn`;
        if (kpiResolvedReports) kpiResolvedReports.textContent = `${resolved} bài`;
        if (kpiDismissedReports) kpiDismissedReports.textContent = `${dismissed} đơn`;

        if (countAll) countAll.textContent = total;
        if (countPending) countPending.textContent = pending;
        if (countSpam) countSpam.textContent = allReports.filter(r => (r.reason || "").toLowerCase().includes("spam")).length;
        if (countRules) countRules.textContent = allReports.filter(r => (r.reason || "").toLowerCase().includes("ktx") || (r.reason || "").toLowerCase().includes("cấm")).length;
    }

    // 7. Render bảng báo cáo vi phạm có phân trang 5 dòng ("Dạng bấm số")
    function renderTable() {
        const query = searchQuery.trim().toLowerCase();

        const filtered = allReports.filter(r => {
            // Lọc theo Tabs
            if (currentFilter === "pending" && r.status !== "pending") return false;
            if (currentFilter === "spam" && !(r.reason || "").toLowerCase().includes("spam")) return false;
            if (currentFilter === "rules" && !((r.reason || "").toLowerCase().includes("ktx") || (r.reason || "").toLowerCase().includes("cấm"))) return false;

            // Lọc theo Tìm kiếm
            if (query) {
                const searchIn = [
                    r.id,
                    r.product_id,
                    r.user_id,
                    r.reason
                ].join(" ").toLowerCase();
                return searchIn.includes(query);
            }
            return true;
        });

        tableHeaderBadge.textContent = `${filtered.length} báo cáo`;

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 48px; color: var(--text-muted);">
                        🎉 Tuyệt vời! Không có báo cáo vi phạm nào phù hợp với bộ lọc.
                    </td>
                </tr>
            `;
            footerInfoText.textContent = "Hiển thị 0 / 0 báo cáo vi phạm";
            renderPagination(0);
            return;
        }

        // Tính toán phân trang 5 dòng mỗi trang
        const totalPages = Math.ceil(filtered.length / REPORTS_PER_PAGE);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIdx = (currentPage - 1) * REPORTS_PER_PAGE;
        const endIdx = Math.min(startIdx + REPORTS_PER_PAGE, filtered.length);
        const pageItems = filtered.slice(startIdx, endIdx);

        footerInfoText.textContent = `Hiển thị ${startIdx + 1} - ${endIdx} trong tổng số ${filtered.length} báo cáo vi phạm`;

        // Render từng dòng theo chuẩn Ảnh 2
        tableBody.innerHTML = pageItems.map(r => {
            const isResolved = r.status === "resolved";
            const isDismissed = r.status === "dismissed";

            let actionHtml = `
                <div class="report-action-group">
                    <button class="btn-delete-report" onclick="resolveReport('${escapeHtml(r.id)}', '${escapeHtml(r.target_id || r.product_id)}', 'delete_target')">
                        Xóa bài vi phạm
                    </button>
                    <button class="btn-dismiss-report" onclick="resolveReport('${escapeHtml(r.id)}', '${escapeHtml(r.target_id || r.product_id)}', 'dismiss')">
                        Bỏ qua
                    </button>
                </div>
            `;

            if (isResolved) {
                actionHtml = `<span style="font-size: 12px; color: #059669; font-weight: 700;">✓ Đã xóa bài</span>`;
            } else if (isDismissed) {
                actionHtml = `<span style="font-size: 12px; color: #64748B; font-weight: 600;">Đã bỏ qua</span>`;
            }

            return `
                <tr>
                    <td>
                        <span class="report-id-text">${escapeHtml(r.id)}</span>
                    </td>
                    <td>
                        <div class="target-title-text">${escapeHtml(r.product_id || "Bài viết sinh viên")}</div>
                    </td>
                    <td>
                        <span class="reporter-text">${escapeHtml(r.user_id || "Sinh viên")}</span>
                    </td>
                    <td>
                        <span class="reason-badge-yellow">${escapeHtml(r.reason || "Nội dung vi phạm quy chế")}</span>
                    </td>
                    <td>
                        <span class="time-text">${formatDateTime(r.created)}</span>
                    </td>
                    <td style="text-align: right;">
                        ${actionHtml}
                    </td>
                </tr>
            `;
        }).join("");

        renderPagination(totalPages);
    }

    // 8. Vẽ nút phân trang dạng bấm số (1, 2, 3...)
    function renderPagination(totalPages) {
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

        if (prevPageBtn) prevPageBtn.disabled = (currentPage === 1);
        if (nextPageBtn) nextPageBtn.disabled = (currentPage === totalPages);

        for (let i = 1; i <= totalPages; i++) {
            const numBtn = document.createElement("button");
            numBtn.className = `pagination-num-btn ${i === currentPage ? "active" : ""}`;
            numBtn.textContent = i;
            numBtn.addEventListener("click", () => {
                currentPage = i;
                renderTable();
            });
            paginationNumbers.appendChild(numBtn);
        }
    }

    // 9. Xử lý giải quyết báo cáo (Xóa bài hoặc Bỏ qua)
    window.resolveReport = async function(id, targetId, action) {
        const confirmMsg = action === "delete_target" 
            ? "Bạn có chắc chắn muốn XÓA BÀI VIẾT NÀY vĩnh viễn khỏi hệ thống không?" 
            : "Bỏ qua báo cáo này và giữ nguyên bài viết?";

        if (!confirm(confirmMsg)) return;

        try {
            await fetch("/api/admin/reports/resolve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, targetId, action })
            });
        } catch(e) {
            console.warn("Lỗi gọi server:", e);
        }

        // Cập nhật trạng thái trực quan ngay trên client
        const found = allReports.find(r => r.id === id);
        if (found) {
            found.status = action === "delete_target" ? "resolved" : "dismissed";
        }
        updateSummaryKPIs();
        renderTable();
    };

    // 10. Sự kiện nút bấm phân trang Trước / Sau
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            const filteredCount = allReports.filter(r => {
                if (currentFilter === "pending" && r.status !== "pending") return false;
                if (currentFilter === "spam" && !(r.reason || "").toLowerCase().includes("spam")) return false;
                if (currentFilter === "rules" && !((r.reason || "").toLowerCase().includes("ktx") || (r.reason || "").toLowerCase().includes("cấm"))) return false;
                return true;
            }).length;
            const totalPages = Math.ceil(filteredCount / REPORTS_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
    }

    // 11. Sự kiện lọc tabs
    if (filterTabsContainer) {
        filterTabsContainer.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                filterTabsContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.getAttribute("data-filter");
                currentPage = 1;
                renderTable();
            });
        });
    }

    // 12. Tìm kiếm tức thì
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            currentPage = 1;
            renderTable();
        });
    }

    // 13. Làm mới
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            loadReports();
        });
    }

    // 14. User Dropdown & Logout
    const userDropdownBtn = document.getElementById("sidebarUserDropdownBtn");
    const userDropdownMenu = document.getElementById("userDropdownMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    if (userDropdownBtn && userDropdownMenu) {
        userDropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle("hidden");
        });
        document.addEventListener("click", () => {
            userDropdownMenu.classList.add("hidden");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            try { await fetch("/api/logout", { method: "POST" }); } catch(e){}
            window.location.href = "/";
        });
    }

    // XSS Escape
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Khởi động
    loadReports();
});
