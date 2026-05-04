<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Auth;

class ImageUploadController extends Controller
{
    /**
     * Handle the image upload for the editor.
     */
    public function store(Request $request)
    {
        ini_set('memory_limit', '1G');
        ini_set('max_execution_time', '600');

        $request->validate([
            'image' => 'required|image|max:262144',
        ]);

        $file = $request->file('image');
        $filename = time() . '_' . $file->getClientOriginalName();

        $file->storeAs('masters', $filename, 'local');

        $manager = new ImageManager(new Driver());
        $image = $manager->read($file);
        $image->scale(width: 1200);
        $encoded = $image->toJpeg(80);

        $proxyPath = 'editor-proxies/' . pathinfo($filename, PATHINFO_FILENAME) . '.jpg';

        Storage::disk('public')->put($proxyPath, (string) $encoded);

        return response()->json([
            'url' => asset('storage/' . $proxyPath),
            'master_id' => $filename
        ]);
    }
}
