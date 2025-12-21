import { IndexDBHelper } from "./IndexDBHelper";

const PROJECT_FILE_PATH = "resources.json";

export class ProjectFolder {
    constructor(private handle: FileSystemDirectoryHandle) {
    }

    public getFileHandle(name: string) {
        return this.handle.getFileHandle(name);
    }

    public async getFiles() {
        return this.handle.entries();
    }

    public async load() {
        let handle = await this.getProjectFileHandle();
        let file = await handle.getFile();
        
        let text = await file.text();

        return text;
    }

    public async save(content: string) {
        let handle = await this.getProjectFileHandle();
        let writer = await (handle as any).createWritable();
    
        writer.write(content);

        writer.close();
    }

    private async getProjectFileHandle(): Promise<FileSystemFileHandle>{
        let fileHandle = await this.handle.getFileHandle(PROJECT_FILE_PATH, { create: true });

        return fileHandle;
    }

    // ================================================================= //
    // File picker
    // ================================================================= //
    public static async showPicker(): Promise<ProjectFolder|undefined> {
        try{
            let handle = await (window as any).showDirectoryPicker({
                mode: 'readwrite',
            });

            let folder = new ProjectFolder(handle);

            return folder;
        }
        catch(e){
            return undefined;
        }
    }

    // ================================================================= //
    // Storing and recovering index db stuff
    // ================================================================= //
    public static async getStoredProjectFolder(): Promise<ProjectFolder|undefined> {
        try{
            let handle = await IndexDBHelper.get("projectHandle");

            if(!(handle instanceof FileSystemDirectoryHandle)){
                console.error("Cannot restore project.. :(");
                throw new Error("Cannot restore...");
            }

            let permissionResult: string = await (handle as any).queryPermission({ mode: "readwrite"});
            
            if(permissionResult !== "granted"){
                permissionResult = await (handle as any).requestPermission({ mode: "readwrite"});

                if(permissionResult !== "granted") {
                    console.error("Oh no we don't have permission! " + permissionResult);
                }
            }

            let folder = new ProjectFolder(handle);

            return folder;
        }
        catch(e){
            return undefined;
        }
    }

    public static async storeProjectFolder(folder: ProjectFolder): Promise<void> {
        await IndexDBHelper.set("projectHandle", folder.handle);
    }
}