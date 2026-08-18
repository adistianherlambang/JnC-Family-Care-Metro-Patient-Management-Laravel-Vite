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
            'readTime' => 'nullable|string',
            'date' => 'nullable|string',
        ]);

        $readTime = $request->input('read_time') ?? $request->input('readTime') ?? '3 min read';

        $news = News::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'summary' => $validated['summary'],
            'content' => $request->input('content'),
            'author' => $request->input('author', 'Tim Redaksi Klinik'),
            'image' => $request->input('image'),
            'read_time' => $readTime,
            'date' => $request->input('date', date('d') . ' Agustus 2026'),
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
            'readTime' => 'nullable|string',
            'date' => 'nullable|string',
        ]);

        $readTime = $request->input('read_time') ?? $request->input('readTime') ?? $news->read_time;

        $news->update([
            'title' => $request->input('title', $news->title),
            'category' => $request->input('category', $news->category),
            'summary' => $request->input('summary', $news->summary),
            'content' => $request->input('content', $news->content),
            'author' => $request->input('author', $news->author),
            'image' => $request->input('image', $news->image),
            'read_time' => $readTime,
            'date' => $request->input('date', $news->date),
        ]);

        return response()->json($news);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        $news->delete();
        return response()->json(['message' => 'News deleted successfully']);
    }
}
