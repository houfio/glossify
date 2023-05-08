import { useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';

export function useDropped(id: string) {
  const [dropped, setDropped] = useState(false);

  useDndMonitor({
    onDragEnd(e) {
      if (e.active.id === id && e.over) {
        setDropped(true);
      }
    }
  });

  return dropped;
}
