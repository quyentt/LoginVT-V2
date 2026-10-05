/* Dữ liệu mẫu chung cho ba màn phân quyền (thi trắc nghiệm) — chỉ dùng ở chế độ dựng thử.
   Danh sách người dùng lấy từ ApisCMS/Modules/nguoidung/script/_chung.demo.js (nạp kèm _chung.js). */
(function () {
    'use strict';
    var TT = 'QLTTN_ThongTin/';
    var seq = 100;
    var DV = [
        { ID: 'DV01', CODE: 'KCNTT', NAME: 'Khoa Công nghệ thông tin' },
        { ID: 'DV02', CODE: 'KKT', NAME: 'Khoa Kinh tế' },
        { ID: 'DV03', CODE: 'KNN', NAME: 'Khoa Ngoại ngữ' },
        { ID: 'DV04', CODE: 'TTKT', NAME: 'Trung tâm Khảo thí và Đảm bảo chất lượng' },
        { ID: 'DV05', CODE: 'KLLCT', NAME: 'Khoa Lý luận chính trị' }
    ];
    var MUC = {
        PHEDUYETNHCH: [{ ID: 'MN1', NAME: 'Cấp 1 - Giảng viên biên soạn' }, { ID: 'MN2', NAME: 'Cấp 2 - Bộ môn thẩm định' }, { ID: 'MN3', NAME: 'Cấp 3 - Khảo thí phê duyệt' }],
        PHEDUYETDIEM: [{ ID: 'MD1', NAME: 'Giảng viên coi thi công nhận' }, { ID: 'MD2', NAME: 'Khảo thí công nhận' }, { ID: 'MD3', NAME: 'Giáo vụ công nhận' }, { ID: 'MD4', NAME: 'Đào tạo công nhận' }]
    };
    var NHOM = {
        DV01: [{ ID: 'GQ11', CODE: 'CNTT.THDC', NAME: 'Tin học đại cương' }, { ID: 'GQ12', CODE: 'CNTT.CSDL', NAME: 'Cơ sở dữ liệu' }, { ID: 'GQ13', CODE: 'CNTT.MMT', NAME: 'Mạng máy tính' }],
        DV02: [{ ID: 'GQ21', CODE: 'KT.KTVM', NAME: 'Kinh tế vi mô' }, { ID: 'GQ22', CODE: 'KT.NLKT', NAME: 'Nguyên lý kế toán' }],
        DV03: [{ ID: 'GQ31', CODE: 'NN.TA1', NAME: 'Tiếng Anh 1' }],
        DV04: [], DV05: [{ ID: 'GQ51', CODE: 'LLCT.TH', NAME: 'Triết học Mác - Lênin' }]
    };
    function tatCaNhom() { return Object.keys(NHOM).reduce(function (a, k) { return a.concat(NHOM[k]); }, []); }

    /* Trạng thái: phân quyền đơn vị theo người dùng (ID dòng → { USERID, DONVIID, muc: { mucId: true } }) */
    var PQ = [
        { ID: 'PQ1', USERID: 'U01', DONVIID: 'DV01', muc: { MN1: true, MN2: true, MD1: true } },
        { ID: 'PQ2', USERID: 'U01', DONVIID: 'DV04', muc: { MN3: true, MD2: true } },
        { ID: 'PQ3', USERID: 'U02', DONVIID: 'DV02', muc: { MN1: true } }
    ];
    var PQN = [{ ID: 'PN1', USERID: 'U01', GQID: 'GQ11' }, { ID: 'PN2', USERID: 'U01', GQID: 'GQ12' }, { ID: 'PN3', USERID: 'U03', GQID: 'GQ21' }];

    function tenMuc(p, loai) {
        return MUC[loai].filter(function (m) { return p.muc[m.ID]; }).map(function (m) { return m.NAME; }).join(', ');
    }
    function trang(rows, o) {
        var sz = Number(o.ItemPerPage) || 10, p = Number(o.PageNumber) || 1;
        return { rows: rows.slice((p - 1) * sz, p * sz), pager: rows.length };
    }
    function dv(id) { return DV.filter(function (d) { return d.ID === id; })[0] || {}; }

    var fx = {};
    fx[TT + 'LayDS_DonViByUserId'] = DV.map(function (d) { return { ID: d.ID, NAME: d.NAME }; });
    fx[TT + 'LayDS_NguoiDungDonVi_DaPQ'] = function (o) {
        var rows = PQ.filter(function (p) { return p.USERID === o.strUserId; }).map(function (p) {
            var d = dv(p.DONVIID);
            return { ID: p.ID, DONVIID: p.DONVIID, CODE: d.CODE, NAME: d.NAME, TENNGUOIDUNGCAPPHANQUYEN: tenMuc(p, 'PHEDUYETNHCH'),
                QUYENDUOCCAP_PHEDUYETNHCH: tenMuc(p, 'PHEDUYETNHCH'), QUYENDUOCCAP_PHEDUYETDIEM: tenMuc(p, 'PHEDUYETDIEM') };
        });
        return trang(rows, o);
    };
    fx[TT + 'LayDS_NguoiDungDonVi_ChuaPQ'] = function (o) {
        var co = PQ.filter(function (p) { return p.USERID === o.strUserId; }).map(function (p) { return p.DONVIID; });
        return trang(DV.filter(function (d) { return co.indexOf(d.ID) < 0; }), o);
    };
    fx[TT + 'Them_NguoiDungDonVi'] = function (o) { PQ.push({ ID: 'PQ' + (++seq), USERID: o.strUserId, DONVIID: o.strDepartOrganId, muc: {} }); return []; };
    fx[TT + 'Xoa_NguoiDungDonVi'] = function (o) {
        for (var i = PQ.length - 1; i >= 0; i--) if (PQ[i].ID === o.strId) PQ.splice(i, 1);
        return [];
    };
    function timPQ(o) { return PQ.filter(function (p) { return p.USERID === o.strUserId && p.DONVIID === o.strDonViId; })[0]; }
    fx[TT + 'LayDS_NguoiDungMucPheDuyet'] = function (o) {
        var p = timPQ(o);
        return MUC.PHEDUYETNHCH.map(function (m) { return { ID: m.ID, NAME: m.NAME, DAPHANQUYEN: p && p.muc[m.ID] ? 1 : 0 }; });
    };
    fx[TT + 'LayDS_NguoiDung_MucPheDuyet'] = function (o) {
        var p = timPQ(o);
        return (MUC[o.strLoaiPheDuyet] || []).map(function (m) { return { ID: m.ID, NAME: m.NAME, MUCPHEDUYET_NGUOIDUNGID: p && p.muc[m.ID] ? 'X' + m.ID : null }; });
    };
    fx[TT + 'Them_MucNguoiDungDonVi'] = function (o) {
        var p = timPQ(o);
        if (p) { if (o.strCoQuyen === '1') p.muc[o.strMucPheDuyetId] = true; else delete p.muc[o.strMucPheDuyetId]; }
        return [];
    };
    fx[TT + 'LayDS_GroupQuestion_DaPQ'] = function (o) {
        var all = tatCaNhom();
        var rows = PQN.filter(function (p) { return p.USERID === o.strUserId; }).map(function (p) {
            var q = all.filter(function (x) { return x.ID === p.GQID; })[0] || {};
            return { ID: p.ID, CODE: q.CODE, NAME: q.NAME };
        });
        return trang(rows, o);
    };
    fx[TT + 'LayDS_GroupQuestion_ChuaPQ'] = function (o) {
        var co = PQN.filter(function (p) { return p.USERID === o.strUserId; }).map(function (p) { return p.GQID; });
        var nguon = o.strDepartOrganId ? (NHOM[o.strDepartOrganId] || []) : tatCaNhom();
        return trang(nguon.filter(function (q) { return co.indexOf(q.ID) < 0; }), o);
    };
    fx[TT + 'Them_PhanQuyenGroupQuestion'] = function (o) { PQN.push({ ID: 'PN' + (++seq), USERID: o.strUserId, GQID: o.strGroupQuestionId }); return []; };
    fx[TT + 'Xoa_PhanQuyenGroupQuestion'] = function (o) {
        for (var i = PQN.length - 1; i >= 0; i--) if (PQN[i].ID === o.strId) PQN.splice(i, 1);
        return [];
    };
    ums.demo.add(fx);
})();
