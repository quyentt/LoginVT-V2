/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function PhanPhongDangKy() { }
PhanPhongDangKy.prototype = {
    dtHoiDongXCD: [],
    strHoiDongXetCD_Id: '',
    strNhanSu_Id: '',
    dtVaiTro: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnSearchPPDK_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
        });
        /*------------------------------------------
        --Discription: [1] Action HoiDongXetChucDanh
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_PPDK").click(function () {
            me.getList_PPDK();
        });
        $("#txtSearch_PPDK_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PPDK();
            }
        });
        $("#btnSave_PPDK").click(function () {
            me.save_PPDK();
        });
        $("#tblPPDK").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_detail();
                me.strHoiDongXetCD_Id = strId;
                me.getDetail_PPDK(strId, constant.setting.ACTION.VIEW);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblPPDK").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_form();
                me.strHoiDongXetCD_Id = strId;
                me.getDetail_PPDK(strId, constant.setting.ACTION.EDIT);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblPPDK").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_PPDK(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [3] Action TCQG_ThanhVien input
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strId = edu.util.cutPrefixId(/slnhansu/g, id);
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                me.addHTMLinto_tblNhanSu(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        setTimeout(function () {
            me.getList_ToaNha();
            setTimeout(function () {
                me.getList_KeHoach();
                setTimeout(function () {
                    me.getList_Phong();
                    setTimeout(function () {
                        me.getList_PhanCongToaNha();
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_PPDK");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_PPDK");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_PPDK");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strHoiDongXetCD_Id = "";
        me.strNhanSu_Id = "";
        $("#tblInput_PPDK_DoiTuong tbody").html("");
        //
        var arrId = ["dropPPDK_ChuyenNganh"];
        edu.util.resetValByArrId(arrId);
        edu.util.resetRadio("name", "rdChucDanh");
        edu.util.resetRadio("name", "rdHDCoSo");
        edu.util.resetRadio("name", "rdHDNganh");
        edu.util.resetRadio("name", "rdHDNhaNuoc");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB KeHoach/ToaNha
    -------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_KeHoachDangKy/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById(""),
            'strLoaiKeHoach_Id': "",
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000
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
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert("KTX_KeHoachDangKy/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_KeHoachDangKy/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: ""
            },
            renderPlace: ["dropPPDK_KeHoach", "dropSearch_PPDK_KeHoach"],
            title: ""
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ToaNha: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDanhSach',
            

            'strTuKhoa': "",
            'strLoaiToaNha_Id': "",
            'strViTriCauThang_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
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
                    me.genCheckBox_ToaNha(dtResult);
                }
                else {
                    edu.system.alert("KTX_ToaNha/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_ToaNha/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCheckBox_ToaNha: function (data) {
        var obj = {
            renderPlace: "cbToaNha",
            data: data,
            prefix: "toanha",
            name: "TEN",
            id: "ID"
        };
        edu.system.loadToCheckBox_data(obj);
    },

    getList_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': '',
            'strKTX_ToaNha_Id': '',
            'strPhanLoaiDoiTuong_Id': '',
            'strTangThu_Id': "",
            'strLoaiPhong_Id': '',
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
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
                    me.genCombo_Phong(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_Phong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MA",
                code: ""
            },
            renderPlace: ["dropPPDK_Phong"],
            title: ""
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB PhanPhongDangKy
    -------------------------------------------*/
    getList_PPDK: function (strToaNha_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_PhanCongPhongDangKy/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_KeHoachDangKy_Id': edu.util.getValById("dropSearch_PPDK_KeHoach"),
            'strKTX_ToaNha_Id': strToaNha_Id,
            'strKTX_Phong_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000
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
                    me.genTreeJs_PhanCongPhong(dtResult, iPager, strToaNha_Id);
                }
                else {
                    edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_PPDK: function () {
        var me = this;
        var obj = {
            zone: "cbToaNha",
            prefix: "toanha",
            regexp: /toanha/g,
        }
        var arrToaNha_Id    = edu.util.getValCheckBox(obj);
        var strKeHoach_Id   = edu.util.getValById("dropPPDK_KeHoach");
        var arrPhong_Id     = edu.util.getValCombo("dropPPDK_Phong");

        console.log("strKeHoach_Id: " + strKeHoach_Id);
        console.log("arrToaNha_Id: " + arrToaNha_Id);
        console.log("arrPhong_Id: " + arrPhong_Id);

        //--Edit
        var obj_save = {
            'action': 'KTX_PhanCongPhongDangKy/ThemMoi',
            

            'strId'                     : "",    
            'strKTX_KeHoachDangKy_Id'   : strKeHoach_Id,
            'strKTX_ToaNha_Id'          : arrToaNha_Id,
            'strKTX_Phong_Id'           : arrPhong_Id,
            'strNguoiThucHien_Id'       : edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_PPDK();
                }
                else {
                    edu.system.alert("KTX_PhanCongPhongDangKy/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_PhanCongPhongDangKy/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_PPDK: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_PhanCongPhongDangKy/CapNhat',
            

            'strId': me.strHoiDongXetCD_Id,
            'strChucDanhDeXuat_Id': edu.util.getValRadio("name", "rdChucDanh"),
            'strDoiTuongDeXuat_Id': me.strNhanSu_Id,
            'strChuyenNganh_Id': edu.util.getValById("dropPPDK_ChuyenNganh"),
            'strKetQuaHoiDongCoSo_Id': edu.util.getValRadio("name", "rdHDCoSo"),
            'strKetQuaHoiDongNganh_Id': edu.util.getValRadio("name", "rdHDNganh"),
            'strKetQuaHoiDongNhaNuoc_Id': edu.util.getValRadio("name", "rdHDNhaNuoc"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_PPDK();
                }
                else {
                    edu.system.alert("KTX_PhanCongPhongDangKy/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_PhanCongPhongDangKy/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PPDK: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KTX_PhanCongPhongDangKy/Xoa',
            
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_PPDK();
                }
                else {
                    obj = {
                        content: "KTX_PhanCongPhongDangKy/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "KTX_PhanCongPhongDangKy/Xoa (er): " + JSON.stringify(er),
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

    getList_PhanCongToaNha: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_PhanCongToaNhaDangKy/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_KeHoachDangKy_Id': edu.util.getValById("dropSearch_PPDK_KeHoach"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
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
                    me.genTreeJs_PhanCongToaNha(dtResult, dtResult.length);
                }
                else {
                    edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_PhanCongPhongDangKy/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTreeJs_PhanCongToaNha: function (data, iPager) {
        var me = this;
        var node = "";
        node += '<ul class="jstree-container-ul jstree-children" role="group">';
        for (var i = 0; i < data.length; i++) {
            node += '<li class="jstree-node btnEvent  jstree-open jstree-last" id="' + data[i].KTX_TOANHA_ID + '" title="' + data[i].KTX_TOANHA_MA + '">';
            node += '<i class="jstree-icon jstree-ocl" role="presentation"></i>';
            node += '<a class="jstree-anchor" href="#" tabindex="-1">';
            node += '<i class="jstree-icon jstree-themeicon fa fa-cube color-active jstree-themeicon-custom" role="presentation"></i>';
            node += data[i].KTX_TOANHA_TEN;
            node += '</a>';
            node += '</li>';
        }
        node += '</ul>';
        $('#treesjs_ppdk_toanha').html(node);
        for (var i = 0; i < data.length; i++) {
            me.getList_PPDK(data[i].KTX_TOANHA_ID);
        }
        configTreejs();
        //2. Action
        $('#treesjs_ppdk_toanha').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            //var strNameNode_full = data.node.li_attr.title;
            //
            //$("#DropDuLieuCha_Search").val("").trigger("change");
            me.strFunc_Id = strNameNode;
            me.getList_Param();
        });

        function configTreejs() {
            //1. check
            $('#treesjs_ppdk_toanha').jstree();//default user
            $('#treesjs_ppdk_toanha').jstree(true).refresh();
            $('#treesjs_ppdk_toanha').one("refresh.jstree").jstree(true).refresh();
            $('#treesjs_ppdk_toanha i[class="jstree-icon jstree-themeicon"]').each(function () {
                this.classList.add("fa");
                this.classList.add("fa-cube");
                this.classList.add("color-active");
                this.classList.add("jstree-themeicon-custom");
            });
        }
    },
    /*------------------------------------------
    --Discription: [1] GenHTML HoiDongXetChucDanh
    -------------------------------------------*/
    getDetail_PPDK: function (strId, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtHoiDongXCD, "ID", me.viewEdit_PPDK);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtHoiDongXCD, "ID", me.viewDetail_PPDK);
                break;
        }
    },

    genTreeJs_PhanCongPhong: function (data, iPager, strToaNha_Id) {
        var me = this;
        //edu.util.viewHTMLById("lblPPDK_ToaNha_Tong", iPager);
        var node = "";
        node += '<ul class="jstree-children" role="group">';
        for (var i = 0; i < data.length; i++) {
            node += '<li class="jstree-node btnEvent  jstree-open jstree-last" id="' + data[i].KTX_TOANHA_ID + '" title="' + data[i].KTX_TOANHA_MA + '">';
            node += '<i class="jstree-icon jstree-ocl" role="presentation"></i>';
            node += '<a class="jstree-anchor" href="#" tabindex="-1">';
            node += '<i class="jstree-icon jstree-themeicon fa fa-cube color-active jstree-themeicon-custom" role="presentation"></i>';
            node += data[i].KTX_TOANHA_TEN;
            node += '</a>';
            node += '</li>';
        }
        node += '</ul>';
        console.log($('#' + strToaNha_Id)[0]);
        $('#' + strToaNha_Id).html(node);
        configTreejs();
        //2. Action
        //$('#treesjs_ppdk_toanha').on("select_node.jstree", function (e, data) {
        //    var strNameNode = data.node.id;
        //    //var strNameNode_full = data.node.li_attr.title;
        //    //
        //    //$("#DropDuLieuCha_Search").val("").trigger("change");
        //    me.strFunc_Id = strNameNode;
        //    me.getList_Param();
        //});

        function configTreejs() {
            //1. check
            $('#treesjs_ppdk_toanha').jstree();//default user
            $('#treesjs_ppdk_toanha').jstree(true).refresh();
            $('#treesjs_ppdk_toanha').one("refresh.jstree").jstree(true).refresh();
            $('#treesjs_ppdk_toanha i[class="jstree-icon jstree-themeicon"]').each(function () {
                this.classList.add("fa");
                this.classList.add("fa-cube");
                this.classList.add("color-active");
                this.classList.add("jstree-themeicon-custom");
            });
        }
    },
    viewDetail_PPDK: function (data) {
        var dt = data[0];
        //View - Nguoi nhap
        edu.util.viewHTMLById("lblPPDK_NguoiNhap", dt.NGUOITHUCHIEN_TENDAYDU);
        //View - Thong tin
        edu.util.viewHTMLById("lblPPDK_ChucDanh", dt.CHUCDANHDEXUAT_TEN);
        edu.util.viewHTMLById("lblPPDK_DoiTuong", dt.DOITUONGDEXUAT_TEN);
        edu.util.viewHTMLById("lblPPDK_ChuyenNganh", dt.CHUYENNGANH_TEN);
        edu.util.viewHTMLById("lblPPDK_HDCoSo", dt.KETQUAHOIDONGCOSO_TEN);
        edu.util.viewHTMLById("lblPPDK_HDNganh", dt.KETQUAHOIDONGNGANH_TEN);
        edu.util.viewHTMLById("lblPPDK_HDNhaNuoc", dt.KETQUAHOIDONGNHANUOC_TEN);
        //view DoiTuong

    },
    viewEdit_PPDK: function (data) {
        var dt = data[0];
        //Edit - Thong tin
        edu.util.viewRadioById("rdChucDanh", dt.CHUCDANHDEXUAT_ID);
        edu.util.viewValById("txtPPDK_DoiTuong", dt.DOITUONGDEXUAT_ID);
        edu.util.viewValById("dropPPDK_ChuyenNganh", dt.CHUYENNGANH_ID);
        edu.util.viewRadioById("rdHDCoSo", dt.KETQUAHOIDONGCOSO_ID);
        edu.util.viewRadioById("rdHDNganh", dt.KETQUAHOIDONGNGANH_ID);
        edu.util.viewRadioById("rdHDNhaNuoc", dt.KETQUAHOIDONGNHANUOC_ID);
        //view DoiTuong
    },
    /*------------------------------------------
    --Discription: [2] GenHTML add NhanSu
    --Task: 
    -------------------------------------------*/
    addHTMLinto_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        //1. notify
        obj_notify = {
            renderPlace: "slnhansu" + strNhanSu_Id,
            type: "s",
            title: "Đã chọn!"
        };
        edu.system.notifyLocal(obj_notify);
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        $("#tblInput_PPDK_DoiTuong tbody").html(html);
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_PPDK_DoiTuong tbody").html(html);
    },
};