declare module "jszip-utils" {

 type JSZipUtilsCallback = (err: Error, data: ArrayBuffer | string) => void;

 class JSZipUtils {
  static getBinaryContent: (path: string, callback: JSZipUtilsCallback) => void
 }

 export = JSZipUtils
}