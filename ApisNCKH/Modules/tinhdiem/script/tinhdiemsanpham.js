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
function TinhDiemSanPham() { };
TinhDiemSanPham.prototype = {
    strTinhDiemSanPham_Id: '',
    dtTinhDiemSanPham: [],
    dtDoiTuong_View: [],
    init: function () {

        var me = this;
        me.page_load();
        me.strHead = $("#tblTinhDiemSanPham thead").html();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
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
        $(".btnSearch").click(function () {
            me.getList_TinhDiemSanPham();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TinhDiemSanPham();
            }
        });
        $("#btnSave").click(function () {
            me.save_TinhDiemSanPham();
        });
        $(".btnDelete").click(function () {
            if (edu.util.checkValue(me.strTinhDiemSanPham_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_TinhDiemSanPham();
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblTinhDiemSanPham").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_form_input();
                me.strTinhDiemSanPham_Id = strId;
                edu.util.setOne_BgRow(strId, "tblTinhDiemSanPham");
                me.viewForm_TinhDiemSanPham(edu.util.objGetOneDataInData(strId, me.dtTinhDiemSanPham, "ID"));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $('#dropSearch_TinhTrang').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //me.getList_TinhDiemSanPham();
        me.getList_CoCauToChuc();
        me.getList_TinhDiem();
        //edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.LOAIHOSO", "", "", me.cbGetList_LoaiHoSo);
        //edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TINHCHATHOSO", "", "", me.cbGetList_TinhChatHoSo);
        edu.system.loadToCombo_DanhMucDuLieu("NCKH.XNKK", "dropSearch_TinhTrang", "", "", "Tất cả tình trạng xác nhận", "HESO1");
        edu.system.getList_MauImport("zonebtnBaoCao_TinhDiemSanPham", function (addKeyValue) {
            addKeyValue("strNCKH_TinhDiem_KeHoach_Id", edu.util.getValById("dropSearch_KeHoach"));
            addKeyValue("strDaoTao_CoCauToChuc_Id", edu.util.getValById("dropSearch_DonVi"));
            addKeyValue("strTinhTrangXacNhan_Id", edu.util.getValCombo("dropSearch_TinhTrang"));
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_TuKhoa"));
        });
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_TinhDiemSanPham");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_TinhDiemSanPham");
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strTinhDiemSanPham_Id = "";
        edu.util.viewValById("txtTenTinhDiemSanPham", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_TinhDiemSanPham: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_PhanBoTinhDiem/LayDSNCKH_TinhDiem_KetQua',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
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
                    me.dtTinhDiemSanPham = dtResult;
                    me.genTable_TinhDiemSanPham(dtResult, iPager);
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
    save_TinhDiemSanPham: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_TinhDiem/TinhDiem_NCKH',


            'strId': me.strTinhDiemSanPham_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (obj_save.strId !== "") {
            obj_save.action = 'NCKH_TinhDiemSanPham_KeHoach/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = data.Id;
                    if (strId != undefined) {
                        edu.system.alert('Thêm mới thành công!');
                    } else {
                        edu.system.alert('Cập nhật thành công!');
                        strId = me.strTinhDiemSanPham_Id;
                    }
                    $("#tbl_HeKhoa tbody tr").each(function () {
                        var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                        if (!edu.util.checkValue($(this).attr("name"))) {// Nếu chưa có dữ liệu thì gọi thêm
                            me.save_TinhDiemSanPham_HeKhoa(strHeKhoa_Id, strId);
                        }
                    });
                    $("#tblInputDanhSachNhanSu tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if (!edu.util.checkValue($(this).attr("name"))) {// Nếu chưa có dữ liệu thì gọi thêm
                            me.save_TinhDiemSanPham_ThanhVien(strNhanSu_Id, strId);
                        }
                    });
                    me.getList_TinhDiemSanPham();
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
    delete_TinhDiemSanPham: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_TinhDiemSanPham_KeHoach/Xoa',

            'strIds': me.strTinhDiemSanPham_Id,
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

                me.getList_TinhDiemSanPham();
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
    genTable_TinhDiemSanPham: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblTinhDiemSanPham";
        $("#tblTinhDiemSanPham thead").html(me.strHead);
        var arrDoiTuong = data.rsLoaiSanPham;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(2)").append('<th class="td-center">Điểm</th>');
            $("#" + strTable_Id + " thead tr:eq(2)").append('<th class="td-center">Giờ chuẩn</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th colspan="2" class="td-center">' + arrDoiTuong[j].TEN + '</th>');
        }
        $("#" + strTable_Id + " thead tr:eq(2)").append('<th class="td-center">Điểm</th>');
        $("#" + strTable_Id + " thead tr:eq(2)").append('<th class="td-center">Giờ chuẩn</th>');
        $("#" + strTable_Id + " thead tr:eq(1)").append('<th colspan="2" class="td-center">Tổng</th>');
        $("#" + strTable_Id + " thead tr:eq(0)").append('<th colspan="' + (arrDoiTuong.length * 2 + 2) + '" class="td-center">Kết quả tính điểm sản phẩm</th>');

        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data.rsNhanSu,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                }
            ]
        };

        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="lblDiem_' + aData.ID + '_' + main_doc.TinhDiemSanPham.dtDoiTuong_View[iThuTu].ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="lblGioChuan_' + aData.ID + '_' + main_doc.TinhDiemSanPham.dtDoiTuong_View[iThuTu].ID + '"></span>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        if (data.rsNhanSu.length > 0) {
            edu.system.genHTML_Progress("divprogessdata", data.rsNhanSu.length * data.rsLoaiSanPham.length);
        }
        for (var i = 0; i < data.rsNhanSu.length; i++) {
            for (var j = 0; j < arrDoiTuong.length; j++) {
                me.getList_KetQua(data.rsNhanSu[i].ID, arrDoiTuong[j].ID);
            }
        }
        /*III. Callback*/
    },
    viewForm_TinhDiemSanPham: function (data) {
        //view data --Edit
        edu.util.viewValById("txtTenTinhDiemSanPham", data.TEN);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtNgayBatDau", data.TUNGAY);
        edu.util.viewValById("txtNgayKetThuc", data.DENNGAY);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.TinhDiemSanPham;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_TinhDiem: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_TinhDiem_KeHoach/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
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
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MOTA",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KetQua: function (strNhanSu_HoSoCanBo_Id, strLoaiSanPham_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_PhanBoTinhDiem/LayKQCaNhan',
            'strNCKH_TinhDiem_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strLoaiSanPham_Id': strLoaiSanPham_Id,
            'strNhanSu_HoSoCanBo_Id': strNhanSu_HoSoCanBo_Id,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var json = data.Data[i];
                        $("#lblDiem_" + strNhanSu_HoSoCanBo_Id + "_" + strLoaiSanPham_Id).html(json.DIEM);
                        $("#lblGioChuan_" + strNhanSu_HoSoCanBo_Id + "_" + strLoaiSanPham_Id).html(json.GIOCHUAN);
                    }
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            complete: function () {
                edu.system.start_Progress("divprogessdata", function () {
                    me.endGetKetQua();
                    //me.getList_ChuaPhanBo();
                });
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
    endGetKetQua: function () {
        var me = this;
        //var arrSum = [];
        //for (var i = 0; i < me.dtDoiTuong_View.length*2; i++) {
        //    arrSum.push(i + 4);
        //}
        //edu.system.insertSumAfterTable("tblTinhDiemSanPham", arrSum);
        var x = $("#tblTinhDiemSanPham tbody")[0].rows;
        for (var i = 0; i < x.length; i++) {
            var strNhanSu_Id = x[i].id;
            var iSumGio = 0;
            var iSumDiem = 0;
            for (var j = 0; j < me.dtDoiTuong_View.length; j++) {
                var diem = $("#lblDiem_" + strNhanSu_Id + '_' + me.dtDoiTuong_View[j].ID).html();
                if (diem == "") diem = 0;
                else {
                    diem = parseFloat(diem);
                }
                var gio = $("#lblGioChuan_" + strNhanSu_Id + '_' + me.dtDoiTuong_View[j].ID).html();
                if (gio == "") gio = 0;
                else {
                    gio = parseFloat(gio);
                }
                iSumDiem += diem;
                iSumGio += gio;
            }
            $(x[i]).append('<td class="bold">' + Math.floor(iSumDiem * 100) / 100 + '</td><td class="bold">' + Math.floor(iSumGio * 100) / 100 + '</td>');
        }
        var arrSum = [];
        for (var i = 0; i < me.dtDoiTuong_View.length * 2; i++) {
            arrSum.push(i + 4);
        }
        arrSum.push(i + 4);
        arrSum.push(i + 5);
        edu.system.insertSumAfterTable("tblTinhDiemSanPham", arrSum);
        //for (var i = 0; i < me.dtTinhDiemSanPham.rsNhanSu.length; i++) {
        //    for(var j=0)
        //}
    }
};