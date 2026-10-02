/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function DaCoHopDong() { };
DaCoHopDong.prototype = {
    arrValid_HopDong: [],
    dtKhoanThu: [],
    dtHinhThuc: [],
    dtMienGiam: [],
    dtDoiTuongDangKy: [],
    strDoiTuongDangKy_id: "",
    strDoiTuong_PhongDK_id: "",
    strTaiChinh_CacKhoanThu_Id: '',
    strHopDong_Id: '',
    strTinhTrangHopDong: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
       --Discription: [1] Action HopDong
       --Order: 
       -------------------------------------------*/
        $("#btnDangKy_Save").click(function () {
            me.save_HopDong();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
       --Discription: [2] Action DoiTuongDangKy
       --Order: 
       -------------------------------------------*/
        $("#tblDangKy_DoiTuong").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //strId = edu.util.cutPrefixId(/view_/g, strId);

            edu.util.setOne_BgRow(strId, "tblDangKy_DoiTuong");
            me.getDetail_HopDong(strId);
            setTimeout(function () {
                $("#zoneHopDong").slideDown();
            }, 100);
            //edu.util.objGetDataInData(strId, me.dtDoiTuongDangKy, "KTX_DOITUONGOKYTUCXA_ID", me.viewDetail_DangKyPhong);
        });

        $("#txtSearch_DangKy_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DangKyPhong();
            }
        });
        $(".btnSearchDangKy_NhanSu").click(function () {
            me.getList_DangKyPhong();
        });
        $("#btnDelete_HopDong").click(function () {
            edu.system.confirm("Bạn có chắc chắn hủy hợp đồng không?");
            $("#btnYes").click(function (e) {
               me.delete_HopDong();
            });
        });
        /*------------------------------------------
        --Discription: [2] Action Report
        --Order:
        -------------------------------------------*/
        $(".btnHopDong_BaoCao").click(function () {
            if (me.strHopDong_Id == "") {
                console.log(1222);
                return;
            }
            var dTongTien = edu.util.getValById("txtHopDong_TongTien").replace(/,/g, '');
            var strTongTienThue = to_vietnamese(dTongTien) + ".";
            strTongTienThue = strTongTienThue[1].toUpperCase() + strTongTienThue.substring(2);
            var strReportCode = this.name;
            var strHopDong_Id = me.strHopDong_Id;
            edu.system.report(strReportCode, "", function (addKeyValue) {
                addKeyValue("strHopDong_Id", strHopDong_Id);
                addKeyValue("strSoTienBangChu", strTongTienThue);
            });
        });
        $("#zoneHopDong").delegate(".inputtongtienthue", "keyup", function (e) {
            var strTongTienThue = $(this).val().replace(/,/g, '');
            if (strTongTienThue[0] == '0') strTongTienThue = strTongTienThue.substring(1);
            $(this).val(edu.util.formatCurrency(strTongTienThue));
        });
        // Tính tiền
        $("#btnDangKy_TinhTien").click(function () {
            var dSoThang = edu.util.getValById("txtHopDong_SoThang");
            me.save_HopDong_TinhTien(dSoThang);
        });
        $("#txtHopDong_NgayKy").blur(function () {
            edu.util.viewValById("txtHopDong_NgayVao", edu.util.getValById("txtHopDong_NgayKy"));
        })
        $("#txtHopDong_NgayKetThuc").blur(function () {
            edu.util.viewValById("txtHopDong_NgayRa", edu.util.getValById("txtHopDong_NgayKetThuc"));
        })
        $("#dropSearch_ToaNha").on("select2:select", function () {
            me.getList_Phong();
        });
        $("#dropSearch_Phong,#dropSearch_TinhTrang").on("select2:select", function () {
            me.getList_DangKyPhong();
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnThemDongChinhSach").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ChinhSach(id, "");
        });
        $("#tblHopDong_ChinhSach").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblHopDong_ChinhSach tr[id='" + strRowId + "']").remove();
        });
        $("#tblHopDong_ChinhSach").delegate(".delete", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ChinhSach(strId);
            });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnThemDongMienGiam").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_MienGiam(id, "");
        });
        $("#tblHopDong_MienGiam").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblHopDong_MienGiam tr[id='" + strRowId + "']").remove();
        });
        $("#tblHopDong_MienGiam").delegate(".delete", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_MienGiam(strId);
            });
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TTHD", "", "", me.loadHopDong);
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrValid_DapAn = [
            { "MA": "txtHopDong_So", "THONGTIN1": "EM" }
            //{ "MA": "dropHopDong_TinhTrang", "THONGTIN1": "EM" }
        ];
        me.getList_Phong();
        me.getList_ToaNha();
        var obj = {
            strMaBangDanhMuc: constant.setting.CATOR.KTX.DVT0,
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.getList_HinhThuc);
        me.getList_KhoanThu();
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TTHD", "dropSearch_TinhTrang");
        //load
        setTimeout(function () {
            me.getList_DangKyPhong();
        }, 500);
    },
    loadHopDong: function (data) {
        var me = main_doc.DaCoHopDong;
        for (var i = 0; i < data.length; i++) {
            if (data[i].MA == "1") {
                me.strTinhTrangHopDong_Id = data[i].ID;
                break;
            }
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HopDong
    --ULR: Modules
    -------------------------------------------*/
    save_HopDong: function () {
        var me = this;
        //get value to save
        //var strKhoanThu = "";
        //var arrKhoanThu = [];
        //var arrMienGiam = [];

        //var arrCS_SoLuong = [];
        //var arrCS_HinhThuc = [];
        //var strCS_SoLuong = "";
        //var strCS_HinhThuc = "";

        //var arrMG_PhanTram = [];
        //var arrMG_HinhThuc = [];
        //var strMG_PhanTram = "";
        //var strMG_HinhThuc = "";

        //for (var i = 0; i < me.dtKhoanThu.length; i++) {
        //    strKhoanThu = me.dtKhoanThu[i].ID;
        //    strCS_SoLuong = $("#txtCS_SoLuong" + strKhoanThu).val();
        //    strCS_HinhThuc = $("#dropCS_HinhThuc" + strKhoanThu).val();
        //    //Nếu đã tồn tại name là id của chính sách thì chuyển sang hàm sửa
        //    var strChinhSach_Id = $("#txtCS_SoLuong" + strKhoanThu).attr("name");
        //    if (strChinhSach_Id == undefined || strChinhSach_Id.length != 32) {
        //        arrKhoanThu.push(strKhoanThu);
        //        arrCS_SoLuong.push(strCS_SoLuong);
        //        arrCS_HinhThuc.push(strCS_HinhThuc);
        //        continue;
        //    }
        //    else {
        //        me.update_ChinhSach(strChinhSach_Id, strCS_SoLuong, strKhoanThu, strCS_HinhThuc);
        //    }
        //}
        //for (var i = 0; i < me.dtMienGiam.length; i++) {
        //    strKhoanThu = me.dtMienGiam[i].ID;
        //    strMG_PhanTram = $("#txtMG_PhanTram" + strKhoanThu).val();
        //    strMG_HinhThuc = $("#dropMG_HinhThuc" + strKhoanThu).val();
        //    //Nếu đã tồn tại name là id của miễn giảm thì chuyển sang hàm sửa
        //    var strMienGiam_Id = $("#txtMG_PhanTram" + strKhoanThu).attr("name");
        //    if (strMienGiam_Id == undefined ||strMienGiam_Id.length != 32) {
        //        arrMienGiam.push(strKhoanThu);
        //        arrMG_PhanTram.push(strMG_PhanTram);
        //        arrMG_HinhThuc.push(strMG_HinhThuc);
        //    } else {
        //        me.update_MienGiam(strMienGiam_Id, strMG_PhanTram, strKhoanThu, strMG_HinhThuc);
        //    }
        //}
        //--Edit
        var obj_save = {
            'action': 'KTX_HopDong/CapNhat',
            

            'strId': me.strHopDong_Id,
            'strSoHopDong': edu.util.getValById("txtHopDong_So"),
            'strNgayKyHopDong': edu.util.getValById("txtHopDong_NgayKy"),
            'strNgayKetThucHopDong': edu.util.getValById("txtHopDong_NgayKetThuc"),
            'strTinhTrang_Id': me.strTinhTrangHopDong_Id,
            'strKTX_Phong_Id': edu.util.getValById("dropHopDong_Phong"),
            'strKTX_ToaNha_Id': me.strDoiTuong_ToaNhaDK_id,
            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strNgayVao': edu.util.getValById("txtHopDong_NgayVao"),
            'strNgayRa': edu.util.getValById("txtHopDong_NgayRa"),
            'dSoThang': edu.util.getValById("txtHopDong_SoThang"),
            'dTongTienThue': edu.util.getValById("txtHopDong_TongTien").replace(/,/g, ""),
            'dGiaThue_Thang': edu.util.getValById("txtHopDong_SoTien_Thang").replace(/,/g, ""),
            'dSoChoThue': edu.util.getValById("txtHopDong_SoChoThue"),
            'dBaoPhong': edu.util.getValById("dropHopDong_BaoPhong"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            //'strTaiChinh_CacKhoanThu_Id': me.strTaiChinh_CacKhoanThu_Id,
            //'strHopDong_MG_PhanTrams': arrMG_PhanTram.toString().replace(/,/g, "#"),
            //'strHopDong_MG_KhoanThu_Ids': arrMienGiam.toString().replace(/,/g, "#"),
            //'strHopDong_MG_HinhThuc_Ids': arrMG_HinhThuc.toString().replace(/,/g, "#"),
            //'strHopDong_CS_SoLuongs': arrCS_SoLuong.toString().replace(/,/g, "#"),
            //'strHopDong_CS_KhoanThu_Ids': arrKhoanThu.toString().replace(/,/g, "#"),
            //'strHopDong_CS_HinhThuc_Ids': arrCS_HinhThuc.toString().replace(/,/g, "#"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_DangKyPhong();
                    $("#tblHopDong_MienGiam tbody tr").each(function () {
                        var strMienGiamId = this.id.replace(/rm_row/g, '');
                        me.update_MienGiam(strMienGiamId);
                    });
                    $("#tblHopDong_ChinhSach tbody tr").each(function () {
                        var strChinhSachId = this.id.replace(/rm_row/g, '');
                        me.update_ChinhSach(strChinhSachId);
                    });
                }
                else {
                    edu.system.alert("KTX_HopDong/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_HopDong/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HopDong: function (strId) {
        var me = main_doc.DaCoHopDong;

        //view data --Edit
        var obj_detail = {
            'action': 'KTX_HopDong/LayChiTiet',
            
            'strId': strId
        }
        if (strId.length != 32) return;
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.viewDetail_HopDong(json[0]);
                    } else {
                        console.log("Lỗi ");
                    }
                    
                } else {
                    console.log("Thông báo: có lỗi xảy ra!");
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },

    viewDetail_HopDong: function (data) {
        var me = main_doc.DaCoHopDong;
        me.strHopDong_Id = data.ID;
        me.strDoiTuong_PhongDK_id = data.KTX_PHONG_ID;
        me.strDoiTuongDangKy_id = data.KTX_DOITUONGOKYTUCXA_ID;
        edu.util.viewHTMLById("lblHopDong_NguoiDangKy", edu.util.returnEmpty(data.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.returnEmpty(data.KTX_DOITUONGOKYTUCXA_TEN));
        edu.util.viewHTMLById("lblHopDong_MaSo", data.KTX_DOITUONGOKYTUCXA_MASO);
        edu.util.viewHTMLById("lblHopDong_PhongDangKy", data.KTX_PHONG_TEN);
        edu.util.viewHTMLById("lblHopDong_ToaNhaDangKy", data.KTX_TOANHA_TEN);

        edu.util.viewValById("txtHopDong_So", data.SOHOPDONG);
        edu.util.viewValById("dropHopDong_TinhTrang", data.TINHTRANG_ID);
        edu.util.viewValById("txtHopDong_NgayKy", data.NGAYKYHOPDONG);
        edu.util.viewValById("txtHopDong_NgayKetThuc", data.NGAYKETTHUCHOPDONG);
        edu.util.viewValById("txtHopDong_TongTien", edu.util.formatCurrency(data.TONGTIENTHUE));
        edu.util.viewValById("dropHopDong_BaoPhong", data.BAOPHONG);
        edu.util.viewValById("txtHopDong_SoThang", data.SOTHANG);
        edu.util.viewValById("txtHopDong_SoTien_Thang", edu.util.formatCurrency(data.GIATHUE_THANG));
        edu.util.viewValById("txtHopDong_SoChoThue", data.SOCHOTHUE);
        edu.util.viewValById("txtHopDong_NgayVao", data.NGAYVAO);
        edu.util.viewValById("txtHopDong_NgayRa", data.NGAYRA);
        edu.util.viewHTMLById("lblHopDong_ToaNha", data.KTX_TOANHA_TEN);
        edu.util.viewHTMLById("lblHopDong_Phong", data.KTX_PHONG_TEN);
        me.getDetail_ChinhSach();
        me.getDetail_MienGiam();
    },
    delete_HopDong: function (strId) {
        var me =  this;
        //--Edit
        var obj_delete = {
            'action': 'KTX_HopDong/Xoa',

            'strIds': me.strHopDong_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    me.getList_DangKyPhong();
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(obj_delete.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB DangKyPhong
    --ULR: Modules
    -------------------------------------------*/
    getList_DangKyPhong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_DaXepPhong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_DangKy_TuKhoa"),
            'strKTX_DangKy_Id': "",
            'strKTX_Phong_Id': edu.util.getValById("dropSearch_Phong"),
            'strKTX_DoiTuongOKyTucXa_Id': "",
            'strKTX_HopDong_Id': "",
            'strNguoiThucHien_Id': "",
            'dDaLapHopDong': 1,
            'strNgayKiemTra': edu.util.getValById('txtSearch_DangKy_NgayKiemTra'),
            'strTinhTrangHopDong_Id': edu.util.getValById("dropSearch_TinhTrang"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtDoiTuongDangKy = dtResult;
                    me.genTable_DangKyPhong(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DangKyPhong: function (data, iPager) {
        var me = main_doc.DaCoHopDong;
        $("#zoneHopDong").slideUp();
        $("#lblDangKy_DoiTuong_SoLuong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDangKy_DoiTuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DaCoHopDong.getList_DangKyPhong()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            arrClassName: ["btnDetail"],
            orowid: {
                id: 'KTX_HOPDONG_ID',
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(aData.ANH);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_MASO) + "</span><br />";
                        html += '<span> Phòng: ' + edu.util.returnEmpty(aData.KTX_TOANHA_TEN) + " - " + edu.util.returnEmpty(aData.KTX_PHONG_TEN) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.KTX_DOITUONGOKYTUCXA_ID + '" href="#"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (me.strHopDong_Id != '') {
            $("#" + jsonForm.strTable_Id + ' tr[id="' + me.strHopDong_Id + '"]').trigger("click");
        }
    },
    viewDetail_DangKyPhong: function (data) {
        var me = main_doc.DaCoHopDong;
        var strDoiTuong_Id = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_ID);
        var strDoiTuong_PhongDK_Id = edu.util.returnEmpty(data[0].KTX_PHONG_ID);
        var strDoiTuong_Ten = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_TEN);
        var strDoiTuong_MaSo = edu.util.returnEmpty(data[0].KTX_DOITUONGOKYTUCXA_MASO);
        var strDoiTuong_PhongDK = edu.util.returnEmpty(data[0].KTX_PHONG_MA);
        var strDoiTuong_ToaNhaDK = edu.util.returnEmpty(data[0].KTX_TOANHA_MA);

        me.strDoiTuongDangKy_id = strDoiTuong_Id;
        me.strDoiTuong_PhongDK_id = strDoiTuong_PhongDK_Id;
        me.strDoiTuong_ToaNhaDK_id = strDoiTuong_ToaNhaDK_id;

        edu.util.viewHTMLById("lblHopDong_NguoiDangKy", strDoiTuong_Ten);
        edu.util.viewHTMLById("lblHopDong_MaSo", strDoiTuong_MaSo);
        edu.util.viewValById("txtHopDong_NgayVao", data[0].NGAYVAO);
        edu.util.viewValById("txtHopDong_NgayRa", data[0].NGAYRA);
        edu.util.viewValById("dropHopDong_ToaNha", data[0].KTX_TOANHA_ID);
        edu.util.viewValById("dropHopDong_Phong", data[0].KTX_PHONG_ID);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HopDong
    --ULR: Modules
    -------------------------------------------*/
    getList_HinhThuc: function (data) {
        var me = main_doc.DaCoHopDong;
        me.dtHinhThuc = data;
    },
    getList_KhoanThu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
            'strcanboquanly_id': "",
            'strNhomCacKhoanThu_Id': "KTX",
            'pageIndex': 1,
            'pageSize': 1000000,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoanThu = data.Data;
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("TC_KhoanThu/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HopDong_TinhTien
    --ULR: Modules
    -------------------------------------------*/
    save_HopDong_TinhTien: function (dSoThang) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi',
            

            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strKTX_Phong_Id': edu.util.getValById("dropHopDong_Phong"),
            'dSoThang': dSoThang
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data.Data[0].TONGTIEN);
                    edu.util.viewValById("txtHopDong_TongTien",data.Data[0].TONGTIEN);
                }
                else {
                    edu.system.alert("KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genCombo_KhoanThu: function (placeRender, default_val) {
        var me = main_doc.DaCoHopDong;
        var obj = {
            data: me.dtKhoanThu,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                default_val: default_val
            },
            renderPlace: [placeRender],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + placeRender).select2();
    },
    genCombo_HinhThuc: function (placeRender, default_val) {
        var me = main_doc.DaCoHopDong;
        var obj = {
            data: me.dtHinhThuc,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                default_val: default_val
            },
            renderPlace: [placeRender],
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + placeRender).select2();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB DoiTuongMienGiam
    --ULR: Modules
    -------------------------------------------*/
    update_ChinhSach: function (strId) {
        var me = this;
        var strTempId = strId;
        if (strId.length == 30) strId = "";
        var obj_save = {
            'action': 'KTX_HopDong_ChinhSach/ThemMoi',
            

            'strId': strId,
            'strKTX_HopDong_Id': me.strHopDong_Id,
            'dSoDienNuocDuocMien': $('#txtHeSoCS' + strTempId).val(),
            'strNgayBatDauApDung': "",
            'strNgayKetThucApDung': "",
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu' + strTempId),
            'strDonViTinh_Id': edu.util.getValById('dropDonVi' + strTempId),
            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = "KTX_HopDong_ChinhSach/CapNhat";
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Cập nhật thành công!");
                    } else {
                        edu.system.alert("Thêm mới thành công!");
                    }
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_ChinhSach: function () {
        var me = this;
        if (me.strHopDong_Id == "" || me.strDoiTuongDangKy_id == "") return;

        //--Edit
        var obj_list = {
            'action': 'KTX_HopDong_ChinhSach/LayDanhSach',

            'strTuKhoa': "",
            'strDonViTinh_Id': "",
            'strTaiChinh_CacKhoanThu_Id': "",
            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strKTX_HopDong_Id': me.strHopDong_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_ChinhSach(dtResult);
                }
                else {
                    edu.system.alert("TC_KhoanThu/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("TC_KhoanThu/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_ChinhSach: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KTX_HopDong_ChinhSach/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getDetail_ChinhSach();
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
               

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_ChinhSach: function (data) {
        var me = this;
        $("#tblHopDong_ChinhSach tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strId = data[i].ID;
            var row = '';
            row += '<tr id="' + strId + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strId + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropKhoanThu' + strId + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><input type="text" id="txtHeSoCS' + strId + '" value="' + edu.util.returnEmpty(data[i].SODIENNUOCDUOCMIEN) + '" placeholder="Hệ số" class="form-control"/></td>';
            row += '<td><select id="dropDonVi' + strId + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="delete" id="' + strId + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblHopDong_ChinhSach tbody").append(row);
            me.genCombo_KhoanThu("dropKhoanThu" + strId, data[i].TAICHINH_CACKHOANTHU_ID);
            me.genCombo_HinhThuc("dropDonVi" + strId, data[i].DONVITINH_ID);
        }
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ChinhSach(id, "");
        //}
    },
    genHTML_ChinhSach: function (strId) {
        var me = this;
        var iViTri = document.getElementById("tblHopDong_ChinhSach").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strId + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strId + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropKhoanThu' + strId + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><input type="text" id="txtHeSoCS' + strId + '" placeholder="Hệ số"  class="form-control"/></td>';
        row += '<td><select id="dropDonVi' + strId + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strId + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblHopDong_ChinhSach tbody").append(row);
        me.genCombo_KhoanThu("dropKhoanThu" + strId, "");
        me.genCombo_HinhThuc("dropDonVi" + strId, "");
    },

    update_MienGiam: function (strId) {
        var me = this;
        var strTempId = strId;
        if (strId.length == 30) strId = "";
        var obj_save = {
            'action': 'KTX_HopDong_MienGiam/ThemMoi',
            

            'strId': strId,
            'strKTX_HopDong_Id': me.strHopDong_Id,
            'dPhanTramMienGiam': $('#txtHeSo' + strTempId).val(),
            'strNgayBatDauApDung': "",
            'strNgayKetThucApDung': "",
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu' + strTempId),
            'strDonViTinh_Id': edu.util.getValById('dropDonVi' + strTempId),
            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strNguoiThucHien_Id': edu.system.userId
        };

        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = "KTX_HopDong_MienGiam/CapNhat";
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Cập nhật thành công!");
                    } else {
                        edu.system.alert("Thêm mới thành công!");
                    }

                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_MienGiam: function () {
        var me = this;
        if (me.strHopDong_Id == "" || me.strDoiTuongDangKy_id == "") return;

        //--Edit
        var obj_list = {
            'action': 'KTX_HopDong_MienGiam/LayDanhSach',

            'strTuKhoa': "",
            'strDonViTinh_Id': "",
            'strTaiChinh_CacKhoanThu_Id':"",
            'strKTX_DoiTuongOKyTucXa_Id': me.strDoiTuongDangKy_id,
            'strKTX_HopDong_Id': me.strHopDong_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_MienGiam(dtResult);
                }
                else {
                    edu.system.alert("TC_KhoanThu/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("TC_KhoanThu/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    delete_MienGiam: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KTX_HopDong_MienGiam/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getDetail_MienGiam();
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {


            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_MienGiam: function (data) {
        var me = this;
        $("#tblHopDong_MienGiam tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strId = data[i].ID;
            var row = '';
            row += '<tr id="' + strId + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strId + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropKhoanThu' + strId + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td><input type="text" id="txtHeSo' + strId + '" placeholder="Hệ số" value="' + edu.util.returnEmpty(data[i].PHANTRAMMIENGIAM) + '" class="form-control"/></td>';
            row += '<td><select id="dropDonVi' + strId + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="delete" id="' + strId + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblHopDong_MienGiam tbody").append(row);
            me.genCombo_KhoanThu("dropKhoanThu" + strId, data[i].TAICHINH_CACKHOANTHU_ID);
            me.genCombo_HinhThuc("dropDonVi" + strId, data[i].DONVITINH_ID);
        }
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_MienGiam(id, "");
        //}
    },
    genHTML_MienGiam: function (strId) {
        var me = this;
        var iViTri = document.getElementById("tblHopDong_MienGiam").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strId + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strId + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropKhoanThu' + strId + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td><input type="text" id="txtHeSo' + strId + '" placeholder="Hệ số"  class="form-control"/></td>';
        row += '<td><select id="dropDonVi' + strId + '" class="select-opt"><option value=""> --- Chọn tình trạng--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strId + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblHopDong_MienGiam tbody").append(row);
        me.genCombo_KhoanThu("dropKhoanThu" + strId, "");
        me.genCombo_HinhThuc("dropDonVi" + strId, "");
    },
    genDeTail_MienGiam: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            $("#txtMG_PhanTram" + data[i].TAICHINH_CACKHOANTHU_ID).val(data[i].PHANTRAMMIENGIAM);
            $("#txtMG_PhanTram" + data[i].TAICHINH_CACKHOANTHU_ID).attr("name", data[i].ID);
            edu.util.viewValById("dropMG_HinhThuc" + data[i].TAICHINH_CACKHOANTHU_ID, data[i].DONVITINH_ID);
        }
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_Phong
    -------------------------------------------*/
    getList_ToaNha: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiToaNha_Id': "",
            'strViTriCauThang_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ToaNha(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_ToaNha/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_ToaNha/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ToaNha: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN"
            },
            renderPlace: ["dropSearch_ToaNha"],
            title: "Chọn tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_ToaNha
    -------------------------------------------*/
    getList_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_ToaNha"),
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000000,

        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_Phong(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_Phong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN"
            },
            renderPlace: ["dropSearch_Phong"],
            title: "Chọn phòng"
        };
        edu.system.loadToCombo_data(obj);
    },
}