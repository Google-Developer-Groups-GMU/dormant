"use client"

import type { ClassInfo } from "@/app/scheduler/page"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TimetableViewProps {
  classes: ClassInfo[]
  onDeleteClass: (id: string) => void
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]

export default function TimetableView({ classes, onDeleteClass }: TimetableViewProps) {
  if (classes.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-white rounded-lg border border-[rgba(55,50,47,0.12)]">
        <div className="text-center flex flex-col gap-2">
          <p className="text-[#605A57] text-sm font-medium font-sans">No classes added yet</p>
          <p className="text-[rgba(55,50,47,0.60)] text-xs font-sans">Add your first class to see it here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Timetable Grid */}
      <div className="w-full bg-white rounded-lg border border-[rgba(55,50,47,0.12)] overflow-hidden">
        <div className="grid grid-cols-5 gap-0">
          {DAYS.map((day) => (
            <div
              key={day}
              className="px-3 py-3 border-b border-r last:border-r-0 border-[rgba(55,50,47,0.12)] bg-[#F7F5F3]"
            >
              <p className="text-[#37322F] text-xs font-semibold font-sans text-center">{day}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-0 min-h-[200px]">
          {DAYS.map((day) => {
            const dayClasses = classes.filter((c) => c.days.includes(day))
            return (
              <div
                key={day}
                className="px-2 py-3 border-r last:border-r-0 border-[rgba(55,50,47,0.12)] flex flex-col gap-2"
              >
                {dayClasses.map((classInfo) => (
                  <div
                    key={classInfo.id}
                    className="p-2 rounded text-white text-xs font-sans relative group"
                    style={{ backgroundColor: classInfo.color }}
                  >
                    <p className="font-semibold leading-tight mb-1">{classInfo.className}</p>
                    <p className="text-[10px] opacity-90">{classInfo.time}</p>
                    {classInfo.location && <p className="text-[10px] opacity-90">{classInfo.location}</p>}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Class List */}
      <div className="w-full flex flex-col gap-2">
        <h3 className="text-[#37322F] text-sm font-semibold font-sans">All Classes</h3>
        <div className="flex flex-col gap-2">
          {classes.map((classInfo) => (
            <div
              key={classInfo.id}
              className="p-3 bg-white rounded-lg border border-[rgba(55,50,47,0.12)] flex justify-between items-start gap-3"
            >
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classInfo.color }}></div>
                  <p className="text-[#37322F] text-sm font-semibold font-sans">{classInfo.className}</p>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#605A57] font-sans">
                  {classInfo.section && <span>Section: {classInfo.section}</span>}
                  {classInfo.professor && <span>Prof: {classInfo.professor}</span>}
                  <span>{classInfo.time}</span>
                  {classInfo.location && <span>{classInfo.location}</span>}
                </div>
                <div className="flex gap-1 mt-1">
                  {classInfo.days.map((day) => (
                    <span
                      key={day}
                      className="px-2 py-0.5 bg-[#F7F5F3] text-[#37322F] text-[10px] font-medium font-sans rounded"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteClass(classInfo.id)}
                className="h-8 w-8 text-[#605A57] hover:text-[#37322F] hover:bg-[#F7F5F3]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
