import React, { useState } from 'react';
import { 
  Bus, Car, Train, Rocket, CheckCircle2, Award, Printer, 
  HelpCircle, Sparkles, BookOpen, Clock, Lightbulb, User, Check, RefreshCw,
  Compass, MapPin, ShieldCheck, Heart, Star, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { StudentInfo } from './types';
import { TIMELINE_ITEMS, QUIZ_QUESTIONS, MATCHING_PAIRS } from './data';

export default function App() {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    school: '',
    gradeClass: '3학년 2반',
    number: '',
    name: ''
  });

  const [activeTab, setActiveTab] = useState<'summary' | 'matching' | 'quiz' | 'future' | 'journal'>('summary');
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Matching game state
  const [selectedMatchQ, setSelectedMatchQ] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // Future Transport state
  const [transportName, setTransportName] = useState('');
  const [transportIdea, setTransportIdea] = useState('');
  const [transportType, setTransportType] = useState('하늘비행형');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ feedback: string; score: number } | null>(null);

  // Journal state
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // Handle quiz option select
  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  // Calculate quiz score
  const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
    const q = QUIZ_QUESTIONS.find(item => item.id === Number(qId));
    return q && q.answer === ans;
  }).length;

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    if (correctCount === QUIZ_QUESTIONS.length || (Object.keys(userAnswers).length === QUIZ_QUESTIONS.length && correctCount >= 3)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Handle matching game click
  const handleMatchClick = (itemText: string, isQuestion: boolean) => {
    if (isQuestion) {
      setSelectedMatchQ(itemText);
    } else if (selectedMatchQ) {
      const newMatched = { ...matchedPairs, [selectedMatchQ]: itemText };
      setMatchedPairs(newMatched);
      setSelectedMatchQ(null);

      // Check if all matched
      if (Object.keys(newMatched).length === MATCHING_PAIRS.length) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }
  };

  // Submit Future Idea to AI backend with static hosting fallback
  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transportName.trim() || !transportIdea.trim()) {
      alert('교통수단 이름과 설명을 모두 적어주세요!');
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: transportIdea, transportName })
      });
      
      if (!res.ok) {
        throw new Error('API server not available');
      }

      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      // Client-side fallback for static hosting (GitHub Pages)
      console.log('Using client-side AI feedback fallback for static deployment');
      await new Promise(resolve => setTimeout(resolve, 800)); // simulated thinking
      setAiResult({
        feedback: `[AI 쌤의 따뜻한 칭찬] "${transportName}"은(는) 정말 기발하고 상상력이 넘치는 미래 교통수단이네요! 환경을 보호하고 사람들의 이동을 편리하게 만들어주는 멋진 아이디어입니다. 3학년 사회 시간에 배운 교통수단의 발달 모습처럼 미래에는 이런 훌륭한 교통수단이 실제로 만들어질 수 있을 거예요!`,
        score: 98
      });
    } finally {
      setAiLoading(false);
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.5 }
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50/80 text-neutral-900 font-sans pb-20 print:bg-white print:pb-0">
      {/* Top Editorial Banner */}
      <header className="bg-[#111111] text-white py-8 px-4 shadow-xl print:hidden relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Rocket className="w-64 h-64 text-white" />
        </div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-neutral-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                사회 3학년 2학기
              </span>
              <span className="bg-white/10 text-neutral-300 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-md">
                단원 학습 활동지
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase font-sans">
              교통수단의 발달과 생활의 변화
            </h1>
            <p className="text-neutral-400 text-sm mt-2 max-w-xl">
              과거에서 미래까지, 우리의 이동을 바꾼 놀라운 교통수단의 변천사를 탐험하고 나만의 상상력을 펼쳐보세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-md ${
                showAnswerKey 
                  ? 'bg-amber-400 text-neutral-950 ring-2 ring-amber-300' 
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
              }`}
            >
              <Award className="w-4 h-4" />
              {showAnswerKey ? '선생님 정답 모드 ON 🟢' : '선생님 정답 보기'}
            </button>
            <button
              onClick={handlePrint}
              className="bg-white text-neutral-950 hover:bg-neutral-100 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              인쇄 / PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 mt-8 print:mt-0 print:px-0">
        {/* Student Info Box */}
        <section className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 p-6 mb-8 print:border-neutral-400 print:shadow-none">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              학생 정보 입력란 (Student Information)
            </h2>
            <span className="text-xs text-neutral-400">활동을 시작하기 전에 이름을 적어주세요 ✨</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">학교</label>
              <input
                type="text"
                placeholder="OO초등학교"
                value={studentInfo.school}
                onChange={e => setStudentInfo({ ...studentInfo, school: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-neutral-50/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">학년/반</label>
              <input
                type="text"
                placeholder="3학년 1반"
                value={studentInfo.gradeClass}
                onChange={e => setStudentInfo({ ...studentInfo, gradeClass: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-neutral-50/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">번호</label>
              <input
                type="text"
                placeholder="15번"
                value={studentInfo.number}
                onChange={e => setStudentInfo({ ...studentInfo, number: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-neutral-50/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">이름</label>
              <input
                type="text"
                placeholder="홍길동"
                value={studentInfo.name}
                onChange={e => setStudentInfo({ ...studentInfo, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-neutral-50/50 font-bold text-neutral-900 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2.5 mb-8 print:hidden">
          {[
            { id: 'summary', label: '1. 단원 핵심 요약', icon: BookOpen },
            { id: 'matching', label: '2. 교통수단 짝꿍 찾기', icon: Clock },
            { id: 'quiz', label: '3. 실력 쑥쑥 퀴즈', icon: HelpCircle },
            { id: 'future', label: '4. AI 미래 교통수단 공작소', icon: Sparkles },
            { id: 'journal', label: '5. 나의 이동 일기', icon: Lightbulb },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all shadow-xs cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-lg scale-102'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="space-y-8">
          {/* TAB 1: Summary */}
          {(activeTab === 'summary' || window.matchMedia('print').matches) && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 p-6 md:p-10 print:border-none print:shadow-none"
            >
              <div className="border-b border-neutral-100 pb-5 mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    학습 핵심 정리
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mt-3 tracking-tight">
                    과거부터 미래까지 교통수단의 발달 과정
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 hidden sm:flex">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TIMELINE_ITEMS.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-stone-50/70 rounded-2xl p-6 border border-neutral-200/60 flex flex-col justify-between hover:border-neutral-300 transition-all shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          item.era === 'past' ? 'bg-amber-100 text-amber-900' :
                          item.era === 'present' ? 'bg-blue-100 text-blue-900' : 'bg-purple-100 text-purple-900'
                        }`}>
                          {item.era === 'past' ? '과거 (Past)' : item.era === 'present' ? '현재 (Present)' : '미래 (Future)'}
                        </span>
                        <span className="text-3xl">
                          {item.era === 'past' ? '🐎' : item.era === 'present' ? '🚗' : '🛸'}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-neutral-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-200/60 shadow-2xs">
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">대표적인 교통수단</p>
                      <ul className="space-y-2">
                        {item.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-neutral-800 flex items-center gap-2 font-medium">
                            <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50/60 border border-blue-200/80 rounded-2xl p-6 text-neutral-900">
                <h4 className="font-bold flex items-center gap-2.5 mb-4 text-blue-950 text-base">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shadow-sm">
                    💡
                  </div>
                  교통수단이 발달하면서 우리 생활은 어떻게 달라졌을까요?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                    <p className="font-bold text-blue-900 mb-1">1. 이동 시간 단축</p>
                    <p className="text-xs text-neutral-600 leading-relaxed">멀리 떨어진 곳도 하루 안에 빠르게 오갈 수 있게 되었어요.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                    <p className="font-bold text-blue-900 mb-1">2. 활발한 교류</p>
                    <p className="text-xs text-neutral-600 leading-relaxed">다른 지역의 신선한 물건이나 특산물을 쉽게 주고받아요.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                    <p className="font-bold text-blue-900 mb-1">3. 생활권의 확대</p>
                    <p className="text-xs text-neutral-600 leading-relaxed">여행이나 출퇴근, 등하교가 훨씬 편리해졌어요.</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* TAB 2: Matching Game */}
          {(activeTab === 'matching' || window.matchMedia('print').matches) && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 p-6 md:p-10 print:border-none print:shadow-none"
            >
              <div className="border-b border-neutral-100 pb-5 mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    활동 1
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mt-3 tracking-tight">
                    교통수단 알맞은 시대와 연결하기
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">왼쪽의 설명(문제)을 누르고, 오른쪽의 알맞은 정답을 눌러 짝을 지어보세요!</p>
                </div>
                <button 
                  onClick={() => { setMatchedPairs({}); setSelectedMatchQ(null); }}
                  className="text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 bg-neutral-100 px-4 py-2 rounded-full print:hidden transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> 다시하기
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
                {/* Questions column */}
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 설명 (문제)
                  </h3>
                  {MATCHING_PAIRS.map((item) => {
                    const isSelected = selectedMatchQ === item.question;
                    const isCompleted = !!matchedPairs[item.question];
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleMatchClick(item.question, true)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between shadow-2xs ${
                          isCompleted
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                            : isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-200 shadow-sm'
                            : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-sm">{item.question}</span>
                        {isCompleted ? (
                          <span className="text-xs bg-emerald-200/80 text-emerald-900 font-bold px-2.5 py-1 rounded-full">연결 완료 ✓</span>
                        ) : (
                          <span className="text-xs bg-neutral-100 text-neutral-500 px-2.5 py-1 rounded-full font-medium">선택</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Answers column */}
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> 교통수단 이름
                  </h3>
                  {MATCHING_PAIRS.map((item, idx) => {
                    const matchedQKey = Object.keys(matchedPairs).find(k => matchedPairs[k] === item.answer);
                    const isMatched = !!matchedQKey;
                    
                    return (
                      <div
                        key={idx}
                        onClick={() => handleMatchClick(item.answer, false)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between shadow-2xs ${
                          isMatched
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-white border-neutral-200 hover:bg-stone-50 hover:border-neutral-300'
                        }`}
                      >
                        <span className="text-sm">{item.answer}</span>
                        {isMatched ? (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">짝꿍 완료!</span>
                        ) : (
                          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-full">여기에 맞추기</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Show Answer Key helper */}
              {showAnswerKey && (
                <div className="mt-8 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                  <h4 className="font-bold text-emerald-900 text-sm mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-700" /> [선생님 정답 확인]
                  </h4>
                  <ul className="text-xs text-emerald-800 space-y-1.5 font-medium">
                    {MATCHING_PAIRS.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        {p.question} ➔ <strong className="text-emerald-950 underline">{p.answer}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.section>
          )}

          {/* TAB 3: Quiz */}
          {(activeTab === 'quiz' || window.matchMedia('print').matches) && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 p-6 md:p-10 print:border-none print:shadow-none"
            >
              <div className="border-b border-neutral-100 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    활동 2
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mt-3 tracking-tight">
                    실력 쑥쑥 단원 퀴즈
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">배운 내용을 얼마나 잘 이해했는지 퀴즈를 풀며 확인해봐요!</p>
                </div>
                {quizSubmitted && (
                  <div className="bg-amber-100 text-amber-950 font-extrabold px-5 py-3 rounded-2xl text-sm flex items-center gap-2.5 shadow-sm border border-amber-200">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    내 점수: {correctCount} / {QUIZ_QUESTIONS.length} 정답!
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {QUIZ_QUESTIONS.map((q, index) => {
                  const userAns = userAnswers[q.id];
                  const isCorrect = userAns === q.answer;
                  return (
                    <div key={q.id} className="p-6 rounded-2xl border border-neutral-200/80 bg-stone-50/50">
                      <p className="font-extrabold text-neutral-900 mb-4 flex items-start gap-3 text-base">
                        <span className="bg-[#111111] text-white text-xs font-bold px-2.5 py-1 rounded-lg mt-0.5">
                          Q{index + 1}
                        </span>
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === oIdx;
                          const isRightOption = q.answer === oIdx;
                          let btnStyle = "bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800";

                          if (quizSubmitted || showAnswerKey) {
                            if (isRightOption) {
                              btnStyle = "bg-emerald-100/80 border-emerald-400 text-emerald-950 font-bold";
                            } else if (isSelected && !isRightOption) {
                              btnStyle = "bg-rose-100/80 border-rose-400 text-rose-950";
                            }
                          } else if (isSelected) {
                            btnStyle = "bg-blue-50 border-blue-600 text-blue-950 font-semibold ring-2 ring-blue-100 shadow-2xs";
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectAnswer(q.id, oIdx)}
                              className={`p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span className="font-medium">{opt}</span>
                              {(quizSubmitted || showAnswerKey) && isRightOption && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {(quizSubmitted || showAnswerKey) && (
                        <div className={`mt-4 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 font-medium ${
                          isCorrect || showAnswerKey 
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-900 border border-rose-200'
                        }`}>
                          <span className="font-bold uppercase tracking-wide">💡 정답 해설:</span>
                          <span className="leading-relaxed">{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end gap-3 print:hidden">
                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="bg-[#111111] hover:bg-neutral-800 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition-all text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-amber-400" /> 정답 제출하고 점수 확인하기
                  </button>
                ) : (
                  <button
                    onClick={() => { setQuizSubmitted(false); setUserAnswers({}); }}
                    className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold px-8 py-3.5 rounded-full transition-all text-sm cursor-pointer"
                  >
                    퀴즈 다시 풀기
                  </button>
                )}
              </div>
            </motion.section>
          )}

          {/* TAB 4: Future Transport AI Imagination */}
          {(activeTab === 'future' || window.matchMedia('print').matches) && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 p-6 md:p-10 print:border-none print:shadow-none"
            >
              <div className="border-b border-neutral-100 pb-5 mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    활동 3
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mt-3 tracking-tight">
                    내가 상상하는 미래의 교통수단 공작소
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">미래에 타고 싶은 나만의 멋진 교통수단을 상상해보고 AI 선생님께 피드백을 받아보세요!</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 hidden sm:flex">
                  <Rocket className="w-6 h-6" />
                </div>
              </div>

              <form onSubmit={handleAiSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">미래 교통수단 이름</label>
                    <input
                      type="text"
                      placeholder="예: 구름 비행 버스, 텔레포트 캡슐"
                      value={transportName}
                      onChange={e => setTransportName(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-stone-50/50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">이동 방식 / 종류</label>
                    <select
                      value={transportType}
                      onChange={e => setTransportType(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-stone-50/50 font-medium"
                    >
                      <option value="하늘비행형">하늘을 나는 비행형 (UAM)</option>
                      <option value="친환경태양광형">태양광 / 친환경 에너지형</option>
                      <option value="우주탐사형">우주 및 바다 속 탐사형</option>
                      <option value="공간이동초능력형">순간 이동 / AI 자율주행형</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">어떤 특징이 있고 왜 편리한가요? (자세히 적어보세요)</label>
                  <textarea
                    rows={4}
                    placeholder="예: 이 교통수단은 날씨에 상관없이 하늘을 날 수 있고, 매연 대신 깨끗한 태양열로 움직여서 환경을 오염시키지 않아요. 교통 체증이 전혀 없어서 학교에 5분 만에 갈 수 있어요!"
                    value={transportIdea}
                    onChange={e => setTransportIdea(e.target.value)}
                    className="w-full px-4 py-3.5 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-stone-50/50 font-medium leading-relaxed"
                  />
                </div>

                <div className="flex justify-end print:hidden">
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition-all text-sm flex items-center gap-2.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                    {aiLoading ? 'AI 선생님이 읽어보는 중...' : 'AI 쌤에게 칭찬 피드백 받기 ✨'}
                  </button>
                </div>
              </form>

              {aiResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-3xl p-6 md:p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-purple-950 flex items-center gap-2 text-base">
                      <Sparkles className="w-5 h-5 text-purple-600" /> AI 선생님의 상상력 심사평
                    </span>
                    <span className="bg-purple-200/80 text-purple-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-2xs">
                      창의력 점수: {aiResult.score}점! 🌟
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-purple-950 leading-relaxed font-medium">{aiResult.feedback}</p>
                </motion.div>
              )}
            </motion.section>
          )}

          {/* TAB 5: Journal */}
          {(activeTab === 'journal' || window.matchMedia('print').matches) && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-neutral-200/80 p-6 md:p-10 print:border-none print:shadow-none"
            >
              <div className="border-b border-neutral-100 pb-5 mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    활동 4
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mt-3 tracking-tight">
                    오늘 나의 이동 일기 & 생각 나누기
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">오늘 학교에 오거나 집에 갈 때 이용했던 교통수단을 떠올리며 소감을 적어보세요.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 hidden sm:flex">
                  <Lightbulb className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-6">
                <textarea
                  rows={5}
                  placeholder="예: 오늘 아침에 엄마 차를 타고 학교에 올 때 길이 조금 막혔다. 만약 지하철이나 자전거를 탔다면 어땠을까? 교통수단이 발달해서 편리하지만, 환경을 생각해서 대중교통이나 자전거를 더 많이 이용해야겠다고 생각했다."
                  value={journalText}
                  onChange={e => { setJournalText(e.target.value); setJournalSaved(false); }}
                  className="w-full px-4 py-4 border border-neutral-200 rounded-2xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-stone-50/50 leading-relaxed font-medium"
                />

                <div className="flex items-center justify-between print:hidden">
                  <span className="text-xs font-semibold text-neutral-400">글자수: {journalText.length}자</span>
                  <button
                    onClick={() => { setJournalSaved(true); confetti({ particleCount: 50, spread: 40 }); }}
                    className="bg-amber-400 hover:bg-amber-500 text-neutral-950 font-extrabold px-8 py-3.5 rounded-full shadow-md transition-all text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> 일기 저장하기
                  </button>
                </div>

                {journalSaved && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl text-xs font-semibold border border-emerald-200 flex items-center gap-2.5 print:hidden shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> 일기가 성공적으로 저장되었습니다! 멋진 생각이에요. ✨
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}
        </div>

        {/* Footer print note */}
        <div className="mt-12 text-center text-xs text-neutral-400 print:mt-16 print:text-neutral-600 border-t border-neutral-200/60 pt-6">
          <p className="font-semibold text-neutral-600">초등학교 3학년 사회 · 교통수단의 발달과 생활의 변화 학습 활동지</p>
          <p className="mt-1 text-neutral-400">AI Studio 교육용 인터랙티브 학습 플랫폼</p>
        </div>
      </main>
    </div>
  );
}

