"use client";

import * as React from "react";
import { format } from "date-fns";

import { DateRangePickerProps } from "@/interfaces/partials-components-interfaces";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar as CalendarIcon } from "lucide-react";

export function DateRangePicker({
  className,
  date,
  setDate,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[270px] h-[45px] rounded-[6px] justify-start text-left button-box-shadow bg-white text-heading-color text-[14px] font-medium hover:bg-general-hover font-inter tracking-wider",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="text-heading-color" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="font-inter text-heading-color tracking-wider">
                Pick a date
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
