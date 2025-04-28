export function calculateCombinedScore(entries) {
  const scores = {};

  function calculateK(role, sameRoleCount, roleIndex) {
    if (!role || isNaN(roleIndex) || isNaN(sameRoleCount)) return 1;
    role = role.toLowerCase();

    if (role === 'ogrenci' && sameRoleCount === 2) return 1;
    if (role === 'ogrenci' && sameRoleCount === 3) return roleIndex === 2 ? 0.6 : 1;
    if (role === 'danisman' && sameRoleCount === 3 && roleIndex === 3) return 1;
    if (sameRoleCount === 1) return 1;
    if (sameRoleCount === 2) return 0.8;
    if (sameRoleCount === 3) return 0.6;
    if (sameRoleCount === 4) return 0.5;
    if (sameRoleCount >= 5 && sameRoleCount < 10) return 1 / sameRoleCount;
    if (sameRoleCount >= 10) return 0.1;
    return 1;
  }

  function calculateBonusMultiplier(item) {
    let multiplier = 1;
    if (item.isInterInstitutional) multiplier *= 1.3;
    if (item.isReviewArticle) multiplier *= 1.2;
    const authorCount = parseInt(item.sameRoleCount);
    if (authorCount >= 5) {
      if (item.isFirstOrCorrespondingAuthor) multiplier *= 1.8;
      else if (item.isEqualFirstOrCorrespondingAuthor) multiplier *= 1.4;
    }
    return multiplier;
  }

  // A. Makaleler
  let totalA = 0, detailsA = [], incompleteA = [];
  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith("A. Makaleler")) return;
    items.forEach(item => {
      const isComplete = Object.entries(item)
        .filter(([k]) => !k.startsWith('is'))
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');
      if (!isComplete) return incompleteA.push(key);

      let baseScore = 0;
      if (key.includes('Q1')) baseScore = 60;
      else if (key.includes('Q2')) baseScore = 55;
      else if (key.includes('Q3')) baseScore = 40;
      else if (key.includes('Q4')) baseScore = 30;
      else if (key.includes('ESCI')) baseScore = 25;
      else if (key.includes('Scopus')) baseScore = 20;
      else if (key.includes('ULAKBİM TR Dizin')) baseScore = 10;
      else baseScore = 8;

      const k = calculateK(item.role, parseInt(item.sameRoleCount), parseInt(item.roleIndex));
      const bonusMultiplier = calculateBonusMultiplier(item);
      const score = baseScore * k * bonusMultiplier;

      totalA += score;
      detailsA.push({ type: key, base: baseScore, k, bonusMultiplier, score: Math.round(score) });
    });
  });
  if (totalA > 0 || incompleteA.length > 0) {
    scores['A. Makaleler'] = { total: Math.round(totalA), details: detailsA, incomplete: incompleteA };
  }

  // B. Bilimsel Toplantı Faaliyetleri
  let totalB = 0, detailsB = [], incompleteB = [];
  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith("B. Bilimsel Toplantı Faaliyetleri")) return;
    items.forEach(item => {
      const isComplete = Object.entries(item)
        .filter(([k]) => !k.startsWith('is'))
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');
      if (!isComplete) return incompleteB.push(key);

      let baseScore = 5;
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('tam metni matbu') && lowerKey.includes('uluslararası')) baseScore = 8;
      else if (lowerKey.includes('özet metni') && lowerKey.includes('uluslararası')) baseScore = 7;
      else if (lowerKey.includes('poster olarak sunulan') && lowerKey.includes('uluslararası')) baseScore = 6;
      else if (lowerKey.includes('tam metni matbu') && lowerKey.includes('ulusal')) baseScore = 7;
      else if (lowerKey.includes('özet metni') && lowerKey.includes('ulusal')) baseScore = 6;
      else if (lowerKey.includes('poster olarak sunulan') && lowerKey.includes('ulusal')) baseScore = 5;
      else if (lowerKey.includes('davetli konuşmacı') && lowerKey.includes('uluslararası')) baseScore = 8;
      else if (lowerKey.includes('davetli konuşmacı') && lowerKey.includes('ulusal')) baseScore = 6;
      else if (
        lowerKey.includes('atölye') ||
        lowerKey.includes('çalıştay') ||
        lowerKey.includes('panel') ||
        lowerKey.includes('seminer')
      ) baseScore = 5;

      const k = calculateK(item.role, parseInt(item.sameRoleCount), parseInt(item.roleIndex));
      const bonusMultiplier = calculateBonusMultiplier(item);
      const score = baseScore * k * bonusMultiplier;

      totalB += score;
      detailsB.push({ type: key, base: baseScore, k, bonusMultiplier, score: Math.round(score) });
    });
  });
  if (totalB > 0 || incompleteB.length > 0) {
    scores['B. Bilimsel Toplantı Faaliyetleri'] = { total: Math.round(totalB), details: detailsB, incomplete: incompleteB };
  }

  // C. Kitaplar
  let totalC = 0, detailsC = [], incompleteC = [];
  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith("C. Kitaplar")) return;
    items.forEach(item => {
      const isComplete = Object.entries(item)
        .filter(([k]) => !k.startsWith('is'))
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');
      if (!isComplete) return incompleteC.push(key);

      let baseScore = 0;
      if (key.includes('Uluslararası yayınevleri tarafından yayımlanmış özgün kitap')) baseScore = 30;
      else if (key.includes('Ulusal yayınevleri tarafından yayımlanmış özgün kitap')) baseScore = 20;
      else if (key.includes('Kitap editörlüğü')) baseScore = 10;
      else if (key.includes('Kitap bölümü')) baseScore = 5;
      else baseScore = 5;

      const k = calculateK(item.role, parseInt(item.sameRoleCount), parseInt(item.roleIndex));
      const bonusMultiplier = calculateBonusMultiplier(item);
      const score = baseScore * k * bonusMultiplier;

      totalC += score;
      detailsC.push({ type: key, base: baseScore, k, bonusMultiplier, isForeign: item.isForeign, score: Math.round(score) });
    });
  });
  if (totalC > 0 || incompleteC.length > 0) {
    scores['C. Kitaplar'] = { total: Math.round(totalC), details: detailsC, incomplete: incompleteC };
  }

  // G. Patentler
  let totalG = 0, detailsG = [], incompleteG = [];
  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith("G. Patentler")) return;
    items.forEach(item => {
      const isComplete = Object.entries(item)
        .filter(([k]) => !k.startsWith('is'))
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');
      if (!isComplete) return incompleteG.push(key);

      let baseScore = 0;
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('lisanslanan uluslararası patent')) baseScore = 120;
      else if (lowerKey.includes('tescillenmiş uluslararası patent')) baseScore = 100;
      else if (lowerKey.includes('uluslararası patent başvurusu')) baseScore = 50;
      else if (lowerKey.includes('lisanslanan ulusal patent')) baseScore = 80;
      else if (lowerKey.includes('tescillenmiş ulusal patent')) baseScore = 60;
      else if (lowerKey.includes('ulusal patent başvurusu')) baseScore = 30;
      else if (lowerKey.includes('lisanslanan faydalı model') || lowerKey.includes('endüstriyel tasarım') || lowerKey.includes('marka')) baseScore = 20;
      else if (lowerKey.includes('faydalı model') || lowerKey.includes('endüstriyel tasarım')) baseScore = 15;
      else baseScore = 10;

      const k = calculateK(item.role, parseInt(item.sameRoleCount), parseInt(item.roleIndex));
      const bonusMultiplier = calculateBonusMultiplier(item);
      const score = baseScore * k * bonusMultiplier;

      totalG += score;
      detailsG.push({ type: key, base: baseScore, k, bonusMultiplier, score: Math.round(score) });
    });
  });
  if (totalG > 0 || incompleteG.length > 0) {
    scores['G. Patentler'] = { total: Math.round(totalG), details: detailsG, incomplete: incompleteG };
  }




  // D. Atıflar
  let totalD = 0;
  let detailsD = [];
  let incompleteD = [];

  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith('D. Atıflar')) return;

    items.forEach(item => {
      const isComplete = Object.entries(item)
        .filter(([k]) => k !== 'isForeign' && k !== 'isAfterPhD')
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');

      if (!isComplete) {
        incompleteD.push(key);
        return;
      }

      const count = parseInt(item['Atıf Sayısı'], 10);
      if (!isNaN(count)) {
        const score = count * 1; // Her atıf için 1 puan örnek
        totalD += score;
        detailsD.push({ type: key, score });
      } else {
        incompleteD.push(key);
      }
    });
  });

  if (totalD > 0 || incompleteD.length > 0) {
    scores['D. Atıflar'] = { total: totalD, details: detailsD, incomplete: incompleteD };
  }

  // E. Eğitim Öğretim Faaliyetleri
  let totalE = 0;
  let detailsE = [];
  let incompleteE = [];

  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith('E. Eğitim Öğretim Faaliyetleri')) return;

    items.forEach(item => {
      const isComplete = Object.entries(item)
        .filter(([k]) => k !== 'isForeign' && k !== 'isAfterPhD' && k !== 'isForeignLang')
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');

      if (!isComplete || !item.isAfterPhD) {
        incompleteE.push(key);
        return;
      }

      let puan = 0;
      const isLisansUstu = key.toLowerCase().includes("lisansüstü");
      const isForeign = item.isForeignLang;

      if (isLisansUstu && isForeign) puan = 4;
      else if (isLisansUstu) puan = 3;
      else if (!isLisansUstu && isForeign) puan = 3;
      else puan = 2;

      totalE += puan;
      detailsE.push({ type: key, score: puan });
    });
  });

  if (totalE > 0 || incompleteE.length > 0) {
    scores['E. Eğitim Öğretim Faaliyetleri'] = {
      total: Math.min(50, totalE),
      details: detailsE,
      incomplete: incompleteE
    };
  }

  // F. Tez Yöneticiliği
  let totalF = 0;
  let detailsF = [];
  let incompleteF = [];

  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith('F. Tez Yöneticiliği')) return;

    items.forEach(item => {
      const isComplete = Object.entries(item)
        .filter(([k]) => !k.startsWith('is'))
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');

      if (!isComplete) {
        incompleteF.push(key);
        return;
      }

      let score = 0;
      const lowerKey = key.toLowerCase();

      if (lowerKey.includes('doktora') || lowerKey.includes('sanatta yeterlik') || lowerKey.includes('uzmanlık')) {
        if (lowerKey.includes('eş danışman')) {
          score = 9;
        } else {
          score = 40;
        }
      } else if (lowerKey.includes('yüksek lisans')) {
        if (lowerKey.includes('eş danışman')) {
          score = 4;
        } else {
          score = 15;
        }
      } else {
        score = 5; // Varsayılan düşük puan (emin olunamayan durumlar için)
      }

      totalF += score;
      detailsF.push({ type: key, score });
    });
  });

  if (totalF > 0 || incompleteF.length > 0) {
    scores['F. Tez Yöneticiliği'] = {
      total: totalF,
      details: detailsF,
      incomplete: incompleteF
    };
  }
 
  // H. Araştırma Projeleri
  let totalH = 0;
  let detailsH = [];
  let incompleteH = [];

  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith('H. Araştırma Projeleri')) return;

    items.forEach(item => {
      const isComplete = Object.entries(item)
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');

      if (!isComplete) {
        incompleteH.push(key);
        return;
      }

      let score = 0;
      const lowerKey = key.toLowerCase();

      if (lowerKey.includes('koordinatör') && lowerKey.includes('ab çerçeve programı')) score = 250;
      else if (lowerKey.includes('yürütücü') && lowerKey.includes('ab çerçeve programı')) score = 150;
      else if (lowerKey.includes('araştırmacı') && lowerKey.includes('ab çerçeve programı')) score = 100;

      else if (lowerKey.includes('koordinatör') && lowerKey.includes('uluslararası destekli')) score = 150;
      else if (lowerKey.includes('yürütücü') && lowerKey.includes('uluslararası destekli')) score = 120;
      else if (lowerKey.includes('araştırmacı') && lowerKey.includes('uluslararası destekli')) score = 70;
      else if (lowerKey.includes('danışman') && lowerKey.includes('uluslararası destekli')) score = 30;

      else if (lowerKey.includes('tübitak arge') && lowerKey.includes('yürütücü')) score = 100;
      else if ((lowerKey.includes('diğer tübitak') || lowerKey.includes('kalkınma ajansı')) && lowerKey.includes('yürütücü')) score = 50;
      else if ((lowerKey.includes('tübitak dışı') || lowerKey.includes('kamu')) && lowerKey.includes('yürütücü')) score = 40;
      else if ((lowerKey.includes('sanayi') || lowerKey.includes('özel kuruluş')) && lowerKey.includes('yürütücü')) score = 20;

      else if ((lowerKey.includes('tübitak arge') || lowerKey.includes('tüseb')) && lowerKey.includes('araştırmacı')) score = 50;
      else if ((lowerKey.includes('diğer tübitak') || lowerKey.includes('kalkınma ajansı')) && lowerKey.includes('araştırmacı')) score = 25;
      else if ((lowerKey.includes('tübitak dışı') || lowerKey.includes('kamu')) && lowerKey.includes('araştırmacı')) score = 20;
      else if ((lowerKey.includes('sanayi') || lowerKey.includes('özel kuruluş')) && lowerKey.includes('araştırmacı')) score = 10;

      else if ((lowerKey.includes('tübitak arge') || lowerKey.includes('tüseb')) && lowerKey.includes('danışman')) score = 25;
      else if (lowerKey.includes('diğer tübitak') && lowerKey.includes('danışman')) score = 12;
      else if ((lowerKey.includes('tübitak dışı') || lowerKey.includes('kamu') || lowerKey.includes('sanayi') || lowerKey.includes('özel kuruluş')) && lowerKey.includes('danışman')) score = 10;

      else if (lowerKey.includes('bap') && lowerKey.includes('yürütücü')) score = 8;
      else if (lowerKey.includes('bap') && lowerKey.includes('araştırmacı')) score = 6;
      else if (lowerKey.includes('bap') && lowerKey.includes('danışman')) score = 3;

      else if (lowerKey.includes('en az dört aylık') && lowerKey.includes('yurtdışı')) score = 100;
      else if (lowerKey.includes('en az dört aylık') && lowerKey.includes('yurtiçi')) score = 50;

      else if (lowerKey.includes('tübitak 2209') || lowerKey.includes('2242')) score = 10;

      else score = 5;

      totalH += score;
      detailsH.push({ type: key, score });
    });
  });

  if (totalH > 0 || incompleteH.length > 0) {
    scores['H. Araştırma Projeleri'] = {
      total: totalH,
      details: detailsH,
      incomplete: incompleteH
    };
  }
  // I. Editörlük, Yayın Kurulu Üyeliği ve Hakemlik Faaliyetleri
  let totalI = 0;
  let detailsI = [];
  let incompleteI = [];

  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith('I. Editörlük')) return;

    items.forEach(item => {
      const isComplete = Object.entries(item)
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');

      if (!isComplete) {
        incompleteI.push(key);
        return;
      }

      let score = 0;
      const lowerKey = key.toLowerCase();

      if (lowerKey.includes('baş editör') && lowerKey.includes('sci') || lowerKey.includes('ssci') || lowerKey.includes('ahci') || lowerKey.includes('e-sci') || lowerKey.includes('scopus')) score = 100;
      else if (lowerKey.includes('alan') || lowerKey.includes('yardımcı') || lowerKey.includes('ortak') || lowerKey.includes('asistan')) {
        if (lowerKey.includes('sci') || lowerKey.includes('ssci') || lowerKey.includes('ahci') || lowerKey.includes('e-sci') || lowerKey.includes('scopus')) score = 70;
        else if (lowerKey.includes('ulusal') || lowerKey.includes('uluslararası')) score = 30;
        else if (lowerKey.includes('ulakbim')) score = 5;
      }
      else if (lowerKey.includes('misafir') || lowerKey.includes('davetli')) {
        if (lowerKey.includes('sci') || lowerKey.includes('ssci') || lowerKey.includes('ahci') || lowerKey.includes('e-sci') || lowerKey.includes('scopus')) score = 50;
        else score = 20;
      }
      else if (lowerKey.includes('yayın kurulu')) {
        if (lowerKey.includes('sci') || lowerKey.includes('ssci') || lowerKey.includes('ahci') || lowerKey.includes('e-sci') || lowerKey.includes('scopus')) score = 40;
        else if (lowerKey.includes('uluslararası')) score = 10;
        else if (lowerKey.includes('ulakbim')) score = 5;
      }
      else if (lowerKey.includes('ulakbim') && lowerKey.includes('baş editör')) score = 15;
      else if (lowerKey.includes('hakemlik')) {
        if (lowerKey.includes('sci') || lowerKey.includes('ssci') || lowerKey.includes('ahci')) score = 3;
        else if (lowerKey.includes('uluslararası')) score = 2;
        else if (lowerKey.includes('ulakbim')) score = 1;
      } else {
        score = 1;
      }

      totalI += score;
      detailsI.push({ type: key, score });
    });
  });

  if (totalI > 0 || incompleteI.length > 0) {
    scores['I. Editörlük, Yayın Kurulu Üyeliği ve Hakemlik Faaliyetleri'] = {
      total: totalI,
      details: detailsI,
      incomplete: incompleteI
    };
  }
  // J. Ödüller
  let totalJ = 0;
  let detailsJ = [];
  let incompleteJ = [];

  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith('J. Ödüller')) return;

    items.forEach(item => {
      const isComplete = Object.entries(item)
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');

      if (!isComplete) {
        incompleteJ.push(key);
        return;
      }

      let score = 0;
      const lowerKey = key.toLowerCase();

      if (lowerKey.includes('jürili uluslararası') && lowerKey.includes('bilim ve sanat')) score = 150;
      else if (lowerKey.includes('tübitak') && lowerKey.includes('bilim') || lowerKey.includes('hizmet')) score = 100;
      else if (lowerKey.includes('tüba') && lowerKey.includes('akademi')) score = 100;
      else if (lowerKey.includes('tübitak') && lowerKey.includes('teşvik')) score = 80;
      else if (lowerKey.includes('tüba') && (lowerKey.includes('gebip') || lowerKey.includes('tesep'))) score = 80;
      else if (lowerKey.includes('jürili ulusal') && lowerKey.includes('bilim ve sanat')) score = 50;
      else if (lowerKey.includes('jüri değerlendirmesi olmayan')) score = 20;
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('birincilik')) score = 20;
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('ikincilik')) score = 10;
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('üçüncülük')) score = 5;
      else if (lowerKey.includes('ulusal') && lowerKey.includes('birincilik')) score = 10;
      else if (lowerKey.includes('ulusal') && lowerKey.includes('ikincilik')) score = 5;
      else if (lowerKey.includes('ulusal') && lowerKey.includes('üçüncülük')) score = 3;
      else if (lowerKey.includes('uluslararası bilimsel toplantı')) score = 5;
      else if (lowerKey.includes('ulusal bilimsel toplantı')) score = 3;
      else if (lowerKey.includes('sanat') && lowerKey.includes('uluslararası')) score = 20;
      else if (lowerKey.includes('sanat') && lowerKey.includes('ulusal')) score = 10;
      else if (lowerKey.includes('üniversite') && lowerKey.includes('kurumsal')) score = 10;
      else if (lowerKey.includes('kitap') || lowerKey.includes('makale')) score = 5;
      else score = 3;

      totalJ += score;
      detailsJ.push({ type: key, score });
    });
  });

  if (totalJ > 0 || incompleteJ.length > 0) {
    scores['J. Ödüller'] = {
      total: totalJ,
      details: detailsJ,
      incomplete: incompleteJ
    };
  }
  // K. İdari Görevler ve Üniversiteye Katkı Faaliyetleri
  let totalK = 0;
  let detailsK = [];
  let incompleteK = [];

  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith('K. İdari Görevler ve Üniversiteye Katkı Faaliyetleri')) return;

    items.forEach(item => {
      const isComplete = Object.entries(item).every(([_, v]) => v.trim() !== '');

      if (!isComplete) {
        incompleteK.push(key);
        return;
      }

      let score = 0;
      if (key.includes('Dekan/Enstitü/Yüksekokul/MYO/Merkez Müdürü')) score = 15;
      else if (key.includes('Enstitü Müdür Yrd.')) score = 12;
      else if (key.includes('Bölüm Başkan Yrd.')) score = 10;
      else if (key.includes('Rektörlükçe görevlendirilen Koordinatörlük')) score = 8;
      else if (key.includes('Rektörlükçe görevlendirilen Koordinatör Yardımcıları')) score = 7;
      else if (key.includes('Rektörlükçe görevlendirilen üniversite düzeyinde Komisyon/Kurul üyelikleri')) score = 6;
      else if (key.includes('Dekanlık/Y.O. Müdürlüğü/MYO Müdürlüğü')) score = 5;
      else if (key.includes('Bölüm Başkanlıkları tarafından görevlendirilen Komisyon/Kurul üyelikleri')) score = 4;
      else if (key.includes('Rektörlük/Dekanlık/Y.O. Müdürlüğü/MYO Müdürlüğü')) score = 3;
      else if (key.includes('Uluslararası nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde')) score = 5;
      else if (key.includes('Ulusal nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde')) score = 4;
      else if (key.includes('Yerel nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde')) score = 3;

      totalK += score;
      detailsK.push({ type: key, score });
    });
  });

  if (totalK > 0 || incompleteK.length > 0) {
    scores['K. İdari Görevler ve Üniversiteye Katkı Faaliyetleri'] = {
      total: totalK,
      details: detailsK,
      incomplete: incompleteK
    };
  }
  // L. Güzel Sanatlar Faaliyetleri
  let totalL = 0;
  let detailsL = [];
  let incompleteL = [];

  Object.entries(entries).forEach(([key, items]) => {
    if (!key.startsWith('L. Güzel Sanatlar Faaliyetleri')) return;

    items.forEach(item => {
      const isComplete = Object.entries(item)
        .every(([_, v]) => typeof v === 'string' && v.trim() !== '');

      if (!isComplete) {
        incompleteL.push(key);
        return;
      }

      let score = 0;
      const lowerKey = key.toLowerCase();

      if (lowerKey.includes("telif ödenmesi") && lowerKey.includes("yurt dışında")) score = 40;
      else if (lowerKey.includes("telif ödenmesi") && lowerKey.includes("yurt içinde")) score = 25;
      else if (lowerKey.includes("grup şefi")) score = 15;
      else if (lowerKey.includes("grup üyesi")) score = 13;
      else if (lowerKey.includes("eşlikçi")) score = 18;
      else if (lowerKey.includes("konser yönetmenliği") || lowerKey.includes("dinleti koordinatörlüğü")) score = 10;
      else if (lowerKey.includes('telif ödenmesi') && lowerKey.includes('yurt dışında')) score = 40;  // 1
      else if (lowerKey.includes('telif ödenmesi') && lowerKey.includes('yurt içinde')) score = 25;  // 2
      else if (lowerKey.includes('grup şefi') && lowerKey.includes('ulusal konser')) score = 15;  // 31
      else if (lowerKey.includes('grup üyesi') && lowerKey.includes('ulusal konser')) score = 13;  // 32
      else if (lowerKey.includes('eşlikçi') && lowerKey.includes('resital')) score = 18;  // 33
      else if (lowerKey.includes('konser yönetmenliği')) score = 10;  // 34
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('bireysel ses yayını')) score = 45;  // 35
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('karma ses yayını')) score = 35;  // 36
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('sanat yönetmeni')) score = 30;  // 37
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('program hazırlamak')) score = 15;  // 38
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('katılımcılığı - bireysel')) score = 13;  // 39
      else if (lowerKey.includes('uluslararası') && lowerKey.includes('katılımcılığı - karma')) score = 10;  // 40
      else if (lowerKey.includes('ulusal') && lowerKey.includes('bireysel ses yayını')) score = 40;  // 41
      else if (lowerKey.includes('ulusal') && lowerKey.includes('karma ses yayını')) score = 30;  // 42
      else if (lowerKey.includes('ulusal') && lowerKey.includes('sanat yönetmeni')) score = 25;  // 43
      else if (lowerKey.includes('ulusal') && lowerKey.includes('program hazırlamak')) score = 13;  // 44
      else if (lowerKey.includes('ulusal') && lowerKey.includes('katılımcılığı - bireysel')) score = 10;  // 45
      else if (lowerKey.includes('ulusal') && lowerKey.includes('katılımcılığı - karma')) score = 8;  // 46
      else if (lowerKey.includes('ulusal orkestra') && lowerKey.includes('0 – 5 dakikalık')) score = 30; // 47
      else if (lowerKey.includes('ulusal orkestra') && lowerKey.includes('5 – 10 dakikalık')) score = 35; // 48
      else if (lowerKey.includes('ulusal orkestra') && lowerKey.includes('10 – 15 dakikalık')) score = 40; // 49
      else if (lowerKey.includes('ulusal orkestra') && lowerKey.includes('15 ve üzeri')) score = 45; // 50

      else if (lowerKey.includes('ulusal oda müziği') && lowerKey.includes('0 – 5 dakikalık')) score = 28; // 51
      else if (lowerKey.includes('ulusal oda müziği') && lowerKey.includes('5 – 10 dakikalık')) score = 33; // 52
      else if (lowerKey.includes('ulusal oda müziği') && lowerKey.includes('10 – 15 dakikalık')) score = 38; // 53
      else if (lowerKey.includes('ulusal oda müziği') && lowerKey.includes('15 ve üzeri')) score = 43; // 54

      else if (lowerKey.includes('ulusal elektronik') && lowerKey.includes('0 – 5 dakikalık')) score = 25; // 55
      else if (lowerKey.includes('ulusal elektronik') && lowerKey.includes('5 – 10 dakikalık')) score = 30; // 56
      else if (lowerKey.includes('ulusal elektronik') && lowerKey.includes('10 – 15 dakikalık')) score = 35; // 57
      else if (lowerKey.includes('ulusal elektronik') && lowerKey.includes('15 ve üzeri')) score = 40; // 58

      else if (lowerKey.includes('uluslararası orkestra') && lowerKey.includes('0 – 5 dakikalık')) score = 35; // 59
      else if (lowerKey.includes('uluslararası orkestra') && lowerKey.includes('5 – 10 dakikalık')) score = 40; // 60
      else if (lowerKey.includes('uluslararası orkestra') && lowerKey.includes('10 – 15 dakikalık')) score = 45; // 61
      else if (lowerKey.includes('uluslararası orkestra') && lowerKey.includes('15 ve üzeri')) score = 50; // 62

      else if (lowerKey.includes('uluslararası oda müziği') && lowerKey.includes('0 – 5 dakikalık')) score = 33; // 63
      else if (lowerKey.includes('uluslararası oda müziği') && lowerKey.includes('5 – 10 dakikalık')) score = 38; // 64
      else if (lowerKey.includes('uluslararası oda müziği') && lowerKey.includes('10 – 15 dakikalık')) score = 43; // 65
      else if (lowerKey.includes('uluslararası oda müziği') && lowerKey.includes('15 ve üzeri')) score = 48; // 66

      else if (lowerKey.includes('uluslararası elektronik') && lowerKey.includes('0 – 5 dakikalık')) score = 30; // 67
      else if (lowerKey.includes('uluslararası elektronik') && lowerKey.includes('5 – 10 dakikalık')) score = 35; // 68
      else if (lowerKey.includes('uluslararası elektronik') && lowerKey.includes('10 – 15 dakikalık')) score = 40; // 69
      else if (lowerKey.includes('uluslararası elektronik') && lowerKey.includes('15 ve üzeri')) score = 45; // 70

      else if (lowerKey.includes('türk müziği') && lowerKey.includes('bestelenmiş eser sahibi') && lowerKey.includes('nota ile')) score = 35; // 71
      else if (lowerKey.includes('türk müziği') && lowerKey.includes('seslendirilmiş eser sahibi') && lowerKey.includes('ulusal')) score = 40; // 72
      else if (lowerKey.includes('türk müziği') && lowerKey.includes('seslendirilmiş eser sahibi') && lowerKey.includes('uluslararası')) score = 45; // 73
      else if (lowerKey.includes('türk halk müziği') && lowerKey.includes('derleme yapmak') && lowerKey.includes('trt')) score = 45; // 74
      else if (lowerKey.includes('türk halk müziği') && lowerKey.includes('derleme yapmak') && lowerKey.includes('nota ile')) score = 40; // 75
      else if (lowerKey.includes('türk halk müziği') && lowerKey.includes('notaya alınması') && lowerKey.includes('trt')) score = 15; // 76
      else if (lowerKey.includes('büyük oyun') && lowerKey.includes('yönetmenliği')) score = 18; // 77
      else if (lowerKey.includes('kısa oyun') && lowerKey.includes('yönetmenliği')) score = 7; // 78
      else if ((lowerKey.includes('sahne oyunu') || lowerKey.includes('senaryo')) && lowerKey.includes('uzun') && lowerKey.includes('yazarlığı')) score = 18; // 79
      else if ((lowerKey.includes('sahne oyunu') || lowerKey.includes('senaryo')) && lowerKey.includes('kısa') && lowerKey.includes('yazarlığı')) score = 7; // 80
      else if (lowerKey.includes('uyarlama') && lowerKey.includes('uzun')) score = 10; // 81
      else if (lowerKey.includes('uyarlama') && lowerKey.includes('kısa')) score = 5; // 82
      else if ((lowerKey.includes('dramaturji') || lowerKey.includes('dramaturjisi')) && lowerKey.includes('uzun')) score = 18; // 83
      else if ((lowerKey.includes('dramaturji') || lowerKey.includes('dramaturjisi')) && lowerKey.includes('kısa')) score = 7; // 84
      else if ((lowerKey.includes('çeviri') || lowerKey.includes('metni çevirmek')) && lowerKey.includes('uzun')) score = 10; // 85
      else if ((lowerKey.includes('çeviri') || lowerKey.includes('metni çevirmek')) && lowerKey.includes('kısa')) score = 3; // 86
      else if (lowerKey.includes('başrol') && (lowerKey.includes('film') || lowerKey.includes('oyun') || lowerKey.includes('dizi'))) score = 18; // 87
      else if (lowerKey.includes('diğer roller') && (lowerKey.includes('film') || lowerKey.includes('oyun') || lowerKey.includes('dizi'))) score = 10; // 88
      else if (lowerKey.includes('kısa oyun') && lowerKey.includes('başrol')) score = 7; // 89
      else if (lowerKey.includes('kısa oyun') && lowerKey.includes('diğer roller')) score = 3; // 90
      else if (lowerKey.includes('dekor') || lowerKey.includes('kostüm') || lowerKey.includes('ışık') || lowerKey.includes('ses') || lowerKey.includes('efekt tasarımı')) {
        if (lowerKey.includes('uzun')) score = 18; // 91
        else if (lowerKey.includes('ekibinde')) score = 7; // 92
        else if (lowerKey.includes('kısa')) score = 7; // 93
        else score = 3; // 94
      }
      else if (lowerKey.includes('makyaj') || lowerKey.includes('mask') || lowerKey.includes('kukla') || lowerKey.includes('butafor')) {
        if (lowerKey.includes('uzun') && !lowerKey.includes('ekibinde')) score = 15; // 95
        else if (lowerKey.includes('uzun') && lowerKey.includes('ekibinde')) score = 5; // 96
        else if (lowerKey.includes('kısa') && !lowerKey.includes('ekibinde')) score = 7; // 97
        else if (lowerKey.includes('kısa') && lowerKey.includes('ekibinde')) score = 3; // 98
      }
      else if (lowerKey.includes('sanat yönetmenliği') && lowerKey.includes('uzun')) score = 18; // 99
      else if (lowerKey.includes('sanat yönetmenliği') && lowerKey.includes('kısa')) score = 7; // 100
      else if (lowerKey.includes('koreografi') || lowerKey.includes('dramatizasyon') || lowerKey.includes('performance') || lowerKey.includes('happening') || lowerKey.includes('workshop')) score = 10; // 101
      else if (lowerKey.includes('kongre') || lowerKey.includes('sempozyum') || lowerKey.includes('festival') || lowerKey.includes('atölye çalışması')) score = 7; // 102
      else if (lowerKey.includes('festival') || lowerKey.includes('şenlik') || lowerKey.includes('etkinliklere katılım')) score = 15; // 103
      else if (lowerKey.includes('video kaydı') || lowerKey.includes('tv') || lowerKey.includes('platform') || lowerKey.includes('gösterilmesi') || lowerKey.includes('repertuvar')) score = 18; // 104
      else if (lowerKey.includes('sanatsal bir yarışma') || lowerKey.includes('ödül organizasyonu')) score = 18; // 105



      totalL += score;
      detailsL.push({ type: key, score });
    });
  });

  if (totalL > 0 || incompleteL.length > 0) {
    scores['L. Güzel Sanatlar Faaliyetleri'] = {
      total: totalL,
      details: detailsL,
      incomplete: incompleteL
    };
  }

  return scores;
}