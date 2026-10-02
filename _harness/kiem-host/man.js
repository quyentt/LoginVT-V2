// node man.js <roleId> <chucNangId>
// Mở một màn, chờ nạp, rồi lần lượt chọn mục ĐẦU TIÊN của từng ô chọn đang mở và còn trống
// (đi theo chuỗi cha → con). Không bấm nút nào ngoài ô chọn. In lời gọi API + tình trạng ô chọn.
const { connect } = require('./cdp');
(async () => {
  const [role, cn] = process.argv.slice(2);
  const b = await connect();
  await b.hook();
  await b.takeLog();
  await b.say('Mở màn ' + cn);
  await b.ev(`location.hash = '#/r/${role}'`); await b.sleep(1500);
  await b.ev(`location.hash = '#/r/${role}/${cn}'`);
  await b.waitFor(`ums.state.chucNangId === '${cn}'`, 30000);
  await b.sleep(5000);
  const ten = await b.ev(`(document.querySelector('.ums-page__title,h1,h2')||{}).textContent||''`);
  await b.say('Đã mở: ' + ten.trim());
  b.log('Ảnh: ' + await b.shot('mo-' + cn.slice(0, 6)));

  // Danh sách ô chọn đang thấy trên màn
  const dsO = `Array.prototype.map.call(document.querySelectorAll('#ums-content select, .ums-content select, main select'), function (s, i) {
      if (!s.id) s.id = '__s' + i;
      var lab = (s.closest('.ums-field')||{}).querySelector ? ((s.closest('.ums-field').querySelector('label')||{}).textContent||'') : '';
      var vis = !!(s.offsetParent || (s.nextElementSibling && s.nextElementSibling.offsetParent));
      var opts = Array.prototype.filter.call(s.options, function (o) { return o.value !== ''; });
      var head=(Array.prototype.find.call(s.options,function(o){return o.value===''})||{}).text||'';
      return { id: s.id, nhan: (lab || head || s.getAttribute('data-placeholder') || s.getAttribute('aria-label') || s.name || s.id).trim(), mo: !s.disabled, thay: vis, n: opts.length, chon: s.value, nhieu: s.multiple };
    }).filter(function (x) { return x.thay; })`;

  for (let vong = 0; vong < 8; vong++) {
    const os = await b.ev(dsO);
    const o = os.find(x => x.mo && x.n > 0 && !x.chon && !x.nhieu);
    if (!o) break;
    await b.say(`Chọn mục đầu của ô "${o.nhan}" (${o.n} mục)`);
    await b.ev(`(function(){var s=document.getElementById('${o.id}');var t=s.nextElementSibling&&s.nextElementSibling.classList.contains('select2')?s.nextElementSibling:s;t.style.outline='3px solid #e00';t.scrollIntoView({block:'center'});})()`);
    await b.sleep(1500);
    // Bấm như người thật: select2 → mở danh sách rồi nhả chuột trên mục đầu; ô thường → đặt giá trị + change
    const kieu = await b.ev(`(function(){var s=document.getElementById('${o.id}');var t=s.nextElementSibling&&s.nextElementSibling.classList.contains('select2')?s.nextElementSibling:s;t.style.outline='';
      if(window.jQuery&&jQuery(s).data('select2')){jQuery(s).select2('open');return 's2';}
      var v=Array.prototype.find.call(s.options,function(x){return x.value!==''}).value;s.value=v;s.dispatchEvent(new Event('change',{bubbles:true}));return 'thuong';})()`);
    if (kieu === 's2') {
      await b.sleep(1200);
      await b.ev(`(function(){var li=Array.prototype.find.call(document.querySelectorAll('.select2-container--open .select2-results__option'),function(x){return x.getAttribute('aria-disabled')!=='true'&&x.textContent.trim()&&!/^(Chọn|Tất cả)/i.test(x.textContent.trim())})
        ||document.querySelector('.select2-container--open .select2-results__option');
        ['mousedown','mouseup','click'].forEach(function(t){li.dispatchEvent(new MouseEvent(t,{bubbles:true}))});})()`);
    }
    await b.sleep(3500);
  }
  await b.say('Xong — đọc kết quả');
  b.log('Ảnh: ' + await b.shot('sau-chon-' + cn.slice(0, 6)));

  const os = await b.ev(dsO);
  b.log('--- Ô chọn trên màn ---');
  os.forEach(x => b.log(`  ${x.mo ? 'MỞ ' : 'KHOÁ'}  ${String(x.n).padStart(4)} mục  ${x.chon ? '[đã chọn]' : '          '}  ${x.nhan}`));
  b.log('--- Lời gọi API ---');
  (await b.takeLog()).forEach(x => b.log(`  ${String(x.n).padStart(4)}  ${x.action}  ${x.func}  ${JSON.stringify(x.p).slice(0, 160)}${x.loi ? '  LỖI: ' + x.loi : ''}`));
  const bang = await b.ev(`Array.prototype.map.call(document.querySelectorAll('.ums-table tbody'), function(t){return t.rows.length + ' dòng: ' + (t.textContent||'').trim().slice(0,60)})`);
  b.log('--- Bảng ---'); bang.forEach(x => b.log('  ' + x));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
