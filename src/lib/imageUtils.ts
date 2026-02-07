/**
 * Compresses an image to under 50KB using Canvas
 * @param base64Str Original base64 string
 * @param targetSizeKB Target size in KB (default 45KB to stay safe)
 * @returns Compressed base64 string
 */
export async function compressImage(base64Str: string, targetSizeKB: number = 45): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Max dimensions to speed up and reduce size (drastic reduction to 300px)
            const MAX_DIM = 300;
            if (width > height) {
                if (width > MAX_DIM) {
                    height *= MAX_DIM / width;
                    width = MAX_DIM;
                }
            } else {
                if (height > MAX_DIM) {
                    width *= MAX_DIM / height;
                    height = MAX_DIM;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            let quality = 0.5;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);

            // Binary search or iterative reduction for size
            // (base64 is ~4/3 larger than binary)
            const targetSize = targetSizeKB * 1024 * 1.33;

            while (dataUrl.length > targetSize && quality > 0.1) {
                quality -= 0.1;
                dataUrl = canvas.toDataURL('image/jpeg', quality);
            }

            // If still too large, resize again
            if (dataUrl.length > targetSize) {
                const scaleFactor = 0.7;
                canvas.width *= scaleFactor;
                canvas.height *= scaleFactor;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                dataUrl = canvas.toDataURL('image/jpeg', 0.5);
            }

            console.log('Final image size (base64 length):', dataUrl.length);
            resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
    });
}
