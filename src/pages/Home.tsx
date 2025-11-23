
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart,
  Users,
  Recycle,
  ArrowRight,
  Sprout,
  Leaf,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const heroHighlights = [
    { label: 'Kilos salvados', value: '2.4K', detail: '2024 Región Metropolitana' },
    { label: 'Vecin@s activos', value: '8.1K', detail: 'Usuarios compartiendo a diario' },
  ];

  const impactStats = [
    {
      title: '+5.000 porciones',
      description: 'Compartidas entre vecinos y organizaciones locales durante el último trimestre.',
      icon: Recycle,
      accent: 'from-emerald-50 to-emerald-100',
    },
    {
      title: '100% gratuita',
      description: 'Financiada por donaciones y voluntariado para mantener la plataforma abierta.',
      icon: Heart,
      accent: 'from-amber-50 to-orange-100',
    },
    {
      title: '72 comunas',
      description: 'Con presencia activa en la RM, priorizando barrios con menos acceso.',
      icon: Users,
      accent: 'from-lime-50 to-emerald-50',
    },
  ];

  const steps = [
    {
      title: 'Publica lo que te sobra',
      description: 'Sube una breve descripción, fecha de vencimiento y punto de retiro seguro.',
      icon: Sprout,
    },
    {
      title: 'Coordina con tu barrio',
      description: 'Recibes mensajes en la app y acuerdas la entrega en minutos.',
      icon: Clock,
    },
    {
      title: 'Entrega y celebra',
      description: 'Confirma la entrega y obtén reconocimiento por tu impacto ambiental.',
      icon: Sparkles,
    },
  ];

  const barrioSpotlights = [
    {
      name: 'Ñuñoa',
      stat: '120 familias conectadas',
      detail: 'Huertas comunitarias + ferias libres recuperan frutas y verduras cada tarde.',
    },
    {
      name: 'Maipú',
      stat: '3 puntos de retiro',
      detail: 'Juntas vecinales coordinan restos de panaderías para comedores solidarios.',
    },
    {
      name: 'Recoleta',
      stat: '54 mercados aliados',
      detail: 'Pequeños comercios reciben alertas para donar productos del día.',
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-1))]">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-x-10 top-8 h-64 rounded-[999px] bg-gradient-to-r from-emerald-200/40 via-amber-200/50 to-emerald-100 blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-900 shadow-sm backdrop-blur">
              <Leaf className="h-4 w-4 text-emerald-500" aria-hidden />
              Plataforma circular para Santiago
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-emerald-950 sm:text-5xl md:text-6xl">
                Comparte comida antes de que sea desperdicio.
              </h1>
              <p className="text-lg text-emerald-900/80 sm:text-xl">
                Ni Una Miga conecta a personas, ferias y organizaciones de Santiago para que ninguna preparación termine en la basura. Donar es gratis, rápido y seguro.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              {user ? (
                <>
                  <Link to="/publicar" className="flex-1">
                    <Button
                      size="lg"
                      className="w-full bg-[hsl(var(--brand-forest))] text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-900"
                    >
                      Publicar comida hoy
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                    </Button>
                  </Link>
                  <Link to="/feed" className="flex-1">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
                    >
                      Ver disponible
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="flex-1">
                    <Button
                      size="lg"
                      className="w-full bg-[hsl(var(--brand-forest))] text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-900"
                    >
                      Únete gratis
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                    </Button>
                  </Link>
                  <Link to="/login" className="flex-1">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
                    >
                      Iniciar sesión
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <p className="text-sm text-emerald-900/70">
              100% gratuito. Coordinamos entregas en menos de 2 horas promedio dentro de la Región Metropolitana.
            </p>
            <dl className="grid gap-6 rounded-3xl border border-emerald-100 bg-white/80 p-6 backdrop-blur sm:grid-cols-2">
              {heroHighlights.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm font-medium text-emerald-900/80">{item.label}</dt>
                  <dd className="text-3xl font-semibold text-emerald-950">{item.value}</dd>
                  <p className="text-sm text-emerald-900/70">{item.detail}</p>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-emerald-100 via-white to-amber-50 blur-2xl" aria-hidden />
            <div className="relative rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-900/70">Destacado del día</p>
                    <p className="text-2xl font-semibold text-emerald-950">Cazuela vegana</p>
                  </div>
                  <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-sm font-semibold text-emerald-900">
                    Ñuñoa
                  </span>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--brand-fern))] to-[hsl(var(--brand-leaf))] p-6 text-white shadow-inner">
                  <p className="text-lg font-semibold">Lista para retirar</p>
                  <p className="text-sm opacity-90">2 porciones • antes de las 20:00 hrs</p>
                  <div className="mt-6 flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4" aria-hidden />
                    <span>Casa Fundación Patio Vivo</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-[hsl(var(--surface-2))] p-5">
                  <p className="text-sm uppercase tracking-wide text-emerald-800">Últimas entregas</p>
                  <ul
                    className="mt-4 space-y-3 text-sm text-emerald-900/80"
                    aria-label="Registro reciente de entregas confirmadas"
                  >
                    <li className="flex items-center justify-between">
                      <span>Pan amasado · La Florida</span>
                      <span className="text-emerald-600">09:12</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Ensalada de fruta · Renca</span>
                      <span className="text-emerald-600">08:47</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Empanadas · Pudahuel</span>
                      <span className="text-emerald-600">07:55</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="impact-title">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600" id="impact-kicker">
              Impacto real
            </p>
            <h2 className="mt-2 text-3xl font-bold text-emerald-950 sm:text-4xl" id="impact-title">
              Reducimos el desperdicio alimentario con acciones cotidianas.
            </h2>
            <p className="mt-4 text-lg text-emerald-900/80">
              Personas, ferias libres y organizaciones colaboran para darle un nuevo destino a cada preparación.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {impactStats.map(({ title, description, icon: Icon, accent }) => (
              <Card
                key={title}
                className={`border-none bg-gradient-to-br ${accent} p-[1px] transition-all hover:-translate-y-1`}
              >
                <CardContent className="h-full rounded-3xl bg-white/90 p-8 shadow-md">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="text-2xl font-semibold text-emerald-950">{title}</h3>
                  <p className="mt-3 text-base text-emerald-900/80">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section
        className="bg-[hsl(var(--surface-2))] px-4 py-20 sm:px-6 lg:px-8"
        aria-labelledby="steps-title"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 text-center">
            <h2 className="text-3xl font-bold text-emerald-950 sm:text-4xl" id="steps-title">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-emerald-900/80">
              Un flujo guiado, pensado para personas con distintos niveles de acceso digital y dispositivos.
            </p>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3" aria-label="Pasos para compartir alimentos">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <li
                key={title}
                className="relative rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-bold text-emerald-800">
                    {index + 1}
                  </span>
                  <Icon className="h-6 w-6 text-emerald-500" aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-emerald-950">{title}</h3>
                <p className="mt-3 text-base text-emerald-900/80">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Neighborhood Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="neighborhood-title">
        <div className="mx-auto max-w-6xl rounded-[32px] bg-gradient-to-br from-white via-[hsl(var(--surface-3))] to-white p-8 shadow-lg lg:px-16">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Barrios conectados
            </p>
            <h2 className="text-3xl font-bold text-emerald-950 sm:text-4xl" id="neighborhood-title">
              Santiago comparte desde sus cocinas.
            </h2>
            <p className="text-lg text-emerald-900/80 lg:max-w-3xl">
              Coordinamos entregas en todas las comunas con apoyo de organizaciones barriales y comercios locales.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {barrioSpotlights.map((spotlight) => (
              <Card key={spotlight.name} className="border border-emerald-100/70 bg-white/90 backdrop-blur">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
                      {spotlight.name}
                    </span>
                    <MapPin className="h-5 w-5 text-emerald-600" aria-hidden />
                  </div>
                  <p className="text-2xl font-semibold text-emerald-950">{spotlight.stat}</p>
                  <p className="text-base text-emerald-900/80">{spotlight.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="cta-title">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-gradient-to-r from-[hsl(var(--brand-forest))] via-emerald-700 to-[hsl(var(--brand-clay))] p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl" id="cta-title">
            Únete a la red cero desperdicio
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Cada olla, pan o fruta compartida fortalece a tu barrio y reduce emisiones.
          </p>
          {!user && (
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-white text-emerald-900 hover:bg-emerald-50"
                >
                  Crear cuenta gratuita
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                </Button>
              </Link>
              <Link to="/feed" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full border border-white/40 bg-white/20 text-white hover:bg-white/30"
                >
                  Ver alimentos disponibles
                </Button>
              </Link>
            </div>
          )}
          {user && (
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/publicar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-white text-emerald-900 hover:bg-emerald-50"
                >
                  Publicar mi donación
                </Button>
              </Link>
              <Link to="/mensajes" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full border border-white/40 bg-white/20 text-white hover:bg-white/30"
                >
                  Revisar mensajes
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
