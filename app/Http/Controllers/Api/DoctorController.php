<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Practitioner;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = Practitioner::all()->map(function ($doc) {
            return [
                'id' => $doc->id,
                'doctor' => $doc->doctor,
                'role' => $doc->role,
                'image' => $doc->image,
                'startDay' => $doc->start_day,
                'endDay' => $doc->end_day,
                'startTime' => $doc->start_time,
                'endTime' => $doc->end_time,
                'schedules' => [
                    [
                        'days' => [$doc->start_day, $doc->end_day],
                        'displayDays' => $doc->start_day === $doc->end_day ? $doc->start_day : "{$doc->start_day} - {$doc->end_day}",
                        'startTime' => $doc->start_time,
                        'endTime' => $doc->end_time,
                        'services' => $doc->services ?? ['Konsultasi Umum'],
                    ]
                ]
            ];
        });

        return response()->json($doctors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor' => 'required|string|max:255',
            'role' => 'nullable|string',
            'image' => 'nullable|string',
            'startDay' => 'nullable|string',
            'endDay' => 'nullable|string',
            'startTime' => 'nullable|string',
            'endTime' => 'nullable|string',
            'services' => 'nullable|array',
        ]);

        $doctor = Practitioner::create([
            'doctor' => $validated['doctor'],
            'role' => $validated['role'] ?? 'Praktisi Medis',
            'image' => $validated['image'] ?? '/img/landingPage/dummyDr.png',
            'start_day' => $validated['startDay'] ?? 'Senin',
            'end_day' => $validated['endDay'] ?? 'Jumat',
            'start_time' => $validated['startTime'] ?? '08:00',
            'end_time' => $validated['endTime'] ?? '14:00',
            'services' => $validated['services'] ?? ['Konsultasi Umum'],
        ]);

        return response()->json($doctor, 201);
    }

    public function update(Request $request, $id)
    {
        $doctor = Practitioner::findOrFail($id);

        $validated = $request->validate([
            'doctor' => 'required|string|max:255',
            'role' => 'nullable|string',
            'image' => 'nullable|string',
            'startDay' => 'nullable|string',
            'endDay' => 'nullable|string',
            'startTime' => 'nullable|string',
            'endTime' => 'nullable|string',
            'services' => 'nullable|array',
        ]);

        $doctor->update([
            'doctor' => $validated['doctor'],
            'role' => $validated['role'] ?? $doctor->role,
            'image' => $validated['image'] ?? $doctor->image,
            'start_day' => $validated['startDay'] ?? $doctor->start_day,
            'end_day' => $validated['endDay'] ?? $doctor->end_day,
            'start_time' => $validated['startTime'] ?? $doctor->start_time,
            'end_time' => $validated['endTime'] ?? $doctor->end_time,
            'services' => $validated['services'] ?? $doctor->services,
        ]);

        return response()->json($doctor);
    }

    public function destroy($id)
    {
        $doctor = Practitioner::findOrFail($id);
        $doctor->delete();
        return response()->json(['message' => 'Doctor deleted successfully']);
    }
}
