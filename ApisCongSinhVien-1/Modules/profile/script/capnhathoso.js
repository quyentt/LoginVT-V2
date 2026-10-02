/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 02/8/2018
----------------------------------------------*/
function CapNhatHoSo() { };
CapNhatHoSo.prototype = {
    do_table: '',
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    init: function () {
        var me = this;
        me.page_load();
        //edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QHGD, "drop_QHGD_LoaiQuanHe");
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
       
        /*------------------------------------------
       --Discription: [3-3] Action Thanh phan gia dinh
       --Order:
       -------------------------------------------*/
        $("#btnAdd_TPGD").click(function () {
            var id = edu.util.randomString(30, "");
            var strLoaiQuanHe_Id = edu.util.getValById("drop_QHGD_LoaiQuanHe");
            var strQuanHe = $("#drop_QHGD_LoaiQuanHe option:selected").text();
            var strHoTen = edu.util.getValById("txtQHGD_HoTen");
            var strNamSinh = edu.util.getValById("txtQHGD_NamSinh");
            var strNoiOHienNay = edu.util.getValById("txtQHGD_NoiOHienNay");

            if (edu.util.checkValue(strLoaiQuanHe_Id) && edu.util.checkValue(strHoTen)) {
                me.genTable_QHGD(id, strLoaiQuanHe_Id, strQuanHe, strHoTen, strNamSinh, strNoiOHienNay);

                edu.util.viewValById("drop_QHGD_LoaiQuanHe", "");
                edu.util.viewValById("txtQHGD_HoTen", "");
                edu.util.viewValById("txtQHGD_NamSinh", "");
                edu.util.viewValById("txtQHGD_NoiOHienNay", "");
            }
            else {
                edu.system.alert("Vui lòng nhập đủ thông tin", 'w');
            }
        });
        $("#tblInput_SV_ThanhPhanGiaDinh").delegate(".btnDeletePoiter", "click", function (e) {
            var strId = this.id;
            if (strId.length == 30) {
                $(this.parentNode.parentNode).replaceWith("");
            } else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThanhPhanGiaDinh(strId);
                });
            }
        });
        $("#btnHSSV_Save").click(function () {
            me.save_HS();
        })
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu("CSV.ACE", "drop_QHGD_LoaiQuanHe");
        edu.system.loadToCombo_DanhMucDuLieu("CSV.NGANHANG", "drop_SV_TKNH_ThuocNganHang");
        //start_load: getList_DanToc
        
        setTimeout(function () {
            me.getList_DanToc();
        }, 150);
        edu.extend.setTinhThanh(["txtSV_NoiSinh", "txtSV_QueQuan", "txtSV_HoKhauThuongTru", "txtSV_NoiOHienNay", "txtSV_DiaChiBaoTin"], 'TP Hà Nội, Quận Cầu Giấy, Dịch Vọng, Số 1 Nguyễn Phong Sắc');
        //end_load: getDetail_HS
        //edu.system.loadToCombo_DanhMucDuLieu("NS.QHGD", "drop_QHGD_LoaiQuanHe");
        edu.system.uploadAvatar(['uploadPicture_SV'], "");
    },
    getList_DanToc: function () {
        var me = main_doc.CapNhatHoSo;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropSV_DanToc", "", me.getList_TonGiao);
    },
    getList_TonGiao: function () {
        var me = main_doc.CapNhatHoSo;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TOGI, "dropSV_TonGiao", "", me.getList_GioiTinh);
    },
    getList_GioiTinh: function () {
        var me = main_doc.CapNhatHoSo;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "txtSV_GioiTinh", "", me.getList_QuocGia);
    },
    getList_QuocGia: function () {
        var me = main_doc.CapNhatHoSo;
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropSV_QuocTich");
        me.getDetail_HS();
    },
    /*------------------------------------------
	--Discription: Luu ho so sinh vien
	-------------------------------------------*/
    save_HS: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_HoSo/Capnhat',
            
            'strId': edu.system.userId,
            'strHoDem': "#",
            'strTen': "#",
            'strMaSo': "#",
            'strNgaySinh_Nam': "#",
            'strNgaySinh_Thang': "#",
            'strNgaySinh_Ngay': "#",
            'strBiDanh': "",
            'strTenGoiKhac': "",
            'strSoHoChieu': "",
            'strGioiTinh_Id': "#",
            'strNoiSinh_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("tinhid")),
            'strNoiSinh_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("huyenid")),
            'strNoiSinh_Xa_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("xaId")),
            'strNoiSinh_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("name")),
            'strQueQuan_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("tinhid")),
            'strQueQuan_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("huyenid")),
            'strQueQuan_Xa_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("xaId")),
            'strQueQuan_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_QueQuan").attr("name")),
            'strDanToc_Id': edu.util.getValById('dropSV_DanToc'),
            'strTonGiao_Id': edu.util.getValById('dropSV_TonGiao'),
            'strCMTND_So': edu.util.getValById('txtSV_SCC_So'),
            'strCMTND_NgayCap': edu.util.getValById('txtSV_SCC_NgayCap'),
            'strCMTND_NoiCap': edu.util.getValById('txtSV_SCC_NoiCap'),
            'strNoiOHienNay': edu.util.getValById('txtSV_NoiOHienNay'),
            'strNgayVaoTruong': "",
            'strDangDoan_NgayVaoDoan': "",
            'strDangDoan_NgayVaoDang': "",
            'strDangDoan_NgayChinhThuc': "",
            'strNganHang_SoTaiKhoan': "",
            'strNganHang_ThuocNganHang_Id': "",
            'strNganHang_ThongTinChiNhanh': "",
            'strHoKhau_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("tinhid")),
            'strHoKhau_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("huyenid")),
            'strHoKhau_Xa_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("xaId")),
            'strHoKhau_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("name")),
            'strQuocTich_Id': edu.util.getValById('dropSV_QuocTich'),
            'strThanhPhanGiaDinh_Id': "",
            'strDoiTuongDaoTao_Id': "",
            'strTTLL_DienThoaiCaNhan': edu.util.getValById('txtSV_DienThoaiCaNhan'),
            'strTTLL_DienThoaiGiaDinh': "",
            'strTTLL_DienThoaiCoQuan': "",
            'strTTLL_EmailCaNhan': edu.util.getValById('txtSV_Email'),
            'strTTLL_KhiCanBaoTinChoAi': edu.util.getValById('txtSV_DiaChiBaoTin'),
            'strNgayRaTruong': "",
            'strThongTinTruoc_NgheNghiep': "",
            'strThongTinTruoc_KhenThuong': "",
            'strThongTinTruoc_KyLuat': "",
            'strThongTinTruoc_GhiChu': "",
            'strAnh': edu.util.getValById('uploadPicture_SV'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Lưu thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!", 'i');
                    }
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                
            },
            error: function (er) {  },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            authen:true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: Lay chi tiet ho so sinh vien
	-------------------------------------------*/
    getDetail_HS: function () {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'SV_HoSo/LayChiTiet',
            
            'strId': edu.system.userId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HS(data.Data[0]);
                    }
                    else {
                        me.viewForm_HS([]);
                    }
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                    
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
                
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: Xem ho so sinh vien
	-------------------------------------------*/
    viewForm_HS: function (data) {
        var me = main_doc.CapNhatHoSo;
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        edu.util.viewValById("txtSV_HoDem", data.HODEM);////
        edu.util.viewValById("txtSV_Ten", data.TEN);////
        //edu.util.viewValById("txtSinhVien_BiDanh", data.BIDANH);
        edu.util.viewValById("txtSV_NgaySinh", data.NGAYSINH_NGAY);////
        edu.util.viewValById("txtSV_ThangSinh", data.NGAYSINH_THANG);////
        edu.util.viewValById("txtSV_NamSinh", data.NGAYSINH_NAM);////
        edu.util.viewValById("dropSV_QuocTich", data.QUOCTICH_ID);////
        edu.util.viewValById("txtSV_GioiTinh", data.GIOITINH_ID);////
        edu.util.viewValById("dropSV_DanToc", data.DANTOC_ID);////
        edu.util.viewValById("dropSV_TonGiao", data.TONGIAO_ID);////
        edu.util.viewValById("txtSV_DoiTuongUuTien", data.TTLL_EMAILCANHAN);////
        edu.util.viewValById("txt_MaSoSV", data.TTLL_DIENTHOAICANHAN);////
        edu.util.viewValById("uploadPicture_SV", data.ANH);////
        $("#srcuploadPicture_SV").attr("src", strAnh);////
        edu.util.viewValById("txtTrangThaiSinhVien", data.NOIOHIENNAY);////
        edu.extend.viewTinhThanhById("txtSV_NoiSinh", data.NOISINH_TINHTHANH_ID, data.NOISINH_QUANHUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_PHUONGXAKHOIXOM);////
        edu.extend.viewTinhThanhById("txtSV_QueQuan", data.QUEQUAN_TINHTHANH_ID, data.QUEQUAN_QUANHUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_PHUONGXAKHOIXOM);////
        edu.extend.viewTinhThanhById("txtSV_HoKhauThuongTru", data.HOKHAU_TINHTHANH_ID, data.HOKHAU_QUANHUYEN_ID, data.HOKHAU_XA_ID, data.HOKHAU_PHUONGXAKHOIXOM);////
        edu.util.viewValById("txtSV_NoiOHienNay", data.TTLL_KHICANBAOTINCHOAI_ODAU);////
        edu.util.viewValById("txtSV_DiaChiBaoTin", data.TTLL_KHICANBAOTINCHOAI_ODAU);////
        //me.strId = data.ID;//
        //me.strMaSV = data.MASO;////
        //me.strMaSV = data.NGAYVAOTRUONG;////
        //me.strMaSV = data.DOITUONGDAOTAO_ID;////
        //me.strMaSV = data.NGAYRATRUONG;////
        //me.strMaSV = data.NGANHANG_SOTAIKHOAN;////
        //me.strMaSV = data.NGANHANG_THUOCNGANHANG_ID;////

        //me.strMaSV = data.NGANHANG_THONGTINCHINHANH;////
        //me.strMaSV = data.DANGDOAN_NGAYVAODOAN;////
        //me.strMaSV = data.DANGDOAN_NGAYVAODANG;////
        //me.strMaSV = data.DANGDOAN_NGAYCHINHTHUCVAODANG;////
        edu.util.viewValById("txtSV_SCC_So", data.CMTND_SO);////
        edu.util.viewValById("txtSV_SCC_NgayCap", data.CMTND_NGAYCAP);////
        edu.util.viewValById("txtSV_SCC_NoiCap", data.CMTND_NOICAP);////
       // edu.util.viewValById("dropDSSV_ThanhPhanGiaDinh", data.THANHPHANGIADINH_ID);
        //edu.util.viewValById("txtDSSV_KyLuat", data.THONGTINTRUOC_KYLUAT);
        //edu.util.viewValById("txtDSSV_GhiChu", data.THONGTINTRUOC_GHICHU);
        //edu.util.viewValById("txtDSSV_NgheNghiep", data.THONGTINTRUOC_NGHENGHIEPCHUCVU);
        //edu.util.viewValById("txtDSSV_KhenThuong", data.THONGTINTRUOC_KHENTHUONG);
        //edu.util.viewValById("txtDSSV_DienThoaiGD", data.TTLL_DIENTHOAIGIADINH);
        
    },

    /*------------------------------------------
    --Discription: [3] Thanh phan gia dinh
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhPhanGiaDinh: function (strIds) {
        var me = this;
        var strQuanHe_Id = $("#tblInput_SV_ThanhPhanGiaDinh #" + strIds + " #lblThanhPhanGiaDinh_QuanHe").attr("name");
        var strHoTen = $("#tblInput_SV_ThanhPhanGiaDinh #" + strIds + " #lblThanhPhanGiaDinh_HoTen").html();
        var strNamSinh = $("#tblInput_SV_ThanhPhanGiaDinh #" + strIds + " #lblThanhPhanGiaDinh_NamSinh").html();
        var strNoiOHienTai = $("#tblInput_SV_ThanhPhanGiaDinh #" + strIds + " #lblThanhPhanGiaDinh_NoiOHienNay").html();
        //--Edit
        var obj_save = {
            'action': 'SV_ThanhPhanGiaDinh/ThemMoi',////
            

            'strIds': "",
            'strQLSV_NguoiHoc_Id': edu.system.userId,
            'strQuanHe_Id': strQuanHe_Id,
            'strHoDem': strHoTen,
            'strTen': "",
            'strQuocTich_Id': "",
            'strDanToc_Id': "",
            'strTonGiao_Id': "",
            'strHoKhau_TinhThanh_Id': "",
            'strHoKhau_QuanHuyen_Id': "",
            'strHoKhau_Xa_Id': "",
            'strHoKhau_PhuongXaKhoiXom': strNoiOHienTai,
            'strNgaySinh_Ngay': "",
            'strNgaySinh_Thang': "",
            'strNgaySinh_Nam': strNamSinh,
            'strNgheNghiep': "",
            'strDienThoaiCaNhan': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thêm mới thành công!");
                    //me.getList_MucDichLamViec();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhPhanGiaDinh: function (strIds) {
        var me = this;
        if (strIds == undefined) strIds = me.strIds;
        //--Edit
        var obj_list = {
            'action': 'SV_ThanhPhanGiaDinh/LayDanhSach',////
            

            'strIds': strIds,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    $("#tblInput_SV_ThanhPhanGiaDinh tbody").html("");
                    for (var i = 0; i < dtReRult.length; i++) {
                        me.genTable_ThanhPhanGiaDinh(dtReRult[i].ID, dtReRult[i].NGUONKINHPHI_ID, dtReRult[i].NGUONKINHPHI_TEN, dtReRult[i].SOTIEN, dtReRult[i].DONVITINH_ID, dtReRult[i].DONVITINH_TEN);////
                    }
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
    delete_KinhPhi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_HS_ThanhPhanGiaDinh/Xoa',
            
            'strIds': strIds,
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
                    edu.system.afterComfirm(obj);
                    me.getList_ThanhPhanGiaDinh(me.strHoiNghiHT_Id);
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [4] GenHTML Kinh phí
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhPhanGiaDinh: function (strRowId, strQuanHe_Id, strQuanHe, strHoTen, strNamSinh, strNoiOHienTai) {
        var me = this;
        var row = "";
        row += '<tr id="' + strRowId + '">';
        row += '<td>';
        row += 'Quan hệ<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblThanhPhanGiaDinh_QuanHe" name="' + strQuanHe_Id + '">' + strQuanHe + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Họ tên<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblThanhPhanGiaDinh_HoTen">' + strHoTen + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Năm sinh<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblThanhPhanGiaDinh_NamSinh">' + strNamSinh + '</span>';
        row += '</td>';
        row += '<td>';
        row += 'Năm sinh<span class="title-colon">:</span>';
        row += '</td>';
        row += '<td>';
        row += '<span id="lblThanhPhanGiaDinh_NoiOHienNay">' + strNoiOHienTai + '</span>';
        row += '</td>';
        row += '<td class="td-fixed td-center">';
        row += '<a id="' + strRowId + '" class="btnDeletePoiter poiter">';
        row += '<i class="fa fa-trash"></i>';
        row += '</a>';
        row += '</td>';
        row += '</tr>';
        $("#tblInput_HNHT_KinhPhi tbody").append(row);
    },
    /*------------------------------------------
	--Discription: Luu anh ho so
	-------------------------------------------*/
    //save_AnhHoSo: function () {
    //    var me = main_doc.CapNhatHoSo;
    //    var obj_save = {
    //        'action': 'SV_HoSo/KeThua',
    //        

    //        'strNhanSu_HoSo_v2_Id': edu.system.userId,
    //        'strNguoiThucHien_Id': edu.system.userId,
    //    };
    //    
    //    edu.system.makeRequest({
    //        success: function (data) {
    //            if (data.Success) {
    //                $("img[class='user-image']").attr("src", edu.system.rootPathUpload + "//" + edu.util.getValById('uploadPicture_SV'));
    //            }
    //            else {
    //                edu.system.alert(obj_save.action + ": " + data.Message, "w");
    //            }
    //            
    //        },
    //        error: function (er) {
    //            edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
    //            
    //        },
    //        type: "POST",
    //        action: obj_save.action,
    //        
    //        contentType: true,
    //        
    //        data: obj_save,
    //        fakedb: [
    //        ]
    //    }, false, false, false, null);
    //},
}