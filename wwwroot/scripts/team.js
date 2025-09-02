// Team Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Team member data - YENİ: Her üyeye 'linkedin' alanı eklendi
    const teamData = {
        1: {
            name: "Bilal Aktaş",
            title: "Kurucu & Genel Müdür",
            image: "/media/lvcd1dr1/bilal-aktas-profil-fotografi.webp",
            bio: "Bereketli Topraklar'ın kurucusu ve Yönetim Kurulu Başkanı olan Bilal Aktaş, Uludağ Üniversitesi Makine Mühendisliği Bölümü'nden mezun olmuştur. Kariyeri boyunca Bosch, Continental, ThyssenKrupp, Borusan Holding ve Grammer AG gibi otomotiv ve endüstri sektörlerinin önde gelen global şirketlerinde görev almıştır. Bu şirketlerde Proje Satınalma Mühendisi, Satınalma Uzmanı, Satınalma Müdürü ve Proje Satınalma Eksperi gibi çeşitli kademelerde sorumluluk üstlenmiştir. Kariyeri dahilinde Almanya'da da proje satınalma mühendisliği görevinde bulunmuştur. Süreç iyileştirme ve kalite yönetimi konularındaki yetkinliğini Lean 6 Sigma Yeşil Kuşak ve ISO TS 16949 İç Denetçi sertifikalarıyla pekiştirmiştir. Bilal Aktaş, mühendislik altyapısını, uluslararası satınalma ve proje yönetimi tecrübesiyle birleştirerek Bereketli Topraklar'ın vizyonuna liderlik etmekte ve şirketin stratejik büyümesine yön vermektedir.",
            linkedin: "https://www.linkedin.com/in/bilalaktas/"
        },
        2: {
            name: "Furkan Hoşgör",
            title: "Genel Müdür Asistanı",
            image: "/media/vhvpwhk3/furkan-hosgor-profil-fotografi.webp",
            bio: "Genel Müdür Asistanı ve Arsa Yatırım Danışmanımız Furkan Hoşgör, Uludağ Üniversitesi’ndeki eğitiminin ardından kariyerine Bosch Türkiye'de başlamıştır. Burada teknik satınalma, kalite ve tedarikçi geliştirme birimlerinde görev alarak Kalite Yönetimi, Tedarik Zinciri Operasyonları ve İleri Ürün Kalite Planlaması (APQP) gibi konularda deneyim kazanmıştır. Kalite Mühendisliği ve Yöneticiliği alanındaki sertifikası, süreçlere olan analitik ve sistemli yaklaşımını pekiştirmektedir.  Bosch'ta edindiği bu kurumsal deneyimi, Bereketli Topraklar bünyesinde üstlendiği çift yönlü rolde değerlendirmektedir. Genel Müdür Asistanı olarak, şirketimizin operasyonel ve stratejik süreçlerinin yönetiminde aktif rol almakta, yönetici desteği ve iş süreçlerini iyileştirme gibi konularda sorumluluk üstlenmektedir. Arsa Yatırım Danışmanı kimliğiyle ise, kalite ve süreç yönetimi disiplinini yatırımcı ilişkilerine taşıyarak, müşterilerimize şeffaf ve güvenilir bir danışmanlık hizmeti sunmaktadır. Furkan, kurumsal süreç yönetimi bilgisiyle gayrimenkul sektörünün dinamiklerini birleştirerek, hem şirketimizin iç operasyonlarının verimliliğine hem de yatırımcılarımızın memnuniyetine önemli katkılar sağlamaktadır.",
            linkedin: "https://www.linkedin.com/in/furkan-hosgor"
        },
        3: {
            name: "Semih Aygün",
            title: "Arsa Yatırım Danışmanı",
            image: "/media/atphkfpc/semih-aygun-profil-fotografi.jpeg",
            bio: "Arsa Yatırım Danışmanımız Semih Aygün, Balıkesir Üniversitesi İşletme ve Yönetim Bölümü’nden mezun olmuştur. Kariyeri boyunca perakende ve kurumsal satış alanlarında önemli bir tecrübe edinmiştir. Özhan Marketler Zinciri, Torku ve EDT gibi firmalarda Satış Temsilciliği ve Satınalma pozisyonlarında görev almıştır. Perakende satış tecrübesi, bireysel müşterilerin beklentilerini anlama konusunda kendisine hassasiyet kazandırırken, satınalma rolünde edindiği pazar analizi ve müzakere yetenekleri, arsa yatırım süreçlerinde en doğru değeri bulmasını sağlamaktadır. Satış ve satınalma alanlarındaki bu bütünsel deneyimini, Bereketli Topraklar bünyesinde Arsa Yatırım Danışmanı olarak değerlendirmektedir. Semih, güçlü müzakere kabiliyeti ve müşteri odaklı satış yaklaşımıyla, yatırımcılarımıza hem güvenli hem de kârlı yatırım fırsatları sunma konusunda uzmanlaşmıştır.",
            linkedin: "https://www.linkedin.com/in/semih-a-a212891b4/"
        },
        4: {
            name: "Hasan Uysal",
            title: "Satış Operasyon Koordinatörü",
            image: "/media/dflp0xmo/hasan-uysal-profil-fotografi.webp",
            bio: "Aslen Muğla’lı olan Hasan Uysal, Uludağ Üniversitesi’nde Pazarlama ve Reklamcılık, Manisa Celal Bayar Üniversitesi’nde ise İşletme eğitimi alarak akademik altyapısını oluşturmuştur. İş hayatına turizm sektöründe başlayan Hasan, kariyerine global bir şirket olan Bosch Türkiye'de Satış Destek Temsilcisi olarak devam etmiştir. Bu süreçte çalışma disiplini, süreç takibi ve satış konularında önemli deneyimler kazanmıştır. Gayrimenkul sektörüne geçiş yaptıktan sonra, Bereketli Topraklar'ın kuruluş sürecinden itibaren şirket bünyesinde aktif rol almaya başladı. Satış ve Operasyon Uzmanı olarak başladığı görevinde, güçlü iletişim becerileri ve ekip koordinasyonundaki başarısı sayesinde kısa sürede Operasyon Koordinatörlüğü'ne yükselmiştir. Hasan, imarlı arsa yatırımları alanında uzmanlaşarak hem bireysel hem kurumsal yatırımcılara yönelik hizmet sunmaktadır. Satış süreçlerinin yönetimi, saha organizasyonlarının yürütülmesi, müşteri ilişkilerinin takibi ve satış ekibinin koordinasyonundan sorumludur. Yatırımcıların ihtiyaçlarına hızlı ve güvenilir çözümler sunmak, müşteri memnuniyetini sürdürülebilir kılmak ve arsa yatırım sürecini şeffaf, bilinçli ve profesyonel bir zemine oturtmak adına çalışmalarına devam etmektedir.",
            linkedin: "https://www.linkedin.com/in/hasanuysall/"
        },
        5: {
            name: "Hayati Uçan",
            title: "Saha Operasyon Koordinatörü",
            image: "/media/fy1l0o0a/hayati-ucan-wp-pp.png",
            bio: "Saha Operasyon Uzmanımız Hayati Uçan, ticaret hayatındaki onlarca yıllık köklü geçmişini, son 10 yıldır uzmanlaştığı arsa ve gayrimenkul saha operasyonları bilgisiyle birleştirmektedir. Esnaflık tecrübesinin kazandırdığı güçlü insan ilişkileri, pazarlık ve müzakere yeteneği, saha operasyonlarındaki başarısının temelini oluşturmaktadır. Arazi ve arsa geliştirme konusundaki tutkusu, kendisini sürekli olarak sahanın nabzını tutmaya ve en doğru yatırım fırsatlarını keşfetmeye yönlendirir. Hayati, pratik saha bilgisi ve ticari sezgileriyle, yatırım projelerimizin en verimli şekilde ilerlemesini sağlamakta ve operasyonel süreçlere liderlik etmektedir.",
            linkedin: "https://www.linkedin.com/company/bereketlitopraklar/"
        },
        6: {
            name: "Memet Emin Aktaş",
            title: "Dijital Pazarlama Departman Müdürü",
            image: "/media/xl1nbywg/memet-emin-aktas-1-wp-pp.png",
            bio: "Dijital Pazarlama Departman Müdürümüz Memet Emin Aktaş, Türk Hava Yolları'nda geçirdiği 15 yıllık uçak bakım teknisyenliği kariyerinin getirdiği analitik düşünme, problem çözme ve süreç yönetimi disiplinini pazarlama stratejilerimize entegre etmektedir. Lise ve üniversite yıllarında aldığı elektrik eğitimi, kendisine teknoloji odaklı pazarlama araçlarına hızla adapte olma ve teknik altyapıları anlama yeteneği kazandırmıştır. Havacılık gibi yüksek hassasiyet ve sıfır hata prensibiyle çalışan bir sektörde edindiği deneyim, dijital pazarlama kampanyalarımızın planlanması, uygulanması ve optimizasyonunda titiz ve sonuç odaklı bir yaklaşım sergilemesini sağlamaktadır. Memet Emin, mühendislik disipliniyle pazarlama vizyonunu birleştirerek, veri odaklı ve sistematik stratejilerle departmanımıza liderlik etmekte ve markamızın dijital alandaki büyümesine yön vermektedir.",
            linkedin: "https://www.linkedin.com/company/bereketlitopraklar/"
        },
        
        7: {
            name: "Muhammed Hatay",
            title: "Yazılım Geliştirici",
            image: "/media/nt0n5w3h/mami-wp.png",
            bio: "Yazılım Geliştiricimiz Muhammed Hatay, şirketimizin dijital altyapısının geliştirilmesinden sorumludur. Web sitemizin ve şirket içi operasyonlarımızı yönettiğimiz CRM yazılımımızın mimarı ve geliştiricisidir. Bursa Uludağ Üniversitesi Bilgisayar Programcılığı bölümünden yüksek bir başarı ortalamasıyla mezun olmuştur. Kurumsal yazılım geliştirme alanındaki temellerini, Bosch Sanayi ve Ticaret A.Ş.'de yaptığı staj sırasında C# ve MS SQL kullanarak bir stok takip yazılımı geliştirerek atmıştır. Bu projede veritabanı şemaları tasarlamış, kullanıcı arayüzleri oluşturmuş ve C# uygulamalarını MS SQL ile entegre etmiştir. Ayrıca, Unity oyun motoruyla 2D oyun geliştirme projelerinde gönüllü olarak yer alması, problem çözme ve farklı platformlarda C# kullanma becerisini pekiştirmiştir. Muhammed, analitik düşünme yeteneği, geniş teknoloji bilgisi ve sorunları çözme azmiyle  Bereketli Topraklar'ın teknolojik vizyonunu hayata geçirmekte ve verimliliğimizi artıran çözümler üretmektedir.",
            linkedin: "https://www.linkedin.com/in/muhammed-hatay-0196a5204/"
        },
        8: {
            name: "Halime Uçan",
            title: "Finans ve Sosyal Medya Pazarlama Uzmanı",
            image: "/media/dkahwv4a/halime-wp-pp.png",
            bio: "Finans ve Sosyal Medya Pazarlama Uzmanımız Halime Uçan, Uludağ Üniversitesi İşletme Bölümü’nden mezun olmuştur. Eğitimiyle hem finansal yönetim hem de pazarlama stratejileri konusunda sağlam bir altyapı oluşturmuştur. Kariyerinde dijital pazarlama alanında uzmanlaşmış, Bereketli Topraklar ve Lots Gayrimenkul gibi gayrimenkul firmalarında sosyal medya stratejileri geliştirmiştir. Şirketimizin finansal operasyonlarının yönetiminde görev alırken, aynı zamanda markamızın dijital kimliğini ve sosyal medyadaki varlığını güçlendirmektedir. Halime, analitik finansal bakış açısını, yaratıcı sosyal medya pazarlama yetenekleriyle birleştirerek şirketimizin hem finansal istikrarına hem de pazar bilinirliğine katkı sağlamaktadır.",
            linkedin: "https://www.linkedin.com/in/halime-u%C3%A7an-92485b267/"
        },
9: {
            name: "Hakan Yant",
            title: "Arsa Yatırım Danışmanı",
            image: "/media/ndllb3y0/hakan-yant-profil-fotografi.webp",
            bio: "Arsa Yatırım Danışmanımız Hakan Yant, bankacılık sektöründe geçirdiği 25 yıllık engin kariyerin getirdiği finansal uzmanlığı, gayrimenkul alanındaki tecrübesiyle birleştirmektedir. Çeyrek asrı aşan bankacılık kariyeri boyunca edindiği kredi, yatırım ve risk analizi konularındaki derin bilgi birikimi, arsa yatırımlarının finansal potansiyelini ve fizibilitesini değerlendirmede kendisine benzersiz bir yetkinlik sunmaktadır. Bursa'da uzun yıllara dayanan çalışmalarıyla kurduğu güçlü ve güvenilir iş ağı, müşterilerimize en doğru ve kârlı yatırım fırsatlarını sunmasında kilit rol oynamaktadır. Hakan, finansal öngörüsü ve piyasa bilgisiyle yatırımcılarımıza güvenli ve yüksek getirili arsa yatırımları konusunda yol göstermektedir.",
            linkedin: "https://www.linkedin.com/company/bereketlitopraklar/"
        },
        10: {
            name: "Mehmet Arslan",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/noffj5wh/mehmet-arslan-profil-fotografi.webp",
            bio: "Satış ve Pazarlama Uzmanımız Mehmet Arslan, uzun yıllar Trafik Yönetim ve Hasar Tahsil Şefi olarak görev yaptığı kariyeriyle ekibimize güçlü bir operasyonel disiplin ve saha tecrübesi katmaktadır. Anadolu Üniversitesi İşletme ve Yönetim Bölümü'ndeki eğitimi, edindiği bu pratik deneyimi teorik bir işletme temeliyle birleştirmesini sağlamaktadır. Önceki görevinde Filo Yönetimi, Ulaştırma Yönetimi ve Tedarikçi Yönetimi gibi kritik süreçleri yönetmiştir. Bu tecrübe, kendisine karmaşık operasyonları yönetme, stratejik kaynak planlaması yapma ve iş ortaklarıyla güçlü ilişkiler kurma konularında önemli yetkinlikler kazandırmıştır. Aynı zamanda Adli Trafik ve Sigorta Uzmanlığı gibi alanlardaki eğitimleri, analitik düşünme ve problem çözme yeteneğini pekiştirmektedir.Mehmet, operasyonel mükemmellik anlayışını ve stratejik yönetim becerilerini, şirketimizin satış ve pazarlama hedeflerinin etkin bir şekilde hayata geçirilmesi için kullanmaktadır.",
            linkedin: "https://www.linkedin.com/in/mehmet-arslan-484754324"
        },
        11: {
            name: "İrem Nur Yurttaş",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/44nh3vos/irem-nur-yurttas-profil-fotografi.webp",
            bio: "Satış ve Pazarlama Uzmanımız İremnur Yurttaş, Pazarlama alanında yaptığı yüksek lisans ve Budapeşte'deki Erasmus eğitimiyle  ekibimize güçlü bir akademik temel ve uluslararası bir vizyon katmaktadır. Barselona'da uluslararası bir şirketin İş Geliştirme, Pazarlama ve Satış departmanlarındaki deneyimi, küresel pazarlara yönelik strateji geliştirme yeteneğini pekiştirmiştir. Karşılaştırmalı Edebiyat lisans eğitiminin yanı sıra İçerik Editörlüğü ve Blog Yazarlığı  sertifikalarıyla metin ve içerik üretiminde uzmanlaşmıştır. C1 seviyesindeki İngilizce ve B seviyesindeki Fransızca bilgisiyle uzun yıllardır freelance kitap çevirmenliği yapmaktadır. Aynı zamanda Halkla İlişkiler ve Tanıtım eğitimi ve Sosyal Medya Okuryazarlığı  alanındaki birikimiyle, pazarlama iletişiminin her kanalına hakimdir. İremnur, akademik bilgisi, uluslararası saha tecrübesi ve yaratıcı içerik yeteneklerini bir araya getirerek, şirketimizin pazarlama ve satış hedeflerine ulaşmasında merkezi bir rol üstlenmektedir.",
            linkedin: ""
        },
        12: {
            name: "Mert Kaan Tosun",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/g1jdogfu/mert-kaan-tosun-profil-fotografi.jpg",
            bio: "Satış ve Pazarlama Uzmanımız Mert Kaan Tosun, Siyaset Bilimi ve Kamu Yönetimi lisans ve Uluslararası Ticaret ve Lojistik Yönetimi yüksek lisans  eğitimleriyle ekibimize geniş bir vizyon ve çok yönlü bir bakış açısı sunmaktadır. Direkt Satış Uzmanı olarak edindiği pratik tecrübe, sahadaki müşteri ihtiyaçlarını anlama ve çözüm geliştirme yeteneğini güçlendirmiştir. Kariyeri boyunca aldığı Kurumsal İletişim, Lojistik ve Dijital Medya Okuryazarlığı  gibi uzmanlık eğitimleri ile pazarlama süreçlerine bütünsel bir yaklaşım sergilemektedir. İnsan kaynakları stajı sırasında edindiği etkinlik pazarlama ve iş yaşamında sosyal medya kullanımı  deneyimi, modern pazarlama kanallarındaki yetkinliğini göstermektedir. Mert Kaan, etkili iletişim ve müzakere  becerilerini, lojistik ve satış alanlarındaki bilgisiyle birleştirerek şirketimizin pazarlama hedeflerine ulaşmasında stratejik bir rol oynamaktadır.",
            linkedin: "https://www.linkedin.com/in/mert-kaan-tosun-951668134/"
        },
        13: {
            name: "Can Polat Tura",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/hlcgo45p/can-polat-tura-profil-fotografi.webp",
            bio: "Satış ve Pazarlama Uzmanımız Can Polat Tura, Ege Üniversitesi İstatistik Bölümü'nden aldığı lisans eğitimiyle  ekibimize analitik ve veri odaklı bir güç katmaktadır. Kariyeri boyunca kurucu ortak olarak görev aldığı girişimde, hedef kitle analizleri yaparak veri temelli pazarlama stratejileri geliştirmiştir. Bu süreçte SQL, SPSS ve Excel gibi veri analizi araçlarını etkin bir şekilde kullanarak pazarlama kararlarını somut verilerle desteklemiştir. Daha önceki planlama müdürlüğü deneyimiyle proje bütçelemesi, stratejik planlama ve satış operasyonları gibi alanlarda önemli yetkinlikler kazanmıştır. Aynı zamanda Paribu'daki marka elçiliği göreviyle de topluluk yönetimi ve hedef kitleye yönelik bilgilendirici içerik oluşturma konularında pratik tecrübeye sahiptir. Can Polat, analitik altyapısını stratejik planlama ve satış operasyonları bilgisiyle birleştirerek, pazarlama kampanyalarımızın verimliliğini ve başarısını artırmada kilit bir rol oynamaktadır.",
            linkedin: "https://www.linkedin.com/in/can-polat-tura/"
        },
        14: {
            name: "İlayda Zeybek",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/xlyeiipc/ilayda-zeybek-profil-fotografi.webp",
            bio: "Ekibimizin değerli üyelerinden Pazarlama Uzmanı İlayda Zeybek, Pamukkale Üniversitesi Biyomedikal Mühendisliği bölümündeki eğitimiyle  pazarlama stratejilerimize teknik bir derinlik ve uzman bir bakış açısı kazandırmaktadır. Kariyeri boyunca satış mühendisliği ve kalite mühendisliği  gibi farklı pozisyonlarda görev almıştır. Bu rollerde endüstriyel malzeme tedariği ve teknik destek sağlama, ISO 9001 Kalite Yönetim Standartları çerçevesinde denetimlere hazırlık yapma ve medikal cihazların bakım-onarım ve tedarik süreçlerini yönetme  gibi kritik sorumluluklar üstlenmiştir. İlayda'nın bu çok yönlü birikimi, müşterilerimizin teknik ihtiyaçlarını doğru analiz etme ve onlara en yenilikçi çözümleri sunma konusunda kendisine önemli bir avantaj sağlamaktadır. Teknik bilgisi ve müşteri odaklı yaklaşımıyla şirketimizin misyonuna ve hedeflerine ulaşmasında kilit bir rol oynamaktadır.",
            linkedin: "https://www.linkedin.com/in/ilayda-zeybek-2a80a6270/"
        },
        15: {
            name: "Ahmet Ali Danyıldız",
            title: "Genel Müdür Asistanı",
            image: "",
            bio: "Ekibimizin değerli üyelerinden Genel Müdür Asistanı Ahmet Ali Danyıldız, e-ticaret, satış ve pazarlama alanlarındaki deneyimleriyle şirketimizin operasyonel ve stratejik süreçlerine dinamik bir bakış açısı katmaktadır. İstanbul Kültür Üniversitesi'ndeki E-Ticaret eğitimi, kendisine dijital pazarlama ve modern satış süreçleri konusunda güncel bir vizyon sunarken, fizyoterapi mezuniyeti ise analitik düşünme ve insan odaklı problem çözme yeteneklerini geliştirmiştir. Kariyeri boyunca Başbuğ Oto Yedek Parça'da e-ticaret stajyeri olarak pazarlama stratejisi ve satış süreçleri üzerine çalışmış, Evidea'da ise satış danışmanlığı yaparak müşteri ilişkileri yönetiminde pratik deneyim kazanmıştır. Turkcell Superonline ve TurkNet gibi kurumlarda edindiği teknik saha tecrübesi, kendisine farklı sektörlerde operasyonel süreçleri anlama yeteneği kazandırmıştır. Ahmet Ali'nin e-ticaret alanındaki akademik bilgisi ile satış alanındaki pratik deneyimini birleştiren bu çok yönlü birikimi, yönetim süreçlerine hem analitik hem de müşteri odaklı çözümler sunma konusunda kendisine önemli bir avantaj sağlamaktadır. Geniş perspektifi ve farklı disiplinlerdeki tecrübesiyle, şirketimizin misyonuna ve büyüme hedeflerine ulaşmasında kilit bir rol oynamaktadır.",
            linkedin: "https://www.linkedin.com/in/ahmet-ali-dany%C4%B1ld%C4%B1z-172a982a7/"
        },
        16: {
            name: "Şule Akçay",
            title: "Satış Pazarlama Uzmanı",
            image: "/media/k00buh33/sule-akcay-profil-fotografi.webp",
            bio: "Gıda Mühendisi kimliğiyle satış ve pazarlama süreçlerine analitik ve ürün odaklı bir uzmanlık getiren Şule Hilal Akçay, sektördeki teknik bilgisiyle firmamızın değerli bir üyesidir. Bursa Teknik Üniversitesi Gıda Mühendisliği bölümünden mezun olan Akçay, gıda üretimi, kalite kontrol ve mevzuat konularında sahip olduğu derin bilgiyle, müşterilere sunulan ürünlerin değerini ve üstünlüğünü etkili bir şekilde anlatma yeteneğine sahiptir. Kariyerine Köfteci Yusuf gibi sektörün lider firmalarından birinde Üretim Mühendisi olarak başlayan Şule Hanım, et entegre tesisinde köfte ve hamburger üretim süreçlerini A'dan Z'ye yönetmiştir. Bu görevinde verimlilik, gıda güvenliği ve ürün kalitesinin korunması gibi kritik sorumluluklar üstlenmiştir. Penguen Gıda'daki staj döneminde ise, turşu ürün grubunda %25'lik bir çeşitlilik artışı hedefleyen ürün geliştirme projelerinde aktif rol alarak, pazar ihtiyaçlarına yönelik inovatif çözümler üretme konusunda pratik deneyim edinmiştir. Şule Hilal Akçay'ın üretim, ürün geliştirme ve kalite kontrol alanlarındaki teknik birikimi, 'Etkili İletişim ve İkna' gibi sosyal yetenekleriyle birleştiğinde, müşterilerin ihtiyaçlarını derinlemesine anlama ve onlara en doğru çözümleri sunma konusunda kendisine benzersiz bir avantaj sağlamaktadır. Analitik bakış açısı ve sektörel deneyimiyle, satış ve pazarlama stratejilerine değer katmaya ve şirket hedeflerine ulaşmada kilit bir rol oynamaktadır.",
            linkedin: "https://www.linkedin.com/in/ilayda-zeybek-2a80a6270/"
        },
        17: {
            name: "Bilge Karaduman",
            title: "Satış Pazarlama Stajyeri",
            image: "/media/e4ebaawn/bilge-karaduman-profil-fotografi.jpg",
            bio: "Pazarlama Stajyerimiz Bilge Karaduman, Uludağ Üniversitesi Satış, Pazarlama ve Reklamcılık programındaki eğitimiyle teori bilgisini sahadaki deneyimiyle birleştiren genç bir yetenektir. KeytoHR’da yürüttüğü Satış & Pazarlama stajında saha operasyonları, sosyal medya yönetimi ve içerik üretimi alanlarında aktif rol alarak kampanya kurgusu, içerik takvimi oluşturma ve performans takibi konularında pratik kazanmıştır. Öncesinde Hidrosel’de Satış Temsilcisi olarak edindiği yaklaşık iki yıllık tecrübe; müşteri ihtiyaç analizi, ikna odaklı iletişim, tekliflendirme ve satış sonrası takip gibi süreçlerde sağlam bir temel oluşturmuştur. Bilge; ikna kabiliyeti, piyasa analizi bakışı ve Microsoft Office ile dijital pazarlama araçlarını etkin kullanma becerisiyle, Bereketli Topraklar’ın dijital görünürlüğünü artırma, yatırımcı adayları için net ve güven veren mesajlar üretme ve kampanya raporlamalarını düzenli biçimde yürütme hedeflerimize katkı sunmaktadır. Enerjisi, öğrenme isteği ve disiplinli çalışma tarzıyla, gayrimenkul pazarlamasının dinamiklerine hızla uyum sağlayarak ekibimizin verimliliğine değer katmaktadır.",
            linkedin: "https://www.linkedin.com/in/bilge-karaduman-b1399a335/"
        }
    };

    // Modal elements
    const modal = document.getElementById('memberModal');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalTitle = document.getElementById('modalTitle');
    const modalBio = document.getElementById('modalBio');
    const closeBtn = document.querySelector('.modal-close');
    const linkedinBtn = document.querySelector('.twitter-btn'); // Butonu seçiyoruz

    // Team member click handlers
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            const memberId = this.dataset.member;
            const memberData = teamData[memberId];
            
            if (memberData) {
                showMemberModal(memberData);
            }
        });
    });

    // Show member modal - YENİ: LinkedIn butonunu dinamik olarak günceller
    function showMemberModal(data) {
        modalImage.src = data.image;
        modalImage.alt = data.name;
        modalName.textContent = data.name;
        modalTitle.textContent = data.title;
        modalBio.textContent = data.bio;
        
        // LinkedIn butonunu güncelle
        if (linkedinBtn) {
            if (data.linkedin && data.linkedin.trim() !== "") {
                const link = document.createElement('a');
                link.href = data.linkedin;
                link.target = "_blank"; // Yeni sekmede aç
                link.rel = "noopener noreferrer";
                link.innerHTML = '<span><i class="fab fa-linkedin-in"></i> Linkedin\'de Takip Et</span>';
                
                // Butonun içini temizleyip yeni linki ekliyoruz
                linkedinBtn.innerHTML = '';
                linkedinBtn.appendChild(link);
                
                linkedinBtn.style.display = 'flex'; // Butonu görünür yap
            } else {
                linkedinBtn.style.display = 'none'; // LinkedIn linki yoksa butonu gizle
            }
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close button click
    closeBtn.addEventListener('click', closeModal);

    // Click outside modal to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Smooth animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe team members for animation
    teamMembers.forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(member);
    });
});