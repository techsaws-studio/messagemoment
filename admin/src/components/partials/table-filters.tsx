import React from "react";

import { TableFiltersProps } from "@/interfaces/partials-components-interfaces";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { ListFilter } from "lucide-react";

const TableFilters = ({
  selectedTab,
  setSelectedTab,
  filteredInput,
  setFilteredInput,
}: TableFiltersProps) => {
  return (
    <div className="w-full flex items-center lg:justify-between lg:flex-row flex-col max-lg:gap-8">
      {/* TABS */}
      <div className="md:flex max-sm:w-full max-md:grid max-md:grid-cols-2 font-inter font-medium">
        <Button
          onClick={() => setSelectedTab("View All")}
          className={`h-[40px] sm:w-[135px] w-full md:rounded-[6px_0_0_6px] rounded-[6px_0_0_0] border text-[14px] card-filter-button-box-shadow max-md:col-span-1 ${
            selectedTab === "View All"
              ? "bg-selected-color text-theme-heading-color"
              : "bg-white hover:bg-general-hover text-heading-color"
          }`}
        >
          View All
        </Button>

        <Button
          onClick={() => setSelectedTab("Standard")}
          className={`h-[40px] sm:w-[135px] w-full md:rounded-[0] rounded-[0_6px_0_0] border text-[14px] card-filter-button-box-shadow max-md:col-span-1 ${
            selectedTab === "Standard"
              ? "bg-selected-color text-theme-heading-color"
              : "bg-white hover:bg-general-hover text-heading-color"
          }`}
        >
          Standard
        </Button>

        <Button
          onClick={() => setSelectedTab("Secure")}
          className={`h-[40px] sm:w-[135px] w-full md:rounded-[0] rounded-[0_0_0_6px] border text-[14px] card-filter-button-box-shadow max-md:col-span-1 ${
            selectedTab === "Secure"
              ? "bg-selected-color text-theme-heading-color"
              : "bg-white hover:bg-general-hover text-heading-color"
          }`}
        >
          Secure
        </Button>

        <Button
          onClick={() => setSelectedTab("Wallet")}
          className={`h-[40px] sm:w-[135px] w-full md:rounded-[0_6px_6px_0] rounded-[0_0_6px_0] border text-[14px] card-filter-button-box-shadow max-md:col-span-1 ${
            selectedTab === "Wallet"
              ? "bg-selected-color text-theme-heading-color"
              : "bg-white hover:bg-general-hover text-heading-color"
          }`}
        >
          Wallet
        </Button>
      </div>

      {/* SEARCH  */}
      <div className="lg:w-fit md:w-[90%] w-full flex items-center gap-4">
        <Input
          placeholder="Search Session ID"
          className="h-[40px] rounded-[6px] lg:w-[300px] w-full focus:outline-2 focus-visible:ring-secondary-theme bg-transparent text-[14px] placeholder:text-[14px]"
          value={filteredInput}
          onChange={(e) => setFilteredInput(e.target.value)}
        />

        <Button
          onClick={() => {
            setFilteredInput(filteredInput);
          }}
          className="h-[40px] border hover:bg-general-hover text-heading-color card-filter-button-box-shadow"
        >
          <ListFilter />
          <span className="text-[14px] font-inter tracking-wider">Filter</span>
        </Button>
      </div>
    </div>
  );
};

export default TableFilters;
