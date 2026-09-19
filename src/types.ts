export interface StudentInfo {
  school: string;
  gradeClass: string;
  number: string;
  name: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
}

export interface TimelineItem {
  era: 'past' | 'present' | 'future';
  title: string;
  description: string;
  features: string[];
  iconName: string;
}
