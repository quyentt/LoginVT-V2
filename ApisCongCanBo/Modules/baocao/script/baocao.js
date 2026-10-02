/*----------------------------------------------
--Updated by: 
--Date of created: 17/01/2019
----------------------------------------------*/
function BaoCao() { };
BaoCao.prototype = {
    dtBaoCao: [],

    init: function () {
        var me = this;
        me.page_load();
        $("#zoneBtnBaoCao").delegate(".btnbaocao", "click", function (e) {
            e.preventDefault();
            edu.system.report(this.id, $(this).attr("name"), function (addKeyValue) {
                addKeyValue("strNhanSu_Id", edu.system.userId);
                addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
            });
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();

        edu.system.loadToCombo_DanhMucDuLieu("CCB.BCTK", "", "", me.loadBtnBaoCao, "Tất cả báo cáo", "HESO1");
    },
    loadBtnBaoCao: function (data) {
        console.log(data);
        var row = "";
        row += '<div style=" width: 100%" class="zoneBtnBaoCao-list">';
        for (var i = 0; i < data.length; i++) {
            row += '<div id="' + data[i].MA + '" name="' + data[i].THONGTIN3 + '" class="btn-large btnbaocao">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<div class="clear"></div>';
            row += '<a class="text-BaoCao">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnBaoCao").html(row);
    },
    report_CaNhan: function (strLoaiBaoCao, strDuongDan) {
        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNhanSu_Id", edu.system.userId);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
        var obj_save = {
            'strTuKhoa': arrTuKhoa.toString(),
            'strDuLieu': arrDuLieu.toString(),
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        if (edu.util.checkValue(strDuongDan)) {
                            var url_report = strDuongDan + "?id=" + strBaoCao_Id;
                        }
                        else {
                            var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                        }
                        location.href = url_report;
                    }
                }
                else {
                    edu.system.alert("Thông báo", "Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },
};