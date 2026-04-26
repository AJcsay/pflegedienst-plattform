import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminSetup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin" as "admin" | "owner",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const setupStatusQuery = trpc.adminAuth.checkSetupStatus.useQuery();
  const createUserMutation = trpc.adminAuth.createUser.useMutation();

  // Redirect to login if setup is not needed
  useEffect(() => {
    if (setupStatusQuery.data && !setupStatusQuery.data.setupNeeded) {
      setLocation("/admin/login");
    }
  }, [setupStatusQuery.data, setLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await createUserMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (result) {
        setSuccess(`✅ Admin-Konto erstellt: ${formData.email}`);
        setFormData({
          email: "",
          password: "",
          name: "",
          role: "admin",
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else {
        setError("Fehler beim Erstellen des Admin-Kontos");
      }
    } catch (err: any) {
      setError(err.message || "Fehler beim Erstellen des Admin-Kontos");
    } finally {
      setLoading(false);
    }
  };

  if (setupStatusQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">Wird geladen...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔐 Admin-Setup</CardTitle>
          <CardDescription>Erstelle dein erstes Admin-Konto</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Dein Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Passwort</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Mindestens 8 Zeichen"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Verwende Großbuchstaben, Zahlen und Sonderzeichen
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rolle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="owner">Owner (Vollzugriff)</option>
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wird erstellt..." : "Admin-Konto erstellen"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/admin/login")}
              >
                Zum Login
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm font-medium mb-2">📝 Nächste Schritte:</p>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>✓ Admin-Konto erstellt</li>
                  <li>→ Melde dich an unter /admin/login</li>
                  <li>→ Erstelle weitere Admin-Konten im Dashboard</li>
                </ul>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setLocation("/admin/login");
                }}
              >
                Zum Login
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Weiteres Konto erstellen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
