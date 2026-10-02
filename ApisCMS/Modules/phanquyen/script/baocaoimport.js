/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function PhanQuyenBCIP() { };
PhanQuyenBCIP.prototype = {
    arrHead_Id: [],
    dtNguoiDung: [],
    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        $("#dropSearch_ChucNangPhanQuyenBCIP").on("select2:select", function () {
            me.getList_HanhDongTheo();
        });
        $("#dropSearch_UngDung").on("select2:select", function () {
            me.getList_ChucNangCanPhanQuyenBCIP();
        });
        $("#btnSearch").click(function () {
            me.getList_NguoiDungTheoChucNang();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiDungTheoChucNang();
            }
        });
        $("#tblViewCauTrucPhanQuyenBCIP").delegate(".chkSelectAll", "click", function (e) {
            
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            console.log(strClass);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblViewCauTrucPhanQuyenBCIP").delegate("#chkSelectAllTable", "click", function (e) {
            var checked_status = $(this).is(':checked');
            $("#tblViewCauTrucPhanQuyenBCIP tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });
        $("#btnPhanQuyenBCIP").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblViewCauTrucPhanQuyenBCIP .checkPhanQuyenBCIP");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push($(x[i]).attr("name"));
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy quyền " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.genHTML_Progress("divprogessPhanQuyenBCIP", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_PhanQuyenBCIP(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_PhanQuyenBCIP(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi để phân quyền");
            }
        });
        $("#btnThemMauBCIP").click(function () {
            if (!edu.util.checkValue(edu.util.getValById("dropSearch_UngDung")) || !edu.util.checkValue(edu.util.getValById("dropSearch_ChucNangPhanQuyenBCIP"))) {
                edu.system.alert("Bạn cần chọn ứng dụng và chức năng trước!");
                return;
            }
            $("#btnNotifyModal").remove();
            $('#myModal').modal('show');
        });
        $("#btnSave_PQ").click(function () {
            me.save_PhanQuyenBCIP_One();
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_UngDung();
        me.getList_ChucNangCanPhanQuyenBCIP();
        me.getList_BaoCaoChuaPhanQuyen();
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_UngDung: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_UngDung(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'CMS_UngDung/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'dTrangThai': -1,
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_UngDung: function (data) {
        var me =this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
            },
            renderPlace: ["dropSearch_UngDung"],
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HocPhan(dtResult);
                }
                else {
                    edu.system.alert("KHCT_LichGiang/LayDSHocPhan: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_LichGiang/LayDSHocPhan (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_LichGiang/LayDSHocPhan',
            
            contentType: true,
            
            data: {
                'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_BoMon'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
                'dToanBo': 1,
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var me = this;
        me.dtHocPhanCombo = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (row, aData) {
                    return aData.MA + " - " + aData.TEN;
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropSearch_HocPhan").val("").trigger("change");
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_LichGiang/LayDSHeDaoTao',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_HeDaoTao(data.Data, data.Pager);

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
    genCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_HanhDongTheo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyen_ThongTinChung/LayDSHanhDongTheo',
            'strUngDung_Id': edu.util.getValById("dropSearch_UngDung"),
            'strPhanQuyen_ChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenBCIP"),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_HanhDongTheo(data.Data, data.Pager);

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
    genCombo_HanhDongTheo: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HANHDONG_TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_QuyenThietLap"],
            title: "Chọn quyền cần thiết lập"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_ChucNangCanPhanQuyenBCIP: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyen_ThongTinChung/LayDSChucNangCanPhanQuyen',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUngDung_Id': edu.util.getValById("dropSearch_UngDung"),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_ChucNangCanPhanQuyenBCIP(data.Data, data.Pager);

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
    genCombo_ChucNangCanPhanQuyenBCIP: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "PHANQUYEN_CHUCNANG_TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_ChucNangPhanQuyenBCIP"],
            title: "Chọn chức năng phân quyền"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_NguoiDungTheoChucNang: function () {
        var me = this;
        //--Edit\
        var obj_list = {
            'action': 'CMS_PhanQuyen_ThongTinChung/LayDSNguoiDungTheoChucNang',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenBCIP"),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiDung = data.Data;
                    me.genData_NguoiDungTheoChucNang(data.Data, data.Pager);
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
    genData_NguoiDungTheoChucNang: function (data) {
        var me = this;
        var html = '<tr><th id="lblThongTinBang" class="td-center">Thông tin báo cáo được thiết lập quyền ' + $("#dropSearch_QuyenThietLap option:selected").text() + '</th>';
        
        for (var i = 0; i < data.length; i++) {
            html += '<th class="td-center">' + data[i].FULLNAME + " - " + data[i].NAME + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + data[i].ID + '"></th>';
        }
        html += '<th class="td-center">Tất cả <input type="checkbox" id="chkSelectAllTable"></th>';
        html += '</tr>';
        $("#tblViewCauTrucPhanQuyenBCIP thead").html(html);
        me.getList_CauTrucPhanQuyenBCIP();
        me.genCombo_NguoiDungTheoChucNang(data);
    },
    genCombo_NguoiDungTheoChucNang: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder",
                mRender: function (nRow, aData) {
                    return aData.FULLNAME + " - " + aData.NAME;
                }
            },
            renderPlace: ["dropPQ_CanBo"],
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/

    getList_CauTrucPhanQuyenBCIP: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyen_ThongTin/LayDSCauTrucPhanQuyenBaoCao',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strUngDung_Id': edu.util.getValById('dropSearch_UngDung'),
            'strPhanQuyen_ChucNang_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyenBCIP'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.arrHead_Id = me.insertHeaderTable("tblViewCauTrucPhanQuyenBCIP", dtReRult, null);
                    me.dtCauTrucPhanQuyenBCIP = dtReRult;
                    me.genTable_CauTrucPhanQuyenBCIP();
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
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        var me = this;
        //Khởi tạo table
        $("#" + strTable_Id + " tbody").html('');
        var imaxlength = 0;
        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].THANHPHAN_CHA_ID == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Chỉnh sửa colspan cho phần tử đầu tiên
        me.iMaxLength = imaxlength;
        document.getElementById("lblThongTinBang").colSpan = imaxlength + 1;
        //Add rowspan cho các thành phần không có phần từ con
        //rowspan = rowTheadOfTable - colspan
        var x = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].rowSpan;
                if (z == 1 && x[i].cells[j].colSpan != 1) {
                    x[i].cells[j].colSpan = (imaxlength + 2 - x[i].cells[j].colSpan);
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
            if (colspan == 0) {
                arrHeaderId.push(objHead.THANHPHAN_ID);
                $("#" + strTable_Id + " tbody").append('<tr><td colspan="' + (iThuTu + 1) + '">' + objHead.THANHPHAN_TEN + '</td></tr>');
                if (iThuTu > imaxlength) imaxlength = iThuTu;
            }
            else {
                $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td rowspan="' + colspan + '" >' + objHead.THANHPHAN_TEN + '</td>');
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
    genTable_CauTrucPhanQuyenBCIP: function (data, iPager) {
        var me = this;
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            var x = $("#tblViewCauTrucPhanQuyenBCIP tbody tr");
            for (var j = 0; j < me.dtNguoiDung.length; j++) {
                $(x[i]).append('<td style="text-align: center"><input type="checkbox" class="check' + me.dtNguoiDung[j].ID + ' check' + me.arrHead_Id[i] + ' checkPhanQuyenBCIP poiter" id="chkSelect' + me.arrHead_Id[i] + '_' + me.dtNguoiDung[j].ID +'"></td>');
            }
            $(x[i]).append('<td style="text-align: center"><input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + me.arrHead_Id[i] + '"></td>');
        }
        edu.system.genHTML_Progress("divprogessPhanQuyenBCIP", me.arrHead_Id.length);
        for (var i = 0; i < me.arrHead_Id.length; i++) {
            me.getData_CauTrucPhanQuyenBCIP(me.arrHead_Id[i]);
        }
    },

    getData_CauTrucPhanQuyenBCIP: function (strBaoCao_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyen_ThongTin/LayDSQuyenBaoCaoTheoNguoiDung',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhanQuyen_ChucNang_Id': edu.util.getValById('dropSearch_ChucNangPhanQuyenBCIP'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strBaoCao_Id': strBaoCao_Id,
            'strHanhDong_Id': edu.util.getValById('dropSearch_QuyenThietLap'),
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].QUYEN == 1) {
                            var check = $("#chkSelect" + strBaoCao_Id + "_" + dtReRult[i].ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].QUYEN_ID);
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
                edu.system.start_Progress("divprogessPhanQuyenBCIP", me.endGetPhanQuyenBCIP);
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessPhanQuyenBCIP", me.endGetPhanQuyenBCIP);
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    endGetPhanQuyenBCIP: function () {
        var me = main_doc.PhanQuyenBCIP;
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: lop hoc
    ----------------------------------------------*/
    save_PhanQuyenBCIP_One: function (point) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_PhanQuyen_MauImport/ThemMoi',
            'strId': '',
            'strUngDung_Id': edu.util.getValById("dropSearch_UngDung"),
            'strChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenBCIP"),
            'strMauImport_Id': edu.util.getValById("dropPQ_BaoCao"),
            'strNguoiDung_Id': edu.util.getValById("dropPQ_CanBo"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phân quyền thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

                edu.system.start_Progress("divprogessPhanQuyenBCIP", me.endGetPhanQuyenBCIP2);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                edu.system.start_Progress("divprogessPhanQuyenBCIP", me.endGetPhanQuyenBCIP2);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhanQuyenBCIP: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strToHopBoDuLieuQuyen = arrId[0].substring(9);
        var strNguoiDung_Id = arrId[1];
        //--Edit
        var obj_save = {
            'action': 'CMS_PhanQuyen_MauImport/ThemMoi',
            'strId': '',
            'strUngDung_Id': edu.util.getValById("dropSearch_UngDung"),
            'strChucNang_Id': edu.util.getValById("dropSearch_ChucNangPhanQuyenBCIP"),
            'strMauImport_Id': strToHopBoDuLieuQuyen,
            'strNguoiDung_Id': strNguoiDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phân quyền thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
                edu.system.start_Progress("divprogessPhanQuyenBCIP", me.endGetPhanQuyenBCIP2);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
                edu.system.start_Progress("divprogessPhanQuyenBCIP", me.endGetPhanQuyenBCIP2);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanQuyenBCIP: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'CMS_PhanQuyen_MauImport/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa quyền thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                edu.system.start_Progress("divprogessPhanQuyenBCIP", me.endGetPhanQuyenBCIP2);
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
                edu.system.start_Progress("divprogessPhanQuyenBCIP", me.endGetPhanQuyenBCIP2);
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endGetPhanQuyenBCIP2: function () {
        var me = main_doc.PhanQuyenBCIP;
        me.getList_NguoiDungTheoChucNang();
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
    -------------------------------------------*/
    getList_BaoCaoChuaPhanQuyen: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_PhanQuyen_ThongTin/LayDSBaoCaoChuaPhanQuyen',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genCombo_BaoCaoChuaPhanQuyen(data.Data, data.Pager);

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
    genCombo_BaoCaoChuaPhanQuyen: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropPQ_BaoCao"],
            title: "Chọn báo cáo"
        };
        edu.system.loadToCombo_data(obj);
    },
};
