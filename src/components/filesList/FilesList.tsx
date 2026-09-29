import { AnimatePresence, motion } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  defaultDropAnimation,
  getClientRect,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
  type DropAnimationKeyframeResolver,
  type DropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import FileElement from './FileElement';
import SortableFileElement from './SortableFileElement';

import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch } from '@/store/hooks';
import { reorderSourceFiles } from '@/store/slices/sourceFilesSlice/sourceFilesSlice';
import { getFileFormat } from '@/lib/utils/getFileFormat';
import { getFileSize } from '@/lib/utils/getFileSize';
import { Lang } from '@/types/types';
import type { ProcessedFile, SourceFile } from '@/types/files';

type FilesListProps = {
  files: ProcessedFile[] | SourceFile[];
  sortable?: boolean;
  lang?: Lang;
};

const DROP_DURATION = 200;
const OVERLAY_SHADOW = '0px 8px 16px 0px rgba(0, 0, 0, 0.33)';

// lifted overlay card settles back to normal scale and shadow while flying into its slot.
// The animation is not cancelled on cleanup: the overlay is unmounted a frame later, and
// cancelling would pop the card back to `scale(1.05)` on top of the already visible original
const settleOverlayCard: DropAnimationSideEffects = (params) => {
  const cleanupDefault = defaultDropAnimation.sideEffects?.(params);
  const card = params.dragOverlay.node.firstElementChild;

  if (card instanceof HTMLElement) {
    card.animate(
      [
        { transform: 'scale(1.05)', boxShadow: OVERLAY_SHADOW },
        { transform: 'scale(1)', boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0)' },
      ],
      { duration: DROP_DURATION, easing: 'ease', fill: 'forwards' },
    );
  }

  return () => {
    cleanupDefault?.();
  };
};

// dnd-kit skips the drop animation (and its side effects) when first and last keyframes are equal,
// i.e. when the card is released exactly over its slot. Explicit offsets keep them distinct,
// so the card always settles instead of snapping from the lifted state
const dropKeyframes: DropAnimationKeyframeResolver = ({ transform: { initial, final } }) => [
  { transform: CSS.Transform.toString(initial), offset: 0 },
  { transform: CSS.Transform.toString(final), offset: 1 },
];

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  duration: DROP_DURATION,
  keyframes: dropKeyframes,
  sideEffects: settleOverlayCard,
};

// grid keeps moving while the container autoscrolls, so slots are re-measured on every frame.
// Overlay is measured without its lift `scale(1.05)`, otherwise the drop animation aims
// a couple of pixels off the slot and the card jumps when the overlay is swapped for it
const measuring = {
  droppable: { strategy: MeasuringStrategy.Always },
  dragOverlay: { measure: (node: HTMLElement) => getClientRect(node, { ignoreTransform: true }) },
};

// `#root` and `html` are `overflow: hidden`, yet still scrollable in code: without this dnd-kit
// autoscrolls them near the viewport edge and the whole layout creeps out from under the fixed shadows
const autoScroll = {
  canScroll: (element: Element) => {
    const { overflowX, overflowY } = getComputedStyle(element);

    return [overflowX, overflowY].some(
      (overflow) => overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay',
    );
  },
};

