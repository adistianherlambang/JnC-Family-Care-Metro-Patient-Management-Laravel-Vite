<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index()
    {
        return response()->json(News::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'category' => 'required|string',
            'summary' => 'required|string',
            'content' => 'nullable|string',
            'author' => 'nullable|string',
            'image' => 'nullable|string',
            'read_time' => 'nullable|string',
            'date' => 'nullable|string',
        ]);

        $news = News::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'summary' => $validated['summary'],
            'content' => $validated['content'] ?? null,
            'author' => $validated['author'] ?? 'Tim Redaksi Klinik',
            'image' => $validated['image'] ?? null,
            'read_time' => $validated['read_time'] ?? '3 min read',
            'date' => $validated['date'] ?? (date('d') . ' Agustus 2026'),
        ]);

        return response()->json($news, 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string',
            'category' => 'required|string',
            'summary' => 'required|string',
            'content' => 'nullable|string',
            'author' => 'nullable|string',
            'image' => 'nullable|string',
            'read_time' => 'nullable|string',
        ]);

        $news->update($validated);

        return response()->json($news);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $news->delete();
        return response()->json(['message' => 'News deleted successfully']);
    }
}
