import { AppDispatch } from '../../store/store';
import { MIMETypes, OutputFileFormatsNames } from '../../types/types';
import WorkerPool from '../utils/WorkerPool/WorkerPool';

export default class Converter {
  collection: MergeCollection = [];

  workerPool: WorkerPool;
  processTasks: Promise<void>[] = [];
  constructor(
    public outputSettings: OutputConversionSettings,
    public activeTargetFormatName: OutputFileFormatsNames,
    public inputSettings: {
      [OutputFileFormatsNames.PDF]: PDFInputSettings;
    },
    public dispatch: AppDispatch,
    public mergeToOne: boolean,
  ) {
    this.workerPool = new WorkerPool();
  }

  public async convert(sourceFiles: SourceFile[]): Promise<void> {
    for (const source of sourceFiles) {
      const task = this.processFile(source);
      this.processTasks.push(task);
    }

    if (!this.mergeToOne) {
      await Promise.allSettled(this.processTasks);
    }
  }

  private async processFile(file: SourceFile): Promise<void> {
    const { blobURL } = file;

    switch (file.type) {
      // case MIMETypes.JPG:
      // case MIMETypes.PNG:
      // case MIMETypes.WEBP:
      // case MIMETypes.BMP:
      // case MIMETypes.SVG:
      case MIMETypes.HEIC:
        {
          await this.convertHEIC(blobURL);
        }
        break;

      case MIMETypes.TIFF:
      case MIMETypes.GIF:
      case MIMETypes.PDF:
        {
          console.log(file);
        }
        break;
    }
  }

  private async convertHEIC(blobURL: string): Promise<void> {
    const file = await fetch(blobURL);
    const arrayBuffer = await file.arrayBuffer();

    const blob = await this.workerPool.addWork({
      type: 'decode_heic',
      payload: arrayBuffer,
      outputSettings: this.outputSettings,
      targetFormatName: this.activeTargetFormatName,
    });

    console.log(blob);
  }
}
