function NhanSuNgoaiTruong() { };
NhanSuNgoaiTruong.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    arrValid_HS: [],
    dtNhanSu: [],
    strNhanSu_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMCV, "dropNS_ChucVu");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMHV, "dropNS_HocVi");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.CNDT", "dropNS_ChuyenNganhTienSi");
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.DMHH", "dropNS_HocHam");
        $("#zoneNhanSuNgoaiTruong_Action").delegate('#btnKhoiTao_Save', 'click', function () {
            var valid = edu.util.validInputForm(me.arrValid_HS);
            if (valid) {
                me.save_NhanSu_NgoaiTruong();
            }
        });
        $("#zoneNhanSuNgoaiTruong_Action").delegate('#btnKhoiTao_Rewrite', 'click', function () {
            me.rewrite();
        });
        $("#zoneNhanSuNgoaiTruong_Action").delegate('#btnKhoiTao_Update', 'click', function () {
            var valid = edu.util.validInputForm(me.arrValid_HS);
            if (valid) {
                me.save_NhanSu_NgoaiTruong();
            }
        });
        $("#zoneNhanSuNgoaiTruong_Action").delegate('#btnKhoiTao_Delete', 'click', function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_HS();
            });
        });
        $("#zoneNhanSuNgoaiTruong_Action").delegate('#btnKhoiTao_Addnew', 'click', function () {
            me.rewrite();
            edu.util.viewHTMLById("lblForm_KhoiTao_HS", '<i class="fa fa-plus-square"></i> Khởi tạo');
            me.action_addnew();
            edu.util.setOne_BgRow("xx", "tblNhanSuNgoaiTruong");
        });
        $("#tblNhanSuNgoaiTruong").delegate('.btnDetail', 'click', function (e) {
            me.rewrite();
            me.action_update();
            var strId = this.id;
            edu.util.viewHTMLById("lblForm_KhoiTao_HS", '<i class="fa fa-pencil"></i> Chỉnh sửa');
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblNhanSuNgoaiTruong");
            me.getDetail_HS(me.strNhanSu_Id);
            $("#zoneEdit").slideDown();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_KhoiTao_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS("", edu.util.getValById("txtSearch_KhoiTao_TuKhoa"), edu.util.getValById("dropSearch_KhoiTao_CCTC"), edu.util.getValById("dropSearch_KhoiTao_BoMon"));
            }
        });
        $("#btnSearchKhoiTao_NhanSu").click(function () {
            me.getList_HS();
        });
        $("#dropSearch_KhoiTao_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
            me.getList_HS();
        });
        $("#dropSearch_KhoiTao_BoMon").on("select2:select", function () {
            me.getList_HS();
        });
    },
    page_load: function () {
        var me=this;
        edu.util.focus("txtSearch_KhoiTao_TuKhoa");
        me.arrValid_HS = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtNS_Ten", "THONGTIN1": "EM" },
            { "MA": "txtNS_MaSo", "THONGTIN1": "EM" }
        ];
        me.action_addnew();
        edu.system.page_load();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropNS_GioiTinh");
    },
    rewrite: function () {
        var me=this;
        me.strNhanSu_Id = "";
        var arrId = ["txtNS_HoTen", "txtNS_Ten", "txtNS_MaSo", "dropNS_GioiTinh", "txtNS_Email", "txtNS_DienThoaiCaNhan", "txtNS_DiaChi",
            "dropNS_HocHam", "dropNS_HocVi", "dropNS_ChucVu", "dropNS_ChuyenNganhTienSi", "txtNS_LinhVuc", "txtNS_DonViCongTac", "txtNS_NgaySinh", "txtNS_ThangSinh", "txtNS_NamSinh"];
        edu.util.viewValById("txtNS_MaSoThue", "");
        edu.util.viewValById("txtNS_CMT", "");
        edu.util.resetValByArrId(arrId);
    },
    action_addnew: function () {
        var html = '';
        html += '<a id="btnKhoiTao_Rewrite" class="btn btn-default" style="margin:3px"><i class="fa fa-refresh"></i><span class="lang" key=""> Viết lại</span></a>';
        html += '<a id="btnKhoiTao_Save" class="btn btn-success" style="margin:3px"><i class="fa fa-save"></i><span class="lang" key=""> Lưu</span></a>';
        $("#zoneNhanSuNgoaiTruong_Action").html(html);
    },
    action_update: function () {
        var html = '';
        html += '<a id="btnKhoiTao_Delete" class="btn btn-default" style="margin:3px"><i class="fa fa-trash"></i><span class="lang" key=""> Xóa</span></a>';
        html += '<a id="btnKhoiTao_Addnew" class="btn btn-default" style="margin:3px"><i class="fa fa-plus"></i><span class="lang" key=""> Tạo mới</span></a>';
        html += '<a id="btnKhoiTao_Update" class="btn btn-warning" style="margin:3px"><i class="fa fa-save"></i><span class="lang" key=""> Cập nhật</span></a>';
        $("#zoneNhanSuNgoaiTruong_Action").html(html);
    },
    save_NhanSu_NgoaiTruong: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSo_NgoaiV2/ThemMoi',

            'strId': me.strNhanSu_Id,
            'strMaSo': edu.util.getValById("txtNS_MaSo"),
            'strHoDem': edu.util.getValById("txtNS_HoTen"),
            'strTen': edu.util.getValById("txtNS_Ten"),
            'strTenGoiKhac': "",
            'strNgaySinh': edu.util.getValById("txtNS_NgaySinh"),
            'strThangSinh': edu.util.getValById("txtNS_ThangSinh"),
            'strNamSinh': edu.util.getValById("txtNS_NamSinh"),
            'strGioiTinh_Id': edu.util.getValById("dropNS_GioiTinh"),
            'strNoiSinh_Xa_Id': "",
            'strNoiSinh_Huyen_Id': "",
            'strNoiSinh_Tinh_Id': "",
            'strQueQuan_Xa_Id': "",
            'strQueQuan_Huyen_Id': "",
            'strQueQuan_Tinh_Id': "",
            'strHKTT_DiaChi': "",
            'strHKTT_Xa_Id': "",
            'strHKTT_Huyen_Id': "",
            'strHKTT_Tinh_Id': "",
            'strNOHN_DiaChi': "",
            'strNOHN_Xa_Id': "",
            'strNOHN_Huyen_Id': "",
            'strNOHN_Tinh_Id': "",
            'strQuocTich_Id': "",
            'strDanToc_Id': "",
            'strTonGiao_Id': "",
            'strTDPT_TotNghiepLop': "",
            'strTDPT_He': "",
            'strSoTruongCongTac': "",
            'strThuongBinhHang_Id': "",
            'strGiaDinhChinhSach_Id': "",
            'strThanhPhanXuatThan_Id': "",
            'strDang_NgayVao': "",
            'strDang_NgayChinhThuc': "",
            'strDang_NoiKetNap': "",
            'strDoan_NgayVao': "",
            'strDoan_NoiKetNap': "",
            'strCongDoan_NgayVao': "",
            'strNgu_NgayNhap': "",
            'strNgu_NgayXuat': "",
            'strNgu_QuanHam_Id': "",
            'strCanCuoc_So': edu.util.getValById("txtNS_CMT"),
            'strCanCuoc_NgayCap': "",
            'strCanCuoc_NoiCap': "",
            'strNhanXet': "",
            'strEmail': edu.util.getValById("txtNS_Email"),
            'strAnh': "",
            'strSDT_CaNhan': edu.util.getValById("txtNS_DienThoaiCaNhan"),
            'strSDT_CoQuan': "",
            'strSDT_GiaDinh': "",
            'strNgayTGCachMang': "",
            'strNgayTGToChucChinhTriXH': "",
            'strDaoTao_CoCauToChuc_Id': "",
            'strSoBaoHiem': "",
            'strLoaiDoiTuong_Id': "",
            'strLoaiGiangVien_Id': "",
            'strTinhTrangNhanSu_Id': "",
            'strTinhTrangHonNhan_Id': "",
            'strTuNhanXetBanThan': "",
            'strTDPT_XepLoaiTotNghiep_Id': "",
            'strQueQuan_DiaChi': "",
            'strNoiSinh_DiaChi': edu.util.getValById("txtNS_DiaChi"),
            'strLaCanBoNgoaiTruong': 1,
            'strMaSoThue': edu.util.getValById('txtNS_MaSoThue'),
            'strDienThoai': edu.util.getValById('txtNS_DienThoaiCaNhan'),
            'strDiaChi': edu.util.getValById('txtNS_DiaChi'),
            'strHocHam_Id': edu.util.getValById('dropNS_HocHam'),
            'strHocVi_Id': edu.util.getValById('dropNS_HocVi'),
            'strChucVu_Id': edu.util.getValById('dropNS_ChucVu'),
            'strChuyenNganhTienSi_Id': edu.util.getValById('dropNS_ChuyenNganhTienSi'),
            'strDonViCongTac': edu.util.getValById('txtNS_DonViCongTac'),
            'strLinhVucNghienCuu': edu.util.getValById('txtNS_LinhVuc'),
        };
        if (me.strNhanSu_Id != "") {
            obj_save.action = 'NS_HoSo_NgoaiV2/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strNhanSu_Id == "") {
                        edu.system.alert("Thêm mới thành công");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công");
                        //me.strNhanSu_Id = "";
                        //$(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới - ');
                    }
                    me.getList_HS();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    getList_HS: function () {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearch_KhoiTao_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_KhoiTao_CCTC");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_KhoiTao_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': 1
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);
    },
    getDetail_HS: function (strId) {
        var me=this;
        var obj_detail = {
            'action': 'NS_HoSoV2/LayChiTiet',

            'strId': strId
        }
        if (strId.length != 32) return;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.viewForm_HS(json[0]);
                    } else {
                        console.log("Lỗi ");
                    }
                } else {
                    console.log("Thông báo: có lỗi xảy ra!");
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_detail.action,

            contentType: true,

            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    delete_HS: function (strId) {
        var me=this;
        var obj_delete = {
            'action': 'NS_HoSoV2/Xoa',

            'strIds': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    if (me.strNhanSu_Id == strId) {
                        $(".btnClose").trigger("click");
                    }
                    edu.system.afterComfirm(obj);
                    me.getList_HS();
                }
                else {
                    edu.system.alert("SV_HoSo/Xoa: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("SV_HoSo/Xoa (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HS: function (data, iPager) {
        var me = this;
        me.dtNhanSu = data;
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNhanSuNgoaiTruong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NhanSuNgoaiTruong.getList_HS()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            arrClassName: ["btnDetail"],
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HOTEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + "Email: " + edu.util.returnEmpty(aData.EMAIL) + "</span><br />";
                        html += '<span>' + "Số điện thoại: " + edu.util.returnEmpty(aData.SDT_CANHAN) +  "</span><br />";
                        return html;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-edit color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewForm_HS: function (data) {
        var me=this;
        me.rewrite();
        me.strNhanSu_Id = data.ID;
        edu.util.viewValById("txtNS_HoTen", data.HODEM);
        edu.util.viewValById("txtNS_Ten", data.TEN);
        edu.util.viewValById("txtNS_MaSo", data.MASO);
        edu.util.viewValById("dropNS_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("txtNS_Email", data.EMAIL);
        edu.util.viewValById("txtNS_DienThoaiCaNhan", data.SDT_CANHAN);
        edu.util.viewValById("txtNS_DiaChi", data.DIACHI);
        edu.util.viewValById("txtNS_MaSoThue", data.MASOTHUE);
        edu.util.viewValById("txtNS_CMT", data.CANCUOC_SO);
        edu.util.viewValById("dropNS_HocHam", data.CHUCDANH_ID);
        edu.util.viewValById("dropNS_HocVi", data.HOCVI_ID);
        edu.util.viewValById("dropNS_ChucVu", data.CHUCVU_ID);
        edu.util.viewValById("dropNS_ChuyenNganhTienSi", data.CHUYENNGANHHOCVI_ID);
        edu.util.viewValById("txtNS_LinhVuc", data.LINHVUCNGHIENCUU);
        edu.util.viewValById("txtNS_DonViCongTac", data.HKTT_DIACHI);
        edu.util.viewValById("txtNS_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txtNS_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txtNS_NamSinh", data.NAMSINH);
    },
}