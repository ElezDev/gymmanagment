import { Head, Link, usePage } from '@inertiajs/react';
import { Dumbbell, Target, TrendingUp, Users, Award, Calendar } from 'lucide-react';

import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Transforma Tu Vida">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,600,700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                {/* Navigation */}
                <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
                    <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Dumbbell className="h-8 w-8 text-emerald-500" />
                            <span className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                GymAdmin
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="px-5 py-2 text-slate-200 hover:text-white transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
                                        >
                                            Comenzar Ahora
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                    <span className="bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                        Transforma Tu Vida
                                    </span>
                                    <br />
                                    <span className="text-white">
                                        Supera Tus Límites
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
                                    Sistema profesional de gestión para entrenadores. 
                                    Diseña rutinas personalizadas, monitorea el progreso 
                                    y lleva a tus clientes al siguiente nivel.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                                {!auth.user && canRegister && (
                                    <Link
                                        href={register()}
                                        className="px-8 py-4 bg-linear-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-emerald-500/50"
                                    >
                                        Empieza Gratis Hoy
                                    </Link>
                                )}
                                <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-semibold text-lg transition-all duration-300">
                                    Ver Demo
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
                                {[
                                    { label: 'Clientes Activos', value: '500+' },
                                    { label: 'Rutinas Creadas', value: '2,000+' },
                                    { label: 'Ejercicios', value: '300+' },
                                    { label: 'Sesiones', value: '10,000+' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                                        <div className="text-3xl font-bold text-emerald-400">{stat.value}</div>
                                        <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6 bg-slate-800/30">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Herramientas <span className="text-emerald-400">Profesionales</span>
                            </h2>
                            <p className="text-xl text-slate-300">
                                Todo lo que necesitas para gestionar tu gimnasio de forma eficiente
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Users,
                                    title: 'Gestión de Clientes',
                                    description: 'Administra perfiles, notas personales, suplementos y objetivos de cada cliente.',
                                    color: 'emerald'
                                },
                                {
                                    icon: Dumbbell,
                                    title: 'Rutinas Personalizadas',
                                    description: 'Crea rutinas detalladas con ejercicios, series, repeticiones y descansos.',
                                    color: 'cyan'
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Seguimiento de Progreso',
                                    description: 'Monitorea peso, medidas, rendimiento y evolución de tus clientes.',
                                    color: 'blue'
                                },
                                {
                                    icon: Calendar,
                                    title: 'Sesiones de Entrenamiento',
                                    description: 'Registra cada sesión, ejercicios realizados y notas importantes.',
                                    color: 'purple'
                                },
                                {
                                    icon: Target,
                                    title: 'Objetivos Claros',
                                    description: 'Define y alcanza metas específicas con planes estructurados.',
                                    color: 'pink'
                                },
                                {
                                    icon: Award,
                                    title: 'Sistema de Logros',
                                    description: 'Motiva a tus clientes con logros y reconocimientos por su progreso.',
                                    color: 'orange'
                                }
                            ].map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                    <div 
                                        key={i} 
                                        className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105"
                                    >
                                        <div className={`w-14 h-14 bg-linear-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="container mx-auto max-w-4xl">
                        <div className="bg-linear-to-r from-emerald-600 to-cyan-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                ¿Listo Para Empezar?
                            </h2>
                            <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
                                Únete a cientos de entrenadores que ya están transformando 
                                la vida de sus clientes con nuestro sistema profesional.
                            </p>
                            {!auth.user && canRegister && (
                                <Link
                                    href={register()}
                                    className="inline-block px-10 py-4 bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                                >
                                    Crear Cuenta Gratuita
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 border-t border-slate-700/50">
                    <div className="container mx-auto text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Dumbbell className="h-6 w-6 text-emerald-500" />
                            <span className="text-xl font-bold text-white">GymAdmin</span>
                        </div>
                        <p>© 2026 GymAdmin. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
           </>
    );
}
             