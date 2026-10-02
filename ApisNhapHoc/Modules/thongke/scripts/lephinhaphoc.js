/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 14/08/2018
--API URL: NH_SinhVienNhapHoc
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function LePhiNhapHoc() { };
LePhiNhapHoc.prototype = {
    dtKeHoachNhapHoc: [],
    dtKhoanThu_KHoach: [],
    dtTongHop_Thu: [],
    dtSinhVien:[],

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
        $('#dropKeHoachNhapHoc_LPNH').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            if (edu.util.checkValue(selectedValue)) {
                me.getList_ChuongTrinhDaoTao(selectedValue);
            }
        });        
        /*------------------------------------------
        --Discription: [2] Action ==> ChuongTrinhDaoTao
        -------------------------------------------*/
        $('#dropChuongTrinhDaoTao_LPNH').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            console.log("selectedValue: " + selectedValue);
            if (edu.util.checkValue(selectedValue)) {
                me.getList_LopQuanLy(selectedValue);
            }
        });
        /*------------------------------------------
        --Discription: [3] Action ==> XuatDuLieu
        -------------------------------------------*/
        $("#btnExportM1_LPNH").click(function () {
            var strLoaiMau = "M1";
            edu.system.report(strLoaiMau, "", function (addKeyValue) {
                var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_LPNH"));
                if (edu.util.checkValue(strKeHoach_Id)) {
                    strKeHoach_Id = strKeHoach_Id;
                }
                else {
                    strKeHoach_Id = edu.system.userId;
                }
                addKeyValue("strKeHoach_Id", strKeHoach_Id);
                addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_LPNH"));
                addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_LPNH"));
                addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_LPNH"));
                addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_LPNH"));
                addKeyValue("strTuKhoa", "");
                addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_LPNH"));
                addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_LPNH"));
            });
        });
        $("#btnExportM2_LPNH").click(function () {
            var strLoaiMau = "M2";
            edu.system.report(strLoaiMau, "", function (addKeyValue) {
                var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_LPNH"));
                if (edu.util.checkValue(strKeHoach_Id)) {
                    strKeHoach_Id = strKeHoach_Id;
                }
                else {
                    strKeHoach_Id = edu.system.userId;
                }
                addKeyValue("strKeHoach_Id", strKeHoach_Id);
                addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_LPNH"));
                addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_LPNH"));
                addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_LPNH"));
                addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_LPNH"));
                addKeyValue("strTuKhoa", "");
                addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_LPNH"));
                addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_LPNH"));
            });
        });
        $("#btnExportM3_LPNH").click(function () {
            var strLoaiMau = "M3";
            edu.system.report(strLoaiMau, "", function (addKeyValue) {
                var strKeHoach_Id = edu.util.returnEmpty(edu.util.getValCombo("dropKeHoachNhapHoc_LPNH"));
                if (edu.util.checkValue(strKeHoach_Id)) {
                    strKeHoach_Id = strKeHoach_Id;
                }
                else {
                    strKeHoach_Id = edu.system.userId;
                }
                addKeyValue("strKeHoach_Id", strKeHoach_Id);
                addKeyValue("strChuongTrinh_Id", edu.util.getValById("dropChuongTrinhDaoTao_LPNH"));
                addKeyValue("strLopHoc_Id", edu.util.getValById("dropLopQuanLy_LPNH"));
                addKeyValue("strLoaiKhoan_Id", edu.util.getValById("dropLoaiKhoanThu_LPNH"));
                addKeyValue("strCoSoDT", edu.util.getValById("dropCoSoDaoTao_LPNH"));
                addKeyValue("strTuKhoa", "");
                addKeyValue("strTuNgay", edu.util.getValById("txtTuNgay_Search_LPNH"));
                addKeyValue("strDenNgay", edu.util.getValById("txtDenNgay_Search_LPNH"));
            });
        });
        $("#btnSearch_LPNH").click(function () {
            if (edu.util.checkValue(edu.util.getValById("dropLopQuanLy_LPNH")) && edu.util.checkValue(edu.util.getValById("dropKeHoachNhapHoc_LPNH"))) {

                return new Promise(function (resolve, reject) {
                    var obj_SinhVien = {
                        strCoSoDaoTao_Id: "",
                        strKhoaDaoTao_Id: "",
                        strNganh_Id: "",
                        strLopQuanLy_Id: edu.util.getValById("dropLopQuanLy_LPNH"),
                        iTrangThai: 1,
                        strNguoiThucHien_Id: "",
                        strTuKhoa: "",
                        pageIndex: 1,
                        pageSize: 10000
                    }
                    edu.system.getList_SinhVien(obj_SinhVien, resolve, reject, "");
                }).then(function (data) {
                    me.dtSinhVien = data;
                    return new Promise(function (resolve, reject) {
                        me.getList_KhoanThuTheoKeHoach(resolve, reject);
                    }).then(function (data) {
                        me.dtKhoanThu_KHoach = data;
                        return new Promise(function (resolve, reject) {
                            me.getList_TongHopThuTheoKeHoach(resolve, reject);
                        }).then(function (data) {
                            me.dtTongHop_Thu = data;
                            me.genTable_TongHop();
                        });
                    });
                });
            }
            else {
                edu.system.alert("Vui lòng chọn Kế hoạch và Lớp quản lý trước khi thống kê!");
            }
        });
    },
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
            me.genCombo_KeHoachNhapHoc(data);
            me.dtKeHoachNhapHoc = data;
            var strKeHoachNhapHoc_Id = edu.util.getValById("dropKeHoachNhapHoc_LPNH");
            if (edu.util.checkValue(strKeHoachNhapHoc_Id)) {
                me.getList_ChuongTrinhDaoTao(strKeHoachNhapHoc_Id);
            }
            else {
                edu.system.endLoading();
            }
        });
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> ChuongTrinhDaoTao/LopQuanLy/LoaiKhoanThu/CoSoDaoTao
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
    --Discription: [2] ACCESS DB ==> ThongKe theo LePhiNhapHoc
    --Author:
    -------------------------------------------*/
    getList_KhoanThuTheoKeHoach: function(resovle, reject){
        //
        var me = this;
        var strNHAPHOC_KeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_LPNH");
        var obj_list = {
            'action': 'NH_ThongKe/LayDSTongHopThuTheoKeHoach',
            'type': 'GET',
            'strTaiChinh_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strtaichinh_cackhoanthu_ids': edu.util.getValById('txtAAAA'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strTuNgay': edu.util.getValById('txtAAAA'),
            'strDenNgay': edu.util.getValById('txtAAAA'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        resovle(data.Data);
                    }
                    else {
                        resovle([]);
                    }
                }
                else {
                    edu.system.alert("NH_ThongKe.LayDanhSach_CacKhoanNhapHocKeHoach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_ThongKe.LayDanhSach_CacKhoanNhapHocKeHoach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'NH_ThongKe/LayDanhSach_CacKhoanNhapHocKeHoach',
            versionAPI: 'v1.0',
            contentType: true,
            data: {
                "strNHAPHOC_KeHoach_Id": strNHAPHOC_KeHoach_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TongHopThuTheoKeHoach: function (resolve, reject) {
        var me = this;
        var obj_list = {
            'action': 'NH_ThongKe/LayDSTongHopThuTheoKeHoach',
            'versionAPI': 'v1.0',

            'strTaiChinh_KeHoach_Id': edu.util.getValById("dropKeHoachNhapHoc_LPNH"),
            'strTaichinh_Cackhoanthu_Ids': edu.util.getValById("dropLoaiKhoanThu_LPNH"),
            'strDaoTao_CoSoDaoTao_Id': "",
            'strDaoTao_ChuongTrinh_Id': "",
            'strDaoTao_LopQuanLy_Id': edu.util.getValById("dropLopQuanLy_LPNH"),
            'strTuNgay': edu.util.getValById("txtTuNgay_Search_LPNH"),
            'strDenNgay': edu.util.getValById("txtDenNgay_Search_LPNH"),
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        resolve(data.Data);
                    }
                    else {
                        resolve([]);
                    }
                }
                else {
                    edu.system.alert("NH_ThongKe.LayDanhSach_TongHopThuTheoKeHoach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_ThongKe.LayDanhSach_TongHopThuTheoKeHoach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] Gen HTML ==> KeHoachNhapHoc/ChuongTrinhDaoTao/LopQuanLy/LoaiKhoanThu/CoSoDaoTao
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
            renderPlace: ["dropKeHoachNhapHoc_LPNH"],
            type: "",
            title: "Chọn kế hoạch nhập học",
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
            renderPlace: ["dropChuongTrinhDaoTao_LPNH"],
            type: "",
            title: "Chọn chương trình đào tạo",
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
            renderPlace: ["dropLopQuanLy_LPNH"],
            type: "",
            title: "Chọn lớp quản lý",
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
            renderPlace: ["dropLoaiKhoanThu_LPNH"],
            type: "",
            title: "Chọn khoản thu",
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
            renderPlace: ["dropCoSoDaoTao_LPNH"],
            type: "",
            title: "Chọn cơ sở đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] Gen HTML ==> ThongKe theo LePhiNhapHoc
    --Author:
    -------------------------------------------*/
    genTable_TongHop: function () {
        var me = this;
        //init
        var $tbl_head = "#tbldata_LPNH thead";
        var $tbl_body = "#tbldata_LPNH tbody";
        var $tbl_foot = "#tbldata_LPNH tfoot";
        $($tbl_head).html("");
        $($tbl_body).html("");
        $($tbl_foot).html("");
        var thead = "";
        var tbody = "";
        var tfoot = "";
        //---------------------------thead-------------------------------------------
        thead += '<tr>';
        thead += '<th class="td-fixed td-center">Stt</th>';
        thead += '<th class="td-left"><span class="lang" key="">SBD</span></th>';
        thead += '<th class="td-left"><span class="lang" key="">Mã số</span></th>';
        thead += '<th class="td-left"><span class="lang" key="">Họ tên</span></th>';
        thead += '<th class="td-center"><span class="lang" key="">Ngày sinh</span></th>';
        thead += '<th class="td-center"><span class="lang" key="">Giới tính</span></th>';
        thead += '<th class="td-left"><span class="lang" key="">Lớp quản lý</span></th>';
        for (var kt = 0; kt < me.dtKhoanThu_KHoach.length; kt++) {
            thead += '<th class="td-right"><span class="lang" key="">' + me.dtKhoanThu_KHoach[kt].TEN + '</span></th>';
        }
        thead += '<th class="td-right"><span class="lang" key="">Tổng</span></th>';
        thead += '</tr>';
        $($tbl_head).html(thead);
        //---------------------------tbody-------------------------------------------
        var dTongThu = 0;
        var checkEmpty = false;
        for (var sv = 0; sv < me.dtSinhVien.length; sv++) {
            tbody += '<tr>';
            tbody += '<td class="td-center">' + (sv + 1) + '</td>';
            tbody += '<td>' + edu.util.returnEmpty(me.dtSinhVien[sv].SOBAODANH) + '</td>';
            tbody += '<td>' + edu.util.returnEmpty(me.dtSinhVien[sv].MASONGUOIHOC) + '</td>';
            tbody += '<td>' + me.dtSinhVien[sv].HODEM + " " + me.dtSinhVien[sv].TEN + '</td>';
            tbody += '<td>' + me.dtSinhVien[sv].NGAYSINH_NGAY + "/" + me.dtSinhVien[sv].NGAYSINH_THANG + "/" + me.dtSinhVien[sv].NGAYSINH_NAM + '</td>';
            tbody += '<td>' + edu.util.returnEmpty(me.dtSinhVien[sv].GIOITINH_TEN) + '</td>';
            tbody += '<td>' + edu.util.returnEmpty(me.dtSinhVien[sv].DAOTAO_LOPQUANLY_TEN) + '</td>';
            //bind matrix (sinhvien_id && khoanthu_Id  == (tonghopthu_sinhvien_id && tonghopthu_khoanthu_id))
            dTongThu = 0;
            for (var _kt = 0; _kt < me.dtKhoanThu_KHoach.length; _kt++) {
                checkEmpty = false;
                for (var tht = 0; tht < me.dtTongHop_Thu.length; tht++) {
                    //1. get TongTien SinhVien theo tung KhoanThu
                    if (me.dtTongHop_Thu[tht].TAICHINH_CACKHOANTHU_ID == me.dtKhoanThu_KHoach[_kt].ID &&
                        me.dtTongHop_Thu[tht].QLSV_NGUOIHOC_ID == me.dtSinhVien[sv].ID) {
                        tbody += '<td class="td-right">' + edu.util.formatCurrency(me.dtTongHop_Thu[tht].SOTIEN) + '</td>';
                        dTongThu += edu.util.returnZero(me.dtTongHop_Thu[tht].SOTIEN);
                        console.log(me.dtTongHop_Thu[tht].TAICHINH_CACKHOANTHU_TEN);
                        checkEmpty = true;
                    }
                }
                if (!checkEmpty) {
                    tbody += '<td class="td-right">0</td>';
                }
            }
            //end
            tbody += '<td class="td-right bold">' + edu.util.formatCurrency(dTongThu) + '</td>';
            tbody += '</tr>';
        }
        $($tbl_body).html(tbody);
        //---------------------------tfoot-------------------------------------------
        var TongKhoan = 0;
        var TongHop = 0;
        tfoot += '<tr>';
        tfoot += '<th colspan="7" class="td-center">Tổng</th>';
        for (var fkt = 0; fkt < me.dtKhoanThu_KHoach.length; fkt++) {
            TongKhoan = 0;
            for (var ftht = 0; ftht < me.dtTongHop_Thu.length; ftht++) {
                if (me.dtKhoanThu_KHoach[fkt].ID == me.dtTongHop_Thu[ftht].TAICHINH_CACKHOANTHU_ID) {
                    TongKhoan += edu.util.returnZero(me.dtTongHop_Thu[ftht].SOTIEN);
                }
            }
            TongHop += TongKhoan;
            tfoot += '<th class="td-right">' + edu.util.formatCurrency(TongKhoan) + '</th>';
        }
        tfoot += '<th class="td-right">' + edu.util.formatCurrency(TongHop) + '</th>';
        tfoot += '</tr>';
        $($tbl_foot).html(tfoot);
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