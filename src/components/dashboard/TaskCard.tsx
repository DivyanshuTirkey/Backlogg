import { Task } from "@/lib/types";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TaskCardProps {
    task: Task;
    onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="group"
        >
            {/* Connector Line (implies flow) */}
            <div className="absolute left-6 -top-4 w-0.5 h-4 bg-zinc-800 group-first:hidden" />

            <div className="relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg p-3 shadow-sm transition-all">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-zinc-200 leading-snug">
                            {task.title}
                        </h4>
                        <div className="mt-2 flex items-center gap-2">

                            {task.deadline && (
                                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                    <Clock size={10} />
                                    <span>{formatDate(task.deadline)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Indicator/Radio style */}
                    <div className={`w-3 h-3 rounded-full border-2 mt-0.5
            ${task.status === 'Done' ? 'bg-emerald-500/20 border-emerald-500' :
                            task.status === 'Ongoing' ? 'bg-amber-500/20 border-amber-500' :
                                'bg-zinc-800 border-zinc-600'}`}
                    />
                </div>
            </div>
            {/* Connector Line Bottom */}
            <div className="absolute left-6 -bottom-4 w-0.5 h-4 bg-zinc-800 group-last:hidden" />
        </motion.div>
    );
}