// dnd-kit defaults are English only and announce raw ids, so screen readers get file names
// and 1-based positions in the interface language instead
const getAccessibility = (lang: Lang, files: ProcessedFile[] | SourceFile[]) => {
  const en = lang === Lang.EN;

  const describe = (id: string | number) => {
    const index = files.findIndex((file) => file.id === id);

    return { name: files[index]?.name ?? '', position: index + 1, total: files.length };
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      const { name, position, total } = describe(active.id);

      return en
        ? `Picked up ${name}. Position ${position} of ${total}.`
        : `Файл ${name} взят. Позиция ${position} из ${total}.`;
    },
    onDragOver({ active, over }) {
      if (!over) return;

      const { name } = describe(active.id);
      const { position, total } = describe(over.id);

      return en
        ? `${name} moved to position ${position} of ${total}.`
        : `Файл ${name} перемещён на позицию ${position} из ${total}.`;
    },
    onDragEnd({ active, over }) {
      const { name } = describe(active.id);

      if (!over) return en ? `${name} dropped.` : `Файл ${name} отпущен.`;

      const { position, total } = describe(over.id);

      return en
        ? `${name} dropped at position ${position} of ${total}.`
        : `Файл ${name} перемещён на позицию ${position} из ${total}.`;
    },
    onDragCancel({ active }) {
      const { name } = describe(active.id);

      return en
        ? `Moving cancelled. ${name} returned to its position.`
        : `Перемещение отменено. Файл ${name} возвращён на место.`;
    },
  };

  const screenReaderInstructions = {
    draggable: en
      ? 'To pick up a file, press Space or Enter. Use the arrow keys to move it. Press Space again to drop it, or Escape to cancel.'
      : 'Чтобы взять файл, нажмите Пробел или Enter. Перемещайте его стрелками. Нажмите Пробел ещё раз, чтобы отпустить, или Escape для отмены.',
  };

  return { announcements, screenReaderInstructions };
};

const getElementProps = (file: ProcessedFile | SourceFile) => ({
  id: file.id,
  format: getFileFormat(file.type),
  name: file.name,
  size: getFileSize(file.size),
  downloadLink: 'downloadLink' in file ? file.downloadLink : undefined,
  souceFileLink: file.blobURL,
});

const FilesList: React.FC<FilesListProps> = memo(({ files, sortable = false, lang = Lang.EN }) => {
  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const isDragActive = activeId !== null;
  const activeFile = files.find((file) => file.id === activeId);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);

    if (!over) return;

    dispatch(reorderSourceFiles({ activeId: String(active.id), overId: String(over.id) }));
  };

  const elements = files.map((file) =>
    sortable ? (
      <SortableFileElement
        key={file.id}
        {...getElementProps(file)}
        isDragActive={isDragActive}
        hasHandle={files.length > 1}
        lang={lang}
      />
    ) : (
      <FileElement key={file.id} {...getElementProps(file)} />
    ),
  );

  if (!sortable) {
    return (
      <StyledFilesList layout layoutRoot>
        <AnimatePresence>{elements}</AnimatePresence>
      </StyledFilesList>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      measuring={measuring}
      autoScroll={autoScroll}
      accessibility={getAccessibility(lang, files)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={files.map((file) => file.id)} strategy={rectSortingStrategy}>
        <StyledFilesList layout layoutRoot>
          <AnimatePresence>{elements}</AnimatePresence>
        </StyledFilesList>
      </SortableContext>

      {isDragActive && <DragActiveGlobalStyle />}

      {/* portal to body: fixed overlay must not be affected by transformed ancestors */}
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeFile && (
            <StyledOverlayCard aria-hidden>
              <FileElement {...getElementProps(activeFile)} isDragActive isOverlay />
            </StyledOverlayCard>
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
});

// smooth scrolling fights the per-frame scroll steps of dnd-kit autoscroll, so it is off while dragging
const DragActiveGlobalStyle = createGlobalStyle`
  * {
    cursor: grabbing !important;
    scroll-behavior: auto !important;
  }
`;

const StyledOverlayCard = styled.div`
  width: fit-content;
  transform: scale(1.05);
  border-radius: 1rem;
  box-shadow: ${OVERLAY_SHADOW};
  pointer-events: none;

  @media (max-width: 768px) {
    border-radius: 0.75rem;
  }
`;

const StyledFilesList = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, 6rem);
  grid-auto-rows: 6rem;
  align-items: start;
  justify-content: center;
  gap: 1rem;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 1rem;
    grid-template-columns: repeat(auto-fit, 4rem);
    grid-auto-rows: 4rem;
    gap: 0.5rem;
  }
`;

export default FilesList;
