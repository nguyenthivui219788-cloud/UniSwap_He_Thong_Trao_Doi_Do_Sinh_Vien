// UniSwap Admin - quanlibaiviet.js
// Quản lý bài viết cộng đồng UniSwap với cột Bán/Mua, xem chi tiết (Con mắt) & Cảnh báo vi phạm (Lưu vào mục Báo cáo)

let allPosts = [];
let currentFilter = "all";
let postSearchQuery = "";
let viewingPostId = null;
let warningTargetPost = null;
const POSTS_PER_PAGE = 5;
let postCurrentPage = 1;

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

// Xác định loại tin: CẦN BÁN, CẦN MUA, hoặc TRAO ĐỔI
function getTradeType(p) {
    if (p.tradeType) return p.tradeType;
    if (p.kind === "wanted") return "buy";
    if (p.kind === "sale") return "sell";
    const text = ((p.title || "") + " " + (p.text || "")).toLowerCase();
    if (text.includes("cần mua") || text.includes("tìm mua") || text.includes("cần tìm") || text.includes("tìm gấp")) {
        return "buy";
    }
    if (text.includes("bán") || text.includes("pass") || text.includes("thanh lý") || text.includes("nhượng lại")) {
        return "sell";
    }
    return "swap";
}

async function loadPosts() {
    try {
        const res = await fetch("/api/admin/posts");
        if (res.ok) {
            const data = await res.json();
            allPosts = data.posts || [];
        } else {
            throw new Error("Không thể kết nối API");
        }
    } catch (e) {
        console.warn("Dùng dữ liệu bài viết mẫu:", e);
        allPosts = [
            { id: "post_1", title: "Cần tìm giáo trình Kinh tế lượng K23 UEH gấp trong tuần", text: "Mình đang cần học phần thầy Hưng, bạn nào pass lại nhắn mình với nhé, mình cảm ơn nhiều!", kind: "wanted", tradeType: "buy", user_id: "demo-profile-0", school: "HCMUS", created: "2026-10-31T14:20:00Z" },
            { id: "post_2", title: "Pass lại chuột Logitech G102 còn mới 95% giá sinh viên", text: "Mua về ít dùng do đã đổi sang chuột không dây, còn hộp và hóa đơn, test thoải mái.", kind: "sale", tradeType: "sell", user_id: "demo-profile-1", school: "HCMUT", created: "2026-10-31T12:00:00Z" },
            { id: "post_3", title: "Nhóm ôn Giải tích và Đại số tuyến tính kỳ 1", text: "Trao đổi bài tập, phương pháp học và tài liệu ôn thi cuối kỳ. Nội dung hoàn toàn miễn phí.", kind: "community", tradeType: "swap", user_id: "demo-profile-2", school: "HUTECH", created: "2026-10-31T10:30:00Z" },
            { id: "post_4", title: "Cần mua thanh RAM DDR4 8GB hoặc 16GB bus 3200", text: "Nâng cấp máy tính trọ để làm đồ án, ưu tiên giao dịch trực tiếp ký túc xá khu B.", kind: "wanted", tradeType: "buy", user_id: "demo-profile-3", school: "SGU", created: "2026-10-30T18:00:00Z" },
            { id: "post_5", title: "Thanh lý quạt đứng Senko còn bảo hành 6 tháng", text: "Chuyển phòng trọ nên cần nhượng lại quạt đứng cho bạn nào cần, chạy êm ru.", kind: "sale", tradeType: "sell", user_id: "demo-profile-4", school: "TDTU", created: "2026-10-30T15:00:00Z" }
        ];
    }
    renderPostsTable();
}

