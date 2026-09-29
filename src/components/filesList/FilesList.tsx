import { AnimatePresence, motion } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';

import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  defaultDropAnimation,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
  type DropAnimationSideEffects,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

import FileElement from './FileElement';
import SortableFileElement from './SortableFileElement';

import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch } from '@/store/hooks';
import { reorderSourceFiles } from '@/store/slices/sourceFilesSlice/sourceFilesSlice';
import { getFileFormat } from '@/lib/utils/getFileFormat';
import { getFileSize } from '@/lib/utils/getFileSize';
import type { ProcessedFile, SourceFile } from '@/types/files';

type FilesListProps = {
  files: ProcessedFile[] | SourceFile[];
  sortable?: boolean;
};

const DROP_DURATION = 200;
const OVERLAY_SHADOW = '0px 8px 16px 0px rgba(0, 0, 0, 0.33)';

// lifted overlay card settles back to normal scale and shadow while flying into its slot
const settleOverlayCard: DropAnimationSideEffects = (params) => {
  const cleanupDefault = defaultDropAnimation.sideEffects?.(params);
  const card = params.dragOverlay.node.firstElementChild;

  const animation =
    card instanceof HTMLElement
      ? card.animate(
          [
            { transform: 'scale(1.05)', boxShadow: OVERLAY_SHADOW },
            { transform: 'scale(1)', boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0)' },
          ],
          { duration: DROP_DURATION, easing: 'ease', fill: 'forwards' },
        )
      : null;

  return () => {
    animation?.cancel();
    cleanupDefault?.();
  };
};

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  duration: DROP_DURATION,
  sideEffects: settleOverlayCard,
};

// grid keeps moving while the container autoscrolls, so slots are re-measured on every frame
const measuring = {
  droppable: { strategy: MeasuringStrategy.Always },
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

const getElementProps = (file: ProcessedFile | SourceFile) => ({
  id: file.id,
  format: getFileFormat(file.type),
  name: file.name,
  size: getFileSize(file.size),
  downloadLink: 'downloadLink' in file ? file.downloadLink : undefined,
  souceFileLink: file.blobURL,
});

const FilesList: React.FC<FilesListProps> = memo(({ files, sortable = false }) => {
  const dispatch = useAppDispatch();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

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
      <SortableFileElement key={file.id} {...getElementProps(file)} isDragActive={isDragActive} />
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
            <StyledOverlayCard>
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
