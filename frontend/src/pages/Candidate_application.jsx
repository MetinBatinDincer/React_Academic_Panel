import React, { useState } from 'react';
import './css/Candidate_application.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/footer'
import { useLocation} from 'react-router-dom';


function CandidateApplication() {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandedSubSections, setExpandedSubSections] = useState([]);
  
  //const { state } = useLocation();
  //const { ilanId } = state || {};
  const { state } = useLocation();
  const { ilanId } = state || {};
  const { basvuruId } = state || {};
  const basvuru = basvuruId;
  


  const navigate = useNavigate();
  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((s) => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };
 
  const toggleSubSection = (subKey) => {
    setExpandedSubSections((prev) =>
      prev.includes(subKey)
        ? prev.filter((k) => k !== subKey)
        : [...prev, subKey]
    );
  };
  const sections = {
    "A. Makaleler": [
      "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q1 olarak taranan dergide)",
      "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q2 olarak taranan dergide)",
      "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q3 olarak taranan dergide)",
      "SCI-E, SSCI veya AHCI kapsamındaki dergilerde yayımlanmış makale (Q4 olarak taranan dergide)",
      "ESCI tarafından taranan dergilerde yayımlanmış makale",
      "Scopus tarafından taranan dergilerde yayımlanmış makale",
      "Uluslararası diğer indekslerde taranan dergilerde yayımlanmış makale",
      "ULAKBİM TR Dizin tarafından taranan ulusal hakemli dergilerde yayımlanmış makale",
      "8. madde dışındaki ulusal hakemli dergilerde yayımlanmış makale"
    ],
    "B. Bilimsel Toplantı Faaliyetleri": [
      "Uluslararası bilimsel toplantılarda sözlü olarak sunulan, tam metni matbu veya elektronik olarak bildiri kitapçığında yayımlanmış çalışmalar",
      "Uluslararası bilimsel toplantılarda sözlü olarak sunulan, özet metni matbu veya elektronik olarak bildiri kitapçığında yayımlanmış çalışmalar",
      "Uluslararası bilimsel toplantılarda poster olarak sunulan çalışmalar",
      "Ulusal bilimsel toplantılarda sözlü olarak sunulan tam metni matbu veya elektronik olarak bildiri kitapçığında yayımlanmış çalışmalar",
      "Ulusal bilimsel toplantılarda sözlü olarak sunulan, özet metni matbu veya elektronik olarak bildiri kitapçığında yayımlanmış çalışmalar",
      "Ulusal bilimsel toplantılarda poster olarak sunulan çalışmalar",
      "Uluslararası bir kongre, konferans veya sempozyumda organizasyon veya yürütme komitesinde düzenleme kurulu üyeliği veya bilim kurulu üyeliği yapmak",
      "Ulusal bir kongre, konferans veya sempozyumda organizasyon veya yürütme komitesinde düzenleme kurulu üyeliği veya bilim kurulu üyeliği yapmak",
      "Uluslararası konferanslarda, bilimsel toplantı, seminerlerde davetli konuşmacı olarak yer almak",
      "Ulusal konferanslarda, bilimsel toplantı, seminerlerde davetli konuşmacı olarak yer almak",
      "Uluslararası veya ulusal çeşitli kurumlarla işbirliği içinde atölye, çalıştay, yaz okulu organize ederek gerçekleştirmek",
      "Uluslararası veya ulusal çeşitli kurumlarla işbirliği içinde atölye, çalıştay, panel, seminer, yaz okulunda konuşmacı veya panelist olarak görev almak"
    ],
    "C. Kitaplar": [
      "Uluslararası yayınevleri tarafından yayımlanmış özgün kitap",
      "Uluslararası yayınevleri tarafından yayımlanmış özgün kitap editörlüğü, bölüm yazarlığı (Her bir kitap için maksimum 2 bölüm yazarlığı)",
      "Uluslararası yayımlanan ansiklopedi konusu/maddesi (en fazla 3 madde)",
      "Ulusal yayınevleri tarafından yayımlanmış özgün kitap",
      "Ulusal yayınevleri tarafından yayımlanmış özgün kitap editörlüğü, bölüm yazarlığı (Her bir kitap için maksimum 2 bölüm yazarlığı)",
      "Tam kitap çevirisi (Yayınevleri için ilgili ÜAK kriterleri geçerlidir)",
      "Çeviri kitap editörlüğü, kitap bölümü çevirisi (Yayınevleri için ilgili ÜAK kriterleri geçerlidir) (Her bir kitap için maksimum 2 bölüm çevirisi)",
      "Alanında ulusal yayımlanan ansiklopedi konusu/maddesi (en fazla 3 madde)"
    ],
    "D. Atıflar": [
      "SCI-E, SSCI ve AHCI tarafından taranan dergilerde; Uluslararası yayınevleri tarafından yayımlanmış kitaplarda yayımlanan ve adayın yazar olarak yer almadığı yayınlardan her birinde, metin içindeki atıf sayısına bakılmaksızın adayın atıf yapılan her eseri için",
      "E-SCI tarafından taranan dergilerde ve adayın yazar olarak yer almadığı yayınlardan her birinde, metin içindeki atıf sayısına bakılmaksızın adayın atıf yapılan her eseri için",
      "SCI-E, SSCI, AHCI, E-SCI dışındaki diğer uluslararası indeksler tarafından taranan dergilerde; Uluslararası yayınevleri tarafından yayımlanmış kitaplarda bölüm yazarı olarak yayımlanan ve adayın yazar olarak yer almadığı yayınlardan her birinde, metin içindeki atıf sayısına bakılmaksızın adayın atıf yapılan her eseri için",
      "Ulusal hakemli dergilerde; Ulusal yayınevleri tarafından yayımlanmış kitaplarda yayımlanan ve adayın yazar olarak yer almadığı yayınlardan her birinde, metin içindeki atıf sayısına bakılmaksızın adayın atıf yapılan her eseri için",
      "Güzel sanatlardaki eserlerin uluslararası kaynak veya yayın organlarında yer alması veya gösterime ya da dinletime girmesi",
      "Güzel sanatlardaki eserlerin ulusal kaynak veya yayın organlarında yer alması veya gösterime ya da dinletime girmesi"
    ],
    "E. Eğitim Öğretim Faaliyetleri": [
      "Önlisans/lisans dersleri",
      "Önlisans/lisans dersleri (Yabancı dilde)",
      "Lisansüstü dersleri",
      "Lisansüstü dersleri (Yabancı dilde)"
    ],
    "F. Tez Yöneticiliği": [
      "Doktora/Sanatta Yeterlik veya Tıp/Diş Hekimliğinde Uzmanlık Tez Yönetimi",
      "Yüksek Lisans Tez Yönetimi",
      "Doktora/Sanatta Yeterlik (Eş Danışman)",
      "Yüksek Lisans/Sanatta Yeterlik Tez Yönetimi (Eş Danışman)"
    ],
    "G. Patentler": [
      "Lisanslanan Uluslararası Patent",
      "Tescillenmiş Uluslararası Patent",
      "Uluslararası Patent Başvurusu",
      "Lisanslanan Ulusal Patent",
      "Tescillenmiş Ulusal Patent",
      "Ulusal Patent Başvurusu",
      "Lisanslanmış Faydalı Model, Endüstriyel Tasarım, Marka",
      "Faydalı Model ve Endüstriyel Tasarım"
    ],
    "H. Araştırma Projeleri": [
      "AB çerçeve programı/NSF/ERC bilimsel araştırma projesinde koordinatör/alt koordinatör olmak",
      "AB çerçeve programı/NSF/ERC bilimsel araştırma projesinde yürütücü olmak",
      "AB çerçeve programı/NSF/ERC bilimsel araştırma projesinde araştırmacı olmak",
      "AB çerçeve Programı/NSF/ERC bilimsel araştırma projeleri dışındaki uluslararası destekli bilimsel araştırma projelerinde (deneme ve rapor hazırlama çalışmaları hariç) koordinatör/alt koordinatör olmak",
      "AB çerçeve Programı/NSF/ERC bilimsel araştırma projeleri dışındaki uluslararası destekli bilimsel araştırma projelerinde (deneme ve rapor hazırlama çalışmaları hariç) yürütücü olmak",
      "AB çerçeve Programı/NSF/ERC bilimsel araştırma projeleri dışındaki uluslararası destekli bilimsel araştırma projelerinde (deneme ve rapor hazırlama çalışmaları hariç) araştırmacı olmak",
      "AB Çerçeve Programı/NSF/ERC bilimsel araştırma projeleri dışındaki uluslararası destekli bilimselaştırma projelerinde (derleme ve rapor hazırlama çalışmaları hariç) danışman olmak",
      "TÜBİTAK ARGE (ARDEB, TEYDEB) ve TÜSEB projelerinde yürütücü olmak",
      "Diğer TÜBİTAK veya Kalkınma Ajansları projelerinde yürütücü olmak",
      "TÜBİTAK dışındaki diğer kamu kurumlarıyla yapılan bilimsel araştırma projelerinde yürütücü olmak",
      "Sanayi kuruluşları ile yapılan Ar-Ge projelerinde yürütücü olmak",
      "Diğer özel kuruluşlar ile yapılan Ar-Ge projelerinde yürütücü olmak",
      "TÜBİTAK ARGE (ARDEB, TEYDEB) ve TÜSEB projelerinde araştırmacı olmak",
      "Diğer TÜBİTAK veya Kalkınma Ajansları projelerinde araştırmacı olmak",
      "TÜBİTAK dışındaki diğer kamu kurumlarıyla yapılan bilimsel araştırma projelerinde araştırmacı olmak",
      "Sanayi kuruluşları ile yapılan bilimsel araştırma projelerinde araştırmacı olmak",
      "Diğer özel kuruluşlar ile yapılan bilimsel araştırma projelerinde araştırmacı olmak",
      "TÜBİTAK ARGE (ARDEB, TEYDEB) ve TÜSEB projelerinde danışman olmak",
      "Diğer TÜBİTAK projelerinde danışman olmak",
      "TÜBİTAK dışındaki diğer kamu kurumlarıyla yapılan bilimsel araştırma projelerinde danışman olmak",
      "Sanayi kuruluşları ile yapılan Ar-Ge projelerinde danışman olmak",
      "Diğer özel kuruluşlar ile yapılan Ar-Ge projelerinde danışman olmak",
      "Üniversitelerin bilimsel araştırma projeleri (BAP) koordinatörlükleri destekli araştırma projelerinde (deneme ve rapor hazırlama çalışmaları hariç) yürütücü olmak (Hızlı destek, Altyapı, Lab. ve lisansüstü tez projeleri hariç)",
      "Üniversitelerin bilimsel araştırma projeleri (BAP) koordinatörlükleri destekli araştırma projelerinde danışman olmak (Hızlı destek, Altyapı, Lab. ve lisansüstü tez projeleri hariç)",
      "Üniversitelerin bilimsel araştırma projeleri (BAP) koordinatörlükleri destekli araştırma projelerinde araştırmacı olmak (Hızlı destek, Altyapı, Lab. ve lisansüstü tez projeleri hariç)",
      "En az dört aylık yurtiçi araştırma çalışmasında bulunmak",
      "En az dört aylık yurtdışı araştırma çalışmasında bulunmak",
      "TÜBİTAK 2209-A, 2209-B, 2242 projelerinde danışmanlık yapmak (En fazla 100 puan alınabilir; tebliğ edildiği yıldaki en son TÜBİTAK destekli burslu öğrenci katkı katsayısı koşulu bu madde için geçerli değildir)"
    ],
    "I. Editörlük, Yayın Kurulu Üyeliği ve Hakemlik Faaliyetleri": [
      "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamındaki dergilerde baş editörlük görevinde bulunmak",
      "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamındaki dergilerde alan/yardımcı/ortak/asistan editörlük görevinde bulunmak",
      "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamındaki dergilerde misafir/davetli editörlük görevinde bulunmak",
      "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamındaki dergilerde yayın kurulu üyeliği",
      "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamı dışındaki uluslararası diğer indeksler tarafından taranan dergilerde baş editörlük görevinde bulunmak",
      "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamı dışındaki uluslararası diğer indeksler tarafından taranan dergilerde alan/yardımcı/ortak/asistan editörlük görevinde bulunmak",
      "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamı dışındaki uluslararası diğer indeksler tarafından taranan dergilerde misafir/davetli editörlük görevinde bulunmak",
      "SCI-E, SSCI, AHCI, E-SCI veya SCOPUS kapsamı dışındaki uluslararası diğer indeksler tarafından taranan dergilerde yayın kurulu üyeliği",
      "ULAKBİM tarafından taranan dergilerde baş editörlük görevi",
      "ULAKBİM tarafından taranan dergilerde yayın kurulu üyeliği veya alan/yardımcı/ortak/asistan editörlük görevinde bulunmak",
      "SCI-E, SSCI veya AHCI kapsamındaki dergilerde tamamlanmış hakemlik faaliyeti (her bir hakemlik faaliyeti başına)",
      "SCI-E, SSCI veya AHCI kapsamı dışındaki uluslararası diğer indeksler tarafından dergilerde tamamlanmış hakemlik faaliyeti (her bir hakemlik faaliyeti başına)",
      "ULAKBİM tarafından taranan dergilerde hakemlik faaliyeti (her bir hakemlik faaliyeti başına)"
    ],
    "J. Ödüller": [
      "Sürekli ve periyodik olarak jürili uluslararası kurum veya kuruluşlar tarafından verilen bilim ve sanat ödülleri",
      "TÜBİTAK tarafından verilen Bilim, Özel ve Hizmet Ödülleri",
      "TUBA tarafından verilen Akademi Ödülleri",
      "TÜBİTAK tarafından verilen Teşvik Ödülü (Yayın teşvik ödülü hariç)",
      "TUBA tarafından verilen GEBİP ve TESEP ödülleri",
      "Sürekli ve periyodik olarak jürili ulusal kurum veya kuruluşlar tarafından verilen bilim ve sanat ödülleri",
      "Sürekli ve periyodik olarak verilen ve bir jüri değerlendirmesine tabi olmayan uluslararası/ulusal ödüller",
      "Uluslararası hakemli yarışmalarda birincilik derecesi",
      "Uluslararası hakemli yarışmalarda ikincilik derecesi",
      "Uluslararası hakemli yarışmalarda üçüncülük derecesi",
      "Ulusal hakemli yarışmalarda birincilik derecesi",
      "Ulusal hakemli yarışmalarda ikincilik derecesi",
      "Ulusal hakemli yarışmalarda üçüncülük derecesi",
      "Uluslararası bilimsel toplantılardan alınan ödüller",
      "Ulusal bilimsel toplantılardan alınan ödüller",
      "Sanat, tasarım ve mimarlık alanlarında Uluslararası hakemli/jürili yarışmalarda alınan ödüller",
      "Sanat, tasarım ve mimarlık alanlarında Ulusal hakemli/jürili yarışmalarda alınan ödüller",
      "Üniversite kurumsal ödülleri (üniversite genelinde ilgili alanda makale, patent, proje, v.b. dereceye girenler)",
      "Kitap veya makale gibi bilimsel eserlere atfedilen ödüller"
    ],
    "K. İdari Görevler ve Üniversiteye Katkı Faaliyetleri": [
      "Dekan/Enstitü/Yüksekokul/MYO/Merkez Müdürü",
      "Enstitü Müdür Yrd. / Dekan Yrd. / Yüksekokul Müdür Yrd. / MYO Müdür Yrd. / Merkez Müdür Yrd./Bölüm Başkanı",
      "Bölüm Başkanı Yrd. / Anabilim Dalı Başkanı",
      "Rektörlükçe görevlendirilen Koordinatörlük",
      "Rektörlükçe görevlendirilen Koordinatör Yardımcıları",
      "Rektörlükçe görevlendirilen üniversite düzeyinde Komisyon/Kurul üyelikleri",
      "Dekanlık/Y.O. Müdürlüğü/MYO Müdürlüğü/Konservatuvar Müdürlüğü tarafından görevlendirilen Komisyon/Kurul üyelikleri",
      "Bölüm Başkanlıkları tarafından görevlendirilen Komisyon/Kurul üyelikleri",
      "Rektörlük/Dekanlık/Y.O. Müdürlüğü/MYO Müdürlüğü/Konservatuvar Müdürlüğü/Bölüm Başkanlığı görevlendirmeleriyle kurum içi ve dışı eğitim, işbirliği vb konularda katkı sağlamak",
      "Uluslararası nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde, kurullarında, komisyon veya komitelerinde görev almak",
      "Ulusal nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde, kurullarında, komisyon veya komitelerinde görev almak",
      "Yerel nitelikteki bilimsel ve mesleki kurum/kuruluşların yönetimlerinde, kurullarında, komisyon veya komitelerinde görev almak"
    ],
    "L. Güzel Sanatlar Faaliyetleri": [
      "Özgün sanat eserlerinin, tasarım veya yorum çalışmalarının yurt dışında sanat, eğitim ve kültür kurumlarınca satın alınması veya bu eser(ler) için telif ödenmesi (Kurumlar bazında puanlama yapılır)",
      "Özgün sanat eserlerinin, tasarım veya yorum çalışmalarının yurt içinde sanat, eğitim ve kültür kurumlarınca satın alınması veya bu eser(ler) için telif ödenmesi (Kurumlar bazında puanlama yapılır)",
      "Yerel Yönetimler veya Özel Kuruluşların desteklediği kamusal alanda kalıcı olarak gerçekleştirilen sanat projeleri (Heykel, Duvar Resmi / Graffiti, Enstalasyon vb.) (Kurumlar bazında puanlama yapılır)",
      "Galerilerde, müzelerde, sanat ve kültür merkezlerinde gerçekleştirilen Küratörlük etkinlikleri (En fazla iki kez puanlanır)",
      "Özgün sanat eserleri, tasarımlar ya da yorum/icra çalışmalarıyla yurtdışında uluslararası jürili kişisel etkinlikte (sergi, bienal, sempozyum, trienal, gösteri, kareografi, performans, resital, dinleti, konser, kompozisyon, orkestra şefliği, festival, gösterim) bizzat katılım sağlayarak bulunmak. Her bir etkinlik için",
      "Özgün sanat eserleri, tasarımlar ya da yorum/icra çalışmalarıyla yurtiçinde jürili kişisel etkinlikte (sergi, bienal, sempozyum, trienal, gösteri, kareografi, performans, resital, dinleti, konser, kompozisyon, orkestra şefliği, festival, gösterim) bizzat katılım sağlayarak bulunmak. Her bir etkinlik için",
      "Özgün sanat eserleri, tasarımlar ya da yorum/icra çalışmalarıyla yurtdışında uluslararası jürili karma-ortak etkinlikte (sergi, bienal, sempozyum, trienal, gösteri, kareografi, performans, resital, dinleti, konser, kompozisyon, orkestra şefliği, festival, gösterim) bizzat katılım sağlayarak bulunmak. Her bir etkinlik için",
      "Özgün sanat eserleri, tasarımlar ya da yorum/icra çalışmalarıyla yurtiçinde ulusal jürili karma-ortak etkinlikte (sergi, bienal, sempozyum, trienal, gösteri, kareografi, performans, resital, dinleti, konser, kompozisyon, orkestra şefliği, festival, gösterim) bizzat katılım sağlayarak bulunmak. Her bir etkinlik için",
      "Uluslararası çalıştay/workshop (atölye çalışması)/uygulamalı sempozyum/yarışma/festival/şenlikte yöneticilik veya yürütücülük",
      "Ulusal çalıştay/workshop (atölye çalışması)/uygulamalı sempozyum/yarışma/festival/şenlikte yöneticilik veya yürütücülük",
      "Uluslararası çalıştay/workshop (atölye çalışması)/uygulamalı sempozyum/yarışma/festival/şenlikte araştırmacılık/kurul üyeliği",
      "Ulusal çalıştay/workshop (atölye çalışması)/uygulamalı sempozyum/yarışma/festival/şenlikte araştırmacılık/kurul üyeliği",
      "Uluslararası yarışmalarda/festivallerde/şenliklerde jüri üyeliği",
      "Ulusal yarışmalarda/festivallerde/şenliklerde jüri üyeliği",
      "Üretilen eserlerin uluslararası haber veya yayın organlarında yer alması veya gösterime ya da dinletime girmesi (her bir etkinlik için ayrı puanlanır ve her bir etkinlik için 5 haber ile sınırlıdır)",
      "Üretilen eserlerin ulusal haber veya yayın organlarında yer alması veya gösterime ya da dinletime girmesi (her bir etkinlik için ayrı puanlanır ve her bir etkinlik için 5 haber ile sınırlıdır)",
      "**KONSERLER**",
      "Uluslararası resital icra etmek",
      "Uluslararası Konserlerde, Orkestra, Koro, Geleneksel Topluluklar konserinde solist icracı olarak yer almak",
      "Uluslararası Konserlerde, Orkestra, Koro, Geleneksel Topluluklar konserinde karma icracı olarak yer almak",
      "Uluslararası Konserlerde, Orkestra Şefliği, Müzik Topluluğu Şefliği ve Koro Şefliği",
      "Uluslararası Konserlerde, Oda Müziği Konserinde icracı olarak yer almak",
      "Uluslararası Konserlerde, Orkestra Konserinde Grup Şefi olarak yer almak",
      "Uluslararası Konserlerde, Orkestra Konserinde Grup Üyesi olarak yer almak",
      "Uluslararası Konserlerde, Resital veya koro konserinde eşlikçi olarak yer almak",
      "Uluslararası Konserlerde, Konser yönetmenliği / dinleti koordinatörlüğü",
      "Ulusal resital icra etmek",
      "Ulusal Konserlerde, Orkestra veya koro konserinde icracı olarak bireysel dinletide bulunmak",
      "Ulusal Konserlerde, Orkestra veya koro konserinde icracı olarak karma dinletide bulunmak",
      "Ulusal Konserlerde, Orkestra Şefliği, Müzik Topluluğu Şefliği ve Koro Şefliği",
      "Ulusal Konserlerde, Oda Müziği Konserinde icracı olarak yer almak",
      "Ulusal Konserlerde, Orkestra Konserinde Grup Şefi olarak yer almak",
      "Ulusal Konserlerde, Orkestra Konserinde Grup Üyesi olarak yer almak",
      "Ulusal Konserlerde, Resital veya koro konserinde eşlikçi olarak yer almak",
      "Ulusal Konserlerde, Konser yönetmenliği / dinleti koordinatörlüğü",
      "**SESLİ VE GÖRSEL ETKİNLİKLER VE SESLİ YAYINLAR** Kültür Bakanlığı bandrolü, muadili basılı veya elektronik olarak (spotify, itunes, amazon music, deezer…vb platformlarda) ulusal veya uluslararası statüde basılmış ve erişime sunulmuş.",
      "Uluslararası sesli ve görsel etkinlikler ve sesli yayınlar, icracı, besteci, orkestra şefi, müzik topluluğu şefi veya koro şefi olarak bireysel ses yayını",
      "Uluslararası sesli ve görsel etkinlikler ve sesli yayınlar, icracı, besteci, orkestra şefi, müzik topluluğu şefi veya koro şefi olarak karma ses yayını",
      "Uluslararası sesli ve görsel etkinlikler ve sesli yayınlar, Genel Sanat Yönetmeni/Müzik yönetmeni olarak ses yayını hazırlamak",
      "Uluslararası sesli ve görsel etkinlikler ve sesli yayınlar, Radyo ve TV Etkinliği - Program Hazırlamak",
      "Uluslararası sesli ve görsel etkinlikler ve sesli yayınlar, Radyo ve TV Etkinliği Katılımcılığı - Bireysel",
      "Uluslararası sesli ve görsel etkinlikler ve sesli yayınlar, Radyo ve TV Etkinliği Katılımcılığı - Karma",
      "Ulusal sesli ve görsel etkinlikler ve sesli yayınlar, İcracı, besteci, orkestra şefi, müzik topluluğu şefi veya koro şefi olarak bireysel ses yayını",
      "Ulusal sesli ve görsel etkinlikler ve sesli yayınlar, İcracı, besteci, orkestra şefi, müzik topluluğu şefi veya koro şefi olarak karma ses yayını",
      "Ulusal sesli ve görsel etkinlikler ve sesli yayınlar, Genel Sanat Yönetmeni/Müzik yönetmeni olarak ses yayını hazırlamak",
      "Ulusal sesli ve görsel etkinlikler ve sesli yayınlar, Radyo ve TV Etkinliği - Program Hazırlamak",
      "Ulusal sesli ve görsel etkinlikler ve sesli yayınlar, Radyo ve TV Etkinliği Katılımcılığı - Bireysel",
      "Ulusal sesli ve görsel etkinlikler ve sesli yayınlar, Radyo ve TV Etkinliği Katılımcılığı - Karma",


      "**ALANA İLİŞKİN MÜZİKAL ÜRETİM / MÜZİKAL YAYIN**",
      "Ulusal Orkestra İçin Bestelenmiş Eser (4’lü, 3’lü, 2’li, Oda ve Yaylı Çalgılar Orkestrası) 0 – 5 dakikalık eser sahibi olmak",
      "Ulusal Orkestra İçin Bestelenmiş Eser (4’lü, 3’lü, 2’li, Oda ve Yaylı Çalgılar Orkestrası) 5 – 10 dakikalık eser sahibi olmak",
      "Ulusal Orkestra İçin Bestelenmiş Eser (4’lü, 3’lü, 2’li, Oda ve Yaylı Çalgılar Orkestrası) 10 – 15 dakikalık eser sahibi olmak",
      "Ulusal Orkestra İçin Bestelenmiş Eser (4’lü, 3’lü, 2’li, Oda ve Yaylı Çalgılar Orkestrası) 15 ve üzeri dakikalık eser sahibi olmak",
      "Ulusal Oda Müziği (Karma Oda Müziği, Vokal Müzik, Solo Çalgı Müzikleri) 0 – 5 dakikalık eser sahibi olmak",
      "Ulusal Oda Müziği (Karma Oda Müziği, Vokal Müzik, Solo Çalgı Müzikleri) 5 – 10 dakikalık eser sahibi olmak",
      "Ulusal Oda Müziği (Karma Oda Müziği, Vokal Müzik, Solo Çalgı Müzikleri) 10 – 15 dakikalık eser sahibi olmak",
      "Ulusal Oda Müziği (Karma Oda Müziği, Vokal Müzik, Solo Çalgı Müzikleri) 15 ve üzeri dakikalık eser sahibi olmak",
      "Ulusal Elektronik ve Elektro – Akustik Müzikler (Çalgı, elektronik ortam ve Bilgisayar ortamında Fix Medya Müziği) 0 – 5 dakikalık eser sahibi olmak",
      "Ulusal Elektronik ve Elektro – Akustik Müzikler (Çalgı, elektronik ortam ve Bilgisayar ortamında Fix Medya Müziği) 5 – 10 dakikalık eser sahibi olmak",
      "Ulusal Elektronik ve Elektro – Akustik Müzikler (Çalgı, elektronik ortam ve Bilgisayar ortamında Fix Medya Müziği) 10 – 15 dakikalık eser sahibi olmak",
      "Ulusal Elektronik ve Elektro – Akustik Müzikler (Çalgı, elektronik ortam ve Bilgisayar ortamında Fix Medya Müziği) 15 ve üzeri dakikalık eser sahibi olmak",
      "Uluslararası Orkestra İçin Bestelenmiş Eser (4’lü, 3’lü, 2’li, Oda ve Yaylı Çalgılar Orkestrası) 0 – 5 dakikalık eser sahibi olmak",
      "Uluslararası Orkestra İçin Bestelenmiş Eser (4’lü, 3’lü, 2’li, Oda ve Yaylı Çalgılar Orkestrası) 5 – 10 dakikalık eser sahibi olmak",
      "Uluslararası Orkestra İçin Bestelenmiş Eser (4’lü, 3’lü, 2’li, Oda ve Yaylı Çalgılar Orkestrası) 10 – 15 dakikalık eser sahibi olmak",
      "Uluslararası Orkestra İçin Bestelenmiş Eser (4’lü, 3’lü, 2’li, Oda ve Yaylı Çalgılar Orkestrası) 15 ve üzeri dakikalık eser sahibi olmak",
      "Uluslararası Oda Müziği (Karma Oda Müziği, Vokal Müzik, Solo Çalgı Müzikleri) 0 – 5 dakikalık eser sahibi olmak",
      "Uluslararası Oda Müziği (Karma Oda Müziği, Vokal Müzik, Solo Çalgı Müzikleri) 5 – 10 dakikalık eser sahibi olmak",
      "Uluslararası Oda Müziği (Karma Oda Müziği, Vokal Müzik, Solo Çalgı Müzikleri) 10 – 15 dakikalık eser sahibi olmak",
      "Uluslararası Oda Müziği (Karma Oda Müziği, Vokal Müzik, Solo Çalgı Müzikleri) 15 ve üzeri dakikalık eser sahibi olmak",
      "Uluslararası Elektronik ve Elektro – Akustik Müzikler (Çalgı, elektronik ortam ve Bilgisayar ortamında Fix Medya Müziği) 0 – 5 dakikalık eser sahibi olmak",
      "Uluslararası Elektronik ve Elektro – Akustik Müzikler (Çalgı, elektronik ortam ve Bilgisayar ortamında Fix Medya Müziği) 5 – 10 dakikalık eser sahibi olmak",
      "Uluslararası Elektronik ve Elektro – Akustik Müzikler (Çalgı, elektronik ortam ve Bilgisayar ortamında Fix Medya Müziği) 10 – 15 dakikalık eser sahibi olmak",
      "Uluslararası Elektronik ve Elektro – Akustik Müzikler (Çalgı, elektronik ortam ve Bilgisayar ortamında Fix Medya Müziği) 15 ve üzeri dakikalık eser sahibi olmak",

      "**TÜRK MÜZİĞİ ESERLERİNE İLİŞKİN ÜRETİM / MÜZİKAL YAYIN**",
      "Türk Müziği makamlarını kullanarak geleneksel formlar (ayin, peşrev, kâr, kârçe, ağır semâi, yürük semâi, beste, şarkı vb …) çerçevesinde oluşturulmuş kompozisyonlar. Bestelenmiş Eser Sahibi Olmak (Nota ile belgelemek koşulu ile)",
      "Türk Müziği makamlarını kullanarak geleneksel formlar (ayin, peşrev, kâr, kârçe, ağır semâi, yürük semâi, beste, şarkı vb …) çerçevesinde oluşturulmuş kompozisyonlar. Bestelenmiş ve Seslendirilmiş Eser Sahibi Olmak (ulusal konser veya ses yayını)",
      "Türk Müziği makamlarını kullanarak geleneksel formlar (ayin, peşrev, kâr, kârçe, ağır semâi, yürük semâi, şarkı beste vb …) çerçevesinde oluşturulmuş kompozisyonlar. Bestelenmiş ve Seslendirilmiş Eser Sahibi Olmak (uluslararası konser veya yurt dışında basılmış ses yayını)",
      "Türk Halk Müziği alanında derleme yapmak (TRT Müzik Dairesi Bşk. Repertuvar Kurulu tarafından onaylanmış)",
      "Türk Halk Müziği alanında derleme yapmak (Nota ile belgelemek koşulu ile)",
      "Türk Halk Müziği alanında derlenmiş parçanın notaya alınması (TRT Müzik Dairesi Bşk. Repertuvar kurulu tarafından onaylanmış)",

      "**SAHNE VE GÖRÜNTÜ SANATLARI**",
      "Büyük oyun /film yönetmenliği",
      "Kısa oyun/film yönetmenliği",
      "Sahne oyunu / senaryo (uzun) ve dizi drama yazarlığı",
      "Kısa sahne oyunu ve senaryo yazarlığı",
      "Uyarlama oyun/senaryo yazmak, metin düzenlemek (uzun)",
      "Uyarlama oyun/senaryo yazmak, metin düzenlemek (kısa)",
      "Uzun oyun/senaryo/dizi drama dramaturjisi yapmak",
      "Kısa oyun/senaryo dramaturjisi yapmak",
      "Uzun oyun/senaryo/ dizi drama metni çevirmek",
      "Kısa oyun/senaryo metni çevirmek",
      "Uzun oyunda/sinema filminde/dizi dramada başrol",
      "Uzun oyunda/sinema filminde/dizi dramada diğer roller",
      "Kısa oyun/filmde başrol",
      "Kısa oyun/filmde diğer roller",
      "Sahne oyunu/ film (uzun) ve dizi drama dekor / kostüm / ışık / ses / efekt tasarımı",
      "Sahne oyunu/ film (uzun) ve dizi drama dekor / kostüm / ışık / ses / efekt tasarımı ekibinde görev almak",
      "Sahne oyunu/ film (kısa) dekor / kostüm / ışık / ses / efekt tasarımı",
      "Sahne oyunu/ film (kısa) dekor / kostüm / ışık / ses / efekt tasarımı ekibinde görev almak",
      "Sahne oyunu/ film (uzun) ve dizi dramada makyaj, mask, kukla, butafor vb tasarımı",
      "Sahne oyunu/ film (uzun) ve dizi dramada makyaj, mask, kukla, butafor vb tasarımı ekibinde görev almak",
      "Sahne oyunu/ film (kısa) makyaj, mask, kukla, butafor vb tasarımı",
      "Sahne oyunu/ film (kısa) makyaj, mask, kukla, butafor vb tasarımı ekibinde görev almak",
      "Sanat yönetmenliği (uzun prodüksiyonlar)",
      "Sanat yönetmenliği (kısa prodüksiyonlar)",
      "Koreografi, dramatizasyon, dinleti, performans, happening veya workshop (atölye) düzenleme/yönetme",
      "Kongre, sempozyum, festival etkinliklerinde atölye çalışması düzenlemek",
      "Yapıtın festival, şenlik vb. etkinliklere katılımı",
      "Oyunun/senaryonun/filmin/sergilenmiş oyunun video kaydının vb. kamu/özel TV’ler/dijital platformlar/kurumsal kimlikli internet siteleri vb tarafından satın alınması/gösterilmesi; Devlet Tiyatroları/Şehir Tiyatroları vb tiyatroların repertuvarlarına girmesi",
      "En az 10 kere gerçekleştirilmiş olan sanatsal bir yarışma/ödül organizasyonu"
    ]

  };


  const toggleOption = (section, index) => {
    const key = `${section}-${index}`;
    if (selectedOptions.includes(key)) {
      setSelectedOptions(selectedOptions.filter((k) => k !== key));
    } else {
      setSelectedOptions([...selectedOptions, key]);
    }
  };

  const handleContinue = () => {
    const selectedTexts = selectedOptions.map(key => {
      const [section, index] = key.split('-');
      const item = sections[section]?.[parseInt(index)];
      return item ? { section, text: item } : null;
    }).filter(Boolean);
  
    navigate('/candidate_application_details', { state: { selectedTexts , ilanId, basvuru} });
  };
  
  
  
  
  

  return (
 <div> 
  <div className='Anadiv'>
  <div className="application-period">
  <h4>Puanlanan Faaliyet Dönemi {ilanId} {basvuru} </h4>

  <label>
    <input
      type="checkbox"
      name="period"
      value="profesor"
      className="uniform-checkbox"
      checked={selectedPeriod === 'profesor'}
      onChange={() => setSelectedPeriod('profesor')}
    />
    Profesör (Doçent unvanını aldıktan sonraki faaliyetleri esas alınacaktır)
  </label>

  <label>
    <input
      type="checkbox"
      name="period"
      value="docent"
      className="uniform-checkbox"
      checked={selectedPeriod === 'docent'}
      onChange={() => setSelectedPeriod('docent')}
    />
    Doçent (Doktora / Sanatta yeterlik / tıp-diş uzmanlık unvanını aldıktan sonraki faaliyetler)
  </label>

  <label>
    <input
      type="checkbox"
      name="period"
      value="yeniden"
      className="uniform-checkbox"
      checked={selectedPeriod === 'yeniden'}
      onChange={() => setSelectedPeriod('yeniden')}
    />
    Dr. Öğretim Üyesi (Yeniden Atama: Son atama tarihinden başvuru tarihine kadar olan faaliyetler)
  </label>

  <label>
    <input
      type="checkbox"
      name="period"
      value="ilk"
      className="uniform-checkbox"
      checked={selectedPeriod === 'ilk'}
      onChange={() => setSelectedPeriod('ilk')}
    />
    Dr. Öğretim Üyesi (İlk Atama)
  </label>
</div>
  <div className="candidate-application-container">
  

 {Object.entries(sections).map(([sectionTitle, options]) => {
 const isNested = typeof options === 'object' && !Array.isArray(options);

 return (
   
   <div key={sectionTitle} className="section-container">
     <h3 className="section-title" onClick={() => toggleSection(sectionTitle)}>
       {sectionTitle}
       <span className="arrow">{expandedSections.includes(sectionTitle) ? '•' : '•'}</span>
     </h3>

     {/* 🔽 Eğer iç içe ise ayrı render */}
     {expandedSections.includes(sectionTitle) && isNested && (
       <>
         {Object.entries(options).map(([subTitle, subOptions]) => (
           <div key={subTitle} className="sub-section-container">
             <h4 className="sub-section-title" onClick={() => toggleSubSection(subTitle)}>
               {subTitle}
               <span className="arrow">{expandedSubSections.includes(subTitle) ? '•' : '•'}</span>
             </h4>

             {expandedSubSections.includes(subTitle) && (
               <div className="options-list">
                 {subOptions.map((option, idx) => (
                   <div key={idx} className="option-item">
                     <input
                       type="checkbox"
                       id={`checkbox-${subTitle}-${idx}`}
                       checked={selectedOptions.includes(`${subTitle}-${idx}`)}
                       onChange={() => toggleOption(subTitle, idx)}
                       className="uniform-checkbox"
                     />
                     <label htmlFor={`checkbox-${subTitle}-${idx}`} className="option-label">
                       {idx + 1}) {option}
                     </label>
                   </div>
                 ))}
               </div>
             )}
           </div>
         ))}
       </>
     )}

     {/* 🔽 Normal olan düz liste ise eski yöntem */}
     {expandedSections.includes(sectionTitle) && !isNested && (
       <div className="options-list">
         {options.map((option, idx) => {
           const isHeader = option.startsWith("**") && option.endsWith("**");
           const trueIndex = options.slice(0, idx).filter(opt => !opt.startsWith("**")).length;

           return isHeader ? (
             <div key={idx} className="option-header">
               <strong>{option.replace(/\*\*/g, '')}</strong>
             </div>
           ) : (
             <div key={idx} className="option-item">
               <input
                 type="checkbox"
                 id={`checkbox-${sectionTitle}-${idx}`}
                 checked={selectedOptions.includes(`${sectionTitle}-${idx}`)}
                 onChange={() => toggleOption(sectionTitle, idx)}
                 className="uniform-checkbox"
               />
               <label htmlFor={`checkbox-${sectionTitle}-${idx}`} className="option-label">
                 {trueIndex + 1}) {option}
               </label>
             </div>
           );
         })}
       </div>
     )}
   </div>
 );
})}



     <button className="continue-button" onClick={handleContinue}>Devam Et</button>
     
   </div>
   
 </div>
 <Footer/>
   </div>

  );
}

export default CandidateApplication;