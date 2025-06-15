"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { DashboardSearchbarInterface } from "@/interfaces/layout-interfaces";

import { SectionSearchbarSections } from "@/constants/layout-data";

import { Input } from "@/components/ui/input";

import { AlertCircle, Search } from "lucide-react";

const DashboardSearchbar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<DashboardSearchbarInterface[]>(
    []
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const normalize = (str: string): string =>
    str.toLowerCase().replace(/\s+/g, "");

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const normalizedValue = normalize(value);
    const filteredSuggestions = SectionSearchbarSections.filter((section) =>
      normalize(section.sectionId).includes(normalizedValue)
    );

    setSuggestions(filteredSuggestions);
    setDropdownVisible(true);
  };

  const handleSelect = async (section: DashboardSearchbarInterface) => {
    const isOnCurrentPage = pathname === section.link;

    if (isOnCurrentPage) {
      const element = document.getElementById(section.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      await router.push(section.link);
      setTimeout(() => {
        const element = document.getElementById(section.sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }

    setSearchTerm("");
    setSuggestions([]);
    setDropdownVisible(false);
  };

  return (
    <>
      {/* LARGE SCREENS */}
      <div
        ref={dropdownRef}
        className="relative w-[300px] h-[40px] rounded-[6px] border lg:flex hidden items-center justify-between px-2 text-black/30"
      >
        <Input
          className="w-[calc(100%-35px)] h-[30px] bg-transparent !p-0 border-none rounded-none ring-0 focus-visible:ring-0 text-[14px] font-inter tracking-wider placeholder:text-black/30 text-heading-color"
          placeholder="Search Section here..."
          value={searchTerm}
          onChange={handleChange}
        />
        <div className="w-[30px] h-[30px] border rounded-sm flex items-center justify-center">
          /
        </div>

        {dropdownVisible && (
          <>
            {suggestions.length > 0 ? (
              <ul className="absolute top-[42px] left-0 w-full bg-white border rounded-md shadow-lg z-10 max-h-[300px] overflow-y-auto p-4 flex flex-col gap-4">
                {suggestions.map((section) => (
                  <li
                    key={section.sectionId}
                    onClick={() => handleSelect(section)}
                    className="p-2 rounded-lg font-inter text-[14px] text-heading-color font-semibold tracking-wide cursor-pointer animation-standard hover:bg-primary-theme hover:text-theme-heading-color"
                  >
                    {section.displaySectionName}
                  </li>
                ))}
              </ul>
            ) : searchTerm.trim() ? (
              <div className="absolute top-[42px] left-0 w-full bg-white border rounded-md shadow-lg z-10 p-4 text-sm text-heading-color font-inter tracking-wide flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                No searched section found
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* MIDDLE & SMALL SCREENS */}
      <Search className="lg:hidden"/>
    </>
  );
};

export default DashboardSearchbar;
