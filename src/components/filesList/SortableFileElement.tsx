import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import FileElement, { type FileElementProps } from './FileElement';

type SortableFileElementProps = Omit<FileElementProps, 'dragHandleProps'>;

const SortableFileElement: React.FC<SortableFileElementProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

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
        dragHandleProps={{ ...attributes, ...listeners, ref: setActivatorNodeRef }}
      />
    </div>
  );
};

export default SortableFileElement;
