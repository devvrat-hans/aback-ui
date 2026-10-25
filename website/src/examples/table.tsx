"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  { id: "INV-001", date: "1 Sep 2026", amount: "120.00", status: "Paid" },
  { id: "INV-002", date: "1 Oct 2026", amount: "120.00", status: "Paid" },
  { id: "INV-003", date: "1 Nov 2026", amount: "120.00", status: "Open" },
];

export function TableExample() {
  return (
    <Table className="max-w-2xl">
      <TableCaption>Invoices for the Pro plan, in USD.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
            <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
            <TableCell className="text-right tabular-nums">${invoice.amount}</TableCell>
            <TableCell className="text-right">
              <Badge variant={invoice.status === "Paid" ? "success" : "outline"}>
                {invoice.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
