/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function GiangVienDayHoc() { };
GiangVienDayHoc.prototype = {
    strGiangVienDayHoc_Id: '',
    dtGiangVienDayHoc: [],
    dtCongCu: [],
    dtTheoNgay: [],
    dtTheoLop: [],
    strHead: '',
    dtNgayHoc: [],
    strLopHocPhan_Id: '',
    dtSinhVien: [],


    init: function () {
        var me = this;
        me.strHead = $("#tblSinhVien thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("HOTROHOC.CONGCUHOC", "", "", data => { me.dtCongCu = data });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {
            me.getList_GiangVienDayHoc();
            $("#txtSearch_NgayTimKiem").val(edu.util.dateToday());
            me.getList_TheoNgay();
            //me.getList_Lop();
            //me.getList_TheoNgay();
        });
        $("#btnSaveTheoKy").click(function () {
            var arrSave = [];
            me.dtGiangVienDayHoc.forEach(aData => {
                var strId = aData.ID;
                //--Edit
                var obj_save = {
                    'action': 'SV_LopHoc_CauHinh_GV/Sua_HoTro_LopHoc_CauHinh_GV_1',
                    'type': 'POST',
                    'strId': strId,
                    'strCongCuHoc_Id': edu.util.getValById('dropCongCu_' + strId),
                    'strThongTinVaoHeThongHoc': edu.util.getValById('txtThongTinVao_' + strId),
                    'strThongTinXacThucVaoHoc': edu.util.getValById('txtThongTinXacThuc_' + strId),
                    'strNguoiThucHien_Id': edu.system.userId,
                };
                var check = edu.util.returnEmpty(aData.CONGCUHOC_ID) + edu.util.returnEmpty(aData.THONGTINVAOHETHONGHOC) + edu.util.returnEmpty(aData.THONGTINXACTHUCVAOHOC);
                if (obj_save.strCongCuHoc_Id + obj_save.strThongTinVaoHeThongHoc + obj_save.strThongTinXacThucVaoHoc != check) arrSave.push(obj_save);
            });
            if (arrSave.length > 0) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrSave.length);
                arrSave.forEach(e => me.save_GiangVienDayHoc(e));
            }
            else
                edu.system.alert("Không có thay đổi để lưu");
        });
        
        $("#btnSearch").click(function () {
            me.getList_TheoNgay();
        });
        $("#txtSearch_NgayTimKiem").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TheoNgay();
            }
        });
        $("#btnSaveTheoNgay").click(function () {
            var arrSave = [];
            me.dtTheoNgay.forEach(aData => {
                var strId = aData.ID;
                //--Edit
                var obj_save = {
                    'action': 'SV_LopHoc_Lich_GV/Sua_HoTro_LopHoc_Lich_GV_1',
                    'type': 'POST',
                    'strId': strId,
                    'strCongCuHoc_Id': edu.util.getValById('dropCongCu_' + strId),
                    'strThongTinVaoHeThongHoc': edu.util.getValById('txtThongTinVao_' + strId),
                    'strThongTinXacThucVaoHoc': edu.util.getValById('txtThongTinXacThuc_' + strId),
                    'strNguoiThucHien_Id': edu.system.userId,
                };
                var check = edu.util.returnEmpty(aData.CONGCUHOC_ID) + edu.util.returnEmpty(aData.THONGTINVAOHETHONGHOC) + edu.util.returnEmpty(aData.THONGTINXACTHUCVAOHOC);
                if (obj_save.strCongCuHoc_Id + obj_save.strThongTinVaoHeThongHoc + obj_save.strThongTinXacThucVaoHoc != check) arrSave.push(obj_save);
            });
            if (arrSave.length > 0) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrSave.length);
                arrSave.forEach(e => me.save_TheoNgay(e));
            }
            else
                edu.system.alert("Không có thay đổi để lưu");
        });
        $("#tblTheoNgay").delegate(".btnXacNhan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có xác nhận vào lớp không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(strId);
            });
        });


        $("#tblTheoLop").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_edit();
                me.strLopHocPhan_Id = strId;
                me.getList_NgayHoc();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });


    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoTro_Chung/LayDSThoiGian',
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
                    me.genCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                selectOne: true
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropSearch_ThoiGian").trigger({ type: 'select2:select' });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_GiangVienDayHoc: function (obj_save) {
        var me = this;
        var obj_notify = {};
        
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_GiangVienDayHoc();
                    me.getList_NgayHoc();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_GiangVienDayHoc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_CauHinh_GV/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_LopHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strGiangVien_Id': edu.system.userId,
            'strCongCuHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGiangVienDayHoc = dtReRult;
                    me.genTable_Lop(dtReRult, data.Pager);
                    me.genTable_GiangVienDayHoc(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_GiangVienDayHoc: function (data, iPager) {
        var me = this;
        $("#lblGiangVienDayHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTheoKy",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GiangVienDayHoc.getList_GiangVienDayHoc()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropCongCu_' + aData.ID + '" class="select-opt" style="width:100% !important" ></select>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThongTinVao_' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.THONGTINVAOHETHONGHOC) + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) { 
                        return '<input id="txtThongTinXacThuc_' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.THONGTINXACTHUCVAOHOC) + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => me.genComBo_CongCu("dropCongCu_" + e.ID, e.CONGCUHOC_ID));
        
        /*III. Callback*/
    },
    genComBo_CongCu: function (strTinhTrang_Id, default_val) {
        var me = this;
        console.log(me.dtCongCu)
        var obj = {
            data: me.dtCongCu,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val,
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn công cụ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/

    save_TheoNgay: function (obj_save) {
        var me = this;
        var obj_notify = {};

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TheoNgay();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TheoNgay: function (strDanhSach_Id) {
        var me = this;
        if (!edu.util.getValById('txtSearch_NgayTimKiem')) return;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_Lich_GV/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strCongCuHoc_Id': edu.util.getValById('dropAAAA'),
            'strNgayVao': edu.util.getValById('txtAAAA'),
            'strNgayHoc': edu.util.getValById('txtSearch_NgayTimKiem'),
            'strHoTroHoc_LopHoc_Lich_Id': edu.util.getValById('dropAAAA'),
            'strTrangThaiGhiNhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_LopHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strGiangVien_Id': edu.system.userId,
            'strNgay': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTheoNgay = dtReRult;
                    me.genTable_TheoNgay(dtReRult, data.Pager);
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
    genTable_TheoNgay: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTheoNgay",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GiangVienDayHoc.getList_TheoNgay()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropCongCu_' + aData.ID + '" class="select-opt" style="width:100% !important" ></select>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThongTinVao_' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.THONGTINVAOHETHONGHOC) + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThongTinXacThuc_' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.THONGTINXACTHUCVAOHOC) + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return "Thứ " + edu.util.returnEmpty(aData.THU) +", ngày " + edu.util.returnEmpty(aData.NGAY) +", " + edu.util.returnEmpty(aData.GIO) +"h:" + edu.util.returnEmpty(aData.PHUT);
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXacNhan" id="' + aData.ID + '">Xác nhận</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => me.genComBo_CongCu("dropCongCu_" + e.ID, e.CONGCUHOC_ID));
        /*III. Callback*/
    },

    save_XacNhan: function (strId) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_LopHoc_CauHinh_GV/Sua_HoTro_LopHoc_Lich_GV_2',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TheoNgay();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_Lop: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_CauHinh_GV/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_LopHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strGiangVien_Id': edu.system.userId,
            'strCongCuHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTheoLop= dtReRult;
                    me.genTable_Lop(dtReRult, data.Pager);
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
    genTable_Lop: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblTheoLop",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GiangVienDayHoc.getList_Lop()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.DANGKY_LOPHOCPHAN_ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_NgayHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_Chung/LayDSNgayHocTheoLop',
            'type': 'GET',
            'strDangKy_LopHocPhan_Id': me.strLopHocPhan_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNgayHoc = dtReRult;
                    me.getList_SinhVien();
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
    getList_SinhVien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_Chung/LayDSSVTheoLop',
            'type': 'GET',
            'strDangKy_LopHocPhan_Id': me.strLopHocPhan_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = dtReRult;
                    me.genTable_SinhVien(dtReRult, data.Pager);
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

    genTable_SinhVien: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblSinhVien";
        $("#tblSinhVien thead").html(me.strHead);
        for (var j = 0; j < me.dtNgayHoc.length; j++) {
            var aData = me.dtNgayHoc[j];
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th class="td-center">Thứ ' + edu.util.returnEmpty(aData.THU) +", ngày " + edu.util.returnEmpty(aData.NGAY) +", " + edu.util.returnEmpty(aData.GIO) +"h:" + edu.util.returnEmpty(aData.PHUT) + '</th>');
        }
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                }
            ]
        };
        for (var j = 0; j < me.dtNgayHoc.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<div id="lblSinhVien_' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.GiangVienDayHoc.dtNgayHoc[iThuTu].ID + '"></div>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        for (var j = 0; j < me.dtNgayHoc.length; j++) {
            me.getList_KetQua(me.dtNgayHoc[j].ID);
        }
    },

    getList_KetQua: function (strHoTroHoc_LopHoc_Lich_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_LopHoc_Chung/LayKQVaoHocCuaNguoiHoc',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strHoTroHoc_LopHoc_Lich_Id': strHoTroHoc_LopHoc_Lich_Id,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var json = data.Data[i];
                        if (json.NGAYVAO)$("#lblSinhVien_" + json.QLSV_NGUOIHOC_ID + "_" + strHoTroHoc_LopHoc_Lich_Id).html("Ngày " + edu.util.returnEmpty(json.NGAYVAO) + " " + edu.util.returnEmpty(json.GIOVAO) + ":" + edu.util.returnEmpty(json.PHUTVAO) + ":" + edu.util.returnEmpty(json.GIAYVAO));
                    }
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
}