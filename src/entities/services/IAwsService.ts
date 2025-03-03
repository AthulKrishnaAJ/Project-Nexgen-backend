
interface IAwsService {
    uploadToS3 (fileData: Buffer | string, fileName: string, mimeType: string,): Promise<{success: boolean, key?: string}>;
    getFileFromS3(fileKey: string): Promise<Buffer | null>;
    deleteFileFromS3(fileKey: string): Promise<boolean>;
}

export default IAwsService