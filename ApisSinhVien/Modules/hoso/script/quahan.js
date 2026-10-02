/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function QuaHan() { };
QuaHan.prototype = {
    dtQuaHan: [],
    strQuaHan_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    dt_HS: [],
    strId: '',
    strSinhVien_Id: '',
    dtQuanHe: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("TD.PHANLOAI", "", "", data => {
            me["dtPhanLoai"] = data;
            let row = '';
            data.forEach(aData => row += '<th class="td-center">' + aData.TEN + '</th>');
            $("#tblQuaHan thead tr:eq(1)").append(row);
            document.getElementById("lblHocTapCaNhan").colSpan = data.length;

        });
        
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_QuaHan();
        $("#btnSearch").click(function (e) {
            me.getList_QuaHan();
        });
        $("#txtSearch_QLTB").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuaHan();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("[id$=chkSelectAll_QuaHan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuaHan" });
        });
        $("#btnDeleteQuaHan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuaHan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessQuaHan"></div>');
                edu.system.genHTML_Progress("zoneprocessQuaHan", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var objD = edu.util.objGetOneDataInData(arrChecked_Id[i], me.dtQuaHan, "ID");
                    if (objD.length != 0)
                        me.delete_HSSV(objD.QLSV_NGUOIHOC_ID);
                    else edu.system.alert("Không tìm được sinh viên");
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        $('#dropSearch_HeDaoTao_QLTB').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_QLTB').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_QLTB').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_QLTB').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });

        $("#zonebatdau").delegate(".ckbDSTrangThaiSV_QLTB_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_QLTB").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_QLTB", function (addKeyValue) {
            var arrNguoiHoc_ThanhPhan_Ids = edu.util.getArrCheckedIds("tblQuaHan", "checkX");
            var obj_save = {
                'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiHoc_ThanhPhan_Ids_01': arrNguoiHoc_ThanhPhan_Ids.slice(0, 120).toString(),
                'strNguoiHoc_ThanhPhan_01': "",
                'strNguoiHoc_ThanhPhan_Ids_02': arrNguoiHoc_ThanhPhan_Ids.slice(120, 240).toString(),
                'strNguoiHoc_ThanhPhan_02': "",
                'strNguoiHoc_ThanhPhan_Ids_03': arrNguoiHoc_ThanhPhan_Ids.slice(240, 360).toString(),
                'strNguoiHoc_ThanhPhan_03': "",
                'strNguoiHoc_ThanhPhan_Ids_04': arrNguoiHoc_ThanhPhan_Ids.slice(360, 480).toString(),
                'strNguoiHoc_ThanhPhan_04': "",
                'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
                'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
                'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
                'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
                'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
                'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
                'strNguoiDangNhap_Id': edu.system.userId,
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
            };

            for (var x in obj_save) {
                addKeyValue(x, obj_save[x]);
            }
        });
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strQuaHan_Id = "";
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_QuaHan();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QLTB"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QLTB"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QLTB"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QLTB"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_QLTB"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
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
            renderPlace: ["dropSearch_HeDaoTao_QLTB"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_QLTB").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao_QLTB"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_QLTB").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh_QLTB"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_QLTB").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Lop_QLTB"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_QLTB").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.QuaHan;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao_QLTB"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao_QLTB").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianDaoTao_QLTB"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.QuaHan.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_QLTB_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_QLTB" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_QLTB").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_QLTB"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QLTB").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaQuanLy_QLTB"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QLTB").val("").trigger("change");
    },

    getList_QuaHan: function (strDanhSach_Id) {
        var me = this;

        var obj_save = {
            'action': 'SV_TD_ThongTin_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
            'func': 'pkg_td_thongtin.LayDanhSachHoSoNhieuNganh',
            'iM': edu.system.iM,

            'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
            //'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
            'strNguoiDangNhap_Id': edu.system.userId,
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtQuaHan = dtReRult;
                    me.genTable_QuaHan(dtReRult, data.Pager);
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
    genTable_QuaHan: function (data, iPager) {
        var me = this;
        $("#lblQuaHan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuaHan",
            bPaginate: {
                strFuntionName: "main_doc.QuaHan.getList_QuaHan()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN",
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }, 
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                }, 
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "SOQDNHAPTRUONG"
                },
                {
                    "mDataProp": "NGAYQDNHAPTRUONG"
                }
            ]
        };
        me["dtDoiTuong_View"] = me.dtPhanLoai;
        me.dtDoiTuong_View.forEach(aData => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span id="lblSV_' + aData.ID + '_' + main_doc.QuaHan.dtDoiTuong_View[iThuTu].ID + '"></span>';
                }
            })
        })
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
            }
        })
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => me.dtDoiTuong_View.forEach(ele => me.getList_KetQua(e, ele.ID)));
    },
    getList_KetQua: function (aDataSV, strPhanLoai_Id) {
        var me = this;

        var obj_save = {
            'action': 'SV_TD_TinhToan_MH/DSA4ChAVKCQvBS4VKSQuESkgLw0uICgP',
            'func': 'pkg_td_tinhtoan.LayKQTienDoTheoPhanLoai',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': aDataSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aDataSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strPhanLoai_Id': strPhanLoai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(aData => {
                        $("#lblSV_" + aDataSV.ID + "_" + strPhanLoai_Id).html(edu.util.returnEmpty(aData.KETQUA))
                    })
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
}