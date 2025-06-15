"use client";

import React, { useState, useMemo } from "react";

import { RealTimeSessionMonitoringTableProps } from "@/interfaces/dashboard-page-interfaces";

import { RealTimeSessionMonitoringTableData } from "@/constants/dashboard-page-data";

import { FormatDuration } from "@/functions/formate-duration";

import {
  flexRender,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SessionMonitoringTableManageButton from "./session-monitoring-table-manage-button";

import { ArrowRight, Clock, FileText, MapPin, Users } from "lucide-react";

const RealTimeSessionMonitoringTable = ({
  selectedTab,
  filteredInput,
}: RealTimeSessionMonitoringTableProps) => {
  const [data] = useState(RealTimeSessionMonitoringTableData);

  const filteredData = useMemo(() => {
    let filtered =
      selectedTab === "View All"
        ? data
        : data.filter((row) => row.sessionType === selectedTab);

    if (filteredInput) {
      filtered = filtered.filter((row) =>
        row.sessionId.toString().includes(filteredInput)
      );
    }

    return filtered;
  }, [data, selectedTab, filteredInput]);

  const columns: ColumnDef<
    (typeof RealTimeSessionMonitoringTableData)[number]
  >[] = [
    {
      accessorKey: "sessionId",
      header: () => (
        <div className="w-full flex items-center gap-4">
          <span className="font-semibold text-[14px]">Session ID</span>
          <FileText size={16} />
        </div>
      ),
      cell: ({ row }) => row.getValue("sessionId"),
    },

    {
      accessorKey: "participants",
      header: () => (
        <div className="w-full flex items-center gap-4">
          <span className="font-semibold text-[14px]">Participants</span>
          <Users size={16} />
        </div>
      ),
      cell: ({ row }) => {
        const totalParticipants = 10;
        const currentParticipants = row.original.participants;

        const percentage = (currentParticipants / totalParticipants) * 100;

        const getIndicatorColor = (percentage: number) => {
          if (percentage < 20) return "bg-red-500";
          if (percentage < 50) return "bg-yellow-500";
          if (percentage < 80) return "bg-blue-500";
          return "bg-green-500";
        };

        const indicatorColor = getIndicatorColor(percentage);

        return (
          <div className="flex items-center lg:gap-8 gap-4">
            <span className="md:text-[14px] text-[12px]">
              {currentParticipants}/{totalParticipants}
            </span>
            <Progress
              value={percentage}
              className="h-[7px] max-lg:w-[200px] bg-[#e9ecef]"
              indicatorClassName={`${indicatorColor} rounded-[50rem]`}
            />
            <p className="md:text-[14px] text-[12px]">{percentage}%</p>
          </div>
        );
      },
    },

    {
      accessorKey: "sessionType",
      header: () => (
        <div className="w-full flex items-center gap-4">
          <span className="font-semibold text-[14px] ">Type</span>
          <ArrowRight size={16} />
        </div>
      ),
    },

    {
      accessorKey: "location",
      header: () => (
        <div className="w-full flex items-center gap-4">
          <span className="font-semibold text-[14px]">Location</span>
          <MapPin size={16} />
        </div>
      ),
      cell: ({ row }) => {
        const location = row.original.location;
        const locationCode = row.original.locationCode.toLowerCase();
        return (
          <div className="flex items-center gap-4">
            <span
              className={`w-[30px] h-[20px] rounded-full fi fi-${locationCode} flag-shadow !bg-cover`}
            />
            <span className="w-[calc(100%-30px)]">{location}</span>
          </div>
        );
      },
      size: 200, // Fixed width in pixels
    },

    {
      accessorKey: "duration",
      header: () => (
        <div className="w-full flex items-center gap-4">
          <span className="font-semibold text-[14px]">Duration</span>
          <Clock size={16} />
        </div>
      ),
      cell: ({ row }) => {
        const durationInSeconds = row.getValue("duration") as number;
        return <span>{FormatDuration(durationInSeconds)}</span>;
      },
      size: 150, // Fixed width in pixels
    },

    {
      id: "actions",
      header: "",
      cell: () => <SessionMonitoringTableManageButton />,
      size: 100,
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="lg:h-[860px] lg:flex lg:flex-col lg:justify-between">
      <div className="overflow-auto">
        <Table>
          <TableHeader className="font-inter tracking-wide text-heading-color font-semibold dark:bg-[#494af8]/10 bg-[#000000]/10 rounded-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`max-lg:!w-[180px] ${
                      header.column.id === "actions"
                        ? "rounded-[0px_6px_6px_0px] lg:w-[250px]"
                        : header.column.id === "sessionId"
                        ? "rounded-[6px_0px_0px_6px] lg:w-[200px]"
                        : header.column.id === "participants"
                        ? "lg:w-[500px]"
                        : header.column.id === "sessionType"
                        ? "lg:w-[180px] lg:pl-14"
                        : header.column.id === "location"
                        ? "lg:w-[200px]"
                        : header.column.id === "duration"
                        ? "lg:w-[200px]"
                        : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${
                        cell.column.id === "sessionType" && "lg:pl-14"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No session ID found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* TABLE PAGINATION */}
      <div className="flex items-center justify-between py-4">
        <span className="font-semibold font-jetbrains_mono">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="font-inter text-heading-color border hover:bg-general-hover text-[14px] tracking-wider"
          >
            Previous
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="font-inter bg-secondary-theme text-theme-heading-color hover:bg-secondary-theme-hover text-[14px] tracking-wider"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSessionMonitoringTable;
