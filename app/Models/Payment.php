<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'membership_id',
        'payment_number',
        'amount',
        'payment_method',
        'status',
        'type',
        'description',
        'notes',
        'transaction_reference',
        'received_by',
        'payment_date',
        'refunded_at',
        'refund_amount',
        'refund_reason',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'refunded_at' => 'datetime',
        'refund_amount' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function membership(): BelongsTo
    {
        return $this->belongsTo(Membership::class);
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    // Generar número de pago único
    public static function generatePaymentNumber(): string
    {
        $year = now()->year;
        $lastPayment = self::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = $lastPayment ? intval(substr($lastPayment->payment_number, -5)) + 1 : 1;
        
        return sprintf('PAY-%d-%05d', $year, $nextNumber);
    }

    // Scope para pagos completados
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // Scope para pagos del mes actual
    public function scopeCurrentMonth($query)
    {
        return $query->whereMonth('payment_date', now()->month)
            ->whereYear('payment_date', now()->year);
    }
}
