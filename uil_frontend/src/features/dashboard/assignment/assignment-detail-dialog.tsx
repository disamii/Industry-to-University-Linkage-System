import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssignmentResponse } from "@/types/interfaces.assignments";
import {
  Building2,
  CheckCircle2,
  Clock,
  Wallet,
  UserIcon,
  Mail,
} from "lucide-react";

type Props = {
  assignments: AssignmentResponse[];
  open: boolean;
  onOpenChange: (value: boolean) => void;
  // Assuming these are passed or available in scope
  fullName?: string;
  email?: string;
};

const AssignmentDetailDialog = ({
  assignments,
  open,
  onOpenChange,
  fullName,
  email,
}: Props) => {
  if (!assignments) return null;

  const totalBudget = assignments.reduce(
    (sum, t) => sum + (t.request?.budget_required || 0),
    0,
  );
  const avgProgress =
    assignments.length > 0
      ? Math.round(
          assignments.reduce((sum, t) => sum + parseInt(t.progress || "0"), 0) /
            assignments.length,
        )
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* max-w-5xl provides that wider, professional enterprise look */}
      <DialogContent className="bg-background shadow-2xl p-0 border-border max-w-5xl! overflow-hidden">
        {/* Header Area - Using natural accent colors consistent with your profile cards */}
        <div className="bg-accent/30 p-8 border-border/40 border-b">
          <DialogHeader>
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <DialogTitle className="font-bold text-foreground text-2xl tracking-tight">
                    Assignments Detail
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    Detailed breakdown of {assignments.length} industry
                    projects.
                  </DialogDescription>
                </div>

                {/* User Context Info */}
                <div className="flex flex-wrap gap-4 pt-1">
                  <div className="flex items-center gap-2 bg-background px-3 py-1.5 border border-border/50 rounded-full font-medium text-foreground/80 text-xs">
                    <UserIcon size={14} className="text-orange-500" />
                    {fullName || "User Name"}
                  </div>
                  <div className="flex items-center gap-2 bg-background px-3 py-1.5 border border-border/50 rounded-full font-medium text-foreground/80 text-xs">
                    <Mail size={14} className="text-primary" />
                    {email || "user@example.com"}
                  </div>
                </div>
              </div>

              {/* Stats Summary - Using the natural monochromatic look */}
              <div className="flex items-center gap-6 bg-background shadow-sm p-4 border border-border/60 rounded-2xl">
                <div className="px-2">
                  <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Cumulative Budget
                  </p>
                  <p className="font-bold text-foreground text-xl">
                    ${totalBudget.toLocaleString()}
                  </p>
                </div>
                <div className="bg-border w-px h-8" />
                <div className="px-2">
                  <p className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    Avg. Completion
                  </p>
                  <p className="font-bold text-primary text-xl">
                    {avgProgress}%
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Main Table Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader className="top-0 z-10 sticky bg-background/95 backdrop-blur-sm border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 w-[320px]">
                  Project & Client
                </TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="w-45">Progress</TableHead>
                <TableHead className="pr-8 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((task) => (
                <TableRow
                  key={task.id}
                  className="group hover:bg-muted/40 border-border/40 border-b transition-colors"
                >
                  <TableCell className="py-5 pl-8">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {task.request?.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-xs">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{task.request?.industry?.name}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`font-bold text-[10px] uppercase px-2 py-0 border-none rounded-md ${
                        task.request?.priority === "HIGH"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {task.request?.priority}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground/80 text-sm">
                      <Wallet className="w-3.5 h-3.5 text-muted-foreground" />$
                      {task.request?.budget_required?.toLocaleString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-2 pr-4">
                      <div className="flex justify-between font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">
                        <span>Completion</span>
                        <span>{task.progress}</span>
                      </div>
                      <Progress
                        value={parseInt(task.progress || "")}
                        className="bg-muted h-1.5"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="pr-8 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex items-center gap-2">
                        {task.status === "COMPLETED" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-primary" />
                        )}
                        <span className="font-bold text-foreground text-sm">
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                      <span className="opacity-60 font-mono text-[10px] text-muted-foreground uppercase">
                        {task.id.split("-")[0]}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDetailDialog;
