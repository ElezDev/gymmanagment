import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Edit, Plus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  created_at: string;
}

interface Props {
  roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Roles', href: '/roles' },
];

export default function RolesIndex({ roles }: Props) {
  const { flash } = usePage().props as any;
  const [deletingRole, setDeletingRole] = useState<number | null>(null);

  const handleDelete = (roleId: number) => {
    router.delete(`/roles/${roleId}`, {
      onSuccess: () => {
        setDeletingRole(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Roles</h1>
            <p className="text-muted-foreground">
              Gestiona los roles y sus permisos asociados
            </p>
          </div>
          <Button asChild>
            <Link href="/roles/create">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Rol
            </Link>
          </Button>
        </div>

        {flash?.success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{flash.success}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                            {role.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {role.permissions.length} permiso(s) asignado(s)
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Permisos:</p>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.length > 0 ? (
                              role.permissions.map((permission) => (
                                <Badge key={permission.id} variant="secondary">
                                  {permission.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">Sin permisos asignados</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                          <Link href={`/roles/${role.id}/edit`} className="flex-1">
                            <Button variant="outline" className="w-full flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Editar
                            </Button>
                          </Link>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará el rol "{role.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(role.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
            ))}
        </div>

        {roles.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShieldCheck className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay roles</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comienza creando un nuevo rol.
              </p>
              <Button asChild className="mt-6">
                <Link href="/roles/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Rol
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
