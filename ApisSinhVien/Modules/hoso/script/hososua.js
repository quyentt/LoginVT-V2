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
function ChinhSua() { };
ChinhSua.prototype = {
    dt_HS: '',
    strId: '',
    strAction_temp: '',
    arrId: [],
    ivitriSelect: -1,
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //edu.system.showOutputInGETMethod();
        /*Start xử lý hộp tìm kiếm chức năng*/
        $("#btnSearch").click(function () {
            me.getList_LoaiKhoanThu();
        });
        $("#btnRefresh").click(function () {
            me.getList_LoaiKhoanThu();
        });
        $(document).click(function () {
            me.hideSeachBox();
        });
        $("#advancedSearch").click(function (e) {
            me.hideSeachBox();
        });
        $(document).delegate("#btnEdit", "click", function () {
            me.openChinhSua();
        });
        $(document).delegate("#btnAddnew", "click", function () {
            edu.util.confirm("Bạn có chắc chắn muốn cập nhật hồ sơ?");
            $("#btnYes").click(function (e) {
                me.closeChinhSua();
                //Hàm thêm hồ sơ sẽ viết ở đây
            });

        });
        $(document).delegate("#btnClose", "click", function () {
            me.getDetail_HS(me.strId);
            setTimeout(function () {
                me.closeChinhSua();
            }, 200)
        });
        $(document).delegate("#btnRewrite", "click", function () {
            me.rewrite();
        });
        $(document).delegate("#btnTrangThai", "click", function () {
            if (icheck) {
                $("#btnTrangThai").attr("class", "btn btn-warning");
                $("#btnTrangThai i").attr("class", "fa fa-frown-o");
                $("#btnTrangThai span").html("Ngừng hoạt động");
                icheck = false;
            } else {
                $("#btnTrangThai").attr("class", "btn btn-success");
                $("#btnTrangThai i").attr("class", "fa fa-smile-o");
                $("#btnTrangThai span").html("Hoạt động");
                icheck = true;
            }
        });
        $('.dropdown-menu').on('click', function (event) {
            event.stopImmediatePropagation();
            // The event won't be propagated up to the document NODE and 
            // therefore delegated events won't be fired
            event.stopPropagation();
        });

        me.arrId = ["dropQuocTichHS", "dropGioiTinhHS", "dropDanTocHS", "dropTonGiaoHS", "dropToChucCT", "dropLopQuanLyHS", "dropTrangThaiNguoiHocHS",
            "dropChucVuSinhVien", "dropDonVuLienKetHS", "dropNganHangHS", "dropDoiTuongDaoTao", "dropThanhPhanXuatThan", "txtHoHS", "txtTenHS", "txtBiDanhHS", "txtNgaySinhHS",
            "txtThangSinhHS", "txtNamSinhHS", "txtEmailCaNhanHS", "txtSoDienThoaiCaNhanHS", "txtDienThoaiGiaDinhHS", "txtDienThoaiCoQuanHS", "txtNoiSinhHS", "txtQueQuanHS",
            "txtHoKhauThuongTruHS", "txtNoiOHienNayHS", "txtBaoTinHS", "txtSoTaiKhoanHS", "txtChiNhanhHS", "txtNgheNghiepHS", "txtKhenThuongHS", "txtKyLuatHS", "txtGhiChuHS",
            "txtSoCMTNDHS", "txtNoiCapCMTHS", "txtNgayCapCMTHS"];

        edu.system.loadToCombo_DanhMucDuLieu("QLCB.CCTC", "dropLoaiCoCau", "Chọn loại cơ cấu tổ chức");
        try {
            var url = localStorage.strRootPath;
            var strNhanSu_Id = url.substring(url.indexOf("?") + 1);
            console.log(strNhanSu_Id);
            if (strNhanSu_Id.length == 32) me.getDetail_HS(strNhanSu_Id);
        } catch (Ex) {
            edu.system.alert("Có lỗi nhé!", "w");
        }
        var icheck = true;
        document.onkeydown = keydown;
        function keydown(evt) {
            //if (!evt) evt = event;
            //if (evt.ctrlKey) {
            //    evt.preventDefault();
            //    console.log(evt.which);
            //    switch (evt.which) {
            //        case 70:
            //            $("#txtTuKhoa_Search").focus();
            //    }
            //}
        } // function keydown(evt)​
        $("#txtTuKhoa_Search").on('keypress', function (event) {
            var ikey = event.which;
            if ((ikey > 47 && ikey < 58) || (ikey > 64 && ikey < 91) || (ikey > 96 && ikey < 123)) setTimeout(function () { me.functionSearch(); }, 10);
        });

        me.actionSearch();

        $(document).delegate('.detail_HoSo298', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var selected_id = $(this).attr("name");
            me.popover_HS(selected_id, point);
        });
        //me.getDetail_HS("355E9F438DDC4AE5B7F706D0EA577DA8");
        //setTimeout(function () {
        //    me.closeChinhSua();
        //}, 200)
    },

    rewrite: function () {
        //reset id
        var me = this;
        edu.system.resetHtmlByArrId(me.arrId);
    },
    closeChinhSua: function () {
        var me = this;
        var arrIdClose = ["dropLopQuanLyHS", "dropTrangThaiNguoiHocHS", "dropToChucCT"];
        var strAction_temp = '<div style="text-align: center; width: 150px; padding-left: 50px; margin-top: 240px">';
        strAction_temp += '<a id="btnEdit" style="width: 100%" class="btn btn-danger"><i class="fa fa-edit"></i> <span class="lang" key="">Chỉnh sửa</span></a>';
        strAction_temp += '<div class="clear"></div>';
        strAction_temp += '<a id="btnTrangThai" style="width: 100%" class="btn btn-success"><i class="fa fa-smile-o"></i> <span class="lang" key="">Hoạt động</span></a>';
        strAction_temp += '<div class="clear"></div>';
        strAction_temp += '<a id="btnSave" style="width: 100%" class="btn btn-info"><i class="fa fa-cloud-download"></i> <span class="lang" key="">In hồ sơ</span></a>';
        strAction_temp += '</div>';
        //$("#zoneAction").html(strAction_temp);
        for (var i = 0; i < arrIdClose.length; i++) {
            var strid = arrIdClose[i];
            if (strid.indexOf("drop") != -1) {
                var point = $('#' + strid);
                var name = $("#" + strid + " option:selected").text();
                if (point.val() == "") name = "";
                point.parent().html('<label class="form-control not-write" id="' + strid + '">' + name + '</label>');
            }
            else {
                var point = $('#' + strid);
                var name = point.val();
                if (strid == "txtNoiSinhHS" || strid == "txtQueQuanHS" || strid == "txtHoKhauThuongTruHS") {
                    point.parent().html('<label class="form-control not-write" id="' + strid + '">' + name + '</label>');
                    continue;
                }
                point.replaceWith('<label class="form-control not-write" id="' + strid + '">' + name + '</label>');
            }
        }
    },
    openChinhSua: function () {
        var me = this;
        var strAction_temp = '<div style="text-align: center; width: 150px; padding-left: 50px; margin-top: 240px">';
        strAction_temp += '<a id="btnAddnew" style="width: 100%" class="btn btn-primary"><i class="fa fa-plus"></i> <span class="lang" key="">Cập nhật</span></a>';
        strAction_temp += '<div class="clear"></div>';
        strAction_temp += '<a id="btnRewrite" style="width: 100%" class="btn btn-default"><i class="fa fa-refresh"></i> <span class="lang" key="">Viết lại</span></a>';
        strAction_temp += '<div class="clear"></div>';
        strAction_temp += '<a id="btnClose" style="width: 100%" class="btn btn-default"><i class="fa fa-close"></i> <span class="lang" key="">Đóng</span></a>';
        strAction_temp += '</div>';
        $("#zoneAction").html(strAction_temp);
        for (var i = 0; i < me.arrId.length; i++) {
            var strid = me.arrId[i];
            if (strid.indexOf("drop") != -1) {
                $('#' + strid).removeAttr('disabled');
            }
            else {
                var point = $('#' + strid);
                var name = point.html();
                point.replaceWith('<input class="form-control" type="text" id="' + strid + '" value="'+ name +'">');
            }
        }
    },
    /*------------------------------------------
    --Discription: Danh mục NCS
    -------------------------------------------*/
    getDetail_HS: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'SV_HoSoSinhVien/LayChiTiet',
            
            'strId': strId
        }

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_HS = json[0];
                        me.viewForm_HS(json[0]);
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
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    /*Start xử lý hộp tìm kiếm chức năng*/
    functionSearch: function () {
        var me = this;
        var strTuKhoa = $("#txtTuKhoa_Search").val();
        $("#advancedSearch").attr("aria-expanded", "false");
        $("#Search_Advance")[0].classList.remove("open");
        /*Display a Div search*/
        if (strTuKhoa == "" || strTuKhoa == null || strTuKhoa == undefined) {
            $("#search-result").hide();
            return false;
        } else {
            $("#search-result").show();
        }
        var currentRequest = $.ajax({
            beforeSend: function () {
                if (currentRequest != null) {
                    currentRequest.abort();
                }
            },
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    var mlen = json.length;
                    $("#tblSearch tbody").html("");
                    for (var i = 0; i < mlen; i++) {
                        me.genPerson(json[i], i);
                    }
                    me.dt_HS = json;
                    me.ivitriSelect = -1;
                }
            },
            type: 'GET',
            url: edu.system.apiUrlTemp + 'v1.0/CM_NhanSu/LayDanhSach_RutGon',
            cache: false,
            data: {
                'strTuKhoa': strTuKhoa,
                'pageIndex': 1,
                'pageSize': 10,
                'strLoaiCoCauToChuc_Id': "",
                'strChung_DonVi_Id': "",
                'strLoaiDoiTuong_Ma': ""
            },
        });
    },
    hideSeachBox: function () {
        var me = this;
        $("#txtTuKhoa_Search").val("");
        me.functionSearch("");
    },
    changeInfo_HS: function (strId) {
        var me = this;
        me.hideSeachBox();
        me.getDetail_HS(strId);
    },
    actionSearch: function () {
        var me = this;
        //
        $(document).delegate("#txtTuKhoa_Search", "keypress", function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var strId = $("#tblSearch .activeOnSearch")[0].id;
                me.changeInfo_HS(strId);
            }
        });
        //$(document).delegate("#tblSearch tbody tr td", "hover", function (e) {
        //    $(this).css("background-color", "#f1f1f1");
        //}, function () {
        //    $(this).css("background-color", "#fff");
        //});

        $(document).delegate("#txtTuKhoa_Search", "keyup", function (event) {
            var ikey = event.which;
            if (ikey < 37 || ikey > 40) return;
            var ilength = me.dt_HS.length;
            var x = $("#tblSearch tbody tr td");
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("activeOnSearch");
            }
            if (ikey == 38 || ikey == 37) {
                me.ivitriSelect--;
            }
            if (ikey == 39 || ikey == 40) {
                me.ivitriSelect++;
            }
            if (me.ivitriSelect >= ilength) me.ivitriSelect = 0;
            if (me.ivitriSelect <= -1) me.ivitriSelect = ilength - 1;
            if (me.ivitriSelect == -1) return;
            x[me.ivitriSelect].classList.add("activeOnSearch");
        });
    },
    save_HS: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_HoSoSinhVien/ThemMoi',
            
            'strHoDem': edu.util.getValById('txtHoHS'),
            'strAnh': edu.util.getValById('txtTenHS'),
            'strTen': edu.util.getValById('txtHo'),
            'strMaSo': edu.util.getValById('txtHo'),
            'strNgaySinh_Nam': edu.util.getValById('txtNamSinhHS'),
            'strNgaySinh_Thang': edu.util.getValById('txtThangSinhHS'),
            'strNgaySinh_Ngay': edu.util.getValById('txtNgaySinhHS'),
            'strBiDanh': edu.util.getValById('txtBiDanhHS'),
            'strTenGoiKhac': edu.util.getValById('txtBiDanhHS'),
            'strGioiTinh_Id': edu.util.getValById('dropGioiTinhHS'),
            'strNoiSinh_TinhThanh_Id': edu.util.getValById('txtHo'),
            'strNoiSinh_QuanHuyen_Id': edu.util.getValById('txtHo'),
            'strNoiSinh_PhuongXaKhoiXom': edu.util.getValById('txtHo'),
            'strQueQuan_TinhThanh_Id': edu.util.getValById('txtHo'),
            'strQueQuan_QuanHuyen_Id': edu.util.getValById('txtHo'),
            'strQueQuan_PhuongXaKhoiXom': edu.util.getValById('txtHo'),
            'strDanToc_Id': edu.util.getValById('dropDanTocHS'),
            'strTonGiao_Id': edu.util.getValById('dropTonGiaoHS'),
            'strCmtnd_So': edu.util.getValById('txtSoCMTNDHS'),
            'strCmtnd_NgayCap': edu.util.getValById('txtNgayCapCMTHS'),
            'strCmtnd_NoiCap': edu.util.getValById('txtNoiCapCMTHS'),
            'strNoiOHienNay': edu.util.getValById('txtNoiOHienNayHS'),
            'strNgayVaoTruong': edu.util.getValById('txtNgayVaoTruongHS'),
            'strDangDoan_NgayVaoDoan': edu.util.getValById('txtHo'),
            'strDangDoan_NgayVaoDang': edu.util.getValById('txtNgayVaoDang'),
            'strDangDoan_NgayChinhThuc': edu.util.getValById('txtNgayChinhThuc'),
            'strNganHang_SoTaiKhoan': edu.util.getValById('txtSoTaiKhoanHS'),
            'strNganHang_ThuocNganHang_Id': edu.util.getValById('dropNganHangHS'),
            'strNganHang_ThongTinChiNhanh': edu.util.getValById('txtChiNhanhHS'),
            'strHoKhau_TinhThanh_Id': edu.util.getValById('txtHo'),
            'strHoKhau_QuanHuyen_Id': edu.util.getValById('txtHo'),
            'strHoKhau_PhuongXaKhoiXom': edu.util.getValById('txtHo'),
            'strQuocTich_Id': edu.util.getValById('dropQuocTichHS'),
            'strSoHoChieu': edu.util.getValById('txtHo'),
            'strThanhPhanGiaDinh_Id': edu.util.getValById('dropThanhPhanXuatThan'),
            'strDoiTuongDaoTao_Id': edu.util.getValById('dropDoiTuongDaoTao'),
            'strTtll_DienThoaiCaNhan': edu.util.getValById('txtSoDienThoaiCaNhanHS'),
            'strTtll_DienThoaiGiaDinh': edu.util.getValById('txtDienThoaiGiaDinhHS'),
            'strTtll_DienThoaiCoQuan': edu.util.getValById('txtDienThoaiCoQuanHS'),
            'strTtll_EmailCaNhan': edu.util.getValById('txtEmailCaNhanHS'),
            'strTtll_KhiCanBaoTinChoAi': edu.util.getValById('txtBaoTinHS'),
            'strNgayRaTruong': edu.util.getValById('txtNgayRaTruongHS'),
            'strThongTinTruoc_NgheNghiep': edu.util.getValById('txtNgheNghiepHS'),
            'strThongTinTruoc_KhenThuong': edu.util.getValById('txtKhenThuongHS'),
            'strThongTinTruoc_KyLuat': edu.util.getValById('txtKyLuatHS'),
            'strThongTinTruoc_GhiChu': edu.util.getValById('txtGhiChuHS'),
            'strDAOTAO_LopQuanLy_Id': edu.util.getValById('txtHo'),
            'strDAOTAO_ToChucCT_Id': edu.util.getValById('txtHo'),
            'strQLSV_TrangThaiNguoiHoc_Id': edu.util.getValById('txtHo'),
            'strChucVuSinhVien_Id': edu.util.getValById('dropChucVuSinhVien'),
            'strDonViLienKetDaoTao_Id': edu.util.getValById('txtHo'),
            'strId': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_QD();
                    me.input_QD.strId = data.Message;
                    me.save_QDNS();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
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
        me.activePerson(data);
        //Thông tin tổng quát
        var strNhanSu_Avatar = edu.util.getRootPathImg(edu.util.returnEmpty(data.ANHCANHAN), constant.ModuleSetting.EnumImageType.ACCOUNT);
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
        $("#txtHoTenMS").html(strNhanSu_ChucDanh + " " + strNhanSu_HoTen + " - " + data.MACANBO);
        $("#txtNoiLamViec").html(data.COQUANTIEPNHANLAMVIEC_TEN);
        $("#txtCongViec").html(data.CONGVIECDUOCGIAO);
        $("#txtEmail").html(data.DIACHIEMAIL);
        $("#txtSDT").html(data.SODIENTHOAIDIDONG);
        $("#txtChucVu").html(data.CHUCVUCHINHQUYENKIEMNHIEM_TEN);
        $("#txtDonVi").html(data.COQUANTIEPNHANLAMVIEC_TEN);
        //Thông tin đầy đủ
        edu.system.viewHtmlById("txtThongTinDinhKem", data.AAAA);
        edu.system.viewHtmlById("txtHoHS", data.HO);
        edu.system.viewHtmlById("txtTenHS", data.TEN);
        edu.system.viewHtmlById("txtMaSinhVienHS", data.MACANBO);
        edu.system.viewHtmlById("txtEmailCaNhanHS", data.DIACHIEMAIL);
        edu.system.viewHtmlById("txtSoDienThoaiCaNhanHS", data.SODIENTHOAIDIDONG);
        edu.system.viewHtmlById("txtNgaySinhHS", data.NGAYSINH);
        edu.util.viewValById("dropGioiTinhHS", data.GIOITINH_ID);
        edu.util.viewValById("dropDoiTuongUuTienHS", data.LAHOCVIEN_DOITUONG_ID);
        edu.util.viewValById("dropDanTocHS", data.DANTOC_ID);
        edu.util.viewValById("dropTonGiaoHS", data.TONGIAO_ID);
        edu.util.viewValById("dropQuocTichHS", data.QUOCTICH_ID);
        edu.util.viewValById("dropSV_HoanCanhXuatThanHS", data.THANHPHANGIADINH_ID);
        edu.system.viewHtmlById("txtSoCMTNDHS", data.SOCMTND);
        edu.system.viewHtmlById("txtQueQuanHS", data.QUEQUAN_PHUONGXA_TEN + ", " + data.QUEQUAN_QUANHUYEN_TEN + ", " + data.QUEQUAN_TINHTHANH_TEN);
        edu.system.viewHtmlById("txtHoKhauThuongTruHS", data.HOKHAUTT_PHUONGXA_TEN + ", " + data.HOKHAUTT_QUANHUYEN_TEN + ", " + data.HOKHAUTT_TINHTHANH_TEN);
        edu.system.viewHtmlById("txtNoiOHienNayHS", data.NOIOHIENNAY_PHUONGXA_TEN + ", " + data.NOIOHIENNAY_QUANHUYEN_TEN + ", " + data.NOIOHIENNAY_TINHTHANH_TEN);
        edu.system.viewHtmlById("txtDiaChiLamViecHS", data.DIACHILIENLAC);
        edu.system.viewHtmlById("txtNgayHopDongHS", data.NGAYHOPDONG);
        edu.system.viewHtmlById("txtNgayVeCoQuanHS", data.NGAYVECOQUAN);
        edu.system.viewHtmlById("txtCongViecDuocGiaoHS", data.CONGVIECDUOCGIAO);
        edu.system.viewHtmlById("txtNgoaiNguKhacHS", data.NGOAINGUKHAC);
        edu.system.viewHtmlById("txtDiemNNKhacHS", data.DIEMTRINHDONGOAINGU);
        edu.system.viewHtmlById("txtNamPhongChucDanhHS", data.NAMPHONGCHUCDANH);
        edu.system.viewHtmlById("txtNoiPhongChucDanhHS", data.NOIPHONGCHUCDANH);
        edu.system.viewHtmlById("txtNamNhanHocViHS", data.NAMNHANHOCVI);
        edu.system.viewHtmlById("txtNoiNhanHocViHS", data.NOINHANHOCVI);
        edu.system.viewHtmlById("txtNamTotNghiepHS", data.NAMTOTNGHIEP);
        edu.system.viewHtmlById("txtDangTheoHocHS", data.DANGTHEOHOC);
        edu.system.viewHtmlById("txtHocHetLopHS", data.HOCHETLOP);
        edu.system.viewHtmlById("txtHeHS", data.HE);
        edu.system.viewHtmlById("txtNgayVaoNganhHS", data.NGAYVAONGANHGIAODUC);
        edu.system.viewHtmlById("txtNgayVaoDangHS", data.NGAYVAODANGCONGSANVN);
        edu.system.viewHtmlById("txtNgayChinhThucHS", data.NGAYCHINHTHUCVAODANGCSVN);
        edu.system.viewHtmlById("txtChucVuDangHS", data.CHUCVUDANG);
        edu.system.viewHtmlById("txtNgayVaoDoanHS", data.DOANTNCSHCM);
        edu.system.viewHtmlById("dropChucVuDoanHS", data.CHUCVUDOANTHE_ID);
        edu.system.viewHtmlById("txtNgayNhapNguHS", data.NGAYNHAPNGU);
        edu.system.viewHtmlById("txtNgayXuatNguHS", data.NGAYXUATNGU);
        edu.system.viewHtmlById("txtQuanHamCaoNhatHS", data.QUANHAMCAONHAT);
        edu.system.viewHtmlById("txtTenGoiKhacHS", data.HOTEN1);
        edu.system.viewHtmlById("txtNoiCapCMTHS", data.NOICAPCMTND);
        edu.system.viewHtmlById("txtNgayCapCMTHS", data.NGAYCAPCMTND);
        edu.system.viewHtmlById("txtSoHoChieuHS", data.SOHOCHIEUCANHAN);
        edu.system.viewHtmlById("txtDienThoaiCoQuanHS", data.SODIENTHOAICOQUAN);
        edu.system.viewHtmlById("txtDienThoaiNhaRiengHS", data.SODIENTHOAINHARIENG);
        edu.system.viewHtmlById("txtNgayBatDauBHXHHS", data.NGAYBATDAUDONGBHXH);
        edu.system.viewHtmlById("txtSoThangDaDongHS", data.SOTHANGDADONGBHXH);
        edu.system.viewHtmlById("txtNgayThamGiaTCCTXHHS", data.NGAYTHAMGIATCCTXH);
        edu.system.viewHtmlById("txtSucKhoeHS", data.TINHTRANGSUCKHOE);
        edu.system.viewHtmlById("txtThuongBinhHangHS", data.THUONGBINHHANG);
        edu.system.viewHtmlById("txtChieuCaoHS", data.CHIEUCAO);
        edu.system.viewHtmlById("txtCanNangHS", data.CANNANG);
        edu.system.viewHtmlById("txtGiaDinhChinhSachHS", data.GIADINHCHINHSACH);
        edu.system.viewHtmlById("dropLoaiCoCauHS", data.DAOTAO_COCAUTOCHUC_ID);
        edu.system.viewHtmlById("dropDoiTuongHS", data.LOAIDOITUONG_ID);
        edu.system.viewHtmlById("dropLoaiCanBoHS", data.LOAICANBO_ID);
        edu.system.viewHtmlById("dropGioiTinhHS", data.GIOITINH);
        edu.system.viewHtmlById("dropChucVuHS", data.CHUCVU);
        edu.system.viewHtmlById("dropChuyenMonHS", data.TRINHDOCHUYENMONCAONHAT_ID);
        edu.system.viewHtmlById("dropNgoaiNguHS", data.TRINHDONGOAINGU_ID);
        edu.system.viewHtmlById("dropTinHocHS", data.TRINHDOTINHOC_ID);
        edu.system.viewHtmlById("dropChucDanhHS", data.LOAICHUCDANH_ID);
        edu.system.viewHtmlById("dropHocViHS", data.LOAIHOCVI_ID);
        edu.system.viewHtmlById("dropDoiTuongHS", data.LOAIDOITUONG_ID);
        edu.system.viewHtmlById("dropChuyenNganhHocViHS", data.CHUYENNGANHHOCVI_ID);
        edu.system.viewHtmlById("dropLoaiTotNghiepHS", data.LOAITOTNGHIEP_IDR);
        edu.system.viewHtmlById("dropChuyenNganhDaoTaoHS", data.CHUYENNGANHDAOTAO_ID);
        edu.system.viewHtmlById("dropNoiDaoTaoHS", data.NOIDAOTAO_ID);
        edu.system.viewHtmlById("dropHinhThucDaoTaoHS", data.DAOTAO_LOAICOCAUTOCHUC_ID);
        edu.system.viewHtmlById("dropChucVuKiemNhiemHS", data.CHUCVUCHINHQUYENKIEMNHIEM_ID);
        edu.system.viewHtmlById("dropChucVuCaoNhatHS", data.CHUCVUCHINHQUYENCAONHAT_ID);
        edu.system.viewHtmlById("dropLyLuanChinhTriHS", data.TRINHDOLYLUANCHINHTRI_ID);
        edu.system.viewHtmlById("dropQuanLyGiaoDucHS", data.TRINHDOQUANLYGIAODUC_ID);
        edu.system.viewHtmlById("dropQuanLyNhaNuocHS", data.TRINHDOQUANLYNHANUOC_ID);
        edu.system.viewHtmlById("dropDanhHieuHS", data.DANHHIEUDUOCPHONGCAONHAT_ID);
        edu.system.viewHtmlById("dropDanTocHS", data.DANTOC_IDR);
        edu.system.viewHtmlById("dropTonGiaoHS", data.TONGIAO_IDR);
        edu.system.viewHtmlById("txtQuocTichHS", data.QUOCTICH_IDR);
        edu.system.viewHtmlById("dropHonNhanHS", data.TINHTRANGHONNHAN);
        edu.system.viewHtmlById("dropNhomMauHS", data.NHOMMAU);
        edu.system.viewHtmlById("dropTPXuatThanHS", data.THANHPHANXUATTHAN_IDR);
        edu.system.viewHtmlById("dropUuTienHS", data.GIADINHTHUOCDIENUUTIEN_IDR);
        edu.system.viewHtmlById("txtTuNhanXetHS", data.TUNHANXETBANTHAN);
        me.strId = data.ID
    },
    activePerson: function (data) {
        var me = this;
        var id = data.ID;
        var point = $("#tblSearch tbody tr td[id=" + id + "]")[0];
        if (point == null || point == undefined) {
            me.genPerson(data);
        }
        $("#tblSearch tbody tr td").attr("class", "");
        setTimeout(function () {
            $("#tblSearch tbody tr td[id=" + id + "]")[0].classList.add("activeSelect");
        }, 100);
        
    },
    genPerson: function(data, nRow){
        var me = this;
        var strNhanSu_Avatar = edu.util.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.ModuleSetting.EnumImageType.ACCOUNT);

        var html = '<span id="sl_hoten' + data.ID + '">' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + '</span><br />';
        html += '<span id="sl_ma' + data.ID + '">' + edu.util.checkEmpty(data.MASO) + '</span>';

        var hienthi = '<span style="padding-right: 5px !important; float: left"><img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + data.ID + '" /></span>';
        hienthi += html;
        $("#tblSearch tbody").append('<tr class="detail_HoSo298" name="' + nRow + '"><td id="' + data.ID + '" onclick="main_doc.ChinhSua.changeInfo_HS(\'' + data.ID + '\')"><a >' + hienthi + '</a></td></tr>');
    },

    popover_HS: function (strHS_Id, point) {
        var me = this;
        var data = me.dt_HS[strHS_Id];
        if (data == null || data == undefined) data = me.dt_HS;
        var row = "";
        row += '<div style="width: 550px">';
        row += '<div style="width: 200px; float: left">';
        row += '<img style="margin: 0 auto; display: block" src="' + edu.system.rootPath + '/Upload/Avatar/no-avatar.png">';
        row += '</div>';
        row += '<div style="width: 330px; float: left; padding-left: 20px; margin-top: -7px">';
        row += '<p class="pcard"><i class="fa fa-credit-card-alt colorcard"></i> <span class="lang" key="">Mã</span>: 20146290</p>';
        row += '<p class="pcard"><i class="fa fa-user colorcard"></i> <span class="lang" key="">Tên</span>: ' + data.HOTEN + '</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Khóa</span>: K59</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Ngành</span>: CNTT-TT</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Lớp</span>: CN-CNTT 01</p>';
        row += '<p class="pcard"><i class="fa fa-envelope-o colorcard"></i> <span class="lang" key="">Email</span>: ' + data.DIACHIEMAIL + '</p>';
        row += '<p class="pcard"><i class="fa fa-phone colorcard"></i> <span class="lang" key="">Số điện thoại</span>: ' + data.SODIENTHOAIDIDONG + '</p>';
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
        
    }
}