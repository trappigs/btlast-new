
export enum Stage {
  AWARENESS = '1. Etap: Farkındalık',
  STRATEGY = '2. Etap: Strateji',
  PROFESSIONAL = '3. Etap: Vizyon'
}

export interface ScoreWeights {
  trust: number;
  profit: number;
  life: number;
}

export interface Choice {
  id: string;
  text: string;
  weights: ScoreWeights;
}

export interface Question {
  id: number;
  stage: Stage;
  title?: string;
  text: string;
  hint?: string;
  isMultiple?: boolean;
  choices: Choice[];
  fact?: string;
}

export interface QuizState {
  isStarted: boolean;
  viewingLearn: boolean;
  currentQuestionIndex: number;
  selectedChoiceIds: string[];
  allAnswers: { questionId: number; choiceIds: string[] }[];
  isFinished: boolean;
  showFact: boolean;
  stageJustCompleted: number | null; // 1 (5 soru sonrası) veya 2 (13 soru sonrası)
}

export interface InvestmentProfile {
  styleName: string;
  title: string;
  description: string;
  riskTolerance: string;
  recommendation: string;
  logicAnalysis: string;
}

export interface LearningSection {
  title: string;
  content: string;
  imageUrl: string;
}
