<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
            'image' => 'required|image|max:262144', // 256MB limit
        ]);

        try {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();

            $file->storeAs('masters', $filename, 'local');

            $manager = new ImageManager(new Driver());
            $image = $manager->read($file);

            $width = $image->width();
            $proxyPath = 'editor-proxies/' . pathinfo($filename, PATHINFO_FILENAME);

            if ($width <= 1200) {
                $extension = $file->getClientOriginalExtension();
                $proxyPath .= '.' . $extension;

                Storage::disk('public')->put($proxyPath, file_get_contents($file));
            } else {
                $image->scale(width: 1200);
                $encoded = $image->toJpeg(80);
                $proxyPath .= '.jpg';

                Storage::disk('public')->put($proxyPath, (string) $encoded);
            }

            return response()->json([
                'url' => asset('storage/' . $proxyPath),
                'master_id' => $filename
            ]);

        } catch (\Exception $e) {
            Log::error('Image Processing Failed: ' . $e->getMessage());

            return response()->json([
                'error' => 'Failed to process image. The file might be too large for the server hardware.'
            ], 500);
        }
    }
}
