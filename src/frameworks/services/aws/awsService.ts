import fs from 'fs'
import s3 from './awsConnection';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import IAwsService from '../../../entities/services/IAwsService';


/**
 * @param {Buffer | string} fileData
 * @param {string} fileName
 * @param {string} mimeType
 * @returns {Promise<string>}
 */


class AwsService implements IAwsService {
    private bucketName: string

    constructor(){
        this.bucketName = process.env.S3_BUCKET_NAME!;
    }

    async uploadToS3 (fileData: Buffer | string, fileName: string, mimeType: string,): Promise<{success: boolean, key?: string}>{
        try {
            const fileKey = `uploads/${fileName}`;
        
            const params = {
                Bucket: this.bucketName,
                Key: fileKey,
                Body: typeof fileData === 'string' ? fs.createReadStream(fileData) : fileData,
                ContentType: mimeType,
            }
        
            await s3.send(new PutObjectCommand(params))
            console.log('File uploded success full: ', fileKey)
            return {success: true, key: fileKey}
        } catch (error: any) {
            console.error("Error uploading to S3 at awsService:", error.message);
            return {success: false}
        }
    }

    async getFileFromS3(fileKey: string): Promise<Buffer | null> {
        try {
            const param = {
                Bucket: this.bucketName,
                Key: fileKey
            }

            const command = new GetObjectCommand(param)
            const response = await s3.send(command)
            
            if(response.Body){
                const chunks: Uint8Array[] = []
                for await (const chunk of response.Body as any){
                    chunks.push(chunk)
                }
                return Buffer.concat(chunks)
            }
            return null
        } catch (error: any) {
            console.error("Error in getting file from s3 at awsService:", error.message);
            return null
        }
    }

    async deleteFileFromS3(fileKey: string): Promise<boolean> {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: fileKey
            }
            await s3.send(new DeleteObjectCommand(params))
            console.log(`File deleted successfully: ${fileKey}`);
            return true
        } catch (error: any) {
            console.error("Error in getting file from s3 at awsService:", error.message);
            return false
        }
    }
}

export default AwsService

