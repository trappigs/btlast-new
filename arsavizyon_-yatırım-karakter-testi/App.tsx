import React, { useState } from 'react';
import { QUESTIONS, LEARNING_SECTIONS } from './constants';
import { Stage, QuizState, InvestmentProfile, ScoreWeights } from './types';
import { generateInvestmentProfile } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const PINE_GREEN = "#0B4127";

const App: React.FC = () => {
  const initialState: QuizState = {
    isStarted: false,
    viewingLearn: false,
    currentQuestionIndex: 0,
    selectedChoiceIds: [],
    allAnswers: [],
    isFinished: false,
    showFact: false,
    stageJustCompleted: null
  };

  const [state, setState] = useState<QuizState>(initialState);
  const [profile, setProfile] = useState<InvestmentProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = QUESTIONS[state.currentQuestionIndex];
  const progress = state.isStarted ? ((state.currentQuestionIndex) / QUESTIONS.length) * 100 : 0;

  const startQuiz = () => setState(prev => ({ ...prev, isStarted: true, viewingLearn: false }));
  const openLearn = () => setState(prev => ({ ...prev, viewingLearn: true }));
  const closeLearn = () => setState(prev => ({ ...prev, viewingLearn: false }));
  
  const resetQuiz = () => {
    setState(initialState);
    setProfile(null);
    setLoading(false);
  };

  const handleToggleChoice = (id: string) => {
    if (currentQuestion.isMultiple) {
      setState(prev => ({
        ...prev,
        selectedChoiceIds: prev.selectedChoiceIds.includes(id)
          ? prev.selectedChoiceIds.filter(i => i !== id)
          : [...prev.selectedChoiceIds, id]
      }));
    } else {
      processAnswer([id]);
    }
  };

  const processAnswer = (ids: string[]) => {
    const newAnswers = [...state.allAnswers, { questionId: currentQuestion.id, choiceIds: ids }];
    if (currentQuestion.fact) {
      setState(prev => ({ ...prev, allAnswers: newAnswers, showFact: true }));
    } else {
      checkStageCompletion(newAnswers, state.currentQuestionIndex);
    }
  };

  const checkStageCompletion = (answers: { questionId: number; choiceIds: string[] }[], currentIndex: number) => {
    if (currentIndex === 4) { // 5. soru sonrası (Etap 1 bitti)
      setState(prev => ({ ...prev, allAnswers: answers, stageJustCompleted: 1 }));
    } else if (currentIndex === 12) { // 13. soru sonrası (Etap 2 bitti)
      setState(prev => ({ ...prev, allAnswers: answers, stageJustCompleted: 2 }));
    } else {
      nextStep(answers);
    }
  };

  const nextStep = (answers: { questionId: number; choiceIds: string[] }[]) => {
    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
      setState(prev => ({
        ...prev,
        allAnswers: answers,
        selectedChoiceIds: [],
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFact: false,
        stageJustCompleted: null
      }));
    } else {
      finishQuiz(answers);
    }
  };

  const finishQuiz = async (finalAnswers: { questionId: number; choiceIds: string[] }[]) => {
    setLoading(true);
    setState(prev => ({ ...prev, isFinished: true, stageJustCompleted: null }));

    const totals: ScoreWeights = { trust: 0, profit: 0, life: 0 };
    finalAnswers.forEach(ans => {
      const q = QUESTIONS.find(q => q.id === ans.questionId);
      ans.choiceIds.forEach(cid => {
        const choice = q?.choices.find(c => c.id === cid);
        if (choice) {
          totals.trust += choice.weights.trust;
          totals.profit += choice.weights.profit;
          totals.life += choice.weights.life;
        }
      });
    });

    try {
      const result = await generateInvestmentProfile(totals);
      setProfile(result);
    } catch (error) {
      console.error("Profile generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Landing & Learn View
  if (!state.isStarted || state.viewingLearn) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center animate-fadeIn font-['Inter'] relative">
        {state.viewingLearn && (
          <button 
            onClick={closeLearn} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 font-bold flex items-center gap-2 transition-colors text-sm z-50"
          >
            <i className="fas fa-times"></i> Kapat
          </button>
        )}

        {!state.viewingLearn ? (
          <div className="max-w-4xl w-full px-4 flex-1 flex flex-col justify-center text-center py-4">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none mb-4" style={{color: PINE_GREEN}}>
              Yatırım <span className="text-gray-900">DNA'nı</span> Keşfet
            </h1>
            <p className="text-base text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
              Yapay zeka teknolojisiyle güçlendirilen psikolojik testimizle yatırımcı profilini öğren, bereketli bir geleceğe adım at.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <button 
                onClick={startQuiz}
                className="group w-full md:w-auto text-white px-8 py-3 rounded-xl font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                style={{backgroundColor: PINE_GREEN}}
              >
                Teste Başla
                <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform text-sm"></i>
              </button>
            </div>
          </div>
        ) : null}
        <footer className="w-full py-4 border-t border-gray-100 text-center">
          <p className="text-gray-300 font-black text-[9px] uppercase tracking-[0.5em]">Yatırım Karakter Testi • 2024</p>
        </footer>
      </div>
    );
  }

  // Stage Completion Modal
  if (state.stageJustCompleted !== null) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/40 backdrop-blur-md p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-scaleIn border border-emerald-50">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl mb-4 mx-auto transform rotate-12" style={{backgroundColor: PINE_GREEN}}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">{state.stageJustCompleted}. Etap Tamamlandı!</h2>
          <p className="text-base text-gray-400 font-medium mb-6">Analiziniz harika ilerliyor. Yatırım karakterinizi daha net belirlemek için devam edelim mi?</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => nextStep(state.allAnswers)}
              className="text-white py-3 rounded-xl font-black text-lg shadow-2xl hover:scale-[1.02] transition-all"
              style={{backgroundColor: PINE_GREEN}}
            >
              Devam Et
            </button>
            <button 
              onClick={() => finishQuiz(state.allAnswers)}
              className="text-gray-400 py-2 rounded-xl font-bold text-sm hover:text-gray-900 transition-all"
            >
              Testi Şimdi Bitir
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Results Screen
  if (state.isFinished) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-2 md:p-4 animate-fadeIn">
        <div className="max-w-5xl w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-xl border border-gray-50">
               <div className="animate-pulse flex flex-col items-center text-center px-4">
                 <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: `${PINE_GREEN}15`}}>
                    <i className="fas fa-chart-line text-2xl" style={{color: PINE_GREEN}}></i>
                 </div>
                 <h2 className="text-xl font-black text-gray-900">Analiz Raporunuz Hazırlanıyor...</h2>
                 <p className="text-gray-400 mt-1 font-bold uppercase tracking-widest text-[9px]">Bereketli Topraklar Uzmanlığı ile</p>
               </div>
            </div>
          ) : profile ? (
            <div className="space-y-4 pb-8">
              <header className="text-center">
                <h1 className="text-2xl font-black" style={{color: PINE_GREEN}}>Yatırım Karakter Analizi</h1>
                <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-[9px]">Kişiye Özel Rapor No: BT-{Math.floor(Math.random()*9000)+1000}</p>
              </header>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full" style={{backgroundColor: PINE_GREEN}}></div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                    <div>
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block mb-2" style={{backgroundColor: `${PINE_GREEN}15`, color: PINE_GREEN}}>
                        {profile.styleName}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-none tracking-tighter">{profile.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                      <i className="fas fa-shield-halved text-emerald-600 text-lg"></i>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Risk Toleransı</span>
                        <span className="font-black text-sm text-gray-900">{profile.riskTolerance}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed mb-6 border-l-4 border-emerald-50 pl-4 italic font-medium">
                    "{profile.description}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Uzman Analizi</h4>
                          <p className="text-gray-700 font-medium leading-relaxed text-sm">{profile.logicAnalysis}</p>
                       </div>
                       <div className="p-6 rounded-xl text-white shadow-xl transform hover:scale-[1.01] transition-transform" style={{backgroundColor: PINE_GREEN}}>
                          <h4 className="text-base font-bold mb-2 flex items-center gap-2">
                             <i className="fas fa-map-location-dot text-sm"></i> Bereketli Topraklar Tavsiyesi
                          </h4>
                          <p className="opacity-95 leading-relaxed font-medium text-sm">{profile.recommendation}</p>
                       </div>
                    </div>

                    <div className="bg-white border-2 border-gray-50 p-4 rounded-xl flex flex-col justify-center">
                       <h4 className="text-[9px] font-black text-gray-400 uppercase mb-4 tracking-widest text-center">Yatırım Refleks Dengesi</h4>
                       <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: 'Güven', value: 45 },
                              { name: 'Kazanç', value: 65 },
                              { name: 'Toprak', value: 90 },
                            ]} layout="vertical">
                               <XAxis type="number" hide />
                               <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={60} style={{fontSize: '10px', fontWeight: 'bold'}} />
                               <Tooltip cursor={{fill: 'transparent'}} />
                               <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20} fill={PINE_GREEN} />
                            </BarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Branding & Call to Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-xl font-black text-gray-900 leading-tight">Neden Bereketli Topraklar?</h3>
                  <div className="space-y-3">
                    {[
                      { icon: 'fa-search-location', title: 'Şeffaf ve Yasal Süreç', desc: 'Tüm arsalarımız hukuki statüsü net ve tapu güvencelidir.' },
                      { icon: 'fa-chart-pie', title: 'Değer Odaklılık', desc: 'Gelişim aksındaki bölgeleri sizin için analiz edip seçiyoruz.' },
                      { icon: 'fa-hand-holding-heart', title: 'Müşteri Memnuniyeti', desc: 'Güven, bizim için kazançtan her zaman önce gelir.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-base" style={{backgroundColor: `${PINE_GREEN}15`, color: PINE_GREEN}}>
                          <i className={`fas ${item.icon}`}></i>
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-xs">{item.title}</h4>
                          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl p-6 text-white flex flex-col justify-center items-center text-center space-y-6 shadow-xl" style={{backgroundColor: PINE_GREEN}}>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black leading-tight">Yatırım yapmak istediğiniz bölgeyi beraber seçelim mi?</h3>
                    <p className="opacity-80 text-sm font-medium">Bereketli bir gelecek için doğru lokasyon anahtardır.</p>
                  </div>
                  <button 
                    onClick={() => window.parent.postMessage('openAppointmentForm', '*')}
                    className="bg-white w-full py-3 rounded-xl font-black text-lg hover:bg-gray-100 transition-colors shadow-xl" 
                    style={{color: PINE_GREEN}}
                  >
                    Uzmanımıza Danışın
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button onClick={resetQuiz} className="text-gray-400 hover:text-emerald-800 font-bold text-[9px] uppercase tracking-[0.4em] transition-colors">
                  <i className="fas fa-redo-alt mr-1"></i> Testi Yeniden Başlat
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // 3. Quiz Questions
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center animate-fadeIn font-['Inter']">
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-xl shadow-sm z-50 p-2 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button onClick={resetQuiz} className="text-gray-400 hover:text-gray-900 transition-colors">
            <i className="fas fa-home text-lg"></i>
          </button>
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-700 shadow-inner" style={{ width: `${progress}%`, backgroundColor: PINE_GREEN }}></div>
          </div>
          <div className="text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm border border-emerald-50 whitespace-nowrap" style={{backgroundColor: `${PINE_GREEN}10`, color: PINE_GREEN}}>
            {state.currentQuestionIndex + 1} / {QUESTIONS.length}
          </div>
        </div>
      </header>

      <main className="max-w-3xl w-full px-6 py-4 flex-1 flex flex-col justify-center">
        {state.showFact ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-slideUp border border-gray-50">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto shadow-inner">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Biliyor Muydunuz?</h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium italic">"{currentQuestion.fact}"</p>
            <button 
              onClick={() => checkStageCompletion(state.allAnswers, state.currentQuestionIndex)} 
              className="text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl transform active:scale-95 transition-all w-full"
              style={{backgroundColor: PINE_GREEN}}
            >
              Anladım, Devam Et <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <span className="font-black text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-full inline-block" style={{backgroundColor: `${PINE_GREEN}10`, color: PINE_GREEN}}>
                {currentQuestion.stage}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight tracking-tight">
                {currentQuestion.text}
              </h2>
              {currentQuestion.hint && (
                <p className="text-base text-emerald-700 font-bold italic opacity-70 border-t border-emerald-50 pt-3 max-w-xl mx-auto leading-relaxed">
                  "{currentQuestion.hint}"
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 mt-6">
              {currentQuestion.choices.map((choice, idx) => (
                <button
                  key={choice.id}
                  onClick={() => handleToggleChoice(choice.id)}
                  className={`group relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                    state.selectedChoiceIds.includes(choice.id)
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm scale-[1.01]'
                      : 'bg-white border-transparent hover:border-emerald-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-base transition-colors ${
                      state.selectedChoiceIds.includes(choice.id) ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400'
                    }`} style={state.selectedChoiceIds.includes(choice.id) ? {backgroundColor: PINE_GREEN} : {}}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`text-base font-bold leading-tight ${state.selectedChoiceIds.includes(choice.id) ? 'text-emerald-900' : 'text-gray-800'}`}>
                      {choice.text}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    state.selectedChoiceIds.includes(choice.id) ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'border-gray-100'
                  }`} style={state.selectedChoiceIds.includes(choice.id) ? {backgroundColor: PINE_GREEN, borderColor: PINE_GREEN} : {}}>
                    {state.selectedChoiceIds.includes(choice.id) && <i className="fas fa-check text-[10px]"></i>}
                  </div>
                </button>
              ))}
            </div>

            {currentQuestion.isMultiple && (
              <div className="flex flex-col items-center mt-6">
                 <button 
                  disabled={state.selectedChoiceIds.length === 0}
                  onClick={() => processAnswer(state.selectedChoiceIds)}
                  className="text-white px-12 py-4 rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all w-full md:w-auto"
                  style={{backgroundColor: PINE_GREEN}}
                >
                  Seçenekleri Onayla
                </button>
                <p className="text-gray-400 text-[9px] mt-3 font-bold uppercase tracking-widest italic">Çoklu seçim yapabilirsiniz</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="w-full py-6 text-center opacity-30">
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-500">
          Yatırım Analiz Platformu
        </p>
      </footer>
    </div>
  );
};

export default App;
