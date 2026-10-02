
function HoSoCapNhat() { }
HoSoCapNhat.prototype = {
    dtSinhVien: [],
    dtSinhVienThuocTinh: [],
    iTinhTrang: 0, 

    init: function () {
        var me = this;
        me.page_load();
        $(".btnClose").click(function () {
            me.toggle_view();
        });
        $(".btnAddnew").click(function () {
            me.toggle_edit();
            me.getList_SinhVienThuocTinh();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearchSinhVien_TuKhoa_CN").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HSSV();
            }
        });
        $("#tblSinhVien_CN").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            // 1 SV có thể học nhiều ngành → lookup theo MASO ở dòng click (2026-08-28)
            var $tr = $(this).closest('tr');
            var rowText = ($tr.text() || '').trim();
            var candidates = (me.dtSinhVien || []).filter(function (x) { return x.ID == strId; });
            var aData = candidates.find(function (x) { return x.MASO && rowText.indexOf(x.MASO) > -1; })
                || (me.dtSinhVien || []).find(function (x) { return x.MASO && rowText.indexOf(x.MASO) > -1; })
                || candidates[0]
                || (me.dtSinhVien || []).find(function (x) { return x.ID == strId; })
                || {};
            if (window.main_doc && main_doc.DeXuatHoSo && main_doc.DeXuatHoSo.openEditByPerson) {
                main_doc.DeXuatHoSo.openEditByPerson({
                    id: strId,
                    hoDem: aData.HODEM, ten: aData.TEN,
                    ngaySinh_Ngay: aData.NGAYSINH_NGAY,
                    ngaySinh_Thang: aData.NGAYSINH_THANG,
                    ngaySinh_Nam: aData.NGAYSINH_NAM || aData.BIRTH_YEAR || '',
                    anh: aData.ANH || aData.ANHCANHAN || '',
                    gioiTinh: aData.GENDER_ID || aData.GIOITINH_ID || '',
                    gioiTinhMa: aData.GIOITINH_MA || '',
                    danTocMa: aData.DANTOC_MA || '',
                    tonGiaoMa: aData.TONGIAO_MA || '',
                    quocTichMa: aData.QUOCTICH_MA || '',
                    aData: aData
                });
                return;
            }
            me.getDetail_HSSV(strId);
        });
        $("#txtSearch_SinhVien_ThuocTinh").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tblSinhVien_ThuocTinh tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        $("#tblSinhVien_ThuocTinh").delegate(".btnAdd", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/add_/g, strId);
            me.iTinhTrang = 1;
            me.getDetail_SinhVienThuocTinh(strId);
            
        });
        $("#tblSinhVien_CapNhat").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            me.iTinhTrang = 0;
            me.getDetail_SinhVienThuocTinh(strId);
            
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_view();
        $("#txtSearchSinhVien_TuKhoa_CN").focus();
        edu.util.toggle("box-sub-search");
        me.getList_HSSV();
    },
    toggle_view: function () {
        edu.util.toggle_overide("zone-bus-sinhvien", "zone_edit_view");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus-sinhvien", "zone_edit_required");
    },
    getList_HSSV: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',            

            'strTuKhoa': edu.util.getValById("txtSearchSinhVien_TuKhoa_DS"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearchSinhVien_He_DS"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearchSinhVien_Khoa_DS"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearchSinhVien_Nganh_DS"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearchSinhVien_Lop_DS"),
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
                    me.dtSinhVien = dtResult;
                    me.genTable_HSSV(dtResult, iPager);
                }
                else {
                    edu.system.alert("SV_HoSo/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {                
                edu.system.alert("SV_HoSo/LayDanhSach: " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HSSV: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtSinhVien, "ID", me.viewForm_HSSV);
    },
    /*------------------------------------------
	--Discription: [1] Access DB SinhVien
	--ULR:  Modules
	-------------------------------------------*/
    genTable_HSSV: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblSinhVien_Tong_CN", iPager);
        var jsonForm = {
            strTable_Id: "tblSinhVien_CN",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoSoCapNhat.getList_HSSV()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(data.ANH);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH_NGAY) + "/</span>";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH_THANG) + "/</span>";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH_NAM) + "</span>";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_HSSV: function (data) {
        var me = this;
        var dtSinhVien = data[0];
        //processing data
        var strHoTen = edu.util.returnEmpty(dtSinhVien.HODEM) + " " + edu.util.returnEmpty(dtSinhVien.TEN);
        var strBiDanh = edu.util.returnEmpty(dtSinhVien.BIDANH);
        var strNgaySinh = edu.util.returnEmpty(dtSinhVien.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(dtSinhVien.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(dtSinhVien.NGAYSINH_NAM);
        var strQuocTich = edu.util.returnEmpty("");
        var strGioiTinh = edu.util.returnEmpty("");
        var strDanToc = edu.util.returnEmpty("");
        var strTonGiao = edu.util.returnEmpty("");
        var strEmail = edu.util.returnEmpty(dtSinhVien.TTLL_EMAILCANHAN);
        var strDienThoai = edu.util.returnEmpty(dtSinhVien.TTLL_DIENTHOAICANHAN);
        var strQueQuan = edu.util.returnEmpty("");
        var strHoKhau = edu.util.returnEmpty("");
        var strNoiOHienNay = edu.util.returnEmpty("");
        var strDiaChiBaoTin = edu.util.returnEmpty(dtSinhVien.TTLL_KHICANBAOTINCHOAI_ODAU);

        edu.util.viewHTMLById("lblSinhVien_HoTen", strHoTen.toLocaleUpperCase());
        edu.util.viewHTMLById("lblSinhVien_BiDanh", strBiDanh);
        edu.util.viewHTMLById("lblSinhVien_NgaySinh", strNgaySinh);
        edu.util.viewHTMLById("lblSinhVien_QuocTich", strQuocTich);
        edu.util.viewHTMLById("lblSinhVien_GioiTinh", strGioiTinh);
        edu.util.viewHTMLById("lblSinhVien_DanToc", strDanToc);
        edu.util.viewHTMLById("lblSinhVien_TonGiao", strTonGiao);
        edu.util.viewHTMLById("lblSinhVien_Email", strEmail);
        edu.util.viewHTMLById("lblSinhVien_DienThoai", strDienThoai);
        edu.util.viewHTMLById("lblSinhVien_QueQuan", strQueQuan);
        edu.util.viewHTMLById("lblSinhVien_HoKhauThuongTru", strHoKhau);
        edu.util.viewHTMLById("lblSinhVien_NoiOHienNay", strNoiOHienNay);
        edu.util.viewHTMLById("lblSinhVien_DiaChiBaoTin", strDiaChiBaoTin);
    },
    getList_SinhVienThuocTinh: function () {
        var me = this;
        var obj = {
            strMaBangDanhMuc: "CMS.TTSV",
            strTenCotSapXep: "",
            iTrangThai: 1
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.process_SinhVienThuocTinh);
    },
    process_SinhVienThuocTinh: function (data) {
        var me = main_doc.HoSoCapNhat;
        if (edu.util.checkValue(data)) {
            me.dtSinhVienThuocTinh = data;
            var dtThuocTinh = [];
            var dtThuocTinhCapNhat = [];
            //process data
            for (var i = 0; i < data.length; i++) {
                if (data[i].THONGTIN5 === "0") {
                    dtThuocTinh.push(data[i]);
                }
                else {
                    dtThuocTinhCapNhat.push(data[i]);
                }
            }
            //callback
            me.genTable_SinhVienThuocTinh(dtThuocTinh);
            me.genTable_SinhVienCapNhat(dtThuocTinhCapNhat);
        }
    },
    getDetail_SinhVienThuocTinh: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtSinhVienThuocTinh, "ID", me.update_SinhVienThuocTinh);
    },
    update_SinhVienThuocTinh: function (data) {
        var me = main_doc.HoSoCapNhat;
        var dtSinhVienThuocTinh     = data[0];        
        var strThuocTinh_Ten        = dtSinhVienThuocTinh.TEN;
        var strThuocTinh_Id         = dtSinhVienThuocTinh.MA;
        var strThuocTinh_Kieu       = dtSinhVienThuocTinh.THONGTIN1;
        var strThuocTinh_Loai       = dtSinhVienThuocTinh.THONGTIN2;
        var strDanhMuc_Ma           = dtSinhVienThuocTinh.THONGTIN3;
        var strPlaceHolder          = dtSinhVienThuocTinh.THONGTIN4;
        var iThuocTinh_TinhTrang    = me.iTinhTrang;
        var strDanhMucTenBang_Id    = dtSinhVienThuocTinh.CHUNG_TENDANHMUC_ID;
        var iHang                   = dtSinhVienThuocTinh.HESO1;
        var iCotTieuDe              = dtSinhVienThuocTinh.HESO2;
        var iCotGiaTri              = dtSinhVienThuocTinh.HESO3;
        var strId                   = dtSinhVienThuocTinh.ID;
        var strMoTa                 = dtSinhVienThuocTinh.MOTA;
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_SinhVienThuocTinh();
                }
                else {
                   //
                }
                
            },
            error: function (er) {                
            },
            type: 'POST',
            action: strId ? 'CMS_DanhMucDuLieu/CapNhat' :'CMS_DanhMucDuLieu/ThemMoi',
            
            contentType: true,
            
            data: {
                'strMa'                 : strThuocTinh_Id,
                'strTen'                : strThuocTinh_Ten,
                'strCha_Id'             : "",
                'strDanhMucTenBang_Id'  : strDanhMucTenBang_Id,
                'iHeSo1'                : iHang,
                'iHeSo2'                : iCotTieuDe,
                'iHeSo3'                : iCotGiaTri,
                'strThongTin1'          : strThuocTinh_Kieu,
                'strThongTin2'          : strThuocTinh_Loai,
                'strThongTin3'          : strDanhMuc_Ma,
                'strThongTin4'          : strPlaceHolder,
                'strThongTin5'          : iThuocTinh_TinhTrang,
                'strThongTin6'          : "",
                'strMoTa'               : strMoTa,
                'strId'                 : strId,
                'iTrangThai'            : 1,
                'strNguoiThucHien_Id'   : edu.system.userId
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_SinhVienThuocTinh: function (data) {
        var me = main_doc.HoSoCapNhat;
        edu.util.viewHTMLById("lblSinhVien_ThuocTinh_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblSinhVien_ThuocTinh",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                left: [1],
                fix: [0],
                center:[0]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle btnAdd" id="add_' + aData.ID + '" href="#" title="Add"><i class="fa fa-plus color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        $('.zone-add').slimScroll({
            position: 'right',
            height: "300px",
            railVisible: true,
            alwaysVisible: false
        });
    },
    genTable_SinhVienCapNhat: function (data) {
        var me = main_doc.HoSoCapNhat;
        var jsonForm = {
            strTable_Id: "tblSinhVien_CapNhat",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                left: [1],
                fix: [0],
                center: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        $('.zone-add').slimScroll({
            position: 'right',
            height: "300px",
            railVisible: true,
            alwaysVisible: false
        });
    }
};