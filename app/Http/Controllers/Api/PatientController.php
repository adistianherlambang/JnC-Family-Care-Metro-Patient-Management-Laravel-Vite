<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::all()->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'username' => $p->username,
                'password' => $p->password,
                'noRM' => $p->no_rm,
                'phone' => $p->phone,
                'email' => $p->email,
                'noBpjs' => $p->no_bpjs,
                'address' => $p->address,
            ];
        });

        return response()->json($patients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:patients,username',
            'password' => 'nullable|string',
            'noRM' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'noBpjs' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $patient = Patient::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => $validated['password'] ?? 'user123',
            'no_rm' => $validated['noRM'] ?? ('RM-' . date('Y') . '-' . str_pad(Patient::count() + 1, 5, '0', STR_PAD_LEFT)),
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'no_bpjs' => $validated['noBpjs'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        return response()->json([
            'id' => $patient->id,
            'name' => $patient->name,
            'username' => $patient->username,
            'password' => $patient->password,
            'noRM' => $patient->no_rm,
            'phone' => $patient->phone,
            'email' => $patient->email,
            'noBpjs' => $patient->no_bpjs,
            'address' => $patient->address,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'username' => 'nullable|string',
            'password' => 'nullable|string',
            'noRM' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'noBpjs' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        if (isset($validated['name'])) $patient->name = $validated['name'];
        if (isset($validated['username'])) $patient->username = $validated['username'];
        if (isset($validated['password'])) $patient->password = $validated['password'];
        if (isset($validated['noRM'])) $patient->no_rm = $validated['noRM'];
        if (isset($validated['phone'])) $patient->phone = $validated['phone'];
        if (isset($validated['email'])) $patient->email = $validated['email'];
        if (isset($validated['noBpjs'])) $patient->no_bpjs = $validated['noBpjs'];
        if (isset($validated['address'])) $patient->address = $validated['address'];

        $patient->save();

        return response()->json([
            'id' => $patient->id,
            'name' => $patient->name,
            'username' => $patient->username,
            'password' => $patient->password,
            'noRM' => $patient->no_rm,
            'phone' => $patient->phone,
            'email' => $patient->email,
            'noBpjs' => $patient->no_bpjs,
            'address' => $patient->address,
        ]);
    }

    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully']);
    }
}
