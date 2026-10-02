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
function DuyetBuoiHoc() { };
DuyetBuoiHoc.prototype = {
    strDuyetBuoiHoc_Id: '',
    dtGiangVien:[],
    dtDuyetBuoiHoc: [],
    dtDoiTuong_View: [],
    strHead: '',
    strLoaiXacNhan: '',
    init: function () {

        var me = this;
        me.strHead = $("#tblDuyetBuoiHoc thead").html();
        me.getList_KeHoach();
        me.getList_HocPhan();
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
        $("#btnSearch").click(function () {
            me.getList_GiangVien();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_GiangVien();
            }
        });
        $("#btnSave").click(function () {
            me.save_DuyetBuoiHoc();
        });

        $('#dropSearch_KeHoach').on('select2:select', function (e) {

            me.getList_HocPhan();
            //me.getList_GiangVien();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            me.getList_LopHocPhan();
            //me.getList_GiangVien();
        });
        $('#dropSearch_LopHocPhan').on('select2:select', function (e) {

            me.getList_GiangVien();
        });
        $("#tblDuyetBuoiHoc").delegate(".chkSelectAll", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_DuyetBuoiHoc", function (addKeyValue) {
            addKeyValue("strNCKH_TinhDiem_KeHoach_Id", edu.util.getValById("dropSearch_KeHoach"));
        });

        $(".btnSave_DuyetBuoiHoc").click(function () {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblDuyetBuoiHoc", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng cần?");
            //    return;
            //}
            //$("#modal_XacNhan").modal("show");
            me.strLoaiXacNhan = "KHOA_XACNHAN_BUOIDAY";
            var x = $("#tblDuyetBuoiHoc .checkdata");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", x.length);
            x.each(function () {
                var icheck = $(this).is(':checked')? 1 : 0;
                var arrId = this.id.replace(/checkX/g, '').split("_");
                var objLopHocPhan = me.dtDuyetBuoiHoc.find(ele => ele.ID === arrId[0]);
                strSanPham_Id = objLopHocPhan.DAOTAO_LOPHOCPHAN_ID + arrId[1] + objLopHocPhan.NGAY + objLopHocPhan.TIETBATDAU + objLopHocPhan.TIETKETTHUC;
                me.save_XacNhanSanPham(strSanPham_Id, icheck, "", me.strLoaiXacNhan);
            })
            //var strLopHocPhan_Id = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id).IDLOPHOCPHAN;

            //me.getList_XacNhanSanPham(strLopHocPhan_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
            //me.getList_XacNhan(strLopHocPhan_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
        });

        $("#btnDongYXacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDuyetBuoiHoc", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => {
                var strSanPham_Id = "";
                var arrId = e.split("_");
                var objLopHocPhan = me.dtDuyetBuoiHoc.find(ele => ele.ID === arrId[0]);
                strSanPham_Id = objLopHocPhan.ID + arrId[1] + objLopHocPhan.THU + objLopHocPhan.TIETBATDAU + objLopHocPhan.TIETKETTHUC;

                me.save_XacNhanSanPham(strSanPham_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
            })
            //var strLopHocPhan_Id = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id).IDLOPHOCPHAN;
            //me.save_XacNhanSanPham(strLopHocPhan_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
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
    

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_GiangVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSGVLichGiangKLGDTheoHP',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_LopHocPhan_Id': edu.util.getValById('dropSearch_LopHocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtGiangVien = dtResult;
                    me.getList_DuyetBuoiHoc();
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
    getList_DuyetBuoiHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSDuLieuLichGiangDuyet',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_LopHocPhan_Id': edu.util.getValById('dropSearch_LopHocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtDuyetBuoiHoc = dtResult;
                    me.genTable_DuyetBuoiHoc(dtResult, iPager);
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
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DuyetBuoiHoc: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblDuyetBuoiHoc";
        $("#tblDuyetBuoiHoc thead").html(me.strHead);
        var arrDoiTuong = me.dtGiangVien;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th style="text-align: center" class="border-left"><input type="checkbox" class="chkSelectAll pointer" id="chkSelectAll_' + arrDoiTuong[j].ID + '"></td>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="text-center border-left text-white" scope="col" style="background-color: #23429d;">Xác nhận</th>');
            $("#" + strTable_Id + " thead tr:eq(1)").append('<th class="text-center border-left text-white" scope="col" style="background-color: #1b3276;">Tình trạng</th>');
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th colspan="3" class="td-center  border-left">' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_HODEM) + ' ' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_TEN) + ' - ' + edu.util.returnEmpty(arrDoiTuong[j].NGUOIDUNG_MASO) + '</th>');
        }

        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "THU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return (aData.SOTIET) + " (" + aData.TIETBATDAU + " -> " + aData.TIETKETTHUC + ")";
                    }
                }
            ]
        };
        var htmlfoot = "";
        arrDoiTuong.forEach(e => {
            htmlfoot += '<td colspan="3" id="sum' + e.ID + '"></td>';
        })
        $("#" + strTable_Id + " tfoot tr:eq(0)").html('<td colspan="' + (jsonForm.aoColumns.length+ 1) + '"></td>' + htmlfoot )
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<div id="divcheck_' + aData.ID + '_' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID + '"></div>';
                        //return '<input type="checkbox" id="lblDiem_' + aData.ID + '_' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID + '" class="check' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID +'" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<span id="xacnhan_' + aData.ID + '_' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID + '"></span>';
                        //return '<input type="checkbox" id="lblDiem_' + aData.ID + '_' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID + '" class="check' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID +'" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="tinhtrang_' + aData.ID + '_' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID + '"></span>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        //if (data.rsNhanSu.length > 0) {
        //    edu.system.genHTML_Progress("divprogessdata", data.rsNhanSu.length * data.rsLoaiSanPham.length);
        //}
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < arrDoiTuong.length; j++) {
                me.getList_KetQua(data[i], arrDoiTuong[j].ID);
            }
        }
        edu.system.genHTML_Progress("zoneprocessDuyetBuoiHoc", (data.length * arrDoiTuong.length));
        /*III. Callback*/
    },
    

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSKeHoachKLGDChiTiet',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
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
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSHocPhanTinhKLGDTheoKhoaQL',
            'type': 'GET',
            'strKLGD_KeHoachChiTiet_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_HocPhan(dtResult, iPager);
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
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender(nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + ' - ' + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_LopHocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSLopHocPhanDuyet',
            'type': 'GET',
            'strKLGD_KeHoachChitiet_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_LopHocPhan(dtResult, iPager);
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
    genCombo_LopHocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender(nRow, aData) {
                    return edu.util.returnEmpty(aData.TENLOP) + ' - ' + edu.util.returnEmpty(aData.MALOP);
                }
            },
            renderPlace: ["dropSearch_LopHocPhan"],
            title: "Chọn lớp học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_KetQua: function (objLichGiang, strNguoiDung_Id) {
        var me = this;
        $("#divcheck_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left').addClass('td-center');
        $("#xacnhan_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left');
        $("#tinhtrang_" + objLichGiang.ID + "_" + strNguoiDung_Id).parent().addClass('border-left');
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayKQXacNhanVaDiemDanhLG',
            'type': 'GET',
            'strNguoiDung_Id': strNguoiDung_Id,
            'strKLGD_DuLieu_LichGiang_Id': objLichGiang.ID,
            'strKLGD_KeHoachChitiet_Id': objLichGiang.KLGD_KEHOACHCHITIET_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    if (dtResult.length) {
                        dtResult = dtResult[0];
                        dtResult.COLICH != '0' ? $("#divcheck_" + objLichGiang.ID + "_" + strNguoiDung_Id).html('<input type="checkbox" id="checkX' + objLichGiang.ID + '_' + strNguoiDung_Id + '" class="check' + strNguoiDung_Id + ' checkdata" />') : null;
                        var lblXacNhan = "";
                        switch (dtResult.XACNHANDONGY_KHONGDONGY) {
                            case "1": { lblXacNhan = '<span><i class="fas fa-check-circle text-success"></i></span>'; $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).prop('checked', true); $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).attr('checked', 'checked'); $("#checkX" + objLichGiang.ID + '_' + strNguoiDung_Id).attr('name', (objLichGiang.SOTIET));}; break;
                            case "0": lblXacNhan = '<span><i class="fas fa-times-circle text-danger"></i></span>'; break;
                            default: lblXacNhan = "";
                        }
                        $("#xacnhan_" + objLichGiang.ID + "_" + strNguoiDung_Id).html(lblXacNhan)
                        var lblDiemDanh = "";
                        switch (dtResult.TINHTRANGDIEMDANH) {
                            case "1": lblDiemDanh = 'Có điểm danh'; break;
                            case "0": lblDiemDanh = 'Không điểm danh'; break;
                            default: lblDiemDanh = "";
                        }
                        $("#tinhtrang_" + objLichGiang.ID + "_" + strNguoiDung_Id).html(lblDiemDanh)
                    }
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
            complete: function () {
                edu.system.start_Progress("zoneprocessDuyetBuoiHoc", function () {
                    me.dtGiangVien.forEach(e => {
                        var iTongSo = 0;
                        var x = $(".check" + e.ID).each(function () {
                            if ($(this).is(':checked')) {
                                iTongSo += parseInt($(this).attr("name"))
                            }
                        })
                        $("#sum" + e.ID).html("Tổng số tiết: " + iTongSo);
                    });
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'TKGG_XacNhan/Them_KLGD_QuanLy_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strHanhDong_Id': strTinhTrang_Id,
            'strNguoiXacNhan_Id': edu.system.userId,
            'strThongTinXacNhan': strNoiDung,
            'strDuLieuXacNhan': strSanPham_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_GiangVien();
                });
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/DSA4BRIFKCQsHhkgIg8pIC8P',
            'func': 'pkg_diem_chung.LayDSDiem_XacNhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
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
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
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
                    "mDataProp": "TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
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