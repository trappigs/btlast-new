export const generateInvestmentProfile = async (aggregatedWeights: { trust: number; profit: number; life: number }) => {
  const total = aggregatedWeights.trust + aggregatedWeights.profit + aggregatedWeights.life;
  const tPer = Math.round((aggregatedWeights.trust / total) * 100);
  const pPer = Math.round((aggregatedWeights.profit / total) * 100);
  const lPer = Math.round((aggregatedWeights.life / total) * 100);

  // Fallback profiles if the local API fails
  const getFallbackProfile = () => {
    if (tPer > pPer && tPer > lPer) {
      return {
        styleName: "Güven Arayan Gelenekselci",
        title: "Bereketli Topraklar'da Güvenli Liman",
        description: "Yatırımda önceliğiniz her zaman güvenlik ve yasal garanti. Riskten kaçınan, somut varlıklara değer veren bir yapınız var.",
        riskTolerance: "Düşük",
        recommendation: "Bursa ve Balıkesir bölgesinde, tapusu hazır, imar durumu netleşmiş merkezi lokasyonlu arsalar sizin için en idealidir.",
        logicAnalysis: "Yüksek güven puanınız, Bereketli Topraklar'ın şeffaf tapu süreciyle tam uyum sağlıyor."
      };
    } else if (pPer > tPer && pPer > lPer) {
      return {
        styleName: "Vizyoner Fırsat Kollayan",
        title: "Bereketli Kazanç Odaklı Strateji",
        description: "Getiri potansiyeli yüksek fırsatları hızlıca fark ediyorsunuz. Gelişim aksındaki bölgelere yatırım yaparak kârınızı maksimize etmeyi hedefliyorsunuz.",
        riskTolerance: "Yüksek",
        recommendation: "Yeni otoyol ve sanayi projelerinin geçtiği Balıkesir ve Bursa'nın gelişim bölgelerindeki arsalar hızlı değer artışı sağlayacaktır.",
        logicAnalysis: "Kazanç motivasyonunuz, sunduğumuz gelişim aksı analizlerimizle birebir örtüşüyor."
      };
    } else {
      return {
        styleName: "Sabırlı Toprak Yatırımcısı",
        title: "Bereketli Gelecek İnşası",
        description: "Toprağın bereketine ve zamanın gücüne inanıyorsunuz. Sabırlı ve uzun vadeli bir perspektifle yatırım yapıyorsunuz.",
        riskTolerance: "Orta",
        recommendation: "Gelecek vaat eden lokasyonlarda geniş metrekareli arsalar alarak, bölgenin olgunlaşmasını beklemek sizin için en kârlı yol olacaktır.",
        logicAnalysis: "Toprak eğiliminiz, uzun vadeli değer koruma stratejimizle harika bir uyum içerisinde."
      };
    }
  };

  try {
    // Calling our OWN backend API instead of Google directly
    const response = await fetch('/umbraco/api/Gemini/GenerateProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aggregatedWeights)
    });

    if (!response.ok) {
      throw new Error('Server API failed');
    }

    return await response.json();
  } catch (error) {
    console.error("Local API failed, using fallback:", error);
    return getFallbackProfile();
  }
};
