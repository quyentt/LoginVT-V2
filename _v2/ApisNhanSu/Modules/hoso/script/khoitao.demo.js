/* Dữ liệu mẫu cho khoitao — chỉ dùng ở chế độ dựng thử. Danh sách nhân sự + cơ cấu tổ chức có sẵn trong demo-data.js. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    function dm(p) { return p.map(function (x) { return { ID: x[0], MA: x[0], TEN: x[1] }; }); }
    fx[D + 'NS.GITI'] = dm([['NAM', 'Nam'], ['NU', 'Nữ']]);
    fx[D + 'CHUN.CHLU'] = dm([['VN', 'Việt Nam'], ['JP', 'Nhật Bản']]);
    fx[D + 'NS.LTNS'] = dm([['LDT1', 'Viên chức'], ['LDT2', 'Hợp đồng lao động']]);
    fx[D + 'NS.LGV0'] = dm([['LGV1', 'Cơ hữu'], ['LGV2', 'Thỉnh giảng']]);
    fx['NS_HoSoV2/LayChiTiet'] = function (o) {
        return [{ ID: o.strId, HODEM: 'Nguyễn Văn', TEN: 'Hùng', TENGOIKHAC: '', NGAYSINH: '12', THANGSINH: '04', NAMSINH: '1975',
            GIOITINH_ID: 'NAM', QUOCTICH_ID: 'VN', EMAIL: 'hung.nv@truong.edu.vn', SDT_CANHAN: '0912000111', DAOTAO_COCAUTOCHUC_ID: 'CC1',
            MASO: 'CB001', TINHTRANGNHANSU_ID: 'TT1', LOAIDOITUONG_ID: 'LDT1', LOAIGIANGVIEN_ID: 'LGV1', ANH: '' }];
    };
    fx['NS_HoSoV2/ThemMoi'] = { rows: [], raw: { Id: 'NSMOI1' } };
    fx['NS_HoSoV2/CapNhat'] = [];
    fx['NS_HoSoV2/KeThua'] = [];
    fx['NS_HoSoV2/Xoa'] = [];
    ums.demo.add(fx);
})();
