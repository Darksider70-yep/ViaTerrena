export interface FirstAidStep {
  id: string;
  title: string;
  summary: string;
  detail: string;
  critical: boolean;
  doList: string[];
  dontList: string[];
}

export interface FirstAidCategory {
  id: string;
  title: string;
  emoji: string;
  color: string;
  steps: FirstAidStep[];
}

export interface FirstAidGuide {
  version: string;
  lastUpdated: string;
  categories: FirstAidCategory[];
}
