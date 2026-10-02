/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function LopRieng() { };
LopRieng.prototype = {
    strLopRieng_Id: '',
    dtLopRieng: [],
    arrResults_LopRieng: [],
    iTotal_LopRieng: 0,
    iDone_LopRieng: 0,
    strAction_LopRieng: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.getList_ThoiGian();
        me.getList_KhoanThu();

        // Đếm realtime số bản ghi đã tick
        $(document).off("change.lpr", "#tblLopRieng input[type=checkbox]")
            .on("change.lpr", "#tblLopRieng input[type=checkbox]", function () {
                me.updateSelected_Count();
            });

        $("#btnSave_LopRieng").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopRieng", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn chốt " + arrChecked_Id.length + " đối tượng đã chọn không?");
            $("#btnYes").off("click").on("click", function (e) {
                $('#myModalAlert').modal('hide');
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                me.arrResults_LopRieng = [];
                me.iTotal_LopRieng = arrChecked_Id.length;
                me.iDone_LopRieng = 0;
                me.strAction_LopRieng = "Chốt";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_LopRieng(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSaveLai_LopRieng").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopRieng", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn chốt lại " + arrChecked_Id.length + " đối tượng đã chọn không?");
            $("#btnYes").off("click").on("click", function (e) {
                $('#myModalAlert').modal('hide');
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                me.arrResults_LopRieng = [];
                me.iTotal_LopRieng = arrChecked_Id.length;
                me.iDone_LopRieng = 0;
                me.strAction_LopRieng = "Chốt lại";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.saveLai_LopRieng(arrChecked_Id[i]);
                }
            });
        });


        $('#dropSearch_ThoiGian').on('select2:select', function (e) {
            me.getList_KeHoach();
        });
        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_LopRieng();
            me.getList_HocPhan();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            me.getList_LopRieng();
        });
        $("#btnSearch").click(function () {
            me.getList_LopRieng();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_LopRieng();
            }
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strLopRieng_Id = "";
        edu.util.viewValById("dropKhoanThu", edu.util.getValById("dropSearch_KhoanThu"));
        edu.util.viewValById("dropDoiTac", edu.util.getValById("dropSearch_DoiTac"));
        edu.util.viewValById("dropHinhThuc", edu.util.getValById("dropSearch_HinhThuc"));
        //edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        //edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtTKNo", "");
        edu.util.viewValById("txtTKCo", "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoanThu: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_ThuChi_MH/DSA4BRICICIKKS4gLxUpNAPP',
            'func': 'pkg_taichinh_thuchi.LayDSCacKhoanThu',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNhomCacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strcanboquanly_id': edu.util.getValById('txtAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KhoanThu(data);
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
    genCombo_KhoanThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KhoanThu", "dropLoaiKhoan"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGian: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_LopRieng_MH/DSA4BRIVKS4oBiggLwPP',
            'func': 'pkg_taichinh_loprieng.LayDSThoiGian',
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
            renderPlace: ["dropSearch_ThoiGian", "dropThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_LopRieng_MH/DSA4BRIKJAkuICIpBSAvJgo4CS4i',
            'func': 'pkg_taichinh_loprieng.LayDSKeHoachDangKyHoc',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KeHoach(data);
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
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HocPhan: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_LopRieng_MH/DSA4BRIJLiIRKSAv',
            'func': 'pkg_taichinh_loprieng.LayDSHocPhan',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_HocPhan(data);
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
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                mRender: function (rRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_LopRieng: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var objRow = me.findRow_LopRieng(strDangKy_LopHocPhan_Id);
        var obj_save = {
            'action': 'TC_LopRieng_MH/FSkkLB4FIC8mCjgeDS4xCS4iESkgLx4CKS41',
            'func': 'pkg_taichinh_loprieng.Them_DangKy_LopHocPhan_Chot',
            'iM': edu.system.iM,
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                me.collectResult_LopRieng(objRow, !!data.Success, data.Success ? '' : (data.Message || 'Không rõ nguyên nhân'));
            },
            error: function (er) {
                me.collectResult_LopRieng(objRow, false, 'Lỗi kết nối: ' + ((er && er.statusText) ? er.statusText : JSON.stringify(er)));
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                me.onDoneOne_LopRieng();
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    saveLai_LopRieng: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var objRow = me.findRow_LopRieng(strDangKy_LopHocPhan_Id);
        var obj_save = {
            'action': 'TC_LopRieng_MH/FSkkLB4FIC8mCjgeDS4xCS4iESkgLx4CKS41DSAo',
            'func': 'PKG_TAICHINH_LOPRIENG.Them_DangKy_LopHocPhan_ChotLai',
            'iM': edu.system.iM,
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                me.collectResult_LopRieng(objRow, !!data.Success, data.Success ? '' : (data.Message || 'Không rõ nguyên nhân'));
            },
            error: function (er) {
                me.collectResult_LopRieng(objRow, false, 'Lỗi kết nối: ' + ((er && er.statusText) ? er.statusText : JSON.stringify(er)));
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                me.onDoneOne_LopRieng();
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    findRow_LopRieng: function (strId) {
        var me = this;
        if (!me.dtLopRieng) return null;
        for (var i = 0; i < me.dtLopRieng.length; i++) {
            if (me.dtLopRieng[i].ID == strId) return me.dtLopRieng[i];
        }
        return null;
    },
    collectResult_LopRieng: function (objRow, bSuccess, sMessage) {
        var me = this;
        me.arrResults_LopRieng.push({
            MALOP: objRow ? objRow.MALOP : '',
            TENLOP: objRow ? objRow.TENLOP : '',
            HOCPHAN: objRow ? (edu.util.returnEmpty(objRow.DAOTAO_HOCPHAN_TEN) + ' - ' + edu.util.returnEmpty(objRow.DAOTAO_HOCPHAN_MA)) : '',
            KETQUA: bSuccess,
            LYDO: sMessage || ''
        });
    },
    onDoneOne_LopRieng: function () {
        var me = this;
        me.iDone_LopRieng++;
        edu.system.start_Progress("zoneprocessXXXX", function () {
            $('#myModalAlert').modal('hide');
            setTimeout(function () {
                me.showResults_LopRieng();
                me.getList_LopRieng();
            }, 300);
        });
    },
    showResults_LopRieng: function () {
        var me = this;
        var iSuccess = 0, iFail = 0;
        var sBody = '';
        for (var i = 0; i < me.arrResults_LopRieng.length; i++) {
            var item = me.arrResults_LopRieng[i];
            if (item.KETQUA) iSuccess++; else iFail++;
            var rowStyle = item.KETQUA ? '' : ' style="background:#fff3f3;"';
            sBody += '<tr' + rowStyle + '>';
            sBody += '<td style="text-align:center;">' + (i + 1) + '</td>';
            sBody += '<td>' + edu.util.returnEmpty(item.MALOP) + '</td>';
            sBody += '<td>' + edu.util.returnEmpty(item.TENLOP) + '</td>';
            sBody += '<td>' + edu.util.returnEmpty(item.HOCPHAN) + '</td>';
            sBody += '<td style="text-align:center;">';
            sBody += item.KETQUA
                ? '<span style="background:#28a745;color:#fff;padding:3px 10px;border-radius:3px;font-size:12px;display:inline-block;"><i class="fa fa-check"></i> Thành công</span>'
                : '<span style="background:#dc3545;color:#fff;padding:3px 10px;border-radius:3px;font-size:12px;display:inline-block;"><i class="fa fa-times"></i> Thất bại</span>';
            sBody += '</td>';
            sBody += '<td>' + edu.util.returnEmpty(item.LYDO) + '</td>';
            sBody += '</tr>';
        }
        var iMissing = me.iTotal_LopRieng - me.arrResults_LopRieng.length;

        var sSummary = '';
        sSummary += '<div style="padding:10px 12px;background:#f9f9f9;border-left:4px solid #3c8dbc;font-size:14px;">';
        sSummary += '<b>Đã chọn:</b> ' + me.iTotal_LopRieng;
        sSummary += ' &nbsp;|&nbsp; <span style="color:#28a745;"><b>Thành công:</b> ' + iSuccess + '</span>';
        sSummary += ' &nbsp;|&nbsp; <span style="color:#dc3545;"><b>Thất bại:</b> ' + iFail + '</span>';
        if (iMissing > 0) {
            sSummary += ' &nbsp;|&nbsp; <span style="color:#f39c12;"><b>Chưa phản hồi:</b> ' + iMissing + '</span>';
        }
        sSummary += '</div>';

        $("#lblKetQua_LopRieng_Title").html("Kết quả " + me.strAction_LopRieng);
        $("#zoneKetQua_LopRieng_Summary").html(sSummary);
        $("#tblKetQua_LopRieng tbody").html(sBody);
        $("#modalKetQua_LopRieng").modal('show');
    },
    updateSelected_Count: function () {
        var arrChecked_Id = edu.util.getArrCheckedIds("tblLopRieng", "checkX");
        var $lbl = $("#lblLopRieng_DaChon");
        if (arrChecked_Id.length > 0) {
            $lbl.html('<i class="fa fa-check-square-o"></i> Đã chọn: ' + arrChecked_Id.length).show();
        } else {
            $lbl.html('').hide();
        }
    },
    getList_LopRieng: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_LopRieng_MH/DSA4BRINLjEJLiIRKSAv',
            'func': 'pkg_taichinh_loprieng.LayDSLopHocPhan',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtLopRieng = dtReRult;
                    me.genTable_LopRieng(dtReRult, data.Pager);
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
    genTable_LopRieng: function (data, iPager) {
        $("#lblLopRieng_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLopRieng",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.LopRieng.getList_LopRieng()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 1, 5, 6, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "THOIGIANCHOT"
                },
                {
                    "mDataProp": "SOLUONGKHICHOT"
                },
                {
                    "mDataProp": "NGUOICHOT"
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
        me.updateSelected_Count();
    },


}