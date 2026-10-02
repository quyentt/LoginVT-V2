/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DSTinhLuongTheoThang() { };
DSTinhLuongTheoThang.prototype = {
    arrHeadDiem_Id: [],
    strNhanSu_Id: '',
    dtNhanSu_BangLuong: [],
    dtNhanSu_ConLai: [],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_CoCauToChuc();
        me.getList_NhanSu_BangLuong();
        me.getList_QuyDinhLuong();
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
        $("#dropSearch_DonVi").on("select2:select", function () {
            me.getList_HS();
            me.getList_NhanSu_BangLuong();
        });
        $("#txtSearch_Nam").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu_BangLuong();
            }
        });
        $("#txtSearch_Thang").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NhanSu_BangLuong();
            }
        });
        $("#btnSearch_NhanSu_LuongTheoThang").click(function () {
            me.getList_NhanSu_BangLuong();
            me.getList_NhanSu_ConLai();
        });
        me.getList_QuyDinhLuong();
        me.getList_CoCauToChuc();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIBANGLUONG", "", "", me.genCombo_LoaiBangLuong);

        $("#btnViewLuong").click(function () {
            var strQuyDinhLuong = edu.util.getValById("dropSearch_QuyDinh");
            var strThang = edu.util.getValById("txtSearch_Thang");
            var strNam = edu.util.getValById("txtSearch_Nam");
            if (!edu.util.checkValue(strQuyDinhLuong) || !edu.util.checkValue(strThang) || !edu.util.checkValue(strNam)) {
                edu.system.alert("Hãy nhập đủ thông tin", "w");
                return;
            }
            me.getList_CauTrucBangLuong();
        });
        $("#btnTinhLuong").click(function () {
            me.TinhLuong();
        });
        $("#zonebtnBaoCao_TL").delegate(".btnBaoCao_TL", "click", function (e) {
            e.preventDefault();
            var strQuyDinhLuong = edu.util.getValById("dropSearch_QuyDinh");
            var strThang = edu.util.getValById("txtSearch_Thang");
            var strNam = edu.util.getValById("txtSearch_Nam");
            if (!edu.util.checkValue(strQuyDinhLuong) || !edu.util.checkValue(strThang) || !edu.util.checkValue(strNam)) {
                edu.system.alert("Hãy nhập đủ thông tin", "w");
                return;
            }
            me.report($(this).attr("name"));
        });
    },

    page_load: function () {
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIBANGLUONG", "dropSearch_LoaiBangLuong");
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HS();
        me.getList_CoCauToChuc();
        me.getList_NhanSu_BangLuong();
        me.getList_QuyDinhLuong();
    },

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
            renderPlace: ["dropSearch_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },

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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonVi"),
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
    --Discription: [3] AccessDB Quy định lương
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
            renderPlace: ["dropSearch_QuyDinhLuong"],
            title: "Chọn quy định lương"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_NhanSu_BangLuong: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'L_BangLuong_NhanSu/LayDanhSach',
            

            'strTuKhoa': "",
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropSearch_QuyDinhLuong"),
            'strLoaiBangLuong_Id': edu.util.getValById("dropSearch_LoaiBangLuong"),
            'strNam': edu.util.getValById("txtSearch_Nam"),
            'strThang': edu.util.getValById("txtSearch_Thang"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonVi"),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById("dropSearch_ThanhVien"),
            'strNguoiTao_Id':"",
            'pageIndex': 1,
            'pageSize': 100000,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_HS(dtReRult, data.Pager);
                
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
    save_NhanSu_BangLuong: function (strId, strHocPhan_Id, iThuTu) {
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
                if (!edu.util.checkValue(obj_save.strId)) {
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
    delete_NhanSu_BangLuong: function (Ids) {
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

    genComBo_NhanSu_BangLuong: function (data) {
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


    getList_NhanSu_ConLai: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'L_BangLuong_NhanSu/LayDSNNhanSu_Luong_ConLai',
            

            'strTuKhoa': "",
            'strNhanSu_QuyDinhLuong_Id': edu.util.getValById("dropSearch_QuyDinhLuong"),
            'strLoaiBangLuong_Id': edu.util.getValById("dropSearch_LoaiBangLuong"),
            'strNam': edu.util.getValById("txtSearch_Nam"),
            'strThang': edu.util.getValById("txtSearch_Thang"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonVi"),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById("dropSearch_ThanhVien"),
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 100000,
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

    /*------------------------------------------
    --Discription: [4]  Access Học phần - chương trình - khối bắt buộc
    --Author: duyentt
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [4]  GEN HTML ==> ChuongTrinh
    --Author: duyentt
    -------------------------------------------*/
    genTable_NhanSu_BangLuong_OnSelect: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<li class="treeview item-li" id="drag_KBB_' + data[i].DAOTAO_HOCPHAN_ID + '" name="" draggable="true" ondragstart="main_doc.ChuongTrinhHocPhan.khoibatbuoc_dragstart_handler(event);">';
            row += '<a>';
            row += '<i class="fa fa-arrows"></i> <span>' + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(data[i].DAOTAO_HOCPHAN_TEN) + '</span>';
            row += '<span class="submit btn btn-primary pull-right btnSelectHocPhan" id="btnSelect_KBB_' + data[i].DAOTAO_HOCPHAN_ID + '"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
            row += '</a>';
            row += '</li>';
        }
        $("#zoneTongHocPhan_KBB").html(row);

        var jsonForm = {
            strTable_Id: "tbl_ThanNhanNuocNgoai",
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [{
                "mDataProp": "HOVATEN"
            },
            {
                "mDataProp": "QUANHE_TEN"
            },
            {
                "mDataProp": "NAMSINH"
            },
            {
                "mDataProp": "NGHENGHIEP"
            },
            {
                "mDataProp": "NUOCDINHCU"
            },
            {
                "mDataProp": "QUOCTICH"
            },
            {
                "mDataProp": "NAMDINHCU"
            },
            {
                "mDataProp": "NGAYTAO_DD_MM_YYYY"
            }
                , {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                }
            }
                , {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnDelete" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

}