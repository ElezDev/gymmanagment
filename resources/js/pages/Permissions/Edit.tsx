import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Permission {
  id: number;
  name: string;
}

interface Props {
  permission: Permission;
}

export default function PermissionsEdit({ permission }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Permisos', href: '/permissions' },
    { title: permission.name, href: `/permissions/${permission.id}/edit` },
  ];
  const { data, setData, put, processing, errors } = useForm({
    name: permission.name,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/permissions/${permission.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Permiso: ${permission.name}`} />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <Card>
            <CardHeader>
              <CardTitle>Editar Permiso</CardTitle>
              <CardDescription>
                Modifica el nombre del permiso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Permiso</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Ej: view clients, edit exercises..."
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500">
                    Usa nombres descriptivos en inglés (snake_case). Ej: "view_reports", "edit_users"
                  </p>
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Link href="/permissions">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
