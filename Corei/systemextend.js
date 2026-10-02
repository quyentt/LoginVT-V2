/*----------------------------------------------
--Author: 
--Phone: 
--Description:
--Date of created: 
--Note: 
----------------------------------------------*/
function systemextend() { }
systemextend.prototype = {
    dtNhanSu: [],
    dtSinhVien: [],
    dtCoCauToChuc: [],
    dtTinhThanh: [],
    dtCCTC_Childs: [],
    dtCCTC_Parents: [],
    strNhanSu_Id: '',

    init: function () {
        var me = this;
        if (edu.system.appCode == "TS" || edu.system.appCode == "SV" || edu.system.appCode == "KTX" || edu.system.appCode == "NS") me.getDataTinhThanh();
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 21/12/2018
    --Discription: CoCauToChuc --> not run
    ----------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.cacheSession_CoCauToChuc);
    },
    cacheSession_CoCauToChuc: function (data) {
        var me = this;
        edu.extend.dtCoCauToChuc = data;
        edu.extend.processData_CoCauToChuc(data);
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 22/05/2018
    --Discription: NhanSu Modal
    ----------------------------------------------*/
    genModal_NhanSu: function (callback) {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm nhân sự</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_NS" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_LoaiCCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn loại cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_CCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_CB_NS" class="select-opt" style="width:100% !important">';
        html += '<option value="0">Cán bộ trong trường</option>';
        html += '<option value="1">Cán bộ ngoài trường</option>';
        html += '<option value="-1">Tất cả nhân sự</option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalNhanSu"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';

        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonNhanSu" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '<div id="zoneprocessProGes"></div>'
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_NhanSu" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-center">Năm sinh</th>';
        html += '<th class="td-center">Giới tính</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_ModalNhanSu"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_nhansu").html("");
        $("#modal_nhansu").append(html);
        $("#modal_nhansu").modal("show");
        //setTimeout(function () {
        //    $("#txtSearchModal_TuKhoa_NS").focus();
        //}, 50);
        //$("#txtSearchModal_TuKhoa_NS").focus();
        $("#txtSearchModal_TuKhoa_NS").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_NhanSu("SEARCH");
            }
        });
        $("#btnSearch_ModalNhanSu").click(function () {
            me.getList_NhanSu("SEARCH");
        });
        me.getList_CoCauToChuc();
        $(".select-opt").select2();
        $("#dropSearchModal_LoaiCCTC_NS").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        $("#modal_nhansu").delegate("#chkSelectAll_ModalNhanSu", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_NhanSu" });
        });

        $("#dropSearchModal_LoaiCCTC_NS,#dropSearchModal_CCTC_NS").select2({//Search on modal
            dropdownParent: $('#modal_nhansu .modal-content')
        });
        $("#btnChonNhanSu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_NhanSu", "checkX");
            if (typeof (callback) == "function") {
                callback(arrChecked_Id);
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_NhanSu #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
        (typeof (callback) == "function") ? me["activecallback"] = true : me["activecallback"] = false;
    },
    getList_NhanSu: function () {
        var me = this;
        //edu.system.pageIndex_default = 1;
        //edu.system.pageSize_default = 10;
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearchModal_TuKhoa_NS"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: edu.util.getValById("dropSearchModal_CCTC_NS") ? edu.util.getValById("dropSearchModal_CCTC_NS") : edu.util.getValById("dropSearchModal_LoaiCCTC_NS"),
            strTinhTrangNhanSu_Id: "",
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: edu.util.getValById("dropSearchModal_CB_NS") ? edu.util.getValById("dropSearchModal_CB_NS") : 1
        };
        edu.system.getList_NhanSu(obj, "", "", me.cbGetListModal_NhanSu);
    },
    getDetail_HS: function (callback) {
        var me = this;
        //view data --Edit
        var obj_save = {
            'action': 'NS_HoSo_V2_MH/DSA4FRUeDykgLxI0HgkuEi4eN3MP',
            'func': 'pkg_nhansu_hoso_v2.LayTT_NhanSu_HoSo_v2',
            'iM': edu.system.iM,
            'strId': edu.system.userId
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = data.Data[0].ID;
                    var strHoTen = data.Data[0].HOTEN;
                    var strMaSo = data.Data[0].MASO;
                    var strSrcAnh = edu.system.getRootPathImg(data.Data[0].ANH);
                    $("#main-content-wrapper").append('<span style="display: none"><span src="' + strSrcAnh + '" id="sl_hinhanh' + strId + '"></span><span id="sl_hoten' + strId + '">' + strHoTen + '</span><span id="sl_ma' + strId + '">' + strMaSo + '</span></span>');
                    if (typeof (callback) == "function") {
                        callback(strId)
                    };
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);

                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    cbGetListModal_NhanSu: function (data, iPager) {
        var me = edu.extend;
        me.dtNhanSu = data;
        var jsonForm = {
            strTable_Id: "tblModal_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_NhanSu('SEARCH')",
                iDataRow: iPager,
            },
            colPos: {
                left: [2],
                fix: [0],
                right: [],
                center: [0, 1, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(aData.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_ChucDanh = "";
                        var strNhanSu_Ma = edu.util.returnEmpty(aData.MASO);
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HOTEN);
                        var strNhanSu_HocHam = edu.util.returnEmpty(aData.LOAICHUCDANH_MA);
                        var strNhanSu_HocVi = edu.util.returnEmpty(aData.LOAIHOCVI_MA);
                        //2. process data
                        if (!edu.util.checkValue(strNhanSu_HocHam)) {
                            strNhanSu_ChucDanh = "";
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_HocHam + ".";
                        }
                        if (!edu.util.checkValue(strNhanSu_HocVi)) {
                            //nothing
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_ChucDanh + strNhanSu_HocVi + ".";
                        }
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_ChucDanh + " " + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNgaySinh = "";
                        if (edu.util.checkValue(aData.NAMSINH)) {
                            strNgaySinh = aData.NAMSINH;
                        }
                        if (edu.util.checkValue(aData.THANGSINH)) {
                            strNgaySinh = aData.THANGSINH + "/" + strNgaySinh;
                        }
                        if (edu.util.checkValue(aData.NGAYSINH)) {
                            strNgaySinh = aData.NGAYSINH + "/" + strNgaySinh;
                        }
                        return '<span id="sl_ngaysinh' + aData.ID + '">' + strNgaySinh + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_gioitinh' + aData.ID + '">' + edu.util.returnEmpty(aData.GIOITINH_TEN) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        if (me["activecallback"]) return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter" style="display:none">Chọn</a>';
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },

    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 22/05/2018
    --Discription: NhanSu Modal
    ----------------------------------------------*/
    genModal_NguoiDung: function (callback) {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm nhân sự</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_NS" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_LoaiCCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn loại cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_CCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalNhanSu"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';

        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonNhanSu" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '<div id="zoneprocessProGes"></div>'
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_NhanSu" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-center">Năm sinh</th>';
        html += '<th class="td-center">Giới tính</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_ModalNhanSu"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_nhansu").html("");
        $("#modal_nhansu").append(html);
        $("#modal_nhansu").modal("show");
        $("#txtSearchModal_TuKhoa_NS").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_NguoiDungP("SEARCH");
            }
        });
        $("#btnSearch_ModalNhanSu").click(function () {
            me.getList_NguoiDungP("SEARCH");
        });
        me.getList_CoCauToChuc();
        $(".select-opt").select2();
        $("#dropSearchModal_LoaiCCTC_NS").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        $("#dropSearchModal_LoaiCCTC_NS,#dropSearchModal_CCTC_NS").select2({//Search on modal
            dropdownParent: $('#modal_nhansu .modal-content')
        });
        $("#modal_nhansu").delegate("#chkSelectAll_ModalNhanSu", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_NhanSu" });
        });
        $("#btnChonNhanSu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_NhanSu", "checkX");
            if (typeof (callback) == "function") {
                callback(arrChecked_Id);
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_NhanSu #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });

        (typeof (callback) == "function") ? me["activecallback"] = true : me["activecallback"] = false;
    },
    getList_NguoiDungP: function () {
        var me = this;
        //edu.system.pageIndex_default = 1;
        //edu.system.pageSize_default = 10;
        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP',
            'func': 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearchModal_TuKhoa_NS'),
            'strPhanLoaiDoiTuong': edu.util.getValById('txtAAAA'),
            'dTrangThai': -1,
            'strChung_DonVi_Id': edu.util.getValById('dropSearchModal_CCTC_NS') ? edu.util.getValById('dropSearchModal_CCTC_NS') : edu.util.getValById('dropSearchModal_LoaiCCTC_NS'),
            'strVaiTro_Id': edu.util.getValById('dropAAAA'),
            'strCapXuLy_Id': edu.util.getValById('dropAAAA'),
            'strTinhThanh_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiDung = data.Data;
                    me.cbGetListModal_NguoiDung(data.Data, data.Pager)
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGetListModal_NguoiDung: function (data, iPager) {
        var me = edu.extend;
        me.dtNhanSu = data;
        var jsonForm = {
            strTable_Id: "tblModal_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_NguoiDungP('SEARCH')",
                iDataRow: iPager,
            },
            colPos: {
                left: [2],
                fix: [0],
                right: [],
                center: [0, 1, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(aData.HINHDAIDIEN);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '<span id="sl_hoten' + aData.ID + '">' + aData.TENDAYDU + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + aData.TAIKHOAN + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNgaySinh = "";
                        return '<span id="sl_ngaysinh' + aData.ID + '">' + strNgaySinh + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_gioitinh' + aData.ID + '">' + edu.util.returnEmpty(aData.GIOITINH_TEN) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        if (me["activecallback"]) return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter" style="display:none">Chọn</a>';
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },

    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 22/05/2018
    --Discription: NhanSu Modal
    ----------------------------------------------*/
    genModal_HocPhan: function (callback) {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm học phần</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_HP" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_LoaiCCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn loại cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_CCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalHocPhan"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';

        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonHocPhan" href="#"><i class="fa fa-plus"></i>Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '<div id="zoneprocessProGes"></div>'
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_HocPhan" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-left">Mã số</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-center">Số tín</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_ModalHocPhan"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_hocphan").html("");
        $("#modal_hocphan").append(html);
        $("#modal_hocphan").modal("show");
        $("#txtSearchModal_TuKhoa_HP").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_HocPhan("SEARCH");
            }
        });
        $("#btnSearch_ModalHocPhan").click(function () {
            me.getList_HocPhan("SEARCH");
        });
        me.getList_CoCauToChuc();
        $(".select-opt").select2();
        $("#dropSearchModal_LoaiCCTC_NS").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        $("#modal_hocphan").delegate("#chkSelectAll_ModalHocPhan", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_HocPhan" });
        });
        $("#modal_hocphan").delegate("#btnChonHocPhan", "click", function (e) {
            e.stopImmediatePropagation();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_HocPhan", "checkX");
            if (typeof (callback) == "function") {
                callback(arrChecked_Id);
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_HocPhan #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
        (typeof (callback) == "function") ? me["activecallback"] = true : me["activecallback"] = false;
    },
    getList_HocPhan: function () {
        var me = this;
        //edu.system.pageIndex_default = 1;
        //edu.system.pageSize_default = 10;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById("txtSearchModal_TuKhoa_HP"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropSearch_MonHocsadas"),
            'strThuocBoMon_Id': edu.util.getValById("dropSearchModal_CCTC_NS") ? edu.util.getValById("dropSearchModal_CCTC_NS") : edu.util.getValById("dropSearchModal_LoaiCCTC_NS"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropSearch_ThuocTinhHocPhanaaaa"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHocPhan = data.Data;
                    me.cbGetListModal_HocPhan(data.Data, data.Pager)
                }
                else {
                    edu.system.alert(": " + data.Message, "w");

                }
            },
            error: function (er) {

                edu.system.alert("CMS_NguoiDung/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGetListModal_HocPhan: function (data, iPager) {
        var me = edu.extend;
        me["dtHocPhan"] = data;
        var jsonForm = {
            strTable_Id: "tblModal_HocPhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_HocPhan('SEARCH')",
                iDataRow: iPager,
            },
            colPos: {
                fix: [0],
                center: [0, 3, 4]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_HP").focus();
        }, 500);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB CoCauToChuc
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = edu.extend;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }
        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchModal_LoaiCCTC_NS"],
            type: "",
            title: "Chọn Khoa/Viện/Phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchModal_CCTC_NS"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 22/05/2018
    --Discription: NhanSu Modal
    ----------------------------------------------*/
    genModal_NhanSu_NgoaiTruong: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm nhân sự ngoài trường</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_NS" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalNhanSu"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><span class="myModalLabel"><i class="fa fa-plus"></i> Thêm mới - </span> Nhân sự ngoài trường</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtModal_HoTen" class="form-control" placeholder="Nhập Họ tên" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropModal_GioiTinh_Id" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn loại cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtModal_Email" class="form-control" placeholder="Nhập Email" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtModal_SoDienThoai" class="form-control" placeholder="Nhập Số điện thoại" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtModal_DiaChi" class="form-control" placeholder="Nhập Địa chỉ" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnAdd_NhanSu"><i class="fa fa-plus"></i> Thêm nhân sự</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_NhanSu" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-center">Giới tính</th>';
        html += '<th class="td-center">Email</th>';
        html += '<th class="td-center">Số điện thoại</th>';
        html += '<th class="td-fixed td-center">Sửa</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_nhansu").html("");
        $("#modal_nhansu").append(html);
        $("#modal_nhansu").modal("show");
        //setTimeout(function () {
        //    $("#txtSearchModal_TuKhoa_NS").focus();
        //}, 50);
        $("#txtSearchModal_TuKhoa_NS").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu_NgoaiTruong("SEARCH");
            }
        });
        $("#btnSearch_ModalNhanSu").click(function () {
            me.getList_NhanSu_NgoaiTruong("SEARCH");
        });
        $("#btnAdd_NhanSu").click(function () {
            me.save_NhanSu_NgoaiTruong("SEARCH");
        });
        edu.system.loadToCombo_DanhMucDuLieu("NS.GITI", "dropModal_GioiTinh_Id");

        $("#tblModal_NhanSu").delegate(".btnEdit", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id;
            edu.util.setOne_BgRow(strId, "tblModal_NhanSu");
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID");
                if (data.length > 0) {
                    data = data[0];
                    $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
                    edu.util.viewValById("txtModal_HoTen", data.TEN);
                    edu.util.viewValById("dropModal_GioiTinh_Id", data.GIOITINH_ID);
                    edu.util.viewValById("txtModal_Email", data.EMAIL);
                    edu.util.viewValById("txtModal_SoDienThoai", data.SDT_CANHAN);
                    edu.util.viewValById("txtModal_DiaChi", data.DIACHI);
                }
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    getList_NhanSu_NgoaiTruong: function (type, palce) {
        var me = this;

        var obj = {
            strTuKhoa: edu.util.getValById("txtSearchModal_TuKhoa_NS"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: "",
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: 1
        };
        edu.system.getList_NhanSu(obj, "", "", me.cbGetListModal_NhanSu_NgoaiTruong);
    },
    cbGetListModal_NhanSu_NgoaiTruong: function (data, iPager) {
        var me = edu.extend;
        me.dtNhanSu = data;
        var jsonForm = {
            strTable_Id: "tblModal_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_NhanSu_NgoaiTruong('SEARCH')",
                iDataRow: iPager,
                bLeft: false,
                bChange: false
            },
            colPos: {
                left: [1],
                fix: [0],
                right: [],
                center: [0, 2, 3, 4]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = edu.util.returnEmpty(aData.MASO);
                        var strNhanSu_HoTen = strNhanSu_Ma + " - " + edu.util.returnEmpty(aData.TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_gioitinh' + aData.ID + '">' + edu.util.returnEmpty(aData.GIOITINH_TEN) + '</span>';
                    }

                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_email' + aData.ID + '">' + edu.util.returnEmpty(aData.EMAIL) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_sdt' + aData.ID + '">' + edu.util.returnEmpty(aData.SDT_CANHAN) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect_NgoaiTruong poiter">Chọn</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);

    },

    save_NhanSu_NgoaiTruong: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSo_V2_MH/FSkkLB4PKSAvEjQeCS4SLh43cwPP',
            'func': 'pkg_nhansu_hoso_v2.Them_NhanSu_HoSo_v2',
            'iM': edu.system.iM,
            'strId': me.strNhanSu_Id,
            'strMaSo': "",
            'strHoDem': "",
            'strTen': edu.util.getValById("txtModal_HoTen"),
            'strTenGoiKhac': "",
            'strNgaySinh': "",
            'strThangSinh': "",
            'strNamSinh': "",
            'strGioiTinh_Id': edu.util.getValById("dropModal_GioiTinh_Id"),
            'strNoiSinh_Xa_Id': "",
            'strNoiSinh_Huyen_Id': "",
            'strNoiSinh_Tinh_Id': "",
            'strQueQuan_Xa_Id': "",
            'strQueQuan_Huyen_Id': "",
            'strQueQuan_Tinh_Id': "",
            'strHKTT_DiaChi': "",
            'strHKTT_Xa_Id': "",
            'strHKTT_Huyen_Id': "",
            'strHKTT_Tinh_Id': "",
            'strNOHN_DiaChi': "",
            'strNOHN_Xa_Id': "",
            'strNOHN_Huyen_Id': "",
            'strNOHN_Tinh_Id': "",
            'strQuocTich_Id': "",
            'strDanToc_Id': "",
            'strTonGiao_Id': "",
            'strTDPT_TotNghiepLop': "",
            'strTDPT_He': "",
            'strSoTruongCongTac': "",
            'strThuongBinhHang_Id': "",
            'strGiaDinhChinhSach_Id': "",
            'strThanhPhanXuatThan_Id': "",
            'strDang_NgayVao': "",
            'strDang_NgayChinhThuc': "",
            'strDang_NoiKetNap': "",
            'strDoan_NgayVao': "",
            'strDoan_NoiKetNap': "",
            'strCongDoan_NgayVao': "",
            'strNgu_NgayNhap': "",
            'strNgu_NgayXuat': "",
            'strNgu_QuanHam_Id': "",
            'strCanCuoc_So': "",
            'strCanCuoc_NgayCap': "",
            'strCanCuoc_NoiCap': "",
            'strNhanXet': "",
            'strEmail': edu.util.getValById("txtModal_Email"),
            'strAnh': "",
            'strSDT_CaNhan': edu.util.getValById("txtModal_SoDienThoai"),
            'strSDT_CoQuan': "",
            'strSDT_GiaDinh': "",
            'strNgayTGCachMang': "",
            'strNgayTGToChucChinhTriXH': "",
            'strDaoTao_CoCauToChuc_Id': "",
            'strSoBaoHiem': "",
            'strLoaiDoiTuong_Id': "",
            'strLoaiGiangVien_Id': "",
            'strTinhTrangNhanSu_Id': "",
            'strTinhTrangHonNhan_Id': "",
            'strTuNhanXetBanThan': "",
            'strTDPT_XepLoaiTotNghiep_Id': "",
            'strQueQuan_DiaChi': "",
            'strNoiSinh_DiaChi': edu.util.getValById("txtModal_DiaChi"),
            'strLaCanBoNgoaiTruong': 1,
        };
        if (me.strNhanSu_Id != "") {
            obj_save.action = 'NS_HoSo_V2_MH/EjQgHg8pIC8SNB4JLhIuHjdz';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strNhanSu_Id == "") {
                        edu.system.alert("Thêm mới thành công");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công");
                        me.strNhanSu_Id = "";
                        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới - ');
                    }
                    me.getList_NhanSu_NgoaiTruong();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_SinhVien: function (callback, hideChonNhieu) {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_KhoaQL_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khoa quản lý -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_He_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả hệ đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Khoa_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khóa đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_ChuongTrinh_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả chương trình đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Lop_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả lớp quản lý -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="box box-solid" id="zoneChonNhieuSV">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tùy chọn thêm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_He"><i class="fa fa-plus fa-customer"></i> Thêm từng hệ</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Khoa"><i class="fa fa-plus fa-customer"></i> Thêm từng khóa</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_ChuongTrinh"><i class="fa fa-plus fa-customer"></i> Thêm từng chương trình</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Lop"><i class="fa fa-plus fa-customer"></i> Thêm từng lớp</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_KhoaKhoa"><i class="fa fa-plus fa-customer"></i> Thêm Khoa quản lý - khóa học</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="area-search">';
        html += '<div id="DSTrangThaiSV_MD" style="padding-left: 25px" class="inputSearch">';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<div class="pull-left">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonSinhVien" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '<div id="zoneprocessProGes"></div>'
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Mã số</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-left">Ngày sinh</th>';
        html += '<th class="td-left">Lớp</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khóa</th>';
        html += '<th class="td-left">Trạng thái</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_SinhVien"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_sinhvien").html("");
        $("#modal_sinhvien").append(html);
        $("#modal_sinhvien").modal("show");
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SinhVien("SEARCH");
            }
        });
        $('#dropSearchModal_He_SV').select2();
        $('#dropSearchModal_Khoa_SV').select2();
        $('#dropSearchModal_ChuongTrinh_SV').select2();
        $('#dropSearchModal_Lop_SV').select2();
        edu.system.getList_KhoaQuanLy({}, "", "", data => {
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropSearchModal_KhoaQL_SV"],
                type: "",
                title: "Tất cả khoa quản lý",
            }
            edu.system.loadToCombo_data(obj);
            $("#dropSearchModal_KhoaQL_SV").select2();
        });
        edu.extend.getList_HeDaoTao();
        //edu.extend.getList_LopQuanLy();
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_SinhVien("SEARCH");
        });
        $('#dropSearchModal_KhoaQL_SV').on('select2:select', function (e) {
            edu.extend.getList_HeDaoTao();
            edu.extend.getList_KhoaDaoTao();
        });
        $('#dropSearchModal_He_SV').on('select2:select', function (e) {
            edu.extend.getList_KhoaDaoTao();
        });
        $('#dropSearchModal_Khoa_SV').on('select2:select', function (e) {
            edu.extend.getList_ChuongTrinhDaoTao();
            edu.extend.getList_LopQuanLy();
        });

        $('#dropSearchModal_KhoaQL_SV').on('select2:select', function (e) {
            edu.extend.getList_ChuongTrinhDaoTao();
            edu.extend.getList_LopQuanLy();
        });
        $('#dropSearchModal_ChuongTrinh_SV').on('select2:select', function (e) {
            edu.extend.getList_LopQuanLy();
        });

        $('#dropSearchModal_Lop_SV').on('select2:select', function (e) {
            me.getList_SinhVien();
        });
        $("#btnChonSinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_SinhVien", "checkX");
            if (typeof (callback) == "function") {
                callback(arrChecked_Id);
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_SinhVien #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
        $("#modal_sinhvien").delegate("#chkSelectAll_SinhVien", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_SinhVien" });
        });
        $("#modal_sinhvien").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {

            var checked_status = this.checked;
            $("#DSTrangThaiSV_MD .ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
            });
        });
        //$("#modal_sinhvien").delegate(".ckbDSTrangThaiSV_ALL", "click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "tblModal_SinhVien" });
        //});
        edu.system.pageIndex_default = 1;
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", (data) => {
            var row = '';
            row += '<div class="col-lg-6 checkbox-inline user-check-print">';
            row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
            row += '<span><b>Tất cả</b></p></span>';
            row += '</div>';
            for (var i = 0; i < data.length; i++) {
                var strcheck = "";
                //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
                row += '<div class="col-lg-6 checkbox-inline user-check-print">';
                row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
                row += '<span><p>' + data[i].TEN + '</p></span>';
                row += '</div>';
            }
            $("#DSTrangThaiSV_MD").html(row);
        });
        (typeof (callback) == "function") ? me["activecallback"] = true : me["activecallback"] = false;
    },
    getList_SinhVien: function (type, palce) {
        //--Edit
        var me = this;

        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
            'func': 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearchModal_TuKhoa_SV'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearchModal_KhoaQL_SV'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearchModal_Lop_SV'),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        var obj_save = {
            'action': 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP',
            'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
            'iM': edu.system.iM,

            'strTuKhoa': edu.util.getValById('txtSearchModal_TuKhoa_SV'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropSearchModal_He_SV'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropSearchModal_Khoa_SV'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strDaoTao_KhoaQuanLy_Id': edu.system.getValById('dropSearchModal_KhoaQL_SV'),
            'strDaoTao_LopQuanLy_Id': edu.system.getValById('dropSearchModal_Lop_SV'),
            'strStudyStatus_Ids': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'dIsPrimary': edu.system.getValById('txtAAAA'),
            'dBoQuaPhamVi': edu.system.getValById('txtAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.cbGetListModal_SinhVien(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
        //
    },
    cbGetListModal_SinhVien: function (data, iPager) {
        var me = edu.extend;
        me.dtSinhVien = data;
        console.log(11111);
        var jsonForm = {
            strTable_Id: "tblModal_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_SinhVien('SEARCH')",
                iDataRow: iPager,
                //bLeft: false,
                //bChange: false
            },
            colPos: {
                center: [0, 1, 7]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO",
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH",
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        if (me["activecallback"]) return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter" style="display:none">Chọn</a>';
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_Lop: function (callback, hideChonNhieu) {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_KhoaQL_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khoa quản lý -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_He_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả hệ đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Khoa_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khóa đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_ChuongTrinh_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả chương trình đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        //html += '<div class="item-modal">';
        //html += '<select id="dropSearchModal_Lop_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        //html += '<option value=""> -- Tất cả lớp quản lý -- </option>';
        //html += '</select>';
        //html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        //html += '<div class="box box-solid">';
        //html += '<div class="box-body">';
        //html += '<div class="search">';
        //html += '<div class="item-modal">';
        //html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tùy chọn thêm</p>';
        //html += '</div>';
        //html += '<div class="item-modal">';
        //html += '<a class="btn btn-default" href="#" id="btnAdd_Khoa"><i class="fa fa-plus fa-customer"></i> Thêm từng khóa</a>';
        //html += '</div>';
        //html += '<div class="item-modal">';
        //html += '<a class="btn btn-default" href="#" id="btnAdd_ChuongTrinh"><i class="fa fa-plus fa-customer"></i> Thêm từng chương trình</a>';
        //html += '</div>';
        //html += '<div class="item-modal">';
        //html += '<a class="btn btn-default" href="#" id="btnAdd_Lop"><i class="fa fa-plus fa-customer"></i> Thêm từng lớp</a>';
        //html += '</div>';
        //html += '</div>';
        //html += '</div>';
        //html += '</div>';

        //html += '<div class="box box-solid">';
        //html += '<div class="box-body">';
        //html += '<div class="area-search">';
        //html += '<div id="DSTrangThaiSV_MD" style="padding-left: 25px" class="inputSearch">';
        //html += '</div>';
        //html += '</div>';
        //html += '</div>';
        //html += '</div>';

        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<div class="pull-left">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonSinhVien" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '<div id="zoneprocessProGes"></div>'
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Mã lớp</th>';
        html += '<th class="td-left">Tên lớp</th>';
        html += '<th class="td-left">Khóa học</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khoa quản lý</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_SinhVien"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_lophoc").html("");
        $("#modal_lophoc").append(html);
        $("#modal_lophoc").modal("show");
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_Lop("SEARCH");
            }
        });
        $('#dropSearchModal_He_SV').select2();
        $('#dropSearchModal_Khoa_SV').select2();
        $('#dropSearchModal_ChuongTrinh_SV').select2();
        $('#dropSearchModal_Lop_SV').select2();
        edu.system.getList_KhoaQuanLy({}, "", "", data => {
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropSearchModal_KhoaQL_SV"],
                type: "",
                title: "Tất cả khoa quản lý",
            }
            edu.system.loadToCombo_data(obj);
            $("#dropSearchModal_KhoaQL_SV").select2();
        });
        edu.extend.getList_HeDaoTao();
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_Lop("SEARCH");
        });
        $('#modal_lophoc #dropSearchModal_KhoaQL_SV').on('select2:select', function (e) {
            edu.extend.getList_HeDaoTao();
            edu.extend.getList_KhoaDaoTao();
        });
        $('#modal_lophoc #dropSearchModal_He_SV').on('select2:select', function (e) {
            edu.extend.getList_KhoaDaoTao();
        });
        $('#modal_lophoc #dropSearchModal_Khoa_SV').on('select2:select', function (e) {
            edu.extend.getList_ChuongTrinhDaoTao();
            edu.extend.getList_LopQuanLy();
        });

        $('#modal_lophoc #dropSearchModal_KhoaQL_SV').on('select2:select', function (e) {
            edu.extend.getList_ChuongTrinhDaoTao();
            edu.extend.getList_LopQuanLy();
        });
        $('#modal_lophoc #dropSearchModal_ChuongTrinh_SV').on('select2:select', function (e) {
            edu.extend.getList_LopQuanLy();
        });

        //$('#dropSearchModal_Lop_SV').on('select2:select', function (e) {
        //    me.getList_SinhVien();
        //});
        $("#modal_lophoc").delegate("#btnChonSinhVien", "click", function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_SinhVien", "checkX");
            if (typeof (callback) == "function") {
                callback(arrChecked_Id);
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_SinhVien #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
        $("#modal_lophoc").delegate("#chkSelectAll_SinhVien", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_SinhVien" });
        });
        $("#modal_lophoc").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {

            var checked_status = this.checked;
            $("#DSTrangThaiSV_MD .ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.pageIndex_default = 1;
        edu.system.pageSize_default = 10;
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", (data) => {
        //    var row = '';
        //    row += '<div class="col-lg-6 checkbox-inline user-check-print">';
        //    row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        //    row += '<span><b>Tất cả</b></p></span>';
        //    row += '</div>';
        //    for (var i = 0; i < data.length; i++) {
        //        var strcheck = "";
        //        //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
        //        row += '<div class="col-lg-6 checkbox-inline user-check-print">';
        //        row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
        //        row += '<span><p>' + data[i].TEN + '</p></span>';
        //        row += '</div>';
        //    }
        //    $("#DSTrangThaiSV_MD").html(row);
        //});
        (typeof (callback) == "function") ? me["activecallback"] = true : me["activecallback"] = false;
    },
    getList_Lop: function (type, palce) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04EDQ4JC8P',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strDaoTao_Nganh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LoaiLop_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ToChucCT_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearchModal_KhoaQL_SV'),
            'strNhomlop_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGetListModal_Lop(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGetListModal_Lop: function (data, iPager) {
        var me = edu.extend;
        me["dtLopQuanLy"] = data;
        console.log(11111);
        var jsonForm = {
            strTable_Id: "tblModal_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_Lop('SEARCH')",
                iDataRow: iPager,
                //bLeft: false,
                //bChange: false
            },
            colPos: {
                center: [0, 1, 6]
            },
            aoColumns: [
                {
                    "mDataProp": "MA",
                }
                , {
                    "mDataProp": "TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearchModal_KhoaQL_SV'),
            'strDaoTao_HinhThucDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_BacDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HeDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLhA0OCQv',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearchModal_KhoaQL_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUQNDgkLwPP',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strDaoTao_N_CN_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearchModal_KhoaQL_SV'),
            'strDaoTao_ToChucCT_Cha_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04EDQ4JC8P',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strDaoTao_Nganh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LoaiLop_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ToChucCT_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropSearchModal_KhoaQL_SV'),
            'strNhomlop_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LopQuanLy(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
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
            renderPlace: ["dropSearchModal_He_SV"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_Khoa_SV"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_ChuongTrinh_SV"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_Lop_SV"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Author: nnthuong
    --Date of created: 22/11/2018
    --Discription: File 
    -------------------------------------------*/
    delete_File: function (strFileName, callback) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NCKH_File/Xoa',


            'strId': strFileName,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //deleteFiles(strFileName)


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    callback(strFileName);
                }
                else {
                    edu.system.alert("NCKH_File/Xoa: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("NCKH_File/Xoa (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getDataTinhThanh: function () {
        var obj_list = {
            'action': 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',

            'strMaBangDanhMuc': "CHUN.DMTT",
            'strTieuChiSapXep': "",
            'dTrangThai': 1,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    dt_TinhThanh = data.Data;
                    var arr = [];
                    for (var i = 0; i < dt_TinhThanh.length; i++) {
                        arr.push({
                            'ID': dt_TinhThanh[i].ID,
                            'TEN': dt_TinhThanh[i].TEN,
                            'QUANHECHA_ID': dt_TinhThanh[i].QUANHECHA_ID,
                        });
                    }
                    localStorage.removeItem("strTinhThanh7");
                    localStorage.setItem("strTinhThanh7", JSON.stringify(arr));
                }

            },
            type: "GET",
            action: obj_list.action,
            async: false,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    setTinhThanh: function (arrInput_Id, strplaceholder) {
        var me = this;
        if (!edu.util.checkValue(strplaceholder)) {
            strFolderExtend = "";
        }
        if (!edu.util.checkValue(arrInput_Id)) {
            console.log("Chưa truyền vào arrInput_Id");
            return false;
        }
        var dt_TinhThanh = '';
        var dt_Tinh = [];
        var objpoint = '';
        TinhThanh();

        function TinhThanh() {
            $(document).delegate(".btnSearch_DiaDiem", "click", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                objpoint = $(this).parent().find("input");
                var x = document.getElementById("zoneDiaDiemS");
                if (x != undefined) {
                    $("#zoneDiaDiemS").replaceWith('');
                }
                else {
                    var strDiaDiem = "";
                    strDiaDiem += '<div id="zoneDiaDiemS" style="padding-top: 40px">';
                    strDiaDiem += '<div class="col-sm-4">';
                    strDiaDiem += '<div class="pro-stu-title">';
                    strDiaDiem += '<span class="lang" key="">Tỉnh/Thành phố</span>:';
                    strDiaDiem += '</div>';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="col-sm-8">';
                    strDiaDiem += '<select id="dropTinhS" class="select-opt" style="width:100% !important">';
                    strDiaDiem += '<option id="" value=""> --Vui lòng chọn tỉnh/thành phố-- </option>';
                    strDiaDiem += '</select>';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="clear"></div>';
                    strDiaDiem += '<div class="col-sm-4">';
                    strDiaDiem += '<div class="pro-stu-title">';
                    strDiaDiem += '<span class="lang" key="">Quận/Huyện/Phường/Xã</span>:';
                    strDiaDiem += '</div>';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="col-sm-8">';
                    strDiaDiem += '<select id="dropHuyenS" class="select-opt" style="width:100% !important">';
                    strDiaDiem += '<option id="" value=""> --Vui lòng chọn quận/huyện-- </option>';
                    strDiaDiem += '</select>';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="clear"></div>';
                    strDiaDiem += '<div class="col-sm-4">';
                    strDiaDiem += '<div class="pro-stu-title">';
                    strDiaDiem += '<span class="lang" key="">Phường/Xã</span>:';
                    strDiaDiem += '</div>';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="col-sm-8">';
                    strDiaDiem += '<select id="dropXaS" class="select-opt" style="width:100% !important">';
                    strDiaDiem += '<option id="" value=""> --Vui lòng chọn phường/xã-- </option>';
                    strDiaDiem += '</select>';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="clear"></div>';
                    strDiaDiem += '<div class="col-sm-4">';
                    strDiaDiem += '<div class="pro-stu-title">';
                    strDiaDiem += '<span class="lang" key="">Thôn/Xóm</span>:';
                    strDiaDiem += '</div>';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="col-sm-8">';
                    strDiaDiem += '<input type="text" id="txtThonXom" placeholder="Nhập dữ liệu" class="form-control"/>';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="clear"></div>';
                    strDiaDiem += '<div class="col-sm-4">';
                    strDiaDiem += '</div>';
                    strDiaDiem += '<div class="col-sm-8">';
                    strDiaDiem += '<a id="btnSelectLocation" class="btn btn-primary"><i class="fa fa-add"></i> OK</a>';
                    strDiaDiem += '</div>';
                    $(this).parent().append(strDiaDiem);
                    $(".select-opt").select2();

                    $('#dropTinhS').on('select2:select', function () {
                        $("#dropHuyenS").empty().trigger("change");
                        $("#dropXaS").empty().trigger("change");
                        getList_QuanHuyen();
                    });
                    $('#dropHuyenS').on('select2:select', function () {
                        $("#dropXaS").empty().trigger("change");
                        getList_PhuongXa();
                    });
                    $("#btnSelectLocation").click(function (e) {
                        genDuLieuDiaDiem();
                    });
                    var obj = {
                        data: dt_Tinh,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "",
                        },
                        renderPlace: ["dropTinhS"],
                        type: "",
                        title: "Chọn tỉnh thành",
                    }
                    edu.system.loadToCombo_data(obj);
                    //$('#dropXaS').on('select2:select', function () {
                    //    genDuLieuDiaDiem();
                    //});
                    loadDataExten();
                }
            });
            getList_TinhThanh();
            for (var i = 0; i < arrInput_Id.length; i++) {
                var x = document.getElementById(arrInput_Id[i]);
                x.classList.add('action-find');
                $(x).attr('placeholder', strplaceholder);
                $(x).parent().append('<a href="#" class="btn-find btnSearch_DiaDiem"><i class="fa fa-search fa-customer"></i></a>');
                x.addEventListener("blur", checkDuLieuDiaDiem);
            }
        }

        function getList_TinhThanh() {
            try {
                var strTinhThanh = localStorage.getItem("strTinhThanh7");
                if (edu.util.checkValue(strTinhThanh)) {
                    dt_TinhThanh = $.parseJSON(strTinhThanh);
                    if (dt_TinhThanh.length > 0) {
                        getData_Tinh(dt_TinhThanh);
                    } else {
                        getData();
                    }
                }
                else {
                    getData();
                }
            }
            catch (Ex) {
                getData();
            }

            function getData() {
                var obj_list = {
                    'action': 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',

                    'strMaBangDanhMuc': "CHUN.DMTT",
                    'strTieuChiSapXep': "",
                    'dTrangThai': 1,
                };


                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            dt_TinhThanh = data.Data;
                            var arr = [];
                            for (var i = 0; i < dt_TinhThanh.length; i++) {
                                arr.push({
                                    'ID': dt_TinhThanh[i].ID,
                                    'TEN': dt_TinhThanh[i].TEN,
                                    'QUANHECHA_ID': dt_TinhThanh[i].QUANHECHA_ID,
                                });
                            }
                            try {

                                localStorage.removeItem("strTinhThanh7");
                                localStorage.setItem("strTinhThanh7", JSON.stringify(arr));
                                getData_Tinh(arr);
                            } catch (ex) {
                                localStorage.clear();
                                localStorage.setItem("strTinhThanh7", JSON.stringify(arr));
                                getData_Tinh(arr);
                            }
                        }

                    },
                    type: "GET",
                    action: obj_list.action,

                    contentType: true,
                    data: obj_list,
                    fakedb: [

                    ]
                }, false, false, false, null);
            }

            function getData_Tinh(json) {
                me.dtTinhThanh = json;
                dt_Tinh = me.dtTinhThanh.filter(e => e.QUANHECHA_ID === null);
            }
        }

        function getList_QuanHuyen() {
            var strTinh_Id = $("#dropTinhS").val();
            if (!edu.util.checkValue(strTinh_Id)) return;
            var jsonQuanHuyen = me.dtTinhThanh.filter(e => e.QUANHECHA_ID === strTinh_Id);
            if (jsonQuanHuyen.length > 0) {
                var obj = {
                    data: jsonQuanHuyen,
                    renderInfor: {
                        id: "ID",
                        parentId: "",
                        name: "TEN",
                        code: "",
                    },
                    renderPlace: ["dropHuyenS"],
                    type: "",
                    title: "Chọn quận/huyện"
                };
                edu.system.loadToCombo_data(obj);
            }
            //else {
            //    genDuLieuDiaDiem();
            //}
        }

        function getList_PhuongXa() {
            var strQuanHuyen_Id = $("#dropHuyenS").val();
            if (!edu.util.checkValue(strQuanHuyen_Id)) return;
            var jsonPhuongXa = me.dtTinhThanh.filter(e => e.QUANHECHA_ID === strQuanHuyen_Id);
            if (jsonPhuongXa.length > 0) {
                var obj = {
                    data: jsonPhuongXa,
                    renderInfor: {
                        id: "ID",
                        parentId: "",
                        name: "TEN",
                        code: "",
                    },
                    renderPlace: ["dropXaS"],
                    type: "",
                    title: "Chọn phường/xã"
                };
                edu.system.loadToCombo_data(obj);
            }
            //else {
            //    genDuLieuDiaDiem();
            //}
        }

        function loadDataExten() {
            var strTinhId = objpoint.attr('tinhId');
            var strHuyen_Id = objpoint.attr('huyenId');
            var strXa_Id = objpoint.attr('xaId');
            var strThonXom = objpoint.attr('name');
            if (edu.util.checkValue(strTinhId)) {
                edu.util.viewValById("dropTinhS", strTinhId);
                getList_QuanHuyen();
            }
            setTimeout(function () {
                if (edu.util.checkValue(strHuyen_Id)) {
                    edu.util.viewValById("dropHuyenS", strHuyen_Id);
                    getList_PhuongXa();
                    setTimeout(function () {
                        edu.util.viewValById("dropXaS", strXa_Id);
                    }, 100)
                }
            }, 100);

            if (edu.util.checkValue(strThonXom)) {
                edu.util.viewValById("txtThonXom", strThonXom);
            }
        }

        function genDuLieuDiaDiem() {
            var id = "";
            var name = "";
            var strTinh_Id = $("#dropTinhS").val();
            var strTinh_Name = $("#dropTinhS option:selected").text();
            var strHuyen_Id = $("#dropHuyenS").val();
            var strHuyen_Name = $("#dropHuyenS option:selected").text();
            var strXa_Id = $("#dropXaS").val();
            var strXa_Name = $("#dropXaS option:selected").text();
            var strThonXom = $("#txtThonXom").val();
            name += strTinh_Name;
            if (edu.util.checkValue(strHuyen_Id)) name += ', ' + strHuyen_Name;
            if (edu.util.checkValue(strXa_Id)) name += ', ' + strXa_Name;
            if (edu.util.checkValue(strThonXom)) name += ', ' + strThonXom;
            objpoint.attr('xaId', strXa_Id);
            objpoint.attr('huyenId', strHuyen_Id);
            objpoint.attr('tinhId', strTinh_Id);
            objpoint.attr('name', strThonXom);
            objpoint.val(name);
            $("#zoneDiaDiemS").replaceWith('');
        }

        function checkDuLieuDiaDiem() {
            var point = this;
            var id = "";
            var name = "";
            var strTinh_Id = "";
            var strTinh_Name = "";
            var strHuyen_Id = "";
            var strHuyen_Name = "";
            var strXa_Id = "";
            var strXa_Name = "";
            var strThonXom = [];
            var strDuLieu = $(point).val();
            //strDuLieu = strDuLieu.toUpperCase();
            strDuLieu = strDuLieu.replace(/XÃ/g, "").replace(/HUYỆN/g, "").replace(/TỈNH/g, "").replace(/PHƯỜNG/g, "").replace(/QUẬN/g, "").replace(/THÀNH PHỐ/g, "");
            strDuLieu = strDuLieu.replace(/  /g, " ");
            var arrDuLieu = [];
            if (strDuLieu.includes(',')) {
                arrDuLieu = strDuLieu.split(',');
                for (var i = 0; i < dt_Tinh.length; i++) {
                    if (dt_Tinh[i].TEN.toUpperCase().includes(arrDuLieu[0].toUpperCase().trim())) {
                        strTinh_Id = dt_Tinh[i].ID;
                        strTinh_Name = dt_Tinh[i].TEN;
                    }
                }
                for (var i = 0; i < dt_TinhThanh.length; i++) {
                    if (dt_TinhThanh[i].QUANHECHA_ID == strTinh_Id && dt_TinhThanh[i].TEN.toUpperCase().includes(arrDuLieu[1].toUpperCase().trim())) {
                        strHuyen_Id = dt_TinhThanh[i].ID;
                        strHuyen_Name = dt_TinhThanh[i].TEN;
                    }
                }
                for (var i = 0; i < dt_TinhThanh.length; i++) {
                    if (dt_TinhThanh[i].QUANHECHA_ID == strHuyen_Id && dt_TinhThanh[i].TEN.toUpperCase().includes(arrDuLieu[2].toUpperCase().trim())) {
                        strXa_Id = dt_TinhThanh[i].ID;
                        strXa_Name = dt_TinhThanh[i].TEN;
                    }
                }

            }
            name += strTinh_Name;
            if (edu.util.checkValue(strHuyen_Id)) {
                name += ', ' + strHuyen_Name;
            }
            if (edu.util.checkValue(strXa_Id)) {
                name += ', ' + strXa_Name;
            }

            if (arrDuLieu.length > 3) {
                for (var i = 3; i < arrDuLieu.length; i++) {
                    name += ',' + arrDuLieu[i];
                    strThonXom.push(arrDuLieu[i]);
                }
            }
            //id += strXa_Id + ',' + strHuyen_Id + ',' + strTinh_Id;
            $(point).attr("tinhid", strTinh_Id);
            $(point).attr("huyenid", strHuyen_Id);
            $(point).attr("xaId", strXa_Id);
            $(point).attr("name", strThonXom.toString());
            $(point).val(name);
        }
    },
    viewTinhThanhById: function (strId, strTinh_Id, strHuyen_Id, strXa_Id, strThongTinBoSung) {
        var me = this;
        var objpoint = $("#" + strId);
        objpoint.attr('tinhId', strTinh_Id);
        objpoint.attr('huyenId', strHuyen_Id);
        objpoint.attr('xaId', strXa_Id);
        objpoint.attr('name', strThongTinBoSung);
        var strTinh_Name = "";
        var strHuyen_Name = "";
        var strXa_Name = "";
        for (var i = 0; i < me.dtTinhThanh.length; i++) {
            var strTinhThanh_Id = me.dtTinhThanh[i].ID;
            if (strTinh_Name == "" && strTinh_Id == strTinhThanh_Id) {
                strTinh_Name = me.dtTinhThanh[i].TEN;
                //if (strHuyen_Name != "" && strHuyen_Name != "") break;
            }
            if (strHuyen_Name == "" && strHuyen_Id == strTinhThanh_Id) {
                strHuyen_Name = me.dtTinhThanh[i].TEN;
                //if (strTinh_Name != "") break;
            }
            if (strXa_Name == "" && strXa_Id == strTinhThanh_Id) {
                strXa_Name = me.dtTinhThanh[i].TEN;
                //if (strTinh_Name != "") break;
            }
        }
        if (strHuyen_Name != "") {
            strTinh_Name += ", " + strHuyen_Name;
        }
        if (edu.util.checkValue(strXa_Name)) {
            strTinh_Name += ", " + strXa_Name;
        }
        if (edu.util.checkValue(strThongTinBoSung)) {
            strTinh_Name += "," + strThongTinBoSung;
        }
        objpoint.val(strTinh_Name);
    },
    genDropTinhThanh: function (strDropTinh_Id, strDropHuyen_Id, strDropXa_Id, strTinh_Id, strHuyen_Id, strXa_Id) {
        var me = this;
        //if (!edu.util.checkValue(strplaceholder)) {
        //    strFolderExtend = "";
        //}
        //if (!edu.util.checkValue(arrInput_Id)) {
        //    console.log("Chưa truyền vào arrInput_Id");
        //    return false;
        //}
        var dt_TinhThanh = '';
        var dt_Tinh = [];
        TinhThanh();

        function TinhThanh() {
            $('#' + strDropTinh_Id).on('select2:select', function () {
                $("#" + strDropHuyen_Id).empty().trigger("change");
                $("#" + strDropXa_Id).empty().trigger("change");
                getList_QuanHuyen();
            });
            $('#' + strDropHuyen_Id).on('select2:select', function () {
                $("#" + strDropXa_Id).empty().trigger("change");
                getList_PhuongXa();
            });
            getList_TinhThanh();
            var obj = {
                data: dt_Tinh,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    default_val: edu.util.returnEmpty(strTinh_Id)
                },
                renderPlace: [strDropTinh_Id],
                type: "",
                title: "Chọn tỉnh thành",
            };
            edu.system.loadToCombo_data(obj);
            if (edu.util.checkValue(strTinh_Id)) getList_QuanHuyen();
            if (edu.util.checkValue(strHuyen_Id)) getList_PhuongXa();
        }

        function getList_TinhThanh() {
            try {
                var strTinhThanh = localStorage.getItem("strTinhThanh7");
                if (edu.util.checkValue(strTinhThanh)) {
                    dt_TinhThanh = $.parseJSON(strTinhThanh);
                    getData_Tinh(dt_TinhThanh);
                }
                else {
                    getData();
                }
            }
            catch (Ex) {
                getData();
            }

            function getData() {

                var obj_list = {
                    'action': 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',

                    'strMaBangDanhMuc': "CHUN.DMTT",
                    'strTieuChiSapXep': "",
                    'dTrangThai': 1,
                };


                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            dt_TinhThanh = data.Data;
                            var arr = [];
                            for (var i = 0; i < dt_TinhThanh.length; i++) {
                                arr.push({
                                    'ID': dt_TinhThanh[i].ID,
                                    'TEN': dt_TinhThanh[i].TEN,
                                    'QUANHECHA_ID': dt_TinhThanh[i].QUANHECHA_ID,
                                });
                            }
                            localStorage.removeItem("strTinhThanh7");
                            localStorage.setItem("strTinhThanh7", JSON.stringify(arr));
                            getData_Tinh(arr);
                        }

                    },
                    type: "GET",
                    action: obj_list.action,
                    async: false,
                    contentType: true,
                    data: obj_list,
                    fakedb: [

                    ]
                }, false, false, false, null);
            }

            function getData_Tinh(json) {
                me.dtTinhThanh = json;
                dt_Tinh = me.dtTinhThanh.filter(e => e.QUANHECHA_ID === null);
            }
        }

        function getList_QuanHuyen() {
            var strTinh_Id = $("#" + strDropTinh_Id).val();
            if (!edu.util.checkValue(strTinh_Id)) return;
            var jsonQuanHuyen = me.dtTinhThanh.filter(e => e.QUANHECHA_ID === strTinh_Id);
            if (jsonQuanHuyen.length > 0) {
                var obj = {
                    data: jsonQuanHuyen,
                    renderInfor: {
                        id: "ID",
                        parentId: "",
                        name: "TEN",
                        code: "",
                        default_val: edu.util.returnEmpty(strHuyen_Id)
                    },
                    renderPlace: [strDropHuyen_Id],
                    type: "",
                    title: "Chọn quận/huyện"
                };
                edu.system.loadToCombo_data(obj);
            }
        }

        function getList_PhuongXa() {
            var strQuanHuyen_Id = $("#" + strDropHuyen_Id).val();
            if (!edu.util.checkValue(strQuanHuyen_Id)) return;
            var jsonPhuongXa = me.dtTinhThanh.filter(e => e.QUANHECHA_ID === strQuanHuyen_Id);
            if (jsonPhuongXa.length > 0) {
                var obj = {
                    data: jsonPhuongXa,
                    renderInfor: {
                        id: "ID",
                        parentId: "",
                        name: "TEN",
                        code: "",
                        default_val: edu.util.returnEmpty(strXa_Id)
                    },
                    renderPlace: [strDropXa_Id],
                    type: "",
                    title: "Chọn phường/xã"
                };
                edu.system.loadToCombo_data(obj);
            }
        }
    },
    /*------------------------------------------
    --Author: nnthuong
    --Date of created: 22/11/2018
    --Discription: File
    -------------------------------------------*/
    ThietLapQuaTrinhCuoiCung: function (strId, strMaBang) {
        var me = this;
        var obj_save = {
            'action': 'NS_QuaTrinh_MH/FSkoJDUNIDEQNCAVMygvKQI0LigCNC8m',
            'func': 'pkg_nhansu_quatrinh.ThietLapQuaTrinhCuoiCung',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strMaQuaTrinhThongTin': strMaBang
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*----------------------------------------------
    --Author        : nnthuong
    --DateOfCreated : 22/05/2018
    --Discription   : getList NguoiDung
    ----------------------------------------------*/
    getList_NguoiDung: function (obj, resolve, reject, callback) {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP',
            'func': 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
            'iM': edu.system.iM,
            'strTuKhoa': obj.strTuKhoa,
            'strPhanLoaiDoiTuong': obj.strPhanLoaiDoiTuong,
            'dTrangThai': obj.iTrangThai,
            'strChung_DonVi_Id': obj.strDonVi_Id,
            'strVaiTro_Id': obj.strVaiTro_Id,
            'strCapXuLy_Id': obj.strCapXuLy_Id,
            'strTinhThanh_Id': obj.strTinhThanh_Id,
            'pageIndex': obj.iPageIndex,
            'pageSize': obj.iPageSize,
        };
        //

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
                        me.dtNguoiDung = data.Data;
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
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    /*----------------------------------------------
    --Author        : nnthuong
    --DateOfCreated : 22/05/2018
    --Discription   : getDetail popover_NguoiDung
    ----------------------------------------------*/
    popover_NguoiDung: function (id, data, obj) {
        //1.get data
        var dtNguoiDung = edu.util.objGetDataInData(id, data, "ID", "");
        //2. load to popover
        var objdata = {
            obj: obj,
            title: "<span class='color-active bold'><i class='fa fa-info-circle'> Thông tin</span>",
            content: function () {
                var html = '';
                html += '<table class="table table-condensed table-hover" style="width:250px">';
                html += '<tbody>';

                html += '<tr>';
                html += '<td class="td-left">Tài khoản</td>';
                html += '<td class="td-left">: ' + dtNguoiDung[0].TAIKHOAN + '</td>';
                html += '</tr>';

                html += '<tr>';
                html += '<td class="td-left">Loại đối tượng</td>';
                html += '<td class="td-left">: </td>';
                html += '</tr>';

                html += '<tr>';
                html += '<td class="td-left">Hạn đổi mật khẩu</td>';
                html += '<td class="td-left">: ' + dtNguoiDung[0].THOIHANPHAIDOIMATKHAU + '</td>';
                html += '</tr>';

                html += '</tbody>';
                html += '</table>';
                return html;
            },
            event: 'hover',
            place: 'right',
        };
        edu.system.loadToPopover_data(objdata);
    },
    /*----------------------------------------------
    --Author        : nnthuong
    --DateOfCreated : 22/05/2018
    --Discription   : getList UngDung
    ----------------------------------------------*/
    getList_UngDung: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    iTrangThai: 1,
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 10,
        //};
        //edu.extend.getList_UngDung(obj, resolve, reject, callback);

        var itrangThai = edu.util.returnEmpty(obj.iTrangThai);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);
        if (!itrangThai) itrangThai = -1;
        if (!pageIndex) pageIndex = 1;
        if (!pageSize) pageIndex = 1000;

        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
            'func': 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
            'iM': edu.system.iM,
            'dTrangThai': itrangThai,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };


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

                    edu.system.alert("CMS_UngDung.LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert("CMS_UngDung.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_NguoiO: function () {
        var me = this;
        var html = "";
        //html += '<div class="modal-dialog" style = "width:80%" >';
        //html += '<div class="modal-content">';
        //html += '<div class="modal-header">';
        //html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        //html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm người ở</h4>';
        //html += '</div>';
        //html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="txtSearchModal_LoaiDoiTuong_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn loại đối tượng -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_GioiTinh_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Tất cả giới tính-- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Nganh_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Tất cả ngành-- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_DienDt_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Tất cả diện đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_TrinhDo_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Tất cả trình độ đào tạo-- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_NguoiO" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-center">Năm sinh</th>';
        html += '<th class="td-center">Giới tính</th>';
        html += '<th class="td-center">Tình trạng</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        $("#zoneHoSoNguoiO").html(html);
        //html += '</div>';
        //html += '<div class="modal-footer">';
        //html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        //html += '</div>';
        //html += '</div>';
        //html += '</div >';
        $("#txtSearchModal_TuKhoa_SV").focus();
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiO("SEARCH");
            }
        });
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_NguoiO("SEARCH");
        });
        edu.system.loadToCombo_DanhMucDuLieu("KTX_PHANLOAIDOITUONG", "txtSearchModal_LoaiDoiTuong_SV");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropSearchModal_GioiTinh_SV");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.TRINHDO", "dropSearchModal_TrinhDo_SV");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.DIDT", "dropSearchModal_DienDt_SV");
        edu.system.loadToCombo_DanhMucDuLieu("CHUN.NGAN", "dropSearchModal_Nganh_SV");
        $(".select-opt").select2();

    },
    getList_NguoiO: function (type, palce) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_NguoiHocOKTX/LayDanhSach',


            'strPhanLoaiDoiTuong_Id': edu.util.getValById("txtSearchModal_LoaiDoiTuong_SV"),
            'strTinhTrangHopDong_Id': "",
            'dBiKyLuat': -1,
            'strNgayVao_TuNgay': "",
            'strNgayVao_DenNgay': "",
            'strNgayRa_TuNgay': "",
            'strNgayRa_DenNgay': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearchHoSo_ToaNha"),
            'strTuKhoa': edu.util.getValById("txtSearchModal_TuKhoa_SV"),
            'strKTX_Phong_Id': '',
            'strLopQuanLy_Id': '',
            'strGioiTinh_Id': edu.util.getValById("dropSearchModal_GioiTinh_SV"),
            'strTrinhDoDaoTao_Id': edu.util.getValById("dropSearchModal_TrinhDo_SV"),
            'strDienDaoTao_Id': edu.util.getValById("dropSearchModal_DienDt_SV"),
            'strNganhDaoTao_Id': edu.util.getValById("dropSearchModal_Nganh_SV"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_KhoaDT"),
            'dDoiTuongConDangOKTX': -1,
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strNgayKiemTra': "",
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data) && data.Data.length > 0) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.cbGetListModal_NguoiO(dtResult, iPager);
                    }
                    else {
                        me.getList_DTDT();
                    }
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
    cbGetListModal_NguoiO: function (data, iPager) {
        var me = edu.extend;
        var jsonForm = {
            strTable_Id: "tblModal_NguoiO",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_NguoiO()",
                iDataRow: iPager,
                bLeft: false,
                bChange: false
            },
            "sort": true,
            "order": [[0, "asc"]],
            colPos: {
                left: [2],
                fix: [0],
                right: [],
                center: [0, 1, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.MASO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_ngaysinh' + aData.ID + '">' + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_gioitinh' + aData.ID + '">' + edu.util.returnEmpty(aData.GIOITINH_TEN) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_tinhtrang' + aData.ID + '">' + edu.util.returnEmpty(aData.TRANGTHAINGUOIHOC_TEN) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" title="' + edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + '" name="' + aData.GIOITINH_MA + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/

    },

    cbGetListModal_NguoiDT: function (data, iPager) {
        var me = edu.extend;
        var jsonForm = {
            strTable_Id: "tblModal_NguoiO",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_DTDT()",
                iDataRow: iPager,
                bLeft: false,
                bChange: false
            },
            "sort": true,
            "order": [[0, "asc"]],
            colPos: {
                left: [2],
                fix: [0],
                right: [],
                center: [0, 1, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.MASV;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_ngaysinh' + aData.ID + '">' + edu.util.returnEmpty(aData.NGAYSINH) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_gioitinh' + aData.ID + '">' + edu.util.returnEmpty(aData.GIOITINH_TEN) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_tinhtrang' + aData.ID + '">' + edu.util.returnEmpty(aData.TRANGTHAINGUOIHOC_TEN) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" title="' + edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + '" name="' + aData.GIOITINH_MA + '" class="btnSelectDT poiter">Chọn</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/

    },

    getList_DTDT: function () {
        var me = edu.extend;

        //--Edit
        var obj_list = {
            'action': 'KTX_DoiTuongDaoTao/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearchModal_TuKhoa_SV"),
            'strGioiTinh': '-1',
            'strNguoiThucHien_Id': '',
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
                    me.cbGetListModal_NguoiDT(dtResult, iPager);
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
    save_DTDT: function (strDoiTuongDaoTao_Id) {
        var me = edu.extend;
        var obj_save = {
            'action': 'KTX_DoiTuongDaoTao/ThemMoi',


            'strNguoiHoc_Id': strDoiTuongDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: '<i class="cl-active">Thêm hồ sơ thành công!</i>',
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_NO();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getCheckedCheckBoxByClassName: function (strClassName) {
        var x = document.getElementsByClassName(strClassName);
        var arrChecked = [];
        for (var i = 0; i < x.length; i++) {
            if ($(x[i]).is(':checked')) {
                arrChecked.push(x[i].id);
            }
        }
        return arrChecked;
    },

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'NCKH_SP_XacNhanKeKhai/ThemMoi',
            'strId': "",
            'strSanPham_Id': strSanPham_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'NCKH_SP_XacNhanKeKhai/LayDanhSach',
            'strTuKhoa': "",
            'strSanPham_Id': strSanPham_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    addNotify: function () {
        if (document.getElementById("link_enable_notifications") != undefined) return;
        var row = "";
        row += '<style>';
        row += '.b8{';
        row += '    height: 0px;';
        row += '}';
        row += '.UC {';
        row += '    text-align: center;';
        row += '}';
        row += '.J-J5-Ji {';
        row += '    display: inline-block;';
        row += '    position: relative;';
        row += '}';
        row += '.vh{';
        row += '    z-index: 900000;';
        row += '    position: relative;';
        row += '    top: 8px;';
        row += '    background-color: #f9edbe;';
        row += '    border-color: #f9edbe;';
        row += '    border-radius: 2px;';
        row += '    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);';
        row += '    color: #222;';
        row += '    font-size: 210%;';
        row += '    font-weight: bold;';
        row += '    text-align: center;';
        row += '    height: 44px; ';
        row += '    width: 120%;';
        row += '    display: none;';
        row += '}';
        row += '</style>';
        row += '<div class="nH" style="">';
        row += '  <div class="b8 UC" aria-live="assertive" aria-atomic="true" style="" role="alert">';
        row += '      <div class="J-J5-Ji">';
        row += '      <div class="UD"></div>';
        row += '      <div class="vh" id="top_notifications">';
        row += '          <span><span id="link_enable_notifications" class="lang" key="">Đang gửi</span> ...</span>';
        row += '      </div>';
        row += '      <div class="UB"></div>';
        row += '       </div>';
        row += '  </div>';
        row += '</div>';
        $(edu.system.ctPlacehoder).prepend(row);
    },
    notifyBeginLoading: function (strHtml, strzoneId, strTime) {
        if (strTime === undefined) strTime = 3000;
        if (strzoneId === "w") strTime = 5000;
        if (strHtml === undefined) strHtml = 'Đang gửi';
        if (strzoneId === undefined || strzoneId == "w") strzoneId = "notifications";
        $("#link_enable_" + strzoneId).html(strHtml);
        $("#top_" + strzoneId).show();
        if ($("#top_" + strzoneId).is(":hidden")) {
            $("#top_" + strzoneId).slideDown('Slow');
        }
        setTimeout(function () {
            if ($("#top_" + strzoneId).is(":visible")) {
                $("#top_" + strzoneId).slideUp();
            }
        }, strTime);
    },
    notifyEndLoading: function () {
        $("#link_enable_notifications").html("Gửi thành công");
        setTimeout(hide_noti, 3008);
        function hide_noti() {
            if ($("#top_notifications").is(":visible")) {
                $("#top_notifications").slideUp();
            }
        }
    },

    getData_Phieu: function (strSoPhieu_Id, strLoaiPhieu, zoneMauIn, callback, bInTheoLo) {
        var me = this;
        switch (strLoaiPhieu) {
            case "PHIEUTHU": me.getData_PhieuThu(strSoPhieu_Id, zoneMauIn, "DHTL_PHIEUTHU_NHAPHOC_2018", callback, bInTheoLo); break;
            case "BIENLAI": me.getData_PhieuThu(strSoPhieu_Id, zoneMauIn, "DHGTVT_PHIEUTHU_2018", callback, bInTheoLo); break;
            case "BIENLAIRUT": me.getData_PhieuThu(strSoPhieu_Id, zoneMauIn, "DHCNTTTN_BIENLAIRUT_2018", callback, bInTheoLo); break;
            case "HOADON": me.getData_HoaDon(strSoPhieu_Id, zoneMauIn, "HOADONDHLUAT", callback, bInTheoLo); break;
        }
    },
    /*------------------------------------------
   --Discription: [4] ACCESS DB ==>Viet Phieu Thu
   --ULR: Modules
   -------------------------------------------*/
    getData_PhieuThu: function (strHoaDon_Id, zoneMauIn, maumacdinh, callback, bInTheoLo) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'TC_PhieuThu/LayTTPhieuThu_Rut',
            'versionAPI': 'v1.0',
            'strPhieuThu_Rut_Id': strHoaDon_Id
        };
        $("#" + zoneMauIn).html("");
        function reportPhieuError(message, error) {
            console.error('[getData_PhieuThu] ' + message, error || '');
            edu.extend.notifyBeginLoading(message, 'w');
        }
        edu.system.makeRequest({
            success: function (data) {
                var detailData = data && data.Data;
                var detailRows = detailData && Array.isArray(detailData.rs) ? detailData.rs : [];
                var subjectRows = detailData && Array.isArray(detailData.rsThongTinDoiTuong) ? detailData.rsThongTinDoiTuong : [];
                if (!data || data.Success !== true) {
                    reportPhieuError('Không thể tải dữ liệu phiếu ' + strHoaDon_Id + ': ' + ((data && data.Message) || 'API không trả về thành công.'));
                    return;
                }
                if (detailRows.length === 0 || subjectRows.length === 0) {
                    reportPhieuError('Phiếu ' + strHoaDon_Id + ' không đủ dữ liệu để hiển thị (khoản thu hoặc thông tin đối tượng rỗng).');
                    return;
                }
                try {
                    me.genData_PhieuThu(detailRows, subjectRows, zoneMauIn, maumacdinh, callback, bInTheoLo);
                } catch (error) {
                    reportPhieuError('Lỗi dựng phiếu ' + strHoaDon_Id + ': ' + (error && error.message ? error.message : 'lỗi JavaScript không xác định.'), error);
                }
            },
            error: function (er) {
                reportPhieuError('Lỗi gọi API tải phiếu ' + strHoaDon_Id + ': ' + ((er && er.statusText) || 'Không kết nối được máy chủ.'), er);
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_detail.action,
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    getData_HoaDon: function (strHoaDon_Id, zoneMauIn, maumacdinh, callback, bInTheoLo) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'TC_HoaDon/LayTTHoaDonThu_Rut',
            'versionAPI': 'v1.0',
            'strHoaDonThu_Rut_Id': strHoaDon_Id
        };
        $("#" + zoneMauIn).html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.rs.length > 0 && data.Data.rsThongTinDoiTuong.length > 0) {
                        me.genData_HoaDon(data.Data.rs, data.Data.rsThongTinDoiTuong, zoneMauIn, maumacdinh, callback, bInTheoLo);
                    } else {
                        edu.extend.notifyBeginLoading('Không thể lấy thông tin đối tượng thu!. Vui lòng liên hệ admin', 'w');
                        if (edu.util.checkValue(callback)) {
                            callback(strHoaDon_Id);
                        }
                    }
                } else {
                    console.log("Thông báo: có lỗi xảy ra!");
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    callback(strHoaDon_Id);
                }
            },
            error: function (er) {
                console.log("Thông báo: có lỗi xảy ra!");
                edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                callback(strHoaDon_Id);
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_detail.action,
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
   --Discription: [4] GEN HTML ==> Viet Phieu Thu
   --ULR: Modules
   -------------------------------------------*/
    genData_PhieuThu: function (dtKhoanThu, dtDoiTuong, zoneMauIn, maumacdinh, callback, bInTheoLo) {
        var me = this;
        if (!edu.util.checkValue(zoneMauIn)) zoneMauIn = "MauInPhieuThu";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        if (!edu.util.checkValue(dtKhoanThu) || dtKhoanThu.length < 1) {
            edu.extend.notifyBeginLoading("Dữ liệu không chính xác. Hãy liên hệ với ADMIN!", "w");
            return;
        }
        var strMauInMain = '';
        var strIDMoRong = dtKhoanThu[0].CHUNGTU_ID;
        if (bInTheoLo === true) {
            $("#" + zoneMauIn).append('<div id="' + zoneMauIn + strIDMoRong + '"></div><p style="page-break-before: always;"></p>');
            zoneMauIn = "" + zoneMauIn + strIDMoRong;
        }
        //if (!dtDoiTuong[0].MAUIN_MASO) {
        //    dtDoiTuong[0].MAUIN_MASO = "CKVINHPHUC_BIENLAITHU";
        //}
        getTemplatePhieu(dtDoiTuong[0].MAUIN_MASO);

        function getTemplatePhieu(strMauInData) {
            var strMauIn = strMauInData;
            ChuyenMauIn();
            if (edu.util.checkValue(strMauIn)) {
                $("#" + zoneMauIn).load(strDuongDan + strMauIn + '.html?v=' + edu.util.uuid(), function () {
                    checkTemplatePhieuMain();
                });
            } else {
                $("#" + zoneMauIn).load(strDuongDan + maumacdinh + '.html?v=' + edu.util.uuid(), function () {
                    checkTemplatePhieuMacDinh();
                });
            }

            function checkTemplatePhieuMain() {
                console.log("Đang load mẫu in: " + strDuongDan);
                if (document.getElementById(zoneMauIn) != undefined && document.getElementById(zoneMauIn).innerHTML !== "" && document.getElementById(zoneMauIn).innerHTML.length > 0) {
                    strMauInMain = strMauIn;
                    console.log("Đã load mẫu in");
                    runGenKhoanThu();
                } else {
                    $("#" + zoneMauIn).load(strDuongDan + maumacdinh + '.html?v=' + edu.util.uuid(), function () {
                        checkTemplatePhieuMacDinh();
                    });
                }
            }

            function checkTemplatePhieuMacDinh() {
                console.log("Đang load mẫu mặc định");
                if (document.getElementById(zoneMauIn).innerHTML !== "") {
                    console.log('Đã load mẫu mặc định');
                    strMauInMain = maumacdinh;
                    runGenKhoanThu();
                } else {
                    reportPhieuError('Không thể load mẫu phiếu ' + strHoaDon_Id + ' (mẫu riêng và mẫu mặc định đều rỗng).');
                }
            }

            function runGenKhoanThu() {
                try {
                    genKhoanThu_MoRong();
                } catch (error) {
                    $("#" + zoneMauIn).html("");
                    reportPhieuError('Không thể dựng nội dung phiếu ' + strHoaDon_Id + ': ' + (error && error.message ? error.message : 'lỗi dữ liệu hoặc mẫu in.'), error);
                }
            }

            function ChuyenMauIn() {
                strMauInData = dtDoiTuong[0].MAUIN_MASO;
                //Nếu mẫu in có ký tự , được hiểu là có nhiều mẫu cần lấy mẫu đầu tiên
                if (edu.util.checkValue(strMauInData) && strMauInData.includes(',')) {
                    console.log(strMauInData);
                    //Bắt đầu chia tách và lấy mẫu đầu tiên
                    var arrMauIn = strMauInData.split(',');
                    //Nhận dạng thay đổi mẫu chứ không phải load mới thoát luôn
                    if (strMauIn != strMauInData && strMauInData.includes(strMauIn)) return;
                    //Gán mẫu in mặc định cho mẫu in đầu tiên
                    strMauIn = arrMauIn[0];
                    document.getElementById("btnIconChuyenMau").name = arrMauIn[1];
                    $("#zoneMauInChungTu").html('');
                    $("#btnChuyenMauIn").show();
                    for (var i = 0; i < arrMauIn.length; i++) {
                        $("#zoneMauInChungTu").append('<li><a id="btnChuyenChungTuIn' + arrMauIn[i] + '" name="' + arrMauIn[i] + '" href="#"> ' + arrMauIn[i] + '</a></li>');
                        $("#btnChuyenChungTuIn" + arrMauIn[i]).click(function (e) {
                            e.stopImmediatePropagation();
                            var ivitri = arrMauIn.indexOf(this.name);
                            var iNext = ivitri + 1;
                            if (iNext >= arrMauIn.length) iNext = 0;
                            document.getElementById("btnIconChuyenMau").name = arrMauIn[iNext]
                            getTemplatePhieu(this.name);
                        });
                    }
                    $("#btnIconChuyenMau").click(function (e) {
                        e.stopImmediatePropagation();
                        $("#btnChuyenChungTuIn" + this.name).trigger("click");
                    });
                } else {
                    $("#btnChuyenMauIn").hide();
                }
            }
        }

        function genKhoanThu_MoRong() {
            //End gen
            //Thay thế id chứng từ
            var strNoiDungMau = $("#" + zoneMauIn).html();
            strNoiDungMau = strNoiDungMau.replace(/SOCHUNGTU_REPLACE/g, strIDMoRong);
            $("#" + zoneMauIn).html(strNoiDungMau);
            //
            //genKhoanThu();
            switch (strMauInMain) {
                case "DHCNTTTN_BIENLAIRUT_2018": genKhoanThu_DHCNTTTN_PHIEURUT_2018(); break;
                case "DHCNTTTN_PHIEUTHU_NHAPHOC_2018": genKhoanThu_DHCNTTTN_PHIEUTHU_NHAPHOC_2018(); break;
                case "DHTL_PHIEUTHU_NHAPHOC_2018": genKhoanThu_DHTL_PHIEUTHU_NHAPHOC_2018(); break;
                case "DHCNTTTN_BIENLAITHU_2018": genKhoanThu_DHCNTTTN_PHIEUTHU_2018(); break;
                case "DHYTN_PHIEUTHU_2018_PHOI": genKhoanThu_DHYTN_PHIEUTHU_2018_PHOI(); break;
                case "DHGTVT_PHIEUTHU_2018": genKhoanThu_DHGTVT_PHIEUTHU_2018(); break;
                case "DHGTVT_PHIEURUT_2018": genKhoanThu_DHGTVT_PHIEURUT_2018(); break;
                case "DHSPTN_BIENLAITHU_2018": genKhoanThu_DHSPTN_BIENLAITHU_2018(); break;
                case "CKVINHPHUC_BIENLAITHU": genKhoanThu_CKVINHPHUC_BIENLAITHU(); break;
                case "LAOCAI_BIENLAITHU": genKhoanThu_LAOCAI_BIENLAITHU(); break;
                case "DHNN_TN": genKhoanThu_DHNN_TN(); break;
                case "VIENY_BIENLAITHU": genKhoanThu_VIENY_BIENLAITHU(); break;
                case "NONGLAM_BIENLAI": genKhoanThu_NONGLAM_BIENLAI(); break;
                case "DHCNGTVT_TRIEUKHUC": genKhoanThu_DHCNGTVT_TRIEUKHUC(); break;
                case "DHNONGLAM_TN_BIENLAI": genKhoanThu_DHNONGLAM_TN_BIENLAI(); break;
                case "DHCNGTVT_TRIEUKHUC_2021": genKhoanThu_DHCNGTVT_TRIEUKHUC_2021(); break;
                case "KTHUE_BIENLAI": genKhoanThu_KTHUE_BIENLAI(); break;
                case "HVCS_BIENLAITHU": genKhoanThu_HVCS_BIENLAITHU(); break;
                case "GIALAI_PHIEUTHU": genKhoanThu_GIALAI_PHIEUTHU(); break;
                case "PHENIKAA": genKhoanThu_PHENIKAA(); break;
                case "LAMNGHIEPXUANMAI_BIENLAITHU": genKhoanThu_LAMNGHIEPXUANMAI_BIENLAITHU(); break;
                case "DHCNGTVT_THAINGUYEN_2022": genKhoanThu_DHCNGTVT_THAINGUYEN_2022(); break;
                case "DHTNMT": genKhoanThu_DHTNMT(); break;
                //default: getTemplatePhieu(maumacdinh);
            }
            //Hiện thị hủy đối với hóa đơn đã hủy $(".xnDaHuyPhieu").html('<p class="lbDaHuyPhieu">Đã Hủy</p>');
            if (dtDoiTuong[0].TINHTRANG == -1) $(".xnDaHuyChungTu_" + strIDMoRong).html('<p class="lbDaHuyPhieu">Đã Hủy</p>');

            if (edu.util.checkValue(callback)) {
                callback(dtKhoanThu[0]);
            }
            //Hiển thị loại 
            $(".lbLoaiChungTu").html('phiếu thu');
        }

        function genKhoanThu_DHCNTTTN_PHIEURUT_2018() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.NOIDUNGNHANTIEN)) $(".lblNoiDungNhanTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NOIDUNGNHANTIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            if (edu.util.checkValue(data.HOVATENNHANTIEN)) $(".lblHoTenNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HOVATENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>';
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>'
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }
        function genKhoanThu_DHCNTTTN_PHIEUTHU_NHAPHOC_2018() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>'
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
            //var data = dtKhoanThu[0];
            //var strNguoiThu = dtKhoanThu[0].NGUOITAO_TAIKHOAN;
            //var strNgayThu = dtKhoanThu[0].NGAYTAO_DD_MM_YYYY;
            //var objNgayThu = edu.util.dateParse(strNgayThu);
            //var strMauIn_MaSo = dtKhoanThu[0].MAUIN_MASO;
            //var dataPhieuIn = dtDoiTuong[0];

            //edu.util.viewHTMLById("lblNgay_BL", objNgayThu.day);
            //edu.util.viewHTMLById("lblThang_BL", objNgayThu.month);
            //edu.util.viewHTMLById("lblNam_BL", objNgayThu.year);
            ////2. sohodon
            //var strSoHoaDon = edu.util.returnEmpty(dtKhoanThu[0].SOCHUNGTU);
            //edu.util.viewHTMLById("lblSo_BL", strSoHoaDon);
            ////3. thong tin nguoi thu
            //var strHoDem = edu.util.returnEmpty(dataPhieuIn.HODEM);
            //var strTen = edu.util.returnEmpty(dataPhieuIn.TEN);
            //var srNgaySinh = edu.util.returnEmpty(dataPhieuIn.NGAYSINH);
            //var strMaSoSinhVien = edu.util.returnEmpty(dataPhieuIn.MASO);
            //var strQueQuan = edu.util.returnEmpty(dataPhieuIn.HOKHAUTHUONGTRU);
            //var strLop = edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN);
            //var strNganhNhapHoc = edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN);
            //var strKhoaHoc = edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN);

            //edu.util.viewHTMLById("lblHoTen_BL", strHoDem + " " + strTen);
            //edu.util.viewHTMLById("lblMaSinhVien_BL", strMaSoSinhVien);
            //edu.util.viewHTMLById("lblNgaySinh_BL", srNgaySinh);
            //edu.util.viewHTMLById("lblQueQuan_BL", strQueQuan);
            //edu.util.viewHTMLById("lblLop_BL", strLop);
            //edu.util.viewHTMLById("lblNganh_BL", strNganhNhapHoc);
            //edu.util.viewHTMLById("lblKhoa_BL", strKhoaHoc);
            ////4. main_content
            //var contentLeft = "";
            //var contentRight = "";
            //var dTongTien = 0;
            //for (var i = 0; i < dtKhoanThu.length; i++) {
            //    if (i < (dtKhoanThu.length / 2)) {
            //        contentLeft += '<p class="no-padding">' + edu.util.returnEmpty(dtKhoanThu[i].NOIDUNG) + ': ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU) + '</p>';
            //    }
            //    else {
            //        contentRight += '<p class="no-padding">' + edu.util.returnEmpty(dtKhoanThu[i].NOIDUNG) + ': ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU) + '</p>';
            //    }
            //    dTongTien += edu.util.returnZero(dtKhoanThu[i].SOTIENDATHU);
            //}
            //$(".pr-content-left").html(contentLeft);
            //$(".pr-content-right").html(contentRight);
            ////5. tongtien 
            //edu.util.viewHTMLById("lblTongTienBangSo_BL", edu.util.formatCurrency(dTongTien));
            //var strTongTien = to_vietnamese(dTongTien) + ".";
            //strTongTien = strTongTien[1].toUpperCase() + strTongTien.substring(2);
            //edu.util.viewHTMLById("lblTongTienBangChu_BL", strTongTien);
            ////NguoiThu
            //edu.util.viewHTMLById("lblNguoiThu", strNguoiThu);

        }
        function genKhoanThu_DHTL_PHIEUTHU_NHAPHOC_2018() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.MAUSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);
            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>';
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>'
                return row;

            }
        }
        function genKhoanThu_DHCNTTTN_PHIEUTHU_2018() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>'
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }
        function genKhoanThu_DHYTN_PHIEUTHU_2018_PHOI() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 1],
                    right: [2],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }
        function genKhoanThu_KTHUE_BIENLAI() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>';
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>'
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }
        function genKhoanThu_DHGTVT_PHIEUTHU_2018() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>';
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>'
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }
        function genKhoanThu_DHGTVT_PHIEURUT_2018() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>';
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>'
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }

        function genKhoanThu_DHSPTN_BIENLAITHU_2018() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>'
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i + irowlength]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i + irowlength]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i + irowlength * 2]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i + irowlength]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i + irowlength * 2]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + getNameKhoanThu(dtKhoanThu[i + irowlength * 3]) + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }

            function getNameKhoanThu(data) {
                var strKhoanThu = data.TAICHINH_CACKHOANTHU_TEN;
                if (edu.util.checkValue(data.HOCKY)) {
                    strKhoanThu += " " + data.HOCKY;
                }
                if (edu.util.checkValue(data.DOTHOC)) {
                    strKhoanThu += ", " + data.DOTHOC;
                }
                return strKhoanThu;
            }
        }
        function genKhoanThu_HVCS_BIENLAITHU() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mData": "SoLuong",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }
        function genKhoanThu_CKVINHPHUC_BIENLAITHU() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DIACHINGUOIMUA));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mData": "SoLuong",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }
        function genKhoanThu_LAOCAI_BIENLAITHU() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mData": "SoLuong",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }
        function genKhoanThu_DHNN_TN() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mData": "SoLuong",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }

        function genKhoanThu_VIENY_BIENLAITHU() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 1],
                    right: [2],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }

        function genKhoanThu_NONGLAM_BIENLAI() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.QUYENSO);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.NOIDUNGNHANTIEN)) $(".lblNoiDungNhanTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NOIDUNGNHANTIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            if (edu.util.checkValue(data.HOVATENNHANTIEN)) $(".lblHoTenNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HOVATENNHANTIEN));
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));
            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "DONVITINH_TEN"
                    }
                    , {
                        "mDataProp": "SOLUONG"
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
            var rowhtml = "";
            for (var i = dtKhoanThu.length; i <= 10; i++) {
                rowhtml += '<tr style="height: 30px"><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
            }
            $("#" + jsonForm.strTable_Id + " tbody").append(rowhtml);
            jsonForm.strTable_Id = "dataNoiDungThu_B_" + strIDMoRong;
            edu.system.loadToTable_data(jsonForm);
            $("#" + jsonForm.strTable_Id + " tbody").append(rowhtml);
            jsonForm.strTable_Id = "dataNoiDungThu_C_" + strIDMoRong;
            edu.system.loadToTable_data(jsonForm);
            $("#" + jsonForm.strTable_Id + " tbody").append(rowhtml);
        }
        function genKhoanThu_DHCNGTVT_THAINGUYEN_2022() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.THONGTINCOSODAOTAO)) $(".txtCoSoDaoTao_BenA_" + strIDMoRong).html(data.THONGTINCOSODAOTAO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));

            //

            $(".iQuyenSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));
            var htmlNoiDung = "";
            for (var i = 0; i < dtKhoanThu.length; i++) {
                htmlNoiDung += edu.util.returnEmpty(dtKhoanThu[i].NOIDUNG) + ": " + edu.util.formatCurrencyVN(dtKhoanThu[i].SOTIENDATHU) + ";<br/>";
            }
            $(".dataNoiDungThu_" + strIDMoRong).html(htmlNoiDung);
            var qrcode = dtKhoanThu[0].QRCODE;
            var arrPointQR = $(".QRCode_" + strIDMoRong);
            if (edu.util.checkValue(qrcode)) qrcode = edu.util.uuid();
            if (qrcode.length > 480) qrcode = qrcode.substring(0, 470);
            if (edu.util.checkValue(qrcode)) {
                for (var i = 0; i < arrPointQR.length; i++) {
                    var qrcodeA = new QRCode(arrPointQR[i], {
                        width: 80,
                        height: 80
                    });
                    qrcodeA.makeCode(qrcode);
                }
            }
        }

        function genKhoanThu_DHCNGTVT_TRIEUKHUC_2021() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.THONGTINCOSODAOTAO)) $(".txtCoSoDaoTao_BenA_" + strIDMoRong).html(data.THONGTINCOSODAOTAO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));
            var htmlNoiDung = "";
            for (var i = 0; i < dtKhoanThu.length; i++) {
                htmlNoiDung += edu.util.returnEmpty(dtKhoanThu[i].NOIDUNG) + ": " + edu.util.formatCurrencyVN(dtKhoanThu[i].SOTIENDATHU) + ";<br/>";
            }
            $(".dataNoiDungThu_" + strIDMoRong).html(htmlNoiDung);
            var qrcode = dtKhoanThu[0].QRCODE;
            var arrPointQR = $(".QRCode_" + strIDMoRong);
            if (edu.util.checkValue(qrcode)) qrcode = edu.util.uuid();
            if (qrcode.length > 480) qrcode = qrcode.substring(0, 470);
            if (edu.util.checkValue(qrcode)) {
                for (var i = 0; i < arrPointQR.length; i++) {
                    var qrcodeA = new QRCode(arrPointQR[i], {
                        width: 80,
                        height: 80
                    });
                    qrcodeA.makeCode(qrcode);
                }
            }
        }
        function genKhoanThu_DHCNGTVT_TRIEUKHUC() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.THONGTINCOSODAOTAO)) $(".txtCoSoDaoTao_BenA_" + strIDMoRong).html(data.THONGTINCOSODAOTAO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));
            var htmlNoiDung = "";
            for (var i = 0; i < dtKhoanThu.length; i++) {
                htmlNoiDung += edu.util.returnEmpty(dtKhoanThu[i].NOIDUNG) + ": " + edu.util.formatCurrencyVN(dtKhoanThu[i].SOTIENDATHU) + ";<br/>";
            }
            $(".dataNoiDungThu_" + strIDMoRong).html(htmlNoiDung);
            var qrcode = dtKhoanThu[0].QRCODE;
            var arrPointQR = $(".QRCode_" + strIDMoRong);
            if (edu.util.checkValue(qrcode)) qrcode = edu.util.uuid();
            if (qrcode.length > 480) qrcode = qrcode.substring(0, 470);
            if (edu.util.checkValue(qrcode)) {
                for (var i = 0; i < arrPointQR.length; i++) {
                    var qrcodeA = new QRCode(arrPointQR[i], {
                        width: 80,
                        height: 80
                    });
                    qrcodeA.makeCode(qrcode);
                }
            }
        }
        function genKhoanThu_DHNONGLAM_TN_BIENLAI() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.NOIDUNGNHANTIEN)) $(".lblNoiDungNhanTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NOIDUNGNHANTIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            if (edu.util.checkValue(data.HOVATENNHANTIEN)) $(".lblHoTenNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HOVATENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>'
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }

        function genKhoanThu_GIALAI_PHIEUTHU() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>';
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>'
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }

        function genKhoanThu_PHENIKAA() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);
            var strNoiDung2 = "";
            dtKhoanThu.forEach(e => {
                if (e.NOIDUNG) strNoiDung2 += ", " + e.NOIDUNG;
            });
            if (strNoiDung2) strNoiDung2 = strNoiDung2.substring(2);
            $(".dataNoiDungThu2_" + strIDMoRong).html(strNoiDung2);

            function loaddata(dtKhoanThu) {
                console.log('[HOCPHAN_V2]', dtKhoanThu[0] && dtKhoanThu[0].HOCPHANTEXT, '| checkValue =', dtKhoanThu[0] && edu.util.checkValue(dtKhoanThu[0].HOCPHANTEXT));
                function cell(item) {
                    if (!item) return '';
                    var s = '<td class="no-padding" style="margin-top: 2px"><span>- ' + item.TAICHINH_CACKHOANTHU_TEN + ' (' + edu.util.formatCurrency(item.SOTIENDATHU) + ')</span>';
                    if (edu.util.checkValue(item.HOCPHANTEXT)) {
                        s += '<br><span style="font-style:italic;color:#555;padding-left:10px;">' + item.HOCPHANTEXT + '</span>';
                    }
                    s += '</td>';
                    return s;
                }
                var row = '<table class="pr-table pr-table-unbordered"><tbody>';
                var cols = dtKhoanThu.length <= 4 ? 2 : (dtKhoanThu.length <= 9 ? 3 : 4);
                var irowlength = Math.ceil(dtKhoanThu.length / cols);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    for (var c = 0; c < cols; c++) {
                        var idx = i + irowlength * c;
                        if (idx < dtKhoanThu.length) row += cell(dtKhoanThu[idx]);
                    }
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;
            }
        }


        function genKhoanThu_LAMNGHIEPXUANMAI_BIENLAITHU() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>'
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }

        function genKhoanThu_DHTNMT() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            $(".iNamThuChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.NAMTHU));
            $(".txtNoiDungThu_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NOIDUNGTHU));
            $(".txtMaNhapHoc_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.MANHAPHOC));

            //Gen các khoản thu
            var strNoiDung2 = '';//loaddata(dtKhoanThu);
            dtKhoanThu.forEach(e => {
                if (e.NOIDUNG) strNoiDung2 += ", " + e.NOIDUNG + "(" + edu.util.formatCurrency(e.SOTIENDATHU).replace(/,/g, '.') + 'đ)';
            });
            if (strNoiDung2) strNoiDung2 = strNoiDung2.substring(2);
            $(".dataNoiDungThu_" + strIDMoRong).html(strNoiDung2);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>'
                //
                if (dtKhoanThu.length <= 4) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    var irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (var i = 0; i < irowlength; i++) {
                        row += '<tr>'
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>'
                    return row;
                }
                //
                var irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (var i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;

            }
        }
        function genKhoanThu() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);

            if (edu.util.checkValue(data.NGUOINHANTIEN)) $(".txtNguoiNhanTien_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOINHANTIEN));
            if (edu.util.checkValue(data.NGUOITRATIEN)) $(".txtNguoiTraTien_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITRATIEN));
            if (edu.util.checkValue(data.SOTIENNHANTIEN)) $(".lblSoTienThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.SOTIENNHANTIEN));
            //
            $(".iQuyenChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.QUYENSO));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));
            //Gen các khoản thu
            var row = loaddata(dtKhoanThu);
            $(".dataNoiDungThu_" + strIDMoRong).html(row);

            function loaddata(dtKhoanThu) {
                var row = '';
                row += '<table class="pr-table pr-table-unbordered">';
                row += '<tbody>';
                //
                var irowlength = 0;
                if (dtKhoanThu.length <= 4) {
                    irowlength = Math.ceil(dtKhoanThu.length / 2);
                    for (i = 0; i < irowlength; i++) {
                        row += '<tr>';
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                if (dtKhoanThu.length <= 9) {
                    irowlength = Math.ceil(dtKhoanThu.length / 3);
                    for (i = 0; i < irowlength; i++) {
                        row += '<tr>';
                        row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                        row += '</tr>';
                    }
                    row += '</tbody>';
                    return row;
                }
                //
                irowlength = Math.ceil(dtKhoanThu.length / 4);
                for (i = 0; i < irowlength; i++) {
                    row += '<tr>';
                    row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 2) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 2].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 2].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    if ((i + irowlength * 3) < dtKhoanThu.length) row += '<td class="no-padding" style="margin-top: 2px"><span>- ' + dtKhoanThu[i + irowlength * 3].NOIDUNG + ' : ' + edu.util.formatCurrency(dtKhoanThu[i + irowlength * 3].SOTIENDATHU).replace(/,/g, '.') + 'đ</span></td>';
                    row += '</tr>';
                }
                row += '</tbody>';
                return row;
            }
        }
    },
    genData_HoaDon: function (dtKhoanThu, dtDoiTuong, zoneMauIn, maumacdinh, callback, bInTheoLo) {
        var me = this;
        try {

            me["aDataKhoanThu"] = dtKhoanThu[0];
            console.log(111111);
            if (dtKhoanThu[0].DUONGDANFILEHOADON) {
                var strLink = edu.system.objApi["HDDT"];
                strLink = strLink.substring(0, strLink.length - 3);
                if (strLink.indexOf('http') === -1) {
                    strLink = edu.system.strhost + strLink;
                }

                $("#" + zoneMauIn).html('<iframe src="' + strLink + dtKhoanThu[0].DUONGDANFILEHOADON + '" width="800px" height="600px"></iframe><div class="clear"></div><a id="btnXuatLai" name="' + zoneMauIn + '" style="cursor: pointer"> Lấy lại file hóa đơn</a>');

                $("#btnXuatLai").click(function (e) {
                    var strMauIn = $(this).attr("name");
                    getFilesPath(me.aDataKhoanThu, undefined, strMauIn);
                });
                var win = window.open(strLink + dtKhoanThu[0].DUONGDANFILEHOADON, '_blank');
                if (win == undefined) {
                    edu.system.alert("Hãy cho phép mở tab mới trên trình duyệt của bạn!", "w");
                } else {
                    win.focus();
                }
                if (dtKhoanThu[0].LAHOADONDIENTU == 1) {
                    getFilesPath(dtKhoanThu[0], undefined, zoneMauIn);
                }
                return;
            } else {
                if (dtKhoanThu[0].LAHOADONDIENTU == 1) {
                    getFilesPath(dtKhoanThu[0], undefined, zoneMauIn);
                }
            }

        } catch (Ex) {

        }
        if (dtKhoanThu[0].LAHOADONDIENTU == 1) return;
        if (!edu.util.checkValue(zoneMauIn)) zoneMauIn = "MauInHoaDon";
        var strDuongDan = edu.system.rootPath + '/Upload/Files/PrintTemplate/';
        if (!edu.util.checkValue(dtKhoanThu) || dtKhoanThu.length < 1) {
            edu.extend.notifyBeginLoading("Dữ liệu không chính xác. Hãy liên hệ với ADMIN!", "w");
            return;
        }
        var strMauInMain = '';
        var strIDMoRong = dtKhoanThu[0].CHUNGTU_ID;
        if (bInTheoLo === true) {
            $("#" + zoneMauIn).append('<div id="' + zoneMauIn + strIDMoRong + '"></div><p style ="page-break-before: always;"></p>');
            zoneMauIn = "" + zoneMauIn + strIDMoRong;
        } //dtDoiTuong[0].MAUIN_MASO = "DHGTVT_HOADON_2018_GTGT,DHGTVT_HOADON_2018";
        getTemplatePhieu(dtDoiTuong[0].MAUIN_MASO);

        function getTemplatePhieu(strMauInData) {
            $("#lbSoTienDaChon").html('');
            var strMauIn = strMauInData;
            ChuyenMauIn();
            if (edu.util.checkValue(strMauIn)) {
                $("#" + zoneMauIn).load(strDuongDan + strMauIn + '.html?v=' + edu.util.uuid(), function () {
                    checkTemplatePhieuMain();
                });
            }

            function checkTemplatePhieuMain() {
                console.log("Đang load mẫu hóa đơn");
                if (document.getElementById(zoneMauIn) != undefined && document.getElementById(zoneMauIn).innerHTML !== "" && document.getElementById(zoneMauIn).innerHTML.length > 0) {
                    strMauInMain = strMauIn;
                    console.log("Đã load mẫu in");
                    genKhoanThu_MoRong();
                }
            }

            function checkTemplatePhieuMacDinh() {
                console.log("Đang load mẫu hóa đơn mặc định");
                if (document.getElementById(zoneMauIn).innerHTML !== "") {
                    console.log("Đã load hóa đơn in mặc định");
                    strMauInMain = maumacdinh;
                    genKhoanThu_MoRong();
                } else {
                    edu.extend.notifyBeginLoading("Không thể load phiếu", "w");
                }
            }

            function ChuyenMauIn() {
                strMauInData = dtDoiTuong[0].MAUIN_MASO;
                //Nếu mẫu in có ký tự , được hiểu là có nhiều mẫu cần lấy mẫu đầu tiên
                if (edu.util.checkValue(strMauInData) && strMauInData.includes(',')) {
                    console.log(strMauInData);
                    //Bắt đầu chia tách và lấy mẫu đầu tiên
                    var arrMauIn = strMauInData.split(',');
                    //Nhận dạng thay đổi mẫu chứ không phải load mới thoát luôn
                    if (strMauIn != strMauInData && strMauInData.includes(strMauIn)) return;
                    //Gán mẫu in mặc định cho mẫu in đầu tiên
                    strMauIn = arrMauIn[0];
                    document.getElementById("btnIconChuyenMau").name = arrMauIn[1];
                    $("#zoneMauInChungTu").html('');
                    $("#btnChuyenMauIn").show();
                    for (var i = 0; i < arrMauIn.length; i++) {
                        $("#zoneMauInChungTu").append('<li><a id="btnChuyenChungTuIn' + arrMauIn[i] + '" name="' + arrMauIn[i] + '" href="#"> ' + arrMauIn[i] + '</a></li>');
                        $("#btnChuyenChungTuIn" + arrMauIn[i]).click(function (e) {
                            e.stopImmediatePropagation();
                            var ivitri = arrMauIn.indexOf(this.name);
                            var iNext = ivitri + 1;
                            if (iNext >= arrMauIn.length) iNext = 0;
                            document.getElementById("btnIconChuyenMau").name = arrMauIn[iNext]
                            getTemplatePhieu(this.name);
                        });
                    }
                    $("#btnIconChuyenMau").click(function (e) {
                        e.stopImmediatePropagation();
                        $("#btnChuyenChungTuIn" + this.name).trigger("click");
                    });
                } else {
                    $("#btnChuyenMauIn").hide();
                }
            }
        }

        function genKhoanThu_MoRong() {
            //Thay thế id chứng từ
            var strNoiDungMau = $("#" + zoneMauIn).html();
            strNoiDungMau = strNoiDungMau.replace(/SOCHUNGTU_REPLACE/g, strIDMoRong);
            $("#" + zoneMauIn).html(strNoiDungMau);
            //
            switch (strMauInMain) {
                case "DHGTVT_HOADON_2018": genKhoanThu_DHGTVT_HOADON_2018(); break;
                case "DHGTVT_HOADON_2018_GTGT": genKhoanThu_DHGTVT_HOADON_2018_GTGT(); break;
                case "DHCNTTTN_HOADON_2018": genKhoanThu_DHCNTTTN_HOADON_2018(); break;
                case "DHGTVT_HOADON_2018_PHOI": genKhoanThu_DHGTVT_HOADON_2018_PHOI(); break;
                case "DHYTN_HOADON_2018_PHOI": genKhoanThu_DHYTN_HOADON_2018_PHOI(); break;
                case "HOADONDHLUAT": genKhoanThu_HOADONDHLUAT(); break;
                case "CKVINHPHUC_HOADON": genKhoanThu_CKVINHPHUC_HOADON(); break;
                case "LAOCAI_BIENLAITHU": genKhoanThu_LAOCAI_HOADON(); break;
                case "DHNN_TN": genKhoanThu_DHNN_TN(); break;
                //default: getTemplatePhieu(maumacdinh);
            }
            //Hiện thị hủy đối với hóa đơn đã hủy $(".xnDaHuyPhieu").html('<p class="lbDaHuyPhieu">Đã Hủy</p>');
            if (dtDoiTuong[0].TINHTRANG == -1) $(".xnDaHuyChungTu_" + strIDMoRong).html('<p class="lbDaHuyPhieu">Đã Hủy</p>');
            //
            if (edu.util.checkValue(callback)) {
                callback(dtKhoanThu[0]);
            }
            //Hiển thị số liên cho phép chỉ hiển thị số liên mong muốn

            //Hiển thị loại 
            $(".lbLoaiChungTu").html('hóa đơn');
        }

        function genKhoanThu_DHCNTTTN_HOADON_2018() {
            var data = dtKhoanThu[0];
            var dataPhieuIn = me.dt_DoiTuongThu;
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);

            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrencyVN(dTong) + " đ");
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //if (edu.util.checkValue(data.QUYENSO)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.QUYENSO);
            //Gen thông tin in phiếu
            if (edu.util.checkValue(data.MAUSO)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].HODEM) + " " + edu.util.returnEmpty(dtDoiTuong[0].TEN));
            $(".txtTenDonVi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtSoTaiKhoan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASOTHUECANHAN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NHOTHEM));
            //
            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mData": "SoLuong",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU) + " đ";
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
            jsonForm = {
                strTable_Id: "dataNoiDungThu_B_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "AAAA"
                    }
                    , {
                        "mData": "SoLuong",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU) + " đ";
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }

        function genKhoanThu_DHGTVT_HOADON_2018() {
            var data = dtKhoanThu[0];
            var dataPhieuIn = me.dt_DoiTuongThu;
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);

            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong));
            //Gen thông tin in phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));//Nhớ xóa
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].HODEM) + " " + edu.util.returnEmpty(dtDoiTuong[0].TEN));
            $(".txtTenDonVi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASO));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].NGANHHOC_N1_TEN));
            $(".txtBac_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].BACDAOTAO_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].KHOAHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].NOIOHIENNAY));
            $(".txtSoTaiKhoan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASOTHUECANHAN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NHOTHEM));
            //
            var qrcode = dtDoiTuong[0].QRCODE;
            if (edu.util.checkValue(qrcode)) {
                var qrcodeA = new QRCode(document.getElementById("qrCode_A_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeA.makeCode(qrcode);
                var qrcodeB = new QRCode(document.getElementById("qrCode_B_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeB.makeCode(qrcode);
                var qrcodeC = new QRCode(document.getElementById("qrCode_C_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeC.makeCode(qrcode);
            }
            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mData": "KhoanThu-HocKy",
                        "mRender": function (nRow, aData) {
                            var strDot = "";
                            if (edu.util.checkValue(aData.DOTHOC)) {
                                strDot = " đợt " + aData.DOTHOC;
                            }
                            return aData.TAICHINH_CACKHOANTHU_TEN + " học kỳ " + aData.HOCKY_DAYDU + strDot;
                        }
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
            jsonForm = {
                strTable_Id: "dataNoiDungThu_B_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mData": "KhoanThu-HocKy",
                        "mRender": function (nRow, aData) {
                            var strDot = "";
                            if (edu.util.checkValue(aData.DOTHOC)) {
                                strDot = " đợt " + aData.DOTHOC;
                            }
                            return aData.TAICHINH_CACKHOANTHU_TEN + " học kỳ " + aData.HOCKY_DAYDU + strDot;
                        }
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
            jsonForm = {
                strTable_Id: "dataNoiDungThu_C_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mData": "KhoanThu-HocKy",
                        "mRender": function (nRow, aData) {
                            var strDot = "";
                            if (edu.util.checkValue(aData.DOTHOC)) {
                                strDot = " đợt " + aData.DOTHOC;
                            }
                            return aData.TAICHINH_CACKHOANTHU_TEN + " học kỳ " + aData.HOCKY_DAYDU + strDot;
                        }
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }

        function genKhoanThu_HOADONDHLUAT() {
            var data = dtKhoanThu[0];
            var dataPhieuIn = me.dt_DoiTuongThu;
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);

            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong));
            //Gen thông tin in phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));//Nhớ xóa
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].HODEM) + " " + edu.util.returnEmpty(dtDoiTuong[0].TEN));
            $(".txtTenDonVi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASO));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].NGANHHOC_N1_TEN));
            $(".txtBac_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].BACDAOTAO_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].KHOAHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].NOIOHIENNAY));
            $(".txtSoTaiKhoan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASOTHUECANHAN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NHOTHEM));
            //
            var qrcode = dtDoiTuong[0].QRCODE;
            if (edu.util.checkValue(qrcode)) {
                var qrcodeA = new QRCode(document.getElementById("qrCode_A_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeA.makeCode(qrcode);
                var qrcodeB = new QRCode(document.getElementById("qrCode_B_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeB.makeCode(qrcode);
                var qrcodeC = new QRCode(document.getElementById("qrCode_C_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeC.makeCode(qrcode);
            }
            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mData": "KhoanThu-HocKy",
                        "mRender": function (nRow, aData) {
                            var strHienThi = aData.NOIDUNG_INHOADON;
                            if (!edu.util.checkValue(strHienThi)) {
                                var strDot = "";
                                if (edu.util.checkValue(aData.DOTHOC)) {
                                    strDot = " đợt " + aData.DOTHOC;
                                }
                                strHienThi = aData.TAICHINH_CACKHOANTHU_TEN + " Học kỳ " + aData.HOCKY + " Năm kỳ " + aData.NAMHOC + strDot
                            }

                            return strHienThi;
                        }
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
            jsonForm = {
                strTable_Id: "dataNoiDungThu_B_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mData": "KhoanThu-HocKy",
                        "mRender": function (nRow, aData) {
                            var strHienThi = aData.NOIDUNG_INHOADON;
                            if (!edu.util.checkValue(strHienThi)) {
                                var strDot = "";
                                if (edu.util.checkValue(aData.DOTHOC)) {
                                    strDot = " đợt " + aData.DOTHOC;
                                }
                                strHienThi = aData.TAICHINH_CACKHOANTHU_TEN + " Học kỳ " + aData.HOCKY + " Năm kỳ " + aData.NAMHOC + strDot
                            }

                            return strHienThi;
                        }
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }

        function genKhoanThu_DHGTVT_HOADON_2018_GTGT() {
            var data = dtKhoanThu[0];
            var dataPhieuIn = me.dt_DoiTuongThu;
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);

            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong));
            //Gen thông tin in phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));//Nhớ xóa
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].HODEM) + " " + edu.util.returnEmpty(dtDoiTuong[0].TEN));
            $(".txtTenDonVi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASO));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].NGANHHOC_N1_TEN));
            $(".txtBac_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].BACDAOTAO_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].KHOAHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].NOIOHIENNAY));
            $(".txtSoTaiKhoan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASOTHUECANHAN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NHOTHEM));
            //
            var qrcode = dtDoiTuong[0].QRCODE;
            if (edu.util.checkValue(qrcode)) {
                var qrcodeA = new QRCode(document.getElementById("qrCode_A_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeA.makeCode(qrcode);
                var qrcodeB = new QRCode(document.getElementById("qrCode_B_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeB.makeCode(qrcode);
                var qrcodeC = new QRCode(document.getElementById("qrCode_C_" + strIDMoRong), {
                    width: 80,
                    height: 80
                });
                qrcodeC.makeCode(qrcode);
            }
            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mData": "KhoanThu-HocKy",
                        "mRender": function (nRow, aData) {
                            var strDot = "";
                            if (edu.util.checkValue(aData.DOTHOC)) {
                                strDot = " đợt " + aData.DOTHOC;
                            }
                            return aData.TAICHINH_CACKHOANTHU_TEN + " học kỳ " + aData.HOCKY_DAYDU + strDot;
                        }
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
            jsonForm = {
                strTable_Id: "dataNoiDungThu_B_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mData": "KhoanThu-HocKy",
                        "mRender": function (nRow, aData) {
                            var strDot = "";
                            if (edu.util.checkValue(aData.DOTHOC)) {
                                strDot = " đợt " + aData.DOTHOC;
                            }
                            return aData.TAICHINH_CACKHOANTHU_TEN + " học kỳ " + aData.HOCKY_DAYDU + strDot;
                        }
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
            jsonForm = {
                strTable_Id: "dataNoiDungThu_C_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mData": "KhoanThu-HocKy",
                        "mRender": function (nRow, aData) {
                            var strDot = "";
                            if (edu.util.checkValue(aData.DOTHOC)) {
                                strDot = " đợt " + aData.DOTHOC;
                            }
                            return aData.TAICHINH_CACKHOANTHU_TEN + " học kỳ " + aData.HOCKY_DAYDU + strDot;
                        }
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }

        function genKhoanThu_DHYTN_HOADON_2018_PHOI() {
            var data = dtKhoanThu[0];
            var dataPhieuIn = me.dt_DoiTuongThu;
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);

            if (edu.util.checkValue(data.MAUSO)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            $(".txtTongTienChungTu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienBangChu_" + strIDMoRong).html(edu.util.formatCurrency(dTong));
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].HODEM) + " " + edu.util.returnEmpty(dtDoiTuong[0].TEN));
            $(".txtTenDonVi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASO));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].NGANHHOC_N1_TEN));
            $(".txtBac_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].BACDAOTAO_N1_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].KHOAHOC_N1_TEN));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].NOIOHIENNAY));
            $(".txtSoTaiKhoan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));

            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASOTHUECANHAN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NHOTHEM));

            var row = "";
            var itop = 263;
            var ileft = 67;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                row += '<span class="phoi text-center" style="width: 40px; padding: ' + itop + 'px 0px 0px ' + (ileft) + 'px">' + (i + 1) + '</span>';
                row += '<span class="phoi text-left" style="width: 315px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40) + 'px">' + edu.util.returnEmpty(dtKhoanThu[i].TAICHINH_CACKHOANTHU_TEN) + '</span>';
                row += '<span class="phoi text-center" style="width: 100px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323) + 'px"></span>';
                row += '<span class="phoi text-center" style="width: 80px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108) + 'px">1</span>';
                row += '<span class="phoi text-right" style="width: 150px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108 + 88) + 'px">' + edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) + '</span>';
                row += '<span class="phoi text-right" style="width: 150px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108 + 88 + 158) + 'px">' + edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) + '</span>';
                // row += '<tr>';
                // row += '<td class="td-fixed text-center" style="width: 40px">'+ (i+1) +'</td>';
                // row += '<td class="text-center" style="width: 315px">'+ edu.util.returnEmpty(dtKhoanThu[i].TAICHINH_CACKHOANTHU_TEN) +'</td>';
                // row += '<td class="text-center" style="width: 100px" ></td>';
                // row += '<td class="text-center" style="width: 80px">1</td>';
                // row += '<td class="text-center" style="width: 150px">'+ edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) +'</td>';
                // row += '<td class="text-center" style="width: 150px">'+ edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) +'</td>';
                // row += '</tr>';
                itop += 20;
            }
            $(".dataNoiDungThu_A_" + strIDMoRong).html(row);

            var row = "";
            var itop = 668;
            var ileft = 67;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                row += '<span class="phoi text-center" style="width: 40px; padding: ' + itop + 'px 0px 0px ' + (ileft) + 'px">' + (i + 1) + '</span>';
                row += '<span class="phoi text-left" style="width: 315px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40) + 'px">' + edu.util.returnEmpty(dtKhoanThu[i].TAICHINH_CACKHOANTHU_TEN) + '</span>';
                row += '<span class="phoi text-center" style="width: 100px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323) + 'px"></span>';
                row += '<span class="phoi text-center" style="width: 80px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108) + 'px">1</span>';
                row += '<span class="phoi text-right" style="width: 150px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108 + 88) + 'px">' + edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) + '</span>';
                row += '<span class="phoi text-right" style="width: 150px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108 + 88 + 158) + 'px">' + edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) + '</span>';
                // row += '<tr>';
                // row += '<td class="td-fixed text-center" style="width: 40px">'+ (i+1) +'</td>';
                // row += '<td class="text-center" style="width: 315px">'+ edu.util.returnEmpty(dtKhoanThu[i].TAICHINH_CACKHOANTHU_TEN) +'</td>';
                // row += '<td class="text-center" style="width: 100px" ></td>';
                // row += '<td class="text-center" style="width: 80px">1</td>';
                // row += '<td class="text-center" style="width: 150px">'+ edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) +'</td>';
                // row += '<td class="text-center" style="width: 150px">'+ edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) +'</td>';
                // row += '</tr>';
                itop += 20;
            }
            $(".dataNoiDungThu_B_" + strIDMoRong).html(row);


            var row = "";
            var itop = 1173;
            var ileft = 67;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                row += '<span class="phoi text-center" style="width: 40px; padding: ' + itop + 'px 0px 0px ' + (ileft) + 'px">' + (i + 1) + '</span>';
                row += '<span class="phoi text-left" style="width: 315px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40) + 'px">' + edu.util.returnEmpty(dtKhoanThu[i].TAICHINH_CACKHOANTHU_TEN) + '</span>';
                row += '<span class="phoi text-center" style="width: 100px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323) + 'px"></span>';
                row += '<span class="phoi text-center" style="width: 80px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108) + 'px">1</span>';
                row += '<span class="phoi text-right" style="width: 150px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108 + 88) + 'px">' + edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) + '</span>';
                row += '<span class="phoi text-right" style="width: 150px; padding: ' + itop + 'px 0px 0px ' + (ileft + 40 + 323 + 108 + 88 + 158) + 'px">' + edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) + '</span>';
                // row += '<tr>';
                // row += '<td class="td-fixed text-center" style="width: 40px">'+ (i+1) +'</td>';
                // row += '<td class="text-center" style="width: 315px">'+ edu.util.returnEmpty(dtKhoanThu[i].TAICHINH_CACKHOANTHU_TEN) +'</td>';
                // row += '<td class="text-center" style="width: 100px" ></td>';
                // row += '<td class="text-center" style="width: 80px">1</td>';
                // row += '<td class="text-center" style="width: 150px">'+ edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) +'</td>';
                // row += '<td class="text-center" style="width: 150px">'+ edu.util.returnEmpty(edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU)) +'</td>';
                // row += '</tr>';
                itop += 20;
            }
            $(".dataNoiDungThu_C_" + strIDMoRong).html(row);
        }

        function genKhoanThu_CKVINHPHUC_HOADON() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DIACHINGUOIMUA));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }
        function genKhoanThu_LAOCAI_HOADON() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }
        function genKhoanThu_DHNN_TN() {
            var data = dtKhoanThu[0];
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
            //Hiện thị tổng tiền
            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong).replace(/,/g, '.'));
            var dataPhieuIn = dtDoiTuong[0];
            //Gen thông tin in phiếu thu
            //Thông tin nếu không có sẽ lấy mặc định phiếu
            if (edu.util.checkValue(data.DAOTAO_COCAUTOCHUC_TEN)) $(".txtCoCauToChuc_BenA_" + strIDMoRong).html(data.DAOTAO_COCAUTOCHUC_TEN);
            if (edu.util.checkValue(data.MA_QHNS)) $(".txtQHNS_BenA_" + strIDMoRong).html(data.MA_QHNS);
            if (edu.util.checkValue(data.TENPHIEU)) $(".txtLoaiChungTu_" + strIDMoRong).html(data.TENPHIEU);
            if (edu.util.checkValue(data.MAUSO)) $(".txtMauSo_BenA_" + strIDMoRong).html(data.MAUSO);
            if (edu.util.checkValue(data.KYHIEU)) $(".txtKyHieuChungTu_" + strIDMoRong).html(data.KYHIEU);
            if (edu.util.checkValue(data.MASOTHUE)) $(".txtMaSoThue_BenA_" + strIDMoRong).html(data.MASOTHUE);
            if (edu.util.checkValue(data.SODIENTHOAI)) $(".txtSoDienThoai_BenA_" + strIDMoRong).html(data.SODIENTHOAI);
            if (edu.util.checkValue(data.DIACHI)) $(".txtDiaChi_BenA_" + strIDMoRong).html(data.DIACHI);
            //
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.HODEM) + " " + edu.util.returnEmpty(dataPhieuIn.TEN));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNgaySinh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGAYSINH));
            $(".txtLop_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtNganh_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.NGANHHOC_N1_TEN));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtKhoa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dataPhieuIn.KHOAHOC_N1_TEN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NGUOITAO_TENDAYDU));

            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "NOIDUNG"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mDataProp": "SOLUONG",
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.DONGIA);
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrencyVN(aData.SOTIENDATHU);
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }

        function genKhoanThu() {
            var data = dtKhoanThu[0];
            var dataPhieuIn = me.dt_DoiTuongThu;
            //Hien thi
            var dTong = 0.0;
            for (var i = 0; i < dtKhoanThu.length; i++) {
                if (edu.util.floatValid(dtKhoanThu[i].SOTIENDATHU))
                    dTong += dtKhoanThu[i].SOTIENDATHU;
            }
            var strSoTien = to_vietnamese(dTong) + ".";
            strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);

            $(".txtTongTienBangChu_" + strIDMoRong).html(strSoTien);
            $(".txtTongTienChungTu_" + strIDMoRong).html(edu.util.formatCurrency(dTong) + " đ");
            //Gen thông tin in phiếu
            $(".iChungTuSo_" + strIDMoRong).html(edu.util.returnEmpty(data.SOPHIEUTHU));
            $(".iNgayXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NGAY));
            $(".iThangXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_THANG));
            $(".iNamXuatChungTu_" + strIDMoRong).html(edu.util.returnEmpty(data.NGAYIN_NAM));
            //Người mua hàng
            $(".txtHoTen_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].HODEM) + " " + edu.util.returnEmpty(dtDoiTuong[0].TEN));
            $(".txtTenDonVi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtMa_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASO));
            $(".txtDiaChi_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].DAOTAO_LOPQUANLY_N1_TEN));
            $(".txtSoTaiKhoan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].AAAAA));
            $(".txtHinhThucThanhToan_BenB_" + strIDMoRong).html(edu.util.returnEmpty(data.HINHTHUCTHU_TEN));
            $(".txtMaSoThue_BenB_" + strIDMoRong).html(edu.util.returnEmpty(dtDoiTuong[0].MASOTHUECANHAN));
            $(".txtNguoiThu_BenA_" + strIDMoRong).html(edu.util.returnEmpty(data.NHOTHEM));
            //
            //Gen các khoản thu
            //var row = "";
            //for (var i = 0; i < dtKhoanThu.length; i++) {
            //    row += '<p class="no-padding" style="width: 50%; float: left; margin-top: 4px">- ' + dtKhoanThu[i].TAICHINH_CACKHOANTHU_TEN + ' : ' + edu.util.formatCurrency(dtKhoanThu[i].SOTIENDATHU) + '</p>';
            //}
            //$("#dataNoiDungThu_B").html(row);
            var jsonForm = {
                strTable_Id: "dataNoiDungThu_A_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                    }
                    , {
                        "mDataProp": "aaaa"
                    }
                    , {
                        "mData": "SoLuong",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU) + " đ";
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
            jsonForm = {
                strTable_Id: "dataNoiDungThu_B_" + strIDMoRong,
                "aaData": dtKhoanThu,
                colPos: {
                    left: [1],
                    center: [0, 2, 3],
                    right: [4, 5],
                },
                "aoColumns": [
                    {
                        "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                    }
                    , {
                        "mDataProp": "AAAA"
                    }
                    , {
                        "mData": "SoLuong",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return "";
                        }
                    }
                    , {
                        "mData": "SOTIENDATHU",
                        "mRender": function (nRow, aData) {
                            return edu.util.formatCurrency(aData.SOTIENDATHU) + " đ";
                        }
                    }
                ]
            };
            edu.system.loadToTable_data(jsonForm);
        }

        function getFilesPath(aData, callback, zoneMauIn) {
            var me = this;
            //if (aData.DUONGDANFILEHOADON) {
            //    if (typeof (callback) == "function") callback(aData.DUONGDANFILEHOADON, aData.DUONGDANFILETONGHOP);
            //    return;
            //}
            //--Edit
            var obj_list = {
                'action': 'HDDT_HoaDon/GetFiles',
                'transectionId': aData.TRACSECTION_ID,
                'strDuongDanFile': aData.DUONGDANFILEHOADON,
                'strDuongDanFileTongHop': aData.DUONGDANFILETONGHOP,
                'strPhuongThuc_MA': aData.PHATHANH_RESERVATIONCODE,
                'strSoHoaDon': aData.SOHOADON
            };

            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        console.log(aData.EMAIL);
                        save_DuongDanFiles(aData.CHUNGTU_ID, data.Data[0], data.Data[1], callback);
                        var strLink = "";
                        if (zoneMauIn == undefined) zoneMauIn = "MauInPhieuThu";
                        if (data.Data[0]) {
                            strLink = edu.system.objApi["HDDT"];
                            strLink = strLink.substring(0, strLink.length - 3);
                            if (strLink.indexOf('http') === -1) {
                                strLink = edu.system.strhost + strLink;
                            }
                            strLink += data.Data[0];
                            $("#" + zoneMauIn).html('<iframe src="' + strLink + '" width="800px" height="600px"></iframe><div class="clear"></div><a id="btnXuatLai" name="' + zoneMauIn + '" style="cursor: pointer"> Lấy lại file hóa đơn</a>');
                        }


                        $("#btnXuatLai").click(function (e) {
                            var strMauIn = $(this).attr("name");
                            getFilesPath(edu.extend.aDataKhoanThu, undefined, strMauIn);
                        });
                    }
                    else {
                        edu.system.alert("Lỗi: " + data.Message, "w");
                    }
                    //edu.system.endLoading();
                },
                error: function (er) {
                    //edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
                },
                type: "GET",
                action: obj_list.action,
                versionAPI: obj_list.versionAPI,
                contentType: true,
                data: obj_list,
                fakedb: [

                ]
            }, false, false, false, null);
        }

        function save_DuongDanFiles(strId, strDuongDanFileHoaDon, strDuongDanFileTongHop) {
            var me = this;
            var obj_notify = {};
            //--Edit
            var obj_save = {
                'action': 'TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT',

                'strId': strId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strDuongDanFileHoaDon': strDuongDanFileHoaDon,
                'strDuongDanFileTongHop': strDuongDanFileTongHop,
                'strNguoiThucHien_Id': edu.system.userId,
            };
            //if (edu.util.checkValue(obj_save.strId)) {
            //    obj_save.action = 'NS_HeSo_QuyDoiGioChuan/CapNhat';
            //}
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
                        //me.getList_QuyDoiGio();
                    }
                    else {
                        //obj_notify = {
                        //    type: "w",
                        //    content: obj_save.action + " (er): " + data.Message,
                        //}
                        //edu.system.alertOnModal(obj_notify);
                    }
                },
                error: function (er) {
                    //edu.system.alertOnModal(obj_notify);
                },
                type: "POST",
                action: obj_save.action,

                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },

    /*------------------------------------------
	--Discription: [2] ACESSS DB ==> SoHoaDon
	--Author:  
	-------------------------------------------*/
    //Tạo ra giao diện tùy chọn các liên của mẫu in
    genChonLien: function (zoneMauIn, zoneTool) {
        $("#" + zoneTool).parent().show();
        var Lien = $("#" + zoneMauIn + " .pr-containt");
        if (Lien.length > 1) {
            var row = '<div id="zoneSelectedLien" class="compact-theme simple-pagination" style="float:left; width: 100%">';
            row += '<ul>';
            for (var i = 0; i < Lien.length; i++) {
                row += '<li>';
                row += '<a class="activeLien" name="' + i + '" style="cursor: pointer">' + (i + 1) + '</a>';
                row += '</li>';
            }
            row += '<li>';
            row += '<a class="activeLien" name="selectall" style="cursor: pointer">Tất cả</a>';
            row += '</li>';
            row += '</ul>';
            row += '</div>';
            $("#" + zoneTool).html(row);
            $("#zoneSelectedLien").delegate("li a", "click", function (e) {
                var point = this;
                var iVitri = $(point).attr("name");
                if (iVitri != "selectall") {
                    for (var i = 0; i < Lien.length; i++) {
                        if (i == iVitri) {
                            Lien[i].style.display = ""
                            continue;
                        }
                        Lien[i].style.display = "none";
                    }
                    $("#" + zoneMauIn + " p[style='page-break-before: always;']").hide();
                }
                else {
                    for (var i = 0; i < Lien.length; i++) {
                        Lien[i].style.display = "";
                    }
                    $("#" + zoneMauIn + " p[style='page-break-before: always;']").show();
                }
                //if ($(point).hasClass("activeLien")) {
                //    Lien[iVitri].style.display = "none";
                //    $(point).removeClass("activeLien");
                //}
                //else {
                //    Lien[iVitri].style.display = "";
                //    $(point).addClass("activeLien");
                //}
            });
        }
        else {
            //Cẩn thận nhé
            $("#" + zoneTool).parent().hide();
        }
    },


    remove_PhoiIn: function (strZoneIn) {
        var text = $("#" + strZoneIn).html();
        if (text.includes("_PHOI.jpg")) text = text.replace(/_PHOI.jpg/g, '');
        $("#" + strZoneIn).html(text);
    },

    removeNoiDungDai: function (strNoiDung, dSoTien) {
        if (!edu.util.checkValue(strNoiDung)) return '';
        //Danh cho CNTT Thai Nguyen
        if (strNoiDung.includes("VIETINBANK") && strNoiDung.includes("DTC")) {
            strNoiDung = strNoiDung.replace("VIETIN", '');
            strNoiDung = strNoiDung.substring(0, strNoiDung.indexOf("$"));
            if (strNoiDung.includes(dSoTien)) strNoiDung = strNoiDung.replace(dSoTien, "");
            return strNoiDung + "...";
        }
        return strNoiDung;
    },

    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 07/03/2018
    --Discription: [2] NH_KeHoachNhapHoc.LayDanhSach_NguoiHoc
    ----------------------------------------------*/
    getList_KeHoachNhapHoc: function (obj, callback) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIPKSAxCS4iHgokCS4gIikPKSAxCS4i',
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
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 07/03/2018
    --Discription: [3] NH_NguoiHoc_TTTS.LayDanhSach_NguoiHoc
    ----------------------------------------------*/
    getList_KeHoachNhapHoc_NhanSu: function (obj, resolve, reject, callback) {
        var me = this;
        //--lay danh sach ke hoach cho tung NguoiDung_Id duoc phan quyen
        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
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
                    edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.LayDanhSach_KeHoachNhapHoc: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("NH_NguoiHoc_ThongTinTuyenSinh.LayDanhSach_KeHoachNhapHoc (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },

    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 07/03/2018
    --Discription: [2] NH_NguoiHoc_TTTS.LayDanhSach_NguoiHoc
    ----------------------------------------------*/
    getList_NguoiHoc_TTTS: function (iTinhTrangNhapHoc, strKeHoach_Id, strTuKhoa, callback) {
        var me = this;
        var iDaNhapHoc = iTinhTrangNhapHoc;
        var strTAICHINH_KeHoach_Id = strKeHoach_Id;
        var strNguoiThucHien_Id = "";
        var pageIndex = edu.system.pageIndex_default;
        var pageSize = edu.system.pageSize_default;

        var obj_save = {
            'action': 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP',
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
    /*----------------------------------------------
    --Discription: [2] NH_NguoiHoc_TTTS gen html
    ----------------------------------------------*/
    popover_NguoiHoc_TTTS: function (id, data, obj) {
        //1.processing
        var strSoBaoDanh = "";
        var strMaSoSV = "";
        var strMaSo_Tille = "";
        var strNgaySinh = "";
        var strNganhTuyenSinh = "";
        var strLopHoc = "";
        var strLopHoc_Tille = "";
        var strDiaChi = '';


        for (var i = 0; i < data.length; i++) {
            if (id == data[i].ID) {
                strSoBaoDanh = edu.util.returnEmpty(data[i].SOBAODANH);
                strMaSoSV = edu.util.returnEmpty(data[i].MASO);
                strHoTen = edu.util.returnEmpty(data[i].HODEM) + " " + edu.util.returnEmpty(data[i].TEN);
                strNgaySinh = edu.util.returnEmpty(data[i].NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(data[i].NGAYSINH_THANG) + "/" + edu.util.returnEmpty(data[i].NGAYSINH_NAM);
                strDiaChi = edu.util.returnEmpty(data[i].HOKHAU_PHUONGXAKHOIXOM) + " - " + edu.util.returnEmpty(data[i].HOKHAU_QUANHUYEN_TEN) + " - " + edu.util.returnEmpty(data[i].HOKHAU_TINHTHANH_TEN);
                strNganhTuyenSinh = edu.util.returnEmpty(data[i].NGANHHOC_TEN);
                strLopHoc = edu.util.returnEmpty(data[i].DAOTAO_LOPQUANLY_TEN);
                //get title LopHoc
                if (edu.util.checkValue(strLopHoc)) {
                    strLopHoc_Tille = "Lớp học";
                }
                else {
                    strLopHoc_Tille = "Lớp dự kiến";
                    strLopHoc = edu.util.returnEmpty(data[i].MALOPDUKIEN);
                }
                //get title MaSo
                if (edu.util.checkValue(strMaSoSV)) {
                    strMaSo_Tille = "MSSV ";
                    strSoBaoDanh = strMaSoSV;
                }
                else {
                    strMaSo_Tille = "SBD ";
                }
            }
        }
        //2. load to popover
        var objdata = {
            obj: obj,
            title: "<span class='color-active bold'>" + strMaSo_Tille + strSoBaoDanh + "</span>",
            content: function () {
                var html_popover = '';
                html_popover += '<table class="table table-condensed table-hover" style="width:250px">';
                html_popover += '<tbody>';
                html_popover += '<tr>';
                html_popover += '<td class="td-left opacity-7">Họ tên</td>';
                html_popover += '<td class="td-left">: ' + strHoTen + '</td>';
                html_popover += '</tr>';
                html_popover += '<tr>';
                html_popover += '<td class="td-left opacity-7">Ngày sinh</td>';
                html_popover += '<td class="td-left">: ' + strNgaySinh + '</td>';
                html_popover += '</tr>';
                html_popover += '<tr>';
                html_popover += '<td class="td-left opacity-7">Ngành học</td>';
                html_popover += '<td class="td-left">: ' + strNganhTuyenSinh + '</td>';
                html_popover += '</tr>';
                html_popover += '<tr>';
                html_popover += '<td class="td-left opacity-7">' + strLopHoc_Tille + '</td>';
                html_popover += '<td class="td-left">: ' + strLopHoc + '</td>';
                html_popover += '</tr>';
                html_popover += '</tbody>';
                html_popover += '</table>';
                return html_popover;
            },
            event: 'hover',
            place: 'right',
        };
        edu.system.loadToPopover_data(objdata);
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 22/05/2018
    --Discription: NhanSu Modal
    ----------------------------------------------*/
    genModal_LLKH: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm nhân sự</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal" style>';
        html += '<input id="txtSearchModal_TuKhoa_NS" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        //html += '<div class="item-modal">';
        //html += '<select id="dropSearchModal_LoaiCCTC_NS" class="select-opt" style="width:100% !important">';
        //html += '<option value=""> -- Chọn loại cơ cấu tổ chức -- </option>';
        //html += '</select>';
        //html += '</div>';
        //html += '<div class="item-modal">';
        //html += '<select id="dropSearchModal_CCTC_NS" class="select-opt" style="width:100% !important">';
        //html += '<option value=""> -- Chọn cơ cấu tổ chức -- </option>';
        //html += '</select>';
        //html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalNhanSu"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_NhanSu" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-center">Năm sinh</th>';
        html += '<th class="td-center">Giới tính</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_nhansu").html("");
        $("#modal_nhansu").append(html);
        $("#modal_nhansu").modal("show");
        //setTimeout(function () {
        //    $("#txtSearchModal_TuKhoa_NS").focus();
        //}, 50);
        //$("#txtSearchModal_TuKhoa_NS").focus();
        $("#txtSearchModal_TuKhoa_NS").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_LLKH("SEARCH");
            }
        });
        $("#btnSearch_ModalNhanSu").click(function () {
            me.getList_LLKH("SEARCH");
        });
        //me.getList_CoCauToChuc();
        //$(".select-opt").select2();
        //$("#dropSearchModal_LoaiCCTC_NS").on("select2:select", function () {
        //    var strCha_Id = $(this).find('option:selected').val();
        //    if (edu.util.checkValue(strCha_Id)) {
        //        edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
        //    }
        //    else {
        //        me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
        //    }
        //});
    },
    getList_LLKH: function (type, palce) {
        var me = this;
        //view data --Edit
        var obj_save = {
            'action': 'TN_LLKH_HoSo_MH/DSA4BSAvKRIgIikNDQoJ',
            'func': 'pkg_llkh_hoso.LayDanhSachLLKH',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById("txtSearchModal_TuKhoa_NS"),
            'iTrangThai': -1,
            'iTinhTrang': -1,
            'strLoaiTimKiem': "",
            'dChiLayDSCoSua': -1,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.cbGetListModal_LLKH(data.Data, data.Pager);
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    cbGetListModal_LLKH: function (data, iPager) {
        var me = edu.extend;
        me.dtNhanSu = data;
        var jsonForm = {
            strTable_Id: "tblModal_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.extend.getList_LLKH('SEARCH')",
                iDataRow: iPager,
            },
            colPos: {
                left: [2],
                fix: [0],
                right: [],
                center: [0, 1, 3, 4, 5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(aData.ANHCANHAN);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_ChucDanh = "";
                        var strNhanSu_Ma = edu.util.returnEmpty(aData.MASO);
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HOVATEN);
                        var strNhanSu_HocHam = edu.util.returnEmpty(aData.MACHUCDANH);
                        var strNhanSu_HocVi = edu.util.returnEmpty(aData.MAHOCVI);
                        //2. process data
                        if (!edu.util.checkValue(strNhanSu_HocHam)) {
                            strNhanSu_ChucDanh = "";
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_HocHam + ".";
                        }
                        if (!edu.util.checkValue(strNhanSu_HocVi)) {
                            //nothing
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_ChucDanh + strNhanSu_HocVi + ".";
                        }
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_ChucDanh + " " + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNgaySinh = "";
                        if (edu.util.checkValue(aData.NAMSINH)) {
                            strNgaySinh = aData.NAMSINH;
                        }
                        if (edu.util.checkValue(aData.THANGSINH)) {
                            strNgaySinh = aData.THANGSINH + "/" + strNgaySinh;
                        }
                        if (edu.util.checkValue(aData.NGAYSINH)) {
                            strNgaySinh = aData.NGAYSINH + "/" + strNgaySinh;
                        }
                        return '<span id="sl_ngaysinh' + aData.ID + '">' + strNgaySinh + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_gioitinh' + aData.ID + '">' + edu.util.returnEmpty(aData.TENGIOITINH) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },

    genBoLoc_HeKhoa: function (strTienTo, bKoCheckQuyen) {
        var me = this;
        $('#dropKhoaQuanLy' + strTienTo).on('select2:select', function (e) {
            getList_KhoaDaoTao();
            getList_ChuongTrinhDaoTao();
            getList_LopQuanLy();
            //me.getList_SinhVien();
        });
        $('#dropHeDaoTao' + strTienTo).on('select2:select', function (e) {

            getList_KhoaDaoTao();
            getList_ChuongTrinhDaoTao();
            getList_LopQuanLy();
            //me.getList_SinhVien();
        });
        $('#dropKhoaDaoTao' + strTienTo).on('select2:select', function (e) {

            getList_ChuongTrinhDaoTao();
            getList_LopQuanLy();
            //me.getList_SinhVien();
        });
        $('#dropChuongTrinh' + strTienTo).on('select2:select', function (e) {

            getList_LopQuanLy();
            //me.getList_SinhVien();
        });
        getList_KhoaQuanLy();
        getList_HeDaoTao();

        function getList_HeDaoTao() {
            if (me["dtHeDaoTao"] && me["dtHeDaoTao"].length > 0) {
                cbGenCombo_HeDaoTao(me["dtHeDaoTao"]);
                return;
            }
            var obj_save = {
                'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4QNDgkLwPP',
                'func': 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen',
                'iM': edu.system.iM,
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy11111' + strTienTo),
                'strDaoTao_HinhThucDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_BacDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            if (bKoCheckQuyen) {
                obj_save.action = 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4P';
                obj_save.func = 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao';
            }
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        me["dtHeDaoTao"] = json;
                        cbGenCombo_HeDaoTao(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "POST",
                action: obj_save.action,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }

        function getList_KhoaDaoTao() {

            if (!$("#dropKhoaDaoTao" + strTienTo).length) return;
            var obj_save = {
                'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLhA0OCQv',
                'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTaoQuyen',
                'iM': edu.system.iM,
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy' + strTienTo),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao' + strTienTo),
                'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            if (bKoCheckQuyen) {
                obj_save.action = 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLgPP';
                obj_save.func = 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao';
            }
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        me["dtKhoaDaoTao"] = json;
                        cbGenCombo_KhoaDaoTao(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "POST",
                action: obj_save.action,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }
        function getList_ChuongTrinhDaoTao() {

            if (!$("#dropChuongTrinh" + strTienTo).length) return;
            var obj_save = {
                'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUQNDgkLwPP',
                'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCTQuyen',
                'iM': edu.system.iM,
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao' + strTienTo),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao' + strTienTo),
                'strDaoTao_N_CN_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy' + strTienTo),
                'strDaoTao_ToChucCT_Cha_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            if (bKoCheckQuyen) {
                obj_save.action = 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUP';
                obj_save.func = 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT';
            }
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        me["dtChuongTrinhDaoTao"] = json;
                        cbGenCombo_ChuongTrinhDaoTao(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "POST",
                action: obj_save.action,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }
        function getList_LopQuanLy() {

            if (!$("#dropLop" + strTienTo).length) return;
            var obj_save = {
                'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04EDQ4JC8P',
                'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLyQuyen',
                'iM': edu.system.iM,
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao' + strTienTo),
                'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao' + strTienTo),
                'strDaoTao_Nganh_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_LoaiLop_Id': edu.util.getValById('dropAAAA'),
                'strDaoTao_ToChucCT_Id': edu.util.getValById('dropChuongTrinh' + strTienTo),
                'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy' + strTienTo),
                'strNhomlop_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'pageIndex': 1,
                'pageSize': 1000000,
            };
            if (bKoCheckQuyen) {
                obj_save.action = 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04';
                obj_save.func = 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy';
            }
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        me["dtLopQuanLy"] = json;
                        cbGenCombo_LopQuanLy(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "POST",
                action: obj_save.action,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }

        function getList_KhoaQuanLy() {
            if (me["dtKhoaQuanLy"] && me["dtKhoaQuanLy"].length > 0) {
                cbGenCombo_KhoaQuanLy(me["dtKhoaQuanLy"]);
                return;
            }
            if (!$("#dropKhoaQuanLy" + strTienTo).length) return;
            var obj_save = {
                'action': 'KHCT_ThongTin_MH/DSA4BRIKKS4gEDQgLw04ESkgLxA0OCQv',
                'func': 'pkg_kehoach_thongtin.LayDSKhoaQuanLyPhanQuyen',
                'iM': edu.system.iM,
                'strNguoiThucHien_Id': edu.system.userId,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        me["dtKhoaQuanLy"] = json;
                        cbGenCombo_KhoaQuanLy(json);
                    } else {
                        edu.system.alert("Lỗi: " + data.Message);
                    }
                },
                error: function (er) {
                    edu.system.alert("Lỗi: " + JSON.stringify(er));
                },
                type: "POST",
                action: obj_save.action,
                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }

        function cbGenCombo_HeDaoTao(data) {

            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TENHEDAOTAO",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropHeDaoTao" + strTienTo],
                type: "",
                title: "Chọn hệ đào tạo",
            }
            edu.system.loadToCombo_data(obj);
        }
        function cbGenCombo_KhoaDaoTao(data) {

            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TENKHOA",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropKhoaDaoTao" + strTienTo],
                type: "",
                title: "Chọn khóa đào tạo",
            }
            edu.system.loadToCombo_data(obj);
        }
        function cbGenCombo_ChuongTrinhDaoTao(data) {

            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TENCHUONGTRINH",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropChuongTrinh" + strTienTo],
                type: "",
                title: "Chọn chương trình đào tạo",
            }
            edu.system.loadToCombo_data(obj);
        }
        function cbGenCombo_LopQuanLy(data) {

            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropLop" + strTienTo],
                type: "",
                title: "Chọn lớp",
            }
            edu.system.loadToCombo_data(obj);
        }
        function cbGenCombo_KhoaQuanLy(data) {
            var me = this;
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    avatar: ""
                },
                renderPlace: ["dropKhoaQuanLy" + strTienTo],
                type: "",
                title: "Chọn khoa quản lý",
            }
            edu.system.loadToCombo_data(obj);
        }
    },
};