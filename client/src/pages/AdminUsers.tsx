import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Trash2, RotateCcw, Shield, Plus } from "lucide-react";
import { toast } from "sonner";

export function AdminUsers() {
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "owner">("admin");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const token = localStorage.getItem("adminToken");

  // Fetch admin users
  const { data: users = [], isLoading, refetch } = trpc.adminAuth.listUsers.useQuery(
    token ? { token } : undefined,
    { enabled: !!token }
  );

  // Create user mutation
  const createUserMutation = trpc.adminAuth.createUser.useMutation({
    onSuccess: () => {
      toast.success("Admin user created successfully");
      setNewEmail("");
      setNewName("");
      setSelectedRole("admin");
      setIsCreateDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create admin user");
    },
  });

  // Update role mutation
  const updateRoleMutation = trpc.adminAuth.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });

  // Deactivate user mutation
  const deactivateUserMutation = trpc.adminAuth.deactivateUser.useMutation({
    onSuccess: () => {
      toast.success("User deactivated");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to deactivate user");
    },
  });

  // Reactivate user mutation
  const reactivateUserMutation = trpc.adminAuth.reactivateUser.useMutation({
    onSuccess: () => {
      toast.success("User reactivated");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reactivate user");
    },
  });

  const handleCreateUser = async () => {
    if (!token || !newEmail) {
      toast.error("Email is required");
      return;
    }

    createUserMutation.mutate({
      token,
      email: newEmail,
      name: newName || "",
      role: selectedRole,
    })
  };

  const handleUpdateRole = (userId: number, newRole: "admin" | "owner") => {
    if (!token) return;
    updateRoleMutation.mutate({ token, userId, newRole });
  };

  const handleDeactivate = (userId: number) => {
    if (!token) return;
    deactivateUserMutation.mutate({ token, userId });
  };

  const handleReactivate = (userId: number) => {
    if (!token) return;
    reactivateUserMutation.mutate({ token, userId });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading admin users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Admin-Benutzer</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Neuer Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Admin erstellen</DialogTitle>
              <DialogDescription>
                Erstellen Sie einen neuen Admin-Benutzer mit Email und optionalem Namen.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Rolle</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as "admin" | "owner")}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Abbrechen
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={createUserMutation.isPending || !newEmail}
                >
                  {createUserMutation.isPending ? "Erstelle..." : "Erstellen"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!users || users.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Keine Admin-Benutzer vorhanden.
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.name || "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleUpdateRole(user.id, value as "admin" | "owner")}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeactivate(user.id)}
                          disabled={deactivateUserMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReactivate(user.id)}
                          disabled={reactivateUserMutation.isPending}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
