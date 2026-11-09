/**
 * BlockRenderer — walks a list of UI blocks and renders each one through
 * the block registry. This is the renderer core: it has no knowledge of
 * any specific block type or site component — all of that lives in
 * `registry.tsx`, so new block types/variants never require touching this
 * file.
 *
 * AIC2-152 — part of the "Ask AI Centre" epic (AIC2-149).
 */

import type { ReactNode } from 'react';
import type { Block } from '@/types/blocks';
import { blockRegistry } from './registry';

interface BlockRendererProps {
  blocks: Block[];
  className?: string;
}

export default function BlockRenderer({ blocks, className }: BlockRendererProps) {
  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const render = blockRegistry[block.type] as ((b: Block) => ReactNode) | undefined;
        if (!render) {
          console.warn(`BlockRenderer: no renderer registered for block type "${block.type}"`);
          return null;
        }
        return <div key={index}>{render(block)}</div>;
      })}
    </div>
  );
}
