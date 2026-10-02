// node tra-danhmuc.js MA1 MA2 ... — tra mã danh mục trên host (có mã? đang hoạt động? bao nhiêu giá trị?).
// Mở _v2 ở TAB MỚI của Edge đang lái (không đụng tab đang xem), gọi đúng lời gọi của màn
// Quản trị hệ thống → Danh mục dữ liệu (pkg_chung_danhmuc.LayDanhSachDanhMuc). Chỉ đọc.
const { readTk, ensureEdge } = require('./cdp');
(async () => {
  const ma = process.argv.slice(2).map(x => x.toUpperCase());
  await ensureEdge();
  const v = await (await fetch('http://127.0.0.1:9333/json/version')).json();
  const ws = new WebSocket(v.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let i = 0; const w = {}; ws.onmessage = m => { const d = JSON.parse(m.data); if (w[d.id]) w[d.id](d); };
  const s = (method, params = {}, sid) => new Promise(r => { w[++i] = r; ws.send(JSON.stringify({ id: i, method, params, sessionId: sid })); });
  const t = await s('Target.createTarget', { url: readTk().url.replace(/#.*$/, '') + '#/' });
  const a = await s('Target.attachToTarget', { targetId: t.result.targetId, flatten: true }); const sid = a.result.sessionId;
  const ev = async e => { const r = await s('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }, sid);
    if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception ? r.result.exceptionDetails.exception.description : r.result.exceptionDetails.text);
    return r.result.result.value; };
  for (let k = 0; k < 40 && !(await ev('!!(window.ums&&ums.session&&ums.session.ready)')); k++) await new Promise(r => setTimeout(r, 500));
  const kq = await ev(`(async function(){
    var ma=${JSON.stringify(ma)};
    async function ds(tt){ var r=await ums.api.call({silent:true,action:'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',func:'pkg_chung_danhmuc.LayDanhSachDanhMuc',strPhanCapDanhMuc_Id:'',strChung_TenDanhMuc_Cha_Id:'',strNhomDanhMuc_Id:'',strTuKhoa:'',pageIndex:1,pageSize:100000,dTrangThai:tt,strTieuChiSapXep:''}); return r.data||[]; }
    var hd=await ds(1), khong=await ds(0), out=['Danh mục đang hoạt động: '+hd.length+', ngừng: '+khong.length];
    for (var j=0;j<ma.length;j++){
      var a=hd.filter(function(x){return String(x.MADANHMUC).toUpperCase()===ma[j]})[0], b=khong.filter(function(x){return String(x.MADANHMUC).toUpperCase()===ma[j]})[0], x=a||b;
      var gt=await ums.api.call({silent:true,action:'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',method:'GET',strMaBangDanhMuc:ma[j],strTieuChiSapXep:'',dTrangThai:1}).then(function(r){return (r.data||[]).length},function(e){return 'LỖI '+e.message});
      out.push(ma[j]+' | '+(a?'CÓ mã':b?'CÓ mã, NGỪNG hoạt động':'KHÔNG có mã')+(x?' ('+x.TENDANHMUC+')':'')+' | '+gt+' giá trị');
    }
    return out;
  })()`);
  kq.forEach(x => console.log(x));
  await s('Target.closeTarget', { targetId: t.result.targetId }); ws.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
