"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  // Generate page numbers to be displayed
  const generatePaginationItems = () => {
    // Always show first page, last page, current page, and siblings
    const items = new Set<number>();
    
    // Add current page and siblings
    for (
      let i = Math.max(1, currentPage - siblingCount);
      i <= Math.min(totalPages, currentPage + siblingCount);
      i++
    ) {
      items.add(i);
    }
    
    // Add first and last page
    items.add(1);
    items.add(totalPages);
    
    // Convert to array and sort
    const sortedItems = Array.from(items).sort((a, b) => a - b);
    
    // Add ellipsis indicators
    const result: (number | "ellipsis")[] = [];
    let prev: number | null = null;
    
    sortedItems.forEach((item) => {
      if (prev && item - prev > 1) {
        result.push("ellipsis");
      }
      result.push(item);
      prev = item;
    });
    
    return result;
  };

  const paginationItems = generatePaginationItems();

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      
      {paginationItems.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <Button key={`ellipsis-${index}`} variant="outline" size="icon" disabled>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More Pages</span>
            </Button>
          );
        }
        
        return (
          <Button
            key={`page-${item}`}
            variant={currentPage === item ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(item)}
          >
            {item}
            <span className="sr-only">Page {item}</span>
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
}