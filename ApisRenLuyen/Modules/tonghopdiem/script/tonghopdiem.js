/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TongHopDiem() { };
TongHopDiem.prototype = {
    strTongHopDiem_Id: '',
    dtTongHopDiem: [],
    strPhamViMa: '',
    dtThieuDRL: [],
    isLoading_ThieuDRL: false,
    // Điều kiện lọc tại thời điểm tìm kiếm — ghi vào dòng phụ đề của file Excel cho khớp với dữ liệu đang xem
    arrLoc_TongHopDiem: [],
    arrLoc_ThieuDRL: [],
    // Các mục đã chọn ở ô tìm kiếm ngoài màn hình tại thời điểm tìm — làm mặc định (tích sẵn) cho hộp thoại lọc thêm khi xuất
    objLoc_TongHopDiem: {},
    objLoc_ThieuDRL: {},

    // Cột khai báo 1 lần: dùng cho cả vẽ bảng (loadToTable_data) lẫn xuất Excel (edu.exporter)
    aoColumns_TongHopDiem: [
        { "mDataProp": "DAOTAO_HEDAOTAO_TEN" },
        { "mDataProp": "DAOTAO_KHOADAOTAO_TEN" },
        { "mDataProp": "DAOTAO_KHOAQUANLY_TEN" },
        { "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN" },
        { "mDataProp": "DAOTAO_LOPQUANLY_TEN" },
        { "mDataProp": "MASO" },
        {
            "mData": "Daotao_Lopquanly_Ten",
            "mRender": function (nrow, aData) {
                return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
            }
        },
        { "mDataProp": "QLSV_NGUOIHOC_NGAYSINH" },
        { "mDataProp": "GIOITINH_TEN" },
        { "mDataProp": "XEPLOAI_TEN" },
        { "mDataProp": "DIEM" },
        { "mDataProp": "DIEMQUYDOI" },
        { "mDataProp": "GHICHU" }
    ],
    aoColumns_ThongKe: [
        { "mDataProp": "TEN" },
        { "mDataProp": "SOLUONG" }
    ],
    aoColumns_ThieuDRL: [
        { "mDataProp": "MASO" },
        {
            "mData": "HoTen",
            "mRender": function (nrow, aData) {
                return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
            }
        },
        { "mDataProp": "TRANGTHAI_TEN" },
        { "mDataProp": "TENLOP" },
        {
            "mData": "ChuongTrinh",
            "mRender": function (nrow, aData) {
                return edu.util.returnEmpty(aData.TENCHUONGTRINH) + " - " + edu.util.returnEmpty(aData.MACHUONGTRINH);
            }
        },
        { "mDataProp": "TENKHOA" },
        { "mDataProp": "TENKHOAQUANLY" },
        { "mDataProp": "TENHEDAOTAO" }
    ],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_NamNhapHoc();
        me.getList_ThoiGianDaoTao();
        //me.getList_TongHopDiem();
        me.getList_TrangThaiSV();
        edu.util.viewValById("dropSearch_ChuongTrinhDaoTao", "");
        edu.util.viewValById("dropSearch_LopQuanLy", "");

        edu.system.loadToCombo_DanhMucDuLieu("DIEM.PHAMVITONGHOPDIEM", "", "", me.loadToCombo_PhamVi);
        edu.system.loadToCombo_DanhMucDuLieu("DRL.DOITUONGAPDUNG", "dropSearch_DoiTuong");
        // Thực hiện xếp loại: mở form tiến trình chung, chạy từng lớp quản lý
        $("#btnSave_XepLoai").click(function (e) {
            e.preventDefault();
            me.openProcess_XepLoai();
        });

        $("#btnSearch").click(function () {
            me.getList_TongHopDiem();
        });

        $("#btnThongKe_ThieuDRL").click(function (e) {
            e.preventDefault();
            if (me.isLoading_ThieuDRL === true) return;
            me.getList_TongHopThieuDRL();
        });
        // Xuất Excel theo chuẩn chung (Corei/exportexcel.js): trang chỉ khai báo tiêu đề + cột + dữ liệu
        if (edu.exporter) {
            edu.exporter.bindButton("#btnExport_KetQua", function () { return me.getOpts_ExportKetQua(); });
            edu.exporter.bindButton("#btnExport_ThieuDRL", function () { return me.getOpts_ExportThieuDRL(); });
        }
        else {
            // Triển khai thủ công có thể thiếu file: báo rõ thay vì để nút không phản ứng
            $("#btnExport_KetQua, #btnExport_ThieuDRL").click(function (e) {
                e.preventDefault();
                edu.system.alert("Chưa cập nhật chức năng xuất Excel (thiếu Corei/exportexcel.js hoặc indexi.aspx).", "w");
            });
        }
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TieuChiXepLoai();
            }
        });

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropSearch_ChuongTrinhDaoTao").on("select2:select", function () {
            me.getList_LopQuanLy();
        });
        $("#dropSearch_NamHoc").on("select2:select", function () {
            me.getList_ThoiGianDaoTao();
        });

        //$("#dropSearch_PhanViTongHop").on("select2:select", function () {
        //    var strMa = $("#dropSearch_PhanViTongHop option:selected").attr("id");
        //    me.strPhamViMa = strMa;
        //});

        // Override handler Import ở scope module để chèn thanh tiến trình.
        // Bind delegate ở container gần hơn document nên sẽ chạy trước handler
        // global tại Corei/systemroot.js:225; stopImmediatePropagation chặn tiếp global.
        $("#zonebtnTongHopDiem_Import")
            .off("click.THDProgress", ".btnImportWithProce")
            .on("click.THDProgress", ".btnImportWithProce", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                me.showImport_WithProgress($(this).attr("title"), $(this).attr("name"));
            });

        edu.system.getList_MauImport("zonebtnBaoCao_TongHopDiem", function (addKeyValue) {
            var strDaoTao_ThoiGianDaoTao_Id = "";
            
            (edu.util.getValCombo('dropSearch_ThoiGianDaoTao') === "") ? strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropSearch_NamHoc'): strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropSearch_ThoiGianDaoTao');
            addKeyValue("strChucNang_Id", edu.system.strChucNang_Id);
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", strDaoTao_ThoiGianDaoTao_Id);
            addKeyValue("strDaoTao_NamApDung", edu.util.getValCombo('dropSearch_NamHoc'));
            addKeyValue("strDoiTuongApDung_Id", edu.util.getValCombo('dropSearch_DoiTuong'));
            addKeyValue("strDaoTao_LopQuanLy_Id", edu.util.getValCombo('dropSearch_LopQuanLy'));
            addKeyValue("strDaoTao_ChuongTrinh_Id", edu.util.getValCombo('dropSearch_ChuongTrinhDaoTao'));
            addKeyValue("strQLSV_TrangThaiNguoiHoc_Id", edu.util.getValCombo('dropSearch_TrangThai'));
            addKeyValue("strDaoTao_KhoaDaoTao_Id", edu.util.getValCombo('dropSearch_KhoaDaoTao'));
            addKeyValue("strDaoTao_HeDaoTao_Id", edu.util.getValCombo('dropSearch_HeDaoTao'));
        });
    },
    /*------------------------------------------
    --Discription: [3] Thực hiện xếp loại — "gửi vào" form tiến trình chung (Corei/processrun.js, edu.process).
    -- Bước 1 nạp danh sách lớp quản lý trong phạm vi đang chọn; form chạy từng lớp, báo giờ bắt đầu/kết thúc,
    -- kết quả, ghi chú lỗi, có tổng hợp thành công/lỗi và xuất Excel danh sách lỗi/thành công.
    -------------------------------------------*/
    // Các lớp sẽ xếp loại: những lớp đang chọn ở ô "Lớp quản lý"; không chọn lớp nào thì lấy tất cả lớp
    // trong phạm vi hệ/khóa/chương trình đang chọn (chính là danh sách của ô chọn lớp)
    getItems_XepLoai: function () {
        var items = [], seen = {};
        function pick($opts) {
            $opts.each(function () {
                var id = $(this).val();
                if (!id || id === "SELECTALL" || seen[id]) return;
                seen[id] = true;
                items.push({ ID: id, TEN: $(this).text().replace(/\s+/g, " ").trim() });
            });
        }
        pick($("#dropSearch_LopQuanLy option:selected"));
        if (items.length === 0) pick($("#dropSearch_LopQuanLy option"));
        return items;
    },
    openProcess_XepLoai: function () {
        var me = this;
        if (!edu.process) {
            edu.system.alert("Chưa cập nhật form tiến trình (thiếu Corei/processrun.js hoặc indexi.aspx).", "w");
            return;
        }
        // chụp điều kiện tại thời điểm mở form: mọi lớp chạy với cùng điều kiện
        var strThoiGian = edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc');
        var strDoiTuong = edu.util.getValCombo('dropSearch_DoiTuong');
        var strKhoa = edu.util.getValCombo('dropSearch_KhoaDaoTao');
        var strChuongTrinh = edu.util.getValCombo('dropSearch_ChuongTrinhDaoTao');
        var items = me.getItems_XepLoai(), notes = [];
        // chưa có danh sách lớp thì chạy 1 lần cho cả phạm vi, như trước đây
        if (items.length === 0) items = [{ ID: "", TEN: "Toàn bộ phạm vi đã chọn (không chia theo lớp)" }];
        if (!edu.util.checkValue(strThoiGian)) notes.push("Chưa chọn Năm học / Thời gian đào tạo.");
        edu.process.open({
            title: "Thực hiện xếp loại rèn luyện kỳ, năm, toàn khóa",
            subTitles: me.getFilterLines(),
            unit: "lớp quản lý",
            infoHeader: "Lớp quản lý",
            items: items,
            info: function (it) { return it.TEN; },
            notes: notes,
            fileName: "KetQuaXepLoaiRenLuyen",
            request: function (it) {
                var action = 'RL_XuLy/TongHopDRLTheoKyNamToanKhoa';
                return {
                    action: action,
                    data: {
                        'action': action,
                        'strChucNang_Id': edu.system.strChucNang_Id,
                        'strDaoTao_ThoiGianDaoTao_Id': strThoiGian,
                        'strDoiTuongApDung_Id': strDoiTuong,
                        'strDaoTao_LopQuanLy_Id': it.ID,
                        'strDaoTao_KhoaDaoTao_Id': strKhoa,
                        'strDaoTao_ChuongTrinh_Id': strChuongTrinh,
                        'strNguoiThucHien_Id': edu.system.userId
                    }
                };
            },
            // đóng form xong thì nạp lại danh sách để thấy kết quả xếp loại mới
            onClose: function (sum) {
                if (sum.ok > 0) me.getList_TongHopDiem();
            }
        });
    },
    getList_TongHopDiem: function (strDanhSach_Id) {
        var me = this;
        var arrLoc = me.getFilterLines();
        var objLoc = me.getSelectedLoc();
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc');
        //--Edit
        //var obj_list = {
        //    'action': 'RL_ThongTinChung/LayDSTongHopDRLTheoLop',
        //    'strChucNang_Id': edu.system.strChucNang_Id,
        //    'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
        //    'strQLSV_TrangThaiNguoiHoc_Id': edu.util.getValById('dropSearch_TrangThai'),
        //    'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
        //    'strDaoTao_LopQuanLy_Id': edu.util.getValCombo('dropSearch_LopQuanLy'),
        //    'strNguoiThucHien_Id': edu.system.userId,
        //};
        var obj_save = {
            'action': 'XLHV_RL_ThongTin_MH/DSA4BRIVLi8mCS4xBRMNFSkkLg0uMQPP',
            'func': 'pkg_diemrenluyen_thongtin.LayDSTongHopDRLTheoLop',
            'iM': edu.system.iM,
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropSearch_ChuongTrinhDaoTao'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strQLSV_TrangThaiNguoiHoc_Id': edu.util.getValById('dropSearch_TrangThai'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValCombo('dropSearch_LopQuanLy'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTongHopDiem = dtReRult;
                    me.arrLoc_TongHopDiem = arrLoc;
                    me.objLoc_TongHopDiem = objLoc;
                    me.genTable_TongHopDiem(dtReRult.rsChiTiet, data.Pager);
                    me.genTable_ThongKe(dtReRult.rsThongKe, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_TieuChiXepLoai: function () {
        var me = this;
        me.getList_TongHopDiem();
    },

    getList_TongHopThieuDRL: function () {
        var me = this;
        var strNamHoc = edu.util.getValById('dropSearch_NamHoc');
        var strThoiGianDaoTao = edu.util.getValById('dropSearch_ThoiGianDaoTao');
        if (!edu.util.checkValue(strNamHoc) && !edu.util.checkValue(strThoiGianDaoTao)) {
            edu.system.alert("Vui lòng chọn năm học hoặc thời gian đào tạo", "w");
            return;
        }

        // Tránh query quá rộng gây timeout: yêu cầu chọn thêm ít nhất 1 điều kiện lọc
        var strHeDaoTao = edu.util.getValCombo('dropSearch_HeDaoTao') || edu.system.getValById('dropSearch_HeDaoTao');
        var strKhoaDaoTao = edu.util.getValCombo('dropSearch_KhoaDaoTao') || edu.system.getValById('dropSearch_KhoaDaoTao');
        var strChuongTrinh = edu.util.getValCombo('dropSearch_ChuongTrinhDaoTao') || edu.system.getValById('dropSearch_ChuongTrinhDaoTao');
        var strLopQuanLy = edu.util.getValCombo('dropSearch_LopQuanLy');
        if (!edu.util.checkValue(strHeDaoTao) && !edu.util.checkValue(strKhoaDaoTao) && !edu.util.checkValue(strChuongTrinh) && !edu.util.checkValue(strLopQuanLy)) {
            edu.system.alert("Vui lòng chọn ít nhất 1 điều kiện lọc (Hệ đào tạo/Khóa đào tạo/Chương trình/Lớp quản lý)", "w");
            return;
        }

        var strDaoTao_ThoiGianDaoTao_Id = edu.util.checkValue(strThoiGianDaoTao) ? strThoiGianDaoTao : strNamHoc;

        var obj_save = {
            'action': 'XLHV_RL_ThongTin_MH/DSA4BRIVLi8mCS4xFSkoJDQFEw0P',
            'func': 'pkg_diemrenluyen_thongtin.LayDSTongHopThieuDRL',
            'iM': edu.system.iM,
            'strQLSV_TrangThaiNguoiHoc_Id': edu.util.getValById('dropSearch_TrangThai'),
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strDaoTao_HeDaoTao_Id': strHeDaoTao,
            'strDaoTao_KhoaDaoTao_Id': strKhoaDaoTao,
            'strDaoTao_ChuongTrinh_Id': strChuongTrinh,
            'strDaoTao_LopQuanLy_Id': strLopQuanLy,
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        var arrLoc = me.getFilterLines();
        var objLoc = me.getSelectedLoc();
        var t0 = new Date().getTime();
        try {
            console.log("[TongHopDiem][ThieuDRL] request", obj_save);
        } catch (e) { }

        me.isLoading_ThieuDRL = true;
        $("#btnThongKe_ThieuDRL").addClass("disabled");

        edu.system.makeRequest({
            success: function (data) {
                try {
                    console.log("[TongHopDiem][ThieuDRL] response", data, "elapsed(ms)=", (new Date().getTime() - t0));
                } catch (e) { }
                if (data.Success) {
                    var dtReRult = data.Data;
                    var rows = (dtReRult && dtReRult.rsChiTiet) ? dtReRult.rsChiTiet : dtReRult;
                    me.dtThieuDRL = rows || [];
                    me.arrLoc_ThieuDRL = arrLoc;
                    me.objLoc_ThieuDRL = objLoc;
                    $("#zone_thongke_thieudrl").show();
                    edu.system.pageIndex_default = 1;
                    me.renderTable_ThieuDRL_Paged();
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                try {
                    console.log("[TongHopDiem][ThieuDRL] error", er, "elapsed(ms)=", (new Date().getTime() - t0));
                } catch (e) { }
                if (er && er.statusText === "timeout") {
                    edu.system.alert("Timeout khi thống kê (60s). Vui lòng chọn thêm điều kiện lọc (ưu tiên Lớp quản lý) rồi thử lại.", "w");
                }
                else {
                    edu.system.alert(JSON.stringify(er), "w");
                }
            },
            complete: function () {
                me.isLoading_ThieuDRL = false;
                $("#btnThongKe_ThieuDRL").removeClass("disabled");
            },
            type: 'POST',
            action: obj_save.action,
            timeout: 60000,
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Xuất Excel — khai báo cho edu.exporter (Corei/exportexcel.js)
    -------------------------------------------*/
    // Điều kiện lọc đang chọn, thành 2 dòng phụ đề (ô nào chưa chọn thì bỏ qua)
    getFilterLines: function () {
        if (!edu.exporter) return [];
        return [
            edu.exporter.filterText([
                { label: "Hệ đào tạo", id: "dropSearch_HeDaoTao" },
                { label: "Khóa đào tạo", id: "dropSearch_KhoaDaoTao" },
                { label: "Chương trình", id: "dropSearch_ChuongTrinhDaoTao" },
                { label: "Lớp quản lý", id: "dropSearch_LopQuanLy" }
            ]),
            edu.exporter.filterText([
                { label: "Năm học", id: "dropSearch_NamHoc" },
                { label: "Thời gian đào tạo", id: "dropSearch_ThoiGianDaoTao" },
                { label: "Đối tượng", id: "dropSearch_DoiTuong" },
                { label: "Trạng thái", id: "dropSearch_TrangThai" }
            ])
        ];
    },
    // Tên các mục đang chọn ở ô tìm kiếm ngoài màn hình (chụp lúc tìm kiếm)
    getSelectedLoc: function () {
        if (!edu.exporter) return {};
        return {
            hedt: edu.exporter.selectedTexts("dropSearch_HeDaoTao"),
            khoa: edu.exporter.selectedTexts("dropSearch_KhoaDaoTao"),
            ct: edu.exporter.selectedTexts("dropSearch_ChuongTrinhDaoTao"),
            lop: edu.exporter.selectedTexts("dropSearch_LopQuanLy"),
            trangthai: edu.exporter.selectedTexts("dropSearch_TrangThai")
        };
    },
    getOpts_ExportKetQua: function () {
        var me = this;
        var loc = me.objLoc_TongHopDiem || {};
        var dt = me.dtTongHopDiem || {};
        var arrChiTiet = dt.rsChiTiet || [];
        if (arrChiTiet.length === 0) {
            edu.system.alert("Chưa có dữ liệu để xuất. Vui lòng chọn điều kiện và bấm Tìm kiếm trước.", "w");
            return null;
        }
        return {
            fileName: "TongHopDiemRenLuyen",
            sheets: [
                {
                    name: "Kết quả rèn luyện",
                    title: "DANH SÁCH KẾT QUẢ RÈN LUYỆN",
                    subTitles: me.arrLoc_TongHopDiem,
                    table: "tblTieuChi",
                    aoColumns: me.aoColumns_TongHopDiem,
                    // Cột 7-9: ngày sinh, giới tính, xếp loại (căn giữa); 10-11: điểm (số). Mã số giữ dạng chữ.
                    colOptions: { 7: { align: "center" }, 8: { align: "center" }, 9: { align: "center" }, 10: { type: "number" }, 11: { type: "number" } },
                    // Danh sách "lọc thêm khi xuất". Quy tắc chung: ngoài màn hình chọn gì thì tích sẵn đúng cái đó (selected),
                    // không chọn gì thì để trống = xuất tất cả. Khoa quản lý/Xếp loại/Giới tính không có ô tương ứng ngoài màn hình nên luôn để trống.
                    filters: [
                        { label: "Hệ đào tạo", field: "DAOTAO_HEDAOTAO_TEN", selected: loc.hedt },
                        { label: "Khóa đào tạo", field: "DAOTAO_KHOADAOTAO_TEN", selected: loc.khoa },
                        { label: "Khoa quản lý", field: "DAOTAO_KHOAQUANLY_TEN" },
                        { label: "Chương trình", field: "DAOTAO_TOCHUCCHUONGTRINH_TEN", selected: loc.ct },
                        { label: "Lớp quản lý", field: "DAOTAO_LOPQUANLY_TEN", selected: loc.lop },
                        { label: "Xếp loại", field: "XEPLOAI_TEN" },
                        { label: "Giới tính", field: "GIOITINH_TEN" }
                    ],
                    data: arrChiTiet
                },
                {
                    name: "Thống kê số lượng",
                    title: "THỐNG KÊ SỐ LƯỢNG THEO XẾP LOẠI",
                    // thống kê tính sẵn từ server trên toàn bộ kết quả tìm kiếm nên không khớp khi người dùng lọc thêm
                    skipWhenFiltered: true,
                    subTitles: me.arrLoc_TongHopDiem,
                    table: "tblThongKe",
                    aoColumns: me.aoColumns_ThongKe,
                    colOptions: { 1: { type: "number", format: "int", sum: true } },
                    data: dt.rsThongKe || []
                }
            ]
        };
    },
    getOpts_ExportThieuDRL: function () {
        var me = this;
        var loc = me.objLoc_ThieuDRL || {};
        if (!me.dtThieuDRL || me.dtThieuDRL.length === 0) {
            edu.system.alert("Chưa có dữ liệu để xuất.", "w");
            return null;
        }
        return {
            fileName: "DanhSachThieuDiemRenLuyen",
            name: "Thiếu điểm rèn luyện",
            title: "DANH SÁCH SINH VIÊN CÒN THIẾU ĐIỂM RÈN LUYỆN",
            subTitles: me.arrLoc_ThieuDRL,
            table: "tblThieuDRL",
            aoColumns: me.aoColumns_ThieuDRL,
            filters: [
                { label: "Hệ đào tạo", field: "TENHEDAOTAO", selected: loc.hedt },
                { label: "Khóa đào tạo", field: "TENKHOA", selected: loc.khoa },
                { label: "Khoa quản lý", field: "TENKHOAQUANLY" },
                { label: "Chương trình", field: "TENCHUONGTRINH", selected: loc.ct },
                { label: "Lớp", field: "TENLOP", selected: loc.lop },
                { label: "Trạng thái", field: "TRANGTHAI_TEN", selected: loc.trangthai }
            ],
            // toàn bộ danh sách, không chỉ trang đang xem
            data: me.dtThieuDRL
        };
    },

    renderTable_ThieuDRL_Paged: function () {
        var me = this;
        var allRows = me.dtThieuDRL || [];
        var totalRows = allRows.length;
        var pageIndex = edu.system.pageIndex_default || 1;
        var pageSize = edu.system.pageSize_default || 10;
        if (pageSize == -1) pageSize = 1000000;
        var start = (pageIndex - 1) * pageSize;
        if (start < 0) start = 0;
        if (start > totalRows) start = 0;
        var end = start + pageSize;
        if (end > totalRows) end = totalRows;
        var pageRows = allRows.slice(start, end);
        me.genTable_ThieuDRL(pageRows, totalRows);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TongHopDiem: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTieuChi",
            aaData: data,
            aoColumns: me.aoColumns_TongHopDiem
        };
        edu.system.loadToTable_data(jsonForm);
    },

    genTable_ThongKe: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThongKe",
            aaData: data,
            aoColumns: me.aoColumns_ThongKe
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(jsonForm.strTable_Id, [2]);
    },

    genTable_ThieuDRL: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThieuDRL",
            bPaginate: {
                strFuntionName: "main_doc.TongHopDiem.renderTable_ThieuDRL_Paged()",
                iDataRow: iPager,
            },
            aaData: data,
            aoColumns: me.aoColumns_ThieuDRL
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: edu.util.getValCombo("dropSearch_NamHoc"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };

        // Chỉ lấy danh sách Kỳ theo Năm đã chọn
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao_Ky',
            'iM': edu.system.iM,
            'strDAOTAO_Nam_Id': edu.util.returnEmpty(obj.strNam_Id),
            'strNguoiThucHien_Id': edu.util.returnEmpty(obj.strNguoiThucHien_Id),
            'strTuKhoa': edu.util.returnEmpty(obj.strTuKhoa),
            'pageIndex': edu.util.returnZero(obj.pageIndex),
            'pageSize': edu.util.returnZero(obj.pageSize)
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.loadToCombo_ThoiGianDaoTao(edu.util.checkValue(data.Data) ? data.Data : []);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.func + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValCombo("dropKhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: edu.util.getValCombo("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            'strNguoiThucHien_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadToCombo_NamNhapHoc(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
    },
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.cbGenBo_TrangThai(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        };
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_KhoaDaoTao", "");
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_ChuongTrinhDaoTao", "");
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_LopQuanLy", "");
    },
    cbGenBo_TrangThai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_TrangThai"]
        }
        edu.system.loadToCombo_data(obj);
        //$('#dropTinhTrangSinhVien option').prop('selected', true);
    },
    loadToCombo_PhamVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropSearch_PhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropSearch_NamHoc", "dropNamHoc"],
            type: "",
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: Fork của edu.system.showImportChungV2 dành riêng cho trang
    -- Tổng hợp điểm. Dùng panel import dùng chung (edu.process.importPanel):
    -- đồng hồ + số dòng khi đang chạy, xong hiện tổng hợp thành công/lỗi + xuất Excel.
    -- (Thanh giả lập 0→90% chỉ còn là dự phòng khi máy khách chưa có processrun.js mới.)
    -- API SImport chỉ trả về 1 response cuối nên không có % thật.
    -------------------------------------------*/
    showImport_WithProgress: function (strTenHienThi, strMaDanhMuc) {
        var me = this;
        if (strTenHienThi === undefined) strTenHienThi = "";
        var sCallback = $("a[name='" + strMaDanhMuc + "']").attr("callback");
        var url_report = "";
        if (edu.util.checkValue(strMaDanhMuc)) {
            url_report = edu.system.strhost + "/reportcms/Modules/Common/MauImport.aspx?Ma=" + strMaDanhMuc;
        }

        var row = '';
        row += '<div class="box-upload-file col-sm-6">';
        row += '<div class="row"><div class="col-sm-4"><i class="fa-solid fa-circle-check bold mr-5 color-blue"></i> Upload ' + strTenHienThi + ': </div><div class="col-sm-2"><div id="importToCheck"></div></div></div>';
        row += '<div class="row"><div class="col-sm-4"><i class="fa-solid fa-circle-check bold mr-5 color-blue"></i> Mẫu ' + strTenHienThi + ': </div><div class="col-sm-2"><a id="btnHSLL_Import" href="' + url_report + '"><i class="fa-solid fa-file-import"></i></a></div></div>';
        row += '</div>';
        row += '<div class="box-import-sheet col-sm-6">';
        row += '<div class="clear"><i class="fa-light fa-file-spreadsheet"></i> Sheet import</div>';
        row += '<div><div style="width: 400px;margin-top:5px"><select id="dropSearch_BangA" class="select-opt"></select></div></div>';
        row += '<div class="clear"></div>';
        row += '</div>';

        // Panel tiến trình + kết quả import dùng chung (edu.process.importPanel); thanh giả lập bên dưới chỉ là dự phòng khi máy khách chưa có processrun.js mới
        row += '<div id="zoneImportPanel" style="display:none"></div>';
        // Vùng thanh tiến trình (ẩn cho tới khi bấm "Thực hiện import")
        row += '<div id="zoneImportProgress_THD" style="display:none; margin:12px 0;">';
        row += '  <div class="clearfix" style="margin-bottom:4px">';
        row += '    <span class="pull-left" id="lblImportProgress_THD"><i class="fa fa-spinner fa-spin"></i> Đang xử lý import…</span>';
        row += '    <small class="pull-right" style="font-weight:bold;font-size:14px">Đã trôi: <span id="lblImportTime_THD">0s</span></small>';
        row += '  </div>';
        row += '  <div class="progress progress-sm active" style="margin-bottom:0;height:18px">';
        row += '    <div id="barImportProgress_THD" class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%;line-height:18px;transition:width .8s ease-out;">0%</div>';
        row += '  </div>';
        row += '  <div class="text-muted" style="margin-top:6px;font-size:12px">File lớn có thể mất vài phút. Vui lòng không đóng cửa sổ trong khi import.</div>';
        row += '</div>';

        row += '<div class="zone-content" id="tblChuaImport">';
        row += '  <div class="box-header with-border">';
        row += '    <h3 class="box-title"><i class="fa fa-list-alt"></i> Danh sách</h3>';
        row += '    <div class="pull-right"><a class="btn btn-primary" id="btnThucHienImport" href="#"><i class="fa fa-plus"></i> Thực hiện import</a></div>';
        row += '  </div>';
        row += '  <div class="clear"></div>';
        row += '  <div class="row row-align"><table id="tblBangA" class="table table-hover table-bordered"><tbody></tbody></table></div>';
        row += '</div>';

        row += '<div class="clear"></div>';
        row += '<div class="zone-content" id="tblImportLoi" style="display:none">';
        row += '  <div class="box-header with-border">';
        row += '    <h3 class="box-title"><i class="fa-duotone fa-regular fa-triangle-exclamation"></i>Danh sách Lỗi</h3>';
        row += '    <div class="pull-right"><a class="btn btn-primary" id="btnDownloadAllTableLoi" title="tblBangB" href="#"><i class="fa fa-cloud-download"></i> Tải file</a></div>';
        row += '  </div>';
        row += '  <div class="clear"></div>';
        row += '  <div class="row row-align"><table id="tblBangB" class="table table-hover table-bordered"><tbody></tbody></table></div>';
        row += '</div>';

        $("#modalBaoCao #modal_body").html(row);
        $("#modalBaoCao").modal("show");
        edu.system.uploadImport(["importToCheck"], edu.system.getList_DataImport);

        // Import chung chỉ gửi 1 lần và trả kết quả ở cuối (không có % thật) nên panel chỉ hiện đồng hồ + số dòng,
        // xong hiện tổng hợp thành công/lỗi, bảng từng dòng và nút xuất Excel (thay cho thanh 0→90% giả lập trước đây)
        var ip = null;
        if (edu.process && typeof edu.process.importPanel === "function") {
            ip = edu.process.importPanel({
                container: "#zoneImportPanel",
                title: strTenHienThi ? "Import " + strTenHienThi : "Kết quả import",
                fileName: "KetQuaImportTongHopDiem",
                source: function () { return edu.system.dtImport ? edu.system.dtImport[$("#dropSearch_BangA").val()] : null; },
                onBack: function () { ip.reset(); $("#tblChuaImport").show(); $("#tblImportLoi").hide(); }
            });
        }
        me._ip = ip;

        $('#dropSearch_BangA').on('change', function () {
            if (ip) ip.reset();
            $("#tblChuaImport").show();
            $("#tblImportLoi").hide();
            edu.system.genTable_Import_View(edu.system.dtImport[$("#dropSearch_BangA").val()], "tblBangA");
        });

        // Nếu người dùng đóng modal giữa chừng thì dọn timer
        $("#modalBaoCao").off("hidden.bs.modal.THDProgress")
            .on("hidden.bs.modal.THDProgress", function () {
                me._stopImportProgress();
                if (ip) ip.reset();
            });

        $("#btnThucHienImport").off("click.THD").on("click.THD", function () {
            if ($(this).hasClass("disabled")) return;
            var strFile = edu.util.getValById("importToCheck"), strSheet = $("#dropSearch_BangA").val();
            if (!strFile || !strSheet) {
                var strLoi = !strFile ? "Vui lòng chọn file import trước khi thực hiện." : "Vui lòng chọn sheet import.";
                if (ip) ip.fail(strLoi); else edu.system.alert(strLoi, "w");
                return;
            }
            if (ip) {
                var dtSheet = edu.system.dtImport ? edu.system.dtImport[strSheet] : null;
                $("#btnThucHienImport").addClass("disabled").css("pointer-events", "none");
                ip.start(dtSheet && dtSheet.length ? dtSheet.length : 0);
                $("#overlay").hide();
            }
            else me._startImportProgress();
            GetDuLieuDanhMuc();
        });

        $("#btnDownloadAllTableLoi").off("click.THD").on("click.THD", function () {
            edu.system.reportAllTable_User(this.title);
        });

        function GetDuLieuDanhMuc() {
            var obj_list = {
                'action': 'SYS_Import/SImport',
                'strPath': edu.util.getValById("importToCheck"),
                'strApp_Id': edu.system.appId,
                'strMaDanhMuc': strMaDanhMuc,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId,
                'strSheet': $("#dropSearch_BangA option:selected").text(),
                'lKeyVal': []
            };
            if (strMaDanhMuc === undefined || strMaDanhMuc === "") {
                ImportData(obj_list);
                return;
            }
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var lKeyVal = [];
                        for (var i = 0; i < data.Data.length; i++) {
                            if (edu.util.checkValue(data.Data[i].THONGTIN5)) {
                                lKeyVal.push({ strKey: data.Data[i].MA, strVal: eval(data.Data[i].THONGTIN5) });
                            }
                            if (data.Data[i].THONGTIN4 == "1") {
                                edu.system["strMaCotImport"] = data.Data[i].THONGTIN1;
                            }
                        }
                        obj_list.lKeyVal = lKeyVal;
                    }
                    ImportData(obj_list);
                },
                error: function (er) {
                    me._stopImportProgress();
                    if (ip) ip.fail("Không lấy được cấu hình danh mục import. Vui lòng thử lại.");
                    else edu.system.alert(JSON.stringify(er), "w");
                },
                type: 'GET',
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
                contentType: true,
                data: {
                    'strMaBangDanhMuc': strMaDanhMuc,
                    'strTieuChiSapXep': "",
                    'dTrangThai': 995
                },
                fakedb: []
            }, false, false, false, null);
        }

        function ImportData(obj_list) {
            edu.system.makeRequest({
                success: function (data) {
                    if (ip) {
                        me._stopImportProgress();
                        if (data.Success) {
                            ip.finish(data.Data);
                            $("#tblChuaImport").hide();
                            $("#tblImportLoi").hide();
                            if (sCallback != undefined && sCallback != "undefined" && sCallback != "") {
                                eval(sCallback);
                            }
                        }
                        else ip.fail("Import không thực hiện được: " + edu.util.returnEmpty(data.Message));
                        return;
                    }
                    me._finishImportProgress();
                    if (data.Success) {
                        data = data.Data;
                        var arrDataLoi = [];
                        $(".tableError").remove();
                        if (data.length > 0) {
                            var iThanhCong = 0, iThatBai = 0;
                            var rowErr = '';
                            rowErr += '<table class="table table-hover table-bordered tableError">';
                            rowErr += '<tbody>';
                            rowErr += '<tr><td>Dữ liệu</td><td>Lỗi</td></tr>';
                            for (var i = 0; i < data.length; i++) {
                                rowErr += '<tr>';
                                if (edu.util.checkValue(data[i].VALUE)) {
                                    iThatBai++;
                                    rowErr += '<td>' + edu.util.returnEmpty(data[i].KEY) + '</td>';
                                    rowErr += '<td>' + edu.util.returnEmpty(data[i].VALUE) + '</td>';
                                    try {
                                        var iErr = -1;
                                        if (data[i].KEY.indexOf(":") != -1) {
                                            iErr = parseInt(data[i].KEY.split(':')[0]);
                                        }
                                        if (iErr > 0) {
                                            var tempIP = edu.system.dtImport[$("#dropSearch_BangA").val()][iErr - 1];
                                            tempIP["Lỗi"] = data[i].VALUE;
                                            arrDataLoi.push(tempIP);
                                        }
                                    } catch (e) { }
                                } else {
                                    iThanhCong++;
                                }
                                rowErr += '</tr>';
                            }
                            rowErr += '</tbody>';
                            rowErr += '<thead><tr><td colspan="2">Thành công <span class="italic color-active">' + iThanhCong + '</span>; Thất bại: <span class="italic color-warning">' + iThatBai + '</span></td></tr></thead>';
                            rowErr += '</table>';
                            edu.system.alert(rowErr);
                        }
                        $("#tblChuaImport").hide();
                        $("#tblImportLoi").show();
                        edu.system.genTable_Import_View(arrDataLoi, "tblBangB");
                        if (sCallback != undefined && sCallback != "undefined" && sCallback != "") {
                            eval(sCallback);
                        }
                    }
                    else {
                        edu.system.alert(edu.util.returnEmpty(data.Message), "w");
                    }
                },
                error: function (er) {
                    me._stopImportProgress();
                    if (ip) {
                        var strMsg = "Import thất bại: không gọi được máy chủ.";
                        if (er && er.status) strMsg = "Import thất bại: lỗi " + er.status + (er.statusText ? " - " + er.statusText : "") + ".";
                        ip.fail(strMsg);
                    }
                    else edu.system.alert(JSON.stringify(er), "w");
                },
                type: 'POST',
                action: obj_list.action,
                contentType: true,
                data: obj_list,
                fakedb: []
            }, false, false, false, null);
        }
    },

    // Timer bơm % lên dần từ 0 → 90 theo đường cong chậm dần.
    // Đồng thời ẩn overlay chung "Đang tải dữ liệu…" (do makeRequest tự bật)
    // để tránh chồng 2 loader — chỉ hiển thị thanh tiến trình cho gọn.
    _startImportProgress: function () {
        var me = this;
        me._importProgressPct = 0;
        me._importProgressStart = new Date().getTime();
        $("#zoneImportProgress_THD").show();
        $("#btnThucHienImport").addClass("disabled").css("pointer-events", "none");
        $("#barImportProgress_THD").css("width", "0%").text("0%").attr("aria-valuenow", 0);
        $("#lblImportProgress_THD").html('<i class="fa fa-spinner fa-spin"></i> Đang xử lý import…');
        $("#lblImportTime_THD").text("0s");
        $("#overlay").hide();
        if (me._importProgressTimer) clearInterval(me._importProgressTimer);
        me._importProgressTimer = setInterval(function () {
            var cur = me._importProgressPct;
            var next = cur + Math.max(0.4, (90 - cur) * 0.06);
            if (next > 90) next = 90;
            me._importProgressPct = next;
            var rounded = Math.round(next);
            $("#barImportProgress_THD").css("width", next + "%").text(rounded + "%").attr("aria-valuenow", rounded);
            var elapsed = Math.floor((new Date().getTime() - me._importProgressStart) / 1000);
            $("#lblImportTime_THD").text(elapsed + "s");
            $("#overlay").hide();
        }, 800);
    },

    // Response về (success) — nhảy lên 100% rồi ẩn thanh
    _finishImportProgress: function () {
        var me = this;
        if (me._importProgressTimer) {
            clearInterval(me._importProgressTimer);
            me._importProgressTimer = null;
        }
        $("#barImportProgress_THD").css("width", "100%").text("100%").attr("aria-valuenow", 100);
        $("#lblImportProgress_THD").html('<i class="fa fa-check-circle" style="color:#00a65a"></i> Hoàn tất');
        setTimeout(function () {
            $("#zoneImportProgress_THD").fadeOut(400);
            $("#btnThucHienImport").removeClass("disabled").css("pointer-events", "");
        }, 700);
    },

    // Response về (error) hoặc modal đóng — dọn timer, phục hồi nút
    _stopImportProgress: function () {
        var me = this;
        if (me._importProgressTimer) {
            clearInterval(me._importProgressTimer);
            me._importProgressTimer = null;
        }
        $("#zoneImportProgress_THD").hide();
        $("#btnThucHienImport").removeClass("disabled").css("pointer-events", "");
    },
}