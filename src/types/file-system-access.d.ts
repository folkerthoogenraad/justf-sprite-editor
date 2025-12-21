export {};

declare global {
  interface Window {
    showOpenFilePicker(
      options?: OpenFilePickerOptions
    ): Promise<FileSystemFileHandle[]>;
  }
  interface FileSystemDirectoryHandle extends FileSystemHandle {
    entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]>;
  }
}
