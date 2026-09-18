<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Practitioner;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    private function getDaysRange(?string $startDay, ?string $endDay): array
    {
        $daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
        $start = $startDay ?: "Senin";
        $end = $endDay ?: "Jumat";

        $startIndex = array_search($start, $daysOfWeek);
        $endIndex = array_search($end, $daysOfWeek);

        if ($startIndex === false || $endIndex === false) {
            return [$start, $end];
        }

        if ($startIndex <= $endIndex) {
            return array_slice($daysOfWeek, $startIndex, $endIndex - $startIndex + 1);
        } else {
            return array_merge(
                array_slice($daysOfWeek, $startIndex),
                array_slice($daysOfWeek, 0, $endIndex + 1)
            );
        }
    }

    private function formatDoctor(Practitioner $doc)
    {
        $startDay = $doc->start_day ?: 'Senin';
        $endDay = $doc->end_day ?: 'Jumat';
        $daysList = $this->getDaysRange($startDay, $endDay);
        $displayDays = $startDay === $endDay ? $startDay : "{$startDay} - {$endDay}";

        return [
            'id' => $doc->id,
            'doctor' => $doc->doctor,
            'role' => $doc->role,
            'image' => $doc->image,
            'startDay' => $startDay,
            'endDay' => $endDay,
            'startTime' => $doc->start_time,
            'endTime' => $doc->end_time,
            'services' => $doc->services ?? ['Konsultasi Umum'],
            'schedules' => [
                [
                    'days' => $daysList,
                    'displayDays' => $displayDays,
                    'startTime' => $doc->start_time,
                    'endTime' => $doc->end_time,
                    'services' => $doc->services ?? ['Konsultasi Umum'],
                ]
            ]
        ];
    }

    public function index()
    {
        $doctors = Practitioner::all()->map(function ($doc) {
            return $this->formatDoctor($doc);
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

        return response()->json($this->formatDoctor($doctor), 201);
    }

    public function update(Request $request, int|string $id)
    {
        $doctor = Practitioner::findOrFail($id);

        $validated = $request->validate([
            'doctor' => 'nullable|string|max:255',
            'role' => 'nullable|string',
            'image' => 'nullable|string',
            'startDay' => 'nullable|string',
            'endDay' => 'nullable|string',
            'startTime' => 'nullable|string',
            'endTime' => 'nullable|string',
            'services' => 'nullable|array',
        ]);

        $doctor->update([
            'doctor' => $validated['doctor'] ?? $doctor->doctor,
            'role' => $validated['role'] ?? $doctor->role,
            'image' => $validated['image'] ?? $doctor->image,
            'start_day' => $validated['startDay'] ?? $doctor->start_day,
            'end_day' => $validated['endDay'] ?? $doctor->end_day,
            'start_time' => $validated['startTime'] ?? $doctor->start_time,
            'end_time' => $validated['endTime'] ?? $doctor->end_time,
            'services' => $validated['services'] ?? $doctor->services,
        ]);

        return response()->json($this->formatDoctor($doctor));
    }

    public function destroy(int|string $id)
    {
        $doctor = Practitioner::findOrFail($id);
        $doctor->delete();
        return response()->json(['message' => 'Doctor deleted successfully']);
    }
}
