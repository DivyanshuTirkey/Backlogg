import { Subtask } from "@/lib/types";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, formatTime } from "@/lib/utils";
import React from "react";
import { DatePicker } from "@/components/ui/date-picker";

interface TimelineItemProps {
    subtask: Subtask;
    index: number;
    isLast: boolean;
    onToggle: () => void;
    onUpdate: (updates: Partial<Subtask>) => void;
    onDelete: () => void;
}

export function TimelineItem({ subtask, index, isLast, onToggle, onUpdate, onDelete }: TimelineItemProps) {
    const controls = useDragControls();

    return (
        <Reorder.Item value={subtask} dragListener={false} dragControls={controls} className="relative">
            <div className="flex gap-6">

                {/* Left Side: Date */}
                <div className="w-[18%] shrink-0 flex justify-end pt-1">
                    {subtask.date ? (
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-zinc-400">
                                {formatDate(subtask.date)}
                            </span>
                            <span className="text-[10px] text-zinc-600 font-medium">
                                {formatTime(subtask.date)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-zinc-700 italic pt-1">No date</span>
                    )}
                </div>

                {/* Center: Marker & Line */}
                <div className="relative flex flex-col items-center w-4 shrink-0">
                    {/* To make lines continuous with spacing, we need the line to span the full height of this item block.
                        Line Above: Top to Center.
                        Line Below: Center to Bottom.
                        This covers the whole item height.
                     */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2">
                        {/* Upper Segment */}
                        {index !== 0 && <div className="absolute top-0 h-1/2 w-full bg-zinc-800" />}
                        {/* Lower Segment */}
                        {!isLast && <div className="absolute bottom-0 h-1/2 w-full bg-zinc-800" />}
                    </div>

                    <div className={`relative z-10 w-3 h-3 rounded-full border-2 mt-2 bg-zinc-950 ${subtask.completed ? 'border-emerald-500 bg-emerald-500/20' : 'border-indigo-500'}`} />
                </div>

                {/* Right Side: Content Card */}
                <div className="flex-1 pb-8"> {/* Bottom padding creates the 'gap' between visual items */}
                    <div className={`flex gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-sm transition-all hover:border-zinc-700 hover:shadow-md group ${subtask.completed ? 'opacity-50' : ''}`}>
                        <div
                            onPointerDown={(e: React.PointerEvent<Element>) => controls.start(e)}
                            className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 mt-1"
                        >
                            <GripVertical size={16} />
                        </div>

                        <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={onToggle}
                            className="mt-1 border-zinc-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />

                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-medium leading-normal ${subtask.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                    {subtask.title}
                                </p>
                                <button
                                    onClick={onDelete}
                                    className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                                    title="Delete Activity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-1 mt-1">
                                <DatePicker
                                    date={subtask.date}
                                    setDate={(date) => onUpdate({ date })}
                                    className="h-5 text-[10px] w-auto px-1 py-0 border-transparent bg-transparent hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 font-normal"
                                    label="Set date"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Reorder.Item>
    );
}
