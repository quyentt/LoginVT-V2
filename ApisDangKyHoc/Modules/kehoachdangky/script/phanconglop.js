/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function PhanCongLop() { };
PhanCongLop.prototype = {
    dtPhanCongLop: [],
    dtPhanCap: [],
    oQuanSo: {},
    strPhanCongLop_Id: '',
    arrPhamVi: [],
    dtPhamVi: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.PHANCAP", "", "", function (data) {
            me.dtPhanCap = data;
            me.getList_PhanCongLop();
        });
        me.getList_ThoiGianDaoTao();
        me.getList_KeHoachDangKy();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_KhoaQuanLy();
        me.getList_CoSoDaoTao();

        $("#btnSearch").click(function (e) {
            me.getList_PhanCongLop();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_PhanCongLop();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            if (edu.util.getValById('dropSearch_KeHoach') == "") {
                edu.system.alert("Bạn cần chọn kế hoạch trước!");
                return;
            }
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_PhanCongLop").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhan", "checkX");
            if (arrChecked_Id.length == 0 && me.arrPhamVi.length > 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn lưu " + (arrChecked_Id.length * me.arrPhamVi.length) + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", (arrChecked_Id.length * me.arrPhamVi.length));
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    for (var j = 0; j < me.arrPhamVi.length; j++) {
                        me.save_PhanCongLop(me.arrPhamVi[j].id, arrChecked_Id[i]);
                    }
                }
            });
        });
        $("[id$=chkSelectAll_PhanCongLop]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhanCongLop" });
        });
        $("#btnXoaPhanCongLop").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("zonePhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanCongLop(arrChecked_Id[i]);
                }
            });
        });
        $("#tblPhanCongLop").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblPhanCongLop");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtPhanCongLop, "ID")[0];
                me.viewEdit_PhanCongLop(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_PhanCongLop();
            var x = $("#dropSearch_KeHoach option:selected").attr("name");
            console.log(x);
            var point = $("#dropThoiGianDaoTao");
            point.val(x).trigger("change");
            point.trigger({ type: 'select2:select' });
        });
        $("#dropThoiGianDaoTao").on("select2:select", function () {
            me.getList_KhoaToChuc();
            me.getList_HocPhan();
            me.getList_LopHocPhan();
        });
        $("#dropKhoaToChuc").on("select2:select", function () {
            me.getList_NganhToChuc();
            me.getList_HocPhan();
            me.getList_LopHocPhan();
        });
        $("#dropNganhDaoTao").on("select2:select", function () {
            me.getList_HocPhan();
            me.getList_LopHocPhan();
        });

        $('#dropHocPhan').on('select2:select', function (e) {
            me.getList_LopHocPhan();
        });
        $("#btnSearchPhanCong").click(function (e) {
            me.getList_LopHocPhan();
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $("#zonePhanCong").delegate('.btnDetail', 'click', function (e) {
            $('#myModal').modal('show');
            me.oQuanSo = {
                id: this.id,
                name: this.name
            };
            me.getList_QuanSoTheoLop();
        });
        $("#zonePhanCong").delegate('.checkAllTable', 'click', function (e) {
            var strTable_Id = this.id.replace("chkSelectAll_", "tblPhanCong");
            edu.util.checkedAll_BgRow(this, { table_id: strTable_Id});
        });
        $("[id$=chkSelectAll_QuanSo]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanSoLop" });
        });
        $("#btnDelete_LopHocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanSoLop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            $("#myModal").modal("hide");
            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuanSoTheoLop(arrChecked_Id[i]);
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $("#zoneEdit").delegate('.addPhamVi', 'click', function (e) {
            var strDropId = this.id.replace("add", "drop");
            var val = $("#" + strDropId).val();
            if (val !== "" && me.arrPhamVi.find(e => e.id === val) === undefined) {
                me.arrPhamVi.push({ id: $("#" + strDropId).val(), name: $("#" + strDropId + " option:selected").text() });
                var strPhamVi = "";
                me.arrPhamVi.forEach(ele => strPhamVi += " ," + ele.name);
                if (strPhamVi != "") strPhamVi = strPhamVi.substr(2);
                $("#lblPhamVi").html(strPhamVi);
            }
        });
        $("#addKhoaQuanKyKhoaHoc").click(function () {
            var valKQL = $("#dropKhoaQuanLy").val();
            var valKDT = $("#dropKhoaDaoTao").val();

            if (valKQL !== "" && valKDT != "") {
                me.arrPhamVi.push({ id: valKQL + valKDT, name: $("#dropKhoaQuanLy option:selected").text() + " - " + $("#dropKhoaDaoTao option:selected").text() });
                var strPhamVi = "";
                me.arrPhamVi.forEach(ele => strPhamVi += " ," + ele.name);
                if (strPhamVi != "") strPhamVi = strPhamVi.substr(2);
                $("#lblPhamVi").html(strPhamVi);
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $("#tblLopHocPhan").delegate('.btnDetail', 'click', function (e) {
            $('#myModalPhamVi').modal('show');
            me.getList_PhamVi(this.id);
        });
        $("[id$=chkSelectAll_LopHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLopHocPhan" });
        });

        $("[id$=chkSelectAll_PhamVi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhamVi" });
        });
        $("#btnDelete_PhamVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhamVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhamVi(arrChecked_Id[i]);
                }
            });
        });
        //
        $('#dropHeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao(this.value);
        });
        $('#dropKhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao(this.value);
            me.getList_LopQuanLy(this.value, "");
        });
        $('#dropChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy("", this.value);
            me.getList_DinhHuong();
        });
        $('#dropDinhHuong').on('select2:select', function (e) {
            me.getList_NhomDinhHuong();
        });
        $('#dropLop').on('select2:select', function (e) {
            var x = $(this).val();
            me.getList_SinhVien(this.value);
        });


        $("#DSTrangThaiSV").delegate(".ckbDSTrangThaiSV_ALL", "click", function (e) {

            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV").each(function () {
                this.checked = checked_status;
            });
        });
        //$('#dropThoiGianDaoTao').on('select2:select', function (e) {
        //    me.getList_HocPhan();
        //});
        edu.extend.genBoLoc_HeKhoa("_MK");
    },

    rewrite: function () {
        //reset id
        var me = this;
        me.arrPhamVi = [];
        $("#lblPhamVi").html("");
        edu.util.viewValById("dropKhoaQuanLy", "");
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", "");
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropLop", "");
        edu.util.viewValById("dropHocVien", "");
        //
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_PhanCongLop: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSDangKy_PhamVi_LopHP',
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhanCongLop = dtReRult;
                    me.genTable_PhanCongLop(dtReRult, data.Pager);
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
    save_PhanCongLop: function (strPhamViApDung_Id, strDangKy_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_PhanCong_LopHP/ThemMoi',
            
            'strId': me.strPhanCongLop_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'DKH_PhanCong_LopHP/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strPhanCongLop_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strPhanCongLop_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strPhanCongLop_Id = obj_save.strId
                    }
                    me.arrPhamVi = [];
                    $("#lblPhamVi").html("");
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                //me.getList_PhanCongLop();
            },
            error: function (er) {
                edu.system.alert("XLHV_PhanCongLop/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCongLop();
                });
            },
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanCongLop: function (strId) {
        var me = this;
        var temp = me.dtPhanCongLop.find(ele => ele.PHAMVIAPDUNG_ID === strId);
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_PhanCong_LopHP/Xoa_DangKy_PhanCong_LopHP',
            
            'strDangKy_KeHoachDangKy_Id': temp.DANGKY_KEHOACHDANGKY_ID,
            'strPhamViApDung_Id': temp.PHAMVIAPDUNG_ID,
            'strDangKy_LopHocPhan_Id': '',
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
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCongLop();
                });
            },
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_PhanCongLop: function (data, iPager) {
        var me = this;
        $("#zonePhanCong").html("");
        me.dtPhanCap.forEach(ele => {
            console.log(ele.ID);
            var tempData = data.filter(element => element.PHANCAPAPDUNG_ID === ele.ID);
            console.log(tempData);
            if (tempData != undefined && tempData.length > 0) {
                var rowHead = '<table id="tblPhanCong' + ele.ID  +'" class="table table-hover table-bordered">';
                rowHead += '<thead>';
                rowHead += '<tr>';
                rowHead += '<th class="td-center td-fixed">';
                rowHead += '<input type="checkbox" id="chkSelectAll_' + ele.ID +'" class="checkAllTable">';
                rowHead += '</th>';
                rowHead += '<th class="td-center">' + edu.util.returnEmpty(ele.TEN) + '</th>';
                rowHead += '<th class="td-center" style="width: 93px">Phân công</th>';
                rowHead += '</tr>';
                rowHead += '</thead>';
                rowHead += '<tbody>';
                rowHead += '</tbody>';
                rowHead += '</table>';
                console.log(rowHead);
                $("#zonePhanCong").append(rowHead);

                var jsonForm = {
                    strTable_Id: "tblPhanCong" + ele.ID,
                    
                    aaData: tempData,
                    colPos: {
                        center: [1],
                    },
                    bHiddenOrder: true,
                    aoColumns: [
                        {
                            "mRender": function (nRow, aData) {
                                return '<input type="checkbox" id="checkX' + aData.PHAMVIAPDUNG_ID + '"/>';
                            }
                        },
                        {
                            "mDataProp": "PHAMVIAPDUNG_TEN",
                        },
                        {
                            "mData": "SOLUONG",
                            "mRender": function (nRow, aData) {
                                return '<span><a class="btn btn-default btnDetail" id="' + aData.PHAMVIAPDUNG_ID + '" name="' + ele.ID + '" title="Chi tiết">Chi tiết</a></span>';
                            }
                        }
                    ]
                };
                edu.system.loadToTable_data(jsonForm);
            }
        });
        
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
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
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
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropChuongTrinh"),
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
            title: "Chọn hệ đào tạo",
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
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
            renderPlace: ["dropChuongTrinh"],
            type: "",
            title: "Chọn chương trình đào tạo",
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
            renderPlace: ["dropLop"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.PhanCongLop;
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
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.PhanCongLop.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
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
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Chọn năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    cbGenCombo_HocVien: function (data) {
        //var me = main_doc.DangKyDeCuong;
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
                //default_val: me.strHocVien_Id
            },
            renderPlace: ["dropHocVien"],
            type: "",
            title: "Chọn người học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_QuanSoTheoLop: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDangKy_LopHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strPhanCapApDung_Id': me.oQuanSo.name,
            'strPhamViApDung_Id': me.oQuanSo.id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager);
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
    genTable_QuanSoTheoLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            bPaginate: {
                strFuntionName: "main_doc.PhanCongLop.getList_QuanSoTheoLop()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    delete_QuanSoTheoLop: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_PhanCong_LopHP/Xoa',
            'strIds': strId,
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
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCongLop();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachDangKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.dtKeHoachDangKy = dtResult;
                    me.cbGenCombo_KeHoach(dtResult, iPager);
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
    cbGenCombo_KeHoach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "DAOTAO_THOIGIANDAOTAO_ID",
                avatar: ""
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSHocPhan',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaToChuc'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropNganhDaoTao'),
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
                    me.cbGenCombo_HocPhan(dtResult, iPager);
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
    cbGenCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropHocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LopHocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_ThongTin/LayDSLopHocPhan',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,

            
            'strDangKy_KeHoachDangKy_Id': '',
            'dLocGanTheoCTDT': $('#dLocCTDT').is(":checked") ? 1 : 0,
            'dChiLayCacLopChuaPhanCong': $('#dChuaPhanCong').is(":checked") ? 1 : 0,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaToChuc'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropNganhDaoTao'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById('dropCoSoDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_MK'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_MK'),
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
                    me.genTable_LopHocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    genTable_LopHocPhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLopHocPhan",
            bPaginate: {
                strFuntionName: "main_doc.PhanCongLop.getList_LopHocPhan()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    //"mDataProp": "DaoTao_ChuongTrinh_Ten (DaoTao_ChuongTrinh_Ma)",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " (" + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA) + ")";
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" name="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_PhamVi: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhamVi = dtReRult;
                    me.genTable_PhamVi(dtReRult, data.Pager);
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
    genTable_PhamVi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhamVi",

            //bPaginate: {
            //    strFuntionName: "main_doc.PhanCongLop.getList_QuanSoTheoLop()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "PHANCAPAPDUNG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    delete_PhamVi: function (strId) {
        var me = this;
        //--Edit
        var temp = me.dtPhamVi.find(ele => ele.ID === strId);
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_PhanCong_LopHP/Xoa_DangKy_PhanCong_LopHP',

            'strDangKy_KeHoachDangKy_Id': '',
            'strPhamViApDung_Id': temp.PHAMVIAPDUNG_ID,
            'strDangKy_LopHocPhan_Id': temp.DANGKY_LOPHOCPHAN_ID,
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
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhamVi();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_KhoaToChuc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSKhoaToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
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
                    me.cbGenCombo_KhoaToChuc(dtResult, iPager);
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
    cbGenCombo_KhoaToChuc: function (data) {
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
            renderPlace: ["dropKhoaToChuc"],
            type: "",
            title: "Chọn khóa tổ chức",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_NganhToChuc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaToChuc'),
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
                    me.cbGenCombo_NganhToChuc(dtResult, iPager);
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
    cbGenCombo_NganhToChuc: function (data) {
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
            renderPlace: ["dropNganhDaoTao"],
            type: "",
            title: "Chọn Ngành tổ chức",
        }
        edu.system.loadToCombo_data(obj);
    },


    getList_CoSoDaoTao: function () {
        var me = this;
        console.log('sss')
        var obj_list = {
            'action': 'KHCT_CoSoDaoTao/LayDanhSach',
            'type': 'GET',
            'pageIndex': 1,
            'pageSize': 10000,

        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_CoSoDaoTao(dtReRult);
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
    cbGenCombo_CoSoDaoTao: function (data) {
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
            renderPlace: ["dropCoSoDaoTao"],
            type: "",
            title: "Chọn cơ sở đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },


    getList_DinhHuong: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAhUeBSgvKQk0Li8m',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_CT_DinhHuong',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_DinhHuong(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DinhHuong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropDinhHuong"],
            title: "Chọn định hướng"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_NhomDinhHuong: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIFIC4VIC4eAhUeBQkeDykuLAPP',
            'func': 'pkg_kehoach_thongtin2.LayDSDaoTao_CT_DH_Nhom',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh'),
            'strDaoTao_CT_DinhHuong_Id': edu.util.getValById('dropDinhHuong'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_NhomDinhHuong(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_NhomDinhHuong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropNhomDinhHuong"],
            title: "Chọn nhóm định hướng"
        };
        edu.system.loadToCombo_data(obj);
    },
}