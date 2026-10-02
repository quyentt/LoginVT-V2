/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 20/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function PhanLop() { };
PhanLop.prototype = {
    dtNguoiHoc: [],
    strNguoiHoc_Id: '',
    strLopQuanLy_Id: '',
    strLopSinhVien_Id:'',
    iTinhTrangNhapHoc: 0,//(0-chua nhap, 1- da nhap, -1 toan bo)
    strKeHoach_Id: '',
    dtKeHoachNhapHoc: '',

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
        --Discription: [1] Action for ThongTinNguoiHoc or ThongTinTuyenSinh
        -------------------------------------------*/
        $("#tblPhanLop").delegate(".btnSelect_NguoiHoc_PhanLop", "click", function () {
            var strNguoiHoc_Id = this.id;
            edu.util.resetAll_BgRow("tblPhanLop");
            edu.util.setOne_BgRow(strNguoiHoc_Id);            
            if (edu.util.checkValue(strNguoiHoc_Id)) {
                me.reset_NguoiHoc_PhanLop();
                me.strNguoiHoc_Id = strNguoiHoc_Id;
                return new Promise(function (resolve, reject) {
                    me.getDetail_NguoiHoc_TTTS(strNguoiHoc_Id, main_doc.PhanLop.dtNguoiHoc, resolve, reject);
                }).then(function (data) {
                    me.genDetail_NguoiHoc_TTTS(data);                    
                    if (edu.util.checkValue(data.DAOTAO_LOPQUANLY_TEN) || edu.util.checkValue(data.DAOTAO_LOPQUANLY_MA)) {
                        me.updateHTML_PhanLop(data.DAOTAO_LOPQUANLY_TEN);
                    }
                    else {
                        me.updateHTML_PhanLopDuKien(data);
                    }
                });
            }
        });
        $("#tblPhanLop").delegate(".btnPopover_NguoiHoc_PhanLop", "mouseenter", function () {
            var id = this.id;
            var data = me.dtNguoiHoc;
            var obj = this
            edu.extend.popover_NguoiHoc_TTTS(id, data, obj);
        });
        $("#btnSave_PhanLop").click(function () {
            if (edu.util.checkValue(me.strNguoiHoc_Id) && edu.util.checkValue(me.strLopQuanLy_Id)) {
                me.save_PhanLopThuCong();
            }
            else if (edu.util.checkValue(me.strNguoiHoc_Id) && !edu.util.checkValue(me.strLopQuanLy_Id)) {
                edu.system.alert("Vui lòng chọn <span class='color-active italic'>Lớp quản lý</span> trước khi phân lớp");
            }
            else if (!edu.util.checkValue(me.strNguoiHoc_Id) && edu.util.checkValue(me.strLopQuanLy_Id)) {
                edu.system.alert("Vui lòng chọn <span class='color-active italic'>Người học</span> trước khi phân lớp");
            }
            else {
                edu.system.alert("Vui lòng chọn <span class='color-active italic'>Người học</span> và <span class='color-active italic'>Lớp quản lý</span> trước khi phân lớp");
            }
        });
        $("#lblLopQuanLy").delegate(".btnDel_PhanLop", "click", function () {
            var strNguoiHoc_Id = this.id;
            strNguoiHoc_Id = edu.util.cutPrefixId(/del_phanlop/g, strNguoiHoc_Id);
            if (edu.util.checkValue(strNguoiHoc_Id)) {
                edu.system.confirm("Bạn có chắc chắn muốn hủy phân lớp?");
                $("#btnYes").click(function (e) {
                    me.delete_PhanLop(strNguoiHoc_Id);
                });
            }
        });
        $("#lblLopQuanLy").delegate(".btnDel_PhanLop", "mouseenter", function () {
            var objdata = {
                obj: this,
                title: "<span class='color-active bold'><i class='fa fa-info-circle'> Hủy phân lớp sinh viên</span>",
                content: function () {
                    var html_popover = '';
                    html_popover += '<table class="table table-condensed table-hover" style="width:250px">';
                    html_popover += '<tbody>';
                    html_popover += '<tr>';
                    html_popover += '<td class="td-left color-warning">Ghi chú: Chỉ được hủy phân lớp khi chưa đóng tiền!</td>';
                    html_popover += '</tr>';
                    html_popover += '</tbody>';
                    html_popover += '</table>';
                    return html_popover;
                },
                event: 'hover',
                place: 'right',
            };
            edu.system.loadToPopover_data(objdata);
        });
        //timkiem nguoihoc_ttts
        $('#dropKeHoachNhapHoc_PhanLop').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            if (edu.util.checkValue(selectedValue)) {
                me.strKeHoach_Id = selectedValue;
                edu.extend.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, "", me.cbGenTable_NguoiHoc_TTTS);
                me.getList_RutHoSo();
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
            //update dropKeHoach_TimKiem_PhanLop
            var strKeHoach_Id = selectedValue;
            $("#dropKeHoach_TimKiem_PhanLop").val(strKeHoach_Id).trigger("change");
            //call chuogntrinhdaotao
            me.getList_ChuongTrinhDaoTao(strKeHoach_Id);
        });
        $('.rdPhanLop').on('change', function () {
            me.reset_NguoiHoc_PhanLop();
            me.iTinhTrangNhapHoc = $('input[name="rdPhanHop"]:checked').val();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_PhanLop");
            var strTuKhoa = edu.util.getValById("txtKeyword_PhanLop");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            edu.extend.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $("#txtKeyword_PhanLop").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_PhanLop");
                var strTuKhoa = edu.util.getValById("txtKeyword_PhanLop");
                if (!edu.util.checkValue(me.strKeHoach_Id)) {
                    me.strKeHoach_Id = "xxx";
                }
                //1. call nguoihoc_ttts
                edu.extend.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
            }
        });
        $("#btnDel_Keyword_PhanLop").click(function () {
            edu.util.viewValById("txtKeyword_PhanLop", "");
            $("#txtKeyword_PhanLop").focus();
        });
        $("#btnSearch_NguoiHoc_PhanLop").click(function () {
            me.reset_NguoiHoc_PhanLop();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_PhanLop");
            var strTuKhoa = edu.util.getValById("txtKeyword_PhanLop");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            edu.extend.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        /*------------------------------------------
        --Discription: [2] Action for LopQuanLy
        -------------------------------------------*/
        $("#zoneLopQuanLy_PhanLop").delegate(".btnDetail_LopQuanLy", "click", function () {
            me.open_modal();
            var strLopSinhVien_Id = this.id;
            me.strLopSinhVien_Id = edu.util.cutPrefixId(/lopsinhvien_id/g, strLopSinhVien_Id);
            me.getList_SinhVien();
        });
        $("#zoneLopQuanLy_PhanLop").delegate(".btnSelect_LopQuanLy", "click", function () {
            var strLopQuanLy_Id = this.id;
            me.strLopQuanLy_Id = edu.util.cutPrefixId(/lopquanly_id/g, strLopQuanLy_Id);
            
            me.getText_LopQuanLy_Ten();
        });        
        $("#lblLopQuanLy").delegate("#btnYes_Cancel_LopDuKien", "click", function () {
            me.resetText_LopQuanLy_Ten();
        });
        $("#lblLopQuanLy").delegate("#btnYes_Save_LopDuKien", "click", function () {
            if (edu.util.checkValue(me.strNguoiHoc_Id) && edu.util.checkValue(me.strLopQuanLy_Id)) {
                me.save_PhanLopThuCong();
            }
            else if (edu.util.checkValue(me.strNguoiHoc_Id) && !edu.util.checkValue(me.strLopQuanLy_Id)) {
                edu.system.alert("Vui lòng chọn <span class='color-warning italic'>Lớp quản lý</span> trước khi phân lớp", "w");
            }
            else if (!edu.util.checkValue(me.strNguoiHoc_Id) && edu.util.checkValue(me.strLopQuanLy_Id)) {
                edu.system.alert("Vui lòng chọn <span class='color-warning italic'>Người học</span> trước khi phân lớp", "w");
            }
            else {
                edu.system.alert("Vui lòng chọn <span class='color-warning italic'>Người học</span> và <span class='color-warning italic'>Lớp quản lý</span> trước khi phân lớp", "w");
            }
        });
        $("#lblLopQuanLy").delegate("#btnDel_LopQuanLy", "click", function () {
            me.resetText_LopQuanLy_Ten();
        });
        /*------------------------------------------
        --Discription: [3] Action for TimKiem LopQuanLy
        -------------------------------------------*/
        $('#dropChuonTrinh_PhanLop').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            if (edu.util.checkValue(selectedValue)) {
                me.getList_LopQuanLy(selectedValue);
            }
            else {
                $("#zoneLopQuanLy_PhanLop").html('<span class="label color-danger">Vui lòng chọn chương trình đào tạo để tìm kiếm Lớp quản lý!</span>');
                return false;
            }            
        });
        $('#dropKeHoach_TimKiem_PhanLop').on('select2:select', function () {
            var strKeHoach_Id = $(this).find('option:selected').val();
            me.getList_ChuongTrinhDaoTao(strKeHoach_Id);
        });
        //$("#btnInGiayPhanLop").click(function () {
        //    edu.system.report("PHIEUPHANLOP", "", function (addKeyValue) {
        //        addKeyValue("strTS_HoSoDuTuyen_Id", main_doc.PhanLop.strNguoiHoc_Id);
        //        addKeyValue("strNguoiThucHien_Id", edu.system.userId);
        //        addKeyValue("strChucNang_Id", edu.system.strChucNang_Id);
        //    });
        //});
        edu.system.getList_MauImport("zoneBaoCao_PL", function (addKeyValue) {
            addKeyValue("strTS_HoSoDuTuyen_Id", main_doc.PhanLop.strNguoiHoc_Id);
            addKeyValue("strNguoiThucHien_Id", edu.system.userId);
            addKeyValue("strChucNang_Id", edu.system.strChucNang_Id);
        });

        $("#btnDelete_RutHoSo").click(function () {
            if (!me.strNguoiHoc_Id) {
                edu.system.aler("Bạn cần chọn đối tượng");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn rút hồ sơ không?");
            $("#btnYes").click(function (e) {
                me.save_RutHoSo();
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common function
    --Author: 
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.PhanLop;
        $("#txtKeyword_PhanLop").focus();
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
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_PhanLop");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            edu.extend.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, "", me.cbGenTable_NguoiHoc_TTTS);
            me.getList_ChuongTrinhDaoTao();
        });
    },
    reset_NguoiHoc_PhanLop: function () {
        var me = this;
        me.strNguoiHoc_Id = "";
        me.strLopQuanLy_Id = "";
        me.resetText_LopQuanLy_Ten();

        edu.util.resetHTMLById("lblHoTen_PhanLop");
        edu.util.resetHTMLById("lblMaSoSV_PhanLop");
        edu.util.resetHTMLById("lblNgaySinh_PhanLop");
        edu.util.resetHTMLById("lblSoDienThoai_PhanLop");
        edu.util.resetHTMLById("lblQueQuan_PhanLop");
        edu.util.resetHTMLById("lblNganhNhapHoc_PhanLop");
        
        edu.util.resetHTMLById("lblSoBaoDanh_PhanLop");
        edu.util.resetHTMLById("lblTongDiem_PhanLop");
        edu.util.resetHTMLById("lblDoiTuong_PhanLop");
        edu.util.resetHTMLById("lblPhanTramMienGiam_PhanLop");
        edu.util.resetHTMLById("lblNganhTrungTuyen_PhanLop");
        edu.util.resetHTMLById("lblKhuVuc_PhanLop");
    },
    open_modal: function () {
        $("#myModal_ChiTietLop").modal("show");
    },
    /*------------------------------------------
    --Discription: [1] Acess db NH_NguoiHoc_TTTS
    --Author: 
    -------------------------------------------*/
    updateHTML_PhanLopDuKien: function (data) {
        var me = this;

        var strMaLopDuKien = data.MALOPDUKIEN;
        if (edu.util.checkValue(strMaLopDuKien)) {
            me.strLopQuanLy_Id = strMaLopDuKien;
            me.confirm_save_LopDuKien(strMaLopDuKien);
        }
        else {
            //nothing
        }
    },
    save_PhanLopThuCong: function () {
        var me = this;
        var strQLSV_NguoiHoc_TTTS_Id = me.strNguoiHoc_Id;
        var strDAOTAO_LopQuanLy_Id = me.strLopQuanLy_Id;// pass into id_lopquanly or ma_lopdukien
        var strDAOTAO_ToChucCT_Id = "";
        var strQLSV_TrangThaiNguoiHoc_Id = "";
        var strNguoiThucHien_Id = edu.system.userId;

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phân lớp thành công!");
                    edu.extend.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, "", me.cbGenTable_NguoiHoc_TTTS);
                    me.updateHTML_PhanLop("");
                    me.getList_LopQuanLy(edu.util.getValById("dropChuonTrinh_PhanLop"));
                    me.getDetail_NguoiHoc_PhieuNhapHoc(me.strNguoiHoc_Id);
                    //var aData = me.dtNguoiHoc.find(e => e.ID === me.strNguoiHoc_Id);
                    //if (aData && aData.EMAIL) {
                    //    edu.system.reportDanhMuc(aData, aData.EMAIL, "NH.GNH");
                    //}
                }
                else {
                    edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.PhanLop_ThuCong: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.PhanLop_ThuCong (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: 'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_PhanLop_ThuCong',
            versionAPI: 'v1.0',
            contentType: true,
            data: {
                'strQLSV_NguoiHoc_TTTS_Id': strQLSV_NguoiHoc_TTTS_Id,
                "strDAOTAO_LopQuanLy_Id": strDAOTAO_LopQuanLy_Id,
                "strDAOTAO_ToChucCT_Id": strDAOTAO_ToChucCT_Id,
                "strQLSV_TrangThaiNguoiHoc_Id": strQLSV_TrangThaiNguoiHoc_Id,
                "strNguoiThucHien_Id": strNguoiThucHien_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhanLopTuDong: function () {
        var me = this;
        var strQLSV_NguoiHoc_TTTS_Id = me.strNguoiHoc_Id;
        var strNguoiThucHien_Id = edu.system.userId;

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phân lớp tự động thành công!");
                    edu.extend.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, "", me.cbGenTable_NguoiHoc_TTTS);
                    me.updateHTML_PhanLop("");
                }
                else {
                    edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.PhanLop_TuDong: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.PhanLop_TuDong (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: 'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_PhanLop_TuDong',
            versionAPI: 'v1.0',
            contentType: true,
            data: {
                'strQLSV_NguoiHoc_TTTS_Id': strQLSV_NguoiHoc_TTTS_Id,
                "strNguoiThucHien_Id": strNguoiThucHien_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanLop: function (strId) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NH_NguoiHoc_ThongTinTuyenSinh/Xoa',
            'versionAPI': 'v1.0',

            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Hủy phân lớp thành công!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    me.resetText_LopQuanLy_Ten();
                    edu.extend.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, "", me.cbGenTable_NguoiHoc_TTTS);
                }
                else {
                    var obj = {
                        content: "NH_NguoiHoc_ThongTinTuyenSinh.Xoa: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "NH_NguoiHoc_ThongTinTuyenSinh.Xoa (er): " + JSON.stringify(er),
                    code: "",
                }
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] Gen html NH_NguoiHoc_TTTS
    --Author: 
    -------------------------------------------*/
    getDetail_NguoiHoc_TTTS: function (strNguoiHoc_Id, data, resolve, reject) {
        var me = this;
        var count = 0;
        var checkdata = false;
        for (var i = 0; i < data.length; i++) {
            count++;
            if (strNguoiHoc_Id == data[i].ID) {
                checkdata = true;
                resolve(data[i]);
            }
        }
        if (count == data.length) {
            if (checkdata == false) {
                resolve([]);
            }
        }
    },
    genDetail_NguoiHoc_TTTS: function (data) {
        var me = this;
        //1. id gen place
        var strHoTen            = edu.util.returnEmpty(data.HODEM) + " " + edu.util.returnEmpty(data.TEN);
        var strMaSo             = edu.util.returnEmpty(data.MASO);
        var strNgaySinh         = edu.util.returnEmpty(data.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(data.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(data.NGAYSINH_NAM);
        
        var strSoDienThoai      = edu.util.returnEmpty(data.SODIENTHOAICANHAN);
        var strQueQuan          = edu.util.returnEmpty(data.HOKHAU_PHUONGXAKHOIXOM) + " - " + edu.util.returnEmpty(data.HOKHAU_QUANHUYEN_TEN) + " - " + edu.util.returnEmpty(data.HOKHAU_TINHTHANH_TEN);
        var strNganhNhapHoc     = edu.util.returnEmpty(data.DAOTAO_NGANHNHAPHOC);

        var strSoBaoDanh        = edu.util.returnEmpty(data.SOBAODANH);
        var dTongDiem           = edu.util.returnZero(data.DIEMTS_TONGDIEM).toFixed(2);
        var strDoiTuong         = edu.util.returnEmpty(data.DOITUONGDUTHI_TEN);
        var strPhanTramMienGiam = edu.util.returnZero(data.PHANTRAMMIENGIAM);
        var strNganhHoc         = edu.util.returnEmpty(data.NGANHHOC_TEN);
        var strKhuVuc           = edu.util.returnEmpty(data.KHUVUC_TEN);
        var dTongDaPhanLop      = edu.util.returnEmpty(data.SODANHAPHOC);
        //3. fill data into place
        me.strNguoiHoc_Id = data.ID;
        edu.util.viewHTMLById("lblHoTen_PhanLop", strHoTen.toUpperCase());
        edu.util.viewHTMLById("lblMaSoSV_PhanLop", strMaSo);
        edu.util.viewHTMLById("lblNgaySinh_PhanLop", strNgaySinh);
        edu.util.viewHTMLById("lblSoDienThoai_PhanLop", strSoDienThoai);
        edu.util.viewHTMLById("lblQueQuan_PhanLop", strQueQuan);
        edu.util.viewHTMLById("lblNganhNhapHoc_PhanLop", strNganhNhapHoc);
        edu.util.viewHTMLById("lblSoBaoDanh_PhanLop", strSoBaoDanh);
        edu.util.viewHTMLById("lblTongDiem_PhanLop", dTongDiem);
        edu.util.viewHTMLById("lblDoiTuong_PhanLop", strDoiTuong);
        edu.util.viewHTMLById("lblPhanTramMienGiam_PhanLop", strPhanTramMienGiam);
        edu.util.viewHTMLById("lblNganhTrungTuyen_PhanLop", strNganhHoc);
        edu.util.viewHTMLById("lblCMT", edu.util.returnEmpty(data.CMTND_SO));
        edu.util.viewHTMLById("lblKhuVuc_PhanLop", strKhuVuc);
        //3. sum tong so sinh vien da nhap hoc
        edu.util.viewHTMLById("lblTongDaNhapHoc_PhanLop", dTongDaPhanLop);
        if (data.DAOTAO_TOCHUCCHUONGTRINH_ID) {
            $("#dropChuonTrinh_PhanLop").val(data.DAOTAO_TOCHUCCHUONGTRINH_ID).trigger("change").trigger({ type: 'select2:select' });
        }
    },
    getDetail_NguoiHoc_PhieuNhapHoc: function (strId) {
        var me = this;

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.dtNguoiHoc_Print = data.Data[0];
                    //me.getList_KhoanDaThu_Rut(strPhieuThu_Id);
                    if (data.Data.length > 0) {
                        var aData = data.Data[0]; 
                        if (aData && aData.EMAIL) {
                            edu.system.reportDanhMuc(aData, aData.EMAIL, "NH.GNH");
                        }
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'NH_NguoiHoc_ThongTinTuyenSinh/LayChiTiet',
            versionAPI: 'v1.0',
            contentType: true,
            data: {
                'strId': me.strNguoiHoc_Id,
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] Callback from edu.extend
    --Author: 
    -------------------------------------------*/
    cbGenTable_NguoiHoc_TTTS: function (data, iPager) {
        var me = main_doc.PhanLop;
        me.dtNguoiHoc = data;
        if (edu.util.checkValue(data)) {
            edu.util.viewHTMLById("lblTongDaNhapHoc_PhanLop", data[0].SODANHAPHOC);
        }
        me.checkAuto_Select_NguoiHoc_TTTS(me.dtNguoiHoc);
        var strTuKhoa = edu.util.getValById("txtKeyword_PhanLop");
        var jsonForm = {
            strTable_Id: "tblPhanLop",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_NguoiHoc_TTTS('" + me.iTinhTrangNhapHoc + "', '" + me.strKeHoach_Id + "', '" + strTuKhoa + "',main_doc.PhanLop.cbGenTable_NguoiHoc_TTTS)",
                iDataRow: iPager,
            },
            arrClassName: ["tr-pointer", "btnPopover_NguoiHoc_PhanLop"],
            bHiddenOrder: true,
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [2],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<img src="' + edu.system.getRootPathImg(aData.ANH) + '" class="table-img" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strHoDem        = edu.util.returnEmpty(aData.HODEM);
                        var strTen          = edu.util.returnEmpty(aData.TEN);
                        var strFullName     = strHoDem + " " + strTen;
                        var strSoBaoDanh    = edu.util.returnEmpty(aData.SOBAODANH);
                        var html = '';
                        html = '<span class="td-middle">' + strFullName + '</span><br />';
                        html += '<span class="td-middle td-font">' + strSoBaoDanh + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        //condition: 0- chua nhap hoc || 1 - da nhap hoc
                        var html = '';
                        var iDaNhapHoc = aData.DANHAPHOC;
                        html += '<span><a id="' + aData.ID + '" class="poiter btnSelect_NguoiHoc_PhanLop">Chọn</a></span>';
                        if (iDaNhapHoc == 1) {
                            html += '<br /><span><a><i class="fa fa-tag"></i></a></span>'
                        }
                        else {
                            //nothing
                        }
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.endLoading();
    },
    genCombo_KeHoachNhapHoc: function (data) {
        var me = main_doc.PhanLop;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhapHoc_PhanLop", "dropKeHoach_TimKiem_PhanLop"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    checkAuto_Select_NguoiHoc_TTTS: function (data) {
        var me = this;
        if (data.length == 1) {//only one record
            var strNguoiHoc_Id = data[0].ID;

            edu.util.resetAll_BgRow("tblPhanLop");
            edu.util.setOne_BgRow(strNguoiHoc_Id);

            if (edu.util.checkValue(strNguoiHoc_Id)) {
                me.reset_NguoiHoc_PhanLop();
                me.strNguoiHoc_Id = strNguoiHoc_Id;

                return new Promise(function (resolve, reject) {
                    me.getDetail_NguoiHoc_TTTS(strNguoiHoc_Id, main_doc.PhanLop.dtNguoiHoc, resolve, reject);
                }).then(function (data) {
                    me.genDetail_NguoiHoc_TTTS(data);

                    if (edu.util.checkValue(data.DAOTAO_LOPQUANLY_TEN) || edu.util.checkValue(data.DAOTAO_LOPQUANLY_MA)) {
                        me.updateHTML_PhanLop(data.DAOTAO_LOPQUANLY_TEN);
                    }
                    else {
                        me.updateHTML_PhanLopDuKien(data);
                    }
                });
            }
        }
    },
    /*------------------------------------------
    --Discription: [2] ACESS DB ChuongTrinhDaoTao ===> COMMON
    --Author: 
    -------------------------------------------*/
    getList_ChuongTrinhDaoTao: function (strKeHoach_Id) {
        var me = this;
        var strChuongTrinhDaoTao_Id = "";

        for (var i = 0; i < me.dtKeHoachNhapHoc.length; i++) {
            if (me.dtKeHoachNhapHoc[i].ID == strKeHoach_Id) {
                strChuongTrinhDaoTao_Id = me.dtKeHoachNhapHoc[i].DAOTAO_KHOADAOTAO_ID;
            }
        }
        var objCTDT = {
            strKhoaDaoTao_Id: strChuongTrinhDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        }
        edu.system.getList_ChuongTrinhDaoTao(objCTDT, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function (strChuongTrinh_Id) {
        var me = this;

        edu.system.beginLoading();
        var objLQL = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: "",
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strChuongTrinh_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        }
        edu.system.getList_LopQuanLy(objLQL, "", "", me.cbGenHTML_LopQuanLy);
        edu.system.endLoading();
    },
    /*------------------------------------------
    --Discription: [2] GEN HTML ChuongTrinhDaoTao ===> COMMON
    --Author: 
    -------------------------------------------*/
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
            renderPlace: ["dropChuonTrinh_PhanLop"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML LopQuanLy ===> COMMON
    --Author: 
    -------------------------------------------*/
    cbGenHTML_LopQuanLy: function (data) {
        var html = '';
        var strLop_Id = '';
        var strLop_Ten = '';
        var strLop_Ma = '';
        var iLop_SoLuongKeHoach = '';
        var iLop_SoLuongThucTe = '';
        $("#zoneLopQuanLy_PhanLop").html('');

        for (var i = 0; i < data.length; i++) {
            strLop_Id = edu.util.returnEmpty(data[i].ID);
            strLop_Ten = edu.util.returnEmpty(data[i].TEN);
            strLop_Ma = edu.util.returnEmpty(data[i].MA);
            iLop_SoLuongKeHoach = edu.util.returnZero(data[i].SOLUONGKEHOACH);
            iLop_SoLuongThucTe = edu.util.returnZero(data[i].SOLUONGTHUCTE);
            //gen html
            fill_HTML(strLop_Id, strLop_Ten, strLop_Ma, iLop_SoLuongKeHoach, iLop_SoLuongThucTe);
        }
        $("#zoneLopQuanLy_PhanLop").html(html);
        function fill_HTML(strLop_Id, strLop_Ten, strLop_Ma, iLop_SoLuongKeHoach, iLop_SoLuongThucTe) {
            html += '<div class="col-sm-4">';
            html += '<div class="box-class">';
            html += '<i class="fa fa-folder-open-o"></i>';
            html += '<p>Lớp: <span id="lopquanly_ten' + strLop_Id + '">' + strLop_Ten + '</span>(' + iLop_SoLuongThucTe + '/' + iLop_SoLuongKeHoach + ')</p>';
            html += '<span class="select-action">';
            html += '<a id="lopquanly_id' + strLop_Id + '" class="poiter btnSelect_LopQuanLy">Chọn</a>';
            html += ' | ';
            html += '<a id="lopsinhvien_id' + strLop_Id + '" class="poiter btnDetail_LopQuanLy">Chi tiết</a>';
            html += '</span>';
            html += '</div>';
            html += '</div>';
        }
        if (data.length == "") {
            $("#zoneLopQuanLy_PhanLop").html('<span class="label color-active">Không tìm thấy dữ liệu!</span>');
        }
        edu.system.endLoading();
    },
    getText_LopQuanLy_Ten: function () {
        var me = this;
        //get html to fill into #3 Lop Sinh Vien
        var html = '';
        $("#lblLopQuanLy").html(html);
        var $lopquanly_ten = "#lopquanly_ten" + me.strLopQuanLy_Id;
        var strLopQuanLy_Ten = $($lopquanly_ten).text();

        html += '<span class="color-active" id="lblLop_Ten">' + strLopQuanLy_Ten + '</span>';
        html += '<a class="poiter" id="btnDel_LopQuanLy"> <i class="fa fa-times-circle"></i></a>';

        $("#lblLopQuanLy").html(html);
    },
    resetText_LopQuanLy_Ten: function () {
        var me = this;
        var html = '';
        me.strLopQuanLy_Id = '';        
        html += '<span class="color-warning italic">Chưa phân lớp!</span>'
        $("#lblLopQuanLy").html(html);
    },
    confirm_save_LopDuKien: function (strMaLopDuKien) {
        var me = this;
        var html = '';
        $("#lblLopQuanLy").html(html);
        html += '<span class="color-warning" id="lblLop_Ten">' + strMaLopDuKien + '</span>';
        html += '<span class="italic"> ';
        html += 'Bạn có muốn phân lớp theo dự kiến ';
        html += '<a class="btn btn-primary btn-circle" id="btnYes_Save_LopDuKien"> Yes</a> or ';
        html += '<a class="btn btn-default btn-circle" id="btnYes_Cancel_LopDuKien"> No</a>';
        html += '</span>';
        $("#lblLopQuanLy").html(html);
    },
    updateHTML_PhanLop: function (strLop_Ten) {
        var me = this;
        me.strLopQuanLy_Id = "";

        var html = '';
        var val_LopTen = "";
        
        if (edu.util.checkValue(strLop_Ten)) {
            val_LopTen = strLop_Ten;
        }
        else {
            var $_LopTen = "#lblLop_Ten";
            val_LopTen = $($_LopTen).text();
        }        
        html += '<span class="" id="lblLop_Ten">' + val_LopTen + '</span>';
        //add btn_delete PhanLop NguoiHoc
        html += ' <a class="btn btn-default btn-circle btnDel_PhanLop" id="del_phanlop' + me.strNguoiHoc_Id + '"><i class="fa fa-times"></i> Hủy</a>';
        $("#lblLopQuanLy").html(html);
    },
    /*------------------------------------------
    --Discription: [4] GEN HTML SinhVien ===> COMMON
    --Author: 
    -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;
        var obj_SinhVien = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: "",
            strNganh_Id: "",
            strLopQuanLy_Id: me.strLopSinhVien_Id,
            iTrangThai: 1,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        }
        edu.system.getList_SinhVien(obj_SinhVien, "", "", me.genTable_SinhVien);
    },
    genTable_SinhVien: function (data, iPager) {
        var me = main_doc.PhanLop;
        var obj_SinhVien = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: "",
            strNganh_Id: "",
            strLopQuanLy_Id: me.strLopSinhVien_Id,
            iTrangThai: 1,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        }
        var jsonForm = {
            strTable_Id: "tbldata_SinhVien_PhanLop",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.system.getList_SinhVien(main_doc.PhanLop.obj_SinhVien, '', '',main_doc.PhanLop.genTable_SinhVien)",
                iDataRow: iPager,
            },
            arrClassName: ["tr-pointer"],
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [2],
                fix: [0],
                center: [0],
                center:[1]
            },
            aoColumns: [
                {
                    "mDataProp": "MASONGUOIHOC"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strHoDem    = aData.HODEM;
                        var strTen      = aData.TEN;
                        var strHoTen = strHoDem + " " + strTen;
                        return strHoTen;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.endLoading();
    },


    save_RutHoSo: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NH_RutHoSo/Them_NhapHoc_RutHoSo_TT',
            'type': 'POST',
            'strNhapHoc_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_PhanLop'),
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
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
                    me.getList_RutHoSo();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_RutHoSo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NH_RutHoSo/LayDSNhapHoc_RutHoSo_TT',
            'type': 'GET',
            'strNhapHoc_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_PhanLop'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_RutHoSo(dtReRult, data.Pager);
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
    genTable_RutHoSo: function (data, iPager) {
        $("#lblTangThem_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblRutHoSo",
            aaData: data,
            colPos: {
                center: [0, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_MA"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
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