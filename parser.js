/* Baca & analisis senarai murid (eksport Excel APDM/MOEIS).
   Fungsi tulen: terima baris (array 2D) -> kembalikan data ringkas.
   Hanya lajur yang dipaparkan sistem dibaca: ID MURID, NAMA, NO. PENGENALAN,
   STATUS PENGAJIAN, NAMA KELAS, JANTINA (+ TAHUN untuk susunan kelas).
   Semua lajur lain (alamat, pendapatan, akaun bank, penjaga...) DIBUANG. */
(function (root) {
  var TAHUN = { SATU: 1, DUA: 2, TIGA: 3, EMPAT: 4, LIMA: 5, ENAM: 6 };
  var WAJIB = ['ID MURID', 'NAMA', 'NO. PENGENALAN', 'STATUS PENGAJIAN', 'NAMA KELAS', 'JANTINA', 'TAHUN / TINGKATAN'];

  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().toUpperCase(); }

  function tahunNo(label) {
    var t = norm(label);
    if (t === 'PRASEKOLAH') return 0;
    var m = t.match(/^TAHUN (\w+)$/);
    if (m && TAHUN[m[1]]) return TAHUN[m[1]];
    return 99;
  }

  function parse(rows, opts) {
    opts = opts || {};
    var h = -1;
    for (var i = 0; i < Math.min(rows.length, 30); i++) {
      var cells = rows[i].map(norm);
      if (cells.indexOf('NAMA') >= 0 && cells.indexOf('JANTINA') >= 0) { h = i; break; }
    }
    if (h < 0) throw new Error('Fail ini bukan senarai murid yang sah (tajuk lajur NAMA / JANTINA tidak dijumpai).');

    var col = {};
    rows[h].forEach(function (c, idx) { var k = norm(c); if (k && !(k in col)) col[k] = idx; });
    var hilang = WAJIB.filter(function (k) { return !(k in col); });
    if (hilang.length) throw new Error('Lajur wajib tiada dalam fail: ' + hilang.join(', ') + '.');

    var sekolah = '', kod = '';
    for (var r = 0; r < h; r++) {
      rows[r].forEach(function (c) {
        var v = String(c == null ? '' : c).trim();
        if (!sekolah && /^SEKOLAH /i.test(v)) sekolah = v;
        else if (!kod && /^[A-Z]{3}\d{3,4}$/.test(v)) kod = v;
      });
    }

    var get = function (row, name) { return String(row[col[name]] == null ? '' : row[col[name]]).trim(); };
    var murid = [], tidakAktif = 0, jantinaLain = 0;
    for (var j = h + 1; j < rows.length; j++) {
      var row = rows[j], nama = get(row, 'NAMA');
      if (!nama) continue;
      var status = norm(get(row, 'STATUS PENGAJIAN'));
      if (status && status !== 'BERSEKOLAH') tidakAktif++;
      var jt = norm(get(row, 'JANTINA'));
      var jantina = jt === 'LELAKI' ? 'L' : jt === 'PEREMPUAN' ? 'P' : '?';
      if (jantina === '?') jantinaLain++;
      murid.push({
        id: get(row, 'ID MURID'),
        nama: nama,
        kp: get(row, 'NO. PENGENALAN'),
        status: status,
        kelas: get(row, 'NAMA KELAS') || '(Tiada kelas)',
        j: jantina,
        t: tahunNo(get(row, 'TAHUN / TINGKATAN')) // untuk susunan/kumpulan kelas sahaja
      });
    }
    if (!murid.length) throw new Error('Tiada rekod murid dijumpai dalam fail.');

    var tm = /(\d{4})-(\d{2})-(\d{2})/.exec(opts.fileName || '');
    return {
      sekolah: sekolah, kod: kod,
      tarikhData: tm ? tm[0] : '',
      murid: murid, tidakAktif: tidakAktif, jantinaLain: jantinaLain
    };
  }

  var api = { parse: parse };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SMM = api;
})(typeof window !== 'undefined' ? window : globalThis);
