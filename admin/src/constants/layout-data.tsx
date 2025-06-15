import {
  CheckCircle,
  Clock,
  FileBox,
  FileText,
  FolderGit,
  HeartPulse,
  LayoutPanelLeft,
  Megaphone,
  MessageSquare,
  Monitor,
  Repeat,
  RollerCoaster,
  Server,
  TrafficCone,
  Users,
} from "lucide-react";

export const SidebarNavigationData = [
  {
    page: 1,
    link: "/dashboard",
    icon: <LayoutPanelLeft />,
    title: "Dashboard",
  },

  {
    page: 2,
    link: "/users-sessions",
    icon: <Users />,
    title: "Users & Sessions",
  },

  {
    page: 3,
    link: "/file-transfer",
    icon: <FileBox />,
    title: "File Data Transfer",
  },

  {
    page: 4,
    link: "/audience-traffic",
    icon: <TrafficCone />,
    title: "Audience Traffic",
  },

  {
    page: 5,
    link: "/project-mode",
    icon: <FolderGit />,
    title: "Project Mode",
  },

  {
    page: 6,
    link: "/system-health-performance",
    icon: <HeartPulse />,
    title: "System Health & Performance",
  },

  {
    page: 7,
    link: "/advertisement-management",
    icon: <Megaphone />,
    title: "Advertisement Management System",
  },
];

export const SectionSearchbarSections = [
  // DASHBOARD PAGE
  {
    sectionId: "RealTimeGlobalActivitySection",
    displaySectionName: "Real Time Global Activity Section",
    link: "/dashboard",
    icon: RollerCoaster,
  },
  {
    sectionId: "RealTimeSessionMonitoringSection",
    displaySectionName: "Real Time Session Monitoring Section",
    link: "/dashboard",
    icon: Monitor,
  },
  {
    sectionId: "RealTimeUsersMonitoringSection",
    displaySectionName: "Real Time Users Monitoring Section",
    link: "/dashboard",
    icon: Users,
  },
  {
    sectionId: "UserAverageChatRoomSection",
    displaySectionName: "User Average Chat Room Section",
    link: "/dashboard",
    icon: MessageSquare,
  },
  {
    sectionId: "ReturnedVisitorsSection",
    displaySectionName: "Returned Visitors Section",
    link: "/dashboard",
    icon: Repeat,
  },

  // FILE TRANSFER PAGE
  {
    sectionId: "RealTimeFileTransferStatusSection",
    displaySectionName: "Real Time File Transfer Status Section",
    link: "/file-transfer",
    icon: Monitor,
  },
  {
    sectionId: "FileTypesSection",
    displaySectionName: "Files by Type Section",
    link: "/file-transfer",
    icon: FileText,
  },
  {
    sectionId: "FileStatusSection",
    displaySectionName: "File Status Section",
    link: "/file-transfer",
    icon: CheckCircle,
  },
  {
    sectionId: "FilePeakTimeSection",
    displaySectionName: "Files Peak Time Section",
    link: "/file-transfer",
    icon: Clock,
  },
  {
    sectionId: "ServerCapacitySection",
    displaySectionName: "Server Capacity (FileMoment) Section",
    link: "/file-transfer",
    icon: Server,
  },
];
