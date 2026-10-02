/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function HoSo() { }
HoSo.prototype = {
    strId: '',
    dt_NO: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
        --Discription: [2] Action HoSo NhanSu
        --Order: 
        -------------------------------------------*/
        $("#tblNguoiO").delegate('.btnDetail', 'click', function (e) {
            me.strId = this.id;
            edu.util.setOne_BgRow(me.strId, "tblNguoiO");
            me.getDetail_NO(me.strId);
        });
        $("#tblNguoiO").delegate('.btnDetail', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var obj = this;
            var strNguoiO_Id = this.id;
            edu.extend.popover_NhanSu(strNguoiO_Id, me.dt_NO, obj);
        });
        $("#btnSearch_NguoiO").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NO();
            }
        });
        $("#btnSearch_NguoiO").click(function () {
            me.getList_NguoiO();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: [1] Load HoSo
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_NO();
            //setTimeout(function () {
            //    me.getList_CoCauToChuc();
            //}, 50);
        }, 50);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoSo
    //-------------------------------------------*/
    //save_NO: function () {
    //    var me = main_doc.KhoiTao;
    //    var obj_save = {
    //        'action': 'KTX_DoiTuongOKyTucXa/ThemMoi',
    //        

    //        'strId': '',
    //        'strAnh': edu.util.getValById('txtNO_Anh'),
    //        'strHoDem': edu.util.getValById('txtNO_Ho'),
    //        'strTen': edu.util.getValById('txtNO_Ten'),
    //        'strNgaySinh': edu.util.getValById('txtNO_NgaySinh'),
    //        'strThangSinh': edu.util.getValById('txtNO_ThangSinh'),
    //        'strNamSinh': edu.util.getValById('txtNO_NamSinh'),
    //        'strEmail_CaNhan': edu.util.getValById('txtNO_Email'),
    //        'strSDT_CaNhan': edu.util.getValById('txtNO_DienThoaiCaNhan'),
    //        'strGioiTinh_Id': edu.util.getValById('dropNO_GioiTinh'),
    //        'strMaSo': edu.util.getValById('txtNO_MaSo'),
    //        'strCanCuoc_So': edu.util.getValById('txtNO_SoCanCuoc'),
    //        'strDiaChiLienHe': edu.util.getValById('txtNO_DiaChiLienHe'),
    //        'strGhiChu': edu.util.getValById('txtNO_GhiChu'),
    //        'strSoHoChieu': edu.util.getValById('txtNO_SoHoChieu'),
    //        'strThoiHanViSa': edu.util.getValById('txtNO_HanViSa'),
    //        //'strTrinhDoDaoTao_Id': edu.util.getValById('dropNO_TrinhDoDT'),
    //        //'strDienDaoTao_Id': edu.util.getValById('dropNO_DienDT'),
    //        //'strNganhDaoTao_Id': edu.util.getValById('dropNO_NganhDT'),
    //        //'strQuocTich_Id': edu.util.getValById('dropNO_QuocTich'),
    //        //'strDanToc_Id': edu.util.getValById('dropNO_DanToc'),
    //        //'strKhoaDaoTao_Id': edu.util.getValById('dropNO_KhoaDaoTao'),
    //        //'strLopQuanLy_Id': edu.util.getValById('dropNO_LopDaoTao'),
    //        //'strTonGiao_Id': edu.util.getValById('dropNO_TonGiao'),
    //        'strSoTaiKhoanCaNhan': edu.util.getValById('txtNO_SoTaiKhoan'),
    //       // 'strQueQuan': edu.util.getValById('txtNO_QueQuan'),
    //        'strHoKhauThuongTru': edu.util.getValById('txtNO_HoKhauThuongTru'),
    //        'strThoiGianDen': edu.util.getValById('txtNO_ThoiGianDen'),
    //        'strThoiGianDi': edu.util.getValById('txtNO_ThoiGianDi'),
    //       // 'strSDT_GiaDinh': edu.util.getValById('txtNO_SDTGiaDinh'),
    //       // 'strPhanLoaiDoiTuong_Id': edu.util.getValById('dropNO_LoaiDoiTuong'),

    //        //'strQuyetDinhDaoTao_So': edu.util.getValById('txtNO_QDDT_So'),
    //        //'strQuyetDinhDaoTao_NgayDen': edu.util.getValById('txtNO_QDDT_NgayDen'),
    //        //'strQuyetDinhDaoTao_NgayDi': edu.util.getValById('txtNO_QDDT_NgayDi'),
    //        //'strQuyetDinhDaoTao_NgayKy': edu.util.getValById('txtNO_QDDT_NgayKy'),
    //        //'strQuyetDinhGiaHan_So': edu.util.getValById('txtNO_QDGH_So'),
    //        //'strQuyetDinhGiaHan_NgayKy': edu.util.getValById('txtNO_QDGH_NgayKy'),
    //        'strNguoiThucHien_Id': edu.system.userId,
    //    };
    //    
    //    edu.system.makeRequest({
    //        success: function (data) {
    //            if (data.Success) {
    //                edu.system.alert("Thêm mới thành công!");
    //                me.getList_NO();
    //            }
    //            else {
    //                edu.system.alert(obj_save.action + ": " + data.Message, "w");
    //            }
    //            
    //        },
    //        error: function (er) {
    //            edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
    //            
    //        },
    //        type: "POST",
    //        action: obj_save.action,
    //        
    //        contentType: true,
    //        
    //        data: obj_save,
    //        fakedb: [
    //        ]
    //    }, false, false, false, null);
    //},
    //CapNhat_NO: function () {
    //    var me = main_doc.KhoiTao;
    //    var obj_save = {
    //        'action': 'KTX_DoiTuongOKyTucXa/CapNhat',
    //        

    //        'strId': me.strNguoiO_Id,
    //        'strAnh': edu.util.getValById('txtNO_Anh'),
    //        'strHoDem': edu.util.getValById('txtNO_Ho'),
    //        'strTen': edu.util.getValById('txtNO_Ten'),
    //        'strNgaySinh': edu.util.getValById('txtNO_NgaySinh'),
    //        'strThangSinh': edu.util.getValById('txtNO_ThangSinh'),
    //        'strNamSinh': edu.util.getValById('txtNO_NamSinh'),
    //        'strEmail_CaNhan': edu.util.getValById('txtNO_Email'),
    //        'strSDT_CaNhan': edu.util.getValById('txtNO_DienThoaiCaNhan'),
    //        'strGioiTinh_Id': edu.util.getValById('dropNO_GioiTinh'),
    //        'strMaSo': edu.util.getValById('txtNO_MaSo'),
    //        'strCanCuoc_So': edu.util.getValById('txtNO_SoCanCuoc'),
    //        'strDiaChiLienHe': edu.util.getValById('txtNO_DiaChiLienHe'),
    //        'strGhiChu': edu.util.getValById('txtNO_GhiChu'),
    //        'strSoHoChieu': edu.util.getValById('txtNO_SoHoChieu'),
    //        'strThoiHanViSa': edu.util.getValById('txtNO_HanViSa'),
    //       //'strTrinhDoDaoTao_Id': edu.util.getValById('dropNO_TrinhDoDT'),
    //       // 'strDienDaoTao_Id': edu.util.getValById('dropNO_DienDT'),
    //       // 'strNganhDaoTao_Id': edu.util.getValById('dropNO_NganhDT'),
    //       //'strQuocTich_Id': edu.util.getValById('dropNO_QuocTich'),
    //       //'strDanToc_Id': edu.util.getValById('dropNO_DanToc'),
    //       //'strKhoaDaoTao_Id': edu.util.getValById('dropNO_KhoaDaoTao'),
    //       //'strLopQuanLy_Id': edu.util.getValById('dropNO_LopDaoTao'),
    //       //'strTonGiao_Id': edu.util.getValById('dropNO_TonGiao'),
    //        'strSoTaiKhoanCaNhan': edu.util.getValById('txtNO_SoTaiKhoan'),
    //        //'strQueQuan': edu.util.getValById('txtNO_QueQuan'),
    //        'strHoKhauThuongTru': edu.util.getValById('txtNO_HoKhauThuongTru'),
    //        'strThoiGianDen': edu.util.getValById('txtNO_ThoiGianDen'),
    //        'strThoiGianDi': edu.util.getValById('txtNO_ThoiGianDi'),
    //        'strSDT_GiaDinh': edu.util.getValById('txtNO_SDTGiaDinh'),
    //        //'strPhanLoaiDoiTuong_Id': edu.util.getValById('dropNO_LoaiDoiTuong'),

    //        //'strQuyetDinhDaoTao_So': edu.util.getValById('txtNO_QDDT_So'),
    //        //'strQuyetDinhDaoTao_NgayDen': edu.util.getValById('txtNO_QDDT_NgayDen'),
    //        //'strQuyetDinhDaoTao_NgayDi': edu.util.getValById('txtNO_QDDT_NgayDi'),
    //        //'strQuyetDinhDaoTao_NgayKy': edu.util.getValById('txtNO_QDDT_NgayKy'),
    //        //'strQuyetDinhGiaHan_So': edu.util.getValById('txtNO_QDGH_So'),
    //        //'strQuyetDinhGiaHan_NgayKy': edu.util.getValById('txtNO_QDGH_NgayKy'),
    //        'strNguoiThucHien_Id': edu.system.userId,
    //    };

    //    
    //    edu.system.makeRequest({
    //        success: function (data) {
    //            if (data.Success) {
    //                edu.system.alert("Cập nhật thành công!");
    //            }
    //            else {
    //                edu.system.alert(obj_save.action + ": " + data.Message, "w");
    //            }
    //            
    //        },
    //        error: function (er) {
    //            edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
    //            
    //        },
    //        type: "POST",
    //        action: obj_save.action,
    //        
    //        contentType: true,
    //        
    //        data: obj_save,
    //        fakedb: [
    //        ]
    //    }, false, false, false, null);
    //},
    getList_NO: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_DoiTuongOKyTucXa/LayDanhSach',
            

            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropSearch_KhoiTao_LoaiDoiTuong"),
            'strTuKhoa': edu.util.getValById("txtSearch_KhoiTao_TuKhoa"),
            'strTinhTrangHopDong_Id': "",
            'dBiKyLuat': -1,
            'strNgayVao_TuNgay': "",
            'strNgayVao_DenNgay': "",
            'strNgayRa_TuNgay': "",
            'strNgayRa_DenNgay': "",
            'strKTX_Phong_Id': '',
            'strLopQuanLy_Id': '',
            'strKTX_ToaNha_Id': '',
            'strGioiTinh_Id': edu.util.getValById("dropSearch_KhoiTao_GioiTinh"),
            'strTrinhDoDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_TDDT"),
            'strDienDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_DienDT"),
            'strNganhDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_NganhDT"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_KhoaDT"),
            'dDoiTuongConDangOKTX': 1,
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,

            'strNgayKiemTra': '',
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dt_NO = dtResult;
                    }
                    me.genTable_NO(dtResult, iPager);
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
    getDetail_NO: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'KTX_DoiTuongOKyTucXa/LayChiTiet',
            
            'strId': strId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.viewForm_NO(json[0]);
                    } else {
                        console.log("Lỗi ");
                    }
                } else {
                    console.log("Thông báo: có lỗi xảy ra!");
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML HoSo
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NO: function (data, iPager) {
        var me = this;
        var strAnh = "";
        var strHoTen = "";
        var html = "";

        $("#lblNguoiO_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiO",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoSo.getList_NO()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(aData.ANH);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle btnDetail" id="' + aData.ID + '" href="#"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewForm_NO: function (data) {
        var me = this;
        var strHoTen = data.HODEM + " " + data.TEN;
        if (edu.util.checkValue(strHoTen)) {
            strHoTen = strHoTen.toUpperCase();
        }
        edu.util.viewHTMLById("txtNO_MaSo", data.MASO);
        edu.util.viewHTMLById("txtNO_HoDem", data.HODEM);
        edu.util.viewHTMLById("txtNO_Ten", data.TEN);
        edu.util.viewHTMLById("txtNO_NgaySinh", data.NGAYSINH);
        edu.util.viewHTMLById("txtNO_ThangSinh", data.THANGSINH);
        edu.util.viewHTMLById("txtNO_NamSinh", data.NAMSINH);
        edu.util.viewHTMLById("dropNO_GioiTinh", data.GIOITINH_TEN);
        edu.util.viewHTMLById("txtNO_Email", data.EMAIL_CANHAN);
        edu.util.viewHTMLById("txtNO_DienThoaiCaNhan", data.SDT_CANHAN);
        edu.util.viewHTMLById("txtNO_DiaChi", data.DIACHILIENHE);
        edu.util.viewHTMLById("txtNO_SoCanCuoc", data.CANCUOC_SO);
        edu.util.viewHTMLById("txtNO_SoHoChieu", data.SOHOCHIEU);
        edu.util.viewHTMLById("txtNO_HanVisa", data.THOIHANVISA);
        edu.util.viewHTMLById("txtNO_GhiChu", data.GHICHU);
        edu.util.viewHTMLById("txtNO_QDDT_So", data.GIADINHCHINHSACH_TEN); //chưa trả về
        edu.util.viewHTMLById("lblNO_QDDT_NgayKy", data.THANHPHANXUATTHAN_TEN); //chưa trả về
        edu.util.viewHTMLById("txtNO_QDDT_NgayDen", data.THOIGIANDEN);
        edu.util.viewHTMLById("txtNO_QDDT_NgayDi", data.THOIGIANDI);
        edu.util.viewHTMLById("lblNO_QDGH_So", data.NGU_NGAYNHAP);//chưa trả về
        edu.util.viewHTMLById("lblNO_QDGH_NgayKy", data.NGU_NGAYXUAT);//chưa trả về
        edu.util.viewHTMLById("txtAnh", '<img src="' + edu.system.getRootPathImg(data.ANH) + '" style="width: 100%">');
    },
    /*------------------------------------------
    --Discription: [2] AcessDB CoCauToChuc
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML CoCauToChuc
    --ULR:  Modules
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [1] AcessDB CoCauToChuc
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.HoSo;
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
            renderPlace: ["dropSearch_NOLL_CCTC"],
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
            renderPlace: ["dropSearch_NOLL_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
};