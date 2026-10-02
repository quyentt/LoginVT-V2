// node dem-theo-he.js — đếm dữ liệu đào tạo THEO TỪNG HỆ trên host (qua _v2, chỉ đọc)
// + xem cột người tạo / ngày tạo để đoán nguồn (nhập tay hay đồng bộ).
const { connect, readTk } = require('./cdp');
(async () => {
  const b = await connect();
  const tk = readTk();
  await b.goto(tk.url.replace(/#.*$/, '') + '#/');
  await b.waitFor('window.ums && ums.session && ums.session.ready', 30000);
  await b.say('Đếm dữ liệu đào tạo theo từng hệ (chỉ đọc)');
  const kq = await b.ev(`(async function(){
    var C = function(o){ return ums.api.call(Object.assign({silent:true}, o)).then(function(r){return r.data||[]}, function(e){return 'LỖI '+e.message}); };
    var he = await C({ action:'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4P', func:'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao', strDAOTAO_HinhThucDaoTao_Id:'', strDaoTao_BacDaoTao_Id:'', strTuKhoa:'', pageIndex:1, pageSize:1000 });
    var out = { he: [], mau: {} };
    for (var i = 0; i < he.length; i++) {
      var h = he[i];
      var khoa = await C({ action:'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLgPP', func:'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao', strDAOTAO_HeDaoTao_Id:h.ID, strDaoTao_CoSoDaoTao_Id:'', strTuKhoa:'', pageIndex:1, pageSize:10000 });
      var ct = await C({ action:'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUP', func:'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT', strDaoTao_HeDaoTao_Id:h.ID, strDaoTao_KhoaDaoTao_Id:'', strDaoTao_N_CN_Id:'', strDaoTao_KhoaQuanLy_Id:'', strDaoTao_ToChucCT_Cha_Id:'', strTuKhoa:'', pageIndex:1, pageSize:10000 });
      var lop = await C({ action:'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04', func:'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy', strDaoTao_CoSoDaoTao_Id:'', strDaoTao_HeDaoTao_Id:h.ID, strDaoTao_KhoaDaoTao_Id:'', strDaoTao_Nganh_Id:'', strDaoTao_LoaiLop_Id:'', strDaoTao_ToChucCT_Id:'', strTuKhoa:'', pageIndex:1, pageSize:10000 });
      var hp = '-';
      if (Array.isArray(ct) && ct.length) {
        var dem = 0;
        for (var j = 0; j < Math.min(ct.length, 3); j++) {
          var x = await C({ action:'KHCT_ThongTin/LayDSKS_HocPhan_CT_TC', method:'POST', strTuKhoa:'', strDaoTao_ChuongTrinh_Id: ct[j].ID, pageIndex:1, pageSize:10000 });
          dem += Array.isArray(x) ? x.length : 0;
        }
        hp = dem + ' (trong ' + Math.min(ct.length, 3) + ' CT đầu)';
      }
      out.he.push([h.TENHEDAOTAO || h.MAHEDAOTAO, Array.isArray(khoa) ? khoa.length : khoa, Array.isArray(ct) ? ct.length : ct, Array.isArray(lop) ? lop.length : lop, hp]);
      if (Array.isArray(ct) && ct[0] && !out.mau.ct) out.mau.ct = ct[0];
      if (Array.isArray(lop) && lop[0] && !out.mau.lop) out.mau.lop = lop[0];
    }
    // Cột gợi nguồn gốc của một bản ghi mẫu
    ['ct','lop'].forEach(function(k){ var r = out.mau[k]; if (!r) return; var o = {};
      Object.keys(r).forEach(function(c){ if (/NGUOITAO|NGAYTAO|TAIKHOAN|NGUON|SOURCE|SYNC|CRM|DONGBO|MA_?NGOAI|EXTERNAL/i.test(c)) o[c] = r[c]; });
      out.mau[k] = o; });
    return out;
  })()`);
  b.log('Hệ | khoá | chương trình | lớp QL | học phần của CT');
  kq.he.forEach(r => b.log('  ' + r.join(' | ')));
  b.log('Cột nguồn gốc (CT mẫu): ' + JSON.stringify(kq.mau.ct));
  b.log('Cột nguồn gốc (lớp mẫu): ' + JSON.stringify(kq.mau.lop));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
