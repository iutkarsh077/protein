import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../helpers/s3-config.js";

const getPresignedUrl = async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        const key = `uploads/${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        })

        const uploadUrl = await getSignedUrl(s3, command, {
            expiresIn: 60,
        });


        return res.json({
            uploadUrl,
            key,
            message: "Successfully got the url",
            status: true
        });
    } catch (error) {
        console.log(error)
        return res.json({message: "Failed to get the url", status: false}) 
    }
} 

export default getPresignedUrl;