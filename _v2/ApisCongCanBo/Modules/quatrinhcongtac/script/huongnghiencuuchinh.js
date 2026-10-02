/* =========================================================================
   Hướng nghiên cứu chính — hồ sơ cá nhân  (CHƯA DÙNG ĐƯỢC — chờ API đúng)
   Bản gốc: ApisCongCanBo/Modules/quatrinhcongtac/script/huongnghiencuuchinh.js
   ---------------------------------------------------------------------------
   Bản gốc là bản chép của màn "Quá trình sức khỏe" chưa sửa xong:
     · mọi lời gọi là NS_QT_KhamSucKhoe (LayDanhSach / ThemMoi / CapNhat / Xoa /
       LayChiTiet) với tham số của khám sức khỏe (nhóm máu, chiều cao, cân nặng…)
       đọc từ các ô KHÔNG có trên màn;
     · ô duy nhất của màn — "Hướng nghiên cứu chính" (txt_HuongNghienCuuChinh)
       — không bao giờ được đọc khi lưu;
     · thêm xong còn gọi ThietLapQuaTrinhCuoiCung(…, "NHANSU_QT_KHAMSK").
   Tức bấm Lưu trên hệ cũ tạo một bản ghi KHÁM SỨC KHỎE rỗng và đặt nó làm quá
   trình sức khỏe cuối cùng; bảng thì hiện danh sách khám sức khỏe.

   Không chép lỗi đó (CHUYEN-DOI.md mục 1 luật 4): giữ khung màn và hai nút của
   bản gốc (Thêm mới, Tải lại) ở trạng thái khoá, kèm lời nhắc. Khi có
   controller/procedure đúng cho hướng nghiên cứu, thay khung này bằng ums.crud
   với một ô textarea "Hướng nghiên cứu chính".
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('huongnghiencuuchinh');

    root.innerHTML =
        pat.page('Hướng nghiên cứu chính',
            ui.btn('add', { attr: { disabled: 'disabled', title: 'Chưa có API cho hướng nghiên cứu' } })) +
        pat.panel({
            title: 'Tóm tắt hướng nghiên cứu chính', icon: 'fa-magnifying-glass-chart',
            tools: '<button type="button" class="ums-iconbtn" disabled title="Tải lại"><i class="fa-light fa-rotate-right"></i></button>',
            body: ui.empty('Chức năng chưa dùng được: bản gốc ghi nhầm vào bảng khám sức khỏe. ' +
                'Cần xác định API lưu hướng nghiên cứu chính.', 'fa-screwdriver-wrench')
        });
})();
