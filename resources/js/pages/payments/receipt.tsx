import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Payment, PageProps } from '@/types';
import { Printer } from 'lucide-react';

interface Props extends PageProps {
    payment: Payment;
}

export default function PaymentReceipt({ payment }: Props) {
    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(Number(amount));
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            cash: 'Efectivo',
            card: 'Tarjeta',
            transfer: 'Transferencia',
            check: 'Cheque',
            online: 'En línea',
        };
        return labels[method] || method;
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            membership: 'Membresía',
            product: 'Producto',
            service: 'Servicio',
            penalty: 'Penalización',
            other: 'Otro',
        };
        return labels[type] || type;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Recibo #${payment.payment_number}`} />

            {/* Botón de imprimir - Se oculta al imprimir */}
            <div className="fixed top-4 right-4 print:hidden">
                <Button onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                </Button>
            </div>

            {/* Recibo */}
            <div className="max-w-2xl mx-auto p-8 bg-white">
                {/* Header del gimnasio */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">GIMNASIO FITNESS</h1>
                    <p className="text-sm text-gray-600">
                        Sistema de Gestión de Gimnasio
                    </p>
                    <p className="text-xs text-gray-500">
                        Tel: (555) 123-4567 | Email: info@gimnasio.com
                    </p>
                </div>

                <Separator className="my-6" />

                {/* Título del recibo */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-2">RECIBO DE PAGO</h2>
                    <p className="text-sm text-gray-600">
                        #{payment.payment_number}
                    </p>
                </div>

                {/* Información del cliente */}
                <div className="mb-8 space-y-2">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">
                        Información del Cliente
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Nombre:</p>
                            <p className="font-medium">{payment.client.user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email:</p>
                            <p className="text-sm">{payment.client.user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Detalles del pago */}
                <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">
                        Detalles del Pago
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fecha:</span>
                            <span className="font-medium">
                                {formatDate(payment.payment_date)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tipo de Pago:</span>
                            <span className="font-medium">
                                {getTypeLabel(payment.type)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Método de Pago:</span>
                            <span className="font-medium">
                                {getPaymentMethodLabel(payment.payment_method)}
                            </span>
                        </div>
                        {payment.transaction_reference && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Referencia:</span>
                                <span className="font-mono text-sm">
                                    {payment.transaction_reference}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Concepto */}
                <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">
                        Concepto
                    </h3>
                    <p className="text-gray-700">{payment.description}</p>
                    {payment.notes && (
                        <p className="text-sm text-gray-600 mt-2">{payment.notes}</p>
                    )}
                </div>

                {/* Membresía (si aplica) */}
                {payment.membership && (
                    <div className="mb-8">
                        <h3 className="font-semibold text-lg mb-3 border-b pb-2">
                            Información de la Membresía
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Plan:</span>
                                <span className="font-medium">
                                    {payment.membership.membership_plan.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Vigencia:</span>
                                <span className="text-sm">
                                    {new Date(
                                        payment.membership.start_date
                                    ).toLocaleDateString('es-MX')}{' '}
                                    al{' '}
                                    {new Date(
                                        payment.membership.end_date
                                    ).toLocaleDateString('es-MX')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Total */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">TOTAL PAGADO:</span>
                        <span className="text-3xl font-bold text-green-600">
                            {formatCurrency(payment.amount)}
                        </span>
                    </div>
                    {payment.status === 'refunded' && payment.refund_amount && (
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <span className="text-lg font-semibold text-red-600">
                                REEMBOLSADO:
                            </span>
                            <span className="text-2xl font-bold text-red-600">
                                -{formatCurrency(payment.refund_amount)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center space-y-2 border-t pt-6">
                    <p className="text-sm text-gray-600">
                        Recibido por: {payment.received_by.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        Este documento es un comprobante de pago válido
                    </p>
                    <p className="text-xs text-gray-500">
                        Impreso el {new Date().toLocaleDateString('es-MX')} a las{' '}
                        {new Date().toLocaleTimeString('es-MX')}
                    </p>
                </div>

                {/* Mensaje de agradecimiento */}
                <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-blue-900">
                        ¡Gracias por tu pago!
                    </p>
                    <p className="text-sm text-blue-700">
                        Esperamos verte pronto en el gimnasio
                    </p>
                </div>
            </div>

            {/* Estilos específicos para impresión */}
            <style>{`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>
        </>
    );
}
