import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Trash2, Edit, Plus, Key } from 'lucide-react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Permission {
  id: number;
  name: string;
  created_at: string;
}

interface Props {
  permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Permisos', href: '/permissions' },
];

export default function PermissionsIndex({ permissions }: Props) {
  const { flash } = usePage().props as any;
  const [deletingPermission, setDeletingPermission] = useState<number | null>(null);

  const handleDelete = (permissionId: number) => {
    router.delete(`/permissions/${permissionId}`, {
      onSuccess: () => {
        setDeletingPermission(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permisos" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Permisos</h1>
            <p className="text-muted-foreground">
              Gestiona los permisos del sistema
            </p>
          </div>
          <Button asChild>
            <Link href="/permissions/create">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Permiso
            </Link>
          </Button>
        </div>

        {flash?.success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{flash.success}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {permissions.map((permission) => (
            <Card key={permission.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  {permission.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/permissions/${permission.id}/edit`} className="flex-1">
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
                          Esta acción no se puede deshacer. Se eliminará el permiso "{permission.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(permission.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {permissions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Key className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay permisos</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Comienza creando un nuevo permiso.
              </p>
              <Button asChild className="mt-6">
                <Link href="/permissions/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Permiso
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
