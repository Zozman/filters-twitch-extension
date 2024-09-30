// Based on https://github.com/shoelace-style/shoelace/blob/next/src/internal/drag.ts

interface DragOptions {
    /** Callback that runs as dragging occurs. */
    onMove: (x: number, y: number) => void;
    /** Callback that runs when dragging stops. */
    onStop: () => void;
    /** Callback that runs when the pointer leaves. */
    onLeave: (x: number, y: number) => void;
    /**
     * When an initial event is passed, the first drag will be triggered immediately using the coordinates therein. This
     * is useful when the drag is initiated by a mousedown/touchstart event but you want the initial "click" to activate
     * a drag (e.g. positioning a handle initially at the click target).
     */
    initialEvent: PointerEvent;
  }
  
  /** Begins listening for dragging. */
  export function drag(container: HTMLElement, options?: Partial<DragOptions>) {
    function getXandY(pointerEvent: PointerEvent) {
      const dims = container.getBoundingClientRect();
      const defaultView = container.ownerDocument.defaultView!;
      const offsetX = dims.left + defaultView.scrollX;
      const offsetY = dims.top + defaultView.scrollY;
      const x = pointerEvent.pageX - offsetX;
      const y = pointerEvent.pageY - offsetY;
      return {x, y};
    }

    function move(pointerEvent: PointerEvent) {
      const {x, y} = getXandY(pointerEvent);
  
      if (options?.onMove) {
        options.onMove(x, y);
      }
    }
  
    function stop() {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', stop);
      document.removeEventListener('pointerleave', leave)
  
      if (options?.onStop) {
        options.onStop();
      }
    }

    function leave(pointerEvent: PointerEvent) {
      const {x, y} = getXandY(pointerEvent);

      if (options?.onLeave) {
        options.onLeave(x, y);
      }
    }
  
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerup', stop);
    document.addEventListener('pointerleave', leave, { passive: true })
  
    // If an initial event is set, trigger the first drag immediately
    if (options?.initialEvent instanceof PointerEvent) {
      move(options.initialEvent);
    }
  }