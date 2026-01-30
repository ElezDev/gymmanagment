<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Client;
use App\Models\Membership;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['client.user', 'membership.membershipPlan', 'receivedBy']);

        // Filtros
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('client.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('payment_number', 'like', "%{$search}%");
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('payment_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('payment_date', '<=', $request->date_to);
        }

        $payments = $query->latest('payment_date')->paginate(20);

        // Estadísticas
        $stats = [
            'total_today' => Payment::completed()
                ->whereDate('payment_date', today())
                ->sum('amount'),
            'total_month' => Payment::completed()
                ->currentMonth()
                ->sum('amount'),
            'count_today' => Payment::completed()
                ->whereDate('payment_date', today())
                ->count(),
            'count_month' => Payment::completed()
                ->currentMonth()
                ->count(),
        ];

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['search', 'payment_method', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function create()
    {
        $clients = Client::with('user')->get();

        return Inertia::render('payments/create', [
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'membership_id' => 'nullable|exists:memberships,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,transfer,check,online',
            'type' => 'required|in:membership,product,service,penalty,other',
            'description' => 'required|string',
            'notes' => 'nullable|string',
            'transaction_reference' => 'nullable|string',
        ]);

        Payment::create([
            ...$validated,
            'payment_number' => Payment::generatePaymentNumber(),
            'status' => 'completed',
            'received_by' => auth()->id(),
            'payment_date' => now(),
        ]);

        return redirect()->route('payments.index')
            ->with('success', 'Pago registrado exitosamente');
    }

    public function show(Payment $payment)
    {
        $payment->load(['client.user', 'membership.membershipPlan', 'receivedBy']);

        return Inertia::render('payments/show', [
            'payment' => $payment,
        ]);
    }

    public function refund(Request $request, Payment $payment)
    {
        if ($payment->status === 'refunded') {
            return back()->with('error', 'Este pago ya ha sido reembolsado');
        }

        $validated = $request->validate([
            'refund_amount' => 'required|numeric|min:0|max:' . $payment->amount,
            'refund_reason' => 'required|string',
        ]);

        $payment->update([
            'status' => 'refunded',
            'refunded_at' => now(),
            'refund_amount' => $validated['refund_amount'],
            'refund_reason' => $validated['refund_reason'],
        ]);

        return back()->with('success', 'Reembolso procesado exitosamente');
    }

    // Recibo/Factura para imprimir
    public function receipt(Payment $payment)
    {
        $payment->load(['client.user', 'membership.membershipPlan', 'receivedBy']);

        return Inertia::render('payments/receipt', [
            'payment' => $payment,
        ]);
    }

    // Reporte de pagos
    public function report(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $payments = Payment::completed()
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->with(['client.user', 'receivedBy'])
            ->get();

        $summary = [
            'total_amount' => $payments->sum('amount'),
            'total_count' => $payments->count(),
            'by_method' => $payments->groupBy('payment_method')->map->sum('amount'),
            'by_type' => $payments->groupBy('type')->map->sum('amount'),
            'by_day' => $payments->groupBy(function ($payment) {
                return $payment->payment_date->format('Y-m-d');
            })->map->sum('amount'),
        ];

        return Inertia::render('payments/report', [
            'payments' => $payments,
            'summary' => $summary,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }
}
