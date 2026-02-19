import { Stage, Question, LearningSection } from './types';

export const LEARNING_SECTIONS: LearningSection[] = [
  {
    title: "2026’da En Karlı Yatırım Aracı Hangisi?",
    content: "2026’da güvenli ve somut yatırım arayanlar için imarlı arsa öne çıkıyor. Projesi hazır, hukuki statüsü net arsalar; hayal değil, planlı ve ulaşılabilir bir yatırım fırsatıdır.",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Yatırıma Nereden Başlamalıyım?",
    content: "Değeri artma potansiyeli olan imarlı arsalarla başlamak güçlü bir adımdır. Şeffaf tapu süreci ve net imar durumu, yatırımınızı güvenle büyütmenizi sağlar.",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Küçük Birikimle Yatırım Nasıl Yapılır?",
    content: "İmarlı arsa yatırımı, düşünüldüğü kadar uzak değildir. Esnek ödeme seçenekleriyle küçük birikimler zamanla değerlenen, somut ve güvenli bir varlığa dönüşebilir.",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Enflasyona Karşı Korunma",
    content: "Arsa yatırımı, sınırlı arz yapısı sayesinde enflasyona karşı güçlü bir koruma sağlar. İmarlı arsalar, düzenli değer artışı potansiyeliyle sermayenizi korur ve büyütür.",
    imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Kriptodan Toprağa Geçiş",
    content: "Kripto gibi volatil piyasalarda elde edilen kazançları imarlı arsaya dönüştürmek, dijital getiriyi somut ve kalıcı bir varlığa taşır. Toprak, serveti koruma imkanı sunar.",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004009?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "20’li Yaşlarda Arsa Sahibi Olmak",
    content: "Erken kalkan yol alır. 20’li yaşlarda alınan imarlı arsa, zamanın gücünü avantaja çevirir ve finansal özgürlük yolunda ciddi avantaj sağlar.",
    imageUrl: "https://images.unsplash.com/photo-1523240715639-99f840e9f50a?auto=format&fit=crop&q=80&w=600"
  }
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    stage: Stage.AWARENESS,
    text: "Elinde hazır bir bütçe var. İlk refleksin ne olur?",
    hint: "Bazı yatırımlar büyür, bazıları kök salar.",
    choices: [
      { id: '1a', text: "Bankada tutarım, acele etmem.", weights: { trust: 75, profit: 15, life: 10 } },
      { id: '1b', text: "Altın / döviz gibi güvenli limana koyarım.", weights: { trust: 55, profit: 35, life: 10 } },
      { id: '1c', text: "Ev alırım, kira getirisi olsun isterim.", weights: { trust: 25, profit: 50, life: 25 } },
      { id: '1d', text: "Değer kazanma potansiyeli olan arsa bakarım.", weights: { trust: 15, profit: 55, life: 30 } },
      { id: '1e', text: "Harcarım ya da ihtiyaçlarımı tamamlarım.", weights: { trust: 10, profit: 20, life: 70 } }
    ]
  },
  {
    id: 2,
    stage: Stage.AWARENESS,
    text: "İmkânın olsa hangi şekilde yatırım yapmak istersin?",
    hint: "Seçenekleri görmek, doğru yatırımı fark etmeyi sağlar.",
    isMultiple: true,
    choices: [
      { id: '2a', text: "Ev (Konut)", weights: { trust: 35, profit: 45, life: 20 } },
      { id: '2b', text: "Araba", weights: { trust: 10, profit: 20, life: 70 } },
      { id: '2c', text: "Tarla", weights: { trust: 30, profit: 40, life: 30 } },
      { id: '2d', text: "İmarlı Arsa", weights: { trust: 20, profit: 55, life: 25 } },
      { id: '2e', text: "Altın", weights: { trust: 60, profit: 30, life: 10 } },
      { id: '2f', text: "Döviz", weights: { trust: 55, profit: 35, life: 10 } },
      { id: '2g', text: "Kripto", weights: { trust: 10, profit: 75, life: 15 } }
    ]
  },
  {
    id: 3,
    stage: Stage.AWARENESS,
    text: "Bir önceki soruyu işaretlerken hangileri arasında kaldınız? (2-3 seçenek)",
    hint: "Kararsızlık çoğu zaman riskten değil, netlik eksikliğinden gelir.",
    isMultiple: true,
    choices: [
      { id: '3a', text: "Ev", weights: { trust: 25, profit: 60, life: 15 } },
      { id: '3b', text: "Araba", weights: { trust: 5, profit: 10, life: 85 } },
      { id: '3c', text: "Tarla", weights: { trust: 20, profit: 55, life: 25 } },
      { id: '3d', text: "İmarlı Arsa", weights: { trust: 15, profit: 65, life: 20 } },
      { id: '3e', text: "Altın", weights: { trust: 75, profit: 20, life: 5 } },
      { id: '3f', text: "Döviz", weights: { trust: 70, profit: 25, life: 5 } },
      { id: '3g', text: "Kripto", weights: { trust: 5, profit: 85, life: 10 } }
    ],
    fact: "Kripto piyasasındaki kazanç verilere göre %85 ancak yüksek risk ve uzun bir vadeyi beraberinde getirir. Dalgalanmalara hazırlıklı değilseniz, toprak daha bereketli bir limandır."
  },
  {
    id: 4,
    stage: Stage.AWARENESS,
    text: "Şimdi yatırım yapacak olsanız, ayırmayı düşündüğünüz bütçe aralığı nedir?",
    hint: "Ne ayırabileceğini bilmek, nereden başlayacağını gösterir.",
    choices: [
      { id: '4a', text: "0 – 1.000.000 TL", weights: { trust: 55, profit: 30, life: 15 } },
      { id: '4b', text: "1.000.000 – 3.000.000 TL", weights: { trust: 35, profit: 50, life: 15 } },
      { id: '4c', text: "3.000.000 – 5.000.000 TL", weights: { trust: 25, profit: 60, life: 15 } },
      { id: '4d', text: "5.000.000 TL ve üzeri", weights: { trust: 20, profit: 65, life: 15 } },
      { id: '4e', text: "Net bir bütçem yok, fırsata göre değişir", weights: { trust: 30, profit: 40, life: 30 } }
    ]
  },
  {
    id: 5,
    stage: Stage.AWARENESS,
    text: "Bugün karar veremeyip bir yatırım fırsatını kaçırdığınızı düşünün... 6 ay - 1 yıl sonra pişman olur musunuz?",
    hint: "Pişmanlık çoğu zaman yanlış karardan değil, kararsızlıktan doğar.",
    choices: [
      { id: '5a', text: "Evet, fiyat artmış olursa çok üzülürüm", weights: { trust: 25, profit: 65, life: 10 } },
      { id: '5b', text: "Biraz üzülürüm ama çok da takılmam", weights: { trust: 35, profit: 45, life: 20 } },
      { id: '5c', text: "Fırsatlar her zaman çıkar diye düşünürüm", weights: { trust: 55, profit: 30, life: 15 } },
      { id: '5d', text: "Zaten acele karar vermeyi sevmem", weights: { trust: 65, profit: 20, life: 15 } },
      { id: '5e', text: "Kaçırmam, fırsat görünce hemen değerlendiririm", weights: { trust: 15, profit: 75, life: 10 } }
    ]
  },
  {
    id: 6,
    stage: Stage.STRATEGY,
    text: "Yatırım yaparken sizi en çok tedirgin eden durum hangisi?",
    hint: "Korku değil, belirsizlik kararları zorlaştırır.",
    choices: [
      { id: '6a', text: "Yatırımın beklediğim getiriyi sağlamaması", weights: { trust: 35, profit: 50, life: 15 } },
      { id: '6b', text: "Kararımın ileride yanlış çıkması ihtimali", weights: { trust: 55, profit: 30, life: 15 } },
      { id: '6c', text: "Süreçte hukuki veya resmi bir sorun yaşanması", weights: { trust: 70, profit: 15, life: 15 } },
      { id: '6d', text: "Doğru zamanda harekete geçememek", weights: { trust: 25, profit: 60, life: 15 } },
      { id: '6e', text: "Değer artışı fırsatını gözden kaçırmak", weights: { trust: 20, profit: 65, life: 15 } }
    ]
  },
  { id: 7, stage: Stage.STRATEGY, text: "Acil bir durumda yatırımınızı nakde çevirebilmek sizin için ne kadar önemlidir?", hint: "Kontrol hissi, likiditeyle başlar.", choices: [{id:'7a', text:'Çok önemli, hızlıca nakde dönebilmeliyim', weights:{trust:70, profit:20, life:10}}, {id:'7b', text:'Önemli ama kısa bir süre bekleyebilirim', weights:{trust:45, profit:40, life:15}}, {id:'7c', text:'Çok önemli değil, uzun vadeli düşünürüm', weights:{trust:30, profit:55, life:15}}, {id:'7d', text:'Hiç önemli değil, zaten satmayı düşünmem', weights:{trust:20, profit:60, life:20}}, {id:'7e', text:'Duruma göre değişir, fırsata bağlı', weights:{trust:25, profit:50, life:25}}] },
  { id: 8, stage: Stage.STRATEGY, text: "Yatırım araçlarının günlük, aylık ya da yıllık dalgalanması sizi nasıl etkiler?", hint: "İmarlı arsada değer sessiz ilerler, geceyi huzurlu kılar.", choices: [{id:'8a', text:'Çok etkiler, sık sık kontrol ederim', weights:{trust:65, profit:25, life:10}}, {id:'8b', text:'Biraz tedirgin olurum ama takip ederim', weights:{trust:45, profit:40, life:15}}, {id:'8c', text:'Çok önemsemem, uzun vadeye bakarım', weights:{trust:35, profit:50, life:15}}, {id:'8d', text:'Dalgalanmayı fırsat olarak görürüm', weights:{trust:15, profit:70, life:15}}, {id:'8e', text:'Etkilemez, somut ve stabil yatırımları tercih ederim', weights:{trust:60, profit:25, life:15}}] },
  { id: 9, stage: Stage.STRATEGY, text: "Tapu güvencesi ve yasal teminatlar sizin için ne kadar kritiktir?", hint: "Tapulu imarlı arsa, hukuki güvenin en net halidir.", choices: [{id:'9a', text:'Benim için en kritik konu, olmazsa olmaz', weights:{trust:80, profit:10, life:10}}, {id:'9b', text:'Çok önemli ama tek başına yeterli değil', weights:{trust:60, profit:25, life:15}}, {id:'9c', text:'Önemli fakat getirisi daha çok ilgilendirir', weights:{trust:40, profit:45, life:15}}, {id:'9d', text:'Çok detayına girmem, danışmana güvenirim', weights:{trust:35, profit:35, life:30}}, {id:'9e', text:'Çok önemli bulmam, fırsat daha öncelikli', weights:{trust:15, profit:70, life:15}}] },
  { id: 10, stage: Stage.STRATEGY, text: "Aldığınız yatırım 1 yıl içinde beklediğiniz değeri sağlamazsa sizi nasıl etkiler?", hint: "Bugün sessiz olan, yarın bereketli olur.", choices: [{id:'10a', text:'Normal karşılarım, yatırımın zamana ihtiyacı olduğunu bilirim', weights:{trust:30, profit:55, life:15}}, {id:'10b', text:'Keyfim kaçar, beklentimin altında kaldığını düşünürüm', weights:{trust:45, profit:40, life:15}}, {id:'10c', text:'Moralimi bozar, stres yapar ve yanlış karar verdiğimi düşünürüm', weights:{trust:65, profit:25, life:10}}, {id:'10d', text:'Beni ciddi şekilde tedirgin eder, sürekli aklımda olur', weights:{trust:60, profit:25, life:15}}, {id:'10e', text:'Beklemeden başka yatırım alternatiflerine yönelirim', weights:{trust:25, profit:55, life:20}}] },
  { id: 11, stage: Stage.STRATEGY, text: "Yatırım yaptıktan sonra değer artışını hangi sıklıkla kontrol edersin?", hint: "Toprak her gün bakılmaz, ama her yıl büyür.", choices: [{id:'11a', text:'Her gün kontrol ederim', weights:{trust:65, profit:25, life:10}}, {id:'11b', text:'Haftada birkaç kez bakarım', weights:{trust:50, profit:35, life:15}}, {id:'11c', text:'Ayda bir kontrol ederim', weights:{trust:35, profit:50, life:15}}, {id:'11d', text:'3–6 ayda bir bakarım', weights:{trust:25, profit:55, life:20}}, {id:'11e', text:'Yılda bir veya daha seyrek kontrol ederim', weights:{trust:20, profit:60, life:20}}] },
  { id: 12, stage: Stage.STRATEGY, text: "Yatırım yaptığın paranın aktif olarak işletilmesini mi istersin, yoksa zamanla değer kazanmasını mı?", hint: "Bazı kazançlar emek ister, bazı kazançlar sabır.", choices: [{id:'12a', text:'Param aktif işletilsin, sürekli kazanç üretsin', weights:{trust:20, profit:60, life:20}}, {id:'12b', text:'Hem işletilsin hem değer kazansın', weights:{trust:30, profit:40, life:30}}, {id:'12c', text:'Zamanla düzenli değer kazansın yeter', weights:{trust:35, profit:25, life:40}}, {id:'12d', text:'Risk almadan büyüsün', weights:{trust:50, profit:10, life:40}}, {id:'12e', text:'Açıkçası kısa sürede yüksek kazanç isterim', weights:{trust:10, profit:75, life:15}}] },
  { id: 13, stage: Stage.STRATEGY, text: "Küçük ama sağlam kazanç mı, yoksa riskli ama belirsiz büyük kazanç mı?", hint: "Toprak acele etmez… ama zamanı geldiğinde konuşur.", choices: [{id:'13a', text:'Küçük ama garantili kazanç', weights:{trust:70, profit:15, life:15}}, {id:'13b', text:'Dengeli risk, dengeli kazanç', weights:{trust:45, profit:35, life:20}}, {id:'13c', text:'Uzun vadede büyüyen sağlam yatırım', weights:{trust:55, profit:20, life:25}}, {id:'13d', text:'Yüksek risk, yüksek kazanç', weights:{trust:15, profit:70, life:15}}, {id:'13e', text:'Belirsizlik heyecanlıdır, fırsat doğurur', weights:{trust:10, profit:75, life:15}}] },
  { id: 14, stage: Stage.PROFESSIONAL, text: "Enflasyona karşı korunmak senin için ne kadar önemli?", hint: "Yatırım şeklin, enflasyona karşı zırhın olur.", choices: [{id:'14a', text:'Hayati derecede önemli', weights:{trust:65, profit:20, life:15}}, {id:'14b', text:'Çok önemli', weights:{trust:55, profit:25, life:20}}, {id:'14c', text:'Önemli ama tek kriter değil', weights:{trust:40, profit:35, life:25}}, {id:'14d', text:'Orta seviyede önemli', weights:{trust:30, profit:40, life:30}}, {id:'14e', text:'Çok da önemsemem', weights:{trust:15, profit:60, life:25}}] },
  { id: 15, stage: Stage.PROFESSIONAL, text: "Fiziksel bir değere sahip yatırım mı, yoksa kağıt üzerinde bir yatırım mı tercih edersin?", hint: "Somut mülkiyet, soyut riskten ayrışır.", choices: [{id:'15a', text:'Fiziksel ve somut varlık', weights:{trust:70, profit:15, life:15}}, {id:'15b', text:'Fiziksel ama değer artışı potansiyeli olan', weights:{trust:55, profit:25, life:20}}, {id:'15c', text:'Dengeli (hem fiziksel hem finansal)', weights:{trust:40, profit:35, life:25}}, {id:'15d', text:'Finansal enstrümanlar (hisse, fon vs.)', weights:{trust:25, profit:55, life:20}}, {id:'15e', text:'Tamamen finansal ve hızlı hareketli', weights:{trust:10, profit:70, life:20}}] },
  { id: 16, stage: Stage.PROFESSIONAL, text: "Yatırımda konum sizin için ne kadar önemli?", hint: "Bugün fiyat, yarın konum avantajı.", choices: [{id:'16a', text:'Olmazsa olmaz, en önemli kriter', weights:{trust:55, profit:30, life:15}}, {id:'16b', text:'Çok önemli', weights:{trust:45, profit:35, life:20}}, {id:'16c', text:'Önemli ama tek kriter değil', weights:{trust:35, profit:40, life:25}}, {id:'16d', text:'Fiyat daha önemli', weights:{trust:25, profit:50, life:25}}, {id:'16e', text:'Çok önemsemem', weights:{trust:15, profit:60, life:25}}] },
  { id: 17, stage: Stage.PROFESSIONAL, text: "Daha önce ‘keşke alsaydım’ dediğiniz bir yatırım oldu mu?", hint: "Pişmanlık çoğu zaman riskten değil, kararsızlıktan gelir.", choices: [{id:'17a', text:'Evet, büyük bir fırsatı kaçırdım', weights:{trust:20, profit:60, life:20}}, {id:'17b', text:'Evet, ama artık daha temkinliyim', weights:{trust:40, profit:35, life:25}}, {id:'17c', text:'Kararsız kaldığım için kaçırdım', weights:{trust:45, profit:30, life:25}}, {id:'17d', text:'Hayır, acele karar vermem', weights:{trust:60, profit:20, life:20}}, {id:'17e', text:'Fırsat kaçırmam, hızlı davranırım', weights:{trust:25, profit:55, life:20}}] },
  { id: 18, stage: Stage.PROFESSIONAL, text: "Geçmiş yatırım deneyimlerin seni daha temkinli yaptı mı?", hint: "Temkin, korku değil; bilinçtir.", choices: [{id:'18a', text:'Evet, artık çok daha dikkatliyim', weights:{trust:65, profit:20, life:15}}, {id:'18b', text:'Evet, ama fırsatları da kaçırmam', weights:{trust:45, profit:35, life:20}}, {id:'18c', text:'Biraz, ama risk almaya devam ederim', weights:{trust:30, profit:50, life:20}}, {id:'18d', text:'Hayır, hâlâ cesurum', weights:{trust:20, profit:60, life:20}}, {id:'18e', text:'Deneyimim yok, yeni başlıyorum', weights:{trust:50, profit:25, life:25}}] },
  { id: 19, stage: Stage.PROFESSIONAL, text: "Yatırım yaparken seni en çok ne korkutur?", hint: "Herkes kazanıyor gibi görünür; önemli olan senin planındır.", choices: [{id:'19a', text:'Dolandırılmak / Güven sorunu', weights:{trust:75, profit:10, life:15}}, {id:'19b', text:'Paramın değer kaybetmesi', weights:{trust:40, profit:45, life:15}}, {id:'19c', text:'Fırsatları kaçırmak', weights:{trust:25, profit:60, life:15}}, {id:'19d', text:'Nakde çevirememek', weights:{trust:55, profit:25, life:20}}, {id:'19e', text:'Başkaları kazanırken “yanlış mı yaptım?” diye düşünmek', weights:{trust:30, profit:55, life:15}}] },
  { id: 20, stage: Stage.PROFESSIONAL, text: "Yatırım yapmaktan sizi alıkoyan nedir?", hint: "Erteleme, çoğu zaman görünmeyen maliyettir.", choices: [{id:'20a', text:'Yeterince güven duymamak', weights:{trust:75, profit:10, life:15}}, {id:'20b', text:'Doğru fırsatı bulamamak', weights:{trust:35, profit:50, life:15}}, {id:'20c', text:'Bütçemin yeterli olmadığını düşünmek', weights:{trust:50, profit:30, life:20}}, {id:'20d', text:'Yanlış karar verme korkusu', weights:{trust:65, profit:20, life:15}}, {id:'20e', text:'Erteleme / Zamanı gelmediğini düşünmek', weights:{trust:40, profit:40, life:20}}] },
  { id: 21, stage: Stage.PROFESSIONAL, text: "Peki, ne zaman harekete geçeceksiniz?", hint: "Şimdi mi, ‘keşke’ mi?", choices: [{id:'21a', text:'Doğru fırsatı gördüğüm an', weights:{trust:40, profit:45, life:15}}, {id:'21b', text:'Tüm detayları netleştirdiğimde', weights:{trust:65, profit:20, life:15}}, {id:'21c', text:'Bütçemi planladığımda', weights:{trust:50, profit:30, life:20}}, {id:'21d', text:'Şimdi / kısa süre içinde', weights:{trust:30, profit:55, life:15}}, {id:'21e', text:'Henüz emin değilim', weights:{trust:60, profit:20, life:20}}] }
];
