/* Dữ liệu mẫu cho hangdoi/chuyendulieu — chỉ dùng ở chế độ dựng thử.
   Khoá CMS_HangDoiTuTao/LayDanhSach dùng chung với ums.queue của màn khác → chỉ trả
   dữ liệu của loại CHUYENDULIEU_IU_SANGDOITAC, loại khác trả về bản đã khai trước đó. */
(function () {
    var LOAI = 'CHUYENDULIEU_IU_SANGDOITAC';
    var fx = ums.demo.fixtures || {};
    var cu = fx['CMS_HangDoiTuTao/LayDanhSach'];
    var DS = [
        { ID: 'HDC1', TEN: 'Chuyển dữ liệu sang đối tác 22/09/2026', TONGDULIEUCANTHUCHIEN: 1250, TONGDULIEUDAHOANTHANH: 430,
          NGUOITHUCHIEN_TENDAYDU: 'Quản trị hệ thống', NGAYTAO_DD_MM_YYYY_HHMMSS: '22/09/2026 16:40:02' },
        { ID: 'HDC2', TEN: 'Chuyển dữ liệu sang đối tác 15/09/2026', TONGDULIEUCANTHUCHIEN: 1180, TONGDULIEUDAHOANTHANH: 1180,
          NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Thị Lan', NGAYTAO_DD_MM_YYYY_HHMMSS: '15/09/2026 09:12:47' },
        { ID: 'HDC3', TEN: 'Chuyển dữ liệu sang đối tác 01/09/2026', TONGDULIEUCANTHUCHIEN: 1096, TONGDULIEUDAHOANTHANH: 1096,
          NGUOITHUCHIEN_TENDAYDU: 'Trần Văn Hùng', NGAYTAO_DD_MM_YYYY_HHMMSS: '01/09/2026 08:05:33' }
    ];
    ums.demo.add({
        'CMS_HangDoiTuTao/LayDanhSach': function (o) {
            if (o.strLoaiNhiemVu_Id === LOAI) return DS;
            return typeof cu === 'function' ? cu(o) : (cu || []);
        },
        'D_HangDoi/TaoHangDoi_ChuyenDuLieu_TuDong': function () {
            if (DS[0].TONGDULIEUDAHOANTHANH === DS[0].TONGDULIEUCANTHUCHIEN) {
                DS.unshift({ ID: 'HDC' + (DS.length + 1), TEN: 'Chuyển dữ liệu sang đối tác 25/09/2026', TONGDULIEUCANTHUCHIEN: 1300, TONGDULIEUDAHOANTHANH: 0,
                    NGUOITHUCHIEN_TENDAYDU: 'Quản trị hệ thống', NGAYTAO_DD_MM_YYYY_HHMMSS: '25/09/2026 10:00:00' });
            }
            return { rows: [], message: '' };
        }
    });
})();
