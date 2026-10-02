/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function HopDongLaoDong() { };
HopDongLaoDong.prototype = {
    do_table: '',
    strCommon_Id: '',
    strNhanSu_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    dtNhanSu: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [do_table] Action Common
        -------------------------------------------*/
        $(".btnRefresh").click(function () {
            me.switch_GetData(this.id);
        });
        $(".btnAdd").click(function () {
            me.switch_CallModal(this.id);
        });
        $(".btnCloseToggle").click(function () {
            edu.util.toggle_overide("zonecontent", "zone_main");
        });

        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            me.reset_HS();
            $("#zoneEdit").slideDown();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            me.getList_HopDongLaoDong();
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_CapNhat_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
            }
        });
        $("#btnSearchCapNhat_NhanSu").click(function () {
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_BoMon").on("select2:select", function () {
            me.getList_HS();
        });
        /*------------------------------------------
        --Discription: [tab_5] DaoTao
        -------------------------------------------*/
        $("#btnSaveRe_HDLD").click(function () {
            me.save_ThuyenChuyen();
            setTimeout(function () {
                me.resetPopup_ThuyenChuyen();
            }, 1000);
        });
        $("#btnSave_HDLD").click(function () {
            me.save_ThuyenChuyen();
        });
        $("#tbl_HopDongLaoDong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tbl_HopDongLaoDong");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_HopDongLaoDong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_HopDongLaoDong").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                edu.util.setOne_BgRow(strId, "tbl_HopDongLaoDong");
                $("#btnYes").click(function (e) {
                    me.delete_HopDongLaoDong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbl_HopDongLaoDong").delegate(".btnDownLoad", "click", function () {
            var strFiles = this.name;
            var arrFile = [strFiles];
            if (strFiles.indexOf(',') != -1) {
                arrFile = strFiles.split(',');
            }
            for (var i = 0; i < arrFile.length; i++) {
                console.log(edu.system.rootPathUpload + "/" + arrFile[i]);
                window.open(edu.system.rootPathUpload + "/" + arrFile[i], "_blank")
            }
        });
        $("#tbl_HopDongLaoDong").delegate(".btnSetTrangThaiCuoi", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?");
            $("#btnYes").click(function (e) {
                edu.extend.ThietLapQuaTrinhCuoiCung(strId, "NHANSU_QT_TCCB");
                setTimeout(function () {
                    me.getList_HopDongLaoDong();
                    $("#myModalAlert").modal('hide');
                }, 200);
            });
            return false;
        });
        /*------------------------------------------
        --Discription: [tab_2] TieuSuBanThan
        -------------------------------------------*/
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("NS.LOAIHOPDONG", "dropLoaiHD");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LOAIHOPDONG, "dropLoaiHD");
        edu.system.uploadFiles(["txtFileDinhKem"]);
        me.getList_CoCauToChuc();
    },

    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);

    }, /*------------------------------------------
    --Discription: [1] AcessDB CoCauToChuc
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = main_doc.QuaTrinhCongTac;
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
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_CapNhat_CCTC"],
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
            renderPlace: ["dropSearch_CapNhat_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropDonViCu_TrongTruong", "dropDonViMoi_TrongTruong", "dropTSBT_DonViCongTac"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },



    open_Collapse: function (strkey) {
        this.tab_item_actived.push(strkey);//
        $("#" + strkey).trigger("click");
        $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_tieusubanthan":
                me.resetPopup_HopDongLaoDong();
                me.popup_HopDongLaoDong();
                break;
        }
    },
    switch_GetData: function (key) {
        console.log(1111);
        var me = this;
        switch (key) {
            case "key_hopdonglaodong":
                me.getList_HopDongLaoDong();
                break;
        }
    },
    /*------------------------------------------
    --Discription: DanhSachNhanSu
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        
        var strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_CCTC");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_CapNhat_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);

    },
    genTable_HS: function (data, iPager) {
        var me = main_doc.QuaTrinhCongTac;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HopDongLaoDong.getList_HS()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            arrClassName: ["btnDetail"],
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
    reset_HS: function () {
        var me = this;

        $("#tbl_TieuSuBanThan tbody").html("");
        $("#tbl_QuanHeGiaDinh tbody").html("");
        $("#tbl_Dang tbody").html("");
        $("#tbl_Doan tbody").html("");
        $("#tbl_CongDoan tbody").html("");
        $("#tbl_TrinhDoChinhTri tbody").html("");
        $("#tbl_TrinhDoTinHoc tbody").html("");
        $("#tbl_TrinhDoNgoaiNgu tbody").html("");

    },
    /*------------------------------------------
    --Discription: [] Calling_schema getList_DanToc -> getList_TonGiao -> getList_GioiTinh 
    -> getList_QuocGia -> getList_TinhTrangHonNhan -> getList_ThuongBinhHang 
    -> getList_GiaDinhChinhSach -> getList_ThanhPhanXuatThan -> getList_QuanHam ---> getDetail_HS
    -------------------------------------------*/
  
    /*------------------------------------------
    --Discription: [Tab_1] ThongTinLyLich
    -------------------------------------------*/
    save_HS: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoV2/CapNhat',
            

            'strId': edu.system.userId,
            'strMaSo': "#",// the character "#" --> it mean, we dont want to update this field
            'strHoDem': "#",
            'strTen': "#",
            'strTenGoiKhac': edu.util.getValById('txtNS_BiDanh'),
            'strNgaySinh': "#",
            'strThangSinh': "#",
            'strNamSinh': "#",
            'strGioiTinh_Id': "#",
            'strNoiSinh_DiaChi': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("name")),
            'strNoiSinh_Xa_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("xaId")),
            'strNoiSinh_Huyen_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("huyenId")),
            'strNoiSinh_Tinh_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("tinhId")),
            'strQueQuan_DiaChi': edu.util.returnEmpty($("#txtNS_QueQuan").attr("name")),
            'strQueQuan_Xa_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("xaId")),
            'strQueQuan_Huyen_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("huyenId")),
            'strQueQuan_Tinh_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("tinhId")),
            'strHKTT_DiaChi': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("name")),
            'strHKTT_Xa_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("xaId")),
            'strHKTT_Huyen_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("huyenId")),
            'strHKTT_Tinh_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("tinhId")),
            'strNOHN_DiaChi': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("name")),
            'strNOHN_Xa_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("xaId")),
            'strNOHN_Huyen_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("huyenId")),
            'strNOHN_Tinh_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("tinhId")),
            'strQuocTich_Id': edu.util.getValById('dropNS_QuocTich'),
            'strDanToc_Id': edu.util.getValById('dropNS_DanToc'),
            'strTonGiao_Id': edu.util.getValById('dropNS_TonGiao'),
            'strTDPT_TotNghiepLop': edu.util.getValById('txtNS_TDPhoThong'),
            'strTDPT_He': edu.util.getValById('txtNS_He'),
            'strSoTruongCongTac': edu.util.getValById('txtNS_SoTruongCongTac'),
            'strThuongBinhHang_Id': edu.util.getValById('dropNS_HangThuongBinh'),
            'strGiaDinhChinhSach_Id': edu.util.getValById('dropNS_GiaDinhChinhSach'),
            'strThanhPhanXuatThan_Id': edu.util.getValById('dropNS_ThanhPhanXuatThan'),
            'strDang_NgayVao': edu.util.getValById('txtNS_Dang_NgayVao'),
            'strDang_NgayChinhThuc': edu.util.getValById('txtNS_Dang_NgayChinhThuc'),
            'strDang_NoiKetNap': edu.util.getValById('txtNS_Dang_NoiKetNap'),
            'strDoan_NgayVao': edu.util.getValById('txtNS_Doan_NgayVao'),
            'strDoan_NoiKetNap': edu.util.getValById('txtNS_Doan_NoiKetNap'),
            'strCongDoan_NgayVao': edu.util.getValById('txtNS_CongDoan_NgayVao'),
            'strNgu_NgayNhap': edu.util.getValById('txtNS_Ngu_NgayNhap'),
            'strNgu_NgayXuat': edu.util.getValById('txtNS_Ngu_NgayXuat'),
            'strNgu_QuanHam_Id': edu.util.getValById('dropNS_QuanHam'),
            'strCanCuoc_So': edu.util.getValById('txtNS_SCC_So'),
            'strCanCuoc_NgayCap': edu.util.getValById('txtNS_SCC_NgayCap'),
            'strCanCuoc_NoiCap': edu.util.getValById('txtNS_SCC_NoiCap'),
            'strNhanXet': "#",
            'strEmail': edu.util.getValById('txtNS_Email'),
            'strAnh': edu.util.getValById('uploadPicture_HS'),
            'strSDT_CaNhan': edu.util.getValById('txtNS_DienThoaiCaNhan'),
            'strSDT_CoQuan': edu.util.getValById('txtNS_DienThoaiCoQuan'),
            'strSDT_GiaDinh': edu.util.getValById('txtNS_DienThoaiGiaDinh'),
            'strNgayTGCachMang': edu.util.getValById('txtNS_NgayThamGiaCachMang'),
            'strNgayTGToChucChinhTriXH': edu.util.getValById('txtNS_NgayTGTCCTXH'),
            'strLoaiHopDongLaoDong_Id': "",
            'strLoaiDoiTuong_Id': edu.util.getValById('dropNS_LoaiDoiTuong'),
            'strLoaiGiangVien_Id': edu.util.getValById('dropNS_LoaiGiangVien'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropNS_CoCauToChuc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoBaoHiem': edu.util.getValById('txtNS_SoBaoHiem'),
            'strTinhTrangHonNhan_Id': edu.util.getValById('dropNS_TinhTrangHonNhan'),
            'strTinhTrangNhanSu_Id': "#",
            'strTDPT_XepLoaiTotNghiep_Id': edu.util.getValById('dropNS_XepLoaiTotnhgiep'),
            'strCongViecChinhDuocGiao': edu.util.getValById('txtNS_CongViecChinhDuocGiao'),
            'strLaCanBoNgoaiTruong': "0",
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!", 'i');
                    me.getDetail_HS();
                    me.save_AnhHoSo();
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
    getDetail_HS: function () {
        var me = main_doc.QuaTrinhCongTac;
        //view data --Edit
        var obj_detail = {
            'action': 'NS_HoSoV2/LayChiTiet',
            
            'strId': edu.system.userId
        }

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HS(data.Data[0]);
                    }
                    else {
                        me.viewForm_HS([]);
                    }
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                    
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
                
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    viewForm_HS: function (data) {
        var me = main_doc.QuaTrinhCongTac;
        //Thong tin co ban
        edu.util.viewValById("txtNS_HoDem", data.HODEM);
        edu.util.viewValById("txtNS_Ten", data.TEN);
        edu.util.viewValById("txtNS_BiDanh", data.TENGOIKHAC);
        edu.util.viewValById("txtNS_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txtNS_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txtNS_NamSinh", data.NAMSINH);
        edu.util.viewValById("txtNS_GioiTinh", data.GIOITINH_TEN);
        edu.util.viewValById("dropNS_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("dropNS_DanToc", data.DANTOC_ID);
        edu.util.viewValById("dropNS_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("dropNS_GiaDinhChinhSach", data.GIADINHCHINHSACH_ID);
        edu.util.viewValById("dropNS_ThanhPhanXuatThan", data.THANHPHANXUATTHAN_ID);
        edu.util.viewValById("dropNS_TinhTrangHonNhan", data.TINHTRANGHONNHAN_ID);
        edu.util.viewValById("uploadPicture_HS", data.ANH);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_HS").attr("src", strAnh);
        //Thong tin can bo
        edu.util.viewValById("txtNS_MaSo", data.MASO);
        edu.util.viewValById("txtNS_TinhTrangNhanSu", data.TINHTRANGNHANSU_TEN);
        edu.util.viewValById("dropNS_LoaiDoiTuong", data.LOAIDOITUONG_ID);
        edu.util.viewValById("dropNS_LoaiGiangVien", data.LOAIGIANGVIEN_ID);
        edu.util.viewValById("dropNS_CoCauToChuc", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("txtNS_CongViecChinhDuocGiao", data.CONGVIECCHINHDUOCGIAO);
        //CMND (The can cuoc), Bao hiem
        edu.util.viewValById("txtNS_SCC_So", data.CANCUOC_SO);
        edu.util.viewValById("txtNS_SCC_NgayCap", data.CANCUOC_NGAYCAP);
        edu.util.viewValById("txtNS_SCC_NoiCap", data.CANCUOC_NOICAP);
        edu.util.viewValById("txtNS_SoBaoHiem", data.SOBAOHIEM);
        //Thong tin lien lac
        edu.util.viewValById("txtNS_Email", data.EMAIL);
        edu.util.viewValById("txtNS_DienThoaiCaNhan", data.SDT_CANHAN);
        edu.util.viewValById("txtNS_DienThoaiCoQuan", data.SDT_COQUAN);
        edu.util.viewValById("txtNS_DienThoaiGiaDinh", data.SDT_GIADINH);
        //Dia chi
        edu.extend.viewTinhThanhById("txtNS_NoiSinh", data.NOISINH_TINH_ID, data.NOISINH_HUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_QueQuan", data.QUEQUAN_TINH_ID, data.QUEQUAN_HUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_HoKhauThuongTru", data.HKTT_TINH_ID, data.HKTT_HUYEN_ID, data.HKTT_XA_ID, data.HKTT_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_NoiOHienNay", data.NOHN_TINH_ID, data.NOHN_HUYEN_ID, data.NOHN_XA_ID, data.NOHN_DIACHI);
        //Dang
        edu.util.viewValById("txtNS_Dang_NgayVao", data.DANG_NGAYVAO);
        edu.util.viewValById("txtNS_Dang_NgayChinhThuc", data.DANG_NGAYCHINHTHUC);
        edu.util.viewValById("txtNS_Dang_NoiKetNap", data.DANG_NOIKETNAP);
        //Doan
        edu.util.viewValById("txtNS_Doan_NgayVao", data.DOAN_NGAYVAO);
        edu.util.viewValById("txtNS_Doan_NoiKetNap", data.DOAN_NOIKETNAP);
        //CongDoan
        edu.util.viewValById("txtNS_CongDoan_NgayVao", data.CONGDOAN_NGAYVAO);
        //QuanNgu
        edu.util.viewValById("txtNS_Ngu_NgayNhap", data.NGU_NGAYNHAP);
        edu.util.viewValById("txtNS_Ngu_NgayXuat", data.NGU_NGAYXUAT);
        edu.util.viewValById("dropNS_QuanHam", data.NGU_QUANHAM_ID);
        edu.util.viewValById("dropNS_HangThuongBinh", data.THUONGBINHHANG_ID);
        //Khac
        edu.util.viewValById("txtNS_NgayThamGiaCachMang", data.NGAYTGCACHMANG);
        edu.util.viewValById("txtNS_NgayTGTCCTXH", data.NGAYTGTOCHUCCHINHTRIXH);
        edu.util.viewValById("txtNS_TDPhoThong", data.TDPT_TOTNGHIEPLOP);
        edu.util.viewValById("txtNS_He", data.TDPT_HE);
        edu.util.viewValById("txtNS_SoTruongCongTac", data.SOTRUONGCONGTAC);
        edu.util.viewValById("dropNS_XepLoaiTotnhgiep", data.TDPT_XEPLOAITOTNGHIEP_ID);

        
    },

    save_AnhHoSo: function () {
        var me = main_doc.QuaTrinhCongTac;
        var obj_save = {
            'action': 'NS_HoSoV2/KeThua',
            

            'strNhanSu_HoSo_v2_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("img[class='user-image']").attr("src", edu.system.rootPathUpload + "//" + edu.util.getValById('uploadPicture_HS'));
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

    /*------------------------------------------
    --Discription: [2] AcessDB DieuChuyen
    -------------------------------------------*/
    save_ThuyenChuyen: function () {
        var me = this;
        var obj_notify = {};
        //--Edit

        // kiểm tra ngày ký quyết định không được lớn hơn ngày hiện tại
        //var strNgayQuyetDinh = edu.util.getValById("txtNgayKy");
        //var strHomNay = edu.util.dateToday();
        //var check = edu.util.dateCompare(strNgayQuyetDinh, strHomNay); console.log(check)
        //if (check == 1) {
        //    edu.system.alert("Ngày ký quyết định không được lớn hơn ngày hiện tại!");
        //    return;
        //}

        //var strDonViCu_Id = edu.util.getValById("dropDonViCu_TrongTruong");
        //var strDonViCu_NgoaiTruong = edu.util.getValById("txtDonViCu_NgoaiTruong");

        //if (edu.util.checkValue(strDonViCu_Id) && edu.util.checkValue(strDonViCu_NgoaiTruong)) {
        //    strDonViCu_Id = strDonViCu_Id;
        //    strDonViCu_NgoaiTruong = "";
        //}
        //else {

        //    strDonViCu_Id = strDonViCu_Id;
        //    strDonViCu_NgoaiTruong = strDonViCu_NgoaiTruong;

        //}

        //var strDonViMoi_Id = edu.util.getValById("dropDonViMoi_TrongTruong");
        //var strDonViMoi_NgoaiTruong = edu.util.getValById("txtDonViMoi_NgoaiTruong");


        //if (edu.util.checkValue(strDonViMoi_Id) && edu.util.checkValue(strDonViMoi_NgoaiTruong)) {
        //    strDonViMoi_Id = strDonViMoi_Id;
        //    strDonViMoi_NgoaiTruong = "";
        //}
        //else {

        //    strDonViMoi_Id = strDonViMoi_Id;
        //    strDonViMoi_NgoaiTruong = strDonViMoi_NgoaiTruong;
        //}

        var obj_save = {
            'action': 'NS_QT_ThuyenChuyenCanBo/ThemMoi',
            

            'strId': '',
            'strSoQuyetDinh': edu.util.getValById("txtSoQuyetDinh"),
            'strNgayQuyetDinh': edu.util.getValById("txtNgayKy"),
            'strNgayChuyen': edu.util.getValById("txtNgayChuyen"),
            'strDonViCu_Id': strDonViCu_Id,
            'strDonViMoi_Id': strDonViMoi_Id,
            'strDonViCu_NgoaiTruong': strDonViCu_NgoaiTruong,
            'strDonViMoi_NgoaiTruong': strDonViMoi_NgoaiTruong,
            'strThongTinDinhKem': edu.util.getValById("txtThongTinDinhKem"),
            'strNhanSu_ThongTinQD_Id': edu.util.getValById("dropQuyetDinh"),

            'iTrangThai': 1,
            'iThuTu': 0,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'NS_QT_ThuyenChuyenCanBo/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_TCCB");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ThuyenChuyen();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThuyenChuyen: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NS_QT_ThuyenChuyenCanBo/LayDanhSach',
            

            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.genTable_ThuyenChuyen(data.Data);
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
    getDetail_ThuyenChuyen: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'NS_QT_ThuyenChuyenCanBo/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_ThuyenChuyen(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThuyenChuyen: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_QT_ThuyenChuyenCanBo/Xoa',
            
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
                    edu.system.afterComfirm("Xóa dữ liệu thành công!");
                    me.getList_ThuyenChuyen();
                }
                else {
                    edu.system.afterComfirm(data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.afterComfirm(er);
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
	--Discription: [4]  ACESS DB ==> UngDung
    --Author: vanhiep
	-------------------------------------------*/
    popup_ThuyenChuyen: function () {
        //show
        edu.util.toggle_overide("zonecontent", "zone_input_DieuChuyen");
        //event
        //$('#myModal_TSBT').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_ThuyenChuyen: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("dropQuyetDinh", "");
        edu.util.viewValById("txtSoQuyetDinh", "");
        edu.util.viewValById("txtNgayChuyen", "");
        edu.util.viewValById("txtNgayKy", "");
        edu.util.viewValById("dropDonViCu_TrongTruong", "");
        edu.util.viewValById("txtDonViCu_NgoaiTruong", "");
        edu.util.viewValById("dropDonViMoi_TrongTruong", "");
        edu.util.viewValById("txtDonViMoi_NgoaiTruong", "");
        edu.system.viewFiles("txtThongTinDinhKem", "");
    },
    genTable_ThuyenChuyen: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThuyenChuyen",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1, 5, 6, 7, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "NGAYCHUYEN"
                },
                {
                    "mDataProp": "DONVICU_TENDONVI"
                },
                {
                    "mDataProp": "DONVICU_NGOAITRUONG"
                },
                {
                    "mDataProp": "DONVIMOI_TENDONVI"
                },
                {
                    "mDataProp": "DONVIMOI_NGOAITRUONG"
                },
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYQUYETDINH"
                },
                {
                    "mData": "LAQUATRINHHIENTAI",
                    "mRender": function (nRow, aData) {
                        if (aData.LAQUATRINHHIENTAI == "CUOICUNG") return '<span><a class="btn" id="' + aData.ID + '" title="Đây là trạng thái cuối của quá trình"><i style="font-size: 25px" class="fa fa-toggle-on color-active"></i></a></span>'
                        return '<span><a class="btn btnSetTrangThaiCuoi" id="' + aData.ID + '" title="Thiết lập trạng thái cuối cùng"><i style="font-size: 25px"  class="fa fa-toggle-off"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        if (!edu.util.checkValue(aData.THONGTINDINHKEM)) return "";
                        return '<span><a class="btn btn-default btnDownLoad" name="' + aData.THONGTINDINHKEM + '" title="Tải file đính kèm"><i class="fa fa-cloud-download color-active"></i></a></span>';
                    }
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
    viewForm_ThuyenChuyen: function (data) {
        var me = this;
        //call popup --Edit
        me.popup_ThuyenChuyen();
        //view data --Edit
        me.strCommon_Id = data.ID;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
        edu.util.viewValById("dropDonViCu_TrongTruong", data.DONVICU_ID);
        edu.util.viewValById("txtDonViCu_NgoaiTruong", data.DONVICU_NGOAITRUONG);
        edu.util.viewValById("dropDonViMoi_TrongTruong", data.DONVIMOI_ID);
        edu.util.viewValById("txtDonViMoi_NgoaiTruong", data.DONVIMOI_NGOAITRUONG);

        edu.util.viewValById("txtNgayChuyen", data.NGAYCHUYEN);
        edu.util.viewValById("dropQuyetDinh", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("txtSoQuyetDinh", data.SOQUYETDINH);
        edu.util.viewValById("txtNgayKy", data.NGAYQUYETDINH);
        //edu.system.viewFiles("txtThongTinDinhKem", data.THONGTINDINHKEM);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.system.viewFiles("txtThongTinDinhKem", data.ID, "NS_Files");
    },
    viewForm_NhanSu: function (data) {
        var me = main_doc.QuaTrinhCongTac;
        //call popup --Edit
        //me.toggle_input();
        //view data --Edit
        //me.popup_ChucVu();
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },

}