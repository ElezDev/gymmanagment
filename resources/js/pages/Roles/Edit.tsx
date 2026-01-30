import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Props {
  role: Role;
  permissions: Permission[];
}

export default function RolesEdit({ role, permissions }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
    { title: role.name, href: `/roles/${role.id}/edit` },
  ];
  const { data, setData, put, processing, errors } = useForm({
    name: role.name,
    permissions: role.permissions.map(p => p.id),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/roles/${role.id}`);
  };

  const togglePermission = (permissionId: number) => {
    setData('permissions', 
      data.permissions.includes(permissionId)
        ? data.permissions.filter(id => id !== permissionId)
        : [...data.permissions, permissionId]
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Rol: ${role.name}`} />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <Card>
            <CardHeader>
              <CardTitle>Editar Rol</CardTitle>
              <CardDescription>
                Modifica el nombre del rol y actualiza sus permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Rol</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Ej: Manager, Recepcionista..."
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Permisos</Label>
                  <div className="border rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
                    {permissions.length > 0 ? (
                      permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={data.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <label
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {permission.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No hay permisos disponibles.
                      </p>
                    )}
                  </div>
                  {errors.permissions && (
                    <p className="text-sm text-red-600">{errors.permissions}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Link href="/roles">
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
