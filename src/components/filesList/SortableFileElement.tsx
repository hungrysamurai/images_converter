import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import FileElement, { type FileElementProps } from './FileElement';

type SortableFileElementProps = Omit<FileElementProps, 'dragHandleProps'> & {
  // a lone file has nothing to swap with, so it gets no handle and can't be dragged
  hasHandle: boolean;
};

const SortableFileElement: React.FC<SortableFileElementProps> = ({ hasHandle, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id, disabled: !hasHandle });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : undefined,
      }}
    >
      <FileElement
        {...props}
        dragHandleProps={
          hasHandle ? { ...attributes, ...listeners, ref: setActivatorNodeRef } : undefined
        }
      />
    </div>
  );
};

export default SortableFileElement;
