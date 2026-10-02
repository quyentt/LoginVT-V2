/*----------------------------------------------
--Author:
--Date of created: 2026-05-29
--Discription: Thống kê tình trạng tổ chức thi
    Origin: PKG_DIEM_THONGKE.ThongKe_HocPhan_TinhTrangDST
    Filter:
        + 1: Có DS học – Chưa có DS thi
        + 2: Có DS thi – Sót sinh viên
----------------------------------------------*/
function ThongKeTinhTrang() { };
ThongKeTinhTrang.prototype = {
    dtThongKe: [],

    init: function () {
        var me = this;
        me.getList_ThoiGianDaoTao();
        me.getList_HeDaoTao();

        $("#btnThucHienLoc").click(function () {
            me.thongKe_TinhTrangDST();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.thongKe_TinhTrangDST();
            }
        });

        $('#dropSearch_ThoiGianDaoTao').on('select2:select select2:unselect', function () {
            me.getList_HeDaoTao();
        });

        $("#chkSelectAll_ThongKe").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThongKe" });
        });

        $('input[name="rdLoaiLoc"]').on('change', function () {
            $('.tk-loaiLoc-card .radio-opt').removeClass('is-active');
            $(this).closest('.radio-opt').addClass('is-active');
        });
    },

    /*------------------------------------------
    --Discription: Combo Thời gian đào tạo (dùng giống duyetdulieuthi.js)
    -------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: Combo Hệ đào tạo
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        };
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    cbGenCombo_HeDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: Thống kê — gọi PKG_DIEM_THONGKE.ThongKe_HocPhan_TinhTrangDST
    -------------------------------------------*/
    thongKe_TinhTrangDST: function () {
        var me = this;
        var strThoiGian = edu.util.getValById('dropSearch_ThoiGianDaoTao');
        if (!edu.util.checkValue(strThoiGian)) {
            edu.system.alert("Vui lòng chọn học kỳ!", "w");
            return;
        }
        var strHanhDong = $('input[name="rdLoaiLoc"]:checked').val() || '0';

        var obj_save = {
            'action': 'D_ThongKe_MH/FSkuLyYKJB4JLiIRKSAvHhUoLykVMyAvJgUSFQPP',
            'func': 'PKG_DIEM_THONGKE.ThongKe_HocPhan_TinhTrangDST',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': strThoiGian,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguoiThuVai_Id': edu.system.nguoiThuVai_Id || edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strHanhDong': strHanhDong,
        };

        edu.system.beginLoading && edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                edu.system.endLoading && edu.system.endLoading();
                if (data.Success) {
                    me.dtThongKe = data.Data || [];
                    me.genTable_ThongKe(me.dtThongKe);
                    $("#lblThongKe_Tong").text(me.dtThongKe.length);
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.endLoading && edu.system.endLoading();
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    genTable_ThongKe: function (data) {
        var jsonForm = {
            strTable_Id: "tblThongKe",
            aaData: data,
            colPos: {
                center: [0, 3, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                { "mDataProp": "MA_HOCPHAN" },
                { "mDataProp": "TEN_HOCPHAN" },
                { "mDataProp": "CHUONGTRINH_MO" },
                { "mDataProp": "SO_TINCHI" },
                { "mDataProp": "KHOA_QUANLY" },
                { "mDataProp": "TONG_DA_DANGKY" },
                { "mDataProp": "TONG_DA_RUT" },
                { "mDataProp": "TONG_TRONG_DST" },
                { "mDataProp": "TONG_CHUA_DU_DIEUKIEN" },
                { "mDataProp": "TONG_CHUA_TEN_KHONG_RUT" },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + (aData.ID || aData.MA_HOCPHAN) + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
};
