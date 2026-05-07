import { clsx, type ClassValue } from "clsx"
import { BookOpen, ClipboardCheck, Shield } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categoryInfo = {
    'I': {
      title: 'Category I',
      description: 'High-value contracts requiring detailed scrutiny and CVO approval',
      icon: Shield,
      requiresPO: true,
    },
    'II': {
      title: 'Category II',
      description: 'Medium-value contracts with standard approval process',
      icon: ClipboardCheck,
      requiresPO: true,
    },
    'III': {
      title: 'Category III',
      description: 'Low-value contracts with simplified reporting requirements',
      icon: BookOpen,
      requiresPO: false,
    }
  };
