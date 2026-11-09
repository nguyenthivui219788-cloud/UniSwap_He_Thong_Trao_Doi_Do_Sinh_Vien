/**
 * UniSwap Admin - Lịch sử giao dịch & Đăng ký gói dịch vụ
 * File: lichsugiaodich.js
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Quản lý trạng thái dữ liệu
    let allTransactions = [];
    let currentFilter = "all";
    let searchQuery = "";
    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;

    // 2. Elements tham chiếu
    const liveDateTimeEl = document.getElementById("liveDateTime");
    const searchInput = document.getElementById("searchInput");
    const filterTabsContainer = document.getElementById("filterTabs");
    const tableBody = document.getElementById("transactionTableBody");
    const tableRecordCount = document.getElementById("tableRecordCount");
    const footerInfoText = document.getElementById("footerInfoText");
    const refreshBtn = document.getElementById("refreshBtn");
    const exportCsvBtn = document.getElementById("exportCsvBtn");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const paginationNumbers = document.getElementById("paginationNumbers");

    // KPI Elements
    const kpiTotalRevenue = document.getElementById("kpiTotalRevenue");
    const kpiActivePackages = document.getElementById("kpiActivePackages");
    const kpiSuccessRate = document.getElementById("kpiSuccessRate");
    const kpiTotalStudents = document.getElementById("kpiTotalStudents");

    // Count Elements
    const countAll = document.getElementById("countAll");
    const countBoth = document.getElementById("countBoth");
    const countSeller = document.getElementById("countSeller");
    const countBuyer = document.getElementById("countBuyer");
    const countBoost = document.getElementById("countBoost");
    const countPending = document.getElementById("countPending");

    // Modal Elements
    const receiptModal = document.getElementById("receiptModal");
    const closeReceiptBtn = document.getElementById("closeReceiptBtn");
    const confirmReceiptBtn = document.getElementById("confirmReceiptBtn");
    const printReceiptBtn = document.getElementById("printReceiptBtn");

    // Modal Content Fields
    const mTxId = document.getElementById("mTxId");
    const mStudentName = document.getElementById("mStudentName");
    const mStudentId = document.getElementById("mStudentId");
    const mSchool = document.getElementById("mSchool");
    const mPackageName = document.getElementById("mPackageName");
    const mDuration = document.getElementById("mDuration");
    const mPaymentMethod = document.getElementById("mPaymentMethod");
    const mReference = document.getElementById("mReference");
    const mCreated = document.getElementById("mCreated");
    const mStatus = document.getElementById("mStatus");
    const mAmount = document.getElementById("mAmount");
    const mNotes = document.getElementById("mNotes");

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

    // 4. Định dạng tiền tệ VNĐ
    function formatVND(amount) {
        return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    }

    // 5. Định dạng thời gian
    function formatDateTime(dateStr) {
        if (!dateStr) return "Mới đây";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch(e) {
            return dateStr;
        }
    }

    // 6. Tải dữ liệu từ API
    async function fetchTransactions() {
        try {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        <div style="display: inline-block; animation: pulseDot 1.5s infinite;">⏳</div> Đang tải dữ liệu giao dịch UniSwap...
                    </td>
                </tr>
            `;

            const res = await fetch("/api/admin/transactions");
            if (!res.ok) throw new Error("Lỗi khi kết nối máy chủ");
            const data = await res.json();

            allTransactions = data.transactions || [];
            updateSummaryKPIs(data.summary || {});
            updateFilterCounts();
            renderTable();
        } catch (err) {
            console.error("fetchTransactions error:", err);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 30px; color: #DC2626;">
                        ⚠️ Không thể tải dữ liệu: ${err.message}. Nhấn "Làm mới" để thử lại.
                    </td>
                </tr>
            `;
        }
    }

    // 7. Cập nhật 4 thẻ KPI
    function updateSummaryKPIs(summary) {
        if (summary.totalRevenue) {
            kpiTotalRevenue.textContent = formatVND(summary.totalRevenue);
        }
        if (summary.activeCount !== undefined) {
            kpiActivePackages.textContent = `${summary.activeCount} gói`;
        }
        if (summary.successRate) {
            kpiSuccessRate.textContent = summary.successRate;
        }
        if (summary.totalStudentsUpgraded) {
            kpiTotalStudents.textContent = `${summary.totalStudentsUpgraded} bạn`;
        }
    }

    // 8. Đếm số lượng theo tab bộ lọc
    function updateFilterCounts() {
        countAll.textContent = allTransactions.length;
        countBoth.textContent = allTransactions.filter(t => t.packageType === "both").length;
        countSeller.textContent = allTransactions.filter(t => t.packageType === "seller").length;
        countBuyer.textContent = allTransactions.filter(t => t.packageType === "buyer").length;
        countBoost.textContent = allTransactions.filter(t => t.packageType === "boost").length;
        countPending.textContent = allTransactions.filter(t => t.status === "pending").length;
    }

    // 9. Lọc và render bảng dữ liệu có phân trang 5 dòng (Dạng bấm số)
    function renderTable() {
        const query = searchQuery.trim().toLowerCase();

        const filtered = allTransactions.filter(item => {
            // Lọc theo Tab
            if (currentFilter === "both" && item.packageType !== "both") return false;
            if (currentFilter === "seller" && item.packageType !== "seller") return false;
            if (currentFilter === "buyer" && item.packageType !== "buyer") return false;
            if (currentFilter === "boost" && item.packageType !== "boost") return false;
            if (currentFilter === "pending" && item.status !== "pending") return false;

            // Lọc theo Tìm kiếm
            if (query) {
                const searchIn = [
                    item.id,
                    item.studentName,
                    item.studentId,
                    item.school,
                    item.packageName,
                    item.paymentMethod,
                    item.referenceCode
                ].join(" ").toLowerCase();
                return searchIn.includes(query);
            }
            return true;
        });

        // Cập nhật số lượng
        tableRecordCount.textContent = `${filtered.length} giao dịch`;

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        Không tìm thấy giao dịch nào phù hợp với điều kiện tìm kiếm.
                    </td>
                </tr>
            `;
            footerInfoText.textContent = `Hiển thị 0 / 0 giao dịch đăng ký gói`;
            renderPagination(0);
            return;
        }

        // Tính toán phân trang 5 dòng mỗi trang
        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, filtered.length);
        const pageItems = filtered.slice(startIdx, endIdx);

        footerInfoText.textContent = `Hiển thị ${startIdx + 1} - ${endIdx} trong tổng số ${filtered.length} giao dịch đăng ký gói`;

        // Tạo HTML cho 5 dòng trong trang hiện tại
        tableBody.innerHTML = pageItems.map(t => {
            // Rút gọn ID nếu quá dài để bảng luôn gọn gàng đẹp mắt
            const displayTxId = t.id && t.id.length > 16 
                ? (t.id.startsWith("TX-") ? t.id : `TX-${t.id.slice(0, 8)}...`) 
                : t.id;

            // Chuẩn hóa hiển thị MSSV
            let cleanMssv = t.studentId || "2305CT0661";
            if (cleanMssv.toUpperCase().includes("2305CT0661")) cleanMssv = "2305CT0661";

            // Xác định class của Package Badge
            let pkgClass = "package-both";
            let pkgIcon = "🌟";
            if (t.packageType === "seller") { pkgClass = "package-seller"; pkgIcon = "💼"; }
            else if (t.packageType === "buyer") { pkgClass = "package-buyer"; pkgIcon = "🎯"; }
            else if (t.packageType === "boost") { pkgClass = "package-boost"; pkgIcon = "🚀"; }
            else if (t.packageType === "escrow") { pkgClass = "package-escrow"; pkgIcon = "🔄"; }

            // Trạng thái badge
            let statusBadge = `<span class="status-pill status-active">Đang kích hoạt</span>`;
            if (t.status === "completed") {
                statusBadge = `<span class="status-pill status-completed">Đã hoàn tất</span>`;
            } else if (t.status === "pending") {
                statusBadge = `<span class="status-pill status-pending">Chờ thanh toán</span>`;
            } else if (t.status === "expired") {
                statusBadge = `<span class="status-pill status-expired">Đã hết hạn</span>`;
            }

            // Avatar chữ cái đầu
            const firstLetter = (t.studentName || "S").trim().charAt(0).toUpperCase();

            return `
                <tr>
                    <td>
                        <span class="tx-id-badge" title="Mã đơn hàng: ${escapeHtml(t.id)}">${escapeHtml(displayTxId)}</span>
                    </td>
                    <td>
                        <div class="student-cell">
                            <div class="student-avatar">${firstLetter}</div>
                            <div class="student-meta">
                                <span class="student-name">${escapeHtml(t.studentName)}</span>
                                <div class="student-sub">
                                    <span class="mssv-tag">MSSV: ${escapeHtml(cleanMssv)}</span>
                                    <span>• ${escapeHtml(t.school)}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="package-badge ${pkgClass}">
                            <span>${pkgIcon}</span>
                            <span>${escapeHtml(t.packageName)}</span>
                        </span>
                    </td>
                    <td>
                        <div class="duration-pill">
                            <span>${escapeHtml(t.packageDuration || "30 ngày")}</span>
                            <span class="duration-dates">${escapeHtml(t.notes || "Gói tự động")}</span>
                        </div>
                    </td>
                    <td>
                        <span class="amount-text">+${formatVND(t.amount)}</span>
                    </td>
                    <td>
                        <div class="payment-method-box">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                                <line x1="2" y1="10" x2="22" y2="10"></line>
                            </svg>
                            <span>${escapeHtml(t.paymentMethod || "VietQR MB Bank")}</span>
                        </div>
                    </td>
                    <td style="font-size: 12px; color: var(--text-muted); white-space: nowrap;">
                        ${formatDateTime(t.created)}
                    </td>
                    <td>
                        ${statusBadge}
                    </td>
                    <td style="text-align: center;">
                        <div class="action-buttons" style="justify-content: center;">
                            <button class="btn-action-icon view-receipt-btn" data-id="${escapeHtml(t.id)}" title="Xem chi tiết hóa đơn">
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        // Gắn sự kiện xem hóa đơn
        document.querySelectorAll(".view-receipt-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const txId = btn.getAttribute("data-id");
                const found = allTransactions.find(x => x.id === txId);
                if (found) showReceiptModal(found);
            });
        });

        // Vẽ cụm nút bấm số trang
        renderPagination(totalPages);
    }

    // Vẽ giao diện các nút bấm số trang (1, 2, 3...)
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

    // Gắn sự kiện nút Trước / Sau
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
            const query = searchQuery.trim().toLowerCase();
            const filteredCount = allTransactions.filter(item => {
                if (currentFilter === "both" && item.packageType !== "both") return false;
                if (currentFilter === "seller" && item.packageType !== "seller") return false;
                if (currentFilter === "buyer" && item.packageType !== "buyer") return false;
                if (currentFilter === "boost" && item.packageType !== "boost") return false;
                if (currentFilter === "pending" && item.status !== "pending") return false;
                return true;
            }).length;
            const totalPages = Math.ceil(filteredCount / ITEMS_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
    }

    // 10. Hiển thị modal hóa đơn
    function showReceiptModal(tx) {
        mTxId.textContent = tx.id;
        mStudentName.textContent = tx.studentName;
        mStudentId.textContent = tx.studentId;
        mSchool.textContent = tx.school;
        mPackageName.textContent = tx.packageName;
        mDuration.textContent = tx.packageDuration || "30 ngày hiệu lực";
        mPaymentMethod.textContent = tx.paymentMethod || "VietQR MB Bank";
        mReference.textContent = tx.referenceCode || `REF-${Math.floor(100000 + Math.random() * 900000)}`;
        mCreated.textContent = formatDateTime(tx.created);
        mAmount.textContent = formatVND(tx.amount);
        mNotes.textContent = `Ghi chú: ${tx.notes || "Kích hoạt dịch vụ thành công qua hệ thống đối soát UniSwap."}`;

        if (tx.status === "active") {
            mStatus.innerHTML = `<span style="color: #059669;">● Đang kích hoạt (Hiệu lực đầy đủ)</span>`;
        } else if (tx.status === "pending") {
            mStatus.innerHTML = `<span style="color: #D97706;">⏳ Đang chờ thanh toán / đối soát VietQR</span>`;
        } else if (tx.status === "expired") {
            mStatus.innerHTML = `<span style="color: #64748B;">⚪ Đã hết hạn chu kỳ sử dụng</span>`;
        } else {
            mStatus.innerHTML = `<span style="color: #2563EB;">● Đã hoàn tất</span>`;
        }

        receiptModal.classList.remove("hidden");
    }

    function closeReceipt() {
        receiptModal.classList.add("hidden");
    }

    closeReceiptBtn.addEventListener("click", closeReceipt);
    confirmReceiptBtn.addEventListener("click", closeReceipt);
    receiptModal.addEventListener("click", (e) => {
        if (e.target === receiptModal) closeReceipt();
    });

    printReceiptBtn.addEventListener("click", () => {
        window.print();
    });

    // 11. Xử lý bộ lọc tabs
    filterTabsContainer.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            filterTabsContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            currentPage = 1;
            renderTable();
        });
    });

    // 12. Xử lý tìm kiếm tức thì
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        renderTable();
    });

    // 13. Nút làm mới
    refreshBtn.addEventListener("click", () => {
        fetchTransactions();
    });

    // 14. Xuất file CSV đối soát (UTF-8 with BOM)
    exportCsvBtn.addEventListener("click", () => {
        if (allTransactions.length === 0) {
            alert("Chưa có dữ liệu để xuất file!");
            return;
        }

        const headers = ["Mã Giao Dịch", "Tên Sinh Viên", "MSSV", "Trường ĐH", "Gói Dịch Vụ", "Thời Hạn", "Số Tiền (VNĐ)", "Cổng Thanh Toán", "Trạng Thái", "Ngày Tạo", "Mã Đối Soát"];
        const rows = allTransactions.map(t => [
            `"${t.id}"`,
            `"${t.studentName}"`,
            `"${t.studentId}"`,
            `"${t.school}"`,
            `"${t.packageName}"`,
            `"${t.packageDuration || ''}"`,
            t.amount,
            `"${t.paymentMethod || ''}"`,
            `"${t.status}"`,
            `"${t.created}"`,
            `"${t.referenceCode || ''}"`
        ]);

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `UniSwap_LichSuGiaoDich_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // 15. User dropdown & Logout
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
            try {
                await fetch("/api/logout", { method: "POST" });
            } catch(e){}
            window.location.href = "/";
        });
    }

    // Tránh XSS
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Tải dữ liệu ban đầu
    fetchTransactions();
});
