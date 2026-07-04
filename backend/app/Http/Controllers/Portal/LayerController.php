<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class LayerController extends Controller
{
    public function admin()
    {
        return $this->serveGeojson('admin-karangasem.geojson', 'admin-tegalwungu.geojson');
    }

    public function bencana()
    {
        return $this->serveGeojson('bencana.geojson');
    }

    public function fasilitas()
    {
        return $this->serveGeojson('fasilitas.geojson');
    }

    /**
     * Gabungkan satu atau dua file GeoJSON menjadi satu FeatureCollection.
     */
    private function serveGeojson(string ...$filenames): \Illuminate\Http\JsonResponse
    {
        $features = [];

        foreach ($filenames as $filename) {
            $path = 'geojson/' . $filename;

            if (! Storage::disk('public')->exists($path)) {
                continue;
            }

            $content = json_decode(Storage::disk('public')->get($path), true);

            if (isset($content['features'])) {
                $features = array_merge($features, $content['features']);
            }
        }

        return response()->json([
            'type'     => 'FeatureCollection',
            'features' => $features,
        ]);
    }
}
