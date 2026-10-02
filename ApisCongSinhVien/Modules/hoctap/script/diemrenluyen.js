/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 02/8/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DiemRenLuyen() { };
DiemRenLuyen.prototype = {
    dtRenLuyen: [],
    init: function () {
        var me = this;
        me.getList_KeHoach();
        edu.system["strTypeCheckFile"] = ".pdf";
        $("#btnSearch").click(function () {
            me.getList_RenLuyen();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_RenLuyen();
        });
        $("#btnSave_RenLuyen").click(function () {
            var arrThem = [];
            $(".inputdiem").each(function () {
                var point = this;
                if ($(point).val() != $(point).attr("name")) {
                    console.log($(point).attr("name"))
                    arrThem.push(point.id);
                }
            });
            console.log(me.dtRenLuyen);
            me.dtRenLuyen.forEach(aData => {
                if (aData.NHAPTRUCTIEP) edu.system.saveFiles("txtFileDinhKem" + aData.THANHPHAN_ID, edu.system.userId + aData.DRL_KEHOACH_ID + aData.THANHPHAN_ID, "SV_Files");
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
                    me.save_RenLuyen(e, $("#" + e).val());
                });
                
            });
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'XLHV_RL_TinhToan_MH/DSA4BRIKJAkuICIp',
            'func': 'pkg_diemrenluyen_tinhtoan.LayDSKeHoach',
            'iM': edu.system.iM,
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
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
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

    save_RenLuyen: function (strThanhPhan_Id, strThanhPhan_GiaTri) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_RL_TinhToan_MH/FSkkLB4FEw0eAiA0FTM0IgkoJC8VKSgeCiQ1EDQg',
            'func': 'pkg_diemrenluyen_tinhtoan.Them_DRL_CauTrucHienThi_KetQua',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strThanhPhan_Id': strThanhPhan_Id,
            'strThanhPhan_GiaTri': strThanhPhan_GiaTri,
            'strPhamViApDung_Id': edu.system.userId,
            'strDRL_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    me.getList_RenLuyen();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_RenLuyen: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_RL_TinhToan_MH/DSA4BRIFEw0eAiA0FTM0IgkoJC8VKSgP',
            'func': 'pkg_diemrenluyen_tinhtoan.LayDSDRL_CauTrucHienThi',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDRL_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtRenLuyen"] = dtReRult;
                    
                    me.genTab_RenLuyen(dtReRult);
                    me.getList_KetQua();
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
    genTab_RenLuyen: function (data) {
        var me = this;
        var html = '';
        var arrFile = [];
        data.forEach(aData => {
            if (data.find(e => e.THANHPHAN_CHA_ID === aData.THANHPHAN_ID)) {
                html += '<tr>';
                html += '<td colspan="5" class="lh-1">';
                html += '<p class="mb-1">';
                html += edu.util.returnEmpty(aData.THANHPHAN_TEN);
                html += '</p>';
                html += '</td>';
                html += '</tr>';
            } else {
                html += '<tr>';
                html += '<td class="">';
                html += '<div class="d-flex justify-content-between spn-ctrow">';
                html += '<span>' + edu.util.returnEmpty(aData.THANHPHAN_TEN); +'</span>';
                html += '</div>';
                html += '</td>';
                html += '<td>';
                html += '<div class="input-group no-icon " style="height: 32px;">';
                if (aData.NHAPTRUCTIEP)
                    html += '<input type="text" class="form-control text-center inputdiem" id="' + aData.THANHPHAN_ID + '" style="width: 50px; height: 32px;" placeholder="" name="" value="">';
                else html += '<input type="text" class="form-control text-center" id="' + aData.THANHPHAN_ID + '" style="width: 50px; height: 32px;" placeholder="" name="" value="" readonly="readonly">';
                html += '</div>';
                html += '</td>';
                html += '<td></td>';
                html += '<td></td>';
                html += '<td id="txtFileDinhKem' + aData.THANHPHAN_ID +'"></td>';
                html += '</tr>';
                if (aData.NHAPTRUCTIEP) arrFile.push("txtFileDinhKem" + aData.THANHPHAN_ID);
            }
        });
        $("#tblDiemRenLuyen tbody").html(html);
        edu.system.uploadFiles(arrFile);
        setTimeout(function () {
            data.forEach(aData => {
                edu.system.viewFiles("txtFileDinhKem" + aData.THANHPHAN_ID, edu.system.userId + aData.DRL_KEHOACH_ID + aData.THANHPHAN_ID, "SV_Files");
            })
        }, 300);
    },

    getList_KetQua: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_RL_TinhToan_MH/DSA4BRIKJDUQNCAP',
            'func': 'pkg_diemrenluyen_tinhtoan.LayDSKetQua',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDRL_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me["dtRenLuyen"] = dtReRult;
                    if (dtReRult.rsThongTin.length > 0) {
                        me.viewForm_CaNhan(dtReRult.rsThongTin[0])
                    }
                    me.genTab_KetQua(dtReRult.rs);
                }
                else {
                    edu.system.alert( " : " + data.Message, "s");
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
    genTab_KetQua: function (data) {
        var me = this;
        data.forEach(aData => {
            var point = $("#" + aData.THANHPHAN_ID);
            point.val(edu.util.returnEmpty(aData.THANHPHAN_GIATRI));
            point.attr("name", edu.util.returnEmpty(aData.THANHPHAN_GIATRI));
        })
    },
    viewForm_CaNhan: function (aData) {
        var me = this;
        //call popup --Edit
        //view data --Edit
        edu.util.viewHTMLById("lblHoTen", aData.HODEM + " " + aData.TEN);
        edu.util.viewHTMLById("lblNgaySinh", aData.QLSV_NGUOIHOC_NGAYSINH);
        edu.util.viewHTMLById("lblMaSo", aData.MASO);
        edu.util.viewHTMLById("lblLop", aData.DAOTAO_LOPQUANLY_TEN);
        edu.util.viewHTMLById("lblKhoaQuanLy", aData.DAOTAO_KHOAQUANLY_TEN);
        edu.util.viewHTMLById("lblKhoaDaoTao", aData.DAOTAO_KHOADAOTAO_TEN);
        edu.util.viewHTMLById("lblHocKy", aData.DAOTAO_THOIGIANDAOTAO_KY);
        edu.util.viewHTMLById("lblNamHoc", aData.DAOTAO_THOIGIANDAOTAO_NAM);
    },
}