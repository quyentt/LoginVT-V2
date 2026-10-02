/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 20/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DeCuongChinhThuc() { };
DeCuongChinhThuc.prototype = {
    strDeCuongChinhThuc_Id: '',
    dtDeCuongChinhThuc: [],
    dtHeDaoTao: [],
    dtKhoaDaoTao: [],
    arrNhanSu_Id: [],
    dtVaiTro: [],
    strChuongTrinh_Id: '',
    strLop_Id: '',
    strHocVien_Id: '',
    init: function () {

        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            if (edu.util.getValById("dropSearch_KeHoach") == "") {
                edu.system.alert("Bạn cần chọn kế hoạch");
                return;
            }
            me.rewrite();
            me.toggle_form_input();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        /*------------------------------------------
        --Discription: 
        --Order: 
        -------------------------------------------*/

        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_DeCuongChinhThuc();
        });
        $(".btnSearch").click(function () {
            me.getList_DeCuongChinhThuc();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DeCuongChinhThuc();
            }
        });
        $("#btnSave").click(function () {
            me.save_DeCuongChinhThuc();
        });
        $(".btnDelete").click(function () {
            if (edu.util.checkValue(me.strDeCuongChinhThuc_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_DeCuongChinhThuc();
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDeCuongChinhThuc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_form_input();
                me.strDeCuongChinhThuc_Id = strId;
                me.getList_DeCuongChinhThuc_ThanhVien();
                edu.util.setOne_BgRow(strId, "tblDeCuongChinhThuc");
                me.viewForm_DeCuongChinhThuc(edu.util.objGetOneDataInData(strId, me.dtDeCuongChinhThuc, "ID"));
                edu.system.hiddenElement('{"readonlyselect2": "#dropHeDaoTao,#dropKhoaDaoTao,#dropChuongTrinh,#dropLop,#dropHocVien"}');
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_NhanSu").click(function () {
            edu.extend.genModal_LLKH();
            edu.extend.getList_LLKH("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInputDanhSachNhanSu").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DeCuongChinhThuc_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $("#btnThemHeKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_DeCuongChinhThuc_HeKhoa(id, "");
        });
        $("#zone_input_DeCuongChinhThuc").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_HeKhoa tr[id='" + strRowId + "']").remove();
        });
        $("#zone_input_DeCuongChinhThuc").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_DeCuongChinhThuc_HeKhoa(strId);
            });
        });

        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $('#dropHeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao(this.value);
        });
        $('#dropKhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao(this.value);
            me.getList_LopQuanLy(this.value, "");
        });
        $('#dropChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy("", this.value);
        });
        $('#dropLop').on('select2:select', function (e) {
            var x = $(this).val();
            me.getList_SinhVien(this.value);
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_DeCuongChinhThuc();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_KeHoach();
        edu.system.loadToCombo_DanhMucDuLieu("LVLA.VTHD", "", "", function (data) {
            main_doc.DeCuongChinhThuc.dtVaiTro = data;
        });
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_DeCuongChinhThuc");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_DeCuongChinhThuc");
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDeCuongChinhThuc_Id = "";
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", "");
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropLop", "");
        edu.util.viewValById("dropHocVien", "");
        edu.util.viewValById("txtTenDeCuongTiengViet", "");
        edu.util.viewValById("txtTenDeCuongTiengAnh", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("txtNgayDangKy", "");
        edu.util.viewValById("txtSoQuyetDinh", "");
        edu.util.viewValById("txtNgayQuyetDinh", "");
        me.strChuongTrinh_Id = "";
        me.strLop_Id = "";
        me.strHocVien_Id = "";
        $("#tblInputDanhSachNhanSu tbody").html("");
        
    },

    getList_DeCuongChinhThuc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_DeCuong_ChinhThuc/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiDangKy_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.dtDeCuongChinhThuc = dtResult;
                    me.genTable_DeCuongChinhThuc(dtResult, iPager);
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
    save_DeCuongChinhThuc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'LVLA_DeCuong_ChinhThuc/ThemMoi',


            'strId': me.strDeCuongChinhThuc_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById("dropSearch_KeHoach"),
            'strQLSV_NguoiHoc_Id': edu.util.getValById("dropHocVien"),
            'strNguoiDangKy_Id': edu.system.userId,
            'strNgayDangKy': edu.util.getValById("txtNgayDangKy"),
            'strTenTiengViet': edu.util.getValById("txtTenDeCuongTiengViet"),
            'strTenTiengAnh': edu.util.getValById("txtTenDeCuongTiengAnh"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoQuyetDinh': edu.util.getValById('txtSoQuyetDinh'),
            'strNgayQuyetDinh': edu.util.getValById('txtNgayQuyetDinh'),
            'strLVLA_DeCuong_DangKy_Id': edu.util.objGetOneDataInData(me.strDeCuongChinhThuc_Id, me.dtDeCuongChinhThuc, "ID").LVLA_DECUONG_DANGKY_ID,
        };
        if (obj_save.strId !== "") {
            obj_save.action = 'LVLA_DeCuong_ChinhThuc/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = data.Id;
                    if (strId != undefined) {
                        edu.system.alert('Thêm mới thành công!');
                    } else {
                        edu.system.alert('Cập nhật thành công!');
                        strId = me.strDeCuongChinhThuc_Id;
                    }
                    $("#tblInputDanhSachNhanSu tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        me.save_DeCuongChinhThuc_ThanhVien(strNhanSu_Id, strId, $(this).attr("name"));
                    });
                    me.getList_DeCuongChinhThuc();
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
    delete_DeCuongChinhThuc: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'LVLA_DeCuong_ChinhThuc/Xoa',

            'strIds': me.strDeCuongChinhThuc_Id,
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
                    me.toggle_notify();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

                me.getList_DeCuongChinhThuc();
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
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DeCuongChinhThuc: function (data, iPager) {
        var me = this;
        $("#lblDeCuongChinhThuc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDeCuongChinhThuc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DeCuongChinhThuc.getList_DeCuongChinhThuc()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 9],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "TENTIENGVIET"
                },
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    viewForm_DeCuongChinhThuc: function (data) {
        var me = main_doc.DeCuongChinhThuc;
        //view data --Edit
        edu.util.viewValById("dropHeDaoTao", data.DAOTAO_HEDAOTAO_ID);
        edu.util.viewValById("dropKhoaDaoTao", data.DAOTAO_KHOADAOTAO_ID);
        edu.util.viewValById("dropChuongTrinh", data.DAOTAO_CHUONGTRINH_ID);
        edu.util.viewValById("dropLop", data.DAOTAO_LOPQUANLY_ID);
        edu.util.viewValById("dropHocVien", data.QLSV_NGUOIHOC_ID);
        edu.util.viewValById("txtTenDeCuongTiengViet", data.TENTIENGVIET);
        edu.util.viewValById("txtTenDeCuongTiengAnh", data.TENTIENGANH);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtNgayDangKy", data.NGAYDANGKY);
        edu.util.viewValById("dropSearch_KeHoach", data.LVLA_KEHOACH_DECUONG_ID);
        edu.util.viewValById("txtSoQuyetDinh", data.SOQUYETDINH);
        edu.util.viewValById("txtNgayQuyetDinh", data.NGAYQUYETDINH);
        me.strChuongTrinh_Id = data.DAOTAO_CHUONGTRINH_ID;
        me.strLop_Id = data.DAOTAO_LOPQUANLY_ID;
        me.strHocVien_Id = data.QLSV_NGUOIHOC_ID;
        me.getList_ChuongTrinhDaoTao(data.DAOTAO_KHOADAOTAO_ID);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_DeCuongChinhThuc_ThanhVien: function (strNhanSu_Id, strDeCuongChinhThuc_Id, strId) {
        var me = this;
        //var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit

        var obj_save = {
            'action': 'LVLA_DeCuong_ChinhThuc_HuongDan/ThemMoi',


            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLVLA_DeCuong_ChinhThuc_Id': strDeCuongChinhThuc_Id,
            'strVaiTro_Id': $("#vaitro_" + strNhanSu_Id).val(),
            'strNguoiHuongDan_Id': strNhanSu_Id,
            'strLVLA_KeHoach_DeCuong_Id': edu.util.getValById("dropSearch_KeHoach"),
            'strQLSV_NguoiHoc_Id': edu.util.getValById("dropHocVien"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'LVLA_DeCuong_ChinhThuc_HuongDan/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DeCuongChinhThuc_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_DeCuong_ChinhThuc_HuongDan/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_DeCuong_DangKy_Id': me.strDeCuongChinhThuc_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiHuongDan_Id': edu.util.getValById('dropAAAA'),
            'strVaiTro_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_KeHoach_DeCuong_Id': me.dtDeCuongChinhThuc.find(e => e.ID === me.strDeCuongChinhThuc_Id).LVLA_KEHOACH_DECUONG_ID,
            'strLVLA_DeCuong_ChinhThuc_Id': me.strDeCuongChinhThuc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_DeCuongChinhThuc_ThanhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_DeCuongChinhThuc_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_DeCuong_ChinhThuc_HuongDan/Xoa',

            'strIds': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DeCuongChinhThuc_ThanhVien();
                }
                else {
                    obj = {
                        content: "TS_DeCuongChinhThuc_NhanSu/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_DeCuongChinhThuc_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DeCuongChinhThuc_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].NGUOIHUONGDAN_ID + "' name='" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].NGUOIHUONGDAN_HOTEN + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIHUONGDAN_COQUANCONGTAC) + "</span></td>";
            html += "<td class='td-left'><select id='vaitro_" + data[i].NGUOIHUONGDAN_ID + "'></select></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            $("#vaitro_" + data[i].NGUOIHUONGDAN_ID).select2();
            me.genCombo_VaiTro("vaitro_" + data[i].NGUOIHUONGDAN_ID, data[i].VAITRO_ID);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        var objNhanSu = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtNhanSu, "ID")
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-left'><span>" + edu.util.returnEmpty(objNhanSu.COQUANCONGTAC) + "</span></td>";
        html += "<td class='td-left'><select id='vaitro_" + strNhanSu_Id + "'></select></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html);
        $("#vaitro_" + strNhanSu_Id).select2();
        me.genCombo_VaiTro("vaitro_" + strNhanSu_Id, "");
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_KeHoach_DeCuong/LayDanhSach',
            'strTuKhoa': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
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
                    me.genCombo_KeHoach(dtResult, iPager);
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
    genCombo_KeHoach: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var objList = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strToChucCT_Id) {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
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
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'strTuKhoa': "",
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strChuongTrinh_Id': edu.util.getValById('dropChuongTrinh'),
            'strLopQuanLy_Id': edu.util.getValById('dropLop'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
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
                    me.cbGenCombo_HocVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
            renderPlace: ["dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo"
        };
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.DeCuongChinhThuc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: "",
                default_val: me.strChuongTrinh_Id
            },
            renderPlace: ["dropChuongTrinh"],
            type: "",
            title: "Chọn chương trình",
        };
        edu.system.loadToCombo_data(obj);
        if (me.strChuongTrinh_Id != "") {
            me.getList_LopQuanLy("", me.strChuongTrinh_Id);
        }
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = main_doc.DeCuongChinhThuc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                default_val: me.strLop_Id
            },
            renderPlace: ["dropLop"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (me.strLop_Id != "") {
            me.getList_SinhVien();
        }
    },
    cbGenCombo_HocVien: function (data) {
        var me = main_doc.DeCuongChinhThuc;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return aData.MASO + " - " + aData.HODEM + " " + aData.TEN;
                },
                default_val: me.strHocVien_Id
            },
            renderPlace: ["dropHocVien"],
            type: "",
            title: "Chọn học viên",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocKy_IHD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy_IHD").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.NhapChuyenCan.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genCombo_VaiTro: function (strVaiTro_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strVaiTro_Id],
            type: "",
            title: "Chọn vài trò"
        };
        edu.system.loadToCombo_data(obj);
    },
};