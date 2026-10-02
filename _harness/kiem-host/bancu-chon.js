// node bancu-chon.js "<chữ mục ô 1>" "<chữ mục ô 2>" ... [--bam "<chữ nút>"]
// Trên màn đang mở (bản cũ hoặc _v2): lần lượt tìm ô chọn có MỤC mang chữ đó, chọn như người thật
// (select2: mở + nhả chuột; ô thường: đặt giá trị + change). --bam: bấm nút/link theo chữ. Chỉ đọc.
const { connect } = require('./cdp');
(async () => {
  const args = process.argv.slice(2);
  const b = await connect();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--bam') {
      const chu = args[++i];
      const sel = await b.ev(`(function(){var chu=${JSON.stringify(chu)}.toLowerCase();
        var ds=Array.prototype.filter.call(document.querySelectorAll('button,a,[onclick],.btn'),function(e){return e.offsetParent&&e.textContent.trim().toLowerCase().indexOf(chu)>=0});
        if(!ds.length)return '';ds[0].setAttribute('data-bam','1');return '[data-bam="1"]';})()`);
      if (!sel) { b.log('Không thấy nút "' + chu + '"'); continue; }
      await b.click(sel, 'Bấm "' + chu + '"');
      await b.ev(`document.querySelector('[data-bam]').removeAttribute('data-bam')`);
      await b.sleep(3500);
      continue;
    }
    const chu = args[i];
    const kq = await b.ev(`(function(){var chu=${JSON.stringify(chu)}.toLowerCase();
      var ss=Array.prototype.filter.call(document.querySelectorAll('select'),function(s){
        var vis=s.offsetParent||(s.nextElementSibling&&s.nextElementSibling.offsetParent);
        return vis&&Array.prototype.some.call(s.options,function(o){return o.text.trim().toLowerCase()===chu});});
      if(!ss.length)return '';var s=ss[0];
      var o=Array.prototype.find.call(s.options,function(o){return o.text.trim().toLowerCase()===chu});
      var t=s.nextElementSibling&&/select2/.test(s.nextElementSibling.className)?s.nextElementSibling:s;
      t.style.outline='3px solid #e00';t.scrollIntoView({block:'center'});
      s.setAttribute('data-chon','1');return (window.jQuery&&jQuery(s).data('select2')?'s2':'thuong')+'|'+o.value;})()`);
    if (!kq) { b.log('Không có ô chọn nào có mục "' + chu + '"'); continue; }
    await b.say('Chọn "' + chu + '"');
    await b.sleep(400);
    const [kieu, v] = kq.split('|');
    if (kieu === 's2') {
      await b.ev(`(function(){var s=document.querySelector('[data-chon]');var t=s.nextElementSibling;if(t)t.style.outline='';jQuery(s).select2('open');})()`);
      await b.sleep(700);
      const ok = await b.ev(`(function(){var chu=${JSON.stringify(chu)}.toLowerCase();
        var li=Array.prototype.find.call(document.querySelectorAll('.select2-container--open .select2-results__option'),function(x){return x.textContent.trim().toLowerCase()===chu});
        if(!li)return false;['mousedown','mouseup','click'].forEach(function(t){li.dispatchEvent(new MouseEvent(t,{bubbles:true}))});return true;})()`);
      if (!ok) await b.ev(`(function(){var s=document.querySelector('[data-chon]');jQuery(s).val(${JSON.stringify(v)}).trigger('change');jQuery(s).select2('close');})()`);
    } else {
      await b.ev(`(function(){var s=document.querySelector('[data-chon]');s.style.outline='';s.value=${JSON.stringify(v)};s.dispatchEvent(new Event('change',{bubbles:true}));if(window.jQuery)jQuery(s).trigger('change');})()`);
    }
    await b.ev(`document.querySelector('[data-chon]').removeAttribute('data-chon')`);
    await b.sleep(2500);
  }
  b.log('Ảnh: ' + await b.shot('chon'));
  b.close();
})().catch(e => { console.error('LỖI', e.message); process.exit(1); });
