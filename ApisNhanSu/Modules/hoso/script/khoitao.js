function KhoiTao() { };
KhoiTao.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    arrValid_HS:[],
    dtNhanSu: [],
    strNhanSu_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Save','click', function () {
            var valid = edu.util.validInputForm(me.arrValid_HS);
            if (valid) {
                me.save_HS();
            }
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Rewrite','click', function () {
            me.rewrite();
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Update', 'click', function () {
            var valid = edu.util.validInputForm(me.arrValid_HS);
            if (valid) {
                me.CapNhat_HS();
            }
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Delete', 'click', function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_HS();
            });
        });
        $("#zoneKhoiTao_Action").delegate('#btnKhoiTao_Addnew', 'click', function () {
            me.rewrite();
            me.action_addnew();
            edu.util.setOne_BgRow("xx", "tblKhoiTao_NhanSu");
        });
        $("#tblKhoiTao_NhanSu").delegate('.btnDetail', 'click', function (e) {
            me.rewrite();
            me.action_update();
            var strId = this.id;
            edu.util.viewHTMLById("lblForm_KhoiTao_HS", '<i class="fa fa-pencil"></i> Chỉnh sửa');
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblKhoiTao_NhanSu");
            me.getDetail_HS(me.strNhanSu_Id);
            $("#zoneEdit").slideDown();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_KhoiTao_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS("", edu.util.getValById("txtSearch_KhoiTao_TuKhoa"), edu.util.getValById("dropSearch_KhoiTao_CCTC"), edu.util.getValById("dropSearch_KhoiTao_BoMon"));
            }
        });
        $("#btnSearchKhoiTao_NhanSu").click(function () {
            me.getList_HS();
        });
        $("#dropSearch_KhoiTao_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
            me.getList_HS();
        });
        $("#dropSearch_KhoiTao_BoMon").on("select2:select", function () {
            me.getList_HS();
        });
    },
    page_load: function () {
        var me = main_doc.KhoiTao;
        edu.util.focus("txtSearch_KhoiTao_TuKhoa");
        me.arrValid_HS = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtNS_Ten", "THONGTIN1": "EM" },
            { "MA": "txtNS_MaSo", "THONGTIN1": "EM" },
            { "MA": "dropNS_LoaiDoiTuong", "THONGTIN1": "EM" },
            { "MA": "dropNS_TinhTrangNhanSu", "THONGTIN1": "EM" },
            //{ "MA": "txtNS_Email", "THONGTIN1": "EM" },
            { "MA": "txtNS_Ho", "THONGTIN1": "EM" },
        ];
        me.action_addnew();
        edu.system.page_load();
        setTimeout(function () {
            me.getList_HS();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropNS_GioiTinh");
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropNS_QuocTich");
                    setTimeout(function () {
                        me.getList_CoCauToChuc();
                        setTimeout(function () {
                            edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropNS_LoaiDoiTuong");
                            setTimeout(function () {
                                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropNS_TinhTrangNhanSu");
                                setTimeout(function () {
                                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LGV0, "dropNS_LoaiGiangVien");
                                }, 50);
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
        edu.system.uploadAvatar(['txtNS_Anh'], "");
    },
    rewrite: function () {
        var me = main_doc.KhoiTao;
        var strAnh = edu.system.getRootPathImg("");
        $("#srctxtNS_Anh").attr("src", strAnh);
        me.strId = "";
        var arrId = ["txtNS_Ho", "txtNS_Ten", "txtNS_BiDanh", "txtNS_NgaySinh", "txtNS_ThangSinh",
            "txtNS_NamSinh", "txtNS_Email", "txtNS_DienThoaiCaNhan", "dropNS_GioiTinh", "dropNS_QuocTich",
            "dropNS_CoCauToChuc", "txtNS_MaSo", "dropNS_TinhTrangNhanSu", "dropNS_LoaiDoiTuong", "dropNS_LoaiGiangVien"];
        edu.util.resetValByArrId(arrId);
    },
    action_addnew: function () {
        var html = '';
        html += '<a id="btnKhoiTao_Rewrite" class="btn btn-default" style="margin:3px"><i class="fa fa-refresh"></i><span class="lang" key=""> Viết lại</span></a>';
        html += '<a id="btnKhoiTao_Save" class="btn btn-success" style="margin:3px"><i class="fa fa-save"></i><span class="lang" key=""> Lưu</span></a>';
        $("#zoneKhoiTao_Action").html(html);
    },
    action_update: function () {
        var html = '';
        html += '<a id="btnKhoiTao_Delete" class="btn btn-default" style="margin:3px"><i class="fa fa-trash"></i><span class="lang" key=""> Xóa</span></a>';
        html += '<a id="btnKhoiTao_Addnew" class="btn btn-default" style="margin:3px"><i class="fa fa-plus"></i><span class="lang" key=""> Tạo mới</span></a>';
        html += '<a id="btnKhoiTao_Update" class="btn btn-warning" style="margin:3px"><i class="fa fa-save"></i><span class="lang" key=""> Cập nhật</span></a>';
        $("#zoneKhoiTao_Action").html(html);
    },
    save_HS: function () {
        var me = main_doc.KhoiTao;
        var obj_save = {
            'action': 'NS_HoSoV2/ThemMoi',            

            'strId': '',
            'strAnh': edu.util.getValById('txtNS_Anh'),
            'strHoDem': edu.util.getValById('txtNS_Ho'),
            'strTen': edu.util.getValById('txtNS_Ten'),
            'strTenGoiKhac': edu.util.getValById('txtNS_BiDanh'),
            'strNgaySinh': edu.util.getValById('txtNS_NgaySinh'),
            'strThangSinh': edu.util.getValById('txtNS_ThangSinh'),
            'strNamSinh': edu.util.getValById('txtNS_NamSinh'),
            'strEmail': edu.util.getValById('txtNS_Email'),
            'strSDT_CaNhan': edu.util.getValById('txtNS_DienThoaiCaNhan'),
            'strGioiTinh_Id': edu.util.getValById('dropNS_GioiTinh'),
            'strQuocTich_Id': edu.util.getValById('dropNS_QuocTich'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropNS_CoCauToChuc'),
            'strMaSo': edu.util.getValById('txtNS_MaSo'),
            'strTinhTrangNhanSu_Id': edu.util.getValById('dropNS_TinhTrangNhanSu'),
            'strLoaiDoiTuong_Id': edu.util.getValById('dropNS_LoaiDoiTuong'),
            'strLoaiGiangVien_Id': edu.util.getValById('dropNS_LoaiGiangVien'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strLaCanBoNgoaiTruong': edu.util.getValById('dropNS_LaCanBo'),
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_HS();
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
    CapNhat_HS: function () {
        var me = main_doc.KhoiTao;
        var obj_save = {
            'action': 'NS_HoSoV2/CapNhat',            

            'strId': me.strNhanSu_Id,
            'strMaSo': edu.util.getValById('txtNS_MaSo'),
            'strHoDem': edu.util.getValById('txtNS_Ho'),
            'strTen': edu.util.getValById('txtNS_Ten'),
            'strTenGoiKhac': edu.util.getValById('txtNS_BiDanh'),
            'strNgaySinh': edu.util.getValById('txtNS_NgaySinh'),
            'strThangSinh': edu.util.getValById('txtNS_ThangSinh'),
            'strNamSinh': edu.util.getValById('txtNS_NamSinh'),
            'strGioiTinh_Id': edu.util.getValById('dropNS_GioiTinh'),
            'strNoiSinh_DiaChi': "#",
            'strNoiSinh_Xa_Id': "#",
            'strNoiSinh_Huyen_Id': "#",
            'strNoiSinh_Tinh_Id': "#",
            'strQueQuan_DiaChi': "#",
            'strQueQuan_Xa_Id': "#",
            'strQueQuan_Huyen_Id': "#",
            'strQueQuan_Tinh_Id': "#",
            'strHKTT_DiaChi': "#",
            'strHKTT_Xa_Id': "#",
            'strHKTT_Huyen_Id': "#",
            'strHKTT_Tinh_Id': "#",
            'strNOHN_DiaChi': "#",
            'strNOHN_Xa_Id': "#",
            'strNOHN_Huyen_Id': "#",
            'strNOHN_Tinh_Id': "#",
            'strQuocTich_Id': edu.util.getValById('dropNS_QuocTich'),
            'strDanToc_Id': "#",
            'strTonGiao_Id': "#",
            'strTDPT_TotNghiepLop': "#",
            'strTDPT_He': "#",
            'strSoTruongCongTac': "#",
            'strThuongBinhHang_Id': "#",
            'strGiaDinhChinhSach_Id': "#",
            'strThanhPhanXuatThan_Id': "#",
            'strDang_NgayVao': "#",
            'strDang_NgayChinhThuc': "#",
            'strDang_NoiKetNap': "#",
            'strDoan_NgayVao': "#",
            'strDoan_NoiKetNap': "#",
            'strCongDoan_NgayVao': "#",
            'strNgu_NgayNhap': "#",
            'strNgu_NgayXuat': "#",
            'strNgu_QuanHam_Id': "#",
            'strCanCuoc_So': "#",
            'strCanCuoc_NgayCap': "#",
            'strCanCuoc_NoiCap': "#",
            'strNhanXet': "",
            'strEmail': edu.util.getValById('txtNS_Email'),
            'strAnh': edu.util.getValById('txtNS_Anh'),
            'strSDT_CaNhan': edu.util.getValById('txtNS_DienThoaiCaNhan'),
            'strSDT_CoQuan': "#",
            'strSDT_GiaDinh': "#",
            'strNgayTGCachMang': "#",
            'strNgayTGToChucChinhTriXH': "#",
            'strLoaiHopDongLaoDong_Id': "#",
            'strLoaiGiangVien_Id': edu.util.getValById('dropNS_LoaiGiangVien'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropNS_CoCauToChuc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoBaoHiem': "#",
            'strTinhTrangHonNhan_Id': "#",
            'strTinhTrangNhanSu_Id': edu.util.getValById('dropNS_TinhTrangNhanSu'),
            'strLoaiDoiTuong_Id': edu.util.getValById('dropNS_LoaiDoiTuong'),
            'strLaCanBoNgoaiTruong': edu.util.getValById('dropNS_LaCanBo'),
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.save_AnhHoSo();
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
    getList_HS: function () {
        var me = this;        
        var strCoCauToChuc = edu.util.getValById("dropSearch_KhoiTao_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_KhoiTao_CCTC");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_KhoiTao_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': -1
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);        
    },
    getDetail_HS: function (strId) {
        var me = main_doc.KhoiTao;
        var obj_detail = {
            'action': 'NS_HoSoV2/LayChiTiet',
            
            'strId': strId
        }
        if (strId.length != 32) return;        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.viewForm_HS(json[0]);
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
    delete_HS: function (strId) {
        var me = main_doc.KhoiTao;
        var obj_delete = {
            'action': 'NS_HoSoV2/Xoa',
            
            'strIds': me.strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    if (me.strId == strId) {
                        $(".btnClose").trigger("click");
                    }
                    edu.system.afterComfirm(obj);
                    me.getList_HS();
                }
                else {
                    edu.system.alert("SV_HoSo/Xoa: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("SV_HoSo/Xoa (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',
            action: obj_delete.action,            
            contentType: true,            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_AnhHoSo: function () {
        var me = main_doc.KhoiTao;
        var obj_save = {
            'action': 'NS_HoSoV2/KeThua',            

            'strNhanSu_HoSo_v2_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strNhanSu_Id == edu.system.userId) $("img[class='user-image']").attr("src", edu.system.rootPathUpload + "//" + edu.util.getValById('txtNS_Anh'));
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
    genTable_HS: function (data, iPager) {
        var me = this;
        me.dtNhanSu = data;
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoiTao_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhoiTao.getList_HS()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            arrClassName: ["btnDetail"],
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
                        html += '<span>' + "Mã cán bộ: " + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span>' + "Ngày sinh: " + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-edit color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);        
    },
    viewForm_HS: function (data) {
        var me = main_doc.KhoiTao;
        me.rewrite();
        edu.util.viewValById("txtNS_Anh", data.ANH);
        var strAnh = edu.system.getRootPathImg(data.ANH);
        $("#srctxtNS_Anh").attr("src", strAnh);

        me.strId = data.ID;
        edu.util.viewValById("txtNS_Ho", data.HODEM);
        edu.util.viewValById("txtNS_Ten", data.TEN);
        edu.util.viewValById("txtNS_BiDanh", data.TENGOIKHAC);
        edu.util.viewValById("txtNS_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txtNS_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txtNS_NamSinh", data.NAMSINH);
        edu.util.viewValById("dropNS_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("dropNS_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("txtNS_Email", data.EMAIL);
        edu.util.viewValById("txtNS_DienThoaiCaNhan", data.SDT_CANHAN);
        edu.util.viewValById("dropNS_CoCauToChuc", data.DAOTAO_COCAUTOCHUC_ID);        
        edu.util.viewValById("txtNS_MaSo", data.MASO);
        edu.util.viewValById("dropNS_TinhTrangNhanSu", data.TINHTRANGNHANSU_ID);
        edu.util.viewValById("dropNS_LoaiDoiTuong", data.LOAIDOITUONG_ID);
        edu.util.viewValById("dropNS_LoaiGiangVien", data.LOAIGIANGVIEN_ID);
        edu.util.viewValById("dropNS_LaCanBo", data.LACANBONGOAITRUONG); 
    },
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
        var me = main_doc.KhoiTao;
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
        me.genComBo_CCTC(data);
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
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
            renderPlace: ["dropNS_CoCauToChuc"],
            type: "",
            title: "Chọn cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropSearch_KhoiTao_CCTC"],
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
            renderPlace: ["dropSearch_KhoiTao_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
}