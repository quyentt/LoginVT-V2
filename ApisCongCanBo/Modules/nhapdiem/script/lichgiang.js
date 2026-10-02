/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function LichGiang() { };
LichGiang.prototype = {
    strThongTin_Id: '',
    dtThongTin: [],
    iNgayBatDau: 0,
    strGiangVien_Id: '',
    arrDay: [],
    dtLichHoc: [],
    strLichHoc_Id: '',
    dtKieuChuyenCan: [],
    dtSinhVien: [],
    strNgayBatDau: '',
    strNgayKetThuc: '',
    strlblHocPhan: '',
    dtTKBKhongLichChiTiet: [],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system 
        -------------------------------------------*/
        me.strGiangVien_Id = edu.system.userId;
        me.getList_CamXuc();
        me.strGiangVien_Id = main_doc.InBangDiem.strSinhVien_Id;
        $("#lblSinhVien").html(main_doc.InBangDiem.strSinhVien)
        //me.getList_ThongTin();
        var date = new Date();
        var nMonth = date.getMonth() + 1;
        var nYear = date.getFullYear();

        $("#nam").attr("title", nYear);
        $("#nam").html(nYear);

        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);
        me.genHtml_Month(0);
        // Vẽ bảng ngay khi mở panel để luôn thấy bảng + thông báo (2026-09-17)
        me.renderTable_TKBLopKhongCoLichChiTiet(null, "init");

        $(".days").delegate(".poiter", "click", function () {
            $(".days .active").removeClass("active");
            $("#datebody").html("");
            this.classList.add("active");
            var strNgayBatDau = $(this).attr('batdau');
            var strNgayKetThuc = $(this).attr('ketthuc');
            var strNgayDangChon = $(this).attr('title');
            me.strNgayBatDau = strNgayBatDau;
            me.strNgayKetThuc = strNgayKetThuc;
            me.getList_TuanHienTai(strNgayBatDau, strNgayKetThuc, strNgayDangChon);
            me.getList_TKBLopKhongCoLichChiTiet(strNgayDangChon);
            var strClass = $(this).attr('name');
            strClass = $("." + strClass);
            var html = '';
            html += '<div class="date">';
            html += '<i class="fal fa-clock day color-66"></i>';
            html += '<p class="m-0 text">GMT+7</p>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[0]).attr('title') + '</div>';
            html += '<div class="text">Mon</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[1]).attr('title') + '</div>';
            html += '<div class="text">Tue</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[2]).attr('title') + '</div>';
            html += '<div class="text">Wed</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[3]).attr('title') + '</div>';
            html += '<div class="text">Thu</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[4]).attr('title') + '</div>';
            html += '<div class="text">Fri</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[5]).attr('title') + '</div>';
            html += '<div class="text">Sat</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[6]).attr('title') + '</div>';
            html += '<div class="text">Sun</div>';
            html += '</div>';
            html += '</div>';

            $("#date-header").html(html);
            me.arrDay = [];
            for (var i = 0; i < strClass.length; i++) {
                if (i > 6) break;
                me.arrDay.push($(strClass[i]).attr('title').replace(/\//g, ''));
            }
        });
        $(".month").delegate(".prev", "click", function () {
            me.genHtml_Month(-1);
        });
        $(".month").delegate(".next", "click", function () {
            me.genHtml_Month(1);
        });

        $("#tblThongTin").delegate(".btnXacNhan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có đồng ý xác nhận thời điểm vào lớp không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(strId);
            });
        });
        $("#tblThongTin").delegate(".btnXacNhan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có đồng ý xác nhận thời điểm vào lớp không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(strId);
            });
        });

        $("#datebody").delegate(".btnLichHoc", "click", function () {
            var strId = this.id;
            me.strLichHoc_Id = strId;
            $("#my_calendar").modal("show");
            var objLich = me.dtLichHoc.find(e => e.ID === strId);
            $("#lblLopHocPhan").html('<b>Lớp: ' + objLich.TENLOPHOCPHAN + '</b> <span class="color-66 fs-14"> (Phòng học: ' + objLich.TENPHONGHOC + ')</span>');
            $("#lblHocPhan").html('<b>Học phần: ' + objLich.TENHOCPHAN + '</b> <span class="color-66">&ensp; - &ensp; ' + me.returnTwo(objLich.GIOBATDAU) + ':' + me.returnTwo(objLich.PHUTBATDAU) + ' - ' + me.returnTwo(objLich.GIOKETTHUC) + ':' + me.returnTwo(objLich.PHUTKETTHUC) + ' (Tiết ' + edu.util.returnEmpty(objLich.TIETBATDAU) + '-' + edu.util.returnEmpty(objLich.TIETKETTHUC) + ') &ensp;&ensp; <b>' + edu.util.returnEmpty(objLich.THONGTINCHUYENCAN) + '</b></span>');
            me.strlblHocPhan = $("#lblHocPhan").html();
            me.getList_SinhVien(strId);
        });
        $("#datebody").delegate(".btnLichThi", "click", function () {
            var strId = this.id;
            me.strLichHoc_Id = strId;
            $("#modal_LichThi").modal("show");
            var objLich = me.dtLichHoc.find(e => e.ID === strId);
            $("#lblHocPhanThi").html(objLich.TENHOCPHAN);
            $("#lblHinhThucThi").html(objLich.DANGKY_LOPHOCPHAN_TEN);
            $("#lblPhongThi").html(objLich.PHONGHOC_TEN);
            $("#lblNgayThi").html(objLich.NGAYHOC);
            $("#lblGioThi").html(objLich.GIOBATDAU + "h" + objLich.PHUTBATDAU + " - " + objLich.GIOKETTHUC + "h" + objLich.PHUTKETTHUC);
            me.getList_LichThi(objLich.NGAYHOC);
        });

        $("#datebody").delegate('.task-1', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            //console.log(point.clientHeight)
            //console.log(point.scrollHeight)
            let element = $(point).find(".task-description")[0];
            //console.log($(point).find(".task-description")[0].clientHeight)
            //console.log($(point).find(".task-description")[0].scrollHeight)
            if (element.scrollHeight <= element.clientHeight) return;
            var row = $(point).parent().html().replace('class="task-header"', '');
            row = row.substring(0, row.indexOf('<div class="eval"'))
            $(point).popover({
                container: 'body',
                content: row,
                trigger: 'hover',
                html: true,
                placement: 'right',
            });
            $(point).popover('show');
            //me.popover_HSDoiTuong(id, point);
        });
        $("#datebody").delegate(".eval", "click", function (event) {
            event.stopImmediatePropagation();
        });
        $("#datebody").delegate(".btnEmoChange", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.parentNode.parentNode.parentNode.parentNode.parentNode.id;
            var strEmo = $(this).attr("name");
            me.save_ThayDoiCamXuc(strId, strEmo)
        });
        $("#datebody").delegate(".btnEmoPlus", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.parentNode.parentNode.parentNode.id;
            var strEmo = $("#" + strId + " #mainicon").attr("name");
            me.save_TangCamXuc(strId, strEmo)
        });
        $("#datebody").delegate(".btnEmoMinus", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.parentNode.parentNode.parentNode.id;
            var strEmo = $("#" + strId + " #mainicon").attr("name");
            me.save_GiamCamXuc(strId, strEmo)
        });

        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.KIEUCHUYENCAN", "", "", data => {
        //    me.dtKieuChuyenCan = data;
        //    var row = '';
        //    data.forEach(e => {
        //        row += '<th class="td-center">' + e.TEN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + e.ID + '"></th>';
        //    });

        //    $("#tblNhapChuyenCan thead tr:eq(0)").append(row);
        //});
        $("#tblNhapChuyenCan").delegate(".chkSelectAll", "click", function (e) {

            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".checkNgay" + strClass).each(function () {
                this.checked = checked_status;
            });
        });

        $("#btnSaveChuyenCan").click(function () {
            me.save_TuGhiNhan();
            //var arrThem = [];
            //var arrXoa = [];
            //var x = $("#tblNhapChuyenCan .checkChuyenCan");
            //for (var i = 0; i < x.length; i++) {
            //    if ($(x[i]).is(':checked')) {
            //        if ($(x[i]).attr("name") == undefined) {
            //            arrThem.push(x[i]);
            //        } else {
            //            var inputcheck = $("#" + x[i].id.replace("chkSelect", "input_"));
            //            if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
            //        }
            //    }
            //    else {
            //        if ($(x[i]).attr("name") != undefined) {
            //            arrXoa.push(x[i]);
            //        }
            //    }
            //}
            //if ((arrThem.length + arrXoa.length) > 0) {
            //    //edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " và hủy " + arrXoa.length + "?");
            //    //$("#btnYes").click(function (e) {

            //    //});
            //    //edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
            //    for (var i = 0; i < arrThem.length; i++) {
            //        me.save_NhapChuyenCan(arrThem[i]);
            //    }
            //    for (var i = 0; i < arrXoa.length; i++) {
            //        me.delete_NhapChuyenCan(arrXoa[i]);
            //    }
            //}
            //else {
            //    //edu.system.alert("Không có thay đổi lưu");
            //}
        });

        $("#btnDiemDanhTuDong").click(function () {
            me.save_DiemDanhTuDong();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_LichGiang", function (addKeyValue) {
            var obj_save = {
                'strNhanSu_HoSoCanBo_Id': main_doc.LichGiang.strGiangVien_Id,
                'strNgayBatDau': main_doc.LichGiang.strNgayBatDau,
                'strNgayKetThuc': main_doc.LichGiang.strNgayKetThuc,
            };
            for (variable in obj_save) {
                addKeyValue(variable, obj_save[variable]);
            }
        });
    },
    /*------------------------------------------
    --Discription: Lớp học phần không có lịch chi tiết (2026-09-17)
    --Origin: PKG_CONGTHONGTIN_HSSV_THONGTIN.LayTKBLopKhongCoLichChiTiet
    --Note: strGiangVien_Id ở panel này là strSinhVien_Id của InBangDiem (xem init), nên
            dùng API phía sinh viên giống cổng SV.
    -------------------------------------------*/
    getList_TKBLopKhongCoLichChiTiet: function (strNgay) {
        var me = this;
        if (!strNgay) {
            me.dtTKBKhongLichChiTiet = [];
            me.renderTable_TKBLopKhongCoLichChiTiet([]);
            return;
        }

        me.renderTable_TKBLopKhongCoLichChiTiet(null, "loading");

        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4FQoDDS4xCikuLyYCLg0oIikCKSgVKCQ1',
            'func': 'PKG_CONGTHONGTIN_HSSV_THONGTIN.LayTKBLopKhongCoLichChiTiet',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strGiangVien_Id,
            'strNgay': strNgay,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtTKBKhongLichChiTiet = data.Data || [];
                    me.renderTable_TKBLopKhongCoLichChiTiet(me.dtTKBKhongLichChiTiet);
                }
                else {
                    me.dtTKBKhongLichChiTiet = [];
                    me.renderTable_TKBLopKhongCoLichChiTiet(null, "error", data.Message);
                }
            },
            error: function (er) {
                me.dtTKBKhongLichChiTiet = [];
                me.renderTable_TKBLopKhongCoLichChiTiet(null, "error", "Lỗi tải dữ liệu");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    renderTable_TKBLopKhongCoLichChiTiet: function (data, strTrangThai, strThongBao) {
        var me = this;
        var $tbody = $("#tblTKBKhongLichChiTiet tbody");
        if ($tbody.length === 0) return;
        $("#zoneTKBKhongLichChiTiet").show();

        var fnEmpty = function (strIcon, strMau, strNoiDung) {
            return ''
                + '<tr class="empty-state-row">'
                + '<td colspan="6" style="text-align:center; padding:36px 16px; border:none;">'
                + '<div style="display:inline-block; padding:18px 28px; background:#fafbff; border:1px dashed #d9deeb; border-radius:14px; color:#7a8499;">'
                + '<i class="' + strIcon + '" style="font-size:42px; color:' + strMau + '; display:block; margin-bottom:8px;"></i>'
                + '<div style="font-size:14px;">' + strNoiDung + '</div>'
                + '</div>'
                + '</td>'
                + '</tr>';
        };

        if (strTrangThai === "init") {
            $tbody.html(fnEmpty("fal fa-calendar-day", "#b8c0d4",
                "Chọn một ngày trên lịch để xem lớp học phần không có lịch chi tiết"));
            return;
        }
        if (strTrangThai === "loading") {
            $tbody.html(fnEmpty("fas fa-spinner fa-spin", "#3b82f6", "Đang tải dữ liệu..."));
            return;
        }
        if (strTrangThai === "error") {
            $tbody.html(fnEmpty("fas fa-exclamation-triangle", "#f59e0b",
                edu.util.returnEmpty(strThongBao) || "Lỗi tải dữ liệu"));
            return;
        }

        if (!data || data.length === 0) {
            $tbody.html(fnEmpty("fal fa-users-class", "#b8c0d4",
                "Hiện tại chưa có lớp học phần (không có lịch chi tiết) nào"));
            return;
        }

        var html = '';
        for (var i = 0; i < data.length; i++) {
            var a = data[i] || {};
            var maLop = a.MA_LOP || a.MALOP || a.MA || a.MA_LOPHOCPHAN || a.LOP_MA || '';
            var tenLop = a.TEN_LOP || a.TENLOP || a.TEN || a.TENLOPHOCPHAN || a.LOP_TEN || '';
            var hinhThuc = a.HINHTHUC_HOC || a.HINHTHUC || a.HINHTHUCHOC || a.HINH_THUC_HOC || '';
            var ngayBatDau = a.NGAYBATDAU || a.TU_NGAY || a.TUNGAY || a.NGAY_BAT_DAU || '';
            var ngayKetThuc = a.NGAYKETTHUC || a.DEN_NGAY || a.DENNGAY || a.NGAY_KET_THUC || '';
            var ghiChu = a.GHICHU || a.GHI_CHU || a.NOTE || a.GHICHU_TEN || '';

            html += '<tr>';
            html += '<td>' + edu.util.returnEmpty(maLop) + '</td>';
            html += '<td>' + edu.util.returnEmpty(tenLop) + '</td>';
            html += '<td>' + edu.util.returnEmpty(hinhThuc) + '</td>';
            html += '<td>' + edu.util.returnEmpty(ngayBatDau) + '</td>';
            html += '<td>' + edu.util.returnEmpty(ngayKetThuc) + '</td>';
            html += '<td>' + edu.util.returnEmpty(ghiChu) + '</td>';
            html += '</tr>';
        }
        $tbody.html(html);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_TuanHienTai: function (strNgayBatDau, strNgayKetThuc) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRINKCIpAiAPKSAv',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSLichCaNhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strGiangVien_Id,
            'strNgayBatDau': strNgayBatDau,
            'strNgayKetThuc': strNgayKetThuc,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //if (dtReRult.length > 0) {
                    //    var aData = dtReRult[0];
                    //    $("#lblNgayHienTai").html("Thứ " + edu.util.returnEmpty(aData.THU) + ", ngày " + edu.util.returnEmpty(aData.NGAY));
                    //}
                    me.dtLichHoc = dtReRult;
                    me.genTable_ThongTin(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);

        var obj_save = {
            'action': 'NS_ThongTinCanBo_MH/DSA4BRIFIC8mCjgJLiIecwPP',
            'func': 'pkg_congthongtincanbo.LayDSDangKyHoc_2',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
            'strReport_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = dtReRult;
                    me.genTable_SinhVien(dtReRult, data.Pager);
                    console.log(dtReRult.find(e => e.QLSV_NGUOIHOC_ID == me.strGiangVien_Id));
                    var aData = dtReRult.find(e => e.QLSV_NGUOIHOC_ID == me.strGiangVien_Id).SOBUOIVANG;
                    console.log(aData)
                    if (aData) {
                        $("#lblHocPhan").html(me.strlblHocPhan + '<br/> Vắng mặt(Số buổi/Số tiết/Tỷ lệ): <b>' + aData + '</b>')
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        var objSinhVien = data.find(e => e.QLSV_NGUOIHOC_ID == me.strGiangVien_Id);
        if (objSinhVien) {
            $("#txtTuKhoaDiemDanh").val(objSinhVien.MATLENHNGUOIHOC);
        } else
            $("#txtTuKhoaDiemDanh").val("");
        var jsonForm = {
            strTable_Id: "tblNhapChuyenCan",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                }
            ]
        };
        //for (var i = 0; i < me.dtKieuChuyenCan.length; i++) {
        //    jsonForm.aoColumns.push({
        //        "mRender": function (nRow, aData) {
        //            var iThuTu = edu.system.icolumn++;
        //            return '<input type="checkbox" class="checkChuyenCan checkSV' + aData.ID + ' checkNgay' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID + '" id="chkSelect' + aData.ID + '_' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID+ '"  />'
        //                + '<input style="width: calc(100% - 100px); float: right" id="input_' + aData.ID + '_' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID + '" />';
        //        }
        //    });
        //    jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        //}

        edu.system.loadToTable_data(jsonForm);
        //edu.system.genHTML_Progress("divprogessquanso", data.rs.length * data.rsNgay.length);
        //me.getData_NhapChuyenCan();
    },
    getData_NhapChuyenCan: function (jsonSV, strNgay_ID, strNgay) {
        var me = this;
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_CC_ThongTin_MH/DSA4CiQ1EDQgFSkkLgooJDQCKTQ4JC8CIC8P',
            'func': 'PKG_CHUYENCAN_THONGTIN.LayKetQuaTheoKieuChuyenCan',
            'iM': edu.system.iM,
            'strKieuChuyenCan_Id': edu.util.getValById('dropAAAA'),
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': 0,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].GIATRI == 1) {
                            var check = $("#chkSelect" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].GIATRI);
                            var inputCheck = $("#input_" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                            inputCheck.val(dtReRult[i].SOLUONG);
                            inputCheck.attr("name", dtReRult[i].SOLUONG);
                        }
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                //edu.system.alert(JSON.stringify(er), "w");
                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'POST',
            action: obj_save.action,

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
    genTable_ThongTin: function (data, iPager) {
        var me = this;
        var iGioMin = 24;
        var iGioMax = 0;
        data.forEach(e => {
            if (e.GIOBATDAU < iGioMin) iGioMin = e.GIOBATDAU;
            if (e.GIOKETTHUC > iGioMax) iGioMax = e.GIOKETTHUC;
        });
        var html = '<div class="date">';
        for (var i = iGioMin; i < iGioMax + 2; i++) {
            html += '<div class="hour-row">' + i + ':00</div>';
        }
        html += '</div>';
        for (var j = 0; j < me.arrDay.length; j++) {
            html += '<div class="day-of-week" id="row' + me.arrDay[j] + '">';
            for (var i = iGioMin; i < iGioMax + 2; i++) {
                html += '<div class="hour-row" id="h' + me.arrDay[j] + i + '"></div>';
            }
            html += '</div>';
        }
        $("#datebody").html(html);

        var arrMau = ["#223771", "#f26522", "#ec4c00", "#5a7adb", "#3c5398"];
        var iRowPx = 100; // phải khớp với .hour-row { height } trong lichhoc.html (60 phút = iRowPx px)
        var iScale = iRowPx / 60;
        data.forEach((e, nRow) => {
            var html = '';
            var iTop = (e.GIOKETTHUC * 60 + e.PHUTKETTHUC - e.GIOBATDAU * 60 - e.PHUTBATDAU) * iScale;
            var temp = e.PHANLOAI == "LICHTHI" ? "btnLichThi" : "btnLichHoc";

            html += '<div class="task task-1 ' + temp + '" id="' + e.ID + '" style="top:' + (e.PHUTBATDAU * iScale) + 'px; height: ' + iTop + 'px; background-color: ' + arrMau[nRow % 5] + '; cursor: pointer">';
            //html += '<div class="client">';
            html += '<div class="task-header">';
            html += '<div class="text">';
            temp = e.PHANLOAI == "LICHTHI" ? "Lịch thi: " + e.TENHOCPHAN : e.TENHOCPHAN;
            html += '<div class="title">' + temp + '</div>';
            temp = e.PHANLOAI == "LICHTHI" ? edu.util.returnEmpty(e.CATHI) : 'Tiết ' + edu.util.returnEmpty(e.TIETBATDAU) + '-' + edu.util.returnEmpty(e.TIETKETTHUC);
            html += '<div class="task-date">' + me.returnTwo(e.GIOBATDAU) + ':' + me.returnTwo(e.PHUTBATDAU) + ' - ' + me.returnTwo(e.GIOKETTHUC) + ':' + me.returnTwo(e.PHUTKETTHUC) + ' (' + temp + ')</div>';
            html += '</div>';
            //html += '<div class="title">' + e.TENHOCPHAN + '</div>';
            //html += '<div class="task-date">' + e.TIETBATDAU + ' - ' + e.TIETKETTHUC + '</div>';
            //html += '</div>';
            html += '</div>';
            html += '<div class="task-description">';
            html += e.TENLOPHOCPHAN ? e.TENLOPHOCPHAN + "<br/>" : "";
            html += e.TENPHONGHOC ? edu.util.returnEmpty(e.TENPHONGHOC) + "<br/>" : "";
            html += e.GIANGVIEN ? edu.util.returnEmpty(e.GIANGVIEN) : "";
            html += '<div class="eval">';
            html += '<i class="eval-minus fal fa-minus btnEmoMinus"></i>';
            html += '<div class="eval-icon">';
            html += '<span id="lblSoLuong' + e.ID + '"></span>';
            html += '<img id="mainicon" name="emoji1" src="assets/images/eval-emoji/1.png" alt="">';
            //html += '<div class="eval-icon-list" ><div class="item btnEmoChange" name="4AA5E457B3F74AD1A1A7F7310B41544F"><img src="assets/images/eval-emoji/happy.png.png" alt=""><span>undefined</span></div><div class="item btnEmoChange" name="6A36858F671A43CEAE6DDDAEDF443A31"><img src="assets/images/eval-emoji/neutral.png.png" alt=""><span>undefined</span></div><div class="item btnEmoChange" name="3FC3A490EB374C3EAFE9E512050171B6"><img src="assets/images/eval-emoji/unhappy.png.png" alt=""><span>undefined</span></div>';
            html += '<div class="eval-icon-list" id="listIcon' + e.ID + '">';
            html += me.strCamXuc;
            //html += '<div class="item">';
            //html += '<img src="assets/images/eval-emoji/1.png" alt="">';
            //html += '<span>5</span>';
            //html += '</div>';
            html += '</div>';

            html += '</div>';
            html += '<i class="eval-plus fal fa-plus btnEmoPlus"></i>';
            html += '</div>';

            html += '</div>';
            //html += '</div>';
            html += '</div>';
            $("#datebody #h" + e.NGAYHOC.replace(/\//g, '') + e.GIOBATDAU).append(html);
        });
        data.forEach(e => {
            me.getList_CamXucMacDinh(e.ID, e.IDLICHHOC);
            //me.getList_CamXuc(e.ID, e.IDLICHHOC);
        })
    },

    save_XacNhan: function (strId) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_LopHoc_Lich_SV/XacNhan_HoTro_LopHoc_Lich_SV',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
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

    genHtml_Month: function (cal) {
        var nMonth = parseInt($("#thang").attr("title"));
        var nYear = parseInt($("#nam").attr("title"));
        nMonth += cal;
        if (nMonth == 0) {
            nMonth = 12;
            nYear--;
            $("#nam").attr("title", nYear);
            $("#nam").html(nYear);
        }
        if (nMonth == 13) {
            nMonth = 1;
            nYear++;
            $("#nam").attr("title", nYear);
            $("#nam").html(nYear);
        }
        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);

        var iDayOfMonth = getDay(nMonth, nYear);

        var strDay = edu.util.dateToday();
        var iDay = parseInt(strDay.substr(0, strDay.indexOf("/")));

        var iThu = new Date(nYear, nMonth - 1, 1, 0, 0, 0, 0);
        iThu = iThu.getDay();
        if (iThu == 0) iThu = 7;
        var html = "";
        var strNgayBatDau = '';
        var strNgayKetThuc = '';
        var uuid = edu.util.uuid();
        var iDayOfPreMonth = getDay(nMonth - 1, nYear);
        for (var i = iThu - 2; i >= 0; i--) {
            html += '<li class="day-of-other-month ' + uuid + '" title="' + getSMonth(iDayOfPreMonth - i, (nMonth - 1), nYear) + '" >' + (iDayOfPreMonth - i) + '</li>';
        }

        //var bCheck = false;
        var date = new Date();
        if (date.getMonth() + 1 != nMonth || date.getFullYear() != nYear) iDay = 1;

        if (iThu > 1) {
            strNgayBatDau = getSMonth(iDayOfPreMonth - iThu + 2, (nMonth - 1), nYear);
            strNgayKetThuc = getSMonth(8 - iThu, nMonth, nYear);
        }
        for (var i = 1; i <= iDayOfMonth; i++) {
            var strClass = "";
            if (i == iDay) strClass = 'active';
            if ((i % 7 + iThu) % 7 == 2) {
                strNgayBatDau = getSMonth(i, nMonth, nYear);
                strNgayKetThuc = (i + 6 > iDayOfMonth) ? getSMonth(i + 6 - iDayOfMonth, (nMonth + 1), nYear) : getSMonth(i + 6, nMonth, nYear);
                uuid = edu.util.uuid();
            }

            html += '<li class="poiter ' + strClass + ' ' + uuid + '" ngay="' + i + '"  title="' + getSMonth(i, nMonth, nYear) + '" name="' + uuid + '" batdau="' + strNgayBatDau + '" ketthuc="' + strNgayKetThuc + '"><span>' + i + '</span></li>';
        }
        var iMax = 35 - iDayOfMonth - iThu;
        if (iMax < 0) iMax += 7;
        for (var i = 1; i < iMax + 2; i++) {
            html += '<li class="day-of-other-month ' + uuid + '" title="' + getSMonth(i, (nMonth + 1), nYear) + '">' + i + '</li>';
        }
        $(".days").html(html);
        setTimeout(function () {
            $(".days .active").trigger("click");
        }, 1000);

        function getDay(nMonth, nYear) {
            var iDayOfMonth = 31;
            switch (nMonth) {
                case 2: {
                    iDayOfMonth = 28;
                    if (nYear % 4 == 0) iDayOfMonth = 29;
                } break;
                case 4:
                case 6:
                case 9:
                case 11: iDayOfMonth = 30; break;
            }
            return iDayOfMonth;
        }
        function getSMonth(iDay, nMonth, Year) {
            if (nMonth == 0) {
                nMonth = 12;
                Year--;
            }
            if (nMonth == 13) {
                nMonth = 1;
                Year++;
            }
            return returnTwo(iDay) + '/' + returnTwo(nMonth) + '/' + Year;
        }

        function returnTwo(iDay) {
            iDay = "" + iDay;
            if (iDay.length == 1) return "0" + iDay;
            else return iDay;
        }
    },
    returnTwo: function (iDay) {
        iDay = "" + iDay;
        if (iDay.length == 1) return "0" + iDay;
        else return iDay;
    },

    save_NhapChuyenCan: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien, "ID");
        var strNgay = $(point).attr("title");
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        //--Edit
        var obj_save = {
            'action': 'CC_NguoiHoc_ChuyenCan/ThemMoi',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strSV_Id,
            'strDaoTao_LopQuanLy_Id': "",
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDiem_DanhSach_Id': objSV.DANGKY_LOPHOCPHAN_ID,
            'strKieuChuyenCan_Id': arrId[1],
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NhapChuyenCan: function (point) {
        var me = this;
        //--Edit
        var today = new Date();
        var obj = {};
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien, "ID");
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        var obj_delete = {
            'action': 'CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strSV_Id,
            'strDaoTao_LopQuanLy_Id': "",
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDiem_DanhSach_Id': objSV.DANGKY_LOPHOCPHAN_ID,
            'strKieuChuyenCan_Id': arrId[1],
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                var obj = {
                    content: ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    save_TuGhiNhan: function (strId) {
        var me = this;
        var obj_notify = {};
        var today = new Date();
        console.log(edu.system.clientIP);
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        var obj_save = {
            'action': 'CC_ThongTin/Them_QLSV_NguoiHoc_TuGhiNhan',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strDiem_DanhSach_Id': objLich.IDLOPHOCPHAN,
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': 0,
            'strIp': edu.system.clientIP,
            'strNoiDungTuGhiNhan': edu.util.getValById('txtTuKhoaDiemDanh'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strGiangVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_TrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
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
    save_DiemDanhTuDong: function (strId) {
        var me = this;
        var obj_notify = {};
        var today = new Date();
        var obj_save = {
            'action': 'CC_GiangVien_TuGhiNhan/ThucHienDiemDanhTuDong',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgayGhiNhan': edu.util.dateToday(),
            'strGio': today.getHours(),
            'strPhut': today.getMinutes(),
            'strGiay': today.getSeconds(),
            'strDaoTao_LopHocPhan_Id': me.strLichHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_LichThi: function (strNgayDangChon) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4FRUNKCIpFSko',
            'func': 'pkg_congthongtin_hssv_thongtin.LayTTLichThi',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strGiangVien_Id,
            'strNgayDangChon': strNgayDangChon,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_LichThi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LichThi: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblLichThi",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "NGAYHOC",
                },
                {
                    "mData": "QLSV_NGUOIHOC_TEN",
                    mRender: function (nRow, objLich) {
                        return objLich.GIOBATDAU + "h" + objLich.PHUTBATDAU + " - " + objLich.GIOKETTHUC + "h" + objLich.PHUTKETTHUC
                    }
                },
                {
                    "mDataProp": "PHONGHOC_TEN",
                },
                {
                    "mDataProp": "TENHOCPHAN",
                }
            ]
        };

        edu.system.loadToTable_data(jsonForm);
    },

    getList_PhanChamThi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIVKSgVKSQuBS41FSko',
            'func': 'pkg_thi_phancong.LayDSThiTheoDotThi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dLocKhongHoanThanhNhapDiem': edu.util.getValById('dropSearch_HoanThanhNhapDiem'),
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strTuNgay': edu.util.getValById('txtAAAA'),
            'strDenNgay': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhanChamThi = dtReRult;
                    me.genTable_PhanChamThi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
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

    save_TangCamXuc: function (strLichHoc_Id, strEmo) {
        var me = this;
        var aData = me.dtLichHoc.find(e => e.ID == strLichHoc_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_CamXuc_MH/FSAvJh4CICwZNCIP',
            'func': 'pkg_dg_camxuc_nguoihoc.Tang_CamXuc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDiem_DanhSachHoc_Id': aData.IDLOPHOCPHAN,
            'strNgayGhiNhan': aData.NGAYHOC,
            'dGio': aData.GIOBATDAU,
            'dPhut': aData.PHUTBATDAU,
            'dGiay': 0,
            'strDG_ChucNang_ChuDe_CT_Id': strEmo,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_CamXucMacDinh(strLichHoc_Id, aData.IDLICHHOC)
                    //edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_PhanCong();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_GiamCamXuc: function (strLichHoc_Id, strEmo) {
        var me = this;
        var aData = me.dtLichHoc.find(e => e.ID == strLichHoc_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_CamXuc_MH/BiggLB4CICwZNCIP',
            'func': 'pkg_dg_camxuc_nguoihoc.Giam_CamXuc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDiem_DanhSachHoc_Id': aData.IDLOPHOCPHAN,
            'strNgayGhiNhan': aData.NGAYHOC,
            'dGio': aData.GIOBATDAU,
            'dPhut': aData.PHUTBATDAU,
            'dGiay': 0,
            'strDG_ChucNang_ChuDe_CT_Id': strEmo,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_CamXucMacDinh(strLichHoc_Id, aData.IDLICHHOC)
                    //edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_PhanCong();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_ThayDoiCamXuc: function (strLichHoc_Id, strEmo) {
        var me = this;
        console.log(strLichHoc_Id);
        var aData = me.dtLichHoc.find(e => e.ID == strLichHoc_Id);
        console.log(me.dtLichHoc);
        //--Edit
        var obj_save = {
            'action': 'SV_CamXuc_MH/FSkgOAUuKB4CICwZNCIP',
            'func': 'pkg_dg_camxuc_nguoihoc.ThayDoi_CamXuc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDiem_DanhSachHoc_Id': aData.IDLOPHOCPHAN,
            'strNgayGhiNhan': aData.NGAYHOC,
            'dGio': aData.GIOBATDAU,
            'dPhut': aData.PHUTBATDAU,
            'dGiay': 0,
            'strDG_ChucNang_ChuDe_CT_Id': strEmo,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thực hiện thành công");
                    me.getList_CamXucMacDinh(strLichHoc_Id, aData.IDLICHHOC)
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_PhanCong();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },


    getList_CamXucMacDinh: function (strId, strDiem_DanhSachHoc_Id) {
        var me = this;
        //--Edit
        var aData = me.dtLichHoc.find(e => e.ID == strId);

        var obj_save = {
            'action': 'SV_CamXuc_MH/DSA4FRUMICIFKC8p',
            'func': 'pkg_dg_camxuc_nguoihoc.LayTTMacDinh',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDiem_DanhSachHoc_Id': aData.IDLOPHOCPHAN,
            'strNgayGhiNhan': aData.NGAYHOC,
            'dGio': aData.GIOBATDAU,
            'dPhut': aData.PHUTBATDAU,
            'dGiay': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        var aData = dtReRult[0];
                        var Emo = $("#" + strId + " #mainicon");
                        Emo.attr("name", aData.ID);
                        Emo.attr("src", "assets/images/eval-emoji/" + aData.DG_CHUCNANG_CHUDE_CHITIET_ANH);
                        if (aData.SOLUONG) $("#lblSoLuong" + strId).html(edu.util.returnEmpty(aData.SOLUONG));
                        else $("#lblSoLuong" + strId).html("");
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
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

    getList_CamXuc: function (strId, strDiem_DanhSachHoc_Id) {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'SV_CamXuc_MH/DSA4BRICICwZNCIP',
            'func': 'pkg_dg_camxuc_nguoihoc.LayDSCamXuc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            //'strDiem_DanhSachHoc_Id': strDiem_DanhSachHoc_Id,
            'strNgayGhiNhan': edu.util.getValById('txtAAAA'),
            'dGio': 0,
            'dPhut': 0,
            'dGiay': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var html = '';
                    dtReRult.forEach(aData => {
                        html += '<div class="item btnEmoChange" name="' + aData.ID + '">';
                        html += '<img src="assets/images/eval-emoji/' + aData.DG_CHUCNANG_CHUDE_CHITIET_ANH + '" alt="">';
                        html += '</div>';
                        //html += '<div class="item">';
                        //html += '<img src="assets/images/eval-emoji/1.png" alt="">';
                        //html += '<span>5</span>';
                        //html += '</div>';
                    })
                    me["strCamXuc"] = html;
                    //$("#listIcon" + strId).html(html);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            //async: false,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
}