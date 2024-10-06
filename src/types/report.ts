// reportTypes.ts

export interface ReportType {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    estimatedTime: number; // in seconds
  }
  
  import { BarChart2, PieChart } from 'lucide-react';
  
  export const reportTypes: ReportType[] = [
    // {
    //   id: 'essay',
    //   name: 'Essay',
    //   icon: FileText,
    //   estimatedTime: 60,
    // },
    // {
    //   id: 'report',
    //   name: 'Report',
    //   icon: File,
    //   estimatedTime: 90,
    // },
    {
      id: 'analysis',
      name: 'Analysis',
      icon: BarChart2,
      estimatedTime: 20,
    },
    {
      id: 'summary',
      name: 'Summary',
      icon: PieChart,
      estimatedTime: 20,
    },
  ];
  
  export const getReportTypeById = (id: string): ReportType | undefined => {
    return reportTypes.find(type => type.id === id);
  };