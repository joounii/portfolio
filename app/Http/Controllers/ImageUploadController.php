<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Imagick;

class ImageUploadController extends Controller
{
    /**
     * Handle the image upload for the editor.
     */
    public function store(Request $request)
    {
        ini_set('memory_limit', '2G');
        ini_set('max_execution_time', '600');

        $request->validate([
            'image' => 'required|mimes:jpeg,png,jpg,gif,webp,avif,svg|max:262144', // 256MB limit
        ]);

        try {
            $file = $request->file('image');
            $extension = strtolower($file->getClientOriginalExtension());
            $filename = time() . '_' . $file->getClientOriginalName();

            $file->storeAs('masters', $filename, 'local');

            $proxyPath = 'editor-proxies/' . pathinfo($filename, PATHINFO_FILENAME);

            if ($extension === 'svg') {
                $proxyPath .= '.svg';

                Storage::disk('public')->put($proxyPath, file_get_contents($file));
            } else {
                $imagick = new Imagick($file->getRealPath());

                if ($imagick->getNumberImages() > 1) {
                    $imagick = $imagick->coalesceImages();
                    $imagick->iterator();
                }

                $width = $imagick->getImageWidth();
                $height = $imagick->getImageHeight();

                if ($width > 1200) {
                    $newWidth = 1200;
                    $newHeight = (int) (($height / $width) * 1200);
                    $imagick->resizeImage($newWidth, $newHeight, Imagick::FILTER_LANCZOS, 1);

                    $imagick->setImageFormat('png');
                    $proxyPath .= '.png';
                    $outputContent = $imagick->getImageBlob();
                } else {
                    $proxyPath .= '.' . $extension;
                    $outputContent = file_get_contents($file);
                }

                Storage::disk('public')->put($proxyPath, $outputContent);

                $imagick->clear();
                $imagick->destroy();
            }

            return response()->json([
                'url' => asset('storage/' . $proxyPath),
                'master_id' => $filename
            ]);

        } catch (\Exception $e) {
            Log::error('Image Processing Failed: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to process image. The file might be corrupted or incompatible.'
            ], 500);
        }
    }
}
