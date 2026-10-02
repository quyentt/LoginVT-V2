/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function BangLuong() { };
BangLuong.prototype = {
    arrHeadDiem_Id: [],
    dtCauTrucBangLuong: [],
    dtDuLieuLuong: [],
    arrHeadDiem_Nam_Id: [],
    dtCauTrucBangLuong_Nam:[],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIBANGLUONG", "", "", me.genCombo_LoaiBangLuong);

        $("#btnViewLuong").click(function () {
            var strThang = edu.util.getValById("txtSearch_Thang");
            var strNam = edu.util.getValById("txtSearch_Nam");
            if (!edu.util.checkValue(strNam)) {
                edu.system.alert("Hãy nhập đủ thông tin", "w");
                return;
            }
            $("#lblNamTinhLuong").html("THÁNG " + strThang + " NĂM " + strNam);
            $(".zoneview").slideDown();
            me.getList_CauTrucBangLuong();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_TinhLuong", function (addKeyValue) {
            addKeyValue("strLoaiBangLuong_Id", edu.util.getValById("dropLoaiBangLuong"));
            addKeyValue("strNhanSu_QuyDinhLuong_Id", edu.util.getValById("dropSearch_QuyDinh"));
            addKeyValue("strDaoTao_CoCauToChuc_Id", edu.util.getValById('dropSearch_DonViThanhVien'));
            addKeyValue("strNhanSu_HoSoCanBo_Id", edu.util.getValById('dropSearch_ThanhVien'));
            addKeyValue("dNam", edu.util.getValById('txtSearch_Nam'));
            addKeyValue("dThang", edu.util.getValById('txtSearch_Thang'));
            addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
        });
        var date = new Date(Date.now());
        edu.util.viewValById("txtSearch_Thang", date.getMonth());
        edu.util.viewValById("txtSearch_Nam", date.getFullYear());

        $("#tblKhoiTao_NhanSu").delegate('.btnDetail', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_LuongThang(this);
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CauTrucBangLuong: function (strDanhSach_Id) {
        var me = this;
        var dThang = edu.util.getValById('txtSearch_Thang');
        if (dThang == "") dThang = -1;
        //--Edit
        var obj_list = {
            'action': 'L_TraCuu_BangLuong/LayDanhSach',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'dNam': edu.util.getValById('txtSearch_Nam'),
            'dThang': dThang,
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadHead(dtReRult);
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
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha, strName) {
        //Khởi tạo table
        $("#" + strTable_Id).html('<thead style="font-weight: bold"><tr><td>Stt</td><td>'+strName + '</td><td>Mã số</td><td>Họ tên</td></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr></thead><tbody></tbody><tfoot></tfoot>');

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
    loadHead: function (data) {
        var me = this;
        me.arrHeadDiem_Id = me.insertHeaderTable("tblKhoiTao_NhanSu", data, null, "Tháng");
        me.getList_DuLieuBangLuong();
    },

    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DuLieuBangLuong: function () {
        var me = this;
        //--Edit
        var dThang = edu.util.getValById('txtSearch_Thang');
        if (dThang == "") dThang = -1;
        var obj_list = {
            'action': 'L_TraCuu_BangLuong/LayDSDuLieuBangLuong',
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'dThang': dThang,
            'dNam': edu.util.getValById('txtSearch_Nam'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var dtNhanSu = dtReRult.rsNhanSu;
                    var dtDuLieuLuong = dtReRult.rsDuLieuLuong;
                    me.dtDuLieuLuong = dtDuLieuLuong;
                    me.genTable_DuLieuBangLuong(dtNhanSu);
                    me.genData_DuLieuBangLuong(dtDuLieuLuong);
                    me.getList_CauTrucBangLuong_Nam();
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
    genTable_DuLieuBangLuong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKhoiTao_NhanSu",
            aaData: data,
            colPos: {
                center: [0, 1, 2],
                left: [3]
            },
            aoColumns: [

                {
                    "mDataProp": "THANG"
                },
                {
                "mDataProp": "NHANSU_HOSOCANBO_MASO"
            },
            {
                "mData": "QUANHE_TEN",
                "mRender": function (nRow, aData) {
                    return aData.NHANSU_HOSOCANBO_HO + " " + aData.NHANSU_HOSOCANBO_TEN;
                }
            }
            ]
        };
        edu.system.arrId = [];
        for (var i = 0; i < me.arrHeadDiem_Id.length; i++) {
            if (me.arrHeadDiem_Id[i] != undefined && me.arrHeadDiem_Id[i] != "") {
                edu.system.arrId.push(me.arrHeadDiem_Id[i]);
                jsonForm.aoColumns.splice(3, 0, {
                    "mRender": function (nRow, aData) {
                        var istt = edu.system.icolumn++;
                        return '<label id="lbl' + aData.ID + "_" + edu.system.arrId[istt] + '" style="text-align: right"></label>';
                    }
                });
            }
        }
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genData_DuLieuBangLuong: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var point = $("#lbl" + aData.ID + "_" + aData.THANHPHAN_ID);
            var strGiaTri = aData.THANHPHAN_GIATRI;
            if (strGiaTri == null) strGiaTri = "";
            if (strGiaTri.indexOf(".") == 0) strGiaTri = "0" + strGiaTri;

            if (parseFloat(strGiaTri) != NaN && parseFloat(strGiaTri).toString().length == strGiaTri.length) strGiaTri = edu.util.formatCurrency(aData.THANHPHAN_GIATRI);
            point.html(edu.util.formatCurrency(strGiaTri));
            
            if (aData.THANHPHAN_GIATRI != "" && aData.THANHPHAN_GIATRI != 0) {
                var obj = edu.util.objGetOneDataInData(aData.THANHPHAN_ID, me.dtCauTrucBangLuong, "THANHPHAN_ID")
                if (obj.LATHANHPHANCUOI == 0) point.after('<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" name="' + aData.THANHPHAN_ID + '" title="Xem chi tiết lương">Chi tiết</span>'); 
            }
        }
        
        var arrLuong = [];
        for (var i = 0; i < me.arrHeadDiem_Id.length; i++) {
            arrLuong.push(i + 4);
        }
        edu.system.insertSumAfterTable("tblKhoiTao_NhanSu", arrLuong);
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
                default_val: 1
            },
            renderPlace: ["dropLoaiBangLuong"],
            title: "Chọn loại bảng lương"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropLoaiBangLuong").select2();
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CauTrucBangLuong_Nam: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_TraCuu_BangLuongNam/LayDanhSach',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'dNam': edu.util.getValById('txtSearch_Nam'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadHead_Nam(dtReRult);
                    me.dtCauTrucBangLuong_Nam = dtReRult;
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
    loadHead_Nam: function (data) {
        var me = this;
        me.arrHeadDiem_Nam_Id = me.insertHeaderTable("tblKhoiTao_NhanSu_CaNam", data, null, "Năm");
        me.getList_DuLieuBangLuong_Nam();
    },

    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DuLieuBangLuong_Nam: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_TraCuu_BangLuongNam/LayDSDuLieuBangLuongNam',
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'dNam': edu.util.getValById('txtSearch_Nam'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var dtNhanSu = dtReRult.rsNhanSu;
                    var dtDuLieuLuong = dtReRult.rsDuLieuLuong;
                    me.genTable_DuLieuBangLuong_Nam(dtNhanSu);
                    me.genData_DuLieuBangLuong_Nam(dtDuLieuLuong);
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
    genTable_DuLieuBangLuong_Nam: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKhoiTao_NhanSu_CaNam",
            aaData: data,
            colPos: {
                center: [0]
            },
            aoColumns: [{
                "mDataProp": "NAM"
            },{
                "mDataProp": "NHANSU_HOSOCANBO_MASO"
            },
            {
                "mData": "QUANHE_TEN",
                "mRender": function (nRow, aData) {
                    return aData.NHANSU_HOSOCANBO_HO + " " + aData.NHANSU_HOSOCANBO_TEN;
                }
            }
            ]
        };
        edu.system.arrId = [];
        for (var i = 0; i < me.arrHeadDiem_Nam_Id.length; i++) {
            if (me.arrHeadDiem_Nam_Id[i] != undefined && me.arrHeadDiem_Nam_Id[i] != "") {
                edu.system.arrId.push(me.arrHeadDiem_Nam_Id[i]);
                jsonForm.aoColumns.push({
                    "mRender": function (nRow, aData) {
                        var istt = edu.system.icolumn++;
                        return '<label id="lbl' + aData.ID + "_" + edu.system.arrId[istt] + '"></label>';
                    }
                });
            }
        }
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genData_DuLieuBangLuong_Nam: function (data) {
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strGiaTri = aData.THANHPHAN_GIATRI;
            if (strGiaTri == null) strGiaTri = "";
            if (strGiaTri.indexOf(".") == 0) strGiaTri = "0" + strGiaTri;
            if (parseFloat(strGiaTri) != NaN && parseFloat(strGiaTri).toString().length == strGiaTri.length) strGiaTri = edu.util.formatCurrency(strGiaTri);
            $("#lbl" + aData.ID + "_" + aData.THANHPHAN_ID).html(strGiaTri);
        }
    },

    /*------------------------------------------
    --Discription: [1] AcessDB ChuyenPhong
    -------------------------------------------*/
    getList_LuongThang: function (point) {
        var me = this;
        var json = edu.util.objGetOneDataInData(point.id, me.dtDuLieuLuong, "ID");
        //--Edit
        var obj_list = {
            'action': 'L_TraCuu_LuongThang/LayChiTiet',
            'strThanhPhan_Id': $(point).attr("name"),
            'dNam': json.NAM,
            'dThang': json.THANG,
            'strNhanSu_HoSoCanBo_Id': json.NHANSU_HOSOCANBO_ID,
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
                    me.genTable_LuongThang(dtResult, point);
                }
                else {
                    edu.system.alert(obj_list + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LuongThang: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLuongThang",
            aaData: data,
            colPos: {
                center: [0],
                right: [2]
            },
            aoColumns: [
                {
                    "mDataProp": "THANHPHAN_GIATRI_NOIDUNG"
                },
                {
                    "mData": "THANHPHAN_GIATRI_CHITIET",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.THANHPHAN_GIATRI_CHITIET);
                    }

                },
                {
                    "mDataProp": "THANHPHAN_GIATRI_NGAY"
                },
                {
                    "mDataProp": "THANHPHAN_GIATRI_THUETNCN"
                },
                {
                    "mDataProp": "THANHPHAN_GIATRI_GHICHU"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: Gen ChuyenPhong
    --ULR: Modules
    -------------------------------------------*/
    genList_LuongThang: function (json, point) {
        var me = this;
        var row = "";
        row += '<div class="pcard" id="pcard' + point.id + '" style="width: 500px !important; float: left; padding-left: 0px; margin-top: -7px; font-size: 11px"></td>';
        row += '<table class="table table-hover tablecenter">';
        row += '<thead>';
        row += '<tr >';
        row += '<th class="td-fixed">Stt</th>';
        row += '<th class="td-center" style="width: 150px"><span class="lang" key="">Số tiền</span></th>';
        row += '<th class="td-left" style="width: 200px"><span class="lang" key="">Nội dung</span></th>';
        row += '<th class="td-left" style="width: 120px"><span class="lang" key="">Ngày</span></th>';
        row += '<th class="td-left" style="width: 200px"><span class="lang" key="">Ghi chú</span></th>';
        row += '</tr >';
        row += '</thead>';
        row += '<tbody>';
        for (var i = 0; i < json.length; i++) {

            row += '<tr>';
            row += '<td>' + edu.util.returnEmpty(json[i].THANHPHAN_GIATRI_STT) + '</td>';
            row += '<td class="td-center">' + edu.util.returnEmpty(json[i].THANHPHAN_GIATRI_CHITIET) + '</td>';
            row += '<td class="td-left">' + edu.util.returnEmpty(json[i].THANHPHAN_GIATRI_NOIDUNG) + '</td>';
            row += '<td class="td-left">' + edu.util.returnEmpty(json[i].THANHPHAN_GIATRI_NGAY) + '</td>';
            row += '<td class="td-right">' + edu.util.returnEmpty(json[i].THANHPHAN_GIATRI_GHICHU) + '</td>';
            row += '</tr>';
        }
        row += '</tbody>';
        row += '</table>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'click',
            html: true,
            placement: 'bottom',
        });
        $(point).popover('show');
        //setTimeout(function () {
        //    $(point).popover('destroy');
        //}, (json.length + 9) * 500);
    },
}