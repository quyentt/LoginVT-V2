/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TieuChiDiem() { };
TieuChiDiem.prototype = {
    strTieuChiDiem_Id: '',
    dtTieuChiDiem: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_TieuChiDiem();

        edu.system.loadToCombo_DanhMucDuLieu("DRL.DOITUONGAPDUNG", "dropDoiTuong,dropDoiTuongApDung");
        edu.system.loadToCombo_DanhMucDuLieu("DRL.THANGDIEM", "dropThangDiem");
        edu.system.loadToCombo_DanhMucDuLieu("DRL.DMTC", "dropNhomTieuChi");
        $("#tblViewTieuChiDiem").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_TieuChiDiem(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_TieuChi").click(function () {
            me.save_TieuChiDiem();
        });
        $("#btnDelete_TieuChi").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_TieuChiDiem(me.strTieuChiDiem_Id);
            });
        });

        $("#dropDoiTuong").on("select2:select", function () {
            me.getList_TieuChiDiem();
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strTieuChiDiem_Id = "";
        edu.util.viewValById("dropLoaiTieuChi", "");
        edu.util.viewValById("txtThuTu", "");
        edu.util.viewValById("txtTenTieuChi", "");
        edu.util.viewValById("txtMaTieuChi", "");
        edu.util.viewValById("txtMucDiem", "");
        edu.util.viewValById("dropDoiTuongApDung", edu.util.getValById('dropDoiTuong'));
        edu.util.viewValById("dropThangDiem", "");
        edu.util.viewValById("dropNhomTieuChi", "");
        edu.util.viewValById("dropNhapTrucTiep", 1);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TieuChiDiem: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_TieuChiDanhGia/ThemMoi',
            

            'strId': me.strTieuChiDiem_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'strMa': edu.util.getValById('txtMaTieuChi'),
            'strTen': edu.util.getValById('txtTenTieuChi'),
            'dMucDiemQuyDinh': edu.util.getValById('txtMucDiem'),
            'strNhomTieuChi_Id': edu.util.getValById('dropNhomTieuChi'),
            'strDRL_TieuChiDanhGia_Cha_Id': edu.util.getValById('dropLoaiTieuChi'),
            'iThuTu': edu.util.getValById('txtThuTu'),
            'strThangDiem_Id': edu.util.getValById('dropThangDiem'),
            'dNhapTrucTiep': edu.util.getValById('dropNhapTrucTiep'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'RL_TieuChiDanhGia/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
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
                    me.getList_TieuChiDiem();
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
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TieuChiDiem: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChiDanhGia/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDRL_TieuChiDanhGia_Cha_id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNhomTieuChi_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuong'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.insertHeaderTable("tblViewTieuChiDiem", dtReRult, null);
                    me.dtTieuChiDiem = dtReRult;
                    me.genCombo_LoaiTieuChi(dtReRult);
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
    delete_TieuChiDiem: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'RL_TieuChiDanhGia/Xoa',
            
            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
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
                    me.getList_TieuChiDiem();
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
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        //Khởi tạo table
        $("#" + strTable_Id).html('<thead><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr></thead><tbody></tbody>');

        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].DRL_TIEUCHIDANHGIA_CHA_ID == strQuanHeCha) {
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
            var x = spliceData(objAll, objRecuse.ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].ID);
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
            $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center btnEdit poiter' id='" + objHead.ID + "' colspan='" + colspan + "' style='text-decoration: underline;'>" + objHead.TEN + ' (' + objHead.MUCDIEMQUYDINH +")</th>");
            if (colspan == 0) {
                arrHeaderId.push(objHead.ID);
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].DRL_TIEUCHIDANHGIA_CHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    viewForm_TieuChiDiem: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtTieuChiDiem, "ID")[0];
        me.popup();
        me.resetPopup();
        console.log(data);
        //view data --Edit
        edu.util.viewValById("dropLoaiTieuChi", data.DRL_TIEUCHIDANHGIA_CHA_ID);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtTenTieuChi", data.TEN);
        edu.util.viewValById("txtMaTieuChi", data.MA);
        edu.util.viewValById("txtMucDiem", data.MUCDIEMQUYDINH);
        edu.util.viewValById("dropDoiTuongApDung", data.DOITUONGAPDUNG_ID);
        edu.util.viewValById("dropThangDiem", data.THANGDIEM_ID);
        edu.util.viewValById("dropNhomTieuChi", data.NHOMTIEUCHI_ID);
        edu.util.viewValById("dropNhapTrucTiep", data.NHAPTRUCTIEP);
        me.strTieuChiDiem_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_LoaiTieuChi: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true
            },
            renderPlace: ["dropLoaiTieuChi"],
            title: "Chọn danh mục tiêu chí"
        };
        edu.system.loadToCombo_data(obj);
    }
}