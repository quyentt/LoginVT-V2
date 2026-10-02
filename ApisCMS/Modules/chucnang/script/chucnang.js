/*----------------------------------------------
--Author: nnthuong
--Phone: 0169 260 2793
--Date of created: 09/11/2017
----------------------------------------------*/
function ChucNang() { }
ChucNang.prototype = {
    dtChucNang: [],
    dtVaiTroChucNang: [],
    dtNguoiDungChucNang: [],
    strUngDung_Id: '',
    strChucNang_Id: '',

    init: function () {
        var me = this;
        if (edu.system.userId == "4038E6FD0FFA4D339FA991E740348F01") {
            $(".userAzz").show();
        }
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        edu.system.page_load();
        me.toggle_detail();
        me.getList_UngDung();
        edu.system.loadToCombo_DanhMucDuLieu("CHUNG.HANHDONG", "dropQuyen_QuyenCN");

        // Fix Select2 dropdown bay ra ngoài khi trong modal #myModalQuyenCN.
        // Root cause: MutationObserver global (indexi.aspx) move .select2-container--open sang body.
        // Fix: khi modal shown, destroy Select2 hiện tại + re-init với dropdownParent = modal
        // → dropdown attach TRONG modal → observer skip (đã fix ở indexi.aspx thêm guard closest('.modal.in|show')).
        // Đăng ký ở đây (không đăng ký trong <script> chunk chucnang.html) vì AJAX load HTML
        // đôi khi không thực thi inline script tag.
        $(document).off('shown.bs.modal.chucnangSelect2').on('shown.bs.modal.chucnangSelect2', '#myModalQuyenCN', function () {
            var $modal = $(this);
            $modal.find('select').each(function () {
                var $sel = $(this);
                var curVal = $sel.val();
                if ($sel.hasClass('select2-hidden-accessible')) {
                    try { $sel.select2('destroy'); } catch (e) { }
                }
                var opts = {
                    dropdownParent: $modal,
                    width: '100%'
                };
                // Select "Hiệu lực" chỉ 2 option → ẩn ô search cho gọn
                if ($sel.attr('id') === 'dropHieuLuc_QuyenCN') {
                    opts.minimumResultsForSearch = Infinity;
                }
                $sel.select2(opts);
                if (curVal !== null && curVal !== undefined) {
                    $sel.val(curVal).trigger('change.select2');
                }
            });
        });
        // Backup: nếu observer vẫn kéo container sang body, reposition thủ công qua select2:open
        $(document).off('select2:open.chucnangReposition').on('select2:open.chucnangReposition', '#myModalQuyenCN select', function () {
            var native = this;
            [10, 60, 200].forEach(function (delay) {
                setTimeout(function () {
                    var $dd = $('.select2-container--open').last().find('.select2-dropdown');
                    if (!$dd.length) return;
                    var rect = native.getBoundingClientRect();
                    // Chỉ reposition nếu container không nằm trong modal (edge case)
                    var $container = $dd.closest('.select2-container');
                    if (!$container.closest('#myModalQuyenCN').length) {
                        $container.css({
                            position: 'absolute',
                            top: (rect.bottom + window.scrollY) + 'px',
                            left: (rect.left + window.scrollX) + 'px',
                            width: rect.width + 'px',
                            'z-index': 100050
                        });
                    }
                }, delay);
            });
        });

        $("#txtSearch_ChucNang_CN").on("input", function () {
            me.filterTree_ChucNang($(this).val());
        });
        /*------------------------------------------
        --Discription: [0] Action Common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_detail();
        });
        $("#btnDownloadFile").click(function () {
            var strTableNames = "select * from chung_chucnang where chung_ungdung_id='" + edu.util.getValById("dropSearch_UngDung_CN") + "'";
            var url_report = edu.system.rootPathReport + "/Modules/Common/ExportDataInTable.aspx?strTableNames=" + strTableNames;
            location.href = url_report;
        });
        /*------------------------------------------
        --Discription: [1] Action UngDung
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_UngDung_CN").on("select2:select", function () {
            var strUngDung_Id = edu.util.getValById("dropSearch_UngDung_CN");
            me.strUngDung_Id = strUngDung_Id;
            if (edu.util.checkValue(strUngDung_Id)) {
                me.getList_ChucNang();
                $("#dropChucNang_UngDung").val(strUngDung_Id).trigger("change");
            }
            else {
                edu.system.alert("Vui lòng chọn ứng dụng!");
            }
        });
        /*------------------------------------------
        --Discription: [2] Action ChucNang
        --Order: 
        -------------------------------------------*/
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnEdit_CN").click(function () {
            if (!me.strChucNang_Id) me.strChucNang_Id = me.strChucNangTemp_Id;
            me.getDetail_ChucNang(me.strChucNang_Id, constant.setting.ACTION.EDIT);
            me.toggle_input();
        });
        $("#btnSave_CN").click(function () {
            me.save_ChucNang();
        });
        $("#btnDelete_CN").click(function (e) {

            if (edu.util.checkValue(me.strChucNang_Id)) {
                me.toggle_delete();
                me.getList_VaiTroChucNang();
                me.delete_ChucNang();
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu cần xóa!");
            }
        });
        /*------------------------------------------
        --Discription: [3] Action VaiTroChucNang
        --Order: 
        -------------------------------------------*/
        $("#btnDelete_VaiTroChucNang_CN").click(function (e) {
            if (edu.util.checkValue(me.strChucNang_Id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa Chức năng ra khỏi toàn bộ Vai trò?");
                $("#btnYes").click(function (e) {
                    me.delete_VaiTroChucNang();
                });
                return false;
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu cần xóa!");
            }
        });
        /*------------------------------------------
        --Discription: [4] Action NguoiDungChucNang
        --Order: 
        -------------------------------------------*/
        $("#btnDelete_NguoiDungChucNang_CN").click(function (e) {
            if (edu.util.checkValue(me.strChucNang_Id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa Chức năng ra khỏi toàn bộ Người dùng?");
                $("#btnYes").click(function (e) {
                    me.delete_NguoiDungChucNang();
                });
                return false;
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu cần xóa!");
            }
        });

        $("#tblQuyenCN").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtQuyenCN.find(e => e.ID == strId);
            me["strQuyenCN_Id"] = data.ID;
            edu.util.viewValById("dropQuyen_QuyenCN", data.HANHDONG_ID);
            edu.util.viewValById("txtMoTa_QuyenCN", data.MOTA);
            edu.util.viewValById("dropHieuLuc_QuyenCN", data.HIEULUC);
            $("#myModalQuyenCN").modal("show");
        });
        $("#btnAdd_QuyenCN").click(function () {
            var data = {};
            me["strQuyenCN_Id"] = data.ID;
            edu.util.viewValById("dropQuyen_QuyenCN", data.HANHDONG_ID);
            edu.util.viewValById("txtMoTa_QuyenCN", data.MOTA);
            edu.util.viewValById("dropHieuLuc_QuyenCN", 1);
            $("#myModalQuyenCN").modal("show");
        });
        $("#btnSave_QuyenCN").click(function () {
            var arrCheck = $("#dropQuyen_QuyenCN").val();
            if (!arrCheck) {
                edu.system.alert("Vui lòng chọn dữ liệu");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrCheck.length);
            arrCheck.forEach(e => me.save_QuyenCN(e));
           
        });
        $("#btnDelete_QuyenCN").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuyenCN", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuyenCN(arrChecked_Id[i]);
                }
            });
        });
    },
    /*----------------------------------------------
    --Discription: [0] Common
    --API:  
    ----------------------------------------------*/
    rewrite: function () {
        var me = this;
        me.strChucNang_Id = "";
        edu.util.viewValById("txtChucNang_Ten", "");
        edu.util.viewValById("txtChucNang_Ma", "");
        edu.util.viewValById("txtChucNang_Icon", "");
        edu.util.viewValById("txtChucNang_ThuTuHienThi", "");
        edu.util.viewValById("txtChucNang_DuongDanThuMuc", "");
        edu.util.viewValById("txtChucNang_DuongDanHuongDan", "");
        edu.util.viewValById("dropChucNang_TrangThai", "");
        edu.util.viewValById("txtChucNang_DuongDanHienThi", "");
        //edu.util.viewValById("dropChucNang_Cha", "");
        //edu.util.viewValById("dropChucNang_UngDung", "");
        edu.util.viewValById("dropChucNang_PhamViTruyCap", "");
        edu.util.viewValById("txtChucNang_MoTa", "");
        edu.util.viewValById("txtChucNang_NoiDungAn", "");
    },
    reset: function () {
        var me = this;
        me.strChucNang_Id = "";
        edu.util.viewHTMLById("lblChucNang_Ten", "");
        edu.util.viewHTMLById("lblChucNang_Ma", "");
        edu.util.viewHTMLById("lblChucNang_Icon", "");
        edu.util.viewHTMLById("lblChucNang_ThuTuHienThi", "");
        edu.util.viewHTMLById("lblChucNang_DuongDanHienThi", "");
        edu.util.viewHTMLById("lblChucNang_Cha", "");
        edu.util.viewHTMLById("lblChucNang_DuongDanThuMuc", "");
        edu.util.viewValById("txtChucNang_DuongDanHuongDan", "");
        edu.util.viewHTMLById("lblChucNang_UngDung", "");
        edu.util.viewHTMLById("lblChucNang_PhamViTruyCap", "");
        edu.util.viewHTMLById("lblChucNang_MoTa", "");
        edu.util.viewValById("lblChucNang_NoiDungAn", "");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus-cn", "zone_detail_cn");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zone-bus-cn", "zone_input_cn");
    },
    toggle_delete: function () {
        edu.util.toggle_overide("zone-bus-cn", "zone_delete_cn");
    },
    /*----------------------------------------------
    --Discription: [1] Access DB UngDung
    --API:  
    ----------------------------------------------*/
    getList_UngDung: function () {
        var me = this;
        var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
			'iM' : edu.system.iM,

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1
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
                    me.genCombo_UngDung(dtResult);
                }
                else {
                    edu.system.alert("CMS_UngDung/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_UngDung/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [1] GenHTML UngDung
    --API:  
    ----------------------------------------------*/
    genCombo_UngDung: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "MAUNGDUNG"
            },
            renderPlace: ["dropSearch_UngDung_CN", "dropChucNang_UngDung"],
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Discription: [2] Access DB ChucNang
    --API:  
    ----------------------------------------------*/
    save_ChucNang: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung/ThemMoiChucNang',
            

            'strId'                 : me.strChucNang_Id,
            'strMaChucNang'                 : edu.util.getValById("txtChucNang_Ma").replace(/ /g,''),
            'strTenChucNang': edu.util.getValById("txtChucNang_Ten"),
            'strMoTa'               : edu.util.getValById("txtChucNang_MoTa"),
            'dThuTu'                : edu.util.returnZero(edu.util.getValById("txtChucNang_ThuTuHienThi")),
            'dTrangThai'            : 1,
            'strNguoiThucHien_Id'   : edu.system.userId,
            'strNoiDung'            : "",
            'strTenAnh'               : edu.util.getValById("txtChucNang_Icon"),
            'strDuongDanFile': edu.util.getValById("txtChucNang_DuongDanThuMuc").replace(/ /g, ''),
            'strDuongDanHienThi': edu.util.getValById("txtChucNang_DuongDanHienThi").replace(/ /g, ''),
            'strChucNangCha_Id'             : edu.util.getValById("dropChucNang_Cha"),
            'strChung_UngDung_Id'         : edu.util.getValById("dropChucNang_UngDung"),
            'strNGUONTRUYCAP_Id': edu.util.getValById("dropChucNang_PhamViTruyCap"),
            'strDuongDanHuongDanSuDung': edu.util.getValById("txtChucNang_DuongDanHuongDan"),
            'strThongTinKhongHienThi': edu.util.getValById("txtChucNang_NoiDungAn"),
            'strLuuThongTinTheoNguoiDung': edu.util.getValById('txtAAAA'),
        };
        if (obj_save.strId) {
            obj_save.action = 'CMS_QuanLyNguoiDung/SuaChucNang'
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strChucNang_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ChucNang();
                }
                else {
                    edu.system.alert("CMS_ChucNang/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_ChucNang/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ChucNang: function () {
        var me = this;

        //--Edit
		var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachChucNang',
			'iM' : edu.system.iM,
            'versionAPI'        : 'v1.0',
            'strTuKhoa'         : "",
            'strChung_UngDung_Id'     : edu.util.getValById("dropSearch_UngDung_CN"),
            'strCHUCNANGCHA_Id'         : "",
            'pageIndex'         : 1,
            'pageSize'          : 1000,
            'strNGUONTRUYCAP_Id': "",
            'dTrangThai': 1,
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
                    me.dtChucNang = dtResult;
                    me.genTreeJs_ChucNang(dtResult, iPager);
                    me.genCombo_ChucNang(dtResult);
                }
                else {
                    edu.system.alert("CMS_ChucNang/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_ChucNang/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_ChucNang: function (strId, action) {
        var me = this;
        switch (action) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtChucNang, "ID", me.viewEdit_ChucNang);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtChucNang, "ID", me.viewForm_ChucNang);
                break;
        }
        
    },
    delete_ChucNang: function () {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'CMS_QuanLyNguoiDung/XoaChucNang',
            'versionAPI'            : 'v1.0',
            'strIds'                 : me.strChucNang_Id,
            'strNguoiThucHien_Id'   : edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#notify_cn").html("Đã xóa chức năng thành công!");
                    me.getList_ChucNang();
                    me.toggle_detail();
                    me.reset();
                }
                else {
                    $("#notify_cn").html("CMS_ChucNang.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("CMS_ChucNang.Xoa: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [2] GenHTML ChucNang
    --API:  
    ----------------------------------------------*/
    viewForm_ChucNang: function (data) {
        var me = this;
        //view data
        edu.util.viewHTMLById("lblChucNang_Ten", data[0].TENCHUCNANG);
        edu.util.viewHTMLById("lblChucNang_Ma", data[0].MACHUCNANG);
        edu.util.viewHTMLById("lblChucNang_ThuTuHienThi", data[0].THUTU);
        edu.util.viewHTMLById("lblChucNang_DuongDanThuMuc", data[0].DUONGDANFILE);
        edu.util.viewHTMLById("lblChucNang_DuongDanHienThi", data[0].DUONGDANHIENTHI);
        edu.util.viewHTMLById("lblChucNang_DuongDanHuongDan", data[0].DUONGDANHUONGDANSUDUNG);
        edu.util.viewHTMLById("lblChucNang_Cha", data[0].CHUCNANGCHA);
        edu.util.viewHTMLById("lblChucNang_UngDung", data[0].CHUNG_UNGDUNG);
        edu.util.viewHTMLById("lblChucNang_PhamViTruyCap", data[0].TENDAYDU);
        edu.util.viewHTMLById("lblChucNang_MoTa", data[0].MOTA);
        edu.util.viewHTMLById("lblChucNang_Icon", data[0].TENANH);
        edu.util.viewHTMLById("lblChucNang_NoiDungAn", data[0].THONGTINKHONGHIENTHI);
        $("#dropChucNang_Cha").val(data[0].CHUCNANGCHA_ID).trigger("change");
    },
    viewEdit_ChucNang: function (data) {
        var me = this;
        edu.util.viewValById("txtChucNang_Ten", data[0].TENCHUCNANG);
        edu.util.viewValById("txtChucNang_Ma", data[0].MACHUCNANG);
        edu.util.viewValById("txtChucNang_Icon", data[0].TENANH);
        edu.util.viewValById("txtChucNang_ThuTuHienThi", data[0].THUTU);
        edu.util.viewValById("txtChucNang_DuongDanThuMuc", data[0].DUONGDANFILE);
        edu.util.viewValById("dropChucNang_TrangThai", data[0].TRANGTHAI);
        edu.util.viewValById("txtChucNang_DuongDanHienThi", data[0].DUONGDANHIENTHI);
        edu.util.viewValById("txtChucNang_DuongDanHuongDan", data[0].DUONGDANHUONGDANSUDUNG);
        edu.util.viewValById("dropChucNang_Cha", data[0].CHUCNANGCHA_ID);
        edu.util.viewValById("dropChucNang_UngDung", data[0].CHUNG_UNGDUNG_ID);
        edu.util.viewValById("dropChucNang_PhamViTruyCap", "");
        edu.util.viewValById("txtChucNang_MoTa", data[0].MOTA);
        edu.util.viewValById("txtChucNang_NoiDungAn", data[0].THONGTINKHONGHIENTHI);
    },
    genCombo_ChucNang: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "CHUCNANGCHA_ID",
                name: "TENCHUCNANG",
                code: ""
            },
            renderPlace: ["dropChucNang_Cha"],
            title: "Chọn chức năng cha"
        };
        edu.system.loadToCombo_data(obj);
    },
    filterTree_ChucNang: function (keyword) {
        var $tree = $("#treesjs_chucnang_cn");
        var kw = (keyword || "").toString().trim().toLowerCase();
        var $anchors = $tree.find("a.jstree-anchor");
        if (!kw) {
            $tree.find("li").show();
            $anchors.each(function () {
                $(this).html($(this).text());
            });
            return;
        }
        $tree.find("li").hide();
        $anchors.each(function () {
            var $a = $(this);
            var text = $a.text();
            var lower = text.toLowerCase();
            var idx = lower.indexOf(kw);
            var icon = $a.find("i").prop("outerHTML") || "";
            if (idx >= 0) {
                var $li = $a.closest("li");
                $li.show();
                $li.parents("li").show();
                var before = text.substring(0, idx);
                var match = text.substring(idx, idx + kw.length);
                var after = text.substring(idx + kw.length);
                $a.html(icon + " " + before + '<mark style="background:#ffe066;padding:0 2px">' + match + '</mark>' + after);
            } else {
                $a.html(icon + " " + text);
            }
        });
    },

    genTreeJs_ChucNang: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblChucNang_Tong_CN", iPager);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "CHUCNANGCHA_ID",
                name: "TENCHUCNANG",
                code: ""
            },
            renderPlaces: ["treesjs_chucnang_cn"],
            style: "fa fa-opera color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#treesjs_chucnang_cn').on("select_node.jstree", function (e, data) {
            me.strChucNang_Id = data.node.id;
            me["strChucNangTemp_Id"] = me.strChucNang_Id;
            me.getDetail_ChucNang(me.strChucNang_Id, constant.setting.ACTION.VIEW);

            me.getList_NguoiDungChucNang();
            me.getList_QuyenCN();
            //----------------------------------------------------------------------------------------------
            //1. acess data.node obj
            // get name ==> data.node.name, 
            // get id ==> data.node.id
            // get title ==> data.node.li_attr.title;
            //2. structure here
            //"id": "BA65941F4DB94384B6A8334D6540986D",
            //"text": "Giáo dục thể chất 2 (Bóng chuy...",
            //"icon": true,
            //"parent": "#",
            //"parents": ["#"],
            //"children": [],
            //"children_d": [],
            //"data": {},
            //"state": { "loaded": true, "opened": true, "selected": true, "disabled": false },
            //"li_attr": {
            //    "id": "BA65941F4DB94384B6A8334D6540986D", "class": "btnEvent ",
            //    "title": "Giáo dục thể chất 2 (Bóng chuyền)"
            //}, "a_attr": { "href": "#", "id": "BA65941F4DB94384B6A8334D6540986D_anchor" }, "original": false
            //---------------------------------------------------------------------------------------------------------
        });
    },
    /*----------------------------------------------
    --Discription: [3] Access DB VaiTroChucNang
    --API:  
    ----------------------------------------------*/
    getList_VaiTroChucNang: function () {
        var me = this;
        //--Edit
        var obj_list = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4CKTQiDyAvJgPP',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachVaiTroChucNang',
			'iM' : edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': me.strChucNang_Id,
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
                    me.dtVaiTroChucNang = dtResult;
                    me.genTreeJs_VaiTroChucNang(dtResult);
                    me.getList_NguoiDungChucNang();
                }
                else {
                    edu.system.alert("CMS_VaiTroChucNang/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_VaiTroChucNang/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_VaiTroChucNang: function () {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'CMS_QuanLyNguoiDung/XoaChucNangCuaVaiTro',
            'versionAPI'            : 'v1.0',
             
            'strVaiTro_Id'          : "",
            'strChucNang_Id'        : me.strChucNang_Id,
            'strNguoiThucHien_Id'   : edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Đã xóa toàn bộ Chức năng khỏi Vai trò!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_VaiTroChucNang();
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_VaiTroChucNang/Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_VaiTroChucNang/Xoa(er): " + JSON.stringify(er),
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

    genTreeJs_VaiTroChucNang: function (data) {
        edu.util.viewHTMLById("lblVaiTroNguoiDung_Tong_CN", data.length);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENVAITRO",
                code: ""
            },
            renderPlaces: ["treejsVaiTroChucNang_CN"],
            style: "fa fa-user color-active"
        };
        edu.system.loadToTreejs_data(obj);
    },
    /*----------------------------------------------
    --Discription: [4] Access DB VaiTroChucNang
    --API:  
    ----------------------------------------------*/
    getList_NguoiDungChucNang: function () {
        var me = this;
        //--Edit
        //var obj_list = {
        //    'action'            : 'CMS_TaiKhoan/LayDanhSachNguoiDungChucNang',
        //    'versionAPI'        : 'v1.0',

        //    'strTuKhoa'         : "",
        //    'pageIndex'         : edu.system.pageIndex_default,
        //    'pageSize'          : edu.system.pageSize_default,
        //    'strChucNang_Id'    : me.strChucNang_Id
        //};
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRIPJjQuKAU0LyYCLhA0OCQvAik0Ig8gLyYP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSNguoiDungCoQuyenChucNang',
            'iM': edu.system.iM,
            'strChucNang_Id': me.strChucNang_Id,
            'strHanhDong_Id': edu.system.getValById('dropAAAA'),
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
                    me.dtNguoiDungChucNang = dtResult;
                    me.genTable_NguoiDung(dtResult, iPager);

                    //CHECK TO DELETE CHUCNANG
                    //if (!edu.util.checkValue(me.dtNguoiDungChucNang) && !edu.util.checkValue(me.dtVaiTroChucNang)) {
                    //    me.delete_ChucNang();
                    //}
                }
                else {
                    edu.system.alert( data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_NguoiDungChucNang: function () {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'CMS_QuanLyNguoiDung/XoaChucNangTheoNguoiDung',
            'versionAPI'                : 'v1.0',

            'strUngDung_Id' : me.strChucNang_Id,
            'strNguoiDung_Id'           : "",
            'strNguoiThucHien_Id'       : edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Đã xóa toàn bộ Chức năng khỏi Người dùng!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NguoiDungChucNang();
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_NguoiDungChucNang / Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_NguoiDungChucNang/Xoa(er): " + JSON.stringify(er),
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

    genTable_NguoiDung: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblNguoiDungChucNang_Tong_CN", iPager);
        edu.util.viewHTMLById("lblNguoiDungChucNang_Tong_CN2", iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiDungChucNang_CN",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChucNang.getList_NguoiDungChucNang()",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer"],
            bHiddenHeader: true,
            bHiddenOrder: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(aData.HINHDAIDIEN);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENDAYDU) + "</span><br />";
                        html += '<span class="italic">' + edu.util.returnEmpty(aData.EMAIL) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var jsonForm = {
            strTable_Id: "tblNguoiDungChucNang_CN2",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChucNang.getList_NguoiDungChucNang()",
                iDataRow: iPager
            },
            //arrClassName: ["tr-pointer"],
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            colPos: {
            },
            aoColumns: [
                {
                    "mDataProp": "TAIKHOAN"
                },
                {
                    "mDataProp": "TENDAYDU"
                },
                {
                    "mDataProp": "EMAIL"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },

    save_QuyenCN: function (strHanhDong_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/FSkkLB4CLjMkHhA0OCQv',
            'func': 'PKG_CORE_QUANTRI_02.Them_Core_Quyen',
            'iM': edu.system.iM,
            'strId': me.strQuyenCN_Id,
            'strChucNang_Id': me.strChucNang_Id,
            'strUngDung_Id': me.strUngDung_Id,
            'strHanhDong_Id': strHanhDong_Id,
            'strMoTa': edu.system.getValById('txtMoTa_QuyenCN'),
            'dHieuLuc': edu.system.getValById('dropHieuLuc_QuyenCN'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'CMS_QuanTri02_MH/EjQgHgIuMyQeEDQ4JC8P';
            obj_save.func = 'PKG_CORE_QUANTRI_02.Sua_Core_Quyen'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuyenCN();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QuyenCN: function (strDanhSach_Id) {
        var me = this;//--Edit
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/DSA4BRICLjMkHhA0OCQv',
            'func': 'PKG_CORE_QUANTRI_02.LayDSCore_Quyen',
            'iM': edu.system.iM,
            'strChucNang_Id': me.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtQuyenCN"] = dtReRult;
                    me.genTable_QuyenCN(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_QuyenCN: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/GS4gHgIuMyQeEDQ4JC8P',
            'func': 'PKG_CORE_QUANTRI_02.Xoa_Core_Quyen',
            'iM': edu.system.iM,
            'strId': Ids,
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
                }
                else {
                    obj = {
                        title: "",
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuyenCN();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_QuyenCN: function (data, iPager) {
        $("#lblQuyenCN_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuyenCN",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.QuyenCN.getList_QuyenCN()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "HANHDONG_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    //"mDataProp": "HIEULUC",
                    "mRender": function (nRow, aData) {
                        var x = aData.HIEULUC ? "" : "Hết hiệu lực";
                        return x;
                    }
                },
                {
                    "mDataProp": "CHUCNANG_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        /*III. Callback*/
    },
};