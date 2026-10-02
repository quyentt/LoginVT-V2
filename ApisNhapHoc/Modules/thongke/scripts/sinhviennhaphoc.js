/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 14/08/2018
--API URL: NH_SinhVienNhapHoc
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function SinhVienNhapHoc() { };
SinhVienNhapHoc.prototype = {
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
        $('#dropKeHoachNhapHoc_SVNH').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            if (edu.util.checkValue(selectedValue)) {
                me.getList_ChuongTrinhDaoTao(selectedValue);
            }
        });
        $('#dropChuongTrinhDaoTao_SVNH').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            console.log("selectedValue: " + selectedValue);
            if (edu.util.checkValue(selectedValue)) {
                me.getList_LopQuanLy(selectedValue);
            }
        });
        /*------------------------------------------
        --Discription: [4] Action ==> SinhVien
        -------------------------------------------*/
        $("#btnSearch_SVNH").click(function () {
            me.getList_SinhVien();
        });
        $("#btnRefresh_SVNH").click(function () {
            me.getList_SinhVien();
        });
        //Văn Hiệp đã sửa ở đây
        $("#btnExportTKNH_DHTL_2018_THEOLOP_SVNH").click(function () {
            var strLoaiMau = "TKNH_DHTL_2018_THEOLOP";
            edu.system.report(strLoaiMau, "", function (addKeyValue) {
                var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_SVNH"));
                if (edu.util.checkValue(strKeHoach_Id)) {
                    strKeHoach_Id = strKeHoach_Id;
                }
                else {
                    strKeHoach_Id = edu.system.userId;
                }
                addKeyValue("strKeHoach_Id", strKeHoach_Id);
                addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_SVNH"));
                addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_SVNH"));
                addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_SVNH"));
                addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_SVNH"));
                addKeyValue("strTuKhoa", "");
                addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_SVNH"));
                addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_SVNH"));
            });
        });
        $("#btnExportTKNH_DHTL_2018_THEONGANH_SVNH").click(function () {
            var strLoaiMau = "TKNH_DHTL_2018_THEONGANH";
            edu.system.report(strLoaiMau, "", function (addKeyValue) {
                var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_SVNH"));
                if (edu.util.checkValue(strKeHoach_Id)) {
                    strKeHoach_Id = strKeHoach_Id;
                }
                else {
                    strKeHoach_Id = edu.system.userId;
                }
                addKeyValue("strKeHoach_Id", strKeHoach_Id);
                addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_SVNH"));
                addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_SVNH"));
                addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_SVNH"));
                addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_SVNH"));
                addKeyValue("strTuKhoa", "");
                addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_SVNH"));
                addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_SVNH"));
            });
        });
        $("#btnExportTKNH_DHTL_2018_DSCHITIETTHEOLOP_SVNH").click(function () {
            var strLoaiMau = "TKNH_DHTL_2018_DSCHITIETTHEOLOP";
            edu.system.report(strLoaiMau, "", function (addKeyValue) {
                var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_SVNH"));
                if (edu.util.checkValue(strKeHoach_Id)) {
                    strKeHoach_Id = strKeHoach_Id;
                }
                else {
                    strKeHoach_Id = edu.system.userId;
                }
                addKeyValue("strKeHoach_Id", strKeHoach_Id);
                addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_SVNH"));
                addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_SVNH"));
                addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_SVNH"));
                addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_SVNH"));
                addKeyValue("strTuKhoa", "");
                addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_SVNH"));
                addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_SVNH"));
            });
        });
    },
    page_load: function () {
        var me = this;
        return new Promise(function (resolve, reject) {
            edu.system.beginLoading();
            //obj, resolve, reject, callback
            var obj = {
                strNguoiDung_Id: edu.system.userId
            };
            me.getList_KeHoachNhapHoc_NhanSu(obj, resolve, reject, "");

        }).then(function (data) {
            me.genCombo_KeHoachNhapHoc(data);
            me.dtKeHoachNhapHoc = data;
            var strKeHoachNhapHoc_Id = edu.util.getValById("dropKeHoachNhapHoc_SVNH");
            if (edu.util.checkValue(strKeHoachNhapHoc_Id)) {
                me.getList_ChuongTrinhDaoTao(strKeHoachNhapHoc_Id);
            }
            else {
                edu.system.endLoading();
            }
        });
    },
    /*------------------------------------------
    --Discription: [2] ACCESS DB ==> ChuongTrinhDaoTao
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
    /*------------------------------------------
    --Discription: [3] ACCESS DB ==> LopQuanLy
    --Author:
    -------------------------------------------*/
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
    /*------------------------------------------
    --Discription: [4] ACCESS DB ==> SinhVien
    --Author:
    -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'SV_HoSoHocVien/LayDanhSachHoSo',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('dropLopQuanLy_SVNH'),
            'strHeDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao_SVNH'),
            'strLopQuanLy_Id': edu.util.getValById('dropLopQuanLy_SVNH'),
            'strQLSV_TrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'dLocTheoDuLieuImport': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTuNgay': edu.util.getValById('txtTuNgay_Search_SVNH'),
            'strDenNgay': edu.util.getValById('txtDenNgay_Search_SVNH'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_SinhVien(dtReRult, data.Pager);
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
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] Gen HTML ==> KeHoachNhapHoc
    --Author:
    -------------------------------------------*/
    genCombo_KeHoachNhapHoc: function (data, iPager) {
        var me = this;
        me.dtKeHoachNhapHoc = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhapHoc_SVNH"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] Gen HTML ==> ChuongTrinhDaoTao
    --Author:
    -------------------------------------------*/
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
            renderPlace: ["dropChuongTrinhDaoTao_SVNH"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] Gen HTML ==> LopQuanLy
    --Author:
    -------------------------------------------*/
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
            renderPlace: ["dropLopQuanLy_SVNH"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4] Gen HTML ==> SinhVien
    --Author:
    -------------------------------------------*/
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_SVNH",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.SinhVienNhapHoc.getList_SinhVien()",
                iDataRow: iPager
            },
            "sort": true,
            colPos: {
                left: [2],
                fix: [0],
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "SOBAODANH"
                }
                , {
                    "mDataProp": "MASONGUOIHOC"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strHoDem = edu.util.returnEmpty(aData.HODEM);
                        var strTen = edu.util.returnEmpty(aData.TEN);
                        var strHoTen = strHoDem + " " + strTen;
                        return strHoTen;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNgaySinh_Ngay = edu.util.returnEmpty(aData.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(aData.NGAYSINH_THANG)
                            + "/" + edu.util.returnEmpty(aData.NGAYSINH_NAM);
                        return strNgaySinh_Ngay;
                    }
                }
                , {
                    "mDataProp": "GIOITINH_TEN"
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.endLoading();
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