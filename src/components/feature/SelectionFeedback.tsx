'use client';

import React, { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { Color } from '@/src/types';

interface SelectionFeedbackProps {
  label: string;
  options: string[] | Color[];
  type: 'size' | 'color';
}

export function SelectionFeedback({ label, options, type }: SelectionFeedbackProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (options.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">{label}</span>
        {selected && (
          <span className="text-[10px] font-medium text-neutral-500 uppercase">Selected: {selected}</span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isColor = type === 'color';
          const name = isColor ? (option as Color).name : (option as string);
          const isSelected = selected === name;

          return (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={cn(
                "relative flex h-10 min-w-[3rem] items-center justify-center rounded-md border text-xs font-medium transition-all duration-200",
                isSelected 
                  ? "border-neutral-900 bg-neutral-900 text-white" 
                  : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
              )}
            >
              {isColor ? (
                <div className="flex items-center space-x-2 px-3">
                  <div 
                    className="h-3 w-3 rounded-full border border-black/10" 
                    style={{ backgroundColor: (option as Color).hexCode }} 
                  />
                  <span>{name}</span>
                </div>
              ) : (
                <span className="px-3">{name}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
