/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 05/07/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ThuHoSo() { };
ThuHoSo.prototype = {
    iTinhTrangNhapHoc: 1,//(0-chua nhap, 1- da nhap, -1 toan bo)
    strKeHoach_Id: '',
    dtNguoiHoc: [],
    dtLoaiHoSo: [],
    strNguoiHoc_Id: '',
    strLopQuanLy_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [1] Action NguoiHoc_TTTS
        -------------------------------------------*/
        $("#tblNguoiHoc_ThuHoSo").delegate(".btnSelect_NguoiHoc_ThuHS", "click", function () {
            var strNguoiHoc_Id = this.id;            
            edu.util.resetAll_BgRow("tblNguoiHoc_ThuHoSo");
            edu.util.setOne_BgRow(strNguoiHoc_Id);

            console.log(strNguoiHoc_Id)
            if (edu.util.checkValue(strNguoiHoc_Id)) {
                me.reset_NguoiHoc_ThuHS();
                me.strNguoiHoc_Id = strNguoiHoc_Id;
                me.getList_KhoanNhapHoc(strNguoiHoc_Id);
                return new Promise(function (resolve, reject) {
                    me.getDetail_NguoiHoc_TTTS(strNguoiHoc_Id, main_doc.ThuHoSo.dtNguoiHoc, resolve, reject);

                }).then(function (data) {
                    me.genDetail_NguoiHoc_TTTS(data);
                    me.getList_ThuHoSo(strNguoiHoc_Id);
                    me.getList_LoaiHoSo();
                });
            }
        });
        $("#tblNguoiHoc_ThuHoSo").delegate(".btnPopover_NguoiHoc_ThuHS", "mouseenter", function () {
            var id = this.id;
            var data = me.dtNguoiHoc;
            var obj = this
            edu.extend.popover_NguoiHoc_TTTS(id, data, obj);
        });

        $("#tblFormInput_HoSo").delegate(".btnSelect_XacMinh_ThuHS", "click", function () {
            var strNguoiHoc_Id = this.id;
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(me.dtLoaiHoSo.find(e => e.ID == strNguoiHoc_Id));
        });
        //timkiem nguoihoc_ttts
        $('#dropKeHoachNhapHoc_ThuHoSo').on('select2:select', function () {
            var strId = $(this).find('option:selected').val();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuHoSo");
            var strTuKhoa = edu.util.getValById("txtKeyword_ThuHoSo");

            if (edu.util.checkValue(strId)) {
                me.strKeHoach_Id = strId;
            }
            else {
                me.strKeHoach_Id = "xxx";
            }
            //1. call nguoihoc_ttts
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $('.rdThuHoSo').on('change', function () {
            me.reset_NguoiHoc_ThuHS();
            me.iTinhTrangNhapHoc = $('input[name="rdThuHoSo"]:checked').val();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuHoSo");
            var strTuKhoa = edu.util.getValById("txtKeyword_ThuHoSo");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        $("#txtKeyword_ThuHoSo").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuHoSo");
                var strTuKhoa = edu.util.getValById("txtKeyword_ThuHoSo");
                if (!edu.util.checkValue(me.strKeHoach_Id)) {
                    me.strKeHoach_Id = "xxx";
                }
                //1. call nguoihoc_ttts
                me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
            }
        });
        $("#btnDel_Keyword_ThuHS").click(function () {
            edu.util.viewValById("txtKeyword_ThuHoSo", "");
            $("#txtKeyword_ThuHoSo").focus();
        });
        $("#btnSearch_NguoiHoc_ThuHS").click(function () {
            me.reset_NguoiHoc_ThuHS();
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuHoSo");
            var strTuKhoa = edu.util.getValById("txtKeyword_ThuHoSo");
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, strTuKhoa, me.cbGenTable_NguoiHoc_TTTS);
        });
        /*------------------------------------------
        --Discription: [2] Action ThuHoSo
        -------------------------------------------*/
        $("#btnAdd_ThuHoSo").click(function () {
            if (edu.util.checkValue(me.strNguoiHoc_Id)) {
                //zone input
                me.showHide_Box("zone-bus-hoso", "zone_input_hoso");
                //btn save
                me.showHide_Box("zone-action-hoso", "btnSave_ThuHoSo");
            }
            else {
                edu.system.alert("Vui lòng chọn Người học cần thu hồ sơ!");
            }
        });
        $("#btnClose_ThuHoSo").click(function () {
            //zone input
            me.showHide_Box("zone-bus-hoso", "zone_list_hoso");
            //btn save
            me.showHide_Box("zone-action-hoso", "btnAdd_ThuHoSo");
        });
        $("#btnSave_ThuHoSo").click(function () {
            me.save_ThuHoSo();
        });
        $("#btnToggle_ThongTinNopPhi").click(function (e) {
            e.preventDefault();
            var $zone = $("#zoneInput_ThuTien");
            var $btn = $(this);
            if ($zone.is(":visible")) {
                $zone.slideUp();
                $btn.html('<i class="fa fa-eye"></i> <span>Xem thông tin nộp phí</span>');
            } else {
                $zone.slideDown();
                $btn.html('<i class="fa fa-eye-slash"></i> <span>Ẩn thông tin nộp phí</span>');
            }
        });
        $("#btnDel_ThuHoSo").click(function () {
            me.resetText_LopQuanLy_Ten();
        });
        /*------------------------------------------
        --Discription: [3] Action LoaiHoSo
        -------------------------------------------*/
        $("#tblFormInput_HoSo").delegate(".btnDelete_SoLuong", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/delete_soluong/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                var $txtSoLuong = "#txtSoLuong_ThuHoSo" + selected_id;
                $($txtSoLuong).val("");
            }
        });
        edu.system.getList_MauImport("zonebtnTHS", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiHoc_ThuHoSo", "checkX");
            var obj_list = {
                'strTaiChinh_KeHoach_Id': edu.util.getValById('dropKeHoachNhapHoc_ThuHoSo'),
            };
            arrChecked_Id.forEach(e => {
                addKeyValue('strQLSV_NguoiHoc_Id', e);
            })
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            if (me.strNguoiHoc_Id) addKeyValue('strQLSV_NguoiHoc_Id', me.strNguoiHoc_Id);
        });
    },
    /*------------------------------------------
    --Discription: Common function
    -------------------------------------------*/
    page_load: function () {
        var me = main_doc.ThuHoSo;
        //me.showHide_Box("zone-bus-hoso", "zone_list_hoso");
        //me.showHide_Box("zone-action-hoso", "btnAdd_ThuHoSo");
        $("#txtKeyword_ThuHoSo").focus();

        return new Promise(function (resolve, reject) {
            edu.system.beginLoading();
            //obj, resolve, reject, callback
            var obj = {
                strNguoiDung_Id: edu.system.userId
            };
           me.getList_KeHoachNhapHoc_NhanSu(obj, resolve, reject, "");

        }).then(function (data) {
            me.genCombo_KeHoachNhapHoc(data);
            me.strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_ThuHoSo");
            if (!edu.util.checkValue(me.strKeHoach_Id)) {
                me.strKeHoach_Id = "xxx";
            }
            me.getList_NguoiHoc_TTTS(me.iTinhTrangNhapHoc, me.strKeHoach_Id, "", me.cbGenTable_NguoiHoc_TTTS);
        });
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide()
        //id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    reset_NguoiHoc_ThuHS: function () {
        var me = this;
        me.strNguoiHoc_Id = "";

        edu.util.resetHTMLById("lblHoTen_ThuHoSo");
        edu.util.resetHTMLById("lblNgaySinh_ThuHoSo");
        edu.util.resetHTMLById("lblSoDienThoai_ThuHoSo");
        edu.util.resetHTMLById("lblQueQuan_ThuHoSo");
        edu.util.resetHTMLById("lblKhuVuc_ThuHoSo");
        edu.util.resetHTMLById("lblDoiTuong_ThuHoSo");
        edu.util.resetHTMLById("lblPhanTramMienGiam_ThuHoSo");
        edu.util.resetHTMLById("lblNganhHoc_ThuHoSo");
    },
    open_modal: function () {
        $("#myModal_ChiTietLop").modal("show");
    },
    getText_LopQuanLy_Ten: function () {
        var me = this;
        //get html to fill into #3 Lop Sinh Vien
        var $lopquanly_ten = "#lopquanly_ten" + me.strLopQuanLy_Id;
        var strLopQuanLy_Ten = $($lopquanly_ten).text();
        $("#lblLopQuanLy_Ten").html(strLopQuanLy_Ten);
    },
    resetText_LopQuanLy_Ten: function () {
        var me = this;
        me.strLopQuanLy_Id = '';
        $("#lblLopQuanLy_Ten").text("CHƯA PHÂN LỚP!");
    },
    /*------------------------------------------
    --Discription: [3] ACCESS DB ==> HoSo
    --Author: 
    -------------------------------------------*/
    getList_ThuHoSo: function (strNguoiHoc_Id) {
        var me = this;
        var strLoaiHoSo_Id = "";
        var strQLSV_NguoiHoc_Id = strNguoiHoc_Id;
        var strNguoiThucHien_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 100000;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIPKSAxCS4iHgkuEi4P',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_HoSo',
            'iM': edu.system.iM,
            'strTuKhoa': strTuKhoa,
            'strLoaiHoSo_Id': strLoaiHoSo_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strNhapHoc_KeHoach_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var myResult = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(myResult);
                    if (edu.util.checkValue(dtResult)) {
                        console.log("dtResult: " + dtResult);
                    }
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi_er: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ThuHoSo: function () {
        var me = this;        
        //1. get value
        var $txtSoLuong = "";
        var dSoLuong = "";
        var arrSoLuong = [];
        var arrLoaiHoSo = [];
        console.log(me.dtLoaiHoSo.length);
        for (var i = 0; i < me.dtLoaiHoSo.length; i++) {
            var strHoSo_Id = me.dtLoaiHoSo[i].ID;
            $txtSoLuong = "txtSoLuong_ThuHoSo" + me.dtLoaiHoSo[i].ID;
            if ($("#" + $txtSoLuong).length == 1) {
                dSoLuong = edu.util.getValById($txtSoLuong);
            } else {
                dSoLuong = $('#chkSoLuong_ThuHoSo' + me.dtLoaiHoSo[i].ID).is(":checked")? "1": "0"
            }
            
            arrSoLuong.push(dSoLuong);
            arrLoaiHoSo.push(me.dtLoaiHoSo[i].LOAIHOSO_ID);
            console.log(strHoSo_Id);
            if ($("#zoneFileDinhKemfile" + strHoSo_Id + " ul li").length > 0) edu.system.saveFiles("file" + strHoSo_Id, strHoSo_Id, "SV_Files");
        }
        //2.
        var strQLSV_NguoiHoc_TTTS_Id = me.strNguoiHoc_Id;
        var strLoaiHoSo_Ids = arrLoaiHoSo.toString();
        var strLoaiHoSo_SoLuong_s = arrSoLuong.toString();
        var strNguoiThucHien_Id = edu.system.userId;

        console.log("strLoaiHoSo_Ids: " + strLoaiHoSo_Ids);
        console.log("strLoaiHoSo_SoLuong_s: " + strLoaiHoSo_SoLuong_s);
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4VKTQJLhIu',
            'func': 'PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuHoSo',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_TTTS_Id': strQLSV_NguoiHoc_TTTS_Id,
            'strLoaiHoSo_Ids': strLoaiHoSo_Ids,
            'strLoaiHoSo_SoLuong_s': strLoaiHoSo_SoLuong_s,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //-----------------------------------------------------------
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thu hồ sơ thành công!");
                }
                else {
                    edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.ThuHoSo: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.ThuHoSo(er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
   --Discription: [4] ACCESS DB ==> LoaiHoSo
   --Author: 
   -------------------------------------------*/
    getList_LoaiHoSo: function () {
        var me = main_doc.ThuHoSo;
        //--Edit
        var obj_list = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRICICIJLhIuDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSCacHoSoNhapHoc',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_TTTS_Id': me.strNguoiHoc_Id, 
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;

                    dtResult = data.Data;
                    me.dtLoaiHoSo = dtResult;
                    //
                    me.genFormInput_ThuHoSo(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GEN HTML ==> KeHoachNhapHoc
    --Author: 
    -------------------------------------------*/
    genCombo_KeHoachNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhapHoc_ThuHoSo"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [2] GEN HTML ==> ThuHoSo
    --Author: 
    -------------------------------------------*/
    genFormInput_ThuHoSo: function(data){
        var me = this;
        var iThuTu = 1;
        var strNhomHoSo = "";
        var jsonForm = {
            strTable_Id: "tblFormInput_HoSo",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "",
            //    iDataRow: 0,
            //},
            //sort: true,
            bHiddenOrder: true,
            colPos: {
                left: [1, 2],
                right: [4, 3],
                center: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NHOMHOSO_TEN"
                },
                {
                    //"mDataProp": "LOAIHOSO_TEN",
                    "mRender": function (nRow, aData) {
                        var btnXemHoSo = "";
                        if (aData.NHAPHOC_XACMINH_LOAIHOSO) btnXemHoSo = ' <span><a id="' + aData.ID + '" class="btnSelect_XacMinh_ThuHS" href="#">Xem Hồ sơ</a></span>'
                        if (strNhomHoSo != aData.NHOMHOSO_TEN) { strNhomHoSo = aData.NHOMHOSO_TEN; iThuTu = 1; }
                        return "" + iThuTu++ + ". " + edu.util.returnEmpty(aData.LOAIHOSO_TEN) + btnXemHoSo;
                    }
                }
                , {
                    "mDataProp": "SOLUONGQUYDINH"
                }
                 , {
                     "mRender": function (nRow, aData) {
                         var strId = aData.ID;
                         var dSoLuong = aData.SOLUONGTHUCTE;
                         if (aData.KIEUDULIEU_MA == "CHECK") { dSoLuong = aData.SOLUONGTHUCTE ? 'checked="checked"': ''; return '<input type="checkbox" id="chkSoLuong_ThuHoSo' + strId + '" ' + dSoLuong +'>' }
                         return '<input type="text" id="txtSoLuong_ThuHoSo' + strId + '" class="form-control td-right" onblur="main_doc.ThuHoSo.checkValid_ThuHoSo(' + dSoLuong + ",\'" + strId + "\'" + ')" value="' + dSoLuong + '" data-ax5formatter="money" placeholder="Nhập số lượng" />';
                     }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<div id="file' + aData.ID + '"></div>';
                    }
                }
                 , {
                     "mRender": function (nRow, aData) {
                         var strId = aData.ID;
                         var dSoLuong = aData.SOLUONGQUYDINH;
                         return '<a id="delete_soluong' + strId + '" class="poiter color-default btnDelete_SoLuong"><i class="fa fa-times-circle"></i></a>';
                     }
                 }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var arrUpload = [];
        data.forEach(e => { arrUpload.push("file" + e.ID); });
        edu.system.uploadFiles(arrUpload, "", (strFileId, path) => {
            $("#txtSoLuong_ThuHoSo" + strFileId.substring(4)).val($("#zoneFileDinhKem" + strFileId + " ul li").length);
        });
        setTimeout(function () {
            data.forEach(e => { edu.system.viewFiles("file" + e.ID, e.ID, "SV_Files")});
        }, 1000);
        //data.forEach()
        edu.system.actionRowSpan(jsonForm.strTable_Id, [1]);
        edu.system.page_load();
    },
    checkValid_ThuHoSo: function (dSoLuongQuyDinh, strId) {
        var dSoLuong_Thu = 0;
        var $txtSoLuong = "txtSoLuong_ThuHoSo" + strId;
        dSoLuong_Thu = edu.util.convertStrToNum(edu.util.getValById($txtSoLuong));
        if (dSoLuong_Thu > dSoLuongQuyDinh) {
            $($txtSoLuong).val(dSoLuongQuyDinh);
        }
    },
    /*------------------------------------------
    --Discription: [2] Gen html ==> NH_NguoiHoc_TTTS
    --Author: 
    -------------------------------------------*/
    getDetail_NguoiHoc_TTTS: function (strNguoiHoc_Id, data, resolve, reject) {
        var me = this;
        var count = 0;
        var checkdata = false;
        for (var i = 0; i < data.length; i++) {
            count++;
            if (strNguoiHoc_Id == data[i].ID) {
                checkdata = true;
                resolve(data[i]);
            }
        }
        if (count == data.length) {
            if (checkdata == false) {
                resolve([]);
            }
        }
    },
    genDetail_NguoiHoc_TTTS: function (data) {
        var me = this;
        //1. id gen place
        var strHoTen            = edu.util.returnEmpty(data.HODEM) + " " + edu.util.returnEmpty(data.TEN);
        var strNgaySinh         = edu.util.returnEmpty(data.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(data.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(data.NGAYSINH_NAM);
        var strSoBaoDanh        = edu.util.returnEmpty(data.SOBAODANH);
        var strSoDienThoai      = edu.util.returnEmpty(data.SODIENTHOAICANHAN);
        var strQueQuan          = edu.util.returnEmpty(data.HOKHAU_PHUONGXAKHOIXOM) + " - " + edu.util.returnEmpty(data.HOKHAU_QUANHUYEN_TEN) + " - " + edu.util.returnEmpty(data.HOKHAU_TINHTHANH_TEN);
        var strKhuVuc           = edu.util.returnEmpty(data.KHUVUC_TEN);
        var strDoiTuong         = edu.util.returnEmpty(data.DOITUONGDUTHI_TEN);
        var strPhanTramMienGiam = edu.util.returnZero(data.PHANTRAMMIENGIAM);
        var strNganhHoc         = edu.util.returnEmpty(data.NGANHHOC_TEN);
        //3. fill data into place
        edu.util.viewHTMLById("lblHoTen_ThuHoSo", strHoTen.toUpperCase());
        edu.util.viewHTMLById("lblNgaySinh_ThuHoSo", strNgaySinh);
        edu.util.viewHTMLById("lblSoBaoDanh_ThuHoSo", strSoBaoDanh);
        edu.util.viewHTMLById("lblSoDienThoai_ThuHoSo", strSoDienThoai);
        edu.util.viewHTMLById("lblQueQuan_ThuHoSo", strQueQuan);
        edu.util.viewHTMLById("lblKhuVuc_ThuHoSo", strKhuVuc);
        edu.util.viewHTMLById("lblDoiTuong_ThuHoSo", strDoiTuong);
        edu.util.viewHTMLById("lblPhanTramMienGiam_ThuHoSo", strPhanTramMienGiam);
        edu.util.viewHTMLById("lblCMT", edu.util.returnEmpty(data.CMTND_SO));
        edu.util.viewHTMLById("lblNganhHoc_ThuHoSo", strNganhHoc);
    },
    cbGenTable_NguoiHoc_TTTS: function (data, iPager) {
        //(0-chua nhap, 1- da nhap, -1 toan bo)
        var me = main_doc.ThuHoSo;
        me.dtNguoiHoc = data;
        var strTuKhoa = $("#txtKeyword_ThuHoSo").val();
        var jsonForm = {
            strTable_Id: "tblNguoiHoc_ThuHoSo",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThuHoSo.getList_NguoiHoc_TTTS('" + me.iTinhTrangNhapHoc + "', '" + me.strKeHoach_Id + "', '" + strTuKhoa + "',main_doc.ThuHoSo.cbGenTable_NguoiHoc_TTTS)",
                iDataRow: iPager,
            },
            arrClassName: ["tr-pointer", "btnPopover_NguoiHoc_ThuHS"],
            bHiddenOrder: true,
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [2],
                fix: [0],
                center: [3]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<img src="' + edu.system.getRootPathImg(aData.ANH) + '" class="table-img" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strHoDem = edu.util.returnEmpty(aData.HODEM);
                        var strTen = edu.util.returnEmpty(aData.TEN);
                        var strFullName = strHoDem + " " + strTen;
                        var strSoBaoDanh = edu.util.returnEmpty(aData.SOBAODANH);
                        var strCMND = edu.util.returnEmpty(aData.CMTND_SO);
                        var html = '';
                        html = '<span class="td-middle">' + strFullName + '</span><br />';
                        html += '<span class="td-middle td-font">' + strSoBaoDanh;
                        if (strCMND) {
                            html += ' - ' + strCMND;
                        }
                        html += '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        //condition: 0- chua nhap hoc || 1 - da nhap hoc
                        var html = '';
                        var iDaNhapHoc = aData.DANHAPHOC;
                        html += '<span><a id="' + aData.ID + '" class="btnSelect_NguoiHoc_ThuHS" href="#">Chọn</a></span>';
                        if (iDaNhapHoc == 1) {
                            if (aData.NHAPHOC_XACMINH_LOAIHOSO) {
                                html += '<span><a id="' + aData.ID + '" class="btnSelect_XacMinh_ThuHS" href="#">Xem Hồ sơ</a></span>';
                            } else {
                                html += '<br /><span><a><i class="fa fa-tag"></i></a></span>'
                            }
                            
                        }
                        else {
                            //nothing
                        }
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data.length == 1) {
            $("#tblNguoiHoc_ThuHoSo .btnSelect_NguoiHoc_ThuHS[id=" + data[0].ID + "]").trigger("click");
        }
    },    


    getList_QuanSoTheoLop: function (obj) {
        var me = this;
        var obj_list = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIVKS4vJhUoLwkuEi4MKC8pAik0LyYP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSThongTinHoSoMinhChung',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': obj.QLSV_NGUOIHOC_ID,
            'strLoaiHoSo_Id': obj.LOAIHOSO_ID,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_QuanSoTheoLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TRUONGTHONGTIN_TEN"
                },
                {
                    "mDataProp": "TRUONGTHONGTIN_GIATRI",
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_KhoanNhapHoc: function (strNguoiHoc_Id, resolve, reject) {
        var me = this;
        var strQLSV_NguoiHoc_TTTS_Id = strNguoiHoc_Id;
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRICICIKKS4gLw8pIDEJLiIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc',
            'iM': edu.system.iM,
            'strTC_KeHoachNhapHoc_Id': edu.util.getValById('dropKeHoachNhapHoc_ThuHoSo'),
            'strQLSV_NguoiHoc_TTTS_Id': strQLSV_NguoiHoc_TTTS_Id,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhoanThu = data.Data;
                    me.genTable_KhoanNhapHoc(data.Data);
                    if (typeof resolve === "function") {
                        resolve();
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_KhoanNhapHoc: function (data) {
        var me = this;
        var dTongiDinhMuc_Chung = 0;
        var dTongDinhMuc = 0;
        var dTongDaThu = 0;
        var dTongCanThu = 0;
        var jsonForm = {
            strTable_Id: "tblKhoanNhapHoc_ThuTien",
            aaData: data,
            bPaginate: {
                strFuntionName: "",
                iDataRow: 0,
            },
            bHiddenHeader: true,
            sort: true,
            colPos: {
                left: [1],
                right: [2, 3, 4, 5],
                center: [0, 6]
            },
            aoColumns: [
                {//Ten Khoan Thu
                    "mRender": function (nRow, aData) {
                        var strKhoanThu_Ten = aData.TAICHINH_CACKHOANTHU_TEN;
                        return '<span id="txtKhoanThu_Ten' + aData.TAICHINH_CACKHOANTHU_ID + '">' + strKhoanThu_Ten + '</span>';
                    }
                }
                , {//so tien dinh muc chung
                    "mRender": function (nRow, aData) {
                        var dSoTienDinhMuc_Chung = edu.util.returnZero(aData.SOTIENDINHMUC_CHUNG);
                        dTongiDinhMuc_Chung += dSoTienDinhMuc_Chung;
                        return '<span>' + edu.util.formatCurrency(dSoTienDinhMuc_Chung) + '</span>';
                    }
                }
                , {//So tien thuc thu (dinh muc) 
                    "mRender": function (nRow, aData) {
                        var dSoTienDinhMuc = edu.util.returnZero(aData.SOTIENDINHMUC);
                        dTongDinhMuc += dSoTienDinhMuc;
                        return '<span>' + edu.util.formatCurrency(dSoTienDinhMuc) + '</span>';
                    }
                }
                , {//so tien da thu
                    "mRender": function (nRow, aData) {
                        var dSoTienDinhMuc = edu.util.returnZero(aData.SOTIENDINHMUC);
                        var dSoTienDaThu = edu.util.returnZero(aData.SOTIENDATHU);
                        dTongDaThu += dSoTienDaThu;
                        if (dSoTienDaThu > dSoTienDinhMuc) {
                            return '<span class="color-warning">' + edu.util.formatCurrency(dSoTienDaThu) + '</span>';
                        }
                        else {
                            return '<span>' + edu.util.formatCurrency(dSoTienDaThu) + '</span>';
                        }
                    }
                }
                , {// input so tien can thu
                    "mRender": function (nRow, aData) {
                        var strId = aData.TAICHINH_CACKHOANTHU_ID;
                        var dSoTienDinhMuc = edu.util.returnZero(aData.SOTIENDINHMUC);
                        var dSoTienDaThu = edu.util.returnZero(aData.SOTIENDATHU);
                        var dSoTienThu = dSoTienDinhMuc - dSoTienDaThu;
                        if (dSoTienThu < 0) {
                            dSoTienThu = 0;
                        }
                        //onblur="main_doc.ThuTien.checkValid_ThuTien(' + dSoTienThu + ",\'" + strId + "\'" + ')";
                        var html = '<input type="text" id="txtKhoanThu_SoTien' + strId + '" value="' + edu.util.formatCurrency(dSoTienThu) +
                            '" onblur="main_doc.ThuTien.sumTienCanNop_ThuTien()" class="form-control td-right" data-ax5formatter="money" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        //return '<a class="ponter btn btn-default btn-circle" id="btlHistory_ThuTien' + aData.ID + '"><i class="fa fa-eye color-active"></i></a>';
                        return "vnđ";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //sum footer
        edu.util.viewHTMLById("lblTongDinhMuc_Chung_ThuTien", edu.util.formatCurrency(dTongiDinhMuc_Chung));
        edu.util.viewHTMLById("lblTongDinhMuc_ThuTien", edu.util.formatCurrency(dTongDinhMuc));
        edu.util.viewHTMLById("lblTongDaThuThu_ThuTien", edu.util.formatCurrency(dTongDaThu));
        me.sumTienCanNop_ThuTien();
        //edu.util.viewHTMLById("lblTongCanThu_ThuTien", edu.util.formatCurrency(dTongDinhMuc - dTongDaThu));
        edu.system.page_load();
    },
    sumTienCanNop_ThuTien: function (id) {
        var me = this;
        var txtKhoanThu_SoTien = "";
        var dKhoanThu_SoTien = 0;
        var dTongTienCanThu = 0;
        for (var i = 0; i < me.dtKhoanThu.length; i++) {
            txtKhoanThu_SoTien = "txtKhoanThu_SoTien" + me.dtKhoanThu[i].TAICHINH_CACKHOANTHU_ID;
            dKhoanThu_SoTien = edu.util.convertStrToNum(edu.util.getValById(txtKhoanThu_SoTien));
            dTongTienCanThu += parseFloat(dKhoanThu_SoTien);
        }
        edu.util.viewHTMLById("lblTongCanThu_ThuTien", edu.util.formatCurrency(dTongTienCanThu));
    },


    getList_KeHoachNhapHoc: function (obj, callback) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIPKSAxCS4iHgokCS4gIikPKSAxCS4i',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc',
            'iM': edu.system.iM,
            'strDAOTAO_KhoaDaoTao_Id': obj.strKhoaDaoTao_Id,
            'strMoHinhNhapHoc_Id': obj.strMHNhapHoc_Id,
            'strMoHinhApDungPhieuThu_Id': obj.strMHApDungPhieuThu_Id,
            'strTAICHINH_HeThongPhieu_Id': obj.strHeThongThu_Id,
            'strMoHinhApDungPhieuRut_Id': obj.strMHApDungPhieuRut_Id,
            'strTAICHINH_HeThongRut_Id': obj.strHeThongRut_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': obj.strTuKhoa,
            'pageIndex': 1,
            'pageSize': 1000000,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var myResult = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(myResult);
                    if (edu.util.checkValue(dtResult)) {
                        var iPager = data.Pager;
                        callback(dtResult, iPager);
                    }
                    else {
                        callback([], 0);
                    }
                }
                else {
                    edu.system.alert("Error NH_KeHoachNhapHoc.LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Error NH_KeHoachNhapHoc.LayDanhSach(er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KeHoachNhapHoc_NhanSu: function (obj, resolve, reject, callback) {
        var me = this;
        //--lay danh sach ke hoach cho tung NguoiDung_Id duoc phan quyen
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': obj.strNguoiDung_Id,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },
    getList_NguoiHoc_TTTS: function (iTinhTrangNhapHoc, strKeHoach_Id, strTuKhoa, callback) {
        var me = this;
        var iDaNhapHoc = iTinhTrangNhapHoc;
        var strTAICHINH_KeHoach_Id = strKeHoach_Id;
        var strNguoiThucHien_Id = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;

        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS',
            'iM': edu.system.iM,
            'dDaNhapHoc': iDaNhapHoc,
            'strTaiChinh_KeHoach_Id': strTAICHINH_KeHoach_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var myResult = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(myResult);
                    if (edu.util.checkValue(dtResult)) {
                        var iPager = data.Pager;
                        callback(dtResult, iPager);
                    }
                    else {
                        callback([], 0);
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                //edu.system.alert("Lỗi_er (NguoiHoc_TTTS.LayDanhSach_NguoiHoc): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            versionAPI: 'v1.0',
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
}