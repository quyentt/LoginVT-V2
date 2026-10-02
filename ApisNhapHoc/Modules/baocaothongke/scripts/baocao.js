/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 13/07/2018
--API URL: NH_DinhMuc_Chung
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function BaoCao() { };
BaoCao.prototype = {
    dtKeHoachNhapHoc: [],
    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [1] Action ==> KeHoachNhapHoc
        -------------------------------------------*/
        $('#dropKeHoachNhapHoc_BC').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            if (edu.util.checkValue(selectedValue)) {
                me.getList_ChuongTrinhDaoTao(selectedValue);
            }
        });
        /*------------------------------------------
        --Discription: [2] Action ==> ChuongTrinhDaoTao
        -------------------------------------------*/
        $('#dropChuongTrinhDaoTao_BC').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            if (edu.util.checkValue(selectedValue)) {
                me.getList_LopQuanLy(selectedValue);
            }
        });
        /*------------------------------------------
        --Discription: [3] Action ==> XuatDuLieu
        -------------------------------------------*/
        $("#zoneBaoCaoTaiChinh").delegate('.btnExport', 'click', function (e) {
            var strId = this.id;
            edu.system.report(strId, "", function (addKeyValue) {
                var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_BC"));
                if (edu.util.checkValue(strKeHoach_Id)) {
                    strKeHoach_Id = strKeHoach_Id;
                }
                else {
                    strKeHoach_Id = edu.system.userId;
                }
                addKeyValue("strKeHoach_Id", strKeHoach_Id);
                addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_BC"));
                addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_BC"));
                addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_BC"));
                addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_BC"));
                addKeyValue("strTuKhoa", "");
                addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_BC"));
                addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_BC"));
            });
        });
        me.getList_MauImport("zoneBaoCaoTaiChinh");
        //$("#btnExportM1_BC").click(function () {
        //    edu.system.report("M1", "", function (addKeyValue) {
        //        var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_BC"));
        //        if (edu.util.checkValue(strKeHoach_Id)) {
        //            strKeHoach_Id = strKeHoach_Id;
        //        }
        //        else {
        //            strKeHoach_Id = edu.system.userId;
        //        }
        //        addKeyValue("strKeHoach_Id", strKeHoach_Id);
        //        addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_BC"));
        //        addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_BC"));
        //        addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_BC"));
        //        addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_BC"));
        //        addKeyValue("strTuKhoa", "");
        //        addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_BC"));
        //        addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_BC"));
        //    });
        //});
        //$("#btnExportM2_BC").click(function () {
        //    edu.system.report("M2", "", function (addKeyValue) {
        //        var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_BC"));
        //        if (edu.util.checkValue(strKeHoach_Id)) {
        //            strKeHoach_Id = strKeHoach_Id;
        //        }
        //        else {
        //            strKeHoach_Id = edu.system.userId;
        //        }
        //        addKeyValue("strKeHoach_Id", strKeHoach_Id);
        //        addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_BC"));
        //        addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_BC"));
        //        addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_BC"));
        //        addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_BC"));
        //        addKeyValue("strTuKhoa", "");
        //        addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_BC"));
        //        addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_BC"));
        //    });
        //});
        //$("#btnExportM3_BC").click(function () {
        //    edu.system.report("M3", "", function (addKeyValue) {
        //        var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_BC"));
        //        if (edu.util.checkValue(strKeHoach_Id)) {
        //            strKeHoach_Id = strKeHoach_Id;
        //        }
        //        else {
        //            strKeHoach_Id = edu.system.userId;
        //        }
        //        addKeyValue("strKeHoach_Id", strKeHoach_Id);
        //        addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_BC"));
        //        addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_BC"));
        //        addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_BC"));
        //        addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_BC"));
        //        addKeyValue("strTuKhoa", "");
        //        addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_BC"));
        //        addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_BC"));
        //    });
        //});
        //$("#btnExportM4_BC").click(function () {
        //    edu.system.report("M4", "", function (addKeyValue) {
        //        var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_BC"));
        //        if (edu.util.checkValue(strKeHoach_Id)) {
        //            strKeHoach_Id = strKeHoach_Id;
        //        }
        //        else {
        //            strKeHoach_Id = edu.system.userId;
        //        }
        //        addKeyValue("strKeHoach_Id", strKeHoach_Id);
        //        addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_BC"));
        //        addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_BC"));
        //        addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_BC"));
        //        addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_BC"));
        //        addKeyValue("strTuKhoa", "");
        //        addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_BC"));
        //        addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_BC"));
        //    });
        //});
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:  
    -------------------------------------------*/
    page_load: function () {
        var me = this;

        edu.system.beginLoading();
        me.getList_LoaiKhoanThu();
        me.getList_CoSoDaoTao();
        return new Promise(function (resolve, reject) {
            //obj, resolve, reject, callback
            var obj = {
                strNguoiDung_Id: edu.system.userId
            };
            me.getList_KeHoachNhapHoc_NhanSu(obj, resolve, reject, "");
        }).then(function (data) {
            me.dtKeHoachNhapHoc = data;
            me.cbGenCombo_KeHoachNhapHoc(data);
            var strKeHoachNhapHoc_Id = edu.util.getValById("dropKeHoachNhapHoc_BC");
            if (edu.util.checkValue(strKeHoachNhapHoc_Id)) {
                me.getList_ChuongTrinhDaoTao(strKeHoachNhapHoc_Id);
            }
            else {
                edu.system.endLoading();
            }
        });
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KeHoachNhapHoc/ChuongTrinhDaoTao/LopQuanLy/LoaiKhoanThu/CoSoDaoTao
    --Author:
    -------------------------------------------*/
    getList_ChuongTrinhDaoTao: function (strKeHoachNhapHoc_Id) {
        var me = this;
        var stsKhoaDaoTao_Id = "";
        edu.system.beginLoading();

        for (var i = 0; i < me.dtKeHoachNhapHoc.length; i++) {
            if (me.dtKeHoachNhapHoc[i].ID == strKeHoachNhapHoc_Id) {
                stsKhoaDaoTao_Id = me.dtKeHoachNhapHoc[i].DAOTAO_KHOADAOTAO_ID;
            }
        }
        var objCTDT = {
            strKhoaDaoTao_Id: stsKhoaDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        }
        edu.system.getList_ChuongTrinhDaoTao(objCTDT, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
        edu.system.endLoading();
    },
    getList_LopQuanLy: function (strChuongTrinhDaoTao_Id) {
        var me = this;
                edu.system.beginLoading();
        var objLQL = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: "",
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strChuongTrinhDaoTao_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        }
        edu.system.getList_LopQuanLy(objLQL, "", "", me.cbGenCombo_LopQuanLy);
        edu.system.endLoading();
    },
    getList_LoaiKhoanThu: function () {
        var me = this;
        var strTuKhoa = "";
        var strNhomCacKhoanThu_Id = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strNguoiTao_Id = "";
        var strCanBoQuanLy_Id = "";
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': strTuKhoa,
            'strNhomCacKhoanThu_Id': strNhomCacKhoanThu_Id,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'strNguoiTao_Id': strNguoiTao_Id,
            'strCanBoQuanLy_Id': strCanBoQuanLy_Id
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.genCombo_LoaiKhoan(data.Data);
                    }
                    else {
                        me.genCombo_LoaiKhoan([]);
                    }
                }
                else {
                    edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_CoSoDaoTao: function () {
        var me = this;

        var obj_CSDT = {
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        }
        edu.system.getList_CoSoDaoTao(obj_CSDT, "", "", me.cbGenCombo_CoSoDaoTao);
    },
    /*------------------------------------------
	--Discription: [1] ACTION HTML ==> KeHoachNhapHoc
	--Author:  
	-------------------------------------------*/
    cbGenCombo_KeHoachNhapHoc: function (data, iPager) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhapHoc_BC"],
            type: "",
            title: "Tất cả",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data, iPager) {
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
            renderPlace: ["dropChuongTrinhDaoTao_BC"],
            type: "",
            title: "Tất cả",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy: function (data, iPager) {
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
            renderPlace: ["dropLopQuanLy_BC"],
            type: "",
            title: "Tất cả",
        }
        edu.system.loadToCombo_data(obj);
    },
    genCombo_LoaiKhoan: function (data) {
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
            renderPlace: ["dropLoaiKhoanThu_BC"],
            type: "",
            title: "Tất cả",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_CoSoDaoTao: function (data, iPager) {
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
            renderPlace: ["dropCoSoDaoTao_BC"],
            type: "",
            title: "Tất cả",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_MauImport: function (strZoneButton, callback) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_Import_PhanQuyen/LayDanhSach',


            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.cbGenCombo_MauImport(data.Data, strZoneButton);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    cbGenCombo_MauImport: function (data, strZoneButton) {
        var me = this;
        if (data.length > 0) {
            var html = '';
            data.forEach((e, nRow) => {
                html += '<li>';
                html += '<span class="handle ui-sortable-handle">';
                html += '<i class="fa fa-angle-right"></i>';
                html += '</span>';
                html += '<span class="text">Mẫu ' + (nRow + 1) + ': ' + edu.util.returnEmpty(e.MAUIMPORT_TENFILEMAU) + '</span>';
                html += '<a id="' + edu.util.returnEmpty(e.MAUIMPORT_MA) + '" class="btnExport" href="#"><small class="label label-primary"><i class="fa fa-cloud-download"></i> tải xuống</small></a>';
                html += '</li>';
            });

            $("#" + strZoneButton).html(html);
        }
    },
    // Copy từ ruttiennew.js — dùng PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (hàm mới BE mới cấp).
    // Trước đó gọi qua edu.extend.getList_KeHoachNhapHoc_NhanSu, nhưng Core/systemextend.js bản cũ
    // vẫn trỏ về pkg_nhaphoc_thongtin (API cũ) — trang này ép dùng bản mới không phụ thuộc load thứ tự.
    getList_KeHoachNhapHoc_NhanSu: function (obj, resolve, reject, callback) {
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': obj.strNguoiDung_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    if (typeof resolve === "function") resolve(arr);
                    if (typeof callback === "function") callback(arr, data.Pager);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },
}