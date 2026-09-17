import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';
import type { UploadApiOptions } from 'cloudinary';

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB Netlify payload safety limit

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null)?.trim() || 'wga-products';
    const publicId = (formData.get('publicId') as string | null)?.trim() || undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type (image or video)
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'File must be an image or video' },
        { status: 400 }
      );
    }

    // Enforce payload size limit
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `File is too large (${sizeMB} MB). Maximum allowed upload size is 4.5 MB.`,
        },
        { status: 413 }
      );
    }

    // Convert to base64 data URI for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadOptions: UploadApiOptions = {
      folder,
      resource_type: isVideo ? 'video' : 'image',
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true;
      uploadOptions.invalidate = true;
    }

    const result = await cloudinary.uploader.upload(base64, uploadOptions);

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type || (isVideo ? 'video' : 'image'),
    });
  } catch (error: unknown) {
    console.error('upload-image error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
