export interface Horse {
  id: number;
  name: string;
  driver: string;
  odds: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface Race {
  id: string;
  trackName: string;
  startTime: string;
  status: 'open' | 'closed' | 'running';
  horses: Horse[];
}
