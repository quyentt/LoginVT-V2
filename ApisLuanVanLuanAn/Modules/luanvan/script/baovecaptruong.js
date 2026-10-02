/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 20/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function BaoVeCapTruong() { };
BaoVeCapTruong.prototype = {
    strBaoVeCapTruong_Id: '',
    dtBaoVeCapTruong: [],
    dtHeDaoTao: [],
    dtKhoaDaoTao: [],
    arrNhanSu_Id: [],
    dtVaiTro: [],
    strChuongTrinh_Id: '',
    strLop_Id: '',
    strHocVien_Id: '',
    dtDanhGia: [],
    dtXacNhan: [],
    init: function () {

        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            if (edu.util.getValById("dropSearch_KeHoach") == "") {
                edu.system.alert("Bạn cần chọn kế hoạch");
                return;
            }
            me.rewrite();
            me.toggle_form_input();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        /*------------------------------------------
        --Discription: 
        --Order: 
        -------------------------------------------*/
        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_BaoVeCapTruong();
        });
        $(".btnSearch").click(function () {
            me.getList_BaoVeCapTruong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_BaoVeCapTruong();
            }
        });
        $("#btnSave").click(function () {
            me.save_BaoVeCapTruong();
        });
        $(".btnDelete").click(function () {
            if (edu.util.checkValue(me.strBaoVeCapTruong_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_BaoVeCapTruong();
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblBaoVeCapTruong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_form_input();
                me.strBaoVeCapTruong_Id = strId;
                me.getList_BaoVeCapTruong_HuongDan();
                me.getList_BaoVeCapTruong_ThanhVien();
                me.getList_BaoVeCapTruong_Lich();
                edu.util.setOne_BgRow(strId, "tblBaoVeCapTruong");
                me.viewForm_BaoVeCapTruong(edu.util.objGetOneDataInData(strId, me.dtBaoVeCapTruong, "ID"));
                edu.system.hiddenElement('{"readonlyselect2": "#dropHeDaoTao,#dropKhoaDaoTao,#dropChuongTrinh,#dropLop,#dropHocVien","readonly": "#txtSoQuyetDinh,#txtNgayQuyetDinh,#txtTenDeCuongTiengViet,#txtTenDeCuongTiengAnh,#txtNgayDangKy,#txtMoTa"}');
                me.getList_XacNhanSanPham(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_NhanSu").click(function () {
            edu.extend.genModal_LLKH();
            edu.extend.getList_LLKH("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInputDanhSachNhanSu").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_BaoVeCapTruong_ThanhVien(strNhanSu_Id);
                });
            }
        });

        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $('#dropHeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao(this.value);
        });
        $('#dropKhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao(this.value);
            me.getList_LopQuanLy(this.value, "");
        });
        $('#dropChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy("", this.value);
        });
        $('#dropLop').on('select2:select', function (e) {
            var x = $(this).val();
            me.getList_SinhVien(this.value);
        });
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $("#btnThemLich").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_BaoVeCapTruong_Lich(id, "");
        });
        $("#zone_input_BaoVeCapTruong").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_Lich tr[id='" + strRowId + "']").remove();
        });
        $("#zone_input_BaoVeCapTruong").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_BaoVeCapTruong_Lich(strId);
            });
        });
        $("#hoidongdanhgia").delegate(".btnXacNhanBV", "click", function () {
            $("#modal_XacNhan").modal("show");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function (e) {
            //e.stopImmediatePropagation();
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            $("#modal_XacNhan").modal('hide');
            if (me.strBaoVeLuanVan_Id != "") {
                arrChecked_Id = [me.strBaoVeCapTruong_Id];
            } else {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblHoiDongThongQua", "checkX");
            }
            if (arrChecked_Id.length > 0) {
                edu.system.alert('<div id="zoneprocessXacNhan"></div>');
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanSanPham(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.loadToCombo_DanhMucDuLieu("XLHV.XNKK", "", "", me.loadBtnXacNhan, "Tất cả tình trạng xác nhận", "HESO1");
        me.getList_BaoVeCapTruong();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_KeHoach();
        edu.system.loadToCombo_DanhMucDuLieu("LVLA.VTHDONG", "", "", function (data) {
            main_doc.BaoVeCapTruong.dtVaiTro = data;
        });
        edu.system.loadToCombo_DanhMucDuLieu("LVLA.DGHD", "", "", function (data) {
            main_doc.BaoVeCapTruong.dtDanhGia = data;
        });
    },
    loadBtnXacNhan: function (data) {
        main_doc.BaoVeCapTruong.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_BaoVeCapTruong");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_BaoVeCapTruong");
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strBaoVeCapTruong_Id = "";
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", "");
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropLop", "");
        edu.util.viewValById("dropHocVien", "");
        edu.util.viewValById("txtTenDeCuongTiengViet", "");
        edu.util.viewValById("txtTenDeCuongTiengAnh", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("txtNgayDangKy", "");
        me.strChuongTrinh_Id = "";
        me.strLop_Id = "";
        me.strHocVien_Id = "";
        $("#tblInputDanhSachNhanSu tbody").html("");
        
    },

    getList_BaoVeCapTruong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_DeCuong_ChinhThuc/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiDangKy_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.dtBaoVeCapTruong = dtResult;
                    me.genTable_BaoVeCapTruong(dtResult, iPager);
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
    save_BaoVeCapTruong: function () {
        var me = this;
        var strId = me.strBaoVeCapTruong_Id;
        $("#tblInputDanhSachNhanSu tbody tr").each(function () {
            var strNhanSu_Id = this.id.replace(/rm_row/g, '');
            me.save_BaoVeCapTruong_ThanhVien(strNhanSu_Id, strId, $(this).attr("name"));
        });
        $("#tbl_Lich tbody tr").each(function () {
            var strLich_Id = this.id.replace(/rm_row/g, '');
            me.save_BaoVeCapTruong_Lich(strLich_Id, strId, $(this).attr("name"));
        });
    },
    delete_BaoVeCapTruong: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'LVLA_DeCuong_DangKy/Xoa',

            'strIds': me.strBaoVeCapTruong_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.toggle_notify();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

                me.getList_BaoVeCapTruong();
            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_BaoVeCapTruong: function (data, iPager) {
        var me = this;
        $("#lblBaoVeCapTruong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblBaoVeCapTruong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.BaoVeCapTruong.getList_BaoVeCapTruong()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 9],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "TENTIENGVIET"
                },
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    viewForm_BaoVeCapTruong: function (data) {
        var me = main_doc.BaoVeCapTruong;
        //view data --Edit
        edu.util.viewValById("dropHeDaoTao", data.DAOTAO_HEDAOTAO_ID);
        edu.util.viewValById("dropKhoaDaoTao", data.DAOTAO_KHOADAOTAO_ID);
        edu.util.viewValById("dropChuongTrinh", data.DAOTAO_CHUONGTRINH_ID);
        edu.util.viewValById("dropLop", data.DAOTAO_LOPQUANLY_ID);
        edu.util.viewValById("dropHocVien", data.QLSV_NGUOIHOC_ID);
        edu.util.viewValById("txtTenDeCuongTiengViet", data.TENTIENGVIET);
        edu.util.viewValById("txtTenDeCuongTiengAnh", data.TENTIENGANH);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtNgayDangKy", data.NGAYDANGKY);
        edu.util.viewValById("dropSearch_KeHoach", data.LVLA_KEHOACH_DECUONG_ID);
        edu.util.viewValById("txtSoQuyetDinh", data.SOQUYETDINH);
        edu.util.viewValById("txtNgayQuyetDinh", data.NGAYQUYETDINH);
        me.strChuongTrinh_Id = data.DAOTAO_CHUONGTRINH_ID;
        me.strLop_Id = data.DAOTAO_LOPQUANLY_ID;
        me.strHocVien_Id = data.QLSV_NGUOIHOC_ID;
        me.getList_ChuongTrinhDaoTao(data.DAOTAO_KHOADAOTAO_ID);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_BaoVeCapTruong_HuongDan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_DeCuong_ChinhThuc_HuongDan/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_DeCuong_DangKy_Id': me.strBaoVeCapTruong_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiHuongDan_Id': edu.util.getValById('dropAAAA'),
            'strVaiTro_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_KeHoach_DeCuong_Id': me.dtBaoVeCapTruong.find(e => e.ID === me.strBaoVeCapTruong_Id).LVLA_KEHOACH_DECUONG_ID,
            'strLVLA_DeCuong_ChinhThuc_Id': me.strBaoVeCapTruong_Id,
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
                    }
                    me.genTable_BaoVeCapTruong_HuongDan(dtResult);
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
    genTable_BaoVeCapTruong_HuongDan: function (data) {
        var me = this;
        //3. create html
        $("#tblDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].NGUOIHUONGDAN_ID + "' name='" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].NGUOIHUONGDAN_HOTEN + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty( data[i].NGUOIHUONGDAN_COQUANCONGTAC) + "</span></td>";
            html += "<td class='td-left'>" + data[i].VAITRO_TEN + "</td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblDanhSachNhanSu tbody").append(html);
        }
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_BaoVeCapTruong_ThanhVien: function (strNhanSu_Id, strBaoVeCapTruong_Id, strId) {
        var me = this;
        //var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit

        var obj_save = {
            'action': 'LVLA_BaoVe_Truong_HoiDong_ThanhVien/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById("dropSearch_KeHoach"),
            'strThanhVien_Id': strNhanSu_Id,
            'strVaiTro_Id': $("#vaitro_" + strNhanSu_Id).val(),
            'strLVLA_DeCuong_ChinhThuc_Id': strBaoVeCapTruong_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropHocVien'),
            'dDiem': $("#txtDiem" + strNhanSu_Id).val(),
            'strDanhGia_Id': $("#danhgia_" + strNhanSu_Id).val(),
            'strNhanXet': $("#txtNhanXet" + strNhanSu_Id).val(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'LVLA_BaoVe_Truong_HoiDong_ThanhVien/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_BaoVeCapTruong_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_BaoVe_Truong_HoiDong_ThanhVien/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById('dropAAAA'),
            'strThanhVien_Id': edu.util.getValById('dropAAAA'),
            'strDanhGia_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strVaiTro_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_DeCuong_ChinhThuc_Id': me.strBaoVeCapTruong_Id,
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
                    }
                    me.genTable_BaoVeCapTruong_ThanhVien(dtResult);
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
    delete_BaoVeCapTruong_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BaoVe_Truong_HoiDong_ThanhVien/Xoa',

            'strIds': strNhanSu_Id,
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
                    me.getList_BaoVeCapTruong_ThanhVien();
                }
                else {
                    obj = {
                        content: "TS_BaoVeCapTruong_NhanSu/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeCapTruong_NhanSu/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_BaoVeCapTruong_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].THANHVIEN_ID + "' name='" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].THANHVIEN_HODEM) + " " + edu.util.returnEmpty(data[i].THANHVIEN_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].THANHVIEN_COQUANCONGTAC) + "</span></td>";
            //html += '<td><input value="' + data[i].DIEM + '" type="text" id="txtDiem' + data[i].THANHVIEN_ID + '" class="form-control" /></td>';
            html += "<td class='td-left'><select id='danhgia_" + data[i].THANHVIEN_ID + "'></select></td>";
            html += '<td><input value="' + edu.util.returnEmpty(data[i].NHANXET) + '" type="text" id="txtNhanXet' + data[i].THANHVIEN_ID + '" class="form-control" /></td>';
            html += "<td class='td-left'><select id='vaitro_" + data[i].THANHVIEN_ID + "'></select></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            $("#vaitro_" + data[i].THANHVIEN_ID).select2();
            $("#danhgia_" + data[i].THANHVIEN_ID).select2();
            me.genCombo_VaiTro("vaitro_" + data[i].THANHVIEN_ID, data[i].VAITRO_ID);
            me.genCombo_DanhGia("danhgia_" + data[i].THANHVIEN_ID, data[i].DANHGIA_ID);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_NhanSu(id, "");
        //}
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
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
        var objNhanSu = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtNhanSu, "ID")
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-left'><span>" + edu.util.returnEmpty(objNhanSu.COQUANCONGTAC) + "</span></td>";
        //html += '<td><input type="text" id="txtDiem' + strNhanSu_Id + '" class="form-control" /></td>';
        html += "<td class='td-left'><select id='danhgia_" + strNhanSu_Id + "'></select></td>";
        html += '<td><input type="text" id="txtNhanXet' + strNhanSu_Id + '" class="form-control" /></td>';
        html += "<td class='td-left'><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html);
        $("#vaitro_" + strNhanSu_Id).select2();
        $("#danhgia_" + strNhanSu_Id).select2();
        me.genCombo_VaiTro("vaitro_" + strNhanSu_Id, "");
        me.genCombo_DanhGia("danhgia_" + strNhanSu_Id, "");
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_KeHoach_DeCuong/LayDanhSach',
            'strTuKhoa': "",
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
                    me.genCombo_KeHoach(dtResult, iPager);
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
    genCombo_KeHoach: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var objList = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strToChucCT_Id) {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'strTuKhoa': "",
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropLop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGenCombo_HocVien(dtResult);
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
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
            renderPlace: ["dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.BaoVeCapTruong;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: "",
                default_val: me.strChuongTrinh_Id
            },
            renderPlace: ["dropChuongTrinh"],
            type: "",
            title: "Chọn chương trình",
        };
        edu.system.loadToCombo_data(obj);
        if (me.strChuongTrinh_Id != "") {
            me.getList_LopQuanLy("", me.strChuongTrinh_Id);
        }
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = main_doc.BaoVeCapTruong;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                default_val: me.strLop_Id
            },
            renderPlace: ["dropLop"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (me.strLop_Id != "") {
            me.getList_SinhVien();
        }
    },
    cbGenCombo_HocVien: function (data) {
        var me = main_doc.BaoVeCapTruong;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return aData.MASO + " - " + aData.HODEM + " " + aData.TEN;
                },
                default_val: me.strHocVien_Id
            },
            renderPlace: ["dropHocVien"],
            type: "",
            title: "Chọn học viên",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocKy_IHD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy_IHD").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.NhapChuyenCan.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genCombo_VaiTro: function (strVaiTro_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strVaiTro_Id],
            type: "",
            title: "Chọn vài trò"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_DanhGia: function (strDanhGia_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtDanhGia,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strDanhGia_Id],
            type: "",
            title: "Chọn đánh giá"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_BaoVeCapTruong_Lich: function (strLich_Id, strDeCuong_Id) {
        var me = this;
        var strId = strLich_Id;
        var strNgay = edu.util.getValById('txtNgay' + strLich_Id);
        var strGio = edu.util.getValById('txtGio' + strLich_Id);
        var strDiaDiem = edu.util.getValById('txtDiaDiem' + strLich_Id);
        if (!edu.util.checkValue(strNgay)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'LVLA_BaoVe_Truong_Lich/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLVLA_DeCuong_ChinhThuc_Id': strDeCuong_Id,
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById("dropSearch_KeHoach"),
            'strQLSV_NguoiHoc_Id': edu.util.getValById("dropHocVien"),
            'strNgay': strNgay,
            'strGio': strGio,
            'strDiaDiem': strDiaDiem,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'LVLA_BaoVe_Truong_Lich/CapNhat';
            me.save_BaoVeLuanVan_Lich_BV(strLich_Id, strDeCuong_Id);
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
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

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_BaoVeLuanVan_Lich_BV: function (strLich_Id, strDeCuong_Id) {
        var me = this;
        var strId = strLich_Id;
        var strTenDeTaiTV_SauBaoVe = edu.util.getValById('txtTiengViet' + strLich_Id);
        var strTenDeTaiTA_SauBaoVe = edu.util.getValById('txtTiengAnh' + strLich_Id);
        var obj_save = {
            'action': 'LVLA_BaoVe_Truong_Lich/Sua_LVLA_Truong_DeTaiSauBaoVe',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLVLA_DeCuong_ChinhThuc_Id': strDeCuong_Id,
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById("dropSearch_KeHoach"),
            'strQLSV_NguoiHoc_Id': edu.util.getValById("dropHocVien"),
            'strTenDeTaiTV_SauBaoVe': strTenDeTaiTV_SauBaoVe,
            'strTenDeTaiTA_SauBaoVe': strTenDeTaiTA_SauBaoVe,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (strId == "") {
                    //    strId = data.Id;
                    //}
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

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_BaoVeCapTruong_Lich: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_BaoVe_Truong_Lich/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_DeCuong_ChinhThuc_Id': me.strBaoVeCapTruong_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
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
                    }
                    me.genHTML_BaoVeCapTruong_Lich_Data(dtResult);
                    me.genHTML_BaoVeLuanVan_Lich_Data_BV(dtResult);
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
    delete_BaoVeCapTruong_Lich: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BaoVe_Truong_Lich/Xoa',

            'strIds': strIds,
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
                    me.getList_BaoVeCapTruong_Lich();
                }
                else {
                    obj = {
                        content: "TS_KeHoach_HeDaoTao/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_KeHoach_HeDaoTao/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_BaoVeCapTruong_Lich_Data: function (data) {
        var me = this;
        $("#tbl_Lich tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strId = data[i].ID;
            var row = '';
            row += '<tr id="' + strId + '" name="aaa">';
            row += '<td style="text-align: center"><label id="txtStt' + strId + '">' + (i + 1) + '</label></td>';
            row += '<td><input value="' + edu.util.returnEmpty(data[i].NGAY) +'" type="text" id="txtNgay' + strId + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" /></td>';
            row += '<td><input value="' + edu.util.returnEmpty(data[i].GIO) +'" type="text" id="txtGio' + strId + '" class="form-control" /></td>';
            row += '<td><input value="' + edu.util.returnEmpty(data[i].DIADIEM) +'" type="text" id="txtDiaDiem' + strId + '" class="form-control" /></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHeKhoa" id="' + strId + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tbl_Lich tbody").append(row);
            
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_BaoVeCapTruong_Lich(id, "");
        }
        edu.system.pickerdate("input-datepicker");
    },
    genHTML_BaoVeLuanVan_Lich_Data_BV: function (data) {
        var me = this;
        $("#tbl_Lich_BV tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strId = data[i].ID;
            var row = '';
            row += '<tr id="' + strId + '" name="aaa">';
            row += '<td style="text-align: center"><label id="txtStt' + strId + '">' + (i + 1) + '</label></td>';
            row += '<td><input value="' + edu.util.returnEmpty(data[i].TENDETAITIENGVIET_SAUBAOVE) + '" type="text" id="txtTiengAnh' + strId + '" class="form-control" /></td>';
            row += '<td><input value="' + edu.util.returnEmpty(data[i].TENDETAITIENGANH_SAUBAOVE) + '" type="text" id="txtTiengViet' + strId + '" class="form-control" /></td>';
            row += '</tr>';
            $("#tbl_Lich_BV tbody").append(row);

        }
    },
    genHTML_BaoVeCapTruong_Lich: function (strId) {
        var me = this;
        var iViTri = document.getElementById("tbl_Lich").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strId + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strId + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtNgay' + strId + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" /></td>';
        row += '<td><input type="text" id="txtGio' + strId + '" class="form-control" /></td>';
        row += '<td><input type="text" id="txtDiaDiem' + strId + '" class="form-control" /></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strId + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tbl_Lich tbody").append(row);
        edu.system.pickerdate("input-datepicker");
    },

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'LVLA_NhanXet_DanhGia/ThemMoi',
            'strId': "",
            'strSanPham_Id': "LVLA_BaoVe_Truong_HoiDong_TV" +strSanPham_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }

                me.getList_XacNhanSanPham();
            },
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXacNhan", function () {
            //        me.getList_HoiDongThongQua();
            //    });
            //},
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
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'LVLA_NhanXet_DanhGia/LayDanhSach',
            'strTuKhoa': "",
            'strsanpham_Id': "LVLA_BaoVe_Truong_HoiDong_TV" + strSanPham_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    var html = "";
                    if (data.Data.length == 0) {
                        html = '<a class="btn btn-default btnXacNhanBV"><i class="fa fa-check"></i> Đánh giá chung</a>';
                    } else {
                        html = '<a class="btn btn-default btnXacNhanBV" style="' + data.Data[0].TINHTRANG_THONGTIN2 + '"><i class="' + data.Data[0].TINHTRANG_THONGTIN1 + '"></i> ' + data.Data[0].TINHTRANG_TEN + '</a>';
                    }
                    $("#hoidongdanhgia").html(html);
                    //me.genTable_XacNhanSanPham(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
};