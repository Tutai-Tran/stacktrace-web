export interface Sample {
  tool: string;
  version: string;
  summary: string;
  action?: string;
}
export interface FeedRow {
  name: string;
  version: string;
  tier: "crit" | "not" | "fyi";
}
export interface SiteData {
  issueNo: number;
  issueDate: string;
  totalChanges: number;
  critCount: number;
  notableCount: number;
  fyiCount: number;
  subscribeUrl: string;
  critical: Sample;
  notable: Sample[];
  feed: FeedRow[];
  tools: string[];
}
