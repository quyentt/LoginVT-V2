/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 20/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function HeThongBienLai() { };
HeThongBienLai.prototype = {
    dtMau: '',
    dtChungTu: '',
    strMau_Id: '',
    strSo_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        
        edu.system.pageSize_default = 24;
        edu.extend.addNotify();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.getList_BL();
        me.getList_SBL();
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhapHoc
        --Author:
		-------------------------------------------*/
        $("#btnSearch_BienLai").click(function (e) {
            e.stopImmediatePropagation();
            var strTuKhoa = edu.util.getValById('txtKeyword_Search_BienLai').trim();
            edu.system.pageIndex_default = 1;
            me.getList_SBL(strTuKhoa);
        });
        $("#txtKeyword_Search_BienLai").keypress(function (e) {
            if (e.which === 13) {
                e.stopImmediatePropagation();
                var strTuKhoa = edu.util.getValById('txtKeyword_Search_BienLai').trim();
                edu.system.pageIndex_default = 1;
                me.getList_SBL(strTuKhoa);
            }
        });
        $('.rdLoaiPhieu_BienLai').on('change', function (e) {
            e.stopImmediatePropagation();
            edu.system.pageIndex_default = 1;
            me.getList_SBL();
        });
        $("#MainContent").delegate('.viewchungtu, .viewchungtu_DaSua', 'click', function (e) {
            e.stopImmediatePropagation();
            $("#btnHuyBienLai").show();
            me.strSo_Id = this.id;
            edu.extend.getData_Phieu(this.id, "BIENLAI", 'MauInPhieuThu', main_doc.HeThongBienLai.changeWidthPrint);
            $("#MainContent").slideUp('slow');
            $("#zoneThongTinPhieuThu").slideDown('slow');
        });

        $("#MainContent").delegate('.viewchungtu_DaXoa', 'click', function (e) {
            e.stopImmediatePropagation();
            $("#btnHuyBienLai").hide();
            me.strSo_Id = this.id;
            edu.extend.getData_Phieu(this.id, "BIENLAI", 'MauInPhieuThu', main_doc.HeThongBienLai.changeWidthPrint);
            $("#MainContent").slideUp('slow');
            $("#zoneThongTinPhieuThu").slideDown('slow');
        });

        $("#MainContent").delegate('.viewchungtu, .viewchungtu_DaSua, .viewchungtu_DaXoa', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            var id = this.id;
            me.popover_SBL(id, point);
        });
        //
        $('#dropMau_BienLai').on('select2:select', function () {
            var id = edu.util.getValCombo("dropMau_BienLai");
            me.strMau_Id = id;
            if (edu.util.checkValue(id)) {
                me.getList_SBL();
            }
            me.genHTML_TinhTrangMau(id);
        });
        $("#btnInBienLai").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            me.printPhieu();
            return false;
        });
        $("#btnCloseBienLai").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#zoneThongTinPhieuThu").slideUp('slow');
            $("#MainContent").slideDown('slow');
            return false;
        });
        $("#btnHuyBienLai").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            edu.system.confirm('Bạn có chắc chắn muốn hủy biên lai không!');
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.delete_BL();
            });
            return false;
        });
        me.changeWidthPrint();
        $(".sidebar-toggle").click(function (e) {
            setTimeout(function () {
                me.changeWidthPrint();
            }, 1000);
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:  
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    /*------------------------------------------
	--Discription: [1] ACESSS DB ==> BienLai
	--Author:  
	-------------------------------------------*/
    getList_BL: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_BienLai/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 10000,
            'strTuKhoa': '',
            'strNguoiThucHien_Id': '',
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtMau = data.Data;
                    me.cbGenCombo_BL(data.Data);
                    if (data.Data.length > 0) me.genHTML_TinhTrangMau();
                }
                else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [1] ACTION HTML ==> BienLai
	--Author:  
	-------------------------------------------*/
    cbGenCombo_BL: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAUSO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropMau_BienLai"],
            type: "",
            title: "Tất cả"
        };
        edu.system.loadToCombo_data(obj);
    },
    getDataBienLai: function (strMau_Id) {
        var me = this;
        for (var i = 0; i < me.dtMau.length; i++) {
            if (strMau_Id === me.dtMau[i].ID) return me.dtMau[i];
        }
        return undefined;
    },
    genHTML_TinhTrangMau: function (strMau_Id) {
        var me = this;
        var dDaDung = 0;
        var dDaHuy = 0;
        var dTongSo = 0;
        if (strMau_Id == undefined || strMau_Id == "") {
            for (var i = 0; i < me.dtMau.length; i++) {
                dDaDung += me.dtMau[i].SODADUNG;
                dDaHuy += me.dtMau[i].SODAHUY;
            }
        } else {
            var data = me.getDataBienLai(strMau_Id);
            if (data !== undefined) {
                dDaDung = data.SODADUNG;
                dDaHuy = data.SODAHUY;
            }
        }
        dTongSo = dDaDung + dDaHuy;
        if (dTongSo !== undefined) {
            $("#lbpPhieuDaDung")[0].style.width = dDaDung * 100.0 / dTongSo + '%';
            $("#lbPhieuDaDung").html('<b>' + dDaDung + '</b> /' + dTongSo);

            $("#lbpPhieuDaSua")[0].style.width = 0 * 100.0 / dTongSo + '%';
            $("#lbPhieuDaSua").html('<b>' + 0 + '</b> /' + dTongSo);

            $("#lbpPhieuDaHuy")[0].style.width = dDaHuy * 100.0 / dTongSo + '%';
            $("#lbPhieuDaHuy").html('<b>' + dDaHuy + '</b> /' + dTongSo);
        }
    },
    /*------------------------------------------
	--Discription: [2] ACESSS DB ==> SoBienLai
	--Author:  
	-------------------------------------------*/
    getList_SBL: function (strTuKhoa) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_SoBienLai/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTuKhoa': edu.util.getValById('txtKeyword_Search_BienLai').trim(),
            'strtaichinh_hethongBL_id': me.strMau_Id,
            'dTuKhoa_Number': -1,
            'iTinhTrang': $('input[name="rdLoaiPhieu_BienLai"]:checked').val(),
            'strNguoiTao_Id': '',
            'strNguoiThucHien_Id': "",
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtChungTu = data.Data;
                    me.genHTML_SBL(data.Data, data.Pager);
                }
                else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_BL: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_SoBienLai/HuyBienLai',
            'versionAPI': 'v1.0',
            'strBienLai_Id': me.strSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_SBL();
                    me.getList_BL();
                    $("#zoneThongTinPhieuThu").slideUp('slow');
                    $("#MainContent").slideDown('slow');

                    edu.extend.notifyBeginLoading('Xóa chứng từ thành công');
                }
                else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(d.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2] ACTION HTML ==> SoBienLai
	--Author:  
	-------------------------------------------*/
    genHTML_SBL: function (data, iPager) {
        var me = this;
        me.beginLoadPag('zonePhieuThu_BienLai', 'main_doc.HeThongBienLai.getList_SBL()', iPager)
        if (data === null || data === undefined || data.length === 0) {
            return;
        }
        var html = '';
        //iLoaiPhieu: [-1] is all, [1] is phieu_thu, [0] is phieu_huy, [2] is phieu_sua
        var iLoaiPhieu = "";
        var iTinhTrang = 0;
        var iLoaiChungTu = '';

        for (var i = 0; i < data.length; i++) {
            iTinhTrang = data[i].TINHTRANG;

            switch (iTinhTrang) {
                case 1:
                    iLoaiPhieu = "color-active";
                    iLoaiChungTu = "viewchungtu";
                    break;
                case -1:
                    iLoaiPhieu = "color-danger";
                    iLoaiChungTu = "viewchungtu_DaXoa";
                    break;
                case 2:
                    iLoaiPhieu = "color-warning";
                    iLoaiChungTu = "viewchungtu_DaSua";
                    break;
                default:
                    break;
            }
            html += '<div class="col-sm-2 ' + iLoaiChungTu + '" id="' + data[i].ID + '">';
            html += '<div class="box-mini">';
            html += '<p>Số: <span class="' + iLoaiPhieu + ' pull-right underline">#' + edu.util.returnEmpty(data[i].SOBIENLAI) + '</span></p>';
            html += '<p>Tổng tiền: <span class="' + iLoaiPhieu + ' pull-right">' + edu.system.convertFloat(data[i].TONGTIEN) + '</span></p>';
            html += '<p>Người thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGUOITAO_TAIKHOAN) + '</span></p>';
            html += '<p>Ngày thu: <span class="pull-right">' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY_HHMMSS) + '</span></p>';
            html += '</div>';
            html += '</div>';
        }
        $("#zonePhieuThu_BienLai").html(html);
        $(".popover").replaceWith('');
    },
    popover_SBL: function (strHS_Id, point) {
        var me = this;

        var data = null;
        for (var i = 0; i < me.dtChungTu.length; i++) {
            if (strHS_Id === me.dtChungTu[i].ID)
                data = me.dtChungTu[i];
        }
        var row = "";
        row += '<div class="pcard" style="width: 360px; float: left; padding-left: 0px; margin-top: -7px; font-size: 18px"></td>';
        row += '<table>';
        row += '<tbody>';
        row += '<tr>';
        row += '<td><i class="fa-solid fa-arrow-down-1-9 colorcard"></i><span class="lang" key="">Số</span></td><td>: ' + edu.util.checkEmpty(data.SOBIENLAI) + '</td>';
        row += '</tr>';
        row += '<tr>';
        row += '<td><i class="fa-solid fa-calendar-days colorcard"></i><span class="lang" key="">Năm</span></td><td>: ' + edu.util.checkEmpty(data.HETHONGBIENLAI_NAM) + '</td>';
        row += '</tr>';
        row += '<tr>';
        row += '<td><i class="fa-solid fa-circle-dollar-to-slot colorcard"></i><span class="lang" key="">Tổng tiền tiền</span></td><td>: ' + edu.system.convertFloat(data.TONGTIEN) + '</td>';
        row += '</tr>';
        row += '<tr>';
        row += '<td><i class="fa-solid fa-user colorcard"></i><span class="lang" key="">Người cập nhật</span></td><td>: ' + edu.util.checkEmpty(data.NGUOICUOI_TENDAYDU) + '</td>';
        row += '</tr>';
        row += '<tr>';
        row += '<td><i class="fa-regular fa-calendar-day colorcard"></i><span class="lang" key="">Ngày cập nhật</span></td><td>: ' + edu.util.checkEmpty(data.NGAYCUOI_DD_MM_YYYY_HHMMSS) + '</td>';
        row += '</tr>';
        row += '</tbody>';
        row += '</table>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'hover',
            html: true,
            placement: 'top',
        });
        $(point).popover('show');
    },
    /*------------------------------------------
	--Discription: [3] ACTION HTML ==> KeHoachNhapHoc
	--Author:  
	-------------------------------------------*/
    cbGenCombo_KeHoachNhanSu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NGUOIDUNG_TAIKHOAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhanSu_TCPT"],
            type: "",
            title: "Chọn nhân sự"
        };
        edu.system.loadToCombo_data(obj);
    },
    beginLoadPag: function (strzoneId, strFuntionName, iDataRow) {
        //Dữ liệu null
        if (edu.util.checkValue(iDataRow) && iDataRow > 0) {
            //Trước đó chưa hiển thị phân trang thì sẽ hiển thị phân trang
            if (document.getElementsByClassName("zone-pag-footer" + strzoneId).length === 0) {
                edu.system.pagInfoRender(strzoneId);
                //Thay đổi sang ô tìm kiếm
                //edu.system.insertFilterToTable(strzoneId, strFuntionName);
                //Tùy chọn thay đổi change
                edu.system.insertChangLenghtToTable([[24, 30, 50, 100, 200, -1], [24, 30, 50, 100, 200, 'Tất cả']], strzoneId);
                //Tùy chọn Cập nhật lại PageSizechange
                $("#dropPageSizechange" + strzoneId).val(edu.system.pageSize_default).trigger('change');
                //Tạo dải phân cách giữa 2 thằng sau sẽ xóa
                $(".zone-pag-clear" + strzoneId).replaceWith('');
                $("#" + strzoneId).before('<div class="zone-pag-clear' + strzoneId + '" style="clear: both;"></div>');
            }
            edu.system.pagButtonRender(strFuntionName, strzoneId, iDataRow);
        } else {
            $(".zone-pag-footer" + strzoneId).replaceWith('');
            $(".change-" + strzoneId).html('');
            $(".light-pagination" + strzoneId).remove();
            $("#" + strzoneId).html('<div class="no-data-bienlai"> Không tìm thấy dữ liệu </div>');
        }
    },
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("MauInPhieuThu");
        edu.util.printHTML('MauInPhieuThu');
        $("#zoneThongTinPhieuThu").slideUp('slow');
        $("#MainContent").slideDown('slow');
    },
    changeWidthPrint: function () {
        //Thay đổi vùng in
        var lMauInPhieuThu = document.getElementById("MauInPhieuThu").offsetWidth;
        if (lMauInPhieuThu > 700) lMauInPhieuThu += 240;
        else {
            lMauInPhieuThu = 1250;
        }
        var lMainPrint = document.getElementById("main-content-wrapper").offsetWidth;
        if (lMainPrint > lMauInPhieuThu) {
            document.getElementById('zoneThongTinPhieuThu').style.paddingLeft = (lMainPrint - lMauInPhieuThu) / 2 + "px";
            document.getElementById('zoneActionHoaDon').style = "float:left; margin-left: 3px";
        }
        else {
            document.getElementById('zoneThongTinPhieuThu').style.paddingLeft = "20px";
            document.getElementById('zoneActionHoaDon').style = "position: fixed; right: 10px !important";
        }
        edu.extend.genChonLien("MauInPhieuThu", "zoneLienHoaDon");
    }
}