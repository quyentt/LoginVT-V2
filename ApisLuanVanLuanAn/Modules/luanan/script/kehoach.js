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
function KeHoach() { };
KeHoach.prototype = {
    strKeHoach_Id: '',
    dtKeHoach: [],
    dtHeDaoTao: [],
    dtKhoaDaoTao: [],
    arrNhanSu_Id: [],
    init: function () {

        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form_input();
            me.genHTML_KeHoach_HeKhoa_Data([]);
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        /*------------------------------------------
        --Discription: 
        --Order: 
        -------------------------------------------*/
        $(".btnSearch").click(function () {
            me.getList_KeHoach();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoach();
            }
        });
        $("#btnSave").click(function () {
            me.save_KeHoach();
        });
        $(".btnDelete").click(function () {
            if (edu.util.checkValue(me.strKeHoach_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_KeHoach();
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKeHoach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_form_input();
                me.strKeHoach_Id = strId;
                me.getList_KeHoach_HeKhoa();
                me.getList_KeHoach_ThanhVien();
                edu.util.setOne_BgRow(strId, "tblKeHoach");
                me.viewForm_KeHoach(edu.util.objGetOneDataInData(strId, me.dtKeHoach, "ID"));
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
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
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
                    me.delete_KeHoach_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $("#btnThemHeKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_KeHoach_HeKhoa(id, "");
        });
        $("#zone_input_KeHoach").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_HeKhoa tr[id='" + strRowId + "']").remove();
        });
        $("#zone_input_KeHoach").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KeHoach_HeKhoa(strId);
            });
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_KeHoach();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.LOAIHOSO", "", "", me.cbGetList_LoaiHoSo);
        //edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TINHCHATHOSO", "", "", me.cbGetList_TinhChatHoSo);
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_KeHoach");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_KeHoach");
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoach_Id = "";
        edu.util.viewValById("txtTenKeHoach", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        $("#tbl_HeKhoa tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },

    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_KeHoach_ChuyenDe/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
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
                    me.dtKeHoach = dtResult;
                    me.genTable_KeHoach(dtResult, iPager);
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
    save_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'LVLA_KeHoach_ChuyenDe/ThemMoi',


            'strId': me.strKeHoach_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById("txtTenKeHoach"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNgayBatDau': edu.util.getValById("txtNgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtNgayKetThuc"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (obj_save.strId !== "") {
            obj_save.action = 'LVLA_KeHoach_ChuyenDe/CapNhat';
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
                        strId = me.strKeHoach_Id;
                    }
                    $("#tbl_HeKhoa tbody tr").each(function () {
                        var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                        if (!edu.util.checkValue($(this).attr("name"))) {// Nếu chưa có dữ liệu thì gọi thêm
                            me.save_KeHoach_HeKhoa(strHeKhoa_Id, strId);
                        }
                    });
                    $("#tblInputDanhSachNhanSu tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if (!edu.util.checkValue($(this).attr("name"))) {// Nếu chưa có dữ liệu thì gọi thêm
                            me.save_KeHoach_ThanhVien(strNhanSu_Id, strId);
                        }
                    });
                    me.getList_KeHoach();
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
    delete_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'LVLA_KeHoach_ChuyenDe/Xoa',

            'strIds': me.strKeHoach_Id,
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

                me.getList_KeHoach();
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
    genTable_KeHoach: function (data, iPager) {
        var me = this;
        $("#lblKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KeHoach()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 2, 3, 4],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
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
    viewForm_KeHoach: function (data) {
        //view data --Edit
        edu.util.viewValById("txtTenKeHoach", data.TEN);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
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
                    me.dtHeDaoTao= dtResult;
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 100000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtHeDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
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
                    me.dtKhoaDaoTao = dtResult;
                    //me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': "",
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 10000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKhoaDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_KeHoach_ThanhVien: function (strNhanSu_Id, strKeHoach_Id) {
        var me = this;
        //var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit

        var obj_save = {
            'action': 'LVLA_KeHoach_ChuyenDe_NhanSu/ThemMoi',


            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strLVLA_KeHoach_ChuyenDe_Id': strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_KeHoach_NhanSu/CapNhat';
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
    getList_KeHoach_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_KeHoach_ChuyenDe_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_KeHoach_ChuyenDe_Id': me.strKeHoach_Id,
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
                    me.genTable_KeHoach_ThanhVien(dtResult);
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
    delete_KeHoach_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_KeHoach_ChuyenDe_NhanSu/Xoa',

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
                    me.getList_KeHoach_ThanhVien();
                }
                else {
                    obj = {
                        content: "TS_KeHoach_NhanSu/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_KeHoach_NhanSu/Xoa (er): " + JSON.stringify(er),
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
    genTable_KeHoach_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].NGUOIDUNG_ID + "' name='" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].NGUOIDUNG_TENDAYDU + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].NGUOIDUNG_TAIKHOAN + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
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
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-left'><span>" + valMa + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html);
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
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_KeHoach_HeKhoa: function (strHeKhoa_Id, strKeHoach_Id) {
        var me = this;
        var strId = strHeKhoa_Id;
        var strDaoTao_HeDaoTao_Id = edu.util.getValById('dropHeDaoTao' + strHeKhoa_Id);
        var strDaoTao_KhoaDaoTao_Id = edu.util.getValById('dropKhoaDaoTao' + strHeKhoa_Id);
        if (!edu.util.checkValue(strDaoTao_HeDaoTao_Id) || !edu.util.checkValue(strDaoTao_KhoaDaoTao_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'LVLA_KeHoach_DeCuong_Khoa/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strLVLA_KeHoach_DeCuong_Id': strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'TS_KeHoach_HeDaoTao/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
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
    getList_KeHoach_HeKhoa: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'LVLA_KeHoach_DeCuong_Khoa/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strLVLA_KeHoach_DeCuong_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_KeHoach_HeKhoa_Data(dtResult);
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
    delete_KeHoach_HeKhoa: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_KeHoach_DeCuong_Khoa/Xoa',

            'strIds': strIds,
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
                    me.getList_KeHoach_HeKhoa();
                }
                else {
                    obj = {
                        content: "TS_KeHoach_HeDaoTao/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_KeHoach_HeDaoTao/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_KeHoach_HeKhoa_Data: function (data) {
        var me = this;
        $("#tbl_HeKhoa tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strHeKhoa_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strHeKhoa_Id + '" name="aaa">';
            row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHeDaoTao' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
            row += '<td><select id="dropKhoaDaoTao' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHeKhoa" id="' + strHeKhoa_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tbl_HeKhoa tbody").append(row);
            me.genCombo_HeDaoTao("dropHeDaoTao" + strHeKhoa_Id, data[i].DAOTAO_HEDAOTAO_ID);
            //me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, data[i].DAOTAO_KHOADAOTAO_ID);
            me.getList_KhoaDaoTao_InTable(data[i].DAOTAO_HEDAOTAO_ID, "dropKhoaDaoTao" + strHeKhoa_Id, data[i].DAOTAO_KHOADAOTAO_ID);

            $("#dropHeDaoTao" + strHeKhoa_Id).on("select2:select", function () {
                var strDrop_Id = this.id.replace("dropHeDaoTao", "");
                me.getList_KhoaDaoTao_InTable($(this).val(), "dropKhoaDaoTao" + strDrop_Id);
            });
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_KeHoach_HeKhoa(id, "");
        }
    },
    genHTML_KeHoach_HeKhoa: function (strHeKhoa_Id) {
        var me = this;
        var iViTri = document.getElementById("tbl_HeKhoa").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strHeKhoa_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHeDaoTao' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
        row += '<td><select id="dropKhoaDaoTao' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strHeKhoa_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tbl_HeKhoa tbody").append(row);
        me.genCombo_HeDaoTao("dropHeDaoTao" + strHeKhoa_Id, "");
        me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, "");
        me.getList_KhoaDaoTao(edu.util.getValById("dropHeDaoTao"));

        $("#dropHeDaoTao" + strHeKhoa_Id).on("select2:select", function () {
            var strDrop_Id = this.id.replace("dropHeDaoTao", "");
            me.getList_KhoaDaoTao_InTable($(this).val(), "dropKhoaDaoTao" + strDrop_Id, "");
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao_InTable: function (strDaoTao_HeDaoTao_Id, strDrop_Id, default_val) {
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
                    me.genCombo_KhoaDaoTao_InTable(dtResult, strDrop_Id, default_val);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 10000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao_InTable: function (data, strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
};