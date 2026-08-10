<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    public function index()
    {
        $queues = Appointment::all()->map(function ($q) {
            return [
                'id' => $q->id,
                'queueNumber' => $q->queue_number,
                'patientName' => $q->patient_name,
                'doctor' => $q->doctor_name,
                'service' => $q->service_name,
                'date' => $q->date,
                'time' => $q->time,
                'status' => $q->status,
            ];
        });

        return response()->json($queues);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patientName' => 'required|string|max:255',
            'doctor' => 'required|string',
            'service' => 'required|string',
            'date' => 'nullable|string',
            'time' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $count = Appointment::count() + 1;
        $queueNumber = 'A-0' . rand(10, 99);

        $queue = Appointment::create([
            'queue_number' => $queueNumber,
            'patient_name' => $validated['patientName'],
            'doctor_name' => $validated['doctor'],
            'service_name' => $validated['service'],
            'date' => $validated['date'] ?? 'Hari Ini',
            'time' => $validated['time'] ?? '09:00 WIB',
            'status' => $validated['status'] ?? 'Menunggu Antrean',
        ]);

        return response()->json([
            'id' => $queue->id,
            'queueNumber' => $queue->queue_number,
            'patientName' => $queue->patient_name,
            'doctor' => $queue->doctor_name,
            'service' => $queue->service_name,
            'date' => $queue->date,
            'time' => $queue->time,
            'status' => $queue->status,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $queue = Appointment::findOrFail($id);

        $validated = $request->validate([
            'patientName' => 'sometimes|required|string|max:255',
            'doctor' => 'sometimes|required|string',
            'service' => 'sometimes|required|string',
            'date' => 'nullable|string',
            'time' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        if (isset($validated['patientName'])) $queue->patient_name = $validated['patientName'];
        if (isset($validated['doctor'])) $queue->doctor_name = $validated['doctor'];
        if (isset($validated['service'])) $queue->service_name = $validated['service'];
        if (isset($validated['date'])) $queue->date = $validated['date'];
        if (isset($validated['time'])) $queue->time = $validated['time'];
        if (isset($validated['status'])) $queue->status = $validated['status'];

        $queue->save();

        return response()->json([
            'id' => $queue->id,
            'queueNumber' => $queue->queue_number,
            'patientName' => $queue->patient_name,
            'doctor' => $queue->doctor_name,
            'service' => $queue->service_name,
            'date' => $queue->date,
            'time' => $queue->time,
            'status' => $queue->status,
        ]);
    }

    public function destroy($id)
    {
        $queue = Appointment::findOrFail($id);
        $queue->delete();
        return response()->json(['message' => 'Queue deleted successfully']);
    }
}
