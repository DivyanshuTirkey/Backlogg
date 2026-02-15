import { Button } from "@/components/ui/button"
import { Map, Settings, ListTodo } from "lucide-react"

export function Sidebar() {
    return (
        <div className="w-64 border-r border-border bg-card p-4 min-h-screen flex flex-col gap-4">
            <div className="font-bold text-xl px-4 py-2 flex items-center gap-2">
                <ListTodo className="h-6 w-6 text-primary" />
                <span>SmartHub</span>
            </div>
            <nav className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start gap-2 w-full">
                    <Map size={18} /> Roadmap
                </Button>
            </nav>
            <div className="mt-auto">
                <Button variant="ghost" className="justify-start gap-2 w-full">
                    <Settings size={18} /> Settings
                </Button>
            </div>
        </div>
    )
}
