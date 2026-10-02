/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KeHoachXuLy() { };
KeHoachXuLy.prototype = {
    dtKeHoachXuLy: [],
    strKeHoachXuLy_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        //me.getList_ThoiGianDaoTao();
        me.getList_KeHoachXuLy();
        me.getList_ThoiGianDaoTao();
        me.getList_KeHoachDangKy();
        me.getList_LoaiQuyetDinh();
        me.getList_DMLKT();
        edu.extend.genBoLoc_HeKhoa("_TTN");
        
        $('#dropQuyetDinh_Loai').on('select2:select', function (e) {

            me.getList_QuyetDinh();
        });
        $('#dropThoiGianKyDot').on('select2:select', function (e) {

            me.getList_KeHoachDangKy();
        });
        $("#btnSearch").click(function (e) {
            me.getList_KeHoachXuLy();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoachXuLy();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachXuLy").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KeHoachXuLy();
            }
        });
        $("#btnXoaKeHoachXuLy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoachXuLy(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_KeHoachXuLy();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#tblKeHoachXuLy").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            me.strKeHoachXuLy_Id = strId;
            edu.util.setOne_BgRow(strId, "tblKeHoachXuLy");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachXuLy, "ID")[0];
                me.viewEdit_KeHoachXuLy(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/


        $(".btnThemHeKhoa").click(function () {
            var strLoai = $(this).attr("name");
            me["strLoai"] = strLoai;
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    var strSinhVien_Id = edu.extend.dtSinhVien.find(eSV => eSV.ID == e).QLSV_NGUOIHOC_ID;
                    switch (me.strLoai) {
                        case "PHAMVI": me.save_PhamVi(strSinhVien_Id); break;
                        case "KHONGPHAMVI": me.save_KhongPhamVi(strSinhVien_Id); break;
                        case "GIAHAN": me.save_PhamVi_GiaHan(strSinhVien_Id); break;
                        case "KEHOACH": me.save_KhoanKhongKeHoach(strSinhVien_Id); break;
                    }
                })
            });
            edu.extend.getList_SinhVien();
        });

        $("#modal_sinhvien").delegate('#btnAdd_He', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_He_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    switch (me.strLoai) {
                        case "PHAMVI": me.save_PhamVi(e); break;
                        case "KHONGPHAMVI": me.save_KhongPhamVi(e); break;
                        case "GIAHAN": me.save_PhamVi_GiaHan(e); break;
                        case "KEHOACH": me.save_KhoanKhongKeHoach(e); break;
                    }
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_Khoa_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    switch (me.strLoai) {
                        case "PHAMVI": me.save_PhamVi(e); break;
                        case "KHONGPHAMVI": me.save_KhongPhamVi(e); break;
                        case "GIAHAN": me.save_PhamVi_GiaHan(e); break;
                        case "KEHOACH": me.save_KhoanKhongKeHoach(e); break;
                    }
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    switch (me.strLoai) {
                        case "PHAMVI": me.save_PhamVi(e); break;
                        case "KHONGPHAMVI": me.save_KhongPhamVi(e); break;
                        case "GIAHAN": me.save_PhamVi_GiaHan(e); break;
                        case "KEHOACH": me.save_KhoanKhongKeHoach(e); break;
                    }
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_Lop_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    switch (me.strLoai) {
                        case "PHAMVI": me.save_PhamVi(e); break;
                        case "KHONGPHAMVI": me.save_KhongPhamVi(e); break;
                        case "GIAHAN": me.save_PhamVi_GiaHan(e); break;
                        case "KEHOACH": me.save_KhoanKhongKeHoach(e); break;
                    }
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#btnDelete_PhamVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhamVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhamVi(arrChecked_Id[i]);
                }
            });
        });
        

        $("#btnDelete_KhongPhamVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhongPhamVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhongPhamVi(arrChecked_Id[i]);
                }
            });
        });

        $("#btnDelete_GiaHan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGiaHan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhamVi_GiaHan(arrChecked_Id[i]);
                }
            });
        });
        $(".btnThemTuKeHoach").click(function () {
            var strLoai = $(this).attr("name");
            me["strLoai"] = strLoai;
            $("#myModalPhamViKyDot").modal("show");
        });

        $("#btnSave_PhamViKyDot").click(function () {
            var e = $("#dropKeHoachDangKy").val();
            if (e) {
                edu.system.alert('<div id="zoneprocessProGes"></div>');
                edu.system.genHTML_Progress("zoneprocessProGes", 1);
                switch (me.strLoai) {
                    case "PHAMVI": me.save_PhamVi(e); break;
                    case "KHONGPHAMVI": me.save_KhongPhamVi(e); break;
                    case "GIAHAN": me.save_PhamVi_GiaHan(e); break;
                }
            }
        });

        $(".btnThemQuyetDinh").click(function () {
            $("#myModalQuyetDinh").modal("show");
        });

        $("#btnSave_QuyetDinh").click(function () {
            var e = $("#dropQuyetDinh").val();
            if (e) {
                $("#myModalQuyetDinh").modal("hide");
                edu.system.genHTML_Progress("zoneprocessProGes", 1);
                me.save_PhamVi_GiaHan(e);
            }
        });
        $("#btnSave_UpdateGiaHan").click(function () {
            var arrThem = [];
            $("#tblGiaHan .update").each(function () {
                var strValue = $(this).attr("name");
                var x = $(this).val();
                if (x != strValue) {
                    var strId = $(this).attr('title');
                    if (arrThem.indexOf(strId) == -1) {
                        arrThem.push(strId);
                    }
                }
            })
            if (arrThem.length == 0) {
                edu.system.alert("Không có thay đổi để lưu");
                return;
            }
            edu.system.alert('<div id="zoneprocessProGes"></div>');
            edu.system.genHTML_Progress("zoneprocessProGes", arrThem.length);
            arrThem.forEach(e => me.save_PhamVi_GiaHan("",e));
        });

        $("#btnAddThoiGian").click(function () {
            $("#myModalThoiGian").modal("show");
        });

        $("#btnSave_ThoiGian").click(function () {
            var arrKhoanThu = $("#dropKhoanThu").val();
            if (arrKhoanThu) {
                $("#myModalThoiGian").modal("hide");
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrKhoanThu.length);
                arrKhoanThu.forEach(e => me.save_ThoiGian(e))
            }
        });

        $("#btnDelete_ThoiGian").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThoiGian", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThoiGian(arrChecked_Id[i]);
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKeHoachXuLy_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        

        edu.system.getList_MauImport("zonebtnBaoCao_KH", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strHB_QuyHocBong_Id': edu.util.getValById('dropSearch_QuyHocBong'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            arrChecked_Id.forEach(e => addKeyValue('strHocBong_Id', e));
        });
        


        $("#btnAddThoiGian").click(function () {

        });
        $("#btnXoaKhoanKhongKeHoach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoanKhongKeHoach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhoanKhongKeHoach(arrChecked_Id[i]);
                }
            });
        });
        $("#btnAdd_KhoanKhongKeHoach").click(function () {
            me["strLoai"] = "KEHOACH";
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    var aData = edu.extend.dtSinhVien.find(eSV => eSV.ID == e);
                    me.save_KhoanKhongKeHoach(aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID);
                })
            });
            //edu.extend.getList_SinhVien();
        });
        //$(".btnSearchDTSV_SinhVien").click(function () {
        //    me["strLoai"] = "KEHOACH";
        //    edu.extend.genModal_SinhVien(arrChecked_Id => {
        //        edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
        //        arrChecked_Id.forEach(e => {
        //            var aData = edu.extend.dtSinhVien.find(eSV => eSV.ID == e);
        //            me.save_KhoanKhongKeHoach(aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID);
        //        })
        //    });
        //    //edu.extend.getList_SinhVien();
        //});

        //$("#modal_sinhvien").delegate('#btnAdd_KhoaKhoa', 'click', function () {
        //    var arrChecked_Id = $("#dropSearchModal_KhoaQL_SV").val();
        //    var arrChecked_Id2 = $("#dropSearchModal_Khoa_SV").val();
        //    if (arrChecked_Id.length > 0 && arrChecked_Id2.length) {
        //        edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length * arrChecked_Id2.length);
        //        arrChecked_Id.forEach(e => {
        //            arrChecked_Id2.forEach(ele => me.save_KhoanKhongKeHoach(ele + e))
        //        })
        //        $("#modal_sinhvien").modal("hide");
        //    }
        //});
        //$("#modal_sinhvien").delegate('#btnAdd_He', 'click', function () {
        //    var arrChecked_Id = $("#dropSearchModal_He_SV").val();
        //    if (arrChecked_Id.length > 0) {
        //        edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
        //        arrChecked_Id.forEach(e => {
        //            me.save_KhoanKhongKeHoach(e);
        //        })
        //        $("#modal_sinhvien").modal("hide");
        //    }
        //});
        //$("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
        //    var arrChecked_Id = $("#dropSearchModal_Khoa_SV").val();
        //    if (arrChecked_Id.length > 0) {
        //        edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
        //        arrChecked_Id.forEach(e => {
        //            me.save_KhoanKhongKeHoach(e);
        //        })
        //        $("#modal_sinhvien").modal("hide");
        //    }
        //});
        //$("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
        //    var arrChecked_Id = $("#dropSearchModal_ChuongTrinh_SV").val();
        //    if (arrChecked_Id.length > 0) {
        //        edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
        //        arrChecked_Id.forEach(e => {
        //            me.save_KhoanKhongKeHoach(e);
        //        })
        //        $("#modal_sinhvien").modal("hide");
        //    }
        //});
        //$("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
        //    var arrChecked_Id = $("#dropSearchModal_Lop_SV").val();
        //    if (arrChecked_Id.length > 0) {
        //        edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
        //        arrChecked_Id.forEach(e => {
        //            me.save_KhoanKhongKeHoach(e);
        //        })
        //        $("#modal_sinhvien").modal("hide");
        //    }
        //});
        $("#btnSearchKhoanKhongKeHoach").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneKhoanKhongKeHoach");
            me.getList_KhoanKhongKeHoach();
        });
        $("#btnSearchCheDo").click(function () {
            $("#myModalCheDo").modal("show");
            me.getList_CheDo();
        });
        $("#btnSave_CheDo").click(function () {
            $("#myModalCheDo").modal("hide");
            me.save_CheDo();
        });
        $("#btnSearchTinhTrangNo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn kế hoạch?");
                return;
            }
            edu.util.toggle_overide("zone-bus", "zoneTinhTrangNo");
            me["arrKeHoach"] = arrChecked_Id;
            //me.getList_TinhTrangNo();
        });
        $("#btnSave_KHKhongTT").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTinhTrangNo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.arrKeHoach.forEach(e => arrChecked_Id.forEach(ele => me.save_KhongThuTien(ele, e)));
        });
        $("#btnSave_KHTT").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTinhTrangNo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.arrKeHoach.forEach(e => arrChecked_Id.forEach(ele => me.save_ThuTien(ele, e)));
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachXuLy_Id = "";

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("dropHieuLuc", 1);
        $("#tblPhamVi tbody").html("");
        $("#tblKhongThuocPhamVi tbody").html("");
        $("#tblGiaHan tbody").html("");
        $("#tblThoiGian tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_KeHoachXuLy();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_KeHoachThu_GiaHan/LayDSTaiChinh_KeHoachThuTien',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strNguoiThucHien_Id': edu.system.userId,
            'dHieuLuc': edu.util.getValById('dropSearch_HieuLuc'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    me.genTable_KeHoachXuLy(dtReRult, data.Pager);
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
    save_KeHoachXuLy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan/Them_TaiChinh_KeHoachThuTien',
            'type': 'POST',
            'strId': me.strKeHoachXuLy_Id,
            'strTenKeHoach': edu.util.getValById('txtTen'),
            'strNgayBatDau': edu.util.getValById('txtTuNgay'),
            'strNgayKetThuc': edu.util.getValById('txtDenNgay'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TC_KeHoachThu_GiaHan/Sua_TaiChinh_KeHoachThuTien';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachXuLy: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TC_KeHoachThu_GiaHan/Xoa_TaiChinh_KeHoachThuTien',
            
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KeHoachXuLy();
                }
                else {
                    obj = {
                        content: "KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "HB_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_KeHoachXuLy: function (data, iPager) {
        var me = this;
        $("#lblKeHoachXuLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachXuLy",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "HIEULUC"
                },
                {
                    "mDataProp": "TENKEHOACH",
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.BATCHEDOCANHBAOCHOSV ? "Thông báo cho SV": "";
                    }
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_KeHoachXuLy: function (data) {
        var me = this;
        //View - Thong tin
        //edu.util.viewValById("dropHieuLuc", data.MA);
        edu.util.viewValById("txtTen", data.TENKEHOACH);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropMoHinhDaoTao", data.MOHINHDANGKY_ID);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        edu.util.viewValById("txtHanNopPhi", data.NGAYHANNOPPHI);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtTrinhDo", data.TRINHDO);
        edu.util.viewValById("txtThoiGianDuKien", data.THOIGIANTHIDUKIEN);
        edu.util.viewValById("txtDiaDiemDuKien", data.DIADIEMDUKIEN);
        me.strKeHoachXuLy_Id = data.ID;
        me.getList_PhamVi();
        me.getList_KhongPhamVi();
        me.getList_ThoiGian();
        me.getList_PhamVi_GiaHan();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_PhamVi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KeHoachThu_GiaHan/LayDSTaiChinh_PhamViThu',
            'type': 'GET',
            'strTaiChinh_KeHoachThu_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_PhamVi(dtResult);
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
    save_PhamVi: function (strPhamViApDung_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan/Them_TaiChinh_PhamViThu',
            'type': 'POST',
            'strTaiChinh_KeHoachThu_Id': me.strKeHoachXuLy_Id,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_PhamVi();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhamVi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KeHoachThu_GiaHan/Xoa_TaiChinh_PhamViThu',

            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    //me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhamVi();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_PhamVi: function (data) {
        var me = this;
        //3. create html
        var jsonForm = {
            strTable_Id: "tblPhamVi",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
    getList_KhongPhamVi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KeHoachThu_GiaHan/LayDSTaiChinh_PhamViThu_Khong',
            'type': 'GET',
            'strTaiChinh_KeHoachThu_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_KhongPhamVi(dtResult);
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
    save_KhongPhamVi: function (strPhamViApDung_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan/Them_TaiChinh_PhamViThu_Khong',
            'type': 'POST',
            'strTaiChinh_KeHoachThu_Id': me.strKeHoachXuLy_Id,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_KhongPhamVi();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KhongPhamVi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KeHoachThu_GiaHan/Xoa_TaiChinh_PhamViThu_Khong',

            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    //me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KhongPhamVi();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_KhongPhamVi: function (data) {
        var me = this;
        //3. create html
        var jsonForm = {
            strTable_Id: "tblKhongPhamVi",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_PhamVi_GiaHan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KeHoachThu_GiaHan/LayDSTaiChinh_PhamViThu_GiaHan',
            'type': 'GET',
            'strTaiChinh_KeHoachThu_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_PhamVi_GiaHan(dtResult);
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
    save_PhamVi_GiaHan: function (strPhamViApDung_Id, strId) {
        var me = this;
        if (!strId) strId = "";
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan/Them_TaiChinh_PhamViThu_GiHan',
            'type': 'POST',
            'strId': strId,
            'strTaiChinh_KeHoachThu_Id': me.strKeHoachXuLy_Id,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strNgayKetThuc': edu.util.getValById('txtNgayGiaHan' + strId),
            'strMoTa': edu.util.getValById('txtMoTaGiaHan' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TC_KeHoachThu_GiaHan/Sua_TaiChinh_PhamViThu_GiHan';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_PhamVi_GiaHan();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhamVi_GiaHan: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KeHoachThu_GiaHan/Xoa_TaiChinh_PhamViThu_GiHan',

            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    //me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhamVi_GiaHan();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_PhamVi_GiaHan: function (data) {
        var me = this;
        //3. create html
        var jsonForm = {
            strTable_Id: "tblGiaHan",
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                }
                ,
                {
                    //"mDataProp": "NGAYKETTHUC",
                    "mRender": function (nRow, aData) {
                        return '<input <input id="txtNgayGiaHan' + aData.ID + '" class="form-control update"  value="' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '" name="' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '" title="' + aData.ID + '" />';
                    }
                }
                ,
                {
                    //"mDataProp": "MOTA",
                    "mRender": function (nRow, aData) {
                        return '<input <input id="txtMoTaGiaHan' + aData.ID + '" class="form-control update"  value="' + edu.util.returnEmpty(aData.MOTA) + '" name="' + edu.util.returnEmpty(aData.MOTA) + '" title="' + aData.ID + '" />';
                    }
                }
                ,{
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    
    save_ThoiGian: function (strRow_Id) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan/Them_TaiChinh_KeHoach_Khoan',
            'type': 'POST',
            'strTaiChinh_KeHoachThu_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianKT'),
            'strTaiChinh_CacKhoanThu_Id': strRow_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    edu.system.alert("Thêm thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThoiGian();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThoiGian: function () {
        var me = this;

        //--Edit

        var obj_list = {
            'action': 'TC_KeHoachThu_GiaHan/LayDSTaiChinh_KeHoach_Khoan',
            'type': 'GET',
            'strTaiChinh_KeHoachThu_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThoiGian(dtResult);
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
    delete_ThoiGian: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TC_KeHoachThu_GiaHan/Xoa_TaiChinh_KeHoach_Khoan',

            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ThoiGian();
                }
                else {
                    obj = {
                        content: ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "(er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThoiGian();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    genHTML_ThoiGian: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThoiGian",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                ,
                {
                    "mDataProp": "THOIGIAN"
                }
                ,  {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //for (var i = data.length; i < 4; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(id, "");
        //}
    },


    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KeHoachThu_GiaHan/LayDSThoiGian',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.cbGenCombo_ThoiGianDaoTao(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianKyDot", "dropThoiGianKT"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachDangKy: function () {
        var me =this;

        //--Edit
        var obj_list = {
            'action': 'TC_KeHoachThu_GiaHan/LayDSKeHoachDangKyHoc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianKyDot'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.cbGenCombo_KeHoachDangKy(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    cbGenCombo_KeHoachDangKy: function (data) {
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
            renderPlace: ["dropKeHoachDangKy"],
            type: "",
            title: "Chọn kế hoạch đăng ký",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_LoaiQuyetDinh: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiQuyetDinh(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_LoaiQuyetDinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropQuyetDinh_Loai"],
            type: "",
            title: "Chọn loại quyết định",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_QuyetDinh: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strLopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropQuyetDinh_Loai'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_QuyetDinh(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_QuyetDinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "SOQUYETDINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropQuyetDinh"],
            type: "",
            title: "Chọn quyết định",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    getList_DMLKT: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.cbGenCombo_KhoanThu(data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    cbGenCombo_KhoanThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoanThu", "dropLoaiKhoan"],
            type: "",
            title: "Chọn Khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },


    save_KhoanKhongKeHoach: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/FSkkLB4VAh4KKS4gLxUpNB4KKS4vJgoVMyAP',
            'func': 'pkg_taichinh_kehoachthu_giahan.Them_TC_KhoanThu_KhongKTra',
            'iM': edu.system.iM,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropLoaiKhoan'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_KhoanKhongKeHoach();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoanKhongKeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/DSA4BRIVAh4KKS4gLxUpNB4KKS4vJgoVMyAP',
            'func': 'pkg_taichinh_kehoachthu_giahan.LayDSTC_KhoanThu_KhongKTra',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KhoanKhongKeHoach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_KhoanKhongKeHoach: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/GS4gHhUCHgopLiAvFSk0HgopLi8mChUzIAPP',
            'func': 'pkg_taichinh_kehoachthu_giahan.Xoa_TC_KhoanThu_KhongKTra',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KhoanKhongKeHoach();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KhoanKhongKeHoach: function (data, iPager) {
        $("#lblKhoanKhongKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoanKhongKeHoach",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KhongKhoanKhongKeHoach.getList_KhongKhoanKhongKeHoach()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    //"mDataProp": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + " - " + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_MA);
                    }
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    getList_CheDo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_Chung_MH/DSA4FRUVKSAsEi4CKTQvJhUpIC8pFS4gLwPP',
            'func': 'pkg_taichinh_chung.LayTTThamSoChungThanhToan',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length) {
                        edu.util.viewValById("dropCheDo", dtReRult[0].CHANTTKHIKHONGCOKEHOACHTHU)
                    }
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_CheDo: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_Chung_MH/AiAxDykgNRUpICwSLgIpIC8VKSAvKRUuIC8P',
            'func': 'pkg_taichinh_chung.CapNhatThamSoChanThanhToan',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'dChanTTKhiKhongCoKeHoach': edu.util.getValById('dropCheDo'),
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessProGes", function () {
                //    me.getList_KhoanKhongKeHoach();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_TinhTrangNo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2_MH/FSkuLyYKJA8uESkoFSkkLgopLiAJLiIP',
            'func': 'pkg_taichinh_thuchi2.ThongKeNoPhiTheoKhoaHoc',
            'iM': edu.system.iM,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_TTN'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtTinhTrangNo"] = dtReRult;
                    me.genTable_TinhTrangNo(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TinhTrangNo: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblTinhTrangNo",
            aaData: data,
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TENKHOA"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDataProp": "TONGTIENNO"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_KhongThuTien: function (strId, strTaiChinh_KeHoachThu_Id) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtTinhTrangNo.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/FSkkLBEpICwXKAokCS4gIikKKS4vJhUpNBUoJC8P',
            'func': 'pkg_taichinh_kehoachthu_giahan.ThemPhamViKeHoachKhongThuTien',
            'iM': edu.system.iM,
            'strTaiChinh_KeHoachThu_Id': strTaiChinh_KeHoachThu_Id,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strTaiChinh_CacKhoanThu_Id': aData.TAICHINH_CACKHOANTHU_ID,
            'strDaoTao_KhoaDaoTao_Id': aData.ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessProGes", function () {
                //    me.getList_KhoanKhongKeHoach();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ThuTien: function (strId, strTaiChinh_KeHoachThu_Id) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtTinhTrangNo.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThu_GiaHan_MH/FSkkLBEpICwXKAokCS4gIikVKTQVKCQv',
            'func': 'pkg_taichinh_kehoachthu_giahan.ThemPhamViKeHoachThuTien',
            'iM': edu.system.iM,
            'strTaiChinh_KeHoachThu_Id': strTaiChinh_KeHoachThu_Id,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strTaiChinh_CacKhoanThu_Id': aData.TAICHINH_CACKHOANTHU_ID,
            'strDaoTao_KhoaDaoTao_Id': aData.ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessProGes", function () {
                //    me.getList_KhoanKhongKeHoach();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}