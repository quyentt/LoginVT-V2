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
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
        $("#tblKhoiTao_NhanSu").delegate("input", "focus", function () {
            //console.log(this.parentNode.parentNode);
            //$("#tblKhoiTao_NhanSu_Data .tr-bg-diem").each(function () {
            //    this.classList.remove("tr-bg-diem");
            //});
            $("#tblKhoiTao_NhanSu .tr-bg-diem").each(function () {
                this.classList.remove("tr-bg-diem");
            });
            $("#clone .tr-bg-diem").each(function () {
                this.classList.remove("tr-bg-diem");
            });
            var strMyId = this.id;
            var strColId = this.id.substring(33);
            this.parentNode.parentNode.classList.add("tr-bg-diem");
            $("#tblKhoiTao_NhanSu input[id!='']").each(function () {
                //console.log(this.parentNode);
                if (this.id.substring(33) == strColId) this.parentNode.classList.add("tr-bg-diem");
            });
            $("#tblKhoiTao_NhanSu th[id!='']").each(function () {
                //console.log(this.parentNode);
                if (this.id == strColId) this.classList.add("tr-bg-diem");
            });
            $("#clone th[id!='']").each(function () {
                //console.log(this.parentNode);
                if (this.id == strColId) this.classList.add("tr-bg-diem");
            });
        });
        $("#dropSearch_DonViThanhVien").on("select2:select", function () {
            me.getList_HS();
        });
        me.getList_QuyDinhLuong();
        me.getList_CoCauToChuc();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIBANGLUONG", "", "", me.genCombo_LoaiBangLuong);

        $("#btnViewLuong").click(function () {
            var strQuyDinhLuong = edu.util.getValById("dropSearch_QuyDinh");
            var strNam = edu.util.getValById("txtSearch_Nam");
            if (!edu.util.checkValue(strQuyDinhLuong) || !edu.util.checkValue(strNam)) {
                edu.system.alert("Hãy nhập đủ thông tin", "w");
                return;
            }
            me.getList_CauTrucBangLuong();
        });
        $("#btnTinhLuong").click(function () {
            me.TinhLuong();
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
    },
    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
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
                    me.genCombo_QuyDinhLuong(dtReRult, data.Pager);
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
    genCombo_QuyDinhLuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MUCLUONGCOBAN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_QuyDinh"],
            title: "Chọn quy định lương"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonViThanhVien"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVien"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CauTrucBangLuong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_LuongNam_CauTruc/LayDanhSach',
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropSearch_QuyDinh"),
            'strNguoiThucHien_Id': "",
            'strLoaiBangLuong_Id': edu.util.getValById("dropLoaiBangLuong")
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

    getList_HSSV: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            
            'pageIndex': 1,
            'pageSize': 50,
            'strHeDaoTao_Id': edu.util.getValById("dropSearchSinhVien_He"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearchSinhVien_Khoa"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearchSinhVien_ChuongTrinh"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearchSinhVien_Lop"),
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtSearchSinhVien_TuKhoa"),
        }

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_HS = data.Data;
                    me.genTable_HSSV(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_HSSV: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKhoiTao_NhanSu",
            aaData: data,
            colPos: {
                center: [0]
            },
            aoColumns: [{
                "mDataProp": "MASO"
            },
            {
                "mData": "QUANHE_TEN",
                "mRender": function (nRow, aData) {
                    return aData.HODEM + " " + aData.TEN;
                }
            }
            ]
        };
        edu.system.arrId = [];
        for (var i = 0; i < me.arrHeadDiem_Id.length; i++) {
            if (me.arrHeadDiem_Id[i] != undefined && me.arrHeadDiem_Id[i] != "") {
                edu.system.arrId.push(me.arrHeadDiem_Id[i]);
                jsonForm.aoColumns.splice(2, 0, {
                    "mRender": function (nRow, aData) {
                        var istt = edu.system.icolumn++;
                        return '<input id="' + aData.ID + "_" + edu.system.arrId[istt] + '" class="form-control"/>';
                    }
                });
            }
        }
        //for (var i = jsonRow.length - 1; i >= 0; i--) {
        //    jsonData.aoColumns.splice(5, 0, jsonRow[i]);
        //}
        edu.system.loadToTable_data(jsonForm);
        setTimeout(function () {
            me.move_ThroughInTable("tblKhoiTao_NhanSu");
            function moveScroll() {
                var scroll = $(window).scrollTop();
                var anchor_top = $("#tblKhoiTao_NhanSu").offset().top;
                var anchor_bottom = $("#bottom_anchor").offset().top;
                if (scroll > anchor_top && scroll < anchor_bottom) {
                    clone_table = $("#clone");
                    if (clone_table.length == 0) {
                        clone_table = $("#tblKhoiTao_NhanSu").clone();
                        clone_table.attr('id', 'clone');
                        clone_table.css({
                            position: 'fixed',
                            'pointer-events': 'none',
                            top: 0
                        });
                        clone_table.width($("#tblKhoiTao_NhanSu").width());
                        $("#table-container").append(clone_table);
                        $("#clone").css({ visibility: 'hidden' });
                        $("#clone thead").css({ visibility: 'visible' });
                    }
                } else {
                    $("#clone").remove();
                }
            }
            $(window).scroll(moveScroll);
        }, 2000);

        /*III. Callback*/
    },
    move_ThroughInTable: function (strTable_Id, strDoiTuongDiChuyyen) { // di chuyển giữa các inpnut trong bảng
        if (strDoiTuongDiChuyyen === "" || strDoiTuongDiChuyyen === undefined || strDoiTuongDiChuyyen === null) strDoiTuongDiChuyyen = "input, select, textarea";
        //Lấy toàn bộ địa chỉ các phần từ cần di chuyển (input, select,textarea)  lưu vào bảng nhớ
        var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find(strDoiTuongDiChuyyen);
        //Lấy chiều dài bảng tương ứng với chiều dài dòng đầu tiên
        var iChieuDaiBang = $("#" + strTable_Id).find("tbody").find("tr:eq(0)").find(strDoiTuongDiChuyyen).length;
        //Khi table có click sẽ chỉ xác nhận với các key di chuyển đã quy định
        $("#" + strTable_Id + " tbody tr td " + strDoiTuongDiChuyyen).keydown(function (e) {
            //Tìm địa chỉ hiện tại của đối tượng trước khi di chuyển bằng cách kiểm tra địa chỉ có nó xem có trùng với thằng nào trong bảng nhớ trên
            var iVitri = IndexOf(arrElement, this);
            //Vị trí = -1 với trường hợp không tìm thấy địa chỉ hiện tại
            if (iVitri == -1) return;
            switch (parseInt(e.which, 10)) {
                case 39: //Sang phải bằng cách lây vị trí của nó cộng với 1
                    $(arrElement[iVitri + 1]).focus();
                    break;
                case 38: //Lên trên bằng cách lấy địa chỉ của nó bằng cách lấy dòng hiện tại(x) - 1(key: di chuyển lên trên) nhân chiều dài bảng và cộng với vị trí cột (y): "(x-1)*ly + y"
                    var idongthu = Math.floor(iVitri / iChieuDaiBang);
                    var icotthu = iVitri % iChieuDaiBang;
                    $(arrElement[((idongthu - 1) * iChieuDaiBang) + icotthu]).focus();
                    break;
                case 37: //Sang trái bằng cách lây vị trí của nó trừ đi 1
                    $(arrElement[iVitri - 1]).focus();
                    break;
                case 13:// nút enter
                case 40: //Xuống dưới bằng cách lấy địa chỉ của nó bằng cách lấy dòng hiện tại(x)  1(key: di chuyển xuống dưới) nhân chiều dài bảng và cộng với vị trí cột (y): "(x+1)*ly + y"
                    var idongthu = Math.floor(iVitri / iChieuDaiBang);
                    var icotthu = iVitri % iChieuDaiBang;
                    $(arrElement[((idongthu + 1) * iChieuDaiBang) + icotthu]).focus();
                    break;
            }
        });

        function IndexOf(arrX, eY) {
            for (var i = 0; i < arrX.length; i++) {
                if (eY == arrX[i]) return i;
            }
            return -1;
        }
    },
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha) {
        //Khởi tạo table
        $("#" + strTable_Id).html('<thead style="font-weight: bold"><tr><td>Stt</td><td>Mã số</td><td>Họ tên</td><td>CCTC</td></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr></thead><tbody></tbody>');

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
        me.arrHeadDiem_Id = me.insertHeaderTable("tblKhoiTao_NhanSu", data, null);
        me.getList_DuLieuBangLuong();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    TinhLuong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'L_LuongNam_TinhLuong/ThucHienTinhLuong',
            
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strThang': "",
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiBangLuong_Id': edu.util.getValById("dropLoaiBangLuong")
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện tính lương thành công");
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

    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_DuLieuBangLuong: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'L_LuongNam_BangLuong/LayDanhSach',
            
            'strTuKhoa': "",
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById('dropSearch_QuyDinh'),
            'strNguoiTao_Id': "",
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strLoaiBangLuong_Id': edu.util.getValById("dropLoaiBangLuong"),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var dtNhanSu = dtReRult.rsNhanSu;
                    var dtDuLieuLuong = dtReRult.rsDuLieuLuong;
                    me.genTable_DuLieuBangLuong(dtNhanSu);
                    me.genData_DuLieuBangLuong(dtDuLieuLuong);
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
                center: [0]
            },
            aoColumns: [{
                "mDataProp": "NHANSU_HOSOCANBO_MASO"
            },
            {
                "mData": "QUANHE_TEN",
                "mRender": function (nRow, aData) {
                    return aData.NHANSU_HOSOCANBO_HO + " " + aData.NHANSU_HOSOCANBO_TEN;
                }
            },
            {
                "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
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
                        return '<label id="lbl' + aData.NHANSU_HOSOCANBO_ID + "_" + edu.system.arrId[istt] + '"></label>';
                    }
                });
            }
        }
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    genData_DuLieuBangLuong: function (data) {
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            $("#lbl" + aData.NHANSU_HOSOCANBO_ID + "_" + aData.THANHPHAN_ID).html(aData.THANHPHAN_GIATRI);
        }
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
                name: "TEN"
            },
            renderPlace: ["dropLoaiBangLuong"],
            title: "Chọn loại bảng lương"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropLoaiBangLuong").select2();
    },
}