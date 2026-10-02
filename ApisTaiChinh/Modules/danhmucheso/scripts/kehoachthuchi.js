/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function KeHoachThuChi() { }
KeHoachThuChi.prototype = {
    dtKeHoach: [],
    strKeHoachThuChi_Id:'',
    dtVaiTro: [],
    arrValid_KeHoachThuChi: [],
    arrNhanSu_Id: [],
    dtCoSoDaoTao: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        console.log(11111111);
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_KeHoachThuChi();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoachThuChi();
            }
        });
        $("#btnSearch_KeHoachThuChi").click(function () {
            me.getList_KeHoachThuChi();
        });
         /*------------------------------------------
        --Discription: [1] Action TapChiQuocTe
        --Order:
        -------------------------------------------*/
        $("#btnSave_KeHoachThuChi").click(function () {
            var valid = edu.util.validInputForm([
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
                { "MA": "txtGT_NoiDung", "THONGTIN1": "EM" },
                { "MA": "txtGT_SoQuyetDinh", "THONGTIN1": "EM" },
                { "MA": "txtGT_SoNguoi", "THONGTIN1": "EM" },
                { "MA": "txtGT_Nam", "THONGTIN1": "EM" },
                { "MA": "txtGT_Thang", "THONGTIN1": "EM" },
                { "MA": "txtGT_Thang", "THONGTIN1": "EM" },
                { "MA": "txtGT_HinhThuc", "THONGTIN1": "EM" },
                { "MA": "dropSearch_KeHoachThuChi_CapKhenThuong", "THONGTIN1": "EM" }
            ]);
            if (valid) {
                me.save_KeHoachThuChi();
            }
        });
        $("#tblKeHoach").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strKeHoachThuChi_Id = strId;
                var data = edu.util.objGetDataInData(strId, me.dtKeHoach, "ID");
                if (data.length > 0) {
                    me.viewEdit_KeHoachThuChi(data[0]);
                    me.getList_ThanhVien();
                } else {
                    edu.system.alert("Dữ liệu chọn không đúng", "w");
                }
                edu.util.setOne_BgRow(strId, "tblKeHoach");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKeHoach").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KeHoachThuChi(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
         /*------------------------------------------
        --Discription: [1] Action TapChiQuocTe
        --Order:
        -------------------------------------------*/
        $(".btnSearch_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_CanBo").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu không?", "w");
                $("#btnYes").click(function (e) {
                    me.delete_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [2-2] Action DeTai_ThanhVien 
        --Order: 
        -------------------------------------------*/
        $("#tblInput_CanBo").delegate('.btnDelete', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/del_detai_thanhvien/g, id);
            if (edu.util.checkValue(strNhanSu_Id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu không?", "w");
                $("#btnYes").click(function (e) {
                    me.delete_ThanhVien(strNhanSu_Id);
                });
            }
            else {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu không?", "w");
            }
        });
        $("#delete_EditHocPhan").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu không?", "w");
            $("#btnYes").click(function (e) {
                me.delete_KeHoachThuChi(me.strKeHoachThuChi_Id);
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        
        me.toggle_form();
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.VAITRO_BAOCAO", "", "", data => me.dtVaiTro = data);
        me.getList_KeHoachThuChi();
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.PHANBOHOADON", "dropMoHinhPhanBoHoaDon_KHTC");
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.MOHINH_PHIEUTHU", "dropMoHinhPhanBoPhieuThu_KHTC");
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.PHANBOBIENLAI", "dropMoHinhPhanBoBienLai_KHTC");
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.MOHINHGACHNO", "dropMoHinhGachNo_KHTC");
        me.getList_BienLai();
        me.getList_HoaDon();
        me.getList_PhieuThu();
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachThuChi_Id = "";
        edu.util.viewValById("txtTenKeHoach_KHTC", "");
        edu.util.viewValById("txtNgayBatDau_KHTC", "");
        edu.util.viewValById("txtNgayKetThuc_KHTC", "");
        edu.util.viewValById("txtMota_KHTC", "");
        edu.util.viewValById("dropMoHinhPhanBoHoaDon_KHTC", "");
        edu.util.viewValById("dropLoaiHoaDonThu_KHTC", "");
        edu.util.viewValById("dropLoaiHoaDonRut_KHTC", "");
        edu.util.viewValById("dropMoHinhPhanBoPhieuThu_KHTC", "");
        edu.util.viewValById("dropLoaiPhieuThu_KHTC", "");
        edu.util.viewValById("dropLoaiPhieuRut_KHTC", "");
        edu.util.viewValById("dropMoHinhPhanBoBienLai_KHTC", "");
        edu.util.viewValById("dropBienLaiThu_KHTC", "");
        edu.util.viewValById("dropBienLaiRut_KHTC", "");
        edu.util.viewValById("dropLoaiHocDonDienTu_KHTC", "");
        edu.util.viewValById("dropMoHinhGachNo_KHTC", "");
        edu.util.viewValById("txtTHUEGTGT_KHTC", "");
        $("#tblInput_CanBo tbody").html("");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_KeHoachThuChi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KeHoachThuChi/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiThucHien_Id': "",
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
                        me.dtKeHoach = dtResult;
                    }
                    me.genTable_KeHoachThuChi(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KeHoachThuChi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThuChi/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': me.strKeHoachThuChi_Id,
            'strTaiChinh_HT_HoaDonRut_Id': edu.util.getValById('dropLoaiHoaDonRut_KHTC'),
            'strMoHinhApDungHoaDonRut_Id': edu.util.getValById('dropMoHinhPhanBoHoaDon_KHTC'),
            'strTaiChinh_HoaDon_DienTu_Id': edu.util.getValById('dropLoaiHocDonDienTu_KHTC'),
            'strMoHinhGachNoTuDong_Id': edu.util.getValById('dropMoHinhGachNo_KHTC'),
            'dPhanTramThueGTGT': edu.util.getValById('txtTHUEGTGT_KHTC'),
            'strNgayBatDau': edu.util.getValById('txtNgayBatDau_KHTC'),
            'strNgayKetThuc': edu.util.getValById('txtNgayKetThuc_KHTC'),
            'strTenKeHoach': edu.util.getValById('txtTenKeHoach_KHTC'),
            'strMoTa': edu.util.getValById('txtMota_KHTC'),
            'strMoHinhApDungPhieuThu_Id': edu.util.getValById('dropMoHinhPhanBoPhieuThu_KHTC'),
            'strTaiChinh_HT_PhieuThu_Id': edu.util.getValById('dropLoaiPhieuThu_KHTC'),
            'strMoHinhApDungPhieuRut_Id': edu.util.getValById('dropMoHinhPhanBoPhieuThu_KHTC'),
            'strTaiChinh_HT_PhieuRut_Id': edu.util.getValById('dropLoaiPhieuRut_KHTC'),
            'strTaiChinh_HoaDon_Id': edu.util.getValById('dropLoaiHoaDonThu_KHTC'),
            'strMoHinhApDungHoaDon_Id': edu.util.getValById('dropMoHinhPhanBoHoaDon_KHTC'),
            'strTaiChinh_HT_BienLai_Id': edu.util.getValById('dropBienLaiThu_KHTC'),
            'strTaiChinh_HT_BienLaiRut_Id': edu.util.getValById('dropBienLaiRut_KHTC'),
            'strMoHinhApDungBienLai_Id': edu.util.getValById('dropMoHinhPhanBoBienLai_KHTC'),
            'strMoHinhApDungBienLaiRut_Id': edu.util.getValById('dropMoHinhPhanBoBienLai_KHTC'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TC_KeHoachThuChi/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachThuChi = me.strKeHoachThuChi_Id;
                    me.getList_KeHoachThuChi();
                    if (obj_save.strId == "") {
                        edu.system.alert('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?', 's');
                        $("#btnYes").click(function (e) {
                            $(".btnAdd").trigger("click");
                            $('#myModalAlert').modal('hide');
                        });
                        strKeHoachThuChi = data.Id;
                    }
                    else {
                        edu.system.alert('Cập nhật thành công!', 's');
                    }
                    $("#tblInput_CanBo tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_ThanhVien(strNhanSu_Id, strKeHoachThuChi);
                    });
                }
                else {
                    edu.system.alert( obj_save.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachThuChi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KeHoachThuChi/Xoa',
            'versionAPI': 'v1.0',
            'strIds': strIds
        };
        var obj = {};
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KeHoachThuChi();
                }
                else {
                    obj = {
                        content: "NCKH_GiaiThuong/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_GiaiThuong/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                edu.system.endLoading();
            },
            type: 'POST',
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML VanBangSanghe
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KeHoachThuChi: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblGT_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblKeHoach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachThuChi.getList_KeHoachThuChi()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENKEHOACH) + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYBATDAU) + " - " + edu.util.returnEmpty(aData.NGAYKETTHUC) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewEdit_KeHoachThuChi: function (data) {
        var me = this;
        edu.util.viewValById("txtTenKeHoach_KHTC", data.TENKEHOACH);
        edu.util.viewValById("txtNgayBatDau_KHTC", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc_KHTC", data.NGAYKETTHUC);
        edu.util.viewValById("txtMota_KHTC", data.MOTA);
        edu.util.viewValById("dropMoHinhPhanBoHoaDon_KHTC", data.MOHINHAPDUNGHOADON_ID);
        edu.util.viewValById("dropLoaiHoaDonThu_KHTC", data.TAICHINH_HOADON_ID);
        edu.util.viewValById("dropLoaiHoaDonRut_KHTC", data.TAICHINH_HETHONGHOADONRUT_ID);
        edu.util.viewValById("dropMoHinhPhanBoPhieuThu_KHTC", data.MOHINHAPDUNGPHIEUTHU_ID);
        edu.util.viewValById("dropLoaiPhieuThu_KHTC", data.TAICHINH_HETHONGPHIEUTHU_ID);
        edu.util.viewValById("dropLoaiPhieuRut_KHTC", data.TAICHINH_HETHONGPHIEURUT_ID);
        edu.util.viewValById("dropMoHinhPhanBoBienLai_KHTC", data.MOHINHAPDUNGBIENLAI_ID);
        edu.util.viewValById("dropBienLaiThu_KHTC", data.TAICHINH_HETHONGBIENLAI_ID);
        edu.util.viewValById("dropBienLaiRut_KHTC", data.TAICHINH_HETHONGBIENLAIRUT_ID);
        edu.util.viewValById("dropLoaiHocDonDienTu_KHTC", data.TAICHINH_HOADON_DIENTU_ID);
        edu.util.viewValById("dropMoHinhGachNo_KHTC", data.MOHINHGACHNOTUDONG_ID);
        edu.util.viewValById("txtTHUEGTGT_KHTC", data.PHANTRAMTHUEGTGT);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HoaDon: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_HoaDon/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
            'strLoaiHoaDon_Id': "",
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
                    me.genCombo_HoaDon(dtResult, iPager);
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HoaDon: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAUSO",
                code: "MAUSO",
                order: "unorder"
            },
            renderPlace: ["dropLoaiHoaDonRut_KHTC", "dropLoaiHoaDonThu_KHTC", "dropLoaiHocDonDienTu_KHTC"],
            title: "Chọn loại hóa đơn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_PhieuThu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_PhieuThu/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
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
                    me.genCombo_PhieuThu(dtResult, iPager);
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_PhieuThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAUSO",
                code: "MAUSO",
                order: "unorder"
            },
            renderPlace: ["dropLoaiPhieuRut_KHTC", "dropLoaiPhieuThu_KHTC"],
            title: "Chọn loại phiếu thu"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_BienLai: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_BienLai/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
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
                    me.genCombo_BienLai(dtResult, iPager);
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_BienLai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAUSO",
                code: "KYHIEUQUYEN",
                order: "unorder"
            },
            renderPlace: ["dropBienLaiRut_KHTC", "dropBienLaiThu_KHTC"],
            title: "Chọn loại biên lai"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strNhanSu_Id, strKeHoach_Id) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoachThuChi_NhanSu/ThemMoi',
            'versionAPI': 'v1.0',

            'strId': "",
            'strVaiTro_Id': edu.util.getValById('dropVaiTro' + strNhanSu_Id ),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropCoSoDaoTao' + strNhanSu_Id),
            'strTaiChinh_KeHoach_Id': strKeHoach_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                }
                else {
                    obj_notify = {
                        renderPlace: "slnhansu" + strNhanSu_Id,
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
                edu.system.endLoading();
            },
            type: 'POST',
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KeHoachThuChi_NhanSu/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
            'strNguoiDung_Id': "",
            'strTaiChinh_KeHoach_Id': me.strKeHoachThuChi_Id,
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
                    }
                    me.genTable_ThanhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                edu.system.endLoading();
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TC_KeHoachThuChi_NhanSu/Xoa',
            'versionAPI': 'v1.0',
            'strIds': strNhanSu_Id,
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
                    me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInput_CanBo tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg("") + "'></td>";
            html += "<td class='td-left'><span>" + data[i].NGUOIDUNG_HOTEN + "</span> - <span>" + data[i].NGUOIDUNG_TAIKHOAN + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].VAITRO_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_COSODAOTAO_TEN) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_CanBo tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.KeHoachThuChi;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td class='td-left'><select id='dropVaiTro" + strNhanSu_Id + "' class='select-opt'></select></td>";
        html += "<td class='td-left'><select id='dropCoSoDaoTao" + strNhanSu_Id + "' class='select-opt'></select></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_CanBo tbody").append(html);
        me.genCombo_CoSoDaoTao("dropCoSoDaoTao" + strNhanSu_Id);
        me.genCombo_VaiTro("dropVaiTro" + strNhanSu_Id);

    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_CanBo tbody").html("");
            $("#tblInput_CanBo tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_CoSoDaoTao: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_CoSoDaoTao/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.dtCoSoDaoTao = dtResult;
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genCombo_CoSoDaoTao: function (strId) {
        var me = this;
        var obj = {
            data: me.dtCoSoDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "TEN",
                order: "unorder"
            },
            renderPlace: [strId],
            title: "Chọn cơ sở đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_VaiTro: function (strId) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "TEN",
                order: "unorder"
            },
            renderPlace: [strId],
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
    },
};