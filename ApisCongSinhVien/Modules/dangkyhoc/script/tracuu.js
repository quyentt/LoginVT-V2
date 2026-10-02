/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 31/05/2018 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TraCuu() { };
TraCuu.prototype = {
    strSinhVien_Id: '',
    dtLopHocPhan: [],
    dtKetQuaDK: [],
    objDoiLichHoc: '',
    arrHPDaDangKy: [],
    strHocPhan_Id: '',
    dtTinhTrangTaiChinh: [],
    iSoGiayCho: 0,
    strLopHocPhan_Id: '',
    bDKDon: true,
    strMaNhomLop: '',
    strKetQuaDangKy_Id: '',
    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        //Test
        //$("#txtAnhCaNhan").attr("src", edu.system.getRootPathImg(""));
        me.strSinhVien_Id = edu.system.userId;//'1dcef415c29c4598b6286eae7fe1ff19';
        //Switch ENd Test
        //me.getDetail_HS();
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.XACNHAN.LOAI", "", "", data => {
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "",
                    avatar: "",
                    selectOne: true,
                },
                renderPlace: ["dropLoaiXacNhan"],
                type: "",
                title: "Chọn loại xác nhận",
            };
            edu.system.loadToCombo_data(obj);
        });
        //
        me.getList_HocKy();
        //me.getList_KeHoachCaNhan();

        $('#dropSearch_HocKy').on('change', function () {
            me.getList_KeHoachCaNhan(true);
        });
        $('#dropSearch_KeHoach').on('change', function () {
            me.getList_KetQuaDangKy(true);
        });

        $("#zoneLopHocPhan,#zoneKetQuaDangKy").delegate('.btnChiTietLopHocPhan', 'click', function (e) {
            $('#myModalChiTietLich').modal('show');
            var strTenLop = $(this).attr("title");
            var strTenLop_Id = this.id;
            $("#lblChiTietHocPhan").html(strTenLop);
            me.getList_LichTuanTheoLopHocPhan(strTenLop_Id);
        });
        $("#zoneLopHocPhan,#zoneKetQuaDangKy").delegate('.btnChiTietDiemDanh', 'click', function (e) {
            $('#diem_danh').modal('show');
            var strTenLop = $(this).attr("title");
            var strTenLop_Id = this.id;
            $(".zoomfileLabel").html(strTenLop + '');
            me.getList_DiemDanh(strTenLop_Id);
        });
        $("#zoneLopHocPhan,#zoneKetQuaDangKy").delegate('.btnChiTietDiemQuaTrinh', 'click', function (e) {
            $('#diem_qua_trinh').modal('show');
            var strTenLop = $(this).attr("title");
            var strTenLop_Id = this.id;
            $(".zoomfileLabel").html(strTenLop);
            me.getList_DiemQuaTrinh(strTenLop_Id);
        });
        $("#btnXemKetQuaDangKy").click(function () {
            me.getList_KetQuaDangKy();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_TraCuu", function (addKeyValue) {
            var obj_save = {
                'strDangKy_KeHoachDangKy_Id': edu.util.getValById("dropSearch_KeHoach"),
                'strQLSV_NguoiHoc_Id': main_doc.TraCuu.strSinhVien_Id,
            };
            for (variable in obj_save) {
                addKeyValue(variable, obj_save[variable]);
            }
        });

        $("#zoneKetQuaDangKy").delegate('.btnXacNhanDKH', 'click', function (e) {
            var strId = this.id;
            me.strKetQuaDangKy_Id = strId;
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            var aData = me.dtKetQuaDK.find(e => me.strKetQuaDangKy_Id == e.ID);
            var strSanPham = aData.DANGKY_KEHOACHDANGKY_ID + aData.DAOTAO_HOCPHAN_ID + aData.QLSV_NGUOIHOC_ID + aData.KIEUHOC_ID + aData.DAOTAO_THOIGIANDAOTAO_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID;
            me.getList_XacNhan(strSanPham, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $("#btnXacNhanTatCa").click(function () {
            var arrChecked_Id = me.getArrCheckedIds("zoneKetQuaDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me.strKetQuaDangKy_Id = arrChecked_Id;
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            $("#tblModal_XacNhan tbody").html("");
            me.strLoaiXacNhan = "";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            //var aData = me.dtKetQuaDK.find(e => me.strKetQuaDangKy_Id == e.ID);
            //var strSanPham = aData.DANGKY_KEHOACHDANGKY_ID + aData.DAOTAO_HOCPHAN_ID + aData.QLSV_NGUOIHOC_ID + aData.KIEUHOC_ID + aData.DAOTAO_THOIGIANDAOTAO_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID;
            //me.getList_XacNhan(strSanPham, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });

        
        $(".btnSave_XacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropTrangThaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");

            $("#modal_XacNhan").modal('hide');
            if (Array.isArray(me.strKetQuaDangKy_Id)) {
                me.strKetQuaDangKy_Id.forEach(eSV => {
                    var aData = me.dtKetQuaDK.find(e => eSV == e.ID);
                    var strSanPham = aData.DANGKY_KEHOACHDANGKY_ID + aData.DAOTAO_HOCPHAN_ID + aData.QLSV_NGUOIHOC_ID + aData.KIEUHOC_ID + aData.DAOTAO_THOIGIANDAOTAO_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID;
                    me.save_XacNhanSanPham(strSanPham, strTinhTrang, strMoTa);
                })
            } else {
                var aData = me.dtKetQuaDK.find(e => me.strKetQuaDangKy_Id == e.ID);
                var strSanPham = aData.DANGKY_KEHOACHDANGKY_ID + aData.DAOTAO_HOCPHAN_ID + aData.QLSV_NGUOIHOC_ID + aData.KIEUHOC_ID + aData.DAOTAO_THOIGIANDAOTAO_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID;
                me.save_XacNhanSanPham(strSanPham, strTinhTrang, strMoTa);
            }
        });


        $('#dropLoaiXacNhan').on('select2:select', function (e) {
            me.getList_TrangThaiXacNhan();
        });
    },
    
    getList_KetQuaDangKy: function (bLoad) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4CiQ1EDQgBSAvJgo4DS4xCS4iESkgLwPP',
            'func': 'pkg_dangkyhoc_chung.LayKetQuaDangKyLopHocPhan',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': "",
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById("dropSearch_KeHoach"),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),

            //'action': 'DKH_Chung/LayKetQuaDangKyLopHocPhan',
            //'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            //'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            //'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            //'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            //'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKetQuaDK = data.Data;
                    $("#lblSoNguoiDangKy").html(edu.util.returnZero(data.Data.length));
                    if (data.Data.length > 0) {
                        $("#lblSoTinDaDangKy").html(edu.util.returnEmpty(data.Data[0].SOTINCHIDADANGKY));
                    }
                    var row = "";
                    me.dtKetQuaDK.forEach(e => {
                        row += '<li>';
                        row += '<p>';
                        row += edu.util.returnEmpty(e.DANGKY_LOPHOCPHAN_TEN) + '<span class="price">' + edu.util.formatCurrency(e.PHISAUKHITRUMIEN) + ' đ</span>';
                        row += '</p>';
                        row += '<p>-<span class="text-t">T' + edu.util.returnEmpty(e.THUHOC_TIETHOC) + '</span></p>';
                        row += '</li>';
                    });
                    $("#zoneDaDangKy").html(row);
                    me.genList_KetQuaDangKy(data.Data);//11
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
    genList_KetQuaDangKy: function (data) {
        var me = this;

        //data.sort((a, b) => {
        //    if (a.DAOTAO_HOCPHAN_TEN < b.DAOTAO_HOCPHAN_TEN) return true;
        //    else if (a.DAOTAO_HOCPHAN_TEN === b.DAOTAO_HOCPHAN_TEN) {
        //        if (a.DANGKY_LOPHOCPHAN_TEN > b.DANGKY_LOPHOCPHAN_TEN) return true;
        //    }
        //    return false;
        //});

        var row = '';
        var tempHocPhan = "";
        var mau = '';
        row += '<div id="zonemasonrybq">';
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            //if (i !== 0 && i % 4 === 0) {
            //    row += '<div class="clear"></div>';
            //}
            if (aData.DAOTAO_HOCPHAN_ID !== tempHocPhan) {
                tempHocPhan = aData.DAOTAO_HOCPHAN_ID;
                mau ? mau = '' : mau = 'background-color: #63e55c';
                row += '<div class="subject-item">';
                row += '<div class="d-flex align-items-center">';
                row += '<h4>Môn ' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</h4>';
                row += '<div class="d-flex mb-2 mt-1 justify-content-end flex-shrink-0 ms-auto">';
                row += '<button class="btnXacNhanDKH btn btn-white" id="' + aData.ID + '"> Xác nhận kết quả đăng ký</button> <input type="checkbox" checked="checked" id="checkX' + aData.ID + '"/>';
                row += '</div></div>';
            }

            row += '<div class="classroom-section-item">';
            row += '<div class="box-classroom-section box-shadow">';
            row += '<div class="lable">';
            row += '<a href="#" id="lblTenLop' + aData.ID + '" name="' + aData.DANGKY_LOPHOCPHAN_ID + '"  title="' + edu.util.returnEmpty(aData.DANGKY_LOPHOCPHAN_TEN) + '" class="btnChiTietLopHocPhan" style="cursor: pointer" >';
            row += edu.util.returnEmpty(aData.DANGKY_LOPHOCPHAN_TEN);
            row += '</a>';
            row += '</div>';
            row += '<div class="classroom-detail d-flex ">';
            row += '<div class="classroom-detail-sum">';
            row += '<p class= "' + edu.util.returnEmpty(aData.MANHOMLOP) + '">' + edu.util.returnEmpty(aData.THUOCTINHLOP_TEN) + '</p>';
            row += '<p>Tổng số: ' + edu.util.returnEmpty(aData.SOLUONGDUKIENHOC) + '</p>';
            row += '<p>Đã đăng ký: ' + edu.util.returnEmpty(aData.SOTHUCTEDANGKYHOC) + '</p>';
            row += '</div>';
            row += '<div class="classroom-day">';
            row += '<p>' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' - ' + edu.util.returnEmpty(aData.NGAYKETTHUC) + '</p>';
            row += '<p>Thứ: ' + edu.util.returnEmpty(aData.THUHOC) + '</p>';
            row += '<p></p>';
            row += '</div>';
            row += '</div>';
            row += '<div class="classroom-button d-flex justify-content-between">';
            row += '<div class="price"><b>' + edu.util.formatCurrency(aData.PHISAUKHITRUMIEN) + '</b> đ</div>';
            row += '<div class="btn-group">';
            row += '<button class="btn btn-view-detail btnChiTietDiemDanh" id="' + aData.DANGKY_LOPHOCPHAN_ID + '" title="' + aData.DANGKY_LOPHOCPHAN_TEN + '">Điểm danh</button>';
            row += '<button class="btn btn-view-detail btnChiTietDiemQuaTrinh" id="' + aData.DANGKY_LOPHOCPHAN_ID + '" title="' + aData.DANGKY_LOPHOCPHAN_TEN + '">Điểm quá trình</button>';
            row += '<button class="btn btn-view-detail btnChiTietLopHocPhan" id="' + aData.DANGKY_LOPHOCPHAN_ID + '" title="' + aData.DANGKY_LOPHOCPHAN_TEN +'">Chi tiết</button>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
            
            if (i == data.length - 1 || aData.DAOTAO_HOCPHAN_ID != data[i + 1].DAOTAO_HOCPHAN_ID) row += '</div>';
            
        }
        row += '</div>';
        $("#zoneKetQuaDangKy").html(row);
        
    },

    getList_HocKy: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin_MH/DSA4FSkuKAYoIC8FIC8mCjgCIA8pIC8P',
            'func': 'pkg_dangkyhoc_thongtin.LayThoiGianDangKyCaNhan',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HocKy(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_HocKy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: "",
                selectFirst: true,
            },
            renderPlace: ["dropSearch_HocKy"],
            type: "",
            title: "Chọn học kỳ",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachCaNhan: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_ThongTin_MH/DSA4BRIKJAkuICIpBSAvJgo4AiAPKSAv',
            'func': 'pkg_dangkyhoc_thongtin.LayDSKeHoachDangKyCaNhan',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KeHoachCaNhan(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_KeHoachCaNhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        };
        edu.system.loadToCombo_data(obj);
        me.getList_KetQuaDangKy();
    },

    getList_LichTuanTheoLopHocPhan: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4DSgiKRU0IC8VKSQuDS4xCS4iESkgLwPP',
            'func': 'pkg_dangkyhoc_chung.LayLichTuanTheoLopHocPhan',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDangKy_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_LichTuanTheoLopHocPhan(dtReRult);
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
    genTable_LichTuanTheoLopHocPhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichHoc",
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "BUOIHOC"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "THUHOC"
                },
                {
                    "mDataProp": "SOTIET"
                },
                {
                    "mDataProp": "TIETBATDAU"
                },
                {
                    "mDataProp": "TIETKETTHUC"
                },
                {
                    "mDataProp": "PHONGHOC_TEN"
                },
                {
                    "mDataProp": "GIANGVIEN"
                },
                {
                    "mDataProp": "THUOCTINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },


    getList_DiemDanh: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLAUgLykP',
            'func': 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemDanh',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DiemDanh(dtReRult);
                }
                else {
                    edu.system.alert( " : " + data.Message, "s");
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
    genTable_DiemDanh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiemDanh",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4],
            },
            aoColumns: [
                
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ngày học:</em><span>' + edu.util.returnEmpty(aData.NGAYGHINHAN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><em class="show-in-mobi">Tiết bắt đầu <i class="fas fa-arrow-right"></i>Tiết kết thúc</th>:</em>' + edu.util.returnEmpty(aData.TIETBATDAU) + ' <i class="fas fa-arrow-right"></i> ' + edu.util.returnEmpty(aData.TIETKETTHUC) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Trạng thái:</em><span>' + edu.util.returnEmpty(aData.KIEUCHUYENCAN_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số tiết:</em><span>' + edu.util.returnEmpty(aData.SOLUONG) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data.length > 0) {
            console.log(data[0].TINHTRANGDUYETDKTHI_TEN);
            $(".zoomTinhTrangLabel").html(data[0].TINHTRANGDUYETDKTHI_TEN);
        }
        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },

    getList_DiemQuaTrinh: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLBA0IBUzKC8p',
            'func': 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemQuaTrinh',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DiemQuaTrinh(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert( " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DiemQuaTrinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiemQuaTrinh",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại điểm:</em><span>' + edu.util.returnEmpty(aData.DIEM_THANHPHANDIEM_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Kết quả:</em><span>' + edu.util.returnEmpty(aData.DIEM) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },


    getList_TrangThaiXacNhan: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_XacNhan_MH/DSA4BRIJIC8pBS4vJhkgIg8pIC8P',
            'func': 'PKG_DANGKY_XACNHAN.LayDSHanhDongXacNhan',
            'iM': edu.system.iM,
            'strLoaiXacNhan_Id': edu.system.getValById('dropLoaiXacNhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_TrangThai(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_TrangThai: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropTrangThaiXacNhan"],
            type: "",
            title: "Chọn trạng thái",
        };
        edu.system.loadToCombo_data(obj);
    },

    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
		var obj_save = {
			'action': 'DKH_XacNhan_MH/FSkkLB4FIC8mCjgeGSAiDykgLx4KJDUQNCAP',
			'func': 'PKG_DANGKY_XACNHAN.Them_DangKy_XacNhan_KetQua',
			'iM' : edu.system.iM,
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strLoaiXacNhan_Id': edu.system.getValById('dropLoaiXacNhan'),
            'strHanhDong_Id': strTinhTrang_Id,
            'strDuLieuXacNhan': strSanPham_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_BtnXacNhanSanPham: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/DSA4BRIJIC8pBS4vJhkgIg8pIC8P',
            'func': 'PKG_DIEM_CHUNG.LayDSHanhDongXacNhan',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data, strZoneXacNhan_Id);
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
    loadBtnXacNhan: function (data) {
        main_doc.KeHoachXuLy.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'DKH_XacNhan_MH/DSA4BRIFIC8mCjgeGSAiDykgLx4KJDUQNCAP',
            'func': 'PKG_DANGKY_XACNHAN.LayDSDangKy_XacNhan_KetQua',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': edu.util.getValById("dropLoaiXacNhan"),
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "HANHDONG_TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getArrCheckedIds: function (strTable_Id, strPrefix_id) {
        var me = this;
        var arrTable_Id = [];
        $('#' + strTable_Id).find(":checkbox[id^='" + strPrefix_id + "']:checked").each(function () {
            arrTable_Id.push(this.id.replace(strPrefix_id, ""));
        });
        return arrTable_Id;
    },
}