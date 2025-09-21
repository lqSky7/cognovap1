import React from "react";
import * as Tooltip from '@radix-ui/react-tooltip';

interface TooltipRadixProps {
  children: React.ReactNode;
  content: string;
}

export default function TooltipRadix({ children, content }: TooltipRadixProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span>{children}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            side="top" 
            align="center" 
            className="rounded px-3 py-2 bg-gray-800 text-white text-sm shadow-lg border border-gray-600 max-w-xs z-50"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}