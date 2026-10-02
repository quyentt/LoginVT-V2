/*----------------------------------------------
--Author: Văn Hiệp 
--Phone: 
--Date of created: 17/10/2017
--Input: 
--Output:
--API URL:
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HoSoTaoMoi_Cu() { };
HoSoTaoMoi_Cu.prototype = {
    dt_HS: '',
    strId: '',
    input_HS: '',
    zoneActive: '',
    strChuongTrinhSelected_Id: '',
    strChuongTrinhOnSelect: '',
    strLopSelected_Id: '',
    strOnLopSelect: '',
    strTrangThaiSelected_Id: '',
    strTrangOnThaiSelect: '',
    nextZoneActive: '',
    strSinhVien_Id: '',
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.extend.addNotify();
        /*Start xử lý hộp tìm kiếm chức năng*/
        me.arrId = ["txtBiDanhHS", "dropQuocTichHS", "txtNamSinhHS", "txtThangSinhHS", "txtBaoTinHS", "txtSoCMTND", "txtSoHoChieu", "txtDienThoaiCoQuanHS", "txtQuocTichHS", "txtDienThoaiGiaDinhHS", "txtKhiCanBaoTinChoAiHS", "dropGioiTinhHS", "dropDanTocHS", "dropTonGiaoHS",
            "dropDoiTuongDaoTao", "dropTrangThaiNguoiHocHS", "dropLopQuanLyHS", "dropToChucCT", "dropChucVuSinhVien", "dropNganHangHS", "dropThanhPhanXuatThan",
            "txtHoHS", "txtTenHS", "txtMaSinhVienHS", "txtSoCMTNDHS", "txtEmailCaNhanHS", "txtSoDienThoaiCaNhanHS", "txtNgaySinhHS", "txtNoiSinhHS", "txtQueQuanHS",
            "txtHoKhauThuongTruHS", "txtNoiOHienNayHS", "txtNgayVaoTruongHS", "txtNgayRaTruongHS", "txtNgayVaoDang", "txtNgayChinhThuc", "txtDonViLienKet", "txtSoTaiKhoanHS",
            "txtChiNhanhHS", "txtNgheNghiepHS", "txtKhenThuongHS", "txtKyLuatHS", "txtGhiChuHS", "txtTenGoiKhacHS", "txtNoiCapCMTHS", "txtNgayCapCMTHS"];
        me.getList_HSSV();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.cbGenBo_TrangThai);
        edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropDanTocHS", "Chọn dân tộc");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropTonGiaoHS", "Chọn tôn giáo");
        edu.system.loadToCombo_DanhMucDuLieu("NS.GITI", "dropGioiTinhHS", "Chọn giới tính");
        edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropQuocTichHS", "Chọn quốc gia");
        edu.extend.setTinhThanh(["txtNoiSinhHS", "txtQueQuanHS", "txtHoKhauThuongTruHS"], 'xã Tú Mịch, huyện Lộc Bình, tỉnh Lạng Sơn');
        edu.system.uploadAvatar(['uploadPicture_HS'], "");
        $("#MainContent").delegate("#btnRewrite", "click", function (e) {
            
            me.rewrite();
        });
        $("#MainContent").delegate('.detail_HoSo333', 'click', function (e) {
            e.stopImmediatePropagation();
            //Nếu đang hiển thị form gán thông tin thì ẩn xong mới hiển thị form thêm mới
            if (document.getElementById("zoneGanThongTin").style.display == "") {
                $("#zoneGanThongTin").hide(500);
                setTimeout(function () {
                    $("#zoneMainContent").show(500);
                }, 500);
            } else {
                if (document.getElementById("zoneMainContent").style.display == "") {
                    if (this.id == me.strSinhVien_Id) {
                        $(".activeSelect").each(function () {
                            this.classList.remove('activeSelect');
                        });
                        $("#zoneMainContent").hide(500);
                    }
                } else {
                    $("#zoneMainContent").show(500);
                }
            }
            if (this.id != me.strSinhVien_Id) {
                me.strSinhVien_Id = this.id;
                me.activePerson(this.id);
            }
        });
        $("#btnSave").click(function () {
            me.save_HS();
        });
        $("#btnLuu").click(function () {
            //Lưu và chuyển id
            console.log(me.zoneActive);
            var strNextZone = "";
            switch (me.zoneActive) {
                case "": edu.system.alert("Vui lòng chọn sinh viên"); break;
                case 'zoneChuongTrinh': strNextZone = 'zoneGanLop'; me.save_GanChuongTrinhHoc(); break;
                case 'zoneGanLop': strNextZone = 'zoneLuuTrangThai'; me.save_GanLopQuanLy(); break;
                case 'zoneLuuTrangThai': strNextZone = 'zoneHoanThanh'; me.save_GanTrangThaiNguoiHoc(); break;
            }
            me.nextZoneActive = strNextZone;
        });
        $(".ThemMoiSinhVien").click(function () {
            me.rewrite();
            //Nếu đang hiển thị form gán thông tin thì ẩn xong mới hiển thị form thêm mới
            if (document.getElementById("zoneGanThongTin").style.display == "") {
                $("#zoneGanThongTin").hide(500);
                setTimeout(function () {
                    $("#zoneMainContent").show(500);
                }, 500);
            } else {
                $("#zoneMainContent").show(500);
            }
            var row = "";
            row += '<div class="header" style="width: 800px !important; margin-left: auto; margin-right: auto">';
            row += '<div class="row text-center" style="padding-top: 15px; font-size: 32px; color: #00c0ef !important">';
            row += 'Thêm mới hồ sơ sinh viên'
            row += '</div>';
            row += '</div>';
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            $("#zoneChiTietSinhVien").html(row);
        });
        $("#btnDongThongTin").click(function () {
            var strNextZone = "";
            switch (me.zoneActive) {
                case "": edu.system.alert("Vui lòng chọn sinh viên"); break;
                case 'zoneChuongTrinh': strNextZone = 'zoneGanLop'; break;
                case 'zoneGanLop': strNextZone = 'zoneLuuTrangThai'; break;
                case 'zoneLuuTrangThai': strNextZone = 'zoneHoanThanh'; break;
                case 'zoneHoanThanh': me.getList_HSSV(); return;
            }
            me.switchSinhVien(strNextZone, me.strSinhVien_Id);
        });
        $("#MainContent").delegate(".ganthongtin", "click", function (e) {
            e.stopImmediatePropagation();
            var strSinhVien_id = this.id;
            var strZoneId = $(this).attr('name');
            me.zoneActive = strZoneId;
            me.switchSinhVien(strZoneId, strSinhVien_id);
            me.strSinhVien_Id = strSinhVien_id;
            me.activePerson(strSinhVien_id);
        });
        me.activeEleSelect();
        $("#closeThemMoi").click(function (e) {
            e.stopImmediatePropagation();
            $("#zoneMainContent").hide(500);
        });
        $("#txtTuKhoa_Search").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HSSV();
            }
        });
        $("#btnSearch").click(function () {
            me.getList_HSSV();
        });
        var ilength = window.innerHeight - 410;
        $("#zoneDSChuongTrinh").attr("style", "height: " + ilength + "px; overflow-y: scroll;");
        $("#zoneDSLopSinhVien").attr("style", "height: " + ilength + "px; overflow-y: scroll;");
        $("#txtTuKhoa_Search_CT").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zoneDSChuongTrinh").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $("#dropHeDaoTao,#dropSearch_HeDaoTao_CT,#dropSearch_HeDaoTao_Lop").on("select2:select", function () {
            me.getList_KhoaDaoTao($(this).val());
        });
        $("#dropKhoaDaoTao,#dropSearch_KhoaDaoTao_CT,#dropSearch_KhoaDaoTao_Lop").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao($(this).val());
        });
        $("#dropSearch_ChuongTrinh_Lop").on("select2:select", function () {
            me.getList_LopQuanLy($(this).val());
        });
    },
    rewrite: function () {
        //reset id
        var me = this;
        edu.util.resetValByArrId(me.arrId);
        $(".activeSelect").each(function () {
            this.classList.remove('activeSelect');
        });
        me.strSinhVien_Id = "";
        var objpoint = $("#txtNoiSinhHS");
        objpoint.attr('tinhId', "");
        objpoint.attr('huyenId', "");
        objpoint.attr('name', "");
        var objpoint = $("#txtQueQuanHS");
        objpoint.attr('tinhId', "");
        objpoint.attr('huyenId', "");
        objpoint.attr('name', "");
        var objpoint = $("#txtHoKhauThuongTruHS");
        objpoint.attr('tinhId', "");
        objpoint.attr('huyenId', "");
        objpoint.attr('name', "");
        $("#zoneDiaDiemS").replaceWith('');
    },
    /*------------------------------------------
    --Discription: Danh mục NCS
    -------------------------------------------*/
    getDetail_HS: function (strId) {
        var me = this;
        var data = edu.util.objGetOneDataInData(strId, me.dt_HS, "ID");
        me.viewForm_HS(data);
    },
    /*Start xử lý hộp tìm kiếm chức năng*/
    getList_HSSV: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSoChuaHoanThanh/LayDanhSach',

            'strTuKhoa': edu.util.getValById('txtTuKhoa_Search'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao'),
            'strLopQuanLy_Id': edu.util.getValById('dropLopQuanLy'),
            'dChuaGanLop': document.getElementById("bGanLop").checked ? 1: 0,
            'dChuaGanChuongTrinh': document.getElementById("bGanChuongTrinh").checked ? 1 : 0,
            'dChuaGanTrangThai': document.getElementById("bGanTrangThai").checked ? 1 : 0,
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_HS = data.Data;
                    me.genTable_HSSV(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,            
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HSSV: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_HSSV",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoSoTaoMoi_Cu.getList_HSSV()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            arrClassName: ["detail_HoSo333"],
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
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        return html;
                    }
                }
                , {
                "mData": "Sua",
                    "mRender": function (nRow, aData) {
                    if (!edu.util.checkValue(aData.DAOTAO_CHUONGTRINH_ID)) return '<a name="zoneChuongTrinh" id="' + aData.ID + '" class="btn btn-warning ganthongtin"><i class="fa fa-sign-in"></i> <span class="lang" key="">1. Gán CT</span></a>';
                    if (!edu.util.checkValue(aData.LOP_ID)) return '<a name="zoneGanLop" id="' + aData.ID + '" class="btn btn-danger ganthongtin"><i class="fa fa-sign-in"></i> <span class="lang" key="">2. Gán lớp</span></a>';
                    if (!edu.util.checkValue(aData.QLSV_NGUOIHOC_TRANGTHAI_ID)) return '<a name="zoneLuuTrangThai" id="' + aData.ID + '" class="btn btn-info ganthongtin"><i class="fa fa-sign-in"></i> <span class="lang" key="">3. Trạng thái</span></a>';
                    return "";
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    save_GanLopQuanLy: function (strDaoTao_LopQuanLy_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_HoSoChuaHoanThanh/GanLopQuanLy',            

            'strId': '',
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strQLSV_TrangThaiNguoiHoc_Id': me.strTrangThaiSelected_Id,
            'strDaoTao_LopQuanLy_Id': me.strOnLopSelect,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.extend.notifyBeginLoading("Gán lớp thành công", undefined, 1500);
                    me.strLopSelected_Id = me.strOnLopSelect;
                    me.switchSinhVien(me.nextZoneActive, me.strSinhVien_Id);
                }
                else {
                    edu.system.alert(data.Message);
                }                
            },
            error: function (er) {                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genList_LopSinhVien: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<div class="col-md-4 col-sm-6 col-xs-12 eleSelected" id="' + data[i].ID +'" style="cursor: pointer">';
            row += '<div class="info-box">';
            row += '<span class="info-box-icon bg-aqua" style="background-color: #dd4b39 !important">';
            row += '<i class="fa fa-folder"></i>';
            row += '</span>';
            row += '<div class="info-box-content">';
            row += '<span class="info-box-text" style="font-weight: bold;">' + data[i].TEN + '</span>';
            row += '<span class="info-box-number"></span>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneDSLopSinhVien").html(row);
    },
    save_GanChuongTrinhHoc: function (strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_HoSoChuaHoanThanh/GanChuongTrinhHoc',            

            'strId': '',
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinhOnSelect,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.extend.notifyBeginLoading("Gán chương trình thành công", undefined, 1500);
                    me.strChuongTrinhSelected_Id = me.strChuongTrinhOnSelect;
                    me.switchSinhVien(me.nextZoneActive, me.strSinhVien_Id);
                    if (me.strChuongTrinhOnSelect != $("#dropSearch_ChuongTrinh_Lop").val()) {
                        edu.util.viewValById("dropSearch_ChuongTrinh_Lop", me.strChuongTrinhOnSelect);
                        me.getList_LopQuanLy(me.strChuongTrinhOnSelect);
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }                
            },
            error: function (er) {                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,            
            contentType: true,            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genList_ChuongTrinhDaotao: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<div class="col-md-4 col-sm-6 col-xs-12 eleSelected" id="' + data[i].ID +'" style="cursor: pointer">';
            row += '<div class="info-box">';
            row += '<span class="info-box-icon bg-aqua" style="background-color: #f39c12 !important">';
            row += '<i class="fa fa-folder-o"></i>';
            row += '</span>';
            row += '<div class="info-box-content">';
            row += '<span class="info-box-text" style="font-weight: bold;">' + data[i].TENCHUONGTRINH + '</span>';
            row += '<span class="info-box-number"></span>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneDSChuongTrinh").html(row);
    },
    save_GanTrangThaiNguoiHoc: function (strQLSV_TrangThaiNguoiHoc_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_HoSoChuaHoanThanh/GanTrangThaiNguoiHoc',            

            'strId': '',
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinhSelected_Id,
            'strDaoTao_LopQuanLy_Id': me.strLopSelected_Id,
            'strQLSV_TrangThaiNguoiHoc_Id': me.strTrangOnThaiSelect,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.extend.notifyBeginLoading("Gán trạng thái thành công", undefined, 1500);
                    me.strTrangThaiSelected_Id = me.strTrangOnThaiSelect;
                    me.switchSinhVien(me.nextZoneActive, me.strSinhVien_Id);
                }
                else {
                    edu.system.alert(data.Message);
                }                
            },
            error: function (er) {                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,            
            contentType: true,            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genList_TrangThai: function (data) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<div class="col-md-4 col-sm-6 col-xs-12 eleSelected" id="' + data[i].ID +'" style="cursor: pointer">';
            row += '<div class="info-box">';
            row += '<span class="info-box-icon bg-aqua" style="background-color: #00acd6 !important">';
            row += '<span>' + data[i].MA +'</span>';
            row += '</span>';
            row += '<div class="info-box-content">';
            row += '<span class="info-box-text" style="font-weight: bold;">' + data[i].TEN + '</span>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneDSTrangThai").html(row);
    },
    save_HS: function () {
        var me = this;
        var obj_notify = {};
        var strNoiS
        var obj_save = {
            'action': 'SV_HoSo/ThemMoi',
            
            'strHoDem': edu.util.getValById('txtHoHS'),
            'strAnh': edu.util.getValById('txtHuongDanTaiFile_HS'),
            'strTen': edu.util.getValById('txtTenHS'),
            'strMaSo': '',
            'strNgaySinh_Nam': edu.util.getValById('txtNamSinhHS'),
            'strNgaySinh_Thang': edu.util.getValById('txtThangSinhHS'),
            'strNgaySinh_Ngay': edu.util.getValById('txtNgaySinhHS'),
            'strBiDanh': edu.util.getValById('txtBiDanhHS'),
            'strTenGoiKhac': edu.util.getValById('txtBiDanhHS'),
            'strGioiTinh_Id': edu.util.getValById('dropGioiTinhHS'),
            'strNoiSinh_TinhThanh_Id': edu.util.returnEmpty($("#txtNoiSinhHS").attr("tinhid")),
            'strNoiSinh_QuanHuyen_Id': edu.util.returnEmpty($("#txtNoiSinhHS").attr("huyenid")),
            'strNoiSinh_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtNoiSinhHS").attr("name")),
            'strQueQuan_TinhThanh_Id': edu.util.returnEmpty($("#txtQueQuanHS").attr("tinhid")),
            'strQueQuan_QuanHuyen_Id': edu.util.returnEmpty($("#txtQueQuanHS").attr("huyenid")),
            'strQueQuan_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtQueQuanHS").attr("name")),
            'strDanToc_Id': edu.util.getValById('dropDanTocHS'),
            'strTonGiao_Id': edu.util.getValById('dropTonGiaoHS'),
            'strNoiOHienNay': edu.util.getValById('txtNoiOHienNayHS'),
            'strDangDoan_NgayChinhThuc': edu.util.getValById('txtNgayChinhThuc'),
            'strNganHang_SoTaiKhoan': edu.util.getValById('txtSoTaiKhoanHS'),
            'strNganHang_ThuocNganHang_Id': edu.util.getValById('dropNganHangHS'),
            'strNganHang_ThongTinChiNhanh': edu.util.getValById('txtChiNhanhHS'),
            'strHoKhau_TinhThanh_Id': edu.util.returnEmpty($("#txtHoKhauThuongTruHS").attr("tinhid")),
            'strHoKhau_QuanHuyen_Id': edu.util.returnEmpty($("#txtHoKhauThuongTruHS").attr("huyenid")),
            'strHoKhau_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtHoKhauThuongTruHS").attr("name")),
            'strQuocTich_Id': edu.util.getValById('dropQuocTichHS'),
            'strDoiTuongDaoTao_Id': edu.util.getValById('dropDoiTuongDaoTao'),
            'strTtll_DienThoaiCaNhan': edu.util.getValById('txtSoDienThoaiCaNhanHS'),
            'strTtll_DienThoaiGiaDinh': edu.util.getValById('txtDienThoaiGiaDinhHS'),
            'strTtll_DienThoaiCoQuan': edu.util.getValById('txtDienThoaiCoQuanHS'),
            'strTtll_EmailCaNhan': edu.util.getValById('txtEmailCaNhanHS'),
            'strTtll_KhiCanBaoTinChoAi': edu.util.getValById('txtBaoTinHS'),
            'strCmtnd_So': edu.util.getValById('txtSoCMTND'),
            'strSoHoChieu': edu.util.getValById('txtSoHoChieu'),
            'strId': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") obj_save.action = 'SV_HoSo/CapNhat';
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        me.getList_HSSV();
                        edu.util.confirm("Lưu thành công. Bạn có muốn gán lớp không?");
                        $("#btnYes").click(function () {
                            $('#myModalAlert').modal('hide');
                            me.switchSinhVien('zoneGanLop', data.Message);
                        });
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
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    viewForm_HS: function (data) {
        var me = this;
        //Active sinh viên
        $("#lbHoTenGanThongTin").html(edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN));
        $("#lbMaSo").html(edu.util.checkEmpty(data.MASO));
        $("#lbNgaySinh").html(edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM));
        var row = "";
        row += '<div class="header" style="width: 800px !important; margin-left: auto; margin-right: auto">';
        row += '<div class="row text-center" style="padding-top: 15px; font-size: 32px; color: #00c0ef !important">';
        row += 'Họ tên: ' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + ' - ' + edu.util.checkEmpty(data.MASO);
        row += 'Ngày sinh: ' + edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM);
        row += '</div>';
        row += '</div>';
        row += '<div class="row"></div>';
        row += '<div class="row"></div>';
        row += '<div class="row"></div>';
        $("#zoneChiTietSinhVien").html(row);
        //Thông tin tổng quát
        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANHCANHAN);
        var strNhanSu_ChucDanh = "";
        var strNhanSu_HoTen = edu.util.returnEmpty(data.HOTEN);
        var strNhanSu_HocHam = edu.util.returnEmpty(data.LOAICHUCDANH_MA);
        var strNhanSu_HocVi = edu.util.returnEmpty(data.LOAIHOCVI_MA);
        //2. process data
        if (strNhanSu_HocHam == "" || strNhanSu_HocHam == null || strNhanSu_HocHam == "null" || strNhanSu_HocHam == undefined) {
            strNhanSu_ChucDanh = "";
        } else {
            strNhanSu_ChucDanh = strNhanSu_HocHam + ".";
        }
        if (strNhanSu_HocVi == "" || strNhanSu_HocVi == null || strNhanSu_HocVi == "null" || strNhanSu_HocVi == undefined) {
            //nothing
        } else {
            strNhanSu_ChucDanh = strNhanSu_ChucDanh + strNhanSu_HocVi + ".";
        }
        //Thông tin đầy đủ
        edu.util.viewValById("txtHoHS", data.HODEM);
        edu.util.viewValById("txtTenHS", data.TEN);
        edu.util.viewValById("txtBiDanhHS", data.BIDANH);
        edu.util.viewValById("dropQuocTichHS", data.QUOCTICH_ID);
        edu.util.viewValById("txtNgaySinhHS", data.NGAYSINH_NGAY);
        edu.util.viewValById("txtThangSinhHS", data.NGAYSINH_THANG);
        edu.util.viewValById("txtNamSinhHS", data.NGAYSINH_NAM);
        edu.util.viewValById("dropGioiTinhHS", data.GIOITINH_ID);
        edu.util.viewValById("dropDanTocHS", data.DANTOC_ID);
        edu.util.viewValById("dropTonGiaoHS", data.TONGIAO_ID);
        edu.util.viewValById("txtEmailCaNhanHS", data.TTLL_EMAILCANHAN);
        edu.util.viewValById("txtSoDienThoaiCaNhanHS", data.TTLL_DIENTHOAICANHAN);
        edu.util.viewValById("txtDienThoaiGiaDinhHS", data.TTLL_DIENTHOAIGIADINH);
        edu.util.viewValById("txtDienThoaiCoQuanHS", data.TTLL_DIENTHOAICOQUAN);
        edu.util.viewValById("txtSoCMTND", data.CMTND_SO);
        edu.util.viewValById("txtSoHoChieu", data.HO);
        edu.util.viewValById("txtNoiSinhHS", edu.util.checkEmpty(data.NOISINH_TINHTHANH_TEN) + ", " + edu.util.checkEmpty(data.NOISINH_QUANHUYEN_TEN) + ", " + edu.util.checkEmpty(data.NOISINH_PHUONGXAKHOIXOM));
        edu.util.viewValById("txtQueQuanHS", edu.util.checkEmpty(data.QUEQUAN_TINHTHANH_TEN) + ", " + edu.util.checkEmpty(data.QUEQUAN_QUANHUYEN_TEN) + ", " + edu.util.checkEmpty(data.QUEQUAN_PHUONGXAKHOIXOM));
        edu.util.viewValById("txtHoKhauThuongTruHS", edu.util.checkEmpty(data.HOKHAU_TINHTHANH_TEN) + ", " + edu.util.checkEmpty(data.HOKHAU_QUANHUYEN_TEN) + ", " + edu.util.checkEmpty(data.HOKHAU_PHUONGXAKHOIXOM));
        edu.util.viewValById("txtNoiOHienNayHS", data.NOIOHIENNAY);
        edu.util.viewValById("txtBaoTinHS", data.TTLL_KHICANBAOTINCHOAI_ODAU);
        var objpoint = $("#txtNoiSinhHS");
        objpoint.attr('tinhId', data.NOISINH_TINHTHANH_ID);
        objpoint.attr('huyenId', data.NOISINH_QUANHUYEN_ID);
        objpoint.attr('name', data.NOISINH_PHUONGXAKHOIXOM);

        var objpoint = $("#txtQueQuanHS");
        objpoint.attr('tinhId', data.QUEQUAN_TINHTHANH_ID);
        objpoint.attr('huyenId', data.NOISINH_QUANHUYEN_ID);
        objpoint.attr('name', data.NOISINH_PHUONGXAKHOIXOM);

        var objpoint = $("#txtHoKhauThuongTruHS");
        objpoint.attr('tinhId', data.HOKHAU_TINHTHANH_ID);
        objpoint.attr('huyenId', data.HOKHAU_QUANHUYEN_ID);
        objpoint.attr('name', data.HOKHAU_PHUONGXAKHOIXOM);

        if (me.strChuongTrinhOnSelect == '' && !edu.util.checkValue(data.DAOTAO_KHOADAOTAO_ID)) {
            edu.util.viewValById("dropSearch_HeDaoTao_CT", data.DAOTAO_HEDAOTAO_ID);
            edu.util.viewValById("dropSearch_KhoaDaoTao_CT", data.DAOTAO_KHOADAOTAO_ID);
            me.getList_ChuongTrinhDaoTao(data.DAOTAO_KHOADAOTAO_ID);
        }
        if (edu.util.checkValue(data.DAOTAO_CHUONGTRINH_ID) && me.strChuongTrinhOnSelect != data.DAOTAO_CHUONGTRINH_ID) {
            edu.util.viewValById("dropSearch_HeDaoTao_Lop", data.DAOTAO_HEDAOTAO_ID);
            edu.util.viewValById("dropSearch_KhoaDaoTao_Lop", data.DAOTAO_KHOADAOTAO_ID);
            edu.util.viewValById("dropSearch_ChuongTrinh_Lop", data.DAOTAO_CHUONGTRINH_ID);
            me.getList_LopQuanLy(data.DAOTAO_CHUONGTRINH_ID);
        }       
        me.strLopSelected_Id = edu.util.checkEmpty(data.LOP_ID);
        me.strTrangThaiSelected_Id = edu.util.checkEmpty(data.QLSV_NGUOIHOC_TRANGTHAI_ID);
        me.strChuongTrinhSelected_Id = edu.util.checkEmpty(data.DAOTAO_CHUONGTRINH_ID);
    },
    activePerson: function (strSinhVien_id) {
        var me = this;
        edu.util.setOne_BgRow(strSinhVien_id, "tbldata_HSSV");
        me.getDetail_HS(strSinhVien_id);
    },
    popover_HS: function (strHS_Id, point) {
        var me = this;
        var data = me.dt_HS[strHS_Id];
        if (data == null || data == undefined) data = me.dt_HS;
        var row = "";
        row += '<div style="width: 550px">';
        row += '<div style="width: 200px; float: left">';
        row += '<img style="margin: 0 auto; display: block" src="' + edu.system.getRootPathImg(data.ANH) + '">';
        row += '</div>';
        row += '<div style="width: 330px; float: left; padding-left: 20px; margin-top: -7px">';
        row += '<p class="pcard"><i class="fa fa-credit-card-alt colorcard"></i> <span class="lang" key="">Mã</span>: 20146290</p>';
        row += '<p class="pcard"><i class="fa fa-user colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM) + '</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Khóa</span>: ' + edu.util.checkEmpty(data.Azzz) + '</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Ngành</span>: CNTT-TT</p>';
        row += '<p class="pcard"><i class="fa fa-envelope-o colorcard"></i> <span class="lang" key="">Email</span>: ' + edu.util.checkEmpty(data.TTLL_EMAILCANHAN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-phone colorcard"></i> <span class="lang" key="">Số điện thoại</span>: ' + edu.util.checkEmpty(data.TTLL_DIENTHOAICANHAN) + '</p>';
        row += '</div>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'hover',
            html: true,
            placement: 'right',
        });
        $(point).popover('show');
    },
    ganLop: function () {
        var me = this;
        var confirm = "";
        var title = "";
        var content = 'bạn có muốn thêm lớp không?';
        title = "<i class='fa fa-question-circle fa-default'> Thông báo</i>";
        confirm += '<div id="myModalAlert" class="modal fade modal-confirm" role="dialog"><div class="modal-dialog">';
        confirm += '<div class="modal-content"><div class="modal-header">';
        confirm += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
        confirm += '<h4 class="modal-title" id="lblConfirmTitle">' + title + '</h4>';
        confirm += ' </div>';
        confirm += '<div class="modal-body">';
        confirm += '<p id="lblConfirmContent">' + content + '</p>';
        confirm += '</div>';
        confirm += '<div class="modal-footer">';
        confirm += '<button type="button" class="btn btn-primary" id="btnYes"><i class="fa fa-check-circle"></i> Áp dụng</button>';
        confirm += '<button type="button" class="btn btn-default" id="btnNo" data-dismiss="modal"><i class="fa fa-times-circle"></i> Để sau</button>';
        confirm += '</div>';
        confirm += '</div>';
        $(".wrapper>#alert").html(confirm);
        $('.wrapper>#alert>#myModalAlert').modal('show');
    },
    ganChuongTrinh: function () {
        var me = this;
    },
    ganTranngThai: function () {
        var me = this;
    },
    switchSinhVien: function (strZoneId, strSinhVien_id) {
        var me = this;
        console.log(strZoneId);
        console.log(strSinhVien_id);
        //Khởi tạo lại với trường hợp ẩn do thành công hoặc chưa chọn sinh viên
        document.getElementById('zoneSinhVien').style.display = "";
        document.getElementById('btnLuu').style.display = "";
        document.getElementById('btnDongThongTin').innerHTML = ' <i class="fa fa-close"></i> <span class="lang" key="">Để sau</span>';
        //Ẩn hiện thị toàn bộ nội dung
        $(".zoneThongTin").each(function () {
            this.style.display = "none";
        });
        //Nếu không có id sinh viên hiện tại thì thông báo chưa chọn sinh viên còn không hiện thị nội dung cần thao tác
        if (strSinhVien_id == '') {
            document.getElementById('zoneChuaChonSinhVien').style.display = "";
            document.getElementById('zoneSinhVien').style.display = "none";
            document.getElementById('btnLuu').style.display = "none";
            document.getElementById('btnDongThongTin').innerHTML = ' <i class="fa fa-close"></i> <span class="lang" key="">Đóng</span>';
        }
        else {
            document.getElementById(strZoneId).style.display = "";
        }
        //Nếu hoàn thành thay đổi hiển thị
        if (strZoneId == 'zoneHoanThanh' || strZoneId == 'zoneChuaChonSinhVien') {
            document.getElementById('btnLuu').style.display = "none";
            document.getElementById('btnDongThongTin').innerHTML = ' <i class="fa fa-close"></i> <span class="lang" key="">Đóng</span>';
            me.getList_HSSV();
        }
        //Hiện thị hoặc ẩn thông tin gán lớp
        //Nếu đang hiển thị form thêm mới thì ẩn xong mới hiển thị form gán thông tin
        if (document.getElementById("zoneMainContent").style.display == "") {
            $("#zoneMainContent").hide(500);
            setTimeout(function () {
                $("#zoneGanThongTin").show(500);
            }, 500);
        } else {
            if (document.getElementById("zoneGanThongTin").style.display == "") {
                if (me.zoneActive == strZoneId && me.strSinhVien_Id == strSinhVien_id) $("#zoneGanThongTin").hide(500);
            } else {
                $("#zoneGanThongTin").show(500);
            }
        }
        me.zoneActive = strZoneId;
    },
    //Sự kiện active chọn lớp, chương trình, trạng thái
    activeEleSelect: function () {
        var me = this;
        $(document).delegate("#zoneDSLopSinhVien .eleSelected", "click", function (e) {
            var id = this;
            me.removeEleSelect();
            setTimeout(function () {
                id.classList.add('activeOnSearch');
                id.getElementsByClassName('info-box')[0].classList.add('activeOnSearch');
                id.getElementsByClassName('info-box-content')[0].classList.add('activeOnSearch');
            });
            activeEleSelectLop(id);
        });
        $(document).delegate("#zoneChuongTrinh .eleSelected", "click", function (e) {
            var id = this;
            me.removeEleSelect();
            setTimeout(function () {
                id.classList.add('activeOnSearch');
                id.getElementsByClassName('info-box')[0].classList.add('activeOnSearch');
                id.getElementsByClassName('info-box-content')[0].classList.add('activeOnSearch');
            });
            activeEleSelectChuongTrinh(id);
        });
        $(document).delegate("#zoneLuuTrangThai .eleSelected", "click", function (e) {
            var id = this;
            me.removeEleSelect();
            setTimeout(function () {
                id.classList.add('activeOnSearch');
                id.getElementsByClassName('info-box')[0].classList.add('activeOnSearch');
                id.getElementsByClassName('info-box-content')[0].classList.add('activeOnSearch');
            });
            activeEleSelectTrangThai(id);
        });
        function activeEleSelectLop(pointId) {
            me.strOnLopSelect = pointId.id;
            var strLopName = pointId.getElementsByClassName("info-box-text")[0].innerHTML;
            var row = "";
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += "<div style='font-size: 24px; font-weight: bold;'>Bạn đã chọn lớp: <span style='color: #dd4b39'>" + strLopName + "</span>. Hãy nhấn nút 'Lưu' để hoàn tất.</div>";
            $("#elementSelectLopSinhVien").html(row);
        }
        function activeEleSelectChuongTrinh(pointId) {
            me.strChuongTrinhOnSelect = pointId.id;
            var strLopName = pointId.getElementsByClassName("info-box-text")[0].innerHTML;
            var row = "";
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += "<div style='font-size: 24px; font-weight: bold;'>Bạn đã chọn chương trình: <span style='color: #f39c12'>" + strLopName + "</span>. Hãy nhấn nút 'Lưu' để hoàn tất.</div>";
            $("#elementSelectChuongTrinh").html(row);
        }
        function activeEleSelectTrangThai(pointId) {
            me.strTrangOnThaiSelect = pointId.id;
            var strLopName = pointId.getElementsByClassName("info-box-text")[0].innerHTML;
            var row = "";
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += "<div style='font-size: 24px; font-weight: bold;'>Bạn đã chọn trạng thái: <span style='color: #00c0ef'>" + strLopName + "</span>. Hãy nhấn nút 'Lưu' để hoàn tất.</div>";
            $("#elementSelectTrangThai").html(row);
        }
    },
    //Xóa bỏ trạng thái chọn đối với lớp, chương trình, trạng thái
    removeEleSelect: function () {
        var me = this;
        if (me.zoneActive != "") {
            $("#" + me.zoneActive + " .activeOnSearch").each(function () {
                this.classList.remove('activeOnSearch');
            });
        }
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
            strHeDaoTao_Id: strHeDaoTao_Id,
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
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);

    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function (strToChucCT_Id) {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: "",
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        edu.system.getList_NamNhapHoc(null, "", "", me.loadToCombo_NamNhapHoc)
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
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
            renderPlace: ["dropHeDaoTao", "dropSearch_HeDaoTao_CT", "dropSearch_HeDaoTao_Lop"],
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
            renderPlace: ["dropKhoaDaoTao", "dropSearch_KhoaDaoTao_CT", "dropSearch_KhoaDaoTao_Lop"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        main_doc.HoSoTaoMoi_Cu.genList_ChuongTrinhDaotao(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao", "dropSearch_ChuongTrinh_Lop"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropPhanViTongHop_HOCKY", "dropPhanViTongHop_NHIEUKY", "dropPhanViTongHop_DOTHOC"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
        main_doc.HoSoTaoMoi_Cu.genList_LopSinhVien(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenBo_TrangThai: function (data) {
        main_doc.HoSoTaoMoi_Cu.genList_TrangThai(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropTinhTrangSinhVien"]
        }
        edu.system.loadToCombo_data(obj);
        $('#dropTinhTrangSinhVien option').prop('selected', true);
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
            renderPlace: ["dropPhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "NAMNHAPHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropPhanViTongHop_NAMHOC"],
            type: "",
            title: "Chọn năm nhập học",
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
}