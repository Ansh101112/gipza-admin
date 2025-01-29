import * as React from "react";
import { cn } from "@/lib/utils";

// Main Table Component
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full table-scrollbar overflow-x-auto"> {/* Added overflow-hidden */}

    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm border-collapse",
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

// Table Header (thead)
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "[&_tr]:border-b bg-[#f6ece8] text-left text-[#9c786c] font-bold",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// Table Body (tbody)
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0",
      className
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";

// Table Footer (tfoot)
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// Table Row (tr)
const TableRow = React.forwardRef(({ className, index, totalRows, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      // Conditional rounded corners for the first and last rows
      index === 0 ? "rounded-t-lg" : index === totalRows - 1 ? "rounded-b-lg" : "",
      "border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-[#FFFFFF] even:bg-[#F3EAE7] transition-colors",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

// Table Head (th)
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-semibold bg-[#F3EAE7] text-[#9c786c]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// Table Cell (td)
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-[#6e554a] text-sm font-medium",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// Table Caption (caption)
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
