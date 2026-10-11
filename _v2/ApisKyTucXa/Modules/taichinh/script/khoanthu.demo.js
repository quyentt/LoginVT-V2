/* Dữ liệu mẫu cho taichinh/khoanthu (KTX) — chỉ dùng ở chế độ dựng thử. Ghi đè TC_KhoanThu/* của demo-data.js bằng kho riêng (có ThemMoi / CapNhat / Xoa). */
(function () {
    var NHOM = [{ ID: 'NK1', MA: 'HP', TEN: 'Học phí' }, { ID: 'NK2', MA: 'LP', TEN: 'Lệ phí' }, { ID: 'NK4', MA: 'KTX', TEN: 'Ký túc xá' }];
    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TC.NKT0'] = NHOM;
    ums.demo.add(fx);
    function ten(id) { var r = NHOM.filter(function (x) { return x.ID === id; })[0]; return r ? r.TEN : ''; }
    ums.demo.crudStore('TC_KhoanThu', [
        { ID: 'KT5', MA: 'KTX', TEN: 'Phí ký túc xá', THUTU: 1, NHOMCACKHOANTHU_ID: 'NK4', NHOMCACKHOANTHU_TEN: 'Ký túc xá', MOTA: 'Tiền phòng ở theo tháng' },
        { ID: 'KT6', MA: 'KTXDIEN', TEN: 'Phí điện', THUTU: 2, NHOMCACKHOANTHU_ID: 'NK4', NHOMCACKHOANTHU_TEN: 'Ký túc xá', MOTA: 'Tiền điện theo chỉ số công tơ' },
        { ID: 'KT7', MA: 'KTXNUOC', TEN: 'Phí nước', THUTU: 3, NHOMCACKHOANTHU_ID: 'NK4', NHOMCACKHOANTHU_TEN: 'Ký túc xá', MOTA: 'Tiền nước theo chỉ số công tơ' },
        { ID: 'KT1', MA: 'HP', TEN: 'Học phí', THUTU: 4, NHOMCACKHOANTHU_ID: 'NK1', NHOMCACKHOANTHU_TEN: 'Học phí', MOTA: '' }
    ], { list: function (rows, o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) { return (!o.strNhomCacKhoanThu_Id || r.NHOMCACKHOANTHU_ID === o.strNhomCacKhoanThu_Id) && (!q || (r.MA + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0); });
    }, map: function (o) {
        return { TEN: o.strTen, MA: o.strMa, THUTU: o.iThuTu, NHOMCACKHOANTHU_ID: o.strNhomCacKhoanThu_Id, NHOMCACKHOANTHU_TEN: ten(o.strNhomCacKhoanThu_Id), MOTA: o.strMoTa };
    } });
})();
