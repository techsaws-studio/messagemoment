import { DateRange } from "react-day-picker";

export interface TableFiltersProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  filteredInput: string;
  setFilteredInput: (input: string) => void;
}

export interface SectionalHeadingProps {
  title: string;
  showDateRangePicker?: boolean;
  className?: string;
  titleClassName?: string;
  actionClassName?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export interface DateRangePickerProps {
  className?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

// REAL TIME MAP
export interface RealTimeMapProps {
  MapData: {
    countryName: string;
    countryCode: string;
    session: number;
    latitude: number;
    longitude: number;
  }[];
}

// DOUGHNUT CHARTS
export interface DoughnutChart01Props {
  label: string;
  percentage: number;
  backgroundColor: [string, string];
}
