/*----------------------------------------------
-- DSDangKyHocPicker
-- Modal chọn danh sách sinh viên theo đăng ký học phần.
-- Reusable: chỉ cần <script src="..."> file này rồi gọi
--     DSDangKyHocPicker.open({ multiple: true, onSelect: function(arr) {...} });
-- Trả về mảng full record từ pkg_dangkyhoc_thongtin2.LayDSDangKyHoc.
----------------------------------------------*/
function DSDangKyHocPicker() {
    this._injected = false;
    this._combosLoaded = false;
    this._callback = null;
    this._multiple = true;
    this._dtCurrent = [];
    this._selectedMap = {};
}

DSDangKyHocPicker.prototype = {
    open: function (opts) {
        var me = this;
        opts = opts || {};
        me._callback = typeof opts.onSelect === 'function' ? opts.onSelect : null;
        me._multiple = opts.multiple !== false;
        if (!me._injected) {
            me._injectStyle();
            me._injectDom();
            me._bindEvents();
            me._injected = true;
        }
        me._reset();
        if (!me._combosLoaded) {
            me._loadCombos();
            me._combosLoaded = true;
        }
        me._applyPrefill(opts.prefillFilters);
        $('#chkSelectAll_DSDangKyHocPicker').prop('checked', false).toggle(me._multiple);
        $('#modalDSDangKyHocPicker').modal('show');
    },

    _injectStyle: function () {
        if ($('#dspicker-style').length) return;
        var css = ''
            + '.dspicker-modal .modal-dialog {'
            + '    max-width: 96vw !important;'
            + '    width: 96vw !important;'
            + '    margin: 15px auto;'
            + '}'
            + '.dspicker-modal .modal-content {'
            + '    max-height: calc(100vh - 30px);'
            + '    display: flex;'
            + '    flex-direction: column;'
            + '    border-radius: 8px;'
            + '    box-shadow: 0 12px 40px rgba(0,0,0,.25);'
            + '}'
            + '.dspicker-modal .modal-header {'
            + '    background: #337ab7;'
            + '    color: #fff;'
            + '    border-radius: 8px 8px 0 0;'
            + '    padding: 12px 20px;'
            + '    flex: 0 0 auto;'
            + '}'
            + '.dspicker-modal .modal-header .modal-title {'
            + '    color: #fff;'
            + '    font-size: 16px;'
            + '    font-weight: 600;'
            + '    margin: 0;'
            + '}'
            + '.dspicker-modal .modal-header .close {'
            + '    color: #fff;'
            + '    text-shadow: none;'
            + '    opacity: .9;'
            + '    font-size: 28px;'
            + '    line-height: 1;'
            + '    background: transparent;'
            + '    border: 0;'
            + '}'
            + '.dspicker-modal .modal-header .close:hover { opacity: 1; }'
            + '.dspicker-modal .modal-body {'
            + '    overflow-y: auto;'
            + '    padding: 15px 20px;'
            + '    flex: 1 1 auto;'
            + '    min-height: 0;'
            + '}'
            + '.dspicker-modal .modal-footer {'
            + '    padding: 10px 20px;'
            + '    border-top: 1px solid #e6ebf2;'
            + '    background: #f7f9fc;'
            + '    flex: 0 0 auto;'
            + '}'
            + '.dspicker-modal .item-search { padding: 4px 8px; margin-bottom: 8px; }'
            + '.dspicker-modal .dspicker-summary {'
            + '    padding: 6px 10px;'
            + '    background: #f0f6fc;'
            + '    border: 1px solid #d6e4f0;'
            + '    border-radius: 4px;'
            + '    margin-top: 6px;'
            + '}'
            + '.dspicker-modal .dspicker-error {'
            + '    padding: 8px 12px;'
            + '    background: #fff2f2;'
            + '    border: 1px solid #f5c6cb;'
            + '    color: #a94442;'
            + '    border-radius: 4px;'
            + '    margin-top: 6px;'
            + '    font-size: 13px;'
            + '    line-height: 1.4;'
            + '}'
            + '.dspicker-modal .dspicker-error i { margin-right: 6px; }'
            + '.dspicker-modal .dspicker-error #dspicker_ErrorClose {'
            + '    color: #a94442;'
            + '    text-decoration: none;'
            + '    font-weight: 700;'
            + '    font-size: 18px;'
            + '    line-height: 1;'
            + '    padding: 0 4px;'
            + '}'
            + '.dspicker-modal .dspicker-error #dspicker_ErrorClose:hover { color: #7a1f22; }'
            + '.dspicker-modal #tblDSDangKyHocPicker thead th {'
            + '    background: #e6ebf2 !important;'
            + '    color: #1f2d3d !important;'
            + '    font-weight: 700 !important;'
            + '    vertical-align: middle;'
            + '    white-space: nowrap;'
            + '    position: sticky;'
            + '    top: 0;'
            + '    z-index: 2;'
            + '}'
            + '.dspicker-modal #tblDSDangKyHocPicker tbody td {'
            + '    vertical-align: middle;'
            + '    line-height: 1.4;'
            + '}'
            + '.dspicker-modal .dspicker-table-wrap {'
            + '    max-height: 55vh;'
            + '    overflow: auto;'
            + '    border: 1px solid #e6ebf2;'
            + '    border-radius: 4px;'
            + '    margin-top: 8px;'
            + '}'
            /* Select2 dropdown chỉ cần trên modal (Bootstrap modal ~1055), không cao hơn alert framework */
            + '.dspicker-modal .select2-container--open { z-index: 1060 !important; }';
        $('head').append('<style id="dspicker-style">' + css + '</style>');
    },

    _injectDom: function () {
        if ($('#modalDSDangKyHocPicker').length) return;
        var html = ''
            + '<div class="modal fade dspicker-modal" id="modalDSDangKyHocPicker" role="dialog" aria-hidden="true">'
            + '  <div class="modal-dialog modal-dialog-scrollable">'
            + '    <div class="modal-content">'
            + '      <div class="modal-header">'
            + '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>'
            + '        <h4 class="modal-title"><i class="fa-solid fa-user-magnifying-glass"></i> Thêm sinh viên từ đăng ký học</h4>'
            + '      </div>'
            + '      <div class="modal-body">'
            + '        <div class="box box-solid box-search pd0" style="margin: 0; box-shadow: none;">'
            + '          <div class="box-body pd0">'
            + '            <div class="area-search">'
            + '              <div class="inputSearch">'
            + '                <div class="row">'
            + '                  <div class="col-sm-3 item-search"><select id="dspicker_ThoiGianDaoTao" class="select-opt" style="width:100% !important" multiple="multiple"><option id="" value="">--Chọn học kỳ--</option></select></div>'
            + '                  <div class="col-sm-3 item-search"><select id="dspicker_HeDaoTao" class="select-opt" style="width:100% !important" multiple="multiple"><option id="" value="">--Tất cả hệ đào tạo--</option></select></div>'
            + '                  <div class="col-sm-3 item-search"><select id="dspicker_KhoaDaoTao" class="select-opt" style="width:100% !important" multiple="multiple"><option id="" value="">--Tất cả khóa đào tạo--</option></select></div>'
            + '                  <div class="col-sm-3 item-search"><select id="dspicker_KhoaQuanLy" class="select-opt" style="width:100% !important" multiple="multiple"></select></div>'
            + '                </div>'
            + '                <div class="row">'
            + '                  <div class="col-sm-3 item-search"><select id="dspicker_ChuongTrinh" class="select-opt" style="width:100% !important" multiple="multiple"><option id="" value="">--Tất cả chương trình--</option></select></div>'
            + '                  <div class="col-sm-3 item-search"><select id="dspicker_HocPhan" class="select-opt" style="width:100% !important" multiple="multiple"></select></div>'
            + '                  <div class="col-sm-3 item-search"><select id="dspicker_KeHoach" class="select-opt" style="width:100% !important"></select></div>'
            + '                  <div class="col-sm-3 item-search"><select id="dspicker_KieuHoc" class="select-opt" style="width:100% !important"></select></div>'
            + '                </div>'
            + '                <div class="row">'
            + '                  <div class="col-sm-3 item-search">'
            + '                    <select id="dspicker_LoaiLop" class="select-opt" style="width:100% !important">'
            + '                      <option value="">Tất cả loại lớp</option>'
            + '                      <option value="rieng">Chỉ lớp riêng</option>'
            + '                      <option value="thuong">Chỉ lớp thường</option>'
            + '                    </select>'
            + '                  </div>'
            + '                  <div class="col-sm-3 item-search"><input id="dspicker_TuSo" class="form-control" placeholder="Số đã đăng ký (từ số)"/></div>'
            + '                  <div class="col-sm-3 item-search"><input id="dspicker_DenSo" class="form-control" placeholder="Số đã đăng ký (đến số)"/></div>'
            + '                  <div class="col-sm-3 item-search"><input id="dspicker_TuKhoa" class="form-control" placeholder="Từ khóa (mã SV, họ tên, mã lớp...)"/></div>'
            + '                </div>'
            + '                <div class="row">'
            + '                  <div class="col-sm-4 item-search">'
            + '                    <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;margin:0">'
            + '                      <input type="checkbox" id="dspicker_ChuaNop"/> <span>Chỉ hiện chưa nộp tiền</span>'
            + '                    </label>'
            + '                  </div>'
            + '                  <div class="col-sm-4 item-search">'
            + '                    <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;margin:0">'
            + '                      <input type="checkbox" id="dspicker_DaChuyenKeToan"/> <span>Chỉ hiện đã chuyển kế toán</span>'
            + '                    </label>'
            + '                  </div>'
            + '                  <div class="col-sm-4 item-search text-right aps-list-btn">'
            + '                    <a id="dspicker_btnResetFilter" class="btn btn-soft-danger"><i class="fa fa-eraser"></i> Xóa lọc</a>'
            + '                    <a id="dspicker_btnSearch" class="btn btn-primary"><i class="fa fa-search"></i> Tìm kiếm</a>'
            + '                  </div>'
            + '                </div>'
            + '              </div>'
            + '            </div>'
            + '          </div>'
            + '        </div>'
            + '        <div id="dspicker_ErrorBanner" class="dspicker-error" style="display:none">'
            + '          <i class="fa fa-exclamation-triangle"></i>'
            + '          <span id="dspicker_ErrorMsg"></span>'
            + '          <a href="#" id="dspicker_ErrorClose" class="pull-right" title="Đóng">×</a>'
            + '        </div>'
            + '        <div class="dspicker-summary">'
            + '          <span id="lblDSDangKyHocPicker_Chon" style="color:#3c8dbc;font-weight:600">Đã chọn: 0</span>'
            + '          <span style="margin-left:16px;color:#888">Tổng bản ghi: <span id="lblDSDangKyHocPicker_Tong">0</span></span>'
            + '        </div>'
            + '        <div class="dspicker-table-wrap">'
            + '          <table id="tblDSDangKyHocPicker" class="table table-hover table-bordered table-noborder" style="min-width:1600px; margin-bottom:0;">'
            + '            <thead>'
            + '              <tr>'
            + '                <th class="td-center">Stt</th>'
            + '                <th class="td-center">Mã số</th>'
            + '                <th class="td-left">Họ đệm</th>'
            + '                <th class="td-left">Tên</th>'
            + '                <th class="td-left">Chương trình</th>'
            + '                <th class="td-left">Khoa quản lý</th>'
            + '                <th class="td-left">Loại lớp</th>'
            + '                <th class="td-left">Mã lớp HP</th>'
            + '                <th class="td-left">Tên lớp HP</th>'
            + '                <th class="td-left">Học phần</th>'
            + '                <th class="td-center">Số tín</th>'
            + '                <th class="td-left">Kiểu học</th>'
            + '                <th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_DSDangKyHocPicker"/></th>'
            + '              </tr>'
            + '            </thead>'
            + '            <tbody></tbody>'
            + '          </table>'
            + '        </div>'
            + '      </div>'
            + '      <div class="modal-footer">'
            + '        <button type="button" class="btn btn-default pull-left" data-dismiss="modal"><i class="fa fa-times-circle"></i> Đóng</button>'
            + '        <a id="dspicker_btnChon" class="btn btn-success"><i class="fa fa-check"></i> Chọn</a>'
            + '      </div>'
            + '    </div>'
            + '  </div>'
            + '</div>';
        $('body').append(html);
    },

    _bindEvents: function () {
        var me = this;
        $('#dspicker_btnSearch').click(function (e) { e.preventDefault(); me._search(); });
        $('#dspicker_btnResetFilter').click(function (e) { e.preventDefault(); me._resetFilter(); });
        $('#dspicker_btnChon').click(function (e) { e.preventDefault(); me._onOk(); });
        $('#dspicker_ErrorClose').click(function (e) { e.preventDefault(); me._hideError(); });

        $('#dspicker_TuKhoa, #dspicker_TuSo, #dspicker_DenSo').on('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); me._search(); }
        });

        $('#chkSelectAll_DSDangKyHocPicker').on('click', function () {
            var checked = this.checked;
            $('#tblDSDangKyHocPicker tbody input.dspicker-row-check').each(function () {
                if (this.checked !== checked) {
                    this.checked = checked;
                    me._onRowCheckChange($(this).attr('data-id'), checked);
                }
            });
        });

        $('#tblDSDangKyHocPicker').on('click', 'input.dspicker-row-check', function () {
            me._onRowCheckChange($(this).attr('data-id'), this.checked);
        });

        $('#dspicker_ThoiGianDaoTao').on('change', function () { me._loadHeDaoTao(); me._loadKeHoach(); me._loadHocPhan(); });
        $('#dspicker_HeDaoTao').on('change', function () { me._loadKhoaDaoTao(); me._loadChuongTrinh(); me._loadHocPhan(); });
        $('#dspicker_KhoaDaoTao').on('change', function () { me._loadChuongTrinh(); me._loadHocPhan(); });
        $('#dspicker_ChuongTrinh').on('change', function () { me._loadHocPhan(); });
        $('#dspicker_KhoaQuanLy').on('change', function () { me._loadChuongTrinh(); me._loadHocPhan(); });
        $('#dspicker_LoaiLop').on('change', function () { me._refilterLoaiLop(); });

        // Fallback: init Select2 cho những select chưa được framework init khi modal đã hiển thị
        $('#modalDSDangKyHocPicker').on('shown.bs.modal', function () {
            var $modal = $(this);
            $modal.find('select.select-opt').each(function () {
                var $el = $(this);
                if (!$el.hasClass('select2-hidden-accessible')) {
                    try { $el.select2({ width: '100%', dropdownParent: $modal }); } catch (e) { }
                }
            });
        });
    },

    _reset: function () {
        var me = this;
        me._dtCurrent = [];
        me._selectedMap = {};
        edu.system.pageIndex_default = 1;
        edu.system.pageSize_default = 50;
        $('#tblDSDangKyHocPicker tbody').html('');
        $('#lblDSDangKyHocPicker_Tong').text(0);
        me._hideError();
        me._updateChonCounter();
    },

    // Framework pagination gọi khi user đổi trang → refetch
    refreshTable: function () {
        this._fetch();
    },

    _showError: function (msg) {
        $('#dspicker_ErrorMsg').text(msg || 'Đã có lỗi xảy ra.');
        $('#dspicker_ErrorBanner').show();
    },

    _hideError: function () {
        $('#dspicker_ErrorBanner').hide();
    },

    // Lấy value từ 1 select/input; array (multi-select) → join comma
    // để server nhận đúng kiểu string.
    _valStr: function (id) {
        var v = $('#' + id).val();
        if (Array.isArray(v)) return v.join(',');
        return v == null ? '' : String(v);
    },

    _resetFilter: function () {
        $('#dspicker_TuKhoa').val('');
        $('#dspicker_TuSo').val('');
        $('#dspicker_DenSo').val('');
        $('#dspicker_ChuaNop').prop('checked', false);
        $('#dspicker_DaChuyenKeToan').prop('checked', false);
        $('#dspicker_LoaiLop').val('').trigger('change');
        ['dspicker_ThoiGianDaoTao', 'dspicker_HeDaoTao', 'dspicker_KhoaDaoTao', 'dspicker_KhoaQuanLy',
            'dspicker_ChuongTrinh', 'dspicker_HocPhan', 'dspicker_KeHoach', 'dspicker_KieuHoc'
        ].forEach(function (id) { $('#' + id).val(null).trigger('change'); });
    },

    _applyPrefill: function (filters) {
        if (!filters) return;
        Object.keys(filters).forEach(function (k) {
            var $el = $('#' + k);
            if ($el.length) $el.val(filters[k]).trigger('change');
        });
    },

    // ------------ Combo loaders ------------
    _loadCombos: function () {
        var me = this;
        me._loadThoiGianDaoTao();
        me._loadHeDaoTao();
        me._loadKhoaDaoTao();
        me._loadChuongTrinh();
        me._loadKhoaQuanLy();
        me._loadHocPhan();
        me._loadKeHoach();
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.DIEM.KIEUHOC", "dspicker_KieuHoc");
    },

    _loadThoiGianDaoTao: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._cbCombo(data.Data, ["dspicker_ThoiGianDaoTao"], "ID", "DAOTAO_THOIGIANDAOTAO", "Chọn học kỳ");
            },
            error: function () { },
            type: 'GET',
            action: 'DKH_Chung/LayThoiGianDangKyHoc',
            contentType: true,
            data: { action: 'DKH_Chung/LayThoiGianDangKyHoc', type: 'GET', strNguoiThucHien_Id: edu.system.userId },
            fakedb: []
        }, false, false, false, null);
    },

    _loadHeDaoTao: function () {
        var me = this;
        var obj = { strHinhThucDaoTao_Id: "", strBacDaoTao_Id: "", strTuKhoa: "", pageIndex: 1, pageSize: 1000000 };
        edu.system.getList_HeDaoTao(obj, "", "", function (data) {
            me._cbCombo(data, ["dspicker_HeDaoTao"], "ID", "TENHEDAOTAO", "Tất cả hệ đào tạo");
        });
    },

    _loadKhoaDaoTao: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._cbCombo(data.Data, ["dspicker_KhoaDaoTao"], "ID", "TENKHOA", "Tất cả khóa đào tạo");
            },
            error: function () { },
            type: 'GET',
            action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc',
            contentType: true,
            data: {
                action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', type: 'GET',
                strDaoTao_HeDaoTao_Id: edu.util.getValById('dspicker_HeDaoTao'),
                strDaoTao_ThoiGianDaoTao_Id: edu.util.getValById('dspicker_ThoiGianDaoTao')
            },
            fakedb: []
        }, false, false, false, null);
    },

    _loadChuongTrinh: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._cbCombo(data.Data, ["dspicker_ChuongTrinh"], "ID", "TENCHUONGTRINH", "Tất cả chương trình");
            },
            error: function () { },
            type: 'GET',
            action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc',
            contentType: true,
            data: {
                action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', type: 'GET',
                strDaoTao_ThoiGianDaoTao_Id: edu.util.getValById('dspicker_ThoiGianDaoTao'),
                strDaoTao_KhoaDaoTao_Id: edu.util.getValById('dspicker_KhoaDaoTao'),
                strDaoTao_HeDaoTao_Id: edu.util.getValById('dspicker_HeDaoTao'),
                strDaoTao_KhoaQuanLy_Id: edu.util.getValById('dspicker_KhoaQuanLy')
            },
            fakedb: []
        }, false, false, false, null);
    },

    _loadKhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy({}, "", "", function (data) {
            me._cbCombo(data, ["dspicker_KhoaQuanLy"], "ID", "TEN", "Tất cả khoa quản lý");
        });
    },

    _loadHocPhan: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._cbCombo(edu.util.checkValue(data.Data) ? data.Data : [], ["dspicker_HocPhan"], "ID", "TEN", "Chọn học phần", function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + (aData.MA ? " - " + aData.MA : "");
                });
            },
            error: function () { },
            type: 'GET',
            action: 'DKH_PhanCong_LopHP/LayDSHocPhan',
            contentType: true,
            data: {
                action: 'DKH_PhanCong_LopHP/LayDSHocPhan', type: 'GET',
                strDaoTao_ThoiGianDaoTao_Id: edu.util.getValById('dspicker_ThoiGianDaoTao'),
                strDaoTao_KhoaDaoTao_Id: edu.util.getValById('dspicker_KhoaDaoTao'),
                strDaoTao_HeDaoTao_Id: edu.util.getValById('dspicker_HeDaoTao'),
                strDaoTao_ChuongTrinh_Id: edu.util.getValById('dspicker_ChuongTrinh'),
                strDaoTao_KhoaQuanLy_Id: edu.util.getValById('dspicker_KhoaQuanLy')
            },
            fakedb: []
        }, false, false, false, null);
    },

    _loadKeHoach: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) me._cbCombo(edu.util.checkValue(data.Data) ? data.Data : [], ["dspicker_KeHoach"], "ID", "TENKEHOACH", "Chọn kế hoạch");
            },
            error: function () { },
            type: 'GET',
            action: 'DKH_ThongTin/LayDSDangKy_KeHoachDangKy',
            contentType: true,
            data: {
                action: 'DKH_ThongTin/LayDSDangKy_KeHoachDangKy', type: 'GET',
                strTuKhoa: '',
                strDaoTao_ThoiGianDaoTao_Id: edu.util.getValById('dspicker_ThoiGianDaoTao'),
                strNguoiThucHien_Id: edu.system.userId,
                pageIndex: 1, pageSize: 10000
            },
            fakedb: []
        }, false, false, false, null);
    },

    _cbCombo: function (data, renderPlace, idField, nameField, title, mRender) {
        var renderInfor = { id: idField, parentId: "", name: nameField, code: "", avatar: "" };
        if (mRender) renderInfor.mRender = mRender;
        edu.system.loadToCombo_data({
            data: data || [],
            renderInfor: renderInfor,
            renderPlace: renderPlace,
            type: "",
            title: title
        });
    },

    // ------------ Search + fetch (framework pagination) ------------
    _search: function () {
        // Bấm "Tìm kiếm" → về trang 1
        edu.system.pageIndex_default = 1;
        this._fetch();
    },

    _fetch: function () {
        var me = this;
        var bChuaNop = $('#dspicker_ChuaNop').is(':checked');
        var bDaChuyenKeToan = $('#dspicker_DaChuyenKeToan').is(':checked');
        var obj = {
            action: 'DKH_ThongTin2_MH/DSA4BRIFIC8mCjgJLiIP',
            func: 'pkg_dangkyhoc_thongtin2.LayDSDangKyHoc',
            iM: edu.system.iM,
            strTuKhoa: me._valStr('dspicker_TuKhoa'),
            strDaoTao_ThoiGianDaoTao_Id: me._valStr('dspicker_ThoiGianDaoTao'),
            strDaoTao_HocPhan_Id: me._valStr('dspicker_HocPhan'),
            strNguoiThucHien_Id: edu.system.userId,
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strTKB_HinhThucHoc_Id: '',
            strHanhDong_XacNhan_Id: '',
            strDangKy_KeHoachDangKy_Id: me._valStr('dspicker_KeHoach'),
            strDaoTao_KhoaDaoTao_Id: me._valStr('dspicker_KhoaDaoTao'),
            strDaoTao_ChuongTrinh_Id: me._valStr('dspicker_ChuongTrinh'),
            strDaoTao_HeDaoTao_Id: me._valStr('dspicker_HeDaoTao'),
            strDaoTao_KhoaQuanLy_Id: me._valStr('dspicker_KhoaQuanLy'),
            dSoDaDangTuSo: me._valStr('dspicker_TuSo') ? parseInt(me._valStr('dspicker_TuSo')) : -1,
            dSoDaDangDenSo: me._valStr('dspicker_DenSo') ? parseInt(me._valStr('dspicker_DenSo')) : -1,
            strKieuHoc_Id: me._valStr('dspicker_KieuHoc'),
            dChiLayCacLopChuaPhanCong: 0
        };
        me._hideError();
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    me._showError(data.Message || 'Không lấy được danh sách.');
                    return;
                }
                var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                var iTotal = data.Pager != null ? parseInt(data.Pager) : arr.length;
                if (bChuaNop || bDaChuyenKeToan) {
                    arr = arr.filter(function (r) {
                        if (bChuaNop) {
                            var v = r.SOTIENDANOP != null ? r.SOTIENDANOP : r.TONGSOTIENDANOP;
                            if ((parseFloat(v) || 0) !== 0) return false;
                        }
                        if (bDaChuyenKeToan) {
                            if (!r.DACHUYENKETOAN || parseInt(r.DACHUYENKETOAN) === 0) return false;
                        }
                        return true;
                    });
                }
                me._dtCurrent = arr;
                me._render(me._applyLoaiLopFilter(arr), iTotal);
                // Server báo có bản ghi nhưng trả về rỗng → thường do payload quá lớn
                if (iTotal > 0 && arr.length === 0) {
                    me._showError('Server báo có ' + iTotal + ' bản ghi khớp nhưng không trả về dữ liệu. Dữ liệu có thể quá lớn — hãy thu hẹp bộ lọc (học kỳ, học phần, khoa quản lý...) hoặc chọn page size nhỏ hơn.');
                }
            },
            error: function (er) {
                console.error('[DSDangKyHocPicker] Search error:', er);
                var msg = 'Lỗi tải danh sách';
                if (er && er.status) msg += ' (HTTP ' + er.status + ')';
                if (er && er.statusText) msg += ': ' + er.statusText;
                var body = er && (er.responseJSON ? (er.responseJSON.Message || JSON.stringify(er.responseJSON)) : er.responseText);
                if (body) msg += ' — ' + (body.length > 300 ? body.substring(0, 300) + '...' : body);
                me._showError(msg);
            },
            type: 'POST',
            action: obj.action,
            contentType: true,
            data: obj,
            fakedb: []
        }, false, false, false, null);
    },

    _applyLoaiLopFilter: function (arr) {
        var v = edu.util.getValById('dspicker_LoaiLop');
        if (!v) return arr;
        return arr.filter(function (r) {
            var isRieng = !!(r.HOCPHITINHRIENG || (r.LOPRIENG && String(r.LOPRIENG).trim() !== ''));
            return v === 'rieng' ? isRieng : !isRieng;
        });
    },

    _refilterLoaiLop: function () {
        this._render(this._applyLoaiLopFilter(this._dtCurrent || []));
    },

    _render: function (data, iTotal) {
        var me = this;
        data = data || [];
        iTotal = iTotal != null ? iTotal : data.length;
        $('#lblDSDangKyHocPicker_Tong').text(iTotal);

        var jsonForm = {
            strTable_Id: 'tblDSDangKyHocPicker',
            bPaginate: {
                strFuntionName: 'window.DSDangKyHocPicker.refreshTable()',
                iDataRow: iTotal
            },
            aaData: data,
            colPos: { center: [0, 1] },
            aoColumns: [
                { 'mDataProp': 'QLSV_NGUOIHOC_MASO' },
                { 'mDataProp': 'QLSV_NGUOIHOC_HODEM' },
                { 'mDataProp': 'QLSV_NGUOIHOC_TEN' },
                {
                    'mRender': function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN);
                    }
                },
                { 'mDataProp': 'DAOTAO_KHOAQUANLY_TEN' },
                { 'mDataProp': 'LOPRIENG' },
                { 'mDataProp': 'DANGKY_LOPHOCPHAN_MA' },
                { 'mDataProp': 'DANGKY_LOPHOCPHAN_TEN' },
                { 'mDataProp': 'DAOTAO_HOCPHAN_TEN' },
                { 'mDataProp': 'SOTINCHI' },
                { 'mDataProp': 'KIEUHOC_TEN' },
                {
                    'mRender': function (nRow, aData) {
                        var checked = me._selectedMap[aData.ID] ? 'checked' : '';
                        var inputType = me._multiple ? 'checkbox' : 'radio';
                        return '<input type="' + inputType + '" name="dspicker-row" class="dspicker-row-check" data-id="' + aData.ID + '" ' + checked + '/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        $('#chkSelectAll_DSDangKyHocPicker').prop('checked', false);
        me._updateChonCounter();
    },

    _onRowCheckChange: function (id, checked) {
        var me = this;
        if (!id) return;
        if (checked) {
            var rec = (me._dtCurrent || []).find(function (r) { return String(r.ID) === String(id); });
            if (rec) {
                if (!me._multiple) {
                    me._selectedMap = {};
                    $('#tblDSDangKyHocPicker tbody input.dspicker-row-check').each(function () {
                        if ($(this).attr('data-id') !== id) this.checked = false;
                    });
                }
                me._selectedMap[id] = rec;
            }
        } else {
            delete me._selectedMap[id];
        }
        me._updateChonCounter();
    },

    _updateChonCounter: function () {
        var n = Object.keys(this._selectedMap).length;
        $('#lblDSDangKyHocPicker_Chon').text('Đã chọn: ' + n);
    },

    _onOk: function () {
        var me = this;
        var arr = Object.keys(me._selectedMap).map(function (k) { return me._selectedMap[k]; });
        if (arr.length === 0) {
            me._showError('Vui lòng chọn ít nhất một bản ghi.');
            return;
        }
        $('#modalDSDangKyHocPicker').modal('hide');
        if (typeof me._callback === 'function') {
            try { me._callback(arr); } catch (er) { console.error('DSDangKyHocPicker callback error', er); }
        }
    }
};

// Singleton
window.DSDangKyHocPicker = new DSDangKyHocPicker();
