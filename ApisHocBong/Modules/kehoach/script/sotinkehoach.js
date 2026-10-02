/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function SoTinKeHoach() { };
SoTinKeHoach.prototype = {
    strSoTinKeHoach_Id: '',
    dtSoTinKeHoach: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        //me.getList_SoTinKeHoach();
        me.getList_QuyHocBong();
        me.getList_ThoiGian();
        //me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("HB.QUYTAC.TINHSOTINCHITOITHIEU", "dropQuyTacKhoiTao");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        
        $("#btnXoaSoTinKeHoach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSoTinKeHoach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SoTinKeHoach(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_SoTinKeHoach();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SoTinKeHoach();
            }
        });

        $("#btnSave_SoTinKeHoach").click(function () {
            var arrThem = [];
            $(".inputxau").each(function () {
                var point = this;
                if ($(point).val() != $(point).attr("name")) {
                    arrThem.push(point.id.split('_')[1]);
                }
            });
            if (!arrThem.length) {
                edu.system.alert("Không có thay đổi để lưu");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length);
                arrThem.forEach(e => {
                    me.save_SoTinKeHoach(e);
                });
            });
        });
        $("#btnKhoiTao").click(function () {
            me.save_KhoiTao();
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyHocBong: function () {
        var me = this;
        var obj_save = {
            'action': 'XLHV_HB_ThongTin_MH/DSA4BRIJAx4QNDgJLiIDLi8m',
            'func': 'pkg_hocbong_thongtin.LayDSHB_QuyHocBong',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.system.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_QuyHocBong(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_QuyHocBong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_QuyHocBong"],
            title: "Chọn quỹ học bổng"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGian: function () {
        var me = this;
        var obj_save = {
            'action': 'XLHV_HB_Chung_MH/DSA4BRIVKS4oBiggLxUpJC4KJAkuICIp',
            'func': 'pkg_hocbong_chung.LayDSThoiGianTheoKeHoach',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_ThoiGian(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGian: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_SoTinKeHoach: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_HB_ThongTin_MH/EjQgHgkDHhA0OAUoLykeEi4VKC8FIC8mCjgP',
            'func': 'pkg_hocbong_thongtin.Sua_HB_QuyDinh_SoTinDangKy',
            'iM': edu.system.iM,
            'strId': strId,
            'dSoQuyDinh': edu.system.getValById('txtSoTin_' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
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
                    me.getList_SoTinKeHoach();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_KhoiTao: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_HB_TinhToan_MH/CikuKBUgLgU0DSgkNBUoLykSLhUoLwIpKAPP',
            'func': 'pkg_hocbong_tinhtoan.KhoiTaoDuLieuTinhSoTinChi',
            'iM': edu.system.iM,
            'strHB_QuyHocBong_Id': edu.system.getValById('dropSearch_QuyHocBong'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strQuyTacTinhSoTin_Id': edu.system.getValById('dropQuyTacKhoiTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
                }
                me.getList_SoTinKeHoach();
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
    getList_SoTinKeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_HB_ThongTin_MH/DSA4BRIJAx4QNDgFKC8pHhIuFSgvAiko',
            'func': 'pkg_hocbong_thongtin.LayDSHB_QuyDinh_SoTinChi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch_TuKhoa'),
            'strHB_QuyHocBong_Id': edu.system.getValById('dropSearch_QuyHocBong'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSoTinKeHoach = dtReRult;
                    me.genTable_SoTinKeHoach(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SoTinKeHoach: function (data, iPager) {
        $("#lblSoTinKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblSoTinKeHoach",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.SoTinKeHoach.getList_SoTinKeHoach()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "PHANCAPPHAMVI_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtSoTin_' + aData.ID + '" class="form-control inputxau" value="' + edu.util.returnEmpty(aData.SOQUYDINH) + '" name="' + edu.util.returnEmpty(aData.SOQUYDINH) + '"/>';
                    }
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
}