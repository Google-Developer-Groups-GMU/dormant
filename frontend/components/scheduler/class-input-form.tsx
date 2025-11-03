"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ClassInfo } from "@/app/scheduler/page"

interface ClassInputFormProps {
  onAddClass: (classInfo: Omit<ClassInfo, "id">) => void
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]
const COLORS = [
  "#646222", // olive
  "#4A5D23", // green
  "#2B5A6B", // teal
  "#5B4A8F", // purple
  "#8B4A4A", // burgundy
]

export default function ClassInputForm({ onAddClass }: ClassInputFormProps) {
  const [formData, setFormData] = useState({
    className: "",
    section: "",
    professor: "",
    time: "",
    location: "",
    days: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.className && formData.time && formData.days.length > 0) {
      onAddClass({
        ...formData,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
      // Reset form
      setFormData({
        className: "",
        section: "",
        professor: "",
        time: "",
        location: "",
        days: [],
      })
    }
  }

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="className" className="text-[#37322F] text-sm font-medium font-sans">
          Class Name *
        </Label>
        <Input
          id="className"
          value={formData.className}
          onChange={(e) => setFormData({ ...formData, className: e.target.value })}
          placeholder="e.g., Introduction to Computer Science"
          className="bg-white border-[rgba(55,50,47,0.12)] text-[#37322F] placeholder:text-[rgba(55,50,47,0.40)]"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="section" className="text-[#37322F] text-sm font-medium font-sans">
          Section
        </Label>
        <Input
          id="section"
          value={formData.section}
          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          placeholder="e.g., A01"
          className="bg-white border-[rgba(55,50,47,0.12)] text-[#37322F] placeholder:text-[rgba(55,50,47,0.40)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="professor" className="text-[#37322F] text-sm font-medium font-sans">
          Professor
        </Label>
        <Input
          id="professor"
          value={formData.professor}
          onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
          placeholder="e.g., Dr. Smith"
          className="bg-white border-[rgba(55,50,47,0.12)] text-[#37322F] placeholder:text-[rgba(55,50,47,0.40)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="time" className="text-[#37322F] text-sm font-medium font-sans">
          Time *
        </Label>
        <Input
          id="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          placeholder="e.g., 9:00 AM - 10:30 AM"
          className="bg-white border-[rgba(55,50,47,0.12)] text-[#37322F] placeholder:text-[rgba(55,50,47,0.40)]"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="location" className="text-[#37322F] text-sm font-medium font-sans">
          Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Room 301, Building A"
          className="bg-white border-[rgba(55,50,47,0.12)] text-[#37322F] placeholder:text-[rgba(55,50,47,0.40)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-[#37322F] text-sm font-medium font-sans">Days *</Label>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-4 py-2 rounded-full text-sm font-medium font-sans transition-all ${
                formData.days.includes(day)
                  ? "bg-[#37322F] text-white shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset]"
                  : "bg-white text-[#37322F] border border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.24)]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-2 bg-[#37322F] text-white hover:bg-[#49423D] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] font-medium font-sans"
      >
        Add Class
      </Button>
    </form>
  )
}
