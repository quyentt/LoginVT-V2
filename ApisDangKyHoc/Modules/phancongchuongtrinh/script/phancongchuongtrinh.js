/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 28/05/2019
--Input: 
--Output:
--Note:
----------------------------------------------*/
function PhanCongChuongTrinh() { };
PhanCongChuongTrinh.prototype = {
    dtChuongTrinh: [],
    strChuongTrinh_Id: '',
    dtKeHoachDangKy: [],
    strKeHoach_Id: '',
    strChuongTrinh_KeHoach_Id: '',
    dtChuongTrinh_KeHoach: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ChuongTrinh();
        me.getList_KeHoachDangKy();

        //try {
        //    var network = new ActiveXObject('WScript.Network');
        //    console.log(network);
        //    // Show a pop up if it works
        //    alert(network.computerName);
        //}
        //catch (e) {
        //    console.log(e);
        //}
        //me.toggle_selecthocphan();
        $("#tblKeHoach").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            $("#zone_kehoach").show();
            strId = edu.util.cutPrefixId(/view_/g, strId);

            edu.util.setOne_BgRow(strId, "tblKeHoach");
            edu.util.objGetDataInData(strId, me.dtKeHoachDangKy, "MAKEHOACH", me.viewForm_KeHoachDangKy);
        });

        $(".btnClose_SelectChuongTrinh11").click(function () {
            me.toggle_kehoachchuongtrinh();
            me.getList_ChuongTrinh_KeHoach();
        });
        $("#btnSearchKeHoach").click(function () {
            me.getList_KeHoachDangKy();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoachDangKy();
            }
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zone-content", "zone_kehoach");
        });
        
        document.addEventListener("dragenter", function (event) {
            // highlight potential drop target when the draggable element enters it
            //if (event.target.className == "dropzone") {
            //}
            event.target.style.background = "green";

        }, false);
        document.addEventListener("dragleave", function (event) {
            //reset background of potential drop target when the draggable element leaves it
            event.target.style.background = "";
        }, false);

        $("#zoneBox_KeHoach").delegate(".btnView", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_Id = strId;
                me.toggle_kehoachchuongtrinh();
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachDangKy, "ID");
                me.viewEdit_KeHoachDangKy(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        /*------------------------------------------
        --Discription: Zone chương trình
        --Discription:
        -------------------------------------------*/
        $("#tblChuongTrinh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.toggle_editchuongtrinh();
            me.strChuongTrinh_KeHoach_Id = strId;
            me.getDetail_ChuongTrinh_KeHoach(strId);
            return false;
        });
        $("#btnAdd_ChuongTrinh").click(function () {
            me.toggle_selectchuongtrinh();
        });
        $("#tblKeHoach").delegate(".btnEdit_KeHoach", "click", function () {
            var strId = this.id;
            me.toggle_editkehoach();
            me.strKeHoach_Id = strId;
            me.getDetail_KeHoachDangKy(strId);
            return false;
        });
        $("#delete_EditChuongTrinh").click(function () {
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HocPhan_ChuongTrinh(me.strHocPhan_ChuongTrinh_Id);
                me.toggle_chuongtrinhhocphan();
            });
        });
        $("#btnSave_EditChuongTrinh").click(function () {
            me.save_HocPhan_ChuongTrinh_All();
        });
        $("#btnSearch_ChuongTrinh").click(function () {
            me.getList_ChuongTrinh_KeHoach_OnSearch();
        });
       
        /*------------------------------------------
        --Discription: Zone tổng chương trình
        --Discription: 
        -------------------------------------------*/
        $("#txtSearch_TuKhoa_SelectChuongTrinh").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zoneTongChuongTrinh li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        $("#zoneTongChuongTrinh").delegate(".btnSelectChuongTrinh11", "click", function (event) {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                document.getElementById('zoneChuongtrinh_Selectedxxx').appendChild(this.parentNode.parentNode);
                $(this).html('<i class="fa fa-backward"></i> <span class="lang" key="lb_luu">Bỏ Chọn</span>');
                this.classList.remove("btn-primary");
                this.classList.add("btn-danger");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: Zone chương trình đã chọn
        --Discription: 
        -------------------------------------------*/
        $("#txtSearch_TuKhoa_SelectedChuongTrinh").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zoneChuongTrinh_Selected li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        $("#zoneChuongtrinh_Selectedxxx").delegate(".btnSelectChuongTrinh11", "click", function (event) {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                console.log(22);
                document.getElementById('zoneTongChuongTrinh').appendChild(this.parentNode.parentNode);
                $(this).html('<i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span>');
                this.classList.remove("btn-danger");
                this.classList.add("btn-primary");
                var strChuongTrinh_KeHoach_Id = $(this).attr('name');//Dùng để xác định đối tượng này đã lưu chưa
                console.log(strChuongTrinh_KeHoach_Id);
                if (edu.util.checkValue(strChuongTrinh_KeHoach_Id)) {
                    me.delete_ChuongTrinh_KeHoach(strChuongTrinh_KeHoach_Id);
                }
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_KeHoach_ChuongTrinh").click(function () {
            var x = document.getElementById('zoneChuongtrinh_Selectedxxx').getElementsByTagName('LI');
            for (var i = 0; i < x.length; i++) {
                var strChuongTrinh_KeHoach_Id = $(x[i]).attr('name');//Dùng để xác định đối tượng này đã lưu chưa
                if (edu.util.checkValue(strChuongTrinh_KeHoach_Id)) {
                    me.save_ChuongTrinh_KeHoach_Old(strChuongTrinh_KeHoach_Id, i);
                }
                else {
                    me.save_ChuongTrinh_KeHoach_New(x[i].id.replace('drag_', ''), i)
                }
            }

        });
       
       
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        $("#dropSearch_NamHoc").on("select2:select", function () {
            me.getList_ThoiGianDaoTao();
        });
        $("#dropSearch_HocKy").on("select2:select", function () {
            me.getList_DotHoc();
        });

        $("#dropSearchChuongTrinh_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();

        });
        
        $("#btnAddAll_ChuongTrinh").click(function () {
            var x = $("#zoneTongChuongTrinh .btnSelectChuongTrinh11");
            edu.system.confirm("Bạn có muốn thêm <span style='color: red'>" + x.length + "</span> chương trình vào kế hoạch không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < x.length; i++) {
                    $(x[i]).trigger("click");
                }
            });
        });
    },
    rewrite_ChuongTrinh: function () {
        var me = this;
        me.strPhong_Id = "";
        edu.util.viewValById("txtCT_Ma", "");
        edu.util.viewValById("txtCT_Ten", "");
        edu.util.viewValById("dropCT_KhoaDaoTao", "");
        edu.util.viewValById("dropCT_KhoaQuanLy", "");
        edu.util.viewValById("dropCT_NganhTuyenSinh", "");
        edu.util.viewValById("txtCT_PhanLoai_N_CN", "");
        edu.util.viewValById("dropCT_DaoTao_N_CN", "");
        edu.util.viewValById("txtCT_TongSoTinChi", "");
        edu.util.viewValById("dropCT_ChuongTrinhCha", "");
        edu.util.viewValById("txtCT_MoTa", "");
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    open_modal: function () {
        $("#myModal_ChiTietLop").modal("show");
    },
    toggle_kehoach: function () {
        edu.util.toggle_overide("zone-content", "zone_kehoach");
    },
    toggle_kehoachchuongtrinh: function () {
        console.log(1);
        edu.util.toggle_overide("zone-content", "zone_phancongchuongtrinh");
    },
    toggle_editchuongtrinh: function () {
        var me = this;
        me.strChuongTrinh_Id = '';
        me.strChuongTrinh_KeHoach_Id = '';
        edu.util.viewValById("txtCT_Ma", '');
        edu.util.viewValById("txtCT_Ten", '');
        edu.util.viewValById("dropCT_KhoaDaoTao", '');
        edu.util.viewValById("dropCT_KhoaQuanLy", '');
        edu.util.viewValById("dropCT_NganhTuyenSinh", '');
        edu.util.viewValById("txtCT_PhanLoai_N_CN", '');
        edu.util.viewValById("dropCT_DaoTao_N_CN", '');
        edu.util.viewValById("txtCT_TongSoTinChi", '');
        edu.util.viewValById("dropCT_ChuongTrinhCha", '');
        edu.util.viewValById("txtCT_MoTa", '');
        edu.util.toggle_overide("zone-content", "zone_editchuongtrinh");
    },
    toggle_selectchuongtrinh: function () {
        var me = this;
        me.expectSameData("zoneTongChuongTrinh", "zoneChuongTrinh_Selected");
        edu.util.toggle_overide("zone-content", "zone_inputchuongtrinh");
    },
    dragover_handler: function (ev) {
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move";
    },
    drop_handler: function (ev) {
        ev.preventDefault();
        // Get the id of the target and add the moved element to the target's DOM
        var data = ev.dataTransfer.getData("text/html");
        if (ev.target.tagName == "UL") {
            ev.target.appendChild(document.getElementById(data));
        }
        else {
            var point = ev.target;
            while (point.tagName != "LI") {
                point = point.parentNode;
                if (point.tagName != "A" && point.tagName != "SPAN" && point.tagName != "I") break;
            }
            point.parentNode.insertBefore(document.getElementById(data), point);
        }
        ev.target.style.background = "";
        var point = document.getElementById('btnSelect_' + data.replace('drag_', ''));
        if ($(point).hasClass("btn-primary")) {
            $(point).html('<i class="fa fa-backward"></i> <span class="lang" key="lb_luu">Bỏ Chọn</span>');
            point.classList.remove("btn-primary");
            point.classList.add("btn-danger");
        }
    },
    expectSameData: function (strZoneA, strZoneB) {
        $("#" + strZoneB + " .btnSelectChuongTrinh11").each(function () {
            $("#" + strZoneA + " #" + this.id).parent().parent().remove();
        })
    },
    
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    getList_KeHoachDangKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtKeHoachDangKy = dtResult;
                    }
                    me.genBox_KeHoachDangKy(dtResult, iPager);
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
    getDetail_KeHoachDangKy: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'DKH_KeHoachDangKy/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_KeHoachDangKy(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genBox_KeHoachDangKy: function (data, iPager) {
        var me = this;
        var html = '';

        $("#zoneBox_KeHoach").html(html);
        //
        for (var i = 0; i < data.length; i++) {
            html += '<div class="col-sm-3 col-xs-6 btnView" id="view_' + data[i].ID + '" style="padding-left: 6px">';
            html += '<div class="small-box">';
            html += '<div class="inner">';
            html += '<p>Tên kế hoạch: ' + edu.util.returnEmpty(data[i].TENKEHOACH) + '</p>';
            html += '<p>Mã kế hoạch: ' + edu.util.returnEmpty(data[i].MAKEHOACH) + '</p>';
            html += '<p>năm học: ' + edu.util.returnEmpty(data[i].DAOTAO_THOIGIANDAOTAO_NAM) + '</p>';
            html += '<p>Học kỳ: ' + edu.util.returnEmpty(data[i].DAOTAO_THOIGIANDAOTAO_KY) + '</p>';
            html += '<p>Đợt học: ' + edu.util.returnEmpty(data[i].DAOTAO_THOIGIANDAOTAO_DOT) + ' </p>';
            html += '</div>';
            html += '<div class="icon">';
            html += '<i class="fa fa-building cl-rosybrown"></i>';
            html += '</div>';
            html += '<div class="small-box-footer">';
            html += '<a id="edit_' + data[i].ID + '" class="btn btn-default poiter btnEdit"><i class="fa fa-pencil"></i> Xem chương trình</a>';
            html += '</div>';
            html += '</div>';
            html += '</div >';
        }
        //
        $("#zoneBox_KeHoach").html(html);
    },
    viewEdit_KeHoachDangKy: function (data) {
        var me = main_doc.PhanCongChuongTrinh;
        edu.util.viewHTMLById("lblNoiDungKeHoachDangKy", data[0].TENKEHOACH);
        edu.util.viewHTMLById("lblInputChuongTrinh", data[0].TENKEHOACH);
        me.getList_ChuongTrinh_KeHoach();
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> Chuong trinh
    --Author: duyentt
    -------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ToChucChuongTrinh/LayDanhSach',
            

            'strTuKhoa': "",
            'strDaoTao_KhoaDaoTao_Id': "",
            'strDaoTao_N_CN_Id': "",
            'strDaoTao_KhoaQuanLy_Id': "",
            'strDaoTao_ToChucCT_Cha_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtChuongTrinh = dtResult;
                    }
                    me.genTable_ChuongTrinh(dtResult, iPager);
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
    genTable_ChuongTrinh: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_' + data[i].ID + '" name="" >';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].MACHUONGTRINH) + " - " + edu.util.returnEmpty(data[i].TENCHUONGTRINH) + '</span>';
            row += '<span class="submit btn btn-primary pull-right btnSelectChuongTrinh11" id="btnSelect_' + data[i].ID + '"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneTongChuongTrinh").html(row);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> Ke hoach chuong trinh
    --Author: duyentt
    -------------------------------------------*/

    save_ChuongTrinh_KeHoach_New: function (strChuongTrinh_Id) {
        var me = this;
        var obj_notify = {};
        var objChuongTrinh = edu.util.objGetDataInData(strChuongTrinh_Id, me.dtChuongTrinh, "ID");
        if (objChuongTrinh.length > 0) {
            dSoTinChiToiDa = objChuongTrinh[0].SOTINCHITOIDA;
            dSoTinChiToiThieu = objChuongTrinh[0].SOTINCHITOITHIEU;
        }

        //--Edit
        var obj_save = {
            'action': 'DKH_PhanCong_ChuongTrinh/ThemMoi',
            

            'strId': '',
            'strDangKy_KeHoachDangKy_Id': me.strKeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strChuongTrinh_Id,
            'strNgayBatDau': '',
            'strNgayKetThuc': '',
            'dSoTinChiToiDa': '',
            'dSoTinChiToiThieu': '',
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Id)) {
                    edu.system.alert(objChuongTrinh[0].TENCHUONGTRINH + ': Thêm mới thành công!');
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh_KeHoach_Old: function (strChuongTrinh_KeHoach_Id) {
        var me = this;
        var obj_notify = {};
        var objChuongTrinh_KeHoach = edu.util.objGetDataInData(strChuongTrinh_KeHoach_Id, me.dtChuongTrinh_KeHoach, "ID");
        //--Edit
        var obj_save = {
            'action': 'DKH_PhanCong_ChuongTrinh/CapNhat',
            

            'strId': objChuongTrinh_KeHoach[0].ID,
            'strDangKy_KeHoachDangKy_Id': objChuongTrinh_KeHoach[0].MAKEHOACH,
            'strDaoTao_ChuongTrinh_Id': objChuongTrinh_KeHoach[0].MACHUONGTRINH,
            'strNgayBatDau': objChuongTrinh_KeHoach[0].MAKEHOACH,
            'strNgayKetThuc': objChuongTrinh_KeHoach[0].MAKEHOACH,
            'dSoTinChiToiDa': objChuongTrinh_KeHoach[0].MAKEHOACH,
            'dSoTinChiToiThieu': objChuongTrinh_KeHoach[0].MAKEHOACH,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                console.log(1111111111);
                edu.system.alert(objChuongTrinh_KeHoach[0].TENKEHOACH + ': Cập nhật thành công!');
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh_KeHoach_All: function () {
        var me = this;
        var obj_notify = {};
        console.log(me.strChuongTrinh_KeHoach_Id);
        console.log(me.dtChuongTrinh_KeHoach);
        var objChuongTrinh_KeHoach = edu.util.objGetDataInData(me.strChuongTrinh_KeHoach_Id, me.dtChuongTrinh_KeHoach, "ID");
        //--Edit
        var obj_save = {
            'action': 'DKH_PhanCong_ChuongTrinh/CapNhat',
            

            'strId': objHocPhan_ChuongTrinh[0].ID,
            'strDangKy_KeHoachDangKy_Id': objChuongTrinh_KeHoach[0].MAKEHOACH,
            'strDaoTao_ChuongTrinh_Id': objChuongTrinh_KeHoach[0].MACHUONGTRINH,
            'strNgayBatDau': objChuongTrinh_KeHoach[0].MACHUONGTRINH,
            'strNgayKetThuc': objChuongTrinh_KeHoach[0].MACHUONGTRINH,
            'dSoTinChiToiDa': objChuongTrinh_KeHoach[0].MACHUONGTRINH,
            'dSoTinChiToiThieu': objChuongTrinh_KeHoach[0].MACHUONGTRINH,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                console.log(1111111111);
                edu.system.alert(objChuongTrinh_KeHoach[0].TENKEHOACH + ': Cập nhật thành công!');
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ChuongTrinh_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_ChuongTrinh/LayDanhSach',
            

            'strTuKhoa': '',
            'strDangKy_KeHoachDangKy_Id': me.strKeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtChuongTrinh_KeHoach = dtResult;
                    }
                    me.genTable_ChuongTrinh_KeHoach_Select(dtResult, iPager);
                    me.genTable_ChuongTrinh_KeHoach(dtResult, iPager);
                    me.genTable_ChuongTrinh_KeHoach_OnSelect(dtResult);
                    me.genCombo_ChuongTrinh_KeHoach(dtResult);
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
    getList_ChuongTrinh_KeHoach_OnSearch: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_ChuongTrinh/LayDanhSach',
            

            'strTuKhoa': '',
            'strDangKy_KeHoachDangKy_Id': '',
            'strDaoTao_ChuongTrinh_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000000
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
                    me.genTable_ChuongTrinh_OnSearch(dtResult);
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
    getDetail_ChuongTrinh_KeHoach: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtKeHoachDangKy_ChuongTrinh, "ID");
        me.viewEdit_ChuongTrinh_KeHoach(data);
    },
    delete_ChuongTrinh_KeHoach: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'DKH_PhanCong_ChuongTrinh/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: "w"
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
                
                me.getList_ChuongTrinh_KeHoach();
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
    --Discription: [4]  GEN HTML ==> KeHoach
    --Author: duyentt
    -------------------------------------------*/
    viewEdit_ChuongTrinh_KeHoach: function (data) {
        var me = this;
        me.strChuongTrinh_Id = data[0].DAOTAO_HOCPHAN_ID;
        edu.util.viewValById("dropCT_NganhTuyenSinh", data.NGANHTUYENSINH_ID);
        edu.util.viewValById("dropCT_KhoaDaoTao", data.DAOTAO_KHOADAOTAO_ID);
        edu.util.viewValById("txtCT_PhanLoai_N_CN", data.PHANLOAI_N_CN);
        edu.util.viewValById("dropCT_DaoTao_N_CN", data.DAOTAO_N_CN_ID);
        edu.util.viewValById("txtCT_Ten", data.TENCHUONGTRINH);
        edu.util.viewValById("txtCT_Ma", data.MACHUONGTRINH);
        edu.util.viewValById("txtCT_TongSoTinChi", data.TONGSOTINCHIQUYDINH);
        edu.util.viewValById("dropCT_KhoaQuanLy", data.DAOTAO_KHOAQUANLY_ID);
        edu.util.viewValById("dropCT_ChuongTrinhCha", data.DAOTAO_TOCHUCCT_CHA_ID);
        edu.util.viewValById("txtCT_MoTa", data.MOTA);
    },
    genTable_ChuongTrinh_KeHoach_Select: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_' + data[i].TENCHUONGTRINH + '" name=">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].MACHUONGTRINH) + " - " + edu.util.returnEmpty(data[i].TENCHUONGTRINH) + '</span>';
            row += '<span class="submit btn btn-danger pull-right btnSelectChuongTrinh11" name="' + edu.util.returnEmpty(data[i].MACHUONGTRINH) + '" id="btnSelect_' + data[i].TENCHUONGTRINH + '"><i class="fa fa-backward"></i> <span class="lang" key="lb_luu"> Bỏ Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneChuongTrinh_Selected").html(row);
        /*III. Callback*/
    },
    genTable_ChuongTrinh_KeHoach: function (data, iPager) {
        var me = this;
       
        //$("#zoneHocPhan").html(row);
        var jsonForm = {
            strTable_Id: "tblChuongTrinh",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [

                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "TENCHUONGTRINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //Hiển thị tổng số chương trình:
        $("#iTongSoChuongTrinh").html(data.length);
        /*III. Callback*/
    },
    genTable_ChuongTrinh_KeHoach_OnSelect: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].MACHUONGTRINH) + " - " + edu.util.returnEmpty(data[i].TENCHUONGTRINH) + '</span>';
            row += '</a>';
        }
        /*III. Callback*/
    },
    genCombo_ChuongTrinh_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "MACHUONGTRINH",
                name: "TENCHUONGTRINH",
                mRender: function (nrow, aData) {
                    return aData.MACHUONGTRINH + " - " + aData.TENCHUONGTRINH;
                }
            },
            renderPlace: [""],
            title: "Chọn chuong trình"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_ChuongTrinh_OnSearch: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_' + data[i].TENCHUONGTRINH + '>';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].MACHUONGTRINH) + " - " + edu.util.returnEmpty(data[i].TENCHUONGTRINH) + '</span>';
            row += '<span class="submit btn btn-primary pull-right btnSelectChuongTrinh11" id="btnSelect_' + data[i].MACHUONGTRINH + '"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
            row += '</a>';
        }
        $("#zoneTongChuongTrinh").html(row);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: edu.util.getValById("dropSearchChuongTrinh_HeDaoTao"),
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_HeDaoTao(obj, "", "", me.genComBo_HeDaoTao);
    },
    genComBo_HeDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENHEDAOTAO",
            },
            renderPlace: ["dropSearchChuongTrinh_HeDaoTao", "dropEdit_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj = {
            strHeDaoTao_Id: edu.util.getValById("dropSearchChuongTrinh_KhoaDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_KhoaDaoTao(obj, "", "", me.genComBo_KhoaDaoTao);
    },
    genComBo_KhoaDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENKHOA",
            },
            renderPlace: ["dropSearchChuongTrinh_KhoaDaoTao", "dropEdit_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_ChuongTrinhDaoTao_Edit: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropEdit_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, "", "", me.genComBo_ChuongTrinhDaoTao_Edit);
    },
    genComBo_ChuongTrinhDaoTao_Edit: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENCHUONGTRINH",
            },
            renderPlace: ["dropEdit_ChuongTrinhDaoTao"],
            title: "Chọn chương trình đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    getList_KeHoachDangKy_OnSelect: function () {
        var me = this;
        var obj = {
            strTuKhoa: "",
            strDaoTao_KhoaDaoTao_Id: edu.util.getValById("dropSearchChuongTrinh_KhoaDaoTao"),
            strDaoTao_N_CN_Id: "",
            strDaoTao_KhoaQuanLy_Id: "",
            strDaoTao_ToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_KeHoachDangKy(obj, "", "", me.genComBo_KeHoachDangKy_OnSelect);
    },
    genComBo_KeHoachDangKy_OnSelect: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENKEHOACH",
            },
            renderPlace: ["dropSearchHocPhan_ChuongTrinh"],
            title: "Chọn kế hoạch đăng ký"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo NamHoc
    ----------------------------------------------*/
    getList_NamHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_NamHoc/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
            'strCanBoNhapDeTai_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000
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
                    me.genCombo_NamHoc(dtResult, iPager);
                }
                else {
                    edu.system.alert("KHCT_NamHoc/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_NamHoc/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_NamHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMHOC",
                order: "unorder"
            },
            renderPlace: ["dropSearch_NamHoc"],
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo HocKy
    ----------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ThoiGianDaoTao/LayDanhSach',
            

            'strTuKhoa': "",
            'strDAOTAO_NAM_Id': edu.util.getValById("dropSearch_NamHoc"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.genCombo_ThoiGianDaoTao(dtResult, iPager);
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
    genCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOCKY",
                code: "HOCKY",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HocKy"],
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Date of created: 
    --Discription: genCombo DotHoc
    ----------------------------------------------*/
    getList_DotHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_DotHoc/LayDanhSach_RutGon',
            

            'strDaoTao_HocKy_Id': edu.util.getValById("dropSearch_HocKy"),
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
                    me.genCombo_DotHoc(dtResult, iPager);
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
    genCombo_DotHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DOTHOC",
                code: "DOTHOC",
                order: "unorder"
            },
            renderPlace: ["dropSearch_DotHoc"],
            title: "Chọn đợt học"
        };
        edu.system.loadToCombo_data(obj);
    },
}