function renderPostsTable() {
    const tbody = document.getElementById("postsTableBody");
    const countBadge = document.getElementById("postCountBadge");
    const footerInfoText = document.getElementById("footerInfoText");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const paginationNumbers = document.getElementById("paginationNumbers");

    let filtered = allPosts.filter(p => {
        const tradeType = getTradeType(p);
        let matchFilter = true;
        if (currentFilter === "sell") matchFilter = (tradeType === "sell" || p.kind === "sale" || tradeType === "giveaway");
        if (currentFilter === "buy") matchFilter = (tradeType === "buy" || p.kind === "wanted");
        if (currentFilter === "community") matchFilter = (p.kind === "community" || tradeType === "swap");

        let matchSearch = !postSearchQuery || 
            (p.title && p.title.toLowerCase().includes(postSearchQuery.toLowerCase())) ||
            (p.text && p.text.toLowerCase().includes(postSearchQuery.toLowerCase())) ||
            (p.user_id && p.user_id.toLowerCase().includes(postSearchQuery.toLowerCase()));

        return matchFilter && matchSearch;
    });

    if (countBadge) {
        countBadge.textContent = `${filtered.length} / ${allPosts.length} bài`;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 48px; color: #94A3B8;">
                    Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại.
                </td>
            </tr>
        `;
        if (footerInfoText) footerInfoText.textContent = "Hiển thị 0 / 0 bài viết";
        renderPostPagination(0);
        return;
    }

    // Tính toán phân trang 5 bài mỗi trang
    const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
    if (postCurrentPage > totalPages) postCurrentPage = totalPages;
    if (postCurrentPage < 1) postCurrentPage = 1;

    const startIdx = (postCurrentPage - 1) * POSTS_PER_PAGE;
    const endIdx = Math.min(startIdx + POSTS_PER_PAGE, filtered.length);
    const pageItems = filtered.slice(startIdx, endIdx);

    if (footerInfoText) {
        footerInfoText.textContent = `Hiển thị ${startIdx + 1} - ${endIdx} trong tổng số ${filtered.length} bài viết`;
    }

    tbody.innerHTML = pageItems.map(p => {
        const tradeType = getTradeType(p);
        let tradePillHtml = "";
        if (tradeType === "buy") {
            tradePillHtml = `<span class="trade-pill-buy">CẦN MUA</span>`;
        } else if (tradeType === "sell" || tradeType === "giveaway") {
            tradePillHtml = `<span class="trade-pill-sell">CẦN BÁN</span>`;
        } else {
            tradePillHtml = `<span class="trade-pill-swap">TRAO ĐỔI</span>`;
        }

        const isWanted = (p.kind === "wanted");
        const isSale = (p.kind === "sale");
        const kindLabel = isWanted ? "Tin tìm đồ" : (isSale ? "Đăng bán" : "Cộng đồng");
        const createdDate = p.created ? new Date(p.created).toLocaleDateString("vi-VN") : "Hôm nay";
        const isWarned = p.status === 'warned' || p.isReported;

        const statusHtml = isWarned
            ? `<span style="color: #D97706; font-size: 11.5px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; background: #FEF3C7; padding: 3px 8px; border-radius: 999px;">⚠️ Đã cảnh báo</span>`
            : `<span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background-color: #10B981; margin-right: 6px;"></span><span style="font-size: 12.5px; color: #1E293B; font-weight: 500;">Công khai</span>`;

        return `
            <tr data-id="${p.id}">
                <td>
                    <div class="post-title-text" title="${p.title}">${p.title}</div>
                    <div class="post-snippet-text">${p.text || ''}</div>
                </td>
                <td>
                    ${tradePillHtml}
                </td>
                <td>
                    <span class="kind-badge-community">${kindLabel}</span>
                </td>
                <td>
                    <span style="font-weight: 600; color: #1E293B;">${p.user_id || 'Sinh viên'}</span>
                </td>
                <td>
                    <span style="font-size: 12.5px; color: #64748B;">${p.school || 'ĐHQG TP.HCM'}</span>
                </td>
                <td>
                    <span style="font-size: 12px; color: #94A3B8;">${createdDate}</span>
                </td>
                <td>
                    ${statusHtml}
                </td>
                <td style="text-align: right;">
                    <div class="action-btn-group">
                        <button class="btn-action-icon btn-view" title="Xem nội dung chi tiết bài viết" onclick="viewPost('${p.id}')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        <button class="btn-action-icon btn-warn" title="Cảnh báo vi phạm & Lưu vào mục Báo cáo" onclick="openWarnModal('${p.id}')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </button>
                        <button class="btn-action-icon btn-delete" title="Xóa bài viết vi phạm" onclick="deletePost('${p.id}')">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    renderPostPagination(totalPages);
}

function renderPostPagination(totalPages) {
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

    if (prevPageBtn) prevPageBtn.disabled = (postCurrentPage === 1);
    if (nextPageBtn) nextPageBtn.disabled = (postCurrentPage === totalPages);

    for (let i = 1; i <= totalPages; i++) {
        const numBtn = document.createElement("button");
        numBtn.className = `pagination-num-btn ${i === postCurrentPage ? "active" : ""}`;
        numBtn.textContent = i;
        numBtn.addEventListener("click", () => {
            postCurrentPage = i;
            renderPostsTable();
        });
        paginationNumbers.appendChild(numBtn);
    }
}

// Mở modal xem chi tiết khi bấm CON MẮT
function viewPost(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    viewingPostId = postId;
    const modal = document.getElementById("viewPostModal");
    const tradeType = getTradeType(post);

    const pill = document.getElementById("modalTradePill");
    if (pill) {
        if (tradeType === "buy") {
            pill.className = "trade-pill-buy";
            pill.textContent = "CẦN MUA";
        } else if (tradeType === "sell" || tradeType === "giveaway") {
            pill.className = "trade-pill-sell";
            pill.textContent = "CẦN BÁN";
        } else {
            pill.className = "trade-pill-swap";
            pill.textContent = "TRAO ĐỔI";
        }
    }

    const kindBadge = document.getElementById("modalKindBadge");
    if (kindBadge) {
        kindBadge.textContent = post.kind === "wanted" ? "Tin cần tìm gấp" : (post.kind === "sale" ? "Tin đăng bán" : "Cộng đồng thảo luận");
    }

    document.getElementById("modalPostTitle").textContent = post.title || "Bài viết không có tiêu đề";
    document.getElementById("modalAuthor").textContent = post.user_id || "Sinh viên UniSwap";
    document.getElementById("modalSchool").textContent = post.school || "ĐH Quốc Gia TP.HCM";
    document.getElementById("modalDate").textContent = post.created ? new Date(post.created).toLocaleString("vi-VN") : "Hôm nay";
    document.getElementById("modalPostContent").textContent = post.text || "(Không có nội dung mô tả)";

    modal.classList.remove("hidden");
}

// Mở modal Cảnh báo vi phạm
function openWarnModal(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    warningTargetPost = post;

    const modal = document.getElementById("warnPostModal");
    document.getElementById("warnTargetTitle").textContent = post.title || "Bài viết không có tiêu đề";
    document.getElementById("warnTargetAuthor").textContent = post.user_id || "Sinh viên";
    document.getElementById("warnReasonSelect").value = "Nội dung spam / lừa đảo sinh viên";
    document.getElementById("customReasonWrap").style.display = "none";
    document.getElementById("customReasonInput").value = "";

    modal.classList.remove("hidden");
}

// Xác nhận gửi báo cáo vi phạm vào backend
async function submitWarnReport() {
    if (!warningTargetPost) return;
    const select = document.getElementById("warnReasonSelect");
    let reason = select.value;
    if (reason === "custom") {
        reason = document.getElementById("customReasonInput").value.trim() || "Cảnh báo vi phạm nội dung";
    }

    try {
        const res = await fetch("/api/admin/reports/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                targetId: warningTargetPost.id,
                title: warningTargetPost.title,
                author: warningTargetPost.user_id,
                reason: reason,
                type: "post"
            })
        });

        if (res.ok) {
            warningTargetPost.status = "warned";
            warningTargetPost.isReported = true;
            renderPostsTable();
            document.getElementById("warnPostModal").classList.add("hidden");
            alert(`✅ Đã gửi cảnh báo đối với bài đăng:\n"${warningTargetPost.title}"\n\nMục này đã được lưu vào hệ thống "Báo cáo vi phạm" để theo dõi & xử lý.`);
        }
    } catch(e) {
        console.error("Lỗi gửi cảnh báo:", e);
    }
}

// Xóa bài viết
async function deletePost(postId) {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này khỏi hệ thống?")) return;
    try {
        await fetch("/api/admin/posts/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: postId })
        });
        allPosts = allPosts.filter(p => p.id !== postId);
        renderPostsTable();
        const modal = document.getElementById("viewPostModal");
        if (modal) modal.classList.add("hidden");
    } catch (e) {
        console.error("Lỗi xóa bài viết:", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    startLiveDateTime();
    loadPosts();

    // Lọc theo nút
    document.querySelectorAll(".category-filters-list .filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".category-filters-list .filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-type");
            postCurrentPage = 1;
            renderPostsTable();
        });
    });

    // Tìm kiếm
    const searchInput = document.getElementById("postSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            postSearchQuery = e.target.value.trim();
            postCurrentPage = 1;
            renderPostsTable();
        });
    }

    // Nút phân trang Trước / Sau
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");
    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (postCurrentPage > 1) {
                postCurrentPage--;
                renderPostsTable();
            }
        });
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            const filteredCount = allPosts.filter(p => {
                const tradeType = getTradeType(p);
                let matchFilter = true;
                if (currentFilter === "sell") matchFilter = (tradeType === "sell" || p.kind === "sale" || tradeType === "giveaway");
                if (currentFilter === "buy") matchFilter = (tradeType === "buy" || p.kind === "wanted");
                if (currentFilter === "community") matchFilter = (p.kind === "community" || tradeType === "swap");
                let matchSearch = !postSearchQuery || 
                    (p.title && p.title.toLowerCase().includes(postSearchQuery.toLowerCase())) ||
                    (p.text && p.text.toLowerCase().includes(postSearchQuery.toLowerCase())) ||
                    (p.user_id && p.user_id.toLowerCase().includes(postSearchQuery.toLowerCase()));
                return matchFilter && matchSearch;
            }).length;
            const totalPages = Math.ceil(filteredCount / POSTS_PER_PAGE);
            if (postCurrentPage < totalPages) {
                postCurrentPage++;
                renderPostsTable();
            }
        });
    }

    // Modal Xem chi tiết
    const viewModal = document.getElementById("viewPostModal");
    const closeViewBtn = document.getElementById("closeViewModalBtn");
    const dismissViewBtn = document.getElementById("dismissViewBtn");
    const modalDeleteBtn = document.getElementById("modalDeleteBtn");

    if (closeViewBtn && viewModal) {
        closeViewBtn.addEventListener("click", () => viewModal.classList.add("hidden"));
    }
    if (dismissViewBtn && viewModal) {
        dismissViewBtn.addEventListener("click", () => viewModal.classList.add("hidden"));
    }
    if (modalDeleteBtn) {
        modalDeleteBtn.addEventListener("click", () => {
            if (viewingPostId) deletePost(viewingPostId);
        });
    }

    // Modal Cảnh báo vi phạm
    const warnModal = document.getElementById("warnPostModal");
    const closeWarnBtn = document.getElementById("closeWarnModalBtn");
    const cancelWarnBtn = document.getElementById("cancelWarnBtn");
    const submitWarnBtn = document.getElementById("submitWarnBtn");
    const reasonSelect = document.getElementById("warnReasonSelect");
    const customWrap = document.getElementById("customReasonWrap");

    if (closeWarnBtn && warnModal) {
        closeWarnBtn.addEventListener("click", () => warnModal.classList.add("hidden"));
    }
    if (cancelWarnBtn && warnModal) {
        cancelWarnBtn.addEventListener("click", () => warnModal.classList.add("hidden"));
    }
    if (reasonSelect && customWrap) {
        reasonSelect.addEventListener("change", (e) => {
            customWrap.style.display = e.target.value === "custom" ? "block" : "none";
        });
    }
    if (submitWarnBtn) {
        submitWarnBtn.addEventListener("click", submitWarnReport);
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
            try { await fetch("/api/logout", { method: "POST" }); } catch (err) {}
            window.location.href = "/";
        });
    }
});
