import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

import FileElement from './FileElement';
import SortableFileElement from './SortableFileElement';

import { memo } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { reorderSourceFiles } from '@/store/slices/sourceFilesSlice/sourceFilesSlice';
import { getFileFormat } from '@/lib/utils/getFileFormat';
import { getFileSize } from '@/lib/utils/getFileSize';
import type { ProcessedFile, SourceFile } from '@/types/files';

type FilesListProps = {
  files: ProcessedFile[] | SourceFile[];
  sortable?: boolean;
};

const FilesList: React.FC<FilesListProps> = memo(({ files, sortable = false }) => {
  const dispatch = useAppDispatch();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    dispatch(reorderSourceFiles({ activeId: String(active.id), overId: String(over.id) }));
  };

  const elements = files.map((file) => {
    const props = {
      id: file.id,
      format: getFileFormat(file.type),
      name: file.name,
      size: getFileSize(file.size),
      downloadLink: 'downloadLink' in file ? file.downloadLink : undefined,
      souceFileLink: file.blobURL,
    };

    return sortable ? (
      <SortableFileElement key={file.id} {...props} />
    ) : (
      <FileElement key={file.id} {...props} />
    );
  });

  if (!sortable) {
    return (
      <StyledFilesList layout layoutRoot>
        <AnimatePresence>{elements}</AnimatePresence>
      </StyledFilesList>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={files.map((file) => file.id)} strategy={rectSortingStrategy}>
        <StyledFilesList>
          <AnimatePresence>{elements}</AnimatePresence>
        </StyledFilesList>
      </SortableContext>
    </DndContext>
  );
});

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
