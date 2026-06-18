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

            // 1. Always preserve the exact original file in the private masters storage
            $file->storeAs('masters', $filename, 'local');

            $proxyPath = 'editor-proxies/' . pathinfo($filename, PATHINFO_FILENAME);

            // 2. SVG Architectural Short-Circuit
            if ($extension === 'svg') {
                $proxyPath .= '.svg';

                // Directly move a pristine copy of the SVG into public storage
                Storage::disk('public')->put($proxyPath, file_get_contents($file));
            } else {
                // 3. Native Processing for all Modern Raster Formats
                $imagick = new Imagick($file->getRealPath());

                // Handle multi-frame images safely (GIFs, animated WebPs)
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

                    // Force downscaled large images to PNG to guarantee transparency support
                    $imagick->setImageFormat('png');
                    $proxyPath .= '.png';
                    $outputContent = $imagick->getImageBlob();
                } else {
                    // Small modern raster formats keep their original formatting and footprint
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
