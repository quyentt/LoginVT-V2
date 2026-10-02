/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function GuiEmail() { };
GuiEmail.prototype = {
    strGuiEmail_Id: '',
    dtGuiEmail: [],
    strPath: '',
    dtNguoiGui: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_GuiEmail();
        try {
            var oNguoiGui = localStorage.getItem("nguoiguiemail");
            console.log(oNguoiGui)
            if (oNguoiGui) oNguoiGui = JSON.parse(oNguoiGui);
            $("#txtNguoiGui_Email").val(oNguoiGui.mailFrom);
            $("#txtNguoiGui_MatKhau").val(oNguoiGui.mailPass);
            $("#txtNguoiGui_HostMail").val(oNguoiGui.hostname);
            $("#txtNguoiGui_NguoiGui").val(oNguoiGui.displayName);
        } catch(ex) {

        }
        
       
        $("#btnSave_GuiEmail").click(function () {
            var objNguoiGuiEmail = undefined;
            if ($("#chkSelectAll_NguoiGui").is(":checked")) {
                objNguoiGuiEmail = {
                    "mailFrom": $("#txtNguoiGui_Email").val(),
                    "mailPass": $("#txtNguoiGui_MatKhau").val(),
                    "hostname": $("#txtNguoiGui_HostMail").val(),
                    "displayName": $("#txtNguoiGui_NguoiGui").val(),
                }
                localStorage.setItem("nguoiguiemail", JSON.stringify(objNguoiGuiEmail))
            }
            console.log(getRomdomEmail(objNguoiGuiEmail));
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGuiEmail", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng gửi?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn gửi không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessGuiEmail"></div>');
                edu.system.genHTML_Progress("zoneprocessGuiEmail", arrChecked_Id.length);
                
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var point = $("#tblGuiEmail tr[id='" + arrChecked_Id[i] + "']")[0];
                    if (point !== undefined) {
                        var strFileDinhKem = me.strPath;
                        var arrFileDinhKem = [strFileDinhKem];
                        if (arrFileDinhKem.indexOf(',')) arrFileDinhKem = strFileDinhKem.split(',');
                        //objNguoiGuiEmail = getRomdomEmail(objNguoiGuiEmail);
                        var arrId = edu.util.getValById("dropSearch_NguoiGui");
                        if (arrId != "") {
                            if (arrId.indexOf(',')) arrId = arrId.split(','); else arrId = [arrId];
                            arrId.forEach(enG => {
                                var objNguoiGui = me.dtNguoiGui.find(e => e.ID === enG);
                                objNguoiGuiEmail = {
                                    "mailFrom": objNguoiGui.MA,
                                    "mailPass": objNguoiGui.THONGTIN2,
                                    "hostname": objNguoiGui.THONGTIN1,
                                    "displayName": objNguoiGui.TEN,
                                };
                                me.sendEmail(point.cells[1].innerHTML, point.cells[2].innerHTML, point.cells[3].innerHTML, arrFileDinhKem, arrChecked_Id[i], objNguoiGuiEmail);
                            })
                        } else {
                            me.sendEmail(point.cells[1].innerHTML, point.cells[2].innerHTML, point.cells[3].innerHTML, arrFileDinhKem, arrChecked_Id[i], objNguoiGuiEmail);
                        }
                        
                    } else {
                        console.log("Lỗi tìm point");
                    }
                }
            });
            
        });
        $("#btnXoaGuiEmail").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGuiEmail", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessGuiEmail"></div>');
                edu.system.genHTML_Progress("zoneprocessGuiEmail", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_GuiEmail(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_GuiEmail();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_GuiEmail();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblGuiEmail" });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_GE", function (addKeyValue) {
            //var obj_list = {
            //    'strTuKhoa': edu.util.getValById("txtSearch_DuocNhanKhac_TuKhoa"),
            //    'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_DuocNhanKhac"),
            //    'strNgayPhatSinh_TuNgay': edu.util.getValById("txtSearch_DuocNhanKhac_TuNgay"),
            //    'strNgayPhatSinh_DenNgay': edu.util.getValById("txtSearch_DuocNhanKhac_DenNgay"),
            //    'strSearch_NhanSu_HoSoCanBo_Id': edu.util.getValById("dropSearch_ThanhVien_DuocNhanKhac"),
            //    'strNam': edu.util.getValById('txtSearch_Nam'),
            //    'dLaCanBoNgoaiTruong': edu.util.getValById('dropSearch_LaCanBo_DuocNhanKhac'),
            //    'strNamXuatChungTu': edu.util.getValById('txtSearch_NamXuatChungTu'),
            //};
            //for (var x in obj_list) {
            //    addKeyValue(x, obj_list[x]);
            //}
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblDuocNhanKhac", "checkHS");
            //for (var i = 0; i < arrChecked_Id.length; i++) {
            //    addKeyValue("strNhanSu_HoSoCanBo_Id", arrChecked_Id[i]);
            //}
        });

        edu.system.uploadImport(["txtFileDinhKem"], (a, data) => me.strPath = data);
        edu.system.loadToCombo_DanhMucDuLieu("CMS.TKEMAIL", "dropSearch_NguoiGui", "", data => me.dtNguoiGui = data);

        function getRomdomEmail(objNguoiGuiEmail) {
            var arrId = edu.util.getValById("dropSearch_NguoiGui");
            if (arrId == "") return objNguoiGuiEmail;
            if (arrId.indexOf(',')) arrId = arrId.split(','); else arrId = [arrId];

            var strNguoiGui_Id = arrId[getRndInteger(0, arrId.length)];
            var objNguoiGui = me.dtNguoiGui.find(e => e.ID === strNguoiGui_Id);
            return {
                "mailFrom": objNguoiGui.MA,
                "mailPass": objNguoiGui.THONGTIN2,
                "hostname": objNguoiGui.THONGTIN1,
                "displayName": objNguoiGui.TEN,
            }
        }

        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strGuiEmail_Id = "";
        edu.util.viewValById("dropDonVi", edu.util.getValById("dropSearch_DonVi"));
        edu.util.viewValById("dropThanhVien", edu.util.getValById("dropSearch_ThanhVien"));
        edu.util.viewValById("dropLoaiXuLy", edu.util.getValById("dropSearch_LoaiXuLy"));
        edu.util.viewValById("dropThanhPhanLuong", edu.util.getValById("dropSearch_ThanhPhanLuong"));
        edu.util.viewValById("txtNam", "");
        edu.util.viewValById("txtThang", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    update_GuiEmail: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_Email_ThongTin/CapNhat_DaGui',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (!edu.util.checkValue(obj_save.strId)) {
                    //    obj_notify = {
                    //        type: "s",
                    //        content: "Thêm mới thành công!",
                    //    }
                    //    edu.system.alert("Thêm mới thành công!");
                    //}
                    //else {
                    //    obj_notify = {
                    //        type: "i",
                    //        content: "Cập nhật thành công!",
                    //    }
                    //    edu.system.alertOnModal(obj_notify);
                    //}
                    //me.getList_GuiEmail();
                    //edu.system.alert("Gửi email thành công");
                }
                else {
                    
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
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
    getList_GuiEmail: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'CMS_Email_ThongTin/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.system.userId,
            'dTinhTrang': 0,
            'pageIndex': 1,
            'pageSize': 10000000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGuiEmail = dtReRult;
                    me.genTable_GuiEmail(dtReRult, data.Pager);
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
    delete_GuiEmail: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_Email_ThongTin/Xoa',
            
            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
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
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
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

            complete: function () {
                edu.system.start_Progress("zoneprocessGuiEmail", function () {
                    me.getList_GuiEmail();
                });
            },
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    sendEmail: function (mailTo, mailSubject, strBody, arrFileDinhKem, mail_ID, objNguoiGuiEmail) {
        var me = this;
        var obj_list = {
            'action': 'CMS_NguoiDung/SendEmail',
            'mailTo': mailTo,
            'mailSubject': mailSubject,
            'strBody': strBody,
            'arrFileDinhKem': arrFileDinhKem,
            ...objNguoiGuiEmail
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đã gửi email");
                    me.update_GuiEmail(mail_ID);
                }
                else {
                    edu.system.alert(objNguoiGuiEmail.mailFrom + " to " + obj_list.mailTo + "err: " + data.Message);
                }
            },
            error: function (er) {
            },
            type: "POST",
            complete: function () {
                edu.system.start_Progress("zoneprocessGuiEmail", function () {
                    me.getList_GuiEmail();
                });
            },
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
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
    genTable_GuiEmail: function (data, iPager) {
        $("#lblGuiEmail_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGuiEmail",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.GuiEmail.getList_GuiEmail()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 4],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "EMAIL"
                },
                {
                    "mDataProp": "TIEUDE"
                },
                {
                    "mDataProp": "NOIDUNG"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}