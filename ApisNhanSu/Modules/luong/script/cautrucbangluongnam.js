/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CauTrucBangLuong() { };
CauTrucBangLuong.prototype = {
    strQuyDinhLuong_Id: '',
    strCauTrucBangLuong_Id: '',
    dtCauTrucBangLuong: [],
    dtDMThanhPhan: [],
    strDMThanhPhan_Id: '',
    strTenDanhMuc_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIBANGLUONG", "", "", me.genCombo_LoaiBangLuong);
        /*------------------------------------------
        --Discription: Load Select
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnCloseEdit").click(function () {
            me.toggle_detail();
        });
        $("#btnLuuEditHienThi").click(function () {
            me.save_CauTrucBangLuong();
        });
        $(".btnAddCauTrucBangLuong").click(function () {
            me.toggle_edit();
        });
        $("#tblQuyDinhLuong").delegate('.btnChonDanhSach', 'click', function () {
            var strDanhSach_Id = this.id;
            me.strQuyDinhLuong_Id = strDanhSach_Id;
            me.toggle_detail()
        });

        $("#tblCauTrucBangLuong").delegate('.btnEdit', 'click', function () {
            me.viewForm_CauTrucBangLuong(this.id)
        });
        $("#tblCauTrucBangLuong").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            console.log(this.id);
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblCauTrucBangLuong");
                $("#btnYes").click(function (e) {
                    me.delete_CauTrucBangLuong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.THANHPHANLUONG", "dropBL_ThanhPhan", "", me.genTable_DMThanhPhan);


        $("#btnSave_DMDL").click(function () {
            me.save_DMDL();
        });
        $("#btnAddDMDL").click(function () {
            me.popup();
        });
        $("#tblDMThanhPhan").delegate('.btnEdit', 'click', function () {
            me.viewForm_DMDL(this.id)
        });
        $("#tblDMThanhPhan").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tblDMThanhPhan");
                $("#btnYes").click(function (e) {
                    me.delete_DMDL(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        me.getList_CauTruc_TuKhoa();
        me.getList_QuyDinhLuong();
        $("#dropLoaiBangLuong").on("select2:select", function () {
            me.getList_CauTrucBangLuong();
        });
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_nhapdiem");
    },
    toggle_detail: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_input_nhapdiem");
        me.getList_CauTrucBangLuong();
    },
    toggle_edit: function (strDanhSach_Id) {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_edithienthi");
        edu.util.viewValById("txtBL_ThuTu", "");
        edu.util.viewValById("txtBL_CongThuc", "");
        edu.util.viewValById("dropThanhPhanCha", "");
        edu.util.viewValById("dropBL_ThanhPhan", "");
        edu.util.viewValById("txtBL_KyHieu", "");
        edu.util.viewValById("dropBL_TinhThue", 1);
        me.strCauTrucBangLuong_Id = "";
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_QuyDinhLuong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_BangQuyDinhLuong/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuyDinhLuong(dtReRult, data.Pager);
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
    genTable_QuyDinhLuong: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQuyDinhLuong_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblQuyDinhLuong",
            aaData: data,
            colPos: {
                center: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MUCLUONGCOBAN"
                },
                {
                    "mDataProp": "SOBACLUONGTOIDA"
                },
                {
                    "mDataProp": "LUONGTOITHIEUVUNG"
                },
                {
                    "mDataProp": "NGAYBATDAUAPDUNG"
                },
                {
                    "mDataProp": "NGAYKETTHUCAPDUNG"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btnChonDanhSach" data-dismiss="modal" id="' + aData.ID + '">Chọn</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length == 1) {
            me.strQuyDinhLuong_Id = data[0].ID;
            me.toggle_detail();
        }
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CauTrucBangLuong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'L_LuongNam_CauTruc/ThemMoi',
            

            'strId': "",
            'dThuNhapTinhThue': edu.util.getValById('dropBL_TinhThue'),
            'strLoaiBangLuong_Id': edu.util.getValById("dropLoaiBangLuong"),
            'strNhanSu_BangQuyDinh_Id': me.strQuyDinhLuong_Id,
            'strThanhPhan_Id': edu.util.getValById('dropBL_ThanhPhan'),
            'strThanhPhan_Cha_Id': edu.util.getValById('dropThanhPhanCha'),
            'iThuTu': edu.util.getValById('txtBL_ThuTu'),
            'strXauCongThucTinh': edu.util.getValById('txtBL_CongThuc'),
            'strKyHieu': edu.util.getValById('txtBL_KyHieu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(me.strCauTrucBangLuong_Id)) {
            obj_save.action = 'L_LuongNam_CauTruc/CapNhat';
            obj_save.strId = me.strCauTrucBangLuong_Id;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (!edu.util.checkValue(obj_save.strId)) {
                    //    obj_notify = {
                    //        type: "s",
                    //        content: "Thêm mới thành công!",
                    //    }
                    //    edu.system.alertOnModal(obj_notify);
                    //}
                    //else {
                    //    obj_notify = {
                    //        type: "i",
                    //        content: "Cập nhật thành công!",
                    //    }
                    //    edu.system.alertOnModal(obj_notify);
                    //}
                    me.toggle_detail();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CauTrucBangLuong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_LuongNam_CauTruc/LayDanhSach',
            'strNhanSu_QuyDinhLuong_Id': me.strQuyDinhLuong_Id,
            'strNguoiThucHien_Id': "",
            'strLoaiBangLuong_Id': edu.util.getValById("dropLoaiBangLuong")
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_CauTrucBangLuong(dtReRult, data.Pager);
                    me.genCombo_ThanhPhan_Cha(dtReRult);
                    me.insertHeaderTable("tblViewCauTrucBangLuong", dtReRult, null);
                    me.dtCauTrucBangLuong = dtReRult;
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
    delete_CauTrucBangLuong: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_LuongNam_CauTruc/Xoa',
            
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
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_CauTrucBangLuong();
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
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_CauTrucBangLuong: function (data, iPager) {
        var me = this;
        var dtThongTinDiem = data.Table;
        me.dtCotThongTinDiem = data.Table;
        var dtNguoiHoc = data.Table1;
        me.dtCotNguoiHoc = data.Table1;
        var row = '';
        row += '<tr>';
        for (var i = 0; i < dtNguoiHoc.length; i++) {
            row += '<th rowspan="2">' + dtNguoiHoc[i].TENCOT + '</th>';
        }
        row += '<th colspan="' + dtThongTinDiem.length + '" style="text-align: center">' + strCongThuc + '</th>';
        row += '</tr>';
        row += '<tr>';
        for (var i = 0; i < dtThongTinDiem.length; i++) {
            row += '<th id="' + dtThongTinDiem[i].MACOT + '" ' + me.getstyle(dtThongTinDiem[i], true) + '>' + dtThongTinDiem[i].TENCOT + '</th>';
        }
        row += '</tr>';
        $("#tblQuyDinhLuong thead").html(row);
    },
    genTable_CauTrucBangLuong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCauTrucBangLuong",
            aaData: data,
            colPos: {
                center: [0, 4, 5]
            },
            aoColumns: [
                {
                    "mDataProp": "THANHPHAN_TEN"
                },
                {
                    "mDataProp": "THANHPHAN_CHA_TEN"
                },
                {
                    "mDataProp": "XAUCONGTHUCTINH"
                },
                {
                    "mDataProp": "KYHIEU"
                }
                , {
                    "mRender": function (nRow, aData) {
                        if (aData.THUNHAPTINHTHUE == 1) return "Tính thuế";
                        if (aData.THUNHAPTINHTHUE == 0) return "Không tính thuế";
                        return ""
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="delete' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genCombo_ThanhPhan_Cha: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "THANHPHAN_ID",
                parentId: "",
                name: "THANHPHAN_TEN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropThanhPhanCha"],
            title: "Chọn thành phần cha"
        };
        edu.system.loadToCombo_data(obj);
    },
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        //Khởi tạo table
        $("#" + strTable_Id).html('<thead><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr></thead><tbody></tbody>');

        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THANHPHAN_CHA_ID == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Add rowspan cho các thành phần không có phần từ con
        //rowspan = rowTheadOfTable - colspan
        var x = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].colSpan;
                if (z == 1) {
                    var irowspan = (x.length - i);
                    if (irowspan > 1) x[i].cells[j].rowSpan = (x.length - i);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.THANHPHAN_ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].THANHPHAN_ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }

        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            //var lHeader = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows;
            //if (lHeader.length <= iThuTu) {
            //    $("#" + strTable_Id + " thead").append("<tr></tr>");
            //    setTimeout(function () {
            //        $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.HOCPHAN + "</th>");
            //    }, 1);
            //} else {
            //    $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.HOCPHAN + "</th>");
            //}
            $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.THANHPHAN_ID + "' colspan='" + colspan + "'>" + objHead.THANHPHAN_TEN + "</th>");
            if (colspan == 0) {
                arrHeaderId.push(objHead.THANHPHAN_ID);
                //$("#" + strTable_Id + "_Data thead tr:eq(0)").append("<th style='width: 60px'>" + objHead.HOCPHAN + "</th>");
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].THANHPHAN_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    viewForm_CauTrucBangLuong: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtCauTrucBangLuong, "ID")[0];
        me.toggle_edit();
        //view data --Edit
        edu.util.viewValById("txtBL_ThuTu", data.THUTU1);
        edu.util.viewValById("txtBL_CongThuc", data.XAUCONGTHUCTINH);
        edu.util.viewValById("dropThanhPhanCha", data.THANHPHAN_CHA_ID);
        edu.util.viewValById("dropBL_ThanhPhan", data.THANHPHAN_ID);
        edu.util.viewValById("txtBL_KyHieu", data.KYHIEU);
        edu.util.viewValById("dropBL_TinhThue", data.THUNHAPTINHTHUE);
        me.strCauTrucBangLuong_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_CauTruc_TuKhoa: function (strDeTai_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_LuongNam_TuKhoa/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiTao_Id': '',
            'pageIndex': 1,
            'pageSize': 100000
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_CauTruc_TuKhoa(dtReRult, data.Pager);
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
    genTable_CauTruc_TuKhoa: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTuKhoaThanhPhan",
            aaData: data,
            colPos: {
                center: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TUKHOA"
                },
                {
                    "mDataProp": "MOTA"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
	--Discription: [3]  ACESS DB ==> DanhMucDuLieu
    --Author: nnthuong
	-------------------------------------------*/
    save_DMDL: function () {
        var me = this;


        var obj_save = {
            'action': 'CMS_DanhMucDuLieu/ThemMoi',
            

            'strMa': edu.util.getValById("txtDM_Ma"),
            'strTen': edu.util.getValById("txtDM_Ten"),
            'strId': "",
            'strCHUNG_TENDANHMUC_Id': me.strTenDanhMuc_Id,
            'dTrangThai': 1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strDMThanhPhan_Id)) {
            obj_save.action = 'CMS_DanhMucDuLieu/ThemMoi';
            obj_save.strId = me.strDMThanhPhan_Id;
        }
        //2. save --> call db
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj = {
                            type: "s",
                            title: "Thông báo",
                            content: "Thêm mới thành công!"
                        };
                        edu.system.alertOnModal(obj);
                    }
                    else {
                        obj = {
                            type: "s",
                            title: "Thông báo",
                            content: "Cập nhật thành công!"
                        };
                        edu.system.alertOnModal(obj);
                    }
                    edu.system.loadToCombo_DanhMucDuLieu("NHANSU.THANHPHANLUONG", "dropBL_ThanhPhan", "", me.genTable_DMThanhPhan);
                }
                else {
                    obj = {
                        type: "w",
                        title: "Thông báo",
                        content: "CMS_DanhMucDuLieu.ThemMoi: " + data.Message,
                    }
                    edu.system.alertOnModal(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    type: "w",
                    title: "Thông báo",
                    content: "L_LuongNam_TuKhoa_ThamSo.ThemMoi: " + JSON.stringify(er),
                }
                edu.system.alertOnModal(obj);
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DMDL: function (Ids) {
        var me = this;
        var strIds = Ids;
        var obj = {};

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    edu.system.loadToCombo_DanhMucDuLieu("NHANSU.THANHPHANLUONG", "dropBL_ThanhPhan", "", me.genTable_DMThanhPhan);
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_DanhMucDuLieu.Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_DanhMucDuLieu.Xoa: " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: 'L_LuongNam_TuKhoa_ThamSo/Xoa',
            
            contentType: true,
            
            data: {
                'strId': strIds,
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DMThanhPhan: function (data, iPager) {
        var me = main_doc.CauTrucBangLuong;
        me.dtDMThanhPhan = data;
        if (data.length > 0) {
            me.strTenDanhMuc_Id = data[0].CHUNG_TENDANHMUC_ID;
        }
        var jsonForm = {
            strTable_Id: "tblDMThanhPhan",
            aaData: data,
            colPos: {
                center: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="delete' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewForm_DMDL: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtDMThanhPhan, "ID")[0];
        me.popup();
        $("#myModalLabel").html("Chỉnh sửa");
        //view data --Edit
        edu.util.viewValById("txtDM_Ma", data.MA);
        edu.util.viewValById("txtDM_Ten", data.TEN);
        me.strDMThanhPhan_Id = data.ID;
    },
    popup: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $('#myModal').modal('show');
        $("#myModalLabel").html("Thêm mới");
        edu.util.viewValById("txtDM_Ma", "");
        edu.util.viewValById("txtDM_Ten", "");
        me.strDMThanhPhan_Id = "";
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Loai bang luong
    --Author: vanhiep
	-------------------------------------------*/
    genCombo_LoaiBangLuong: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropLoaiBangLuong"],
            title: "Chọn loại bảng lương"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropLoaiBangLuong").select2();
    }
}