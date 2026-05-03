import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/**
 * Cloudflare R2 存储客户端
 * R2 与 S3 API 兼容，使用 @aws-sdk/client-s3
 */

// R2 客户端（服务端单例）
let r2Client: S3Client | null = null

/**
 * 获取 R2 客户端实例
 */
export function getR2Client(): S3Client {
  if (!r2Client) {
    const accountId = process.env.R2_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('R2 环境变量未配置: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY')
    }

    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  return r2Client
}

/**
 * 获取存储桶名称
 */
export function getBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME
  if (!bucket) {
    throw new Error('R2_BUCKET_NAME 环境变量未配置')
  }
  return bucket
}

/**
 * 生成上传签名链接
 * @param key 文件存储路径（如 generations/abc123.png）
 * @param contentType 文件 MIME 类型
 * @param expiresIn 有效期（秒），默认 1 小时
 */
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const client = getR2Client()
  const bucket = getBucketName()

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })

  const signedUrl = await getSignedUrl(client, command, { expiresIn })
  return signedUrl
}

/**
 * 直接上传服务端生成的媒体文件到 R2
 */
export async function uploadBufferToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  const client = getR2Client()
  const bucket = getBucketName()

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  })

  await client.send(command)
}

/**
 * 生成下载签名链接
 * @param key 文件存储路径
 * @param expiresIn 有效期（秒），默认 24 小时
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn = 86400,
  responseContentDisposition?: string
): Promise<string> {
  const client = getR2Client()
  const bucket = getBucketName()

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: responseContentDisposition,
  })

  const signedUrl = await getSignedUrl(client, command, { expiresIn })
  return signedUrl
}

/**
 * 生成唯一文件路径
 * @param userId 用户 ID
 * @param filename 原始文件名
 * @param type 文件类型（image/video）
 */
export function generateFilePath(
  userId: string,
  filename: string,
  type: 'image' | 'video'
): string {
  const timestamp = Date.now()
  const ext = filename.split('.').pop() || ''
  const random = Math.random().toString(36).substring(2, 8)
  const folder = type === 'image' ? 'generations' : 'videos'

  return `${folder}/${userId}/${timestamp}-${random}.${ext}`
}
