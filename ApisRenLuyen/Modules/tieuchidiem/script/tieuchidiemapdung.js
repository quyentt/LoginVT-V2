/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TieuChiDiemApDung() { };
TieuChiDiemApDung.prototype = {
    strTieuChiDiemApDung_Id: '',
    dtTieuChiDiemApDung: [],
    dtDMTieuChiDiemApDung: [],
    
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_TieuChiDiemApDung();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_NamNhapHoc();
        me.getList_ThoiGianDaoTao();
        me.getList_DMTieuChi();

        edu.system.loadToCombo_DanhMucDuLieu("DRL.DOITUONGAPDUNG", "dropSearch_DoiTuong,dropDoiTuongApDung");
        edu.system.loadToCombo_DanhMucDuLieu("DRL.THANGDIEM", "dropThangDiem");
        edu.system.loadToCombo_DanhMucDuLieu("DRL.DMTC", "dropNhomTieuChi");
        $("#tblViewTieuChiDiemApDung").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strTieuChiDiemApDung_Id = strId;
                var data = edu.util.objGetDataInData(strId, me.dtTieuChiDiemApDung, "ID")[0];
                me.viewForm_TieuChiDiemApDung(data);
                edu.util.viewValById("dropLoaiTieuChi", data.DRL_TIEUCHIDANHGIA_ID);
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
            me.save_TieuChiDiemApDung();
        });
        $("#btnDelete_TieuChi").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_TieuChiDiem(me.strTieuChiDiem_Id);
            });
        });
        $("#btnSearch").click(function () {
            me.getList_TieuChiDiemApDung();
        });

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
        });
        $("#dropLoaiTieuChi").on("select2:select", function () {
            var strId = this.value;
            if (edu.util.checkValue(strId)) {
                me.viewForm_TieuChiDiemApDung(edu.util.objGetDataInData(strId, me.dtDMTieuChiDiemApDung, "ID")[0]);
            }
        });

        $("#btnKeThua").click(function () {
            if (!edu.util.checkValue(edu.util.getValById('dropSearch_KhoaDaoTao'))) {
                edu.system.alert("Bạn cần chọn khóa");
                return;
            }
            if (!edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc")) && !edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao"))) {
                edu.system.alert("Bạn cần chọn năm học hoặc thời gian đào tạo");
                return;
            }
            var html = "";
            if (edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc"))) {
                html = "năm học" + $("#dropSearch_NamHoc option:selected").text();
            }
            else {
                html = "học kỳ" + $("#dropSearch_ThoiGianDaoTao option:selected").text();
            }
            edu.system.confirm("Bạn có muốn kế thừa từ khóa: " + $("#dropSearch_KhoaDaoTao option:selected").text() + " và " + html);
            $("#btnYes").click(function (e) {
                me.keThua_TieuChiDiemApDung();
            });
        });
        $("#btnXoaToanBo").click(function () {
            if (!edu.util.checkValue(edu.util.getValById('dropSearch_KhoaDaoTao'))) {
                edu.system.alert("Bạn cần chọn khóa");
                return;
            }
            if (!edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc")) && !edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao"))) {
                edu.system.alert("Bạn cần chọn năm học hoặc thời gian đào tạo");
                return;
            }
            var html = "";
            if (edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc"))) {
                html = "năm học" + $("#dropSearch_NamHoc option:selected").text();
            }
            else {
                html = "học kỳ" + $("#dropSearch_ThoiGianDaoTao option:selected").text();
            }
            edu.system.confirm("Bạn có muốn xóa toàn bộ tiêu chí của khóa: " + $("#dropSearch_KhoaDaoTao option:selected").text() + " và " + html);
            $("#btnYes").click(function (e) {
                me.delete_TieuChiDiemApDung_ToanBo();
            });
        });
        edu.system.hiddenElement('{"readonly": "#txtTenTieuChi,#txtMaTieuChi","readonlyselect2": "#dropThangDiem,#dropNhomTieuChi"}');
    },
    popup: function () {
        var me = this;
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strTieuChiDiemApDung_Id = "";
        edu.util.viewValById("dropLoaiTieuChi", "");
        edu.util.viewValById("dropLoaiTieuChiCha", "");
        edu.util.viewValById("txtThuTu", "");
        edu.util.viewValById("txtTenTieuChi", "");
        edu.util.viewValById("txtMaTieuChi", "");
        edu.util.viewValById("txtMucDiem", "");
        edu.util.viewValById("dropDoiTuongApDung", edu.util.getValById('dropSearch_DoiTuong'));
        edu.util.viewValById("dropThangDiem", "");
        edu.util.viewValById("dropNhomTieuChi", "");
        edu.util.viewValById("dropNhapTrucTiep", 1);
        edu.util.viewValById("dropHeDaoTao", edu.util.getValById('dropSearch_HeDaoTao'));
        edu.util.viewValById("dropKhoaDaoTao", edu.util.getValById('dropSearch_KhoaDaoTao'));
        edu.util.viewValById("dropNamHoc", edu.util.getValById('dropSearch_NamHoc'));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById('dropSearch_ThoiGianDaoTao'));
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TieuChiDiemApDung: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_TieuChiDanhGia_AD/ThemMoi',
            

            'strId': me.strTieuChiDiemApDung_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'strMa': edu.util.getValById('txtMaTieuChi'),
            'strTen': edu.util.getValById('txtTenTieuChi'),
            'dMucDiemQuyDinh': edu.util.getValById('txtMucDiem'),
            'strNhomTieuChi_Id': edu.util.getValById('dropNhomTieuChi'),
            'strDRL_TieuChiDanhGia_Cha_Id': edu.util.getValById('dropLoaiTieuChiCha'),
            'iThuTu': edu.util.getValById('txtThuTu'),
            'strThangDiem_Id': edu.util.getValById('dropThangDiem'),
            'dNhapTrucTiep': edu.util.getValById('dropNhapTrucTiep'),
            'strNguoiThucHien_Id': edu.system.userId,

            'strDRL_TieuChiDanhGia_Id': edu.util.getValById('dropLoaiTieuChi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropThoiGianDaoTao")) ? edu.util.getValById('dropThoiGianDaoTao') : edu.util.getValById('dropNamHoc'),
            'strPhamViApDung_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'RL_TieuChiDanhGia_AD/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_TieuChiDiemApDung();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alertOnModal(obj_notify);
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
    getList_TieuChiDiemApDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChiDanhGia_AD/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDRL_TieuChiDanhGia_Cha_id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNhomTieuChi_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'pageIndex': 1,
            'pageSize': 10000,
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTieuChiDiemApDung = dtReRult;
                    me.insertHeaderTable("tblViewTieuChiDiemApDung", dtReRult, null);
                    me.genCombo_LoaiTieuChiCha(dtReRult);
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
    delete_TieuChiDiemApDung: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'RL_TieuChiDanhGia_AD/Xoa',
            
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
                    me.getList_TieuChiDiemApDung();
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
    keThua_TieuChiDiemApDung: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_TieuChiDanhGia_AD/KeThua',
            
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công");
                    me.getList_TieuChiDiemApDung();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(data.Message);
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
    delete_TieuChiDiemApDung_ToanBo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'RL_TieuChiDanhGia_AD/Xoa_DRL_TieuChiDanhGia_AD_PV',
            
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.getList_TieuChiDiemApDung();
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
            $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center btnEdit poiter' id='" + objHead.ID + "' colspan='" + colspan + "' style='text-decoration: underline;'>" + objHead.TEN + "</th>");
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
    viewForm_TieuChiDiemApDung: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //me.resetPopup();
        //view data --Edit
        //edu.util.viewValById("dropLoaiTieuChi", data.ID);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtTenTieuChi", data.TEN);
        edu.util.viewValById("txtMaTieuChi", data.MA);
        edu.util.viewValById("txtMucDiem", data.MUCDIEMQUYDINH);
        edu.util.viewValById("dropDoiTuongApDung", data.DOITUONGAPDUNG_ID);
        edu.util.viewValById("dropThangDiem", data.THANGDIEM_ID);
        edu.util.viewValById("dropNhomTieuChi", data.NHOMTIEUCHI_ID);
        edu.util.viewValById("dropNhapTrucTiep", data.NHAPTRUCTIEP);
        edu.util.viewValById("dropLoaiTieuChiCha", data.DRL_TIEUCHIDANHGIA_CHA_ID);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_DMTieuChi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChiDanhGia_AD/LayDSTieuChiDanhGiaChuaDung',
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDMTieuChiDiemApDung = dtReRult;
                    me.genCombo_LoaiTieuChi(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genCombo_LoaiTieuChi: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropLoaiTieuChi"],
            title: "Chọn danh mục tiêu chí"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    genCombo_LoaiTieuChiCha: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropLoaiTieuChiCha"],
            title: "Chọn tiêu chí cha"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);

    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValById("dropKhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strNganh_Id: edu.util.getValById("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            'strNguoiThucHien_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadToCombo_NamNhapHoc(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao", "dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenBo_TrangThai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropTinhTrangSinhVien"]
        }
        edu.system.loadToCombo_data(obj);
        //$('#dropTinhTrangSinhVien option').prop('selected', true);
    },
    loadToCombo_PhamVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropPhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMNHAPHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropSearch_NamHoc", "dropNamHoc"],
            type: "",
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
}