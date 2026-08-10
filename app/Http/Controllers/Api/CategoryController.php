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
            return [
                'id' => $cat->id,
                'title' => $cat->title,
                'list' => $cat->services->pluck('name')->toArray(),
            ];
        });

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'list' => 'nullable|array',
        ]);

        $category = ServiceCategory::create(['title' => $validated['title']]);

        if (!empty($validated['list'])) {
            foreach ($validated['list'] as $serviceName) {
                Service::create([
                    'category_id' => $category->id,
                    'name' => $serviceName,
                ]);
            }
        }

        return response()->json([
            'id' => $category->id,
            'title' => $category->title,
            'list' => $validated['list'] ?? [],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = ServiceCategory::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'list' => 'nullable|array',
        ]);

        $category->update(['title' => $validated['title']]);

        // Sync services
        Service::where('category_id', $category->id)->delete();
        if (!empty($validated['list'])) {
            foreach ($validated['list'] as $serviceName) {
                Service::create([
                    'category_id' => $category->id,
                    'name' => $serviceName,
                ]);
            }
        }

        return response()->json([
            'id' => $category->id,
            'title' => $category->title,
            'list' => $validated['list'] ?? [],
        ]);
    }

    public function destroy($id)
    {
        $category = ServiceCategory::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
