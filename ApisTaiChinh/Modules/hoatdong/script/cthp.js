/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 29/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ChuongTrinhHocPhan() { };
ChuongTrinhHocPhan.prototype = {
    dtChuongTrinh: [],
    strChuongTrinh_Id: '',
    dtHocPhan: [],
    strHocPhan_Id: '',
    strHocPhan_ChuongTrinh_Id: '',
    dtHocPhan_ChuongTrinh: [],
    strKhoiBatBuoc_Id: '',
    dtKhoibatBuoc: '',
    strKhoiTuChonDon_Id: '',
    dtKhoiTuChonDon: '',
    strDinhHuong_Id: '',
    dtDinhHuong: [],
    strHead: '',
    arrSinhVien: [],
    arrSinhVien_Id: [],
    init: function () {
        var me = this;
        me.strHead = $("#tblHocPhan thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //me.getList_ChuongTrinh();
        me.getList_KhoaDaoTao_Edit();
        $("#btnSearchChuongTrinh").click(function () {
            me.getList_ChuongTrinh();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ChuongTrinh();
            }
        });
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-content", "zonebatdau");
        });

        $("#tblChuongTrinh").delegate(".btnViewCT", "click", function (event) {
            event.stopImmediatePropagation();
            edu.util.toggle_overide("zone-content", "zoneViewHocPhan");
            var strId = this.id;
            strId = edu.util.cutPrefixId(/viewCT_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strChuongTrinh_Id = strId;
                me.getList_VDinhHuong()
                me.getList_VKhoiBatBuoc();
                me.getList_VKhoiTuChon();
                me.getList_KyDuKien();
                $("#tblViewKhoiBatBuoc tbody").html("");
                $("#tblViewKhoiBatBuoc tfoot").html("");
                $("#tblViewKhoiTuChon tbody").html("");
                $("#tblViewKhoiTuChon tfoot").html("");

                var data = edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID")[0]; 
                var html = "";
                html += '<div class="small-box">';
                html += '<div class="inner">';
                html += '<h4>' + edu.util.returnEmpty(data.TENCHUONGTRINH) + '</h4>';
                html += '<p>Mã: ' + edu.util.returnEmpty(data.MACHUONGTRINH) + '</p>';
                html += '<p>Số tín chỉ quy định theo chương trình: ' + edu.util.returnEmpty(data.TONGSOTINCHIQUYDINH) + '</p>';
                html += '<p>Số tín chỉ theo khối khai báo: ' + edu.util.returnEmpty(data.TONGSOTINCHITHEOKHOIKT) + '</p>';
                html += '<p>Tổng số SV còn đang học/ Tổng số: ' + edu.util.returnEmpty(data.SODANGHOC) + '/ ' + + edu.util.returnEmpty(data.TONGSOSV) + '</p>';
                html += '</div>';
                html += '</div>';
                $("#lblThongTinChuongTrinh").html(html);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
        });
        
        edu.system.getList_MauImport("zonebtnHPCT");
        
    },
    rewrite: function () {
        var me = this;
        me.strPhong_Id = "";
        edu.util.viewValById("txtToaNha_Ten", "");
        edu.util.viewValById("txtToaNha_Ma", "");
        edu.util.viewValById("txtToaNha_SoTang", "");
        edu.util.viewValById("dropToaNha_Loai", "");
        edu.util.viewValById("txtPhong_DienTichSuDung", "");
        edu.util.viewValById("dropToaNha_ViTriCauThang", "");
        edu.util.viewValById("txtToaNha_ThongTinLienHe", "");
        edu.util.viewValById("txtToaNha_DiaChi", "");
    },
    rewrite_QuanHeHocPhan: function () {
        var me = this;
        edu.util.viewValById("dropHocPhan_QuanHe_LoaiQuanHe", "");
        edu.util.viewValById("dropHocPhan_QuanHe_HocPhan", "");
        edu.util.viewValById("dropHocPhan_QuanHe_Muc", "");
        edu.util.viewValById("dropHocPhan_QuanHe_ToanTu", "");
        edu.util.viewValById("txtHocPhan_QuanHe_GiaTriDieuKien", "");
       // $("#tblInput_HocPhan_QuanHe tbody").html("");
    },

    rewrite_QuanHeTuongTuong: function () {
        var me = this;
        edu.util.viewValById("dropEdit_KhoaDaoTao", "");
        edu.util.viewValById("dropEdit_ChuongTrinhDaoTao", "");
        edu.util.viewValById("dropEdit_HocPhan", "");
        edu.util.viewValById("txtNhom_HPTD", "");
    },
    rewrite_HocPhan_BaiHoc: function () {
        var me = this;
        edu.util.viewValById("txtHocPhan_BaiHoc_TenBai", "");
        edu.util.viewValById("txtHocPhan_BaiHoc_KyHieu", "");
        edu.util.viewValById("txtHocPhan_BaiHoc_SoTiet", "");
        edu.util.viewValById("txtHocPhan_BaiHoc_NoiDung", "");
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    open_modal: function () {
        $("#myModal_ChiTietLop").modal("show");
    },
    toggle_chuongtrinh: function () {
        edu.util.toggle_overide("zone-content", "zone_chuongtrinh");
    },
    toggle_chuongtrinhhocphan: function () {
        var me = this;
        edu.util.toggle_overide("zone-content", "zone_chuongtrinhhocphan");
        me.getList_HocPhan_ChuongTrinh();

    },
    toggle_edithocphan: function () {
        var me = this;
        edu.util.toggle_overide("zone-content", "zone_edithocphan");
        me.strHocPhan_Id = '';
        me.strHocPhan_ChuongTrinh_Id = '';
        edu.util.viewValById("txtHocPhan_MaHocPhan", '');
        edu.util.viewValById("txtHocPhan_TenHocPhan", '');
        edu.util.viewValById("txtHocPhan_SoTinHocPhan", '');
        edu.util.viewValById("txtHocPhan_SoTinHocPhi", '');
        edu.util.viewValById("dropHocPhan_LaMonTinhDiem", '');
        edu.util.viewValById("dropHocPhan_QuanHe_LoaiQuanHe", '');
        edu.util.viewValById("dropHocPhan_QuanHe_HocPhan", '');
        edu.util.viewValById("txtHocPhan_QuanHe_XauDieuKien", '');
        edu.util.viewValById("dropEdit_KhoaDaoTao", '');
        edu.util.viewValById("dropEdit_ChuongTrinhDaoTao", '');
        edu.util.viewValById("dropEdit_HocPhan", '');
        $("#tblHocPhan_PhanBo tbody").html("");
        for (var i = 0; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.ChuongTrinhHocPhan.genHTML_PhanBo(id, "");
        }
        me.rewrite_QuanHeHocPhan();
        me.rewrite_QuanHeTuongTuong();
        me.rewrite_HocPhan_BaiHoc();
    },
    toggle_selecthocphan: function () {
        var me = this;
        me.getList_ChuongTrinhDaoTao_OnSelect();
        me.expectSameData("zoneTongHocPhan", "zoneHocPhan_Selected");
        edu.util.toggle_overide("zone-content", "zone_inputhocphan");
    },
    toggle_selecthocphan_khoibatbuoc: function () {
        var me = this;
       
        me.strKhoiBatBuoc_Id = "";
        edu.util.toggle_overide("zone-content", "zone_inputhocphan_khoibatbuoc");
        me.getList_HocPhanSelect();
        //me.strHocPhan_ChuongTrinh_Id = strId;
        edu.util.viewValById("txtHocPhan_KBB_Ten", "");
        edu.util.viewValById("dropHocPhan_KBB_KhoiCha", "");
        edu.util.viewValById("txtHocPhan_KBB_KyHieu", "");
        edu.util.viewValById("dropPhanLoaiKhoi_KBB", "");
        //$("#zoneHocPhan_Selected_KBB").html("");
    },

    toggle_selecthocphan_khoituchondon: function () {
        var me = this;
        me.strKhoiTuChonDon_Id = "";
        edu.util.toggle_overide("zone-content", "zone_inputhocphan_khoituchondon");
        me.getList_HocPhanSelect();
        edu.util.viewValById("txtHocPhan_KTCD_Ten", "");
        edu.util.viewValById("dropHocPhan_KTCD_KhoiCha", "");
        edu.util.viewValById("txtHocPhan_KTCD_KyHieu", "");
        edu.util.viewValById("txtHocPhan_KTCD_SoHocPhan", "");
        edu.util.viewValById("txtHocPhan_KTCD_SoTin", "");
        edu.util.viewValById("dropPhanLoaiKhoi_KTCD", "");
        //edu.util.viewValById("txtHocPhan_KTCD_Ten", "");
        //edu.util.viewValById("txtHocPhan_KTCD_SoHocPhan", "");
        //$("#zoneHocPhan_Selected_KTCD").html("");
    },
    toggle_dinhhuong: function () {
        var me = this;
        me.strDinhHuong_Id = "";
        edu.util.toggle_overide("zone-content", "zone_input_dinhhuong");
        //me.getList_HocPhanSelect();
        edu.util.viewValById("txtTenDinhHuong", "");
        edu.util.viewValById("txtMaDinhHuong", "");
        edu.util.viewValById("dropCheDoDinhHuong", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        me.getList_KhoiKienThuc_Gan();
    },
    khoibatbuoc_dragstart_handler: function (ev) {
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/html", ev.target.id);
        ev.dataTransfer.dropEffect = "";
    },
    dragover_handler: function (ev) {
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move";
    },
    drop_handler: function (ev) {
        ev.preventDefault();
        // Get the id of the target and add the moved element to the target's DOM
        var data = ev.dataTransfer.getData("text/html");
        if (ev.target.tagName == "UL") {
            ev.target.appendChild(document.getElementById(data));
        }
        else {
            var point = ev.target;
            while (point.tagName != "LI") {
                point = point.parentNode;
                if (point.tagName != "A" && point.tagName != "SPAN" && point.tagName != "I") break;
            }
            point.parentNode.insertBefore(document.getElementById(data), point);
        }
        ev.target.style.background = "";
        var point = document.getElementById('btnSelect_' + data.replace('drag_', ''));
        if ($(point).hasClass("btn-primary")) {
            $(point).html('<i class="fa fa-backward"></i> <span class="lang" key="lb_luu">Bỏ Chọn</span>');
            point.classList.remove("btn-primary");
            point.classList.add("btn-danger");
        }
    },
    drop_KBB_handler: function (ev) {
        ev.preventDefault();
        // Get the id of the target and add the moved element to the target's DOM
        var data = ev.dataTransfer.getData("text/html");
        if (ev.target.tagName == "UL") {
            ev.target.appendChild(document.getElementById(data));
        }
        else {
            var point = ev.target;
            while (point.tagName != "LI") {
                point = point.parentNode;
                if (point.tagName != "A" && point.tagName != "SPAN" && point.tagName != "I") break;
            }
            point.parentNode.insertBefore(document.getElementById(data), point);
        }
        ev.target.style.background = "";
        var point = document.getElementById('btnSelect_KBB_' + data.replace('drag_KBB_', ''));
        if ($(point).hasClass("btn-primary")) {
            $(point).html('<i class="fa fa-backward"></i> <span class="lang" key="lb_luu">Bỏ Chọn</span>');
            point.classList.remove("btn-primary");
            point.classList.add("btn-danger");
        }
    },
    drop_KTCD_handler: function (ev) {
        ev.preventDefault();
        // Get the id of the target and add the moved element to the target's DOM
        var data = ev.dataTransfer.getData("text/html");
        if (ev.target.tagName == "UL") {
            ev.target.appendChild(document.getElementById(data));
        }
        else {
            var point = ev.target;
            while (point.tagName != "LI") {
                point = point.parentNode;
                if (point.tagName != "A" && point.tagName != "SPAN" && point.tagName != "I") break;
            }
            point.parentNode.insertBefore(document.getElementById(data), point);
        }
        ev.target.style.background = "";
        var point = document.getElementById('btnSelect_KTCD_' + data.replace('drag_KTCD_', ''));
        if ($(point).hasClass("btn-primary")) {
            $(point).html('<i class="fa fa-backward"></i> <span class="lang" key="lb_luu">Bỏ Chọn</span>');
            point.classList.remove("btn-primary");
            point.classList.add("btn-danger");
        }
    },
    expectSameData: function (strZoneA, strZoneB) {
        $("#" + strZoneB + " .btnSelectHocPhan").each(function () {
            $("#" + strZoneA + " #" + this.id).parent().parent().remove();
        })
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ToChucChuongTrinh/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strDaoTao_N_CN_Id': "",
            'strDaoTao_KhoaQuanLy_Id': "",
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strDaoTao_ToChucCT_Cha_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 240000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtChuongTrinh = dtResult;
                    }
                    me.genBox_ChuongTrinh(dtResult, iPager);
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
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    genBox_ChuongTrinh: function (data, iPager) {
        var me = this;
        var html = '';
        

        var jsonForm = {
            strTable_Id: "tblChuongTrinh",
            aaData: data,
            
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TENCHUONGTRINH"
                },
                {
                    "mDataProp": "MACHUONGTRINH"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_N_CN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewCT" id="' + aData.ID + '" title="Sửa"><i class="fa fa-eye color-active"></i></a></span>';
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
    },
    viewEdit_ChuongTrinh: function (data) {
        var me = main_doc.ChuongTrinhHocPhan;
        edu.util.viewHTMLById("lblNoiDungChuongTrinh", data[0].TENCHUONGTRINH);
        edu.util.viewHTMLById("lblInputHocPhan", data[0].TENCHUONGTRINH);
        edu.util.viewHTMLById("lblInputHocPhan", data[0].TENCHUONGTRINH);
        $(".lblChuongTrinh").html(data[0].TENCHUONGTRINH)
        me.getList_HocPhan_ChuongTrinh();
        me.getList_KhoiBatBuoc();
        me.getList_KhoiTuChonDon();
        me.getList_QuanHeHocPhan();

        me.getList_DinhHuong();

        //var ilength = window.innerHeight - $("#tblHocPhan").offset().top - 267;
        //$("#tblHocPhan").parent().attr("style", "height: " + ilength + "px; overflow-y: scroll;");
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> Hoc phan
    --Author: duyentt
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa_SelectHocPhan"),
            'strDaoTao_MonHoc_Id': "",
            'strThuocBoMon_Id': "",
            'strThuocTinhHocPhan_Id': "",
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
                        me.dtHocPhan = dtResult;
                    }
                    me.genTable_HocPhan(dtResult, iPager);
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
    genTable_HocPhan: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_' + data[i].ID + '" name="" draggable="true" ondragstart="main_doc.ChuongTrinhHocPhan.khoibatbuoc_dragstart_handler(event);">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].MA) + " - " + edu.util.returnEmpty(data[i].HOCTRINHAPDUNGHOCTAP) + "(" + edu.util.returnEmpty(data[i].TONGSOTIETPHANBO) + ") - " + edu.util.returnEmpty(data[i].TEN)  + '</span>';
            row += '<span class="submit btn btn-primary pull-right btnSelectHocPhan" id="btnSelect_' + data[i].ID + '"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneTongHocPhan").html(row);
        /*III. Callback*/
    },

    getList_HocPhanDanhMuc: function (strTuKhoa) {
        var me = this;
        strTuKhoa ? strTuKhoa : edu.util.getValById('txtSearch_TuKhoa_SelectHocPhan')
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDSKS_DaoTao_HocPhan_N',
            'type': 'GET',
            'strTuKhoa': strTuKhoa,
            'strDaoTao_MonHoc_Id': edu.util.getValById('dropAAAA'),
            'strThuocBoMon_Id': edu.util.getValById('dropAAAA'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
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
                    me.genTable_HocPhan_ChuongTrinh_OnSelect(dtResult, iPager);
                    me.genTable_HocPhan_ChuongTrinh_KTCD_OnSelect(dtResult, iPager);
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
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> Hoc phan chuong trinh
    --Author: duyentt
    -------------------------------------------*/

    save_HocPhan_ChuongTrinh_New: function (strHocPhan_Id, iThuTu) {
        var me = this;
        var obj_notify = {};
        var dHocTrinh_HocTap = 0;
        var dHocTrinh_TinhTien = 0;
        var dLaMonTinhDiem = 0;
        var objHocPhan = edu.util.objGetDataInData(strHocPhan_Id, me.dtHocPhan, "ID");
        if (objHocPhan.length > 0) {
            dHocTrinh_HocTap = objHocPhan[0].HOCTRINH;
            dHocTrinh_TinhTien = objHocPhan[0].HOCTRINH;
            dLaMonTinhDiem = objHocPhan[0].LAMONTINHDIEM;
        }

        //--Edit
        var obj_save = {
            'action': 'KHCT_HocPhan_ChuongTrinh/ThemMoi',
            

            'strId': '',
            'dHocTrinh_HocTap': dHocTrinh_HocTap,
            'dHocTrinh_TinhTien': dHocTrinh_TinhTien,
            'dLaMonTinhDiem': dLaMonTinhDiem,
            'strDaoTao_ThoiGian_KH_Id': '',
            'strDaoTao_ThoiGian_TT_Id': '',
            'strThuocTinhHocPhan_Id': '',
            'strPhanCongPhamViDamNhiem_Id': '',
            'strDaoTao_HocPhan_Id': strHocPhan_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'iThuTu': iThuTu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Id)) {
                    edu.system.alert('Thêm mới thành công!');
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_HocPhan_ChuongTrinh_Old: function (strHocPhan_ChuongTrinh_Id, iThuTu) {
        var me = this;
        var obj_notify = {};
        var objHocPhan_ChuongTrinh = edu.util.objGetDataInData(strHocPhan_ChuongTrinh_Id, me.dtHocPhan_ChuongTrinh, "ID");
        //--Edit
        var obj_save = {
            'action': 'KHCT_HocPhan_ChuongTrinh/CapNhat',
            

            'strId': objHocPhan_ChuongTrinh[0].ID,
            'dHocTrinh_HocTap': objHocPhan_ChuongTrinh[0].HOCTRINHAPDUNGHOCTAP,
            'dHocTrinh_TinhTien': objHocPhan_ChuongTrinh[0].HOCTRINHAPDUNGTINHHOCPHI,
            'dLaMonTinhDiem': objHocPhan_ChuongTrinh[0].LAMONTINHDIEMTHEOCHUONGTRINH,
            'strDaoTao_ThoiGian_KH_Id': objHocPhan_ChuongTrinh[0].DAOTAO_THOIGIAN_KEHOACH_ID,
            'strDaoTao_ThoiGian_TT_Id': objHocPhan_ChuongTrinh[0].DAOTAO_THOIGIAN_THUCTE_ID,
            'strThuocTinhHocPhan_Id': objHocPhan_ChuongTrinh[0].THUOCTINHHOCPHAN_ID,
            'strPhanCongPhamViDamNhiem_Id': objHocPhan_ChuongTrinh[0].PHANCONGPHAMVIDAMNHIEM_ID,
            'strDaoTao_HocPhan_Id': objHocPhan_ChuongTrinh[0].DAOTAO_HOCPHAN_ID,
            'strDaoTao_ChuongTrinh_Id': objHocPhan_ChuongTrinh[0].DAOTAO_TOCHUCCHUONGTRINH_ID,
            'dThuTu': iThuTu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                edu.system.alert('Cập nhật thành công!');
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_HocPhan_ChuongTrinh_All: function () {
        var me = this;
        var obj_notify = {};
        var objHocPhan_ChuongTrinh = edu.util.objGetDataInData(me.strHocPhan_ChuongTrinh_Id, me.dtHocPhan_ChuongTrinh, "ID");
        //--Edit
        var obj_save = {
            'action': 'KHCT_HocPhan_ChuongTrinh/CapNhat',
            

            'strId': objHocPhan_ChuongTrinh[0].ID,
            'dHocTrinh_HocTap': edu.util.getValById("txtHocPhan_SoTinHocPhan"),
            'dHocTrinh_TinhTien': edu.util.getValById("txtHocPhan_SoTinHocPhi"),
            'dLaMonTinhDiem': edu.util.getValById("dropHocPhan_LaMonTinhDiem"),
            'strDaoTao_ThoiGian_KH_Id': edu.util.getValCombo("dropHocPhan_HocKyDuKien"),
            'strDaoTao_ThoiGian_TT_Id': edu.util.getValCombo("dropHocPhan_HocKyThucTe"),
            //'strDaoTao_ThoiGian_KH_Id': objHocPhan_ChuongTrinh[0].DAOTAO_THOIGIAN_KEHOACH_ID,
            //'strDaoTao_ThoiGian_TT_Id': objHocPhan_ChuongTrinh[0].DAOTAO_THOIGIAN_THUCTE_ID,
            //'strThuocTinhHocPhan_Id': objHocPhan_ChuongTrinh[0].THUOCTINHHOCPHAN_ID,
            'strPhanCongPhamViDamNhiem_Id': edu.util.getValById("dropHocPhan_PhamViDamNhiem"),
            'strDaoTao_HocPhan_Id': objHocPhan_ChuongTrinh[0].DAOTAO_HOCPHAN_ID,
            'strDaoTao_ChuongTrinh_Id': objHocPhan_ChuongTrinh[0].DAOTAO_TOCHUCCHUONGTRINH_ID,
            'dThuTu': edu.util.getValById("txtHocPhan_ThuTu"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropHocPhan_ThuocTinh"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                console.log(1111111111);
                var strHocPhan_Id = data.Id;
                edu.system.alert(objHocPhan_ChuongTrinh[0].DAOTAO_HOCPHAN_TEN + ': Cập nhật thành công!');
                $("#tblHocPhan_PhanBo tbody tr").each(function () {
                    var strPhanBo_Id = this.id.replace(/rm_row/g, '');
                    me.save_HocPhan_PhanBo(strPhanBo_Id, strHocPhan_Id);
                });
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_ChuongTrinh/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_ThoiGian_KH_Id': edu.util.getValById("dropSearch_HocKyDuKien"),
            'strDaoTao_ThoiGian_TT_Id': "",
            'strThuocTinhHocPhan_Id': "",
            'strPhanCongPhamViDamNhiem_Id': "",
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtHocPhan_ChuongTrinh = dtResult;
                    }
                    me.genTable_HocPhan_ChuongTrinh_Select(dtResult, iPager);
                    me.genTable_HocPhan_ChuongTrinh(dtResult, iPager);
                    me.genTable_HocPhan_ChuongTrinhThuTu(dtResult, iPager);
                    //me.genTable_HocPhan_ChuongTrinh_OnSelect(dtResult);
                    //me.genTable_HocPhan_ChuongTrinh_KTCD_OnSelect(dtResult);
                    me.genCombo_HocPhan_ChuongTrinh(dtResult);
                    me.getList_ThoiGianDaoTao();
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
    getList_HocPhan_ChuongTrinh_OnSearch: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_ChuongTrinh/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa_SelectHocPhan"),
            'strDaoTao_ThoiGian_KH_Id': '',
            'strDaoTao_ThoiGian_TT_Id': "",
            'strThuocTinhHocPhan_Id': "",
            'strPhanCongPhamViDamNhiem_Id': "",
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById("dropSearchHocPhan_ChuongTrinh"),
            'pageIndex': 1,
            'pageSize': 100000000
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
                    me.genTable_HocPhan_OnSearch(dtResult);
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
    getDetail_HocPhan_ChuongTrinh: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtHocPhan_ChuongTrinh, "ID");
        me.viewEdit_HocPhan_ChuongTrinh(data);
    },
    delete_HocPhan_ChuongTrinh: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HocPhan_ChuongTrinh/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
                me.getList_HocPhan_ChuongTrinh();
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete.action + ": " + JSON.stringify(er),
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


    save_HocPhan_ThuTu: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HocPhan_ChuongTrinh/Sua_DaoTao_HocPhan_CT_ThuTu',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'iThuTu': parseInt(edu.util.getValById('inputThuTu_' + strId)),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    //me.getList_HocPhan_BaiHoc();
                    //me.rewrite_HocPhan_BaiHoc();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan_ChuongTrinh();
                    $("#myModalThuTu").modal("hide");
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB QuanHeHocPhan
    --ULR:  Modules
    -------------------------------------------*/
    save_QuanHeHocPhan: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_QuanHeHocPhan/ThemMoi',
            

            'strId': "",
            'strLoaiQuanHe_Id': edu.util.getValById("dropHocPhan_QuanHe_LoaiQuanHe"),
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDaoTao_HocPhan_QuanHe_Id': edu.util.getValById("dropHocPhan_QuanHe_HocPhan"),
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strToanTu_Id': edu.util.getValById("dropHocPhan_QuanHe_ToanTu"),
            'strMucDieuKien_Id': edu.util.getValById("dropHocPhan_QuanHe_Muc"),
            'strGiaTriDieuKien': edu.util.getValById("txtHocPhan_QuanHe_GiaTriDieuKien"),
            'iThuTu': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thêm mới thành công!");
                    me.getList_QuanHeHocPhan();
                    me.rewrite_QuanHeHocPhan();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QuanHeHocPhan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_QuanHeHocPhan/LayDanhSach',
            
            'strTuKhoa': '',
            'strLoaiQuanHe_Id': '',
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_HocPhan_QuanHe_Id': '',
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //
        

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanHeHocPhan(dtReRult);
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
    delete_QuanHeHocPhan: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_QuanHeHocPhan/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_QuanHeHocPhan();
                }
                else {
                    edu.system.alert(obj_delete.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_delete.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_QuanHeHocPhan: function (data) {
        var me = this;
        $("#tblInput_HocPhan_QuanHe tbody").html("");
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<tr>';
            row += '<td>';
            row += 'Loại quan hệ:<span class="title-colon"></span>';
            row += '</td>';
            row += '<td>';
            row += data[i].LOAIQUANHE_TEN;
            row += '</td>';
            row += '<td>';
            row += 'Học phần:<span class="title-colon"></span>';
            row += '</td>';
            row += '<td>';
            row += data[i].DAOTAO_HOCPHAN_QUANHE_TEN + " - " + data[i].DAOTAO_HOCPHAN_QUANHE_MA;
            row += '</td>';
            row += '<td>';
            row += 'Mức đk:<span class="title-colon"></span>';
            row += '</td>';
            row += '<td>';
            row += data[i].MUCDIEUKIEN_TEN;
            row += '</td>';
            row += '<td>';
            row += 'Xâu điều kiện:<span class="title-colon"></span>';
            row += '</td>';
            row += '<td>';
            row += data[i].TOANTU_TEN + ' ' + data[i].GIATRIDIEUKIEN;
            row += '</td>';
            row += '<td class="td-fixed td-center">';
            row += '<a id="' + data[i].ID + '" class="btnDeletePoiter poiter pull-right">';
            row += '<i class="fa fa-trash"></i>';
            row += '</a>';
            row += '</td>';
            row += '<td class="td-fixed td-center">';
            row += '<input type="checkbox" id="checkX' + data[i].ID + '"/>';
            row += '</a>';
            row += '</td>';
            row += '</tr>';
        }
        $("#tblInput_HocPhan_QuanHe tbody").append(row);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HocPhan_baiHoc
    --ULR:  Modules
    -------------------------------------------*/
    save_HocPhan_BaiHoc: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_BaiHoc/ThemMoi',
            

            'strId': "",
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strNoiDung': edu.util.getValById("txtHocPhan_BaiHoc_NoiDung"),
            'strTenBai': edu.util.getValById("txtHocPhan_BaiHoc_TenBai"),
            'strKyHieu': edu.util.getValById("txtHocPhan_BaiHoc_KyHieu"),
            'dSoTiet': edu.util.getValById("txtHocPhan_BaiHoc_SoTiet"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thêm mới thành công!");
                    me.getList_HocPhan_BaiHoc();
                    me.rewrite_HocPhan_BaiHoc();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan_BaiHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_BaiHoc/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_HocPhan_BaiHoc(dtReRult);
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
    delete_HocPhan_BaiHoc: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_BaiHoc/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HocPhan_BaiHoc();
                }
                else {
                    edu.system.alert(obj_delete.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_delete.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HocPhan_BaiHoc: function (data) {
        var me = this;
        $("#tblInput_HocPhan_BaiHoc tbody").html("");
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<tr>';
            row += '<td>';
            row += 'Tên bài<span class="title-colon">:</span>';
            row += '</td>';
            row += '<td>';
            row += data[i].TENBAI;
            row += '</td>';
            row += '<td>';
            row += 'Ký hiệu<span class="title-colon">:</span>';
            row += '</td>';
            row += '<td>';
            row += data[i].KYHIEUBAI;
            row += '</td>';
            row += '<td>';
            row += 'Số tiết<span class="title-colon">:</span>';
            row += '</td>';
            row += '<td>';
            row += data[i].SOTIET;
            row += '</td>';
            row += '<td>';
            row += 'Nội dung<span class="title-colon">:</span>';
            row += '</td>';
            row += '<td>';
            row += data[i].NOIDUNG ;
            row += '</td>';
            row += '<td class="td-fixed td-center">';
            row += '<a id="' + data[i].ID + '" class="btnDeletePoiter poiter pull-right">';
            row += '<i class="fa fa-trash"></i>';
            row += '</a>';
            row += '</td>';
            row += '</tr>';
        }
        $("#tblInput_HocPhan_BaiHoc tbody").append(row);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kinh phí
    --ULR:  Modules
    -------------------------------------------*/

    /*------------------------------------------
    --Discription: [3] AccessDB DonViHopTac
    --ULR:  Modules
    -------------------------------------------*/
    save_QuanHeTuongDuong: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/Them_DaoTao_HocPhanTuongDuong',
            

            'strId': "",
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDaoTao_HocPhan_TD_Id': edu.util.getValById("dropEdit_HocPhan"),
            'strDaoTao_ToChucCT_TD_Id': edu.util.getValById("dropEdit_ChuongTrinhDaoTao"),
            'strNhom': edu.util.getValById('txtNhom_HPTD'),
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thêm mới thành công!");
                    me.getList_QuanHeTuongDuong();
                    me.rewrite_QuanHeTuongTuong();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_QuanHeTuongDuong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_HocPhanTD',
            
            'strTuKhoa': '',
            'strDaoTao_HocPhan_TD_Id': '',
            'strDaoTao_ToChucCT_TD_Id': '',
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanHeTuongDuong(dtReRult);
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
    delete_QuanHeTuongDuong: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_ThongTin/Xoa_DaoTao_HocPhanTuongDuong',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_QuanHeTuongDuong();
                }
                else {
                    edu.system.alert(obj_delete.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_delete.action + " (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [4] GenHTML Kinh phí
    --ULR:  Modules
    -------------------------------------------*/
    genTable_QuanHeTuongDuong: function (data) {
        var me = this;
        $("#tblInput_HocPhan_QuanHeTT tbody").html("");
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<tr>';
            row += '<td>';
            row += 'Khóa đào tạo<span class="title-colon">:</span>';
            row += '</td>';
            row += '<td>';
            row += data[i].DAOTAO_KHOADAOTAO_TD_TEN;
            row += '</td>';
            row += '<td>';
            row += 'Chương trình đào tạo<span class="title-colon">:</span>';
            row += '</td>';
            row += '<td>';
            row += data[i].DAOTAO_CHUONGTRINH_TD_TEN;
            row += '</td>';
            row += '<td>';
            row += 'Học phần tương đương<span class="title-colon">:</span>';
            row += '</td>';
            row += '<td>';
            row += data[i].DAOTAO_HOCPHAN_TD_TEN;
            row += '</td>';
            row += '<td>';
            row += 'Nhóm<span class="title-colon">:</span>';
            row += '</td>';
            row += '<td>';
            row += data[i].NHOM;
            row += '</td>';
            row += '<td class="td-fixed td-center">';
            row += '<a id="' + data[i].ID + '" class="btnDeletePoiter poiter">';
            row += '<i class="fa fa-trash"></i>';
            row += '</a>';
            row += '</td>';
            row += '</tr>';
        }
        $("#tblInput_HocPhan_QuanHeTT tbody").append(row);
    },

    getList_HocPhanSelect: function (strTuKhoa) {
        var me = this;
        strTuKhoa ? strTuKhoa : edu.util.getValById('txtSearch_TuKhoa_SelectHocPhan');
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_ChuongTrinh/LayDSKS_DaoTao_HocPhan_CT_N',
            'type': 'GET',
            'strTuKhoa': strTuKhoa,
            'strDaoTao_ThoiGian_KH_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGian_TT_Id': edu.util.getValById('dropAAAA'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strPhanCongPhamViDamNhiem_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genTable_HocPhan_ChuongTrinh_OnSelect(dtResult, iPager);
                    me.genTable_HocPhan_ChuongTrinh_KTCD_OnSelect(dtResult, iPager);
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
    getList_HocPhan_SoTiet: function (strDaoTao_ToChucCT_Id, strDaoTao_HocPhan_Id, strId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_TietHoc/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strDaoTao_ToChucCT_Id': strDaoTao_ToChucCT_Id,
            'strLoaiPhanBo_Id': '',
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        $("#div_" + e.DAOTAO_HOCPHAN_ID + "_" + e.LOAIPHANBO_ID).html(edu.util.returnEmpty(e.SOTIET));
                    });
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
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    viewEdit_HocPhan_ChuongTrinh: function (data) {
        var me = this;
        me.strHocPhan_Id = data[0].DAOTAO_HOCPHAN_ID;
        edu.util.viewValById("txtHocPhan_MaHocPhan", data[0].DAOTAO_HOCPHAN_MA);
        edu.util.viewValById("txtHocPhan_TenHocPhan", data[0].DAOTAO_HOCPHAN_TEN);
        edu.util.viewValById("txtHocPhan_SoTinHocPhan", data[0].HOCTRINHAPDUNGHOCTAP);
        edu.util.viewValById("txtHocPhan_SoTinHocPhi", data[0].HOCTRINHAPDUNGTINHHOCPHI);
        edu.util.viewValById("dropHocPhan_LaMonTinhDiem", data[0].LAMONTINHDIEMTHEOCHUONGTRINH);
        edu.util.viewValById("dropHocPhan_HocKyDuKien", data[0].DAOTAO_THOIGIAN_KEHOACH_ID && data[0].DAOTAO_THOIGIAN_KEHOACH_ID.indexOf(",") != -1 ? data[0].DAOTAO_THOIGIAN_KEHOACH_ID.split(",") : [data[0].DAOTAO_THOIGIAN_KEHOACH_ID]);
        edu.util.viewValById("dropHocPhan_HocKyThucTe", data[0].DAOTAO_THOIGIAN_THUCTE_ID && data[0].DAOTAO_THOIGIAN_THUCTE_ID.indexOf(",") != -1  ? data[0].DAOTAO_THOIGIAN_THUCTE_ID.split(",") : [data[0].DAOTAO_THOIGIAN_THUCTE_ID]);
        edu.util.viewValById("dropHocPhan_PhamViDamNhiem", data[0].PHANCONGPHAMVIDAMNHIEM_ID);
        edu.util.viewValById("dropHocPhan_ThuocTinh", data[0].THUOCTINHHOCPHAN_ID);
        edu.util.viewValById("txtHocPhan_ThuTu", data[0].THUTU);
        me.getList_QuanHeHocPhan();
        me.getList_QuanHeTuongDuong();
        me.getList_HocPhan_BaiHoc();
        me.getList_HocPhan_PhanBo();
    },
    genTable_HocPhan_ChuongTrinh_Select: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_' + data[i].DAOTAO_HOCPHAN_ID + '" name="' + edu.util.returnEmpty(data[i].ID) + '" draggable="true" ondragstart="main_doc.ChuongTrinhHocPhan.khoibatbuoc_dragstart_handler(event);">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(data[i].HOCTRINHAPDUNGHOCTAP) + "(" + edu.util.returnEmpty(data[i].TONGSOTIETPHANBO) + ") - " + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN) + '</span>';
            row += '<span class="submit btn btn-danger pull-right btnSelectHocPhan" name="' + edu.util.returnEmpty(data[i].ID) + '" id="btnSelect_' + data[i].DAOTAO_HOCPHAN_ID + '"><i class="fa fa-backward"></i> <span class="lang" key="lb_luu"> Bỏ Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneHocPhan_Selected").html(row);
        /*III. Callback*/
    },
    genTable_HocPhan_ChuongTrinh: function (data, iPager) {
        var me = this;
        $("#tblHocPhan thead").html(me.strHead);
        var arrDoiTuong = me.dtPhanBo;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#tblHocPhan thead tr:eq(0)").append('<th class="td-center">' + arrDoiTuong[j].MA + '</th>');
        }
        $("#tblHocPhan thead tr:eq(0)").append('<th style="width: 100px" class="td-fixed"><span class="lang" key="">Chi tiết</span></th>');
        $("#tblHocPhan thead tr:eq(0)").append('<th style="width: 100px" class="td-fixed"><span class="lang" key="">Học tập</span></th>');
        $("#tblHocPhan thead tr:eq(0)").append('<th class="td-center td-fixed"><input type="checkbox" class="chkSystemSelectAll"></th>');

        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4],
            },
            aoColumns: [{
                "mDataProp": "DAOTAO_HOCPHAN_MA"
            },
            {
                "mDataProp": "DAOTAO_HOCPHAN_TEN"
            },
            {
                "mDataProp": "HOCTRINHAPDUNGHOCTAP"
            },
            {
                "mDataProp": "HOCTRINHAPDUNGTINHHOCPHI"
            },
            {
                //"mDataProp": "DAOTAO_THOIGIAN_KEHOACH",
                "mRender": function (nRow, aData) {
                    let temp = aData.DAOTAO_THOIGIAN_KEHOACH ? aData.DAOTAO_THOIGIAN_KEHOACH : "Sửa";
                    return '<span><a class="btn btn-default btnEditHocKy" id="' + aData.ID + '" title="Sửa">' + temp + '</a></span>';
                }
            },
            {
                "mDataProp": "DAOTAO_THOIGIAN_THUCTE"
            }
            ]
        };
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<div id="div_' + aData.DAOTAO_HOCPHAN_ID + '_' + main_doc.ChuongTrinhHocPhan.dtPhanBo[iThuTu].ID + '" />';
                    }
                }
            );
            jsonForm.colPos.center.push(j + 7);
        }
        jsonForm.colPos.center.push(arrDoiTuong.length + 7);
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                }
            }
        );
        jsonForm.colPos.center.push(arrDoiTuong.length + 8);
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                }
            }
        );
        jsonForm.colPos.center.push(arrDoiTuong.length + 9);
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        //Hiển thị tổng số học phần:
        $("#iTongSoHocPhan").html(data.length);
        var iTongSoTinChi = 0;
        var iTongSoTinChiHocPhi = 0;
        for (var i = 0; i < data.length; i++) {
            iTongSoTinChi += data[i].HOCTRINHAPDUNGHOCTAP;
            iTongSoTinChiHocPhi += data[i].HOCTRINHAPDUNGTINHHOCPHI;
        }
        $("#iTongSoTinChi").html(iTongSoTinChi);
        $("#iTongSoTinChiHocPhi").html(iTongSoTinChiHocPhi);
        if (data.length > 0) {
            $("#iTongSoTinChiKhoi").html(data[0].TONGSOTINCHITHEOKHOIKT);
            me.getList_HocPhan_SoTiet(data[0].DAOTAO_TOCHUCCHUONGTRINH_ID, "", "");
        }
        //for (var i = 0; i < data.length; i++) {
        //    me.getList_HocPhan_SoTiet(data[i].DAOTAO_TOCHUCCHUONGTRINH_ID, data[i].DAOTAO_HOCPHAN_ID, data[i].ID);
        //}
        /*III. Callback*/
    },
    genTable_HocPhan_ChuongTrinhThuTu: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThuTuHocPhan",
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4],
            },
            aoColumns: [{
                "mDataProp": "DAOTAO_HOCPHAN_MA"
            },
            {
                "mDataProp": "DAOTAO_HOCPHAN_TEN"
            },
            {
                "mDataProp": "HOCTRINHAPDUNGHOCTAP"
            },
            {
                "mDataProp": "THUOCTINHHOCPHAN_TEN"
            },
            {
                "mDataProp": "LAMONTINHDIEMTHEOCHUONGTRINH"
                },
                {
                    "mDataProp": "THOIGIANDUKIEN"
                },
                {
                    "mData": "ThuTu",
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control updatethutu" value="' + edu.util.returnEmpty(aData.THUTU) + '" name="' + edu.util.returnEmpty(aData.THUTU) + '" id="inputThuTu_' + aData.ID + '" />';
                        //return '<span id="lblThuTu_' + aData.ID + '" class="updatethutu">' + edu.util.returnEmpty(aData.THUTU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.move_ThroughInTable(jsonForm.strTable_Id)
        /*III. Callback*/
    },
    genTable_HocPhan_ChuongTrinh_OnSelect: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_KBB_' + data[i].DAOTAO_HOCPHAN_ID + '" name="" draggable="true" ondragstart="main_doc.ChuongTrinhHocPhan.khoibatbuoc_dragstart_handler(event);">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(data[i].HOCTRINHAPDUNGHOCTAP) + "(" + edu.util.returnEmpty(data[i].TONGSOTIETPHANBO) + ") - " + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN) +'</span>';
            row += '<span class="submit btn btn-primary pull-right btnSelectHocPhan" id="btnSelect_KBB_' + data[i].DAOTAO_HOCPHAN_ID + '"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneTongHocPhan_KBB").html(row);
        /*III. Callback*/
    },
    genTable_HocPhan_ChuongTrinh_KTCD_OnSelect: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_KTCD_' + data[i].DAOTAO_HOCPHAN_ID + '" name="" draggable="true" ondragstart="main_doc.ChuongTrinhHocPhan.khoibatbuoc_dragstart_handler(event);">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(data[i].HOCTRINHAPDUNGHOCTAP) + "(" + edu.util.returnEmpty(data[i].TONGSOTIETPHANBO) + ") - " + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN)  +'</span>';
            row += '<span class="submit btn btn-primary pull-right btnSelectHocPhan" id="btnSelect_KTCD_' + data[i].DAOTAO_HOCPHAN_ID + '"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneTongHocPhan_KTCD").html(row);
        /*III. Callback*/
    },
    genCombo_HocPhan_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                name: "TEN",
                mRender: function (nrow, aData) {
                    return aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN;
                }
            },
            renderPlace: ["dropHocPhan_QuanHe_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_HocPhan_OnSearch: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_' + data[i].DAOTAO_HOCPHAN_ID + '" draggable="true" ondragstart="main_doc.ChuongTrinhHocPhan.khoibatbuoc_dragstart_handler(event);">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(data[i].HOCTRINHAPDUNGHOCTAP) + "(" + edu.util.returnEmpty(data[i].TONGSOTIETPHANBO) + ") - " + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN)  +'</span>';
            row += '<span class="submit btn btn-primary pull-right btnSelectHocPhan" id="btnSelect_' + data[i].DAOTAO_HOCPHAN_ID + '"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneTongHocPhan").html(row);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [4]  Access KLCD
    --Author: duyentt
    -------------------------------------------*/
    save_KhoiBatBuoc: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/Them_DaoTao_KhoiBatBuoc',
            

            'strId': '',
            'strTen': edu.util.getValById("txtHocPhan_KBB_Ten"),
            'strKyHieu': edu.util.getValById("txtHocPhan_KBB_KyHieu"),
            'strPhanLoai_Id': edu.util.getValById("dropPhanLoaiKhoi_KBB"),
            'strDaoTao_KhoiBatBuoc_Cha_Id': edu.util.getValById("dropHocPhan_KBB_KhoiCha"),
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'dThuTu': 1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strKhoiBatBuoc_Id != "") {
            obj_save.action = 'KHCT_ThongTin/Sua_DaoTao_KhoiBatBuoc';
            obj_save.strId = me.strKhoiBatBuoc_Id;
            if (me.strKhoiBatBuoc_Id == obj_save.strDaoTao_KhoiBatBuoc_Cha_Id) {
                edu.system.alert("Khối cha không thể chọn chính nó");
                return;
            }
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        me.strKhoiBatBuoc_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    var x = document.getElementById('zoneHocPhan_Selected_KBB').getElementsByTagName('LI');
                    for (var i = 0; i < x.length; i++) {
                        var strHocPhan_ChuongTrinh_KBB_Id = $(x[i]).attr('name');//Dùng để xác định đối tượng này đã lưu chưa
                        var strHocPhan_Id = x[i].id.replace('drag_KBB_', '');
                        me.save_HocPhan_ChuongTrinh_KBB(strHocPhan_ChuongTrinh_KBB_Id, strHocPhan_Id, i);
                    }
                    me.getList_KhoiBatBuoc();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoiBatBuoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_KhoiBatBuoc/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_KhoiBatBuoc_Cha_Id': "",
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
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
                        me.dtKhoibatBuoc = dtResult;
                    }
                    me.loadToTree_KhoiBatBuoc(dtResult, iPager);
                    me.genCombo_KhoiBatBuoc(dtResult);
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
    getDetail_KhoiBatBuoc: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtKhoibatBuoc, "ID");
        me.viewEdit_KhoiBatBuoc(data);
    },
    delete_KhoiBatBuoc: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_KhoiBatBuoc/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KhoiBatBuoc();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    viewEdit_KhoiBatBuoc: function (data) {
        var me = this;
        edu.util.viewValById("txtHocPhan_KBB_Ten", data[0].TEN);
        edu.util.viewValById("dropHocPhan_KBB_KhoiCha", data[0].DAOTAO_KHOIBATBUOC_CHA_ID);
        edu.util.viewValById("txtHocPhan_KBB_KyHieu", data[0].KYHIEU);
        edu.util.viewValById("dropPhanLoaiKhoi_KBB", data[0].PHANLOAI_ID);
        me.strKhoiBatBuoc_Id = data[0].ID;
        me.getList_HocPhan_ChuongTrinh_KBB();
    },
    /*------------------------------------------
    --Discription: [4]  Access Học phần - chương trình - khối bắt buộc
    --Author: duyentt
    -------------------------------------------*/
    save_HocPhan_ChuongTrinh_KBB: function (strId, strHocPhan_Id, iThuTu) {
        var me = this;
        var obj_notify = {};

        //--Edit
        var obj_save = {
            'action': 'KHCT_HocPhan_KhoiBatBuoc/ThemMoi',
            

            'strId': '',
            'strDaoTao_HocPhan_Id': strHocPhan_Id,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_KhoiBatBuoc_Id': me.strKhoiBatBuoc_Id,
            'iThuTu': iThuTu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (strId != "") {
            obj_save.action = 'KHCT_HocPhan_KhoiBatBuoc/CapNhat';
            obj_save.strId = strId;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Id)) {
                    edu.system.alert('Thêm mới thành công!');
                }
                else {
                    if (data.Message == "") {
                        edu.system.alert('Cập nhật thành công!');
                    }
                    else {
                        edu.system.alert(data.Message);
                    }
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan_ChuongTrinh_KBB: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_KhoiBatBuoc/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_KhoiBatBuoc_Id': me.strKhoiBatBuoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000000
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
                    me.genTable_HocPhan_ChuongTrinh_KBB_Select(dtResult, iPager);
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
    delete_HocPhan_ChuongTrinh_KBB: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HocPhan_KhoiBatBuoc/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    genTable_HocPhan_ChuongTrinh_KBB_Select: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_KBB_' + data[i].DAOTAO_HOCPHAN_ID + '" name="' + edu.util.returnEmpty(data[i].ID) + '" draggable="true" ondragstart="main_doc.ChuongTrinhHocPhan.khoibatbuoc_dragstart_handler(event);">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(data[i].HOCTRINHAPDUNGHOCTAP) + "(" + edu.util.returnEmpty(data[i].TONGSOTIETPHANBO) + ") - " + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN)  +'</span>';
            row += '<span class="submit btn btn-danger pull-right btnSelectHocPhan" name="' + edu.util.returnEmpty(data[i].ID) + '" id="btnSelect_KBB_' + data[i].DAOTAO_HOCPHAN_ID + '"><i class="fa fa-backward"></i> <span class="lang" key="lb_luu"> Bỏ Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneHocPhan_Selected_KBB").html(row);
        me.expectSameData("zoneTongHocPhan_KBB", "zoneHocPhan_Selected_KBB");
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    loadToTree_KhoiTuChonDon: function (dtResult, iPager) {
        var me = this;
        console.log(dtResult.length);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_KHOITUCHON_DON_CHA_ID",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_khoituchondon"],
            style: "fa fa-cube color-active"
        };
        edu.system.loadToTreejs_data(obj);
        for (var i = 0; i < dtResult.length; i++) {
            var htmlShow = "Tổng số HP: " + dtResult[i].TONGSOHP + "; \t Tổng số TC: " + dtResult[i].TONGSOTC + ";";
            if (dtResult[i].SOHOCPHANQUYDINH) htmlShow += "\t Số HP bắt buộc: " + dtResult[i].SOHOCPHANQUYDINH + ";"
            if (dtResult[i].SOTINCHIQUYDINH) htmlShow += "\t Số TC bắt buộc: " + dtResult[i].SOTINCHIQUYDINH
            $($("#zone_khoituchondon #" + dtResult[i].ID + " a")[0]).append(" <span style='color: blue'>(  " + htmlShow + ")</span>");
        }
        //2. Action
        $('#zone_khoituchondon').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.toggle_selecthocphan_khoituchondon();
            me.getDetail_KhoiTuChonDon(strNameNode);
            //Kiểm tra xem node này có node con không. Nếu không có sẽ cho xóa
            if (data.node.children.length > 0) {
                document.getElementById("delete_ChuongTrinh_HocPhan_KTCD").style.display = "none";
            }
            else {
                document.getElementById("delete_ChuongTrinh_HocPhan_KTCD").style.display = "";
            }
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
    loadToTree_KhoiBatBuoc: function (dtResult, iPager) {
        var me = this;
        //edu.util.viewHTMLById("lblDanhMucTenBang_Tong", iPager);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_KHOIBATBUOC_CHA_ID",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_khoibatbuoc"],
            style: "fa fa-cube color-active"
        };
        edu.system.loadToTreejs_data(obj);
        for (var i = 0; i < dtResult.length; i++) {
            $($("#zone_khoibatbuoc #" + dtResult[i].ID + " a")[0]).append(" <span style='color: blue'>(Tổng số HP: " + dtResult[i].TONGSOHOCPHAN + "; \t Tổng số TC: " + dtResult[i].TONGSOTINCHI + ")</span>");
        }
        //2. Action
        $('#zone_khoibatbuoc').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            me.toggle_selecthocphan_khoibatbuoc();
            me.getDetail_KhoiBatBuoc(strNameNode);
            //Kiểm tra xem node này có node con không. Nếu không có sẽ cho xóa
            if (data.node.children.length > 0) {
                document.getElementById("delete_ChuongTrinh_HocPhan_KBB").style.display = "none";
            }
            else {
                document.getElementById("delete_ChuongTrinh_HocPhan_KBB").style.display = "";
            }
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
    loadToTree_DinhHuong: function (dtResult, iPager) {
        var me = this;
        console.log(dtResult.length);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_KHOITUCHON_DON_CHA_ID",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_dinhhuong"],
            style: "fa fa-cube color-active"
        };
        edu.system.loadToTreejs_data(obj);
        
        //2. Action
        $('#zone_dinhhuong').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.toggle_dinhhuong();
            me.getDetail_DinhHuong(strNameNode);
            $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
            document.getElementById("delete_DinhHuong").style.display = "";
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
    genCombo_KhoiBatBuoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TEN",
            },
            renderPlace: ["dropHocPhan_KBB_KhoiCha"],
            title: "Chọn khối cha"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [4]  Access KLCD
    --Author: duyentt
    -------------------------------------------*/
    save_KhoiTuChonDon: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/Them_DaoTao_KhoiTuChon_Don',
            

            'strId': '',
            'strTen': edu.util.getValById("txtHocPhan_KTCD_Ten"),
            'strKyHieu': edu.util.getValById("txtHocPhan_KTCD_KyHieu"),
            'strDaoTao_KTuChon_Don_Cha_Id': edu.util.getValById("dropHocPhan_KTCD_KhoiCha"),
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strLoaiLuaChon_Id': edu.util.getValById("dropHocPhan_KTCD_LoaiDonVi"),
            'dDonViLuaChon': edu.util.getValById("txtHocPhan_KTCD_DonVi"),
            'iThuTu': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'dSoHocPhanQuyDinh': edu.util.getValById('txtHocPhan_KTCD_SoHocPhan'),
            'dSoTinChiQuyDinh': edu.util.getValById('txtHocPhan_KTCD_SoTin'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoaiKhoi_KTCD'),
        };
        if (me.strKhoiTuChonDon_Id != "") {
            obj_save.action = 'KHCT_ThongTin/Sua_DaoTao_KhoiTuChon_Don';
            obj_save.strId = me.strKhoiTuChonDon_Id;
            if (me.strKhoiTuChonDon_Id == obj_save.strDaoTao_KTuChon_Don_Cha_Id) {
                edu.system.alert("Khối cha không thể chọn chính nó");
                return;
            }
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        me.strKhoiTuChonDon_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    var x = document.getElementById('zoneHocPhan_Selected_KTCD').getElementsByTagName('LI');
                    for (var i = 0; i < x.length; i++) {
                        var strHocPhan_ChuongTrinh_KTCD_Id = $(x[i]).attr('name');//Dùng để xác định đối tượng này đã lưu chưa
                        var strHocPhan_Id = x[i].id.replace('drag_KTCD_', '');
                        me.save_HocPhan_ChuongTrinh_KTCD(strHocPhan_ChuongTrinh_KTCD_Id, strHocPhan_Id, i);
                    }
                    me.getList_KhoiTuChonDon();
                }
                else {
                    console.log(1111111);
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoiTuChonDon: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_KhoiTuChon_Don/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_KTuChon_Don_Cha_Id': "",
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strLoaiLuaChon_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
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
                        me.dtKhoiTuChonDon = dtResult;
                    }
                    me.loadToTree_KhoiTuChonDon(dtResult, iPager);
                    me.genCombo_KhoiTuChonDon(dtResult);
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
    getDetail_KhoiTuChonDon: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtKhoiTuChonDon, "ID");
        me.viewEdit_KhoiTuChonDon(data);
    },
    delete_KhoiTuChonDon: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_KhoiTuChon_Don/Xoa',
            
            'strIds': Ids,
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
                    me.getList_KhoiTuChonDon();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    viewEdit_KhoiTuChonDon: function (data) {
        var me = this;
        me.strKhoiTuChonDon_Id = data[0].ID;
        edu.util.viewValById("txtHocPhan_KTCD_Ten", data[0].TEN);
        edu.util.viewValById("dropHocPhan_KTCD_KhoiCha", data[0].DAOTAO_KHOITUCHONDON_CHA_ID);
        edu.util.viewValById("txtHocPhan_KTCD_KyHieu", data[0].KYHIEU);
        edu.util.viewValById("dropHocPhan_KTCD_LoaiDonVi", data[0].LOAILUACHON_ID);
        edu.util.viewValById("txtHocPhan_KTCD_DonVi", data[0].DONVILUACHON);
        edu.util.viewValById("txtHocPhan_KTCD_SoHocPhan", data[0].SOHOCPHANQUYDINH);
        edu.util.viewValById("txtHocPhan_KTCD_SoTin", data[0].SOTINCHIQUYDINH);
        edu.util.viewValById("dropPhanLoaiKhoi_KTCD", data[0].PHANLOAI_ID);
        me.getList_HocPhan_ChuongTrinh_KTCD();
    },
    /*------------------------------------------
    --Discription: [4]  Access Học phần - chương trình - khối bắt buộc
    --Author: duyentt
    -------------------------------------------*/
    save_HocPhan_ChuongTrinh_KTCD: function (strId, strHocPhan_Id, iThuTu) {
        var me = this;
        var obj_notify = {};

        //--Edit
        var obj_save = {
            'action': 'KHCT_HocPhan_KhoiTuChon_Don/ThemMoi',
            

            'strId': '',
            'strDaoTao_HocPhan_Id': strHocPhan_Id,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_KTuChon_Don_Id': me.strKhoiTuChonDon_Id,
            'iThuTu': iThuTu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (strId != "") {
            obj_save.action = 'KHCT_HocPhan_KhoiTuChon_Don/CapNhat';
            obj_save.strId = strId;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Id)) {
                    edu.system.alert('Thêm mới thành công!');
                }
                else {
                    if (data.Message == "") {
                        edu.system.alert('Cập nhật thành công!');
                    }
                    else {
                        edu.system.alert(data.Message);
                    }
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan_ChuongTrinh_KTCD: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_KhoiTuChon_Don/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_KTuChon_Don_Id': me.strKhoiTuChonDon_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000000
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
                    me.genTable_HocPhan_ChuongTrinh_KTCD_Select(dtResult, iPager);
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
    delete_HocPhan_ChuongTrinh_KTCD: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HocPhan_KhoiTuChon_Don/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    genTable_HocPhan_ChuongTrinh_KTCD_Select: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_KTCD_' + data[i].DAOTAO_HOCPHAN_ID + '" name="' + edu.util.returnEmpty(data[i].ID) + '" draggable="true" ondragstart="main_doc.ChuongTrinhHocPhan.khoibatbuoc_dragstart_handler(event);">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(data[i].HOCTRINHAPDUNGHOCTAP) + "(" + edu.util.returnEmpty(data[i].TONGSOTIETPHANBO) + ") - " + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN)  +'</span>';
            row += '<span class="submit btn btn-danger pull-right btnSelectHocPhan" name="' + edu.util.returnEmpty(data[i].ID) + '" id="btnSelect_KTCD_' + data[i].DAOTAO_HOCPHAN_ID + '"><i class="fa fa-backward"></i> <span class="lang" key="lb_luu"> Bỏ Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneHocPhan_Selected_KTCD").html(row);
        me.expectSameData("zoneTongHocPhan_KTCD", "zoneHocPhan_Selected_KTCD");
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    genCombo_KhoiTuChonDon: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TEN",
            },
            renderPlace: ["dropHocPhan_KTCD_KhoiCha"],
            title: "Chọn khối cha"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_HeDaoTao(obj, "", "", me.genComBo_HeDaoTao);
    },
    genComBo_HeDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENHEDAOTAO",
            },
            renderPlace: ["dropSearch_HeDaoTao", "dropEdit_HeDaoTao", "dropHeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropHeDaoTao").select2({//Search on modal
            dropdownParent: $('#myModalKeThua .modal-content')
        })
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_KhoaDaoTao(obj, "", "", me.genComBo_KhoaDaoTao);
    },
    genComBo_KhoaDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENKHOA",
            },
            renderPlace: ["dropSearch_KhoaDaoTao", "dropSearchHocPhan_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_KhoaDaoTao_Edit: function () {
        var me = this;
        var obj = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_KhoaDaoTao(obj, "", "", me.genComBo_KhoaDaoTao_Edit);
    },
    genComBo_KhoaDaoTao_Edit: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENKHOA",
            },
            renderPlace: ["dropEdit_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KhoaDaoTao_KeThua: function () {
        var me = this;
        var obj = {
            strHeDaoTao_Id: edu.util.getValById("dropHeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_KhoaDaoTao(obj, "", "", me.genComBo_KhoaDaoTao_KeThua);
    },
    genComBo_KhoaDaoTao_KeThua: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENKHOA",
            },
            renderPlace: ["dropKhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropKhoaDaoTao").select2({//Search on modal
            dropdownParent: $('#myModalKeThua .modal-content')
        })
    },

    getList_ChuongTrinhDaoTao_KeThua: function () {
        var me = this;
        var obj = {
            strDaoTao_HeDaoTao_Id: edu.util.getValById("dropHeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValById("dropKhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, "", "", me.genComBo_ChuongTrinhDaoTao_KeThua);
    },
    genComBo_ChuongTrinhDaoTao_KeThua: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENCHUONGTRINH",
                mRender: function (nRow, aData) {
                    return aData.TENCHUONGTRINH + " - " + edu.util.returnEmpty(aData.DAOTAO_N_CN_MA);
                }
            },
            renderPlace: ["dropChuongTrinhDaoTao"],
            title: "Chọn chương trình đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropChuongTrinhDaoTao").select2({//Search on modal
            dropdownParent: $('#myModalKeThua .modal-content')
        })
    },
    getList_ChuongTrinhDaoTao_Edit: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropEdit_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, "", "", me.genComBo_ChuongTrinhDaoTao_Edit);
    },
    genComBo_ChuongTrinhDaoTao_Edit: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENCHUONGTRINH",
            },
            renderPlace: ["dropEdit_ChuongTrinhDaoTao"],
            title: "Chọn chương trình đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HocPhan_ChuongTrinh_TuongDuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_ChuongTrinh/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_ThoiGian_KH_Id': "",
            'strDaoTao_ThoiGian_TT_Id': "",
            'strThuocTinhHocPhan_Id': "",
            'strPhanCongPhamViDamNhiem_Id': "",
            'strDaoTao_HocPhan_Id': "",
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById("dropEdit_ChuongTrinhDaoTao"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000000
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
                    me.genCombo_HocPhan_ChuongTrinh_TuongDuong(dtResult);
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
    genCombo_HocPhan_ChuongTrinh_TuongDuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                name: "TEN",
                mRender: function (nrow, aData) {
                    return aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN;
                }
            },
            renderPlace: ["dropEdit_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    getList_ChuongTrinhDaoTao_OnSelect: function () {
        var me = this; ///////
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropSearchHocPhan_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, "", "", me.genComBo_ChuongTrinhDaoTao_OnSelect);
    },
    genComBo_ChuongTrinhDaoTao_OnSelect: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "TENCHUONGTRINH",
            },
            renderPlace: ["dropSearchHocPhan_ChuongTrinh"],
            title: "Chọn chương trình đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strTuKhoa: "",
            strDAOTAO_NAM_Id: "",
            strNguoiThucHien_Id: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, "", "", me.genComBo_ThoiGianDaoTao);
    },
    genComBo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropHocPhan_HocKyDuKien", "dropHocPhan_HocKyThucTe"],
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HocPhan_baiHoc
    --ULR:  Modules
    -------------------------------------------*/
    save_HocPhan_PhanBo: function (strPhanBo_Id) {
        var me = this;
        //--Edit
        var strId = strPhanBo_Id;
        var strLoaiPhanBo_Id = edu.util.getValById('dropHocPhan_PhanBo' + strPhanBo_Id);
        var dSoTiet = edu.util.getValById('txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id);
        if (!edu.util.checkValue(strPhanBo_Id)) {
            return;
        }
        if (strId.length == 30) strId = "";
        var obj_notify;
        var obj_save = {
            'action': 'KHCT_HocPhan_TietHoc/ThemMoi',

            'strId': strId,
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strLoaiPhanBo_Id': strLoaiPhanBo_Id,
            'dSoTiet': dSoTiet,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'KHCT_HocPhan_TietHoc/CapNhat';
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
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan_PhanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_TietHoc/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strLoaiPhanBo_Id': '',
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_HocPhan_PhanBo(dtReRult);
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
    genTable_HocPhan_PhanBo: function (data) {
        var me = this;
        $("#tblHocPhan_PhanBo tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strPhanBo_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strPhanBo_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strPhanBo_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHocPhan_PhanBo' + strPhanBo_Id + '" class="select-opt"><option value=""> --- Chọn loại phân bổ--</option ></select ></td>';
            row += '<td><input type="text" id="txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id + '" value="' + edu.util.returnEmpty(data[i].SOTIET) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deletePhanBo" id="' + strPhanBo_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblHocPhan_PhanBo tbody").append(row);
            me.genComBo_PhanBo("dropHocPhan_PhanBo" + strPhanBo_Id, data[i].LOAIPHANBO_ID);
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_PhanBo(id, "");
        }
        edu.system.pickerdate("input-datepicker_GiaHan");
    },
    genHTML_PhanBo: function (strPhanBo_Id) {
        var me = this;
        var iViTri = document.getElementById("tblHocPhan_PhanBo").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strPhanBo_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strPhanBo_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHocPhan_PhanBo' + strPhanBo_Id + '" class="select-opt"><option value=""> --- Chọn loại phân bổ--</option ></select ></td>';
        row += '<td><input type="text" id="txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id + '"  class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strPhanBo_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblHocPhan_PhanBo tbody").append(row);
        me.genComBo_PhanBo("dropHocPhan_PhanBo" + strPhanBo_Id, "");
    },
    cbGetList_HocPhan_PhanBo: function (data) {
        main_doc.ChuongTrinhHocPhan.dtPhanBo= data;
    },
    genComBo_PhanBo: function (strPhanBo_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtPhanBo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strPhanBo_Id],
            type: "",
            title: "Chọn loại phân bổ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strPhanBo_Id).select2();
    },
    delete_HocPhan_PhanBo: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HocPhan_TietHoc/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HocPhan_PhanBo();
                }
                else {
                    edu.system.alert(obj_delete.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_delete.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    //genTable_HocPhan_PhanBo: function (data) {
    //    var me = this;
    //    $("#tblInput_HocPhan_PhanBo tbody").html("");
    //    var row = "";
    //    for (var i = 0; i < data.length; i++) {
    //        row += '<tr>';
    //        row += '<td>';
    //        row += 'Loại phân bổ<span class="title-colon">:</span>';
    //        row += '</td>';
    //        row += '<td>';
    //        row += data[i].LOAIPHANBO_TEN;
    //        row += '</td>';
    //        row += '<td>';
    //        row += 'Số tiết<span class="title-colon">:</span>';
    //        row += '</td>';
    //        row += '<td>';
    //        row += data[i].SOTIET;
    //        row += '</td>';
    //        row += '<td class="td-fixed td-center">';
    //        row += '<a id="' + data[i].ID + '" class="btnDeletePoiter poiter pull-right">';
    //        row += '<i class="fa fa-trash"></i>';
    //        row += '</a>';
    //        row += '</td>';
    //        row += '</tr>';
    //    }
    //    $("#tblInput_HocPhan_PhanBo tbody").append(row);
    //},
    /*------------------------------------------
    --Discription: [3] AccessDB HocPhan_baiHoc
    --ULR:  Modules
    -------------------------------------------*/
    keThua_ChuongTrinh: function (strId) {
        var me = this;
        //var aData = me.dtHocPhanKeThua.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/CiQVKTQgHgUgLhUgLh4JLiIRKSAvHgIV',
            'func': 'pkg_kehoach_thongtin.KeThua_DaoTao_HocPhan_CT',
            'iM': edu.system.iM,
            'strId': "",
            'strChuongTrinhNguon_Id': edu.util.getValById("dropChuongTrinhDaoTao"),
            'strDaoTao_ThoiGian_KH_Id': edu.util.getValById('dropThoiGian_' + strId),
            'strChuongTrinhDich_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HocPhanNguon_Id': strId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công", "w");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan_ChuongTrinh();
                    me.getList_KhoiBatBuoc();
                    me.getList_KhoiTuChonDon();
                    me.getList_QuanHeHocPhan();
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    getList_HocPhanKeThua: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLx4CFQPP',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_CT',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa_KT'),
            'strDaoTao_ThoiGian_KH_Id': edu.util.getValById('dropKy_KT'),
            'strDaoTao_ThoiGian_TT_Id': edu.util.getValById('dropAAAA'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strPhanCongPhamViDamNhiem_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao'),
            'strDaoTao_KhoiKienThuc_Id': edu.util.getValById('dropKhoiKienThuc_KT'),
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
                    me["dtHocPhanKeThua"] = data.Data
                    me.genList_HocPhanKeThua(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
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

    genList_HocPhanKeThua: function (data) {
        var me = this;
        //var row = '';
        //row += '<div class="col-lg-4 checkbox-inline user-check-print">';
        //row += '<input style="float: left;" type="checkbox" class="ckbHocPhan_All" checked="checked" />';
        //row += '<span><b>Tất cả</b></span>';
        //row += '</div>';
        //for (var i = 0; i < data.length; i++) {
        //    var strcheck = 'checked="checked"';
        //    row += '<div class="col-lg-4 checkbox-inline user-check-print;">';
        //    row += '<input  style="float: left;" type="checkbox" id="' + data[i].DAOTAO_HOCPHAN_ID + '" class="ckbHocPhan" title="' + data[i].DAOTAO_HOCPHAN_TEN + '"' + strcheck + '/>';
        //    row += '<span><p>' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_MA) + ' - ' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN) + ' - ' + edu.util.returnEmpty(data[i].HOCTRINHAPDUNGHOCTAP) + ' - ' + edu.util.returnEmpty(data[i].THONGTINPHANBOTIETHOC) + '</p></span>';
        //    row += '</div>';
        //}
        //$("#DSHocPhan").html(row);
        var jsonForm = {
            strTable_Id: "tblHocPhanKeThua",
            aaData: data,
            colPos: {
                center: [0],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "KHOIKIENTHUC"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIAN_KEHOACH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div style="width: 200px; float: left"><select id="dropThoiGian_' + aData.ID + '" class="select-opt" style="width:100% !important"></select></div>';
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
        data.forEach(e => {
            var obj = {
                data: me.dtThoiGianKeThua,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "THOIGIAN",
                    default_val: e.DAOTAO_THOIGIAN_KEHOACH_ID
                },
                renderPlace: ["dropThoiGian_" + e.ID],
                title: "Chọn kỳ kế thừa"
            };
            edu.system.loadToCombo_data(obj);
        });
        
    },

    getList_KetQuaKy: function (aData) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_Chung_MH/DSA4CCUJLiIKOBUpJC4VKTQVNAPP',
            'func': 'pkg_chung.LayIdHocKyTheoThuTu',
            'iM': edu.system.iM,
            'dThuTu': aData.DAOTAO_THOIGIAN_KEHOACH_THUTU ? aData.DAOTAO_THOIGIAN_KEHOACH_THUTU : undefined,
            'strDaoTao_ChuonTrinhDich_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length) {
                        edu.util.viewValById("dropThoiGian_" + aData.ID, dtReRult[0].IDHOCKY)
                    }
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


    getList_KetQua: function (strId) {
        var me = this;

        var aData = me.dtHocPhan_ChuongTrinh.find(e => e.ID === strId);
        $(".lblEditHocPhan").html(aData.DAOTAO_HOCPHAN_MA + ' - ' + aData.DAOTAO_HOCPHAN_TEN)
        //--Edit
        var obj_list = {
            'action': 'D_KQHocTapTheoChuongTrinh/LayKQHocTapTheoChuongTrinh',
            'type': 'GET',
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KetQua(dtReRult.rsNguoiHocChuaCoDiem, data.Pager, "tblKetQua1");
                    me.genTable_KetQua(dtReRult.rsNguoiHocChuaHoanThanh, data.Pager, "tblKetQua2");
                    me.genTable_KetQua(dtReRult.rsNguoiHocDaHoanThanh, data.Pager, "tblKetQua3");
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
    genTable_KetQua: function (data, iPager, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "",
                iDataRow: 1,
                bFilter: true
            },
            colPos: {
                center: [0, 3],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    /*------------------------------------------
    --Discription: [4]  Access KLCD
    --Author: duyentt
    -------------------------------------------*/
    save_DinhHuong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/Them_DaoTao_CT_DinhHuong',
            'type': 'POST',
            'strId': me.strDinhHuong_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strTen': edu.util.getValById('txtTenDinhHuong'),
            'strMa': edu.util.getValById('txtMaDinhHuong'),
            'strCheDoDangKyDinhHuong_Id': edu.util.getValById('dropCheDoDinhHuong'),
            'strNgayBatDau': edu.util.getValById('txtNgayBatDau'),
            'strNgayKetThuc': edu.util.getValById('txtNgayKetThuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'KHCT_ThongTin/Sua_DaoTao_CT_DinhHuong';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        obj_save.strId = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    $("#tblGanKhoiKienThuc tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_GanKhoiKienThuc(strKetQua_Id, obj_save.strId);
                    });
                    $("#tblGanHocPhan tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_GanHocPhan(strKetQua_Id, obj_save.strId);
                    });
                    $("#tblGanSinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new") {
                            me.save_SinhVien(strNhanSu_Id, obj_save.strId);
                        }
                    });
                    me.getList_DinhHuong();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DinhHuong: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtDinhHuong = dtResult;
                    me.loadToTree_DinhHuong(dtResult, iPager);
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
    getDetail_DinhHuong: function (strId) {
        var me = this;
        var data = edu.util.objGetDataInData(strId, me.dtDinhHuong, "ID");
        me.viewEdit_DinhHuong(data);
    },
    delete_DinhHuong: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_ThongTin/Xoa_DaoTao_CT_DinhHuong',

            'strIds': Ids,
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
                    me.getList_DinhHuong();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete.action + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    viewEdit_DinhHuong: function (data) {
        var me = this;
        me.strDinhHuong_Id = data[0].ID;
        edu.util.viewValById("txtMaDinhHuong", data[0].MA);
        edu.util.viewValById("txtTenDinhHuong", data[0].TEN);
        edu.util.viewValById("dropCheDoDinhHuong", data[0].CHEDODANGKYDINHHUONG_ID);
        edu.util.viewValById("txtNgayBatDau", data[0].NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data[0].NGAYKETTHUC);
        me.getList_GanKhoiKienThuc();
        me.getList_GanHocPhan();
        me.getList_GanSinhVien();
    },
    /*------------------------------------------
   --Discription: [4]  ACESS DB ==> tổ hợp môn
   --Author: duyentt
   -------------------------------------------*/
    getList_GanKhoiKienThuc: function () {
        var me = this;
        
        //--Edit
        var obj_list = {
            'action': 'KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_KKT',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
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
                    me.genHTML_GanKhoiKienThuc_Data(dtResult);
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
    save_GanKhoiKienThuc: function (strDaoTao_KhoiKienThuc_Id, strDaoTao_CT_DinhHuong_Id) {
        var me = this;
        var strId = strDaoTao_KhoiKienThuc_Id;
        var checkData = edu.util.getValById('dropKhoiKienThuc' + strDaoTao_KhoiKienThuc_Id);
        if (!edu.util.checkValue(checkData)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_save = {
            'action': 'KHCT_DinhHuong/Them_DaoTao_CT_DinhHuong_KKT',
            'type': 'POST',
            'strId': strId,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': strDaoTao_CT_DinhHuong_Id,
            'strDaoTao_KhoiKienThuc_Id': edu.util.getValById('dropKhoiKienThuc' + strDaoTao_KhoiKienThuc_Id),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            return;
            obj_save.action = 'KHCT_DinhHuong/Sua_DaoTao_CT_DinhHuong_KKT';
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_save.strId = data.Id;
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_GanKhoiKienThuc: function (Ids) {
        var me = this;
        var strIds = Ids;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_DinhHuong/Xoa_DaoTao_CT_DinhHuong_KKT',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_GanKhoiKienThuc();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

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
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_GanKhoiKienThuc_Data: function (data) {
        var me = this;
        $("#tblGanKhoiKienThuc tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td>' + edu.util.returnEmpty(aData.DAOTAO_KHOIKIENTHUC_TEN) + '</td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblGanKhoiKienThuc tbody").append(row);
            //me.genComBo_KhoiKienThuc_Gan("dropKhoiKienThuc" + strKetQua_Id, aData.DAOTAO_KHOIKIENTHUC_ID);
        }
    },
    genHTML_GanKhoiKienThuc: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblGanKhoiKienThuc").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropKhoiKienThuc' + strKetQua_Id + '" class="select-opt"><option value=""></option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblGanKhoiKienThuc tbody").append(row);
        me.genComBo_KhoiKienThuc_Gan("dropKhoiKienThuc" + strKetQua_Id, aData.DAOTAO_KHOIKIENTHUC_ID);
    },

    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_KhoiKienThuc_Gan: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_DinhHuong/LayDSKhoiKienThucChuaDinhHuong',
            'type': 'GET',
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    me["dtKhoiKienThucGan"] = dt;
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_KhoiKienThuc_Gan: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKhoiKienThucGan,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn khối kiến thức"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    /*------------------------------------------
   --Discription: [4]  ACESS DB ==> tổ hợp môn
   --Author: duyentt
   -------------------------------------------*/
    getList_GanHocPhan: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_HP',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
            'strDaoTao_KhoiKienThuc_Id': edu.util.getValById('dropAAAA'),
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
                    me.genHTML_GanHocPhan_Data(dtResult);
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
    save_GanHocPhan: function (strDaoTao_KhoiKienThuc_Id, strDaoTao_CT_DinhHuong_Id) {
        var me = this;
        var strId = strDaoTao_KhoiKienThuc_Id;
        var checkData = edu.util.getValById('dropHocPhan' + strDaoTao_KhoiKienThuc_Id);
        if (!edu.util.checkValue(checkData)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_save = {
            'action': 'KHCT_DinhHuong/Them_DaoTao_CT_DinhHuong_HP',
            'type': 'POST',
            'strId': strId,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': strDaoTao_CT_DinhHuong_Id,
            'strDaoTao_KhoiKienThuc_Id': edu.util.getValById('dropKhoiKienThuc2' + strDaoTao_KhoiKienThuc_Id),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan' + strDaoTao_KhoiKienThuc_Id),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        if (edu.util.checkValue(obj_save.strId)) {
            return;
            obj_save.action = 'KHCT_DinhHuong/Sua_DaoTao_CT_DinhHuong_HP';
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_save.strId = data.Id;
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_GanHocPhan: function (Ids) {
        var me = this;
        var strIds = Ids;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_DinhHuong/Xoa_DaoTao_CT_DinhHuong_HP',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_GanHocPhan();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

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
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_GanHocPhan_Data: function (data) {
        var me = this;
        $("#tblGanHocPhan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td>' + edu.util.returnEmpty(aData.DAOTAO_KHOIKIENTHUC_TEN) + '</td>';
            row += '<td>' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblGanHocPhan tbody").append(row);
            me.genComBo_KhoiKienThuc_Gan("dropKhoiKienThuc2" + strKetQua_Id, aData.DAOTAO_KHOIKIENTHUC_ID);
            me.getList_HocPhan_Gan("dropHocPhan" + strKetQua_Id, aData.DAOTAO_KHOIKIENTHUC_ID, aData.DAOTAO_HOCPHAN_ID);
        }
    },
    genHTML_GanHocPhan: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblGanHocPhan").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropKhoiKienThuc2' + strKetQua_Id + '" class="select-opt"><option value=""></option ></select ></td>';
        row += '<td><select id="dropHocPhan' + strKetQua_Id + '" class="select-opt"><option value=""></option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblGanHocPhan tbody").append(row);
        me.genComBo_KhoiKienThuc_Gan("dropKhoiKienThuc2" + strKetQua_Id, aData.DAOTAO_KHOIKIENTHUC_ID);
        me.getList_HocPhan_Gan("dropHocPhan" + strKetQua_Id, aData.DAOTAO_KHOIKIENTHUC_ID, aData.DAOTAO_HOCPHAN_ID);
    },

    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_HocPhan_Gan: function (strTinhTrang_Id, strDaoTao_KhoiKienThuc_Id, default_val) {
        var me = this;
        var obj_list = {
            'action': 'KHCT_DinhHuong/LayDSDaoTao_HocPhan_Chua_DH',
            'type': 'GET',
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
            'strDaoTao_KhoiKienThuc_Id': strDaoTao_KhoiKienThuc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    me.genComBo_HocPhan_Gan(dt, strTinhTrang_Id, default_val)
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_HocPhan_Gan: function (data, strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val,
                mRender: function (nrow, aData) {
                    return aData.MA + " - " + aData.TEN;
                }

            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_GanSinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_DinhHuong/LayDSDaoTao_CT_DinhHuong_NH',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': me.strDinhHuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genTable_SinhVien(dtResult, iPager);
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

    genTable_GanSinhVien: function (data, iPager) {
        var me = main_doc.NamHoc;
        $("#lblNamHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGanSinhVien",
            aaData: data,
            colPos: {
                left: [1],
                center: [0],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

    },

    save_SinhVien: function (strQLSV_NguoiHoc_Id, strDaoTao_CT_DinhHuong_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strQLSV_NguoiHoc_Id, me.arrSinhVien, "ID");
        var obj_save = {
            'action': 'KHCT_DinhHuong/Them_DaoTao_CT_DinhHuong_NH',
            'type': 'POST',
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': strDaoTao_CT_DinhHuong_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strSoQuyetDinh': edu.util.getValById('txtAAAA'),
            'strNgayQuyetDinh': edu.util.getValById('txtAAAA'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;

        var obj_delete = {
            'action': 'KHCT_DinhHuong/Xoa_DaoTao_CT_DinhHuong_NH',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
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
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblGanSinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            //html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_MASO + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_HODEM + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_TEN + "</span></td>";
            //html += "<td class='td-left'><span>" + data[i].DAOTAO_LOPQUANLY_TEN + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NHOMLOP_TEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + data[i].DAOTAO_TOCHUCCHUONGTRINH_TEN + "</span></td>";
            //html += "<td class='td-left'><span>" + data[i].DAOTAO_KHOADAOTAO_TEN + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblGanSinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
            me.arrSinhVien.push(data[i]);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = this;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        //html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + edu.util.returnEmpty(aData.NHOMLOP_TEN) + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblGanSinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = this;
        console.log(strNhanSu_Id);
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblGanSinhVien tbody").html("");
            $("#tblGanSinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    
    getList_VDinhHuong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtVDinhHuong"] = dtReRult;
                    me.genTable_VDinhHuong(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_VDinhHuong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblVDinhHuong",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DuKienHocPhan.getList_HocPhanDV()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_VKhoiKienThuc: function (strDaoTao_CT_DinhHuong_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/LayDSDaoTao_CT_DinhHuong_KKT',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDaoTao_CT_DinhHuong_Id': strDaoTao_CT_DinhHuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtVKhoiKienThuc"] = dtReRult;
                    me.genTable_VKhoiKienThuc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_VKhoiKienThuc: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblVKhoiKienThuc",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DuKienHocPhan.getList_HocPhanDV()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_KHOIKIENTHUC_MA"
                },
                {
                    "mDataProp": "DAOTAO_KHOIKIENTHUC_TEN"
                },
                {
                    "mDataProp": "LOAIKHOIKIENTHUC"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    getList_VKhoiBatBuoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_KhoiBatBuoc',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_KhoiBatBuoc_Cha_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtVKhoiBatBuoc"] = dtReRult;
                    edu.system.genHTML_Progress("zoneprocessXXXXA", dtReRult.length);
                    dtReRult.forEach(e => me.getList_VKhoiBatBuocHP(e.ID));
                    //me.genTable_VKhoiBatBuoc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_VKhoiBatBuocHP: function (strDaoTao_KhoiBatBuoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_HP_KhoiBatBuoc',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_KhoiBatBuoc_Id': strDaoTao_KhoiBatBuoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtVKhoiBatBuocHP"] = me["dtVKhoiBatBuocHP"] ? me["dtVKhoiBatBuocHP"].concat(dtReRult) : dtReRult;
                    //me.genTable_VKhoiBatBuoc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXXA", function () {
                    me.genTable_VKhoiBatBuoc();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_VKhoiBatBuoc: function (data, iPager) {
        var me = this;
        var html = '';
        var iTong = 0;
        var iTongTP = 0;
        me.dtVKhoiBatBuoc.forEach(aData => {
            if (aData.TONGSOTINCHI) iTong += aData.TONGSOTINCHI;
            if (aData.TONGSOTINCHITINHPHI) iTongTP += aData.TONGSOTINCHITINHPHI;
            me.dtVKhoiBatBuocHP.filter(e => e.DAOTAO_KHOIBATBUOC_ID == aData.ID).forEach((aDataHP, nRow) => {
                html += '<tr>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.KYHIEU) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.TEN) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.PHANLOAI_TEN) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.TONGSOTINCHI) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.TONGSOTINCHITINHPHI) + '</td>'
                html += '<td style="text-align: center;">' + (nRow + 1) + '</td>'
                html += '<td>' + edu.util.returnEmpty(aDataHP.DAOTAO_HOCPHAN_MA) + '</td>'
                html += '<td>' + edu.util.returnEmpty(aDataHP.DAOTAO_HOCPHAN_TEN) + '</td>'
                html += '<td>' + edu.util.returnEmpty(aDataHP.DAOTAO_HOCPHAN_TEN_TA) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.HOCTRINHAPDUNGHOCTAP) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.HOCTRINHAPDUNGTINHHOCPHI) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.LAMONTINHDIEMTHEOCHUONGTRINH) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.THUOCTINHHOCPHAN_TEN) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.THOIGIAN) + '</td>'
                html += '</tr>'
            });
        })
        $("#tblViewKhoiBatBuoc tbody").html(html);
        edu.system.insertSumAfterTable("tblViewKhoiBatBuoc", [9, 10]);
        edu.system.actionRowSpan("tblViewKhoiBatBuoc", [0, [1, 2, 3, 4]]);
        $("#tblViewKhoiBatBuoc tfoot td:eq(3)").html(iTong)
        $("#tblViewKhoiBatBuoc tfoot td:eq(4)").html(iTongTP)
        /*III. Callback*/
    },

    getList_VKhoiTuChon: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_KhoiTuChon_Don',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strLoaiLuaChon_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_KTuChon_Don_Cha_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtVKhoiTuChon"] = dtReRult;
                    edu.system.genHTML_Progress("zoneprocessXXXXB", dtReRult.length);
                    dtReRult.forEach(e => me.getList_VKhoiTuChonHP(e.ID));
                    //me.genTable_VKhoiBatBuoc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_VKhoiTuChonHP: function (strDaoTao_KTuChon_Don_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/LayDSKS_DaoTao_HP_KTuChon_Don',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ToChucCT_Id': me.strChuongTrinh_Id,
            'strDaoTao_KTuChon_Don_Id': strDaoTao_KTuChon_Don_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtVKhoiTuChonHP"] = me["dtVKhoiTuChonHP"] ? me["dtVKhoiTuChonHP"].concat(dtReRult) : dtReRult;
                    //me.genTable_VKhoiBatBuoc(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXXB", function () {
                    me.genTable_VKhoiTuChon();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_VKhoiTuChon: function (data, iPager) {
        var me = this;
        var html = '';
        var iTong = 0;
        var iTongTP = 0;
        me.dtVKhoiTuChon.forEach(aData => {
            if (aData.SOTINCHIQUYDINH) iTong += aData.SOTINCHIQUYDINH;
            if (aData.SOTINCHIPHIQUYDINH) iTongTP += aData.SOTINCHIPHIQUYDINH;
            me.dtVKhoiTuChonHP.filter(e => e.DAOTAO_KHOITUCHON_DON_ID == aData.ID).forEach((aDataHP, nRow) => {
                html += '<tr>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.KYHIEU) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.TEN) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.PHANLOAI_TEN) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.SOTINCHIQUYDINH) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aData.SOTINCHIPHIQUYDINH) + '</td>'
                html += '<td style="text-align: center;">' + (nRow + 1) + '</td>'
                html += '<td>' + edu.util.returnEmpty(aDataHP.DAOTAO_HOCPHAN_MA) + '</td>'
                html += '<td>' + edu.util.returnEmpty(aDataHP.DAOTAO_HOCPHAN_TEN) + '</td>'
                html += '<td>' + edu.util.returnEmpty(aDataHP.DAOTAO_HOCPHAN_TEN_TA) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.HOCTRINHAPDUNGHOCTAP) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.HOCTRINHAPDUNGTINHHOCPHI) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.LAMONTINHDIEMTHEOCHUONGTRINH) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.THUOCTINHHOCPHAN_TEN) + '</td>'
                html += '<td style="text-align: center;">' + edu.util.returnEmpty(aDataHP.THOIGIAN) + '</td>'
                html += '</tr>'
            });
        })
        $("#tblViewKhoiTuChon tbody").html(html);
        edu.system.insertSumAfterTable("tblViewKhoiTuChon", [9, 10]);
        edu.system.actionRowSpan("tblViewKhoiTuChon", [0, [1, 2, 3, 4]]);
        $("#tblViewKhoiTuChon tfoot td:eq(3)").html(iTong)
        $("#tblViewKhoiTuChon tfoot td:eq(4)").html(iTongTP)
    },

    getList_KhoiKienThuc_KT: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIKKS4oCigkLxUpNCIP',
            'func': 'pkg_kehoach_thongtin2.LayDSKhoiKienThuc',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinhDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KhoiKienThuc_KT(data);
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
    genCombo_KhoiKienThuc_KT: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoiKienThuc_KT"],
            title: "Chọn khối kiến thức"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropKhoiKienThuc_KT").select2({//Search on modal
            dropdownParent: $('#myModalKeThua .modal-content')
        })
    },

    getList_Ky_KT: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIKOBUpJC4CKTQuLyYVMygvKQPP',
            'func': 'pkg_kehoach_thongtin2.LayDSKyTheoChuongTrinh',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me["dtThoiGianKeThua"] = data;
                    me.genCombo_Ky_KT(data);
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
    genCombo_Ky_KT: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropKy_KT", "dropKy_KT_Fill"],
            title: "Chọn kỳ"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropKy_KT").select2({//Search on modal
            dropdownParent: $('#myModalKeThua .modal-content')
        })
        $("#dropKy_KT_Fill").select2({//Search on modal
            dropdownParent: $('#myModalKeThua .modal-content')
        })
    },

    getList_EditHocKy: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIRKSAvCjgKJAkuICIp',
            'func': 'pkg_kehoach_thongtin2.LayDSPhanKyKeHoach',
            'iM': edu.system.iM,
            'strDaotao_Hocphan_CT_Id': me.strHocPhan_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_EditHocKy(data);
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
    genCombo_EditHocKy: function (data) {
        //var obj = {
        //    data: data,
        //    renderInfor: {
        //        id: "ID",
        //        parentId: "",
        //        name: "THOIGIAN",
        //    },
        //    renderPlace: ["dropSearch_HocKyDuKien"],
        //    title: "Chọn kỳ dự kiến"
        //};
        //edu.system.loadToCombo_data(obj);
        let arrDefault = data.filter(e => e.TONTAI > 0);
        let arrDefault_val = [];
        arrDefault.forEach(e => arrDefault_val.push(e.ID))
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                //default_val: arrDefault
            },
            renderPlace: ["dropEditHocKy"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
        console.log(arrDefault_val)
        $("#dropEditHocKy").val(arrDefault_val).trigger("change");
        $("#dropEditHocKy").select2({//Search on modal
            dropdownParent: $('#myModalEditHocKy .modal-content')
        })
    },

    save_EditHocKy: function (strDaoTao_ThoiGian_KH_Id) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/EjQgHgUgLhUgLh4VKS4oBiggLx4KCR4CFQPP',
            'func': 'pkg_kehoach_thongtin2.Sua_DaoTao_ThoiGian_KH_CT',
            'iM': edu.system.iM,
            'strDaotao_Hocphan_CT_Id': me.strHocPhan_ChuongTrinh_Id,
            'strDaoTao_ThoiGian_KH_Id': edu.util.getValById("dropEditHocKy"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                    me.getList_HocPhan_ChuongTrinh();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_EditHocKyAll: function (strDaotao_Hocphan_CT_Id) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/EjQgHgUgLhUgLh4VKS4oBiggLx4KCR4CFQPP',
            'func': 'pkg_kehoach_thongtin2.Sua_DaoTao_ThoiGian_KH_CT',
            'iM': edu.system.iM,
            'strDaotao_Hocphan_CT_Id': strDaotao_Hocphan_CT_Id,
            'strDaoTao_ThoiGian_KH_Id': edu.util.getValById("dropEditHocKyAll"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan_ChuongTrinh();
                });
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_KyDuKien: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIRKSAvCjgKJAkuICIp',
            'func': 'pkg_kehoach_thongtin2.LayDSPhanKyKeHoach', 
            'iM': edu.system.iM,
            'strDaotao_Hocphan_CT_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KyDuKien(data);
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
    genCombo_KyDuKien: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_HocKyDuKien", "dropEditHocKyAll"],
            title: "Chọn kỳ dự kiến"
        };
        edu.system.loadToCombo_data(obj);
        
    },
    save_KeThuaQuanHe: function (strDaoTao_QuanHeHocPhan_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/CiQVKTQgHgUgLhUgLh4QNCAvCSQJLiIRKSAv',
            'func': 'pkg_kehoach_thongtin2.KeThua_DaoTao_QuanHeHocPhan',
            'iM': edu.system.iM,
            'strDaoTao_QuanHeHocPhan_Id': strDaoTao_QuanHeHocPhan_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}