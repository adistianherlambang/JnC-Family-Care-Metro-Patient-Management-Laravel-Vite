<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use App\Models\Service;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = ServiceCategory::with('services')->get()->map(function ($cat) {
            $serviceNames = $cat->services->pluck('name')->toArray();
            return [
                'id' => $cat->id,
                'title' => $cat->title,
                'list' => $serviceNames,
                'services' => $serviceNames,
            ];
        });

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'list' => 'nullable|array',
            'services' => 'nullable|array',
        ]);

        $serviceList = $validated['list'] ?? $validated['services'] ?? [];

        $category = ServiceCategory::create(['title' => $validated['title']]);

        if (!empty($serviceList)) {
            foreach ($serviceList as $serviceName) {
                Service::create([
                    'category_id' => $category->id,
                    'name' => $serviceName,
                ]);
            }
        }

        return response()->json([
            'id' => $category->id,
            'title' => $category->title,
            'list' => $serviceList,
            'services' => $serviceList,
        ], 201);
    }

    public function update(Request $request, int|string $id)
    {
        $category = ServiceCategory::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'list' => 'nullable|array',
            'services' => 'nullable|array',
        ]);

        $serviceList = $validated['list'] ?? $validated['services'] ?? [];

        $category->update(['title' => $validated['title']]);

        Service::where('category_id', $category->id)->delete();
        if (!empty($serviceList)) {
            foreach ($serviceList as $serviceName) {
                Service::create([
                    'category_id' => $category->id,
                    'name' => $serviceName,
                ]);
            }
        }

        return response()->json([
            'id' => $category->id,
            'title' => $category->title,
            'list' => $serviceList,
            'services' => $serviceList,
        ]);
    }

    public function destroy(int|string $id)
    {
        $category = ServiceCategory::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}