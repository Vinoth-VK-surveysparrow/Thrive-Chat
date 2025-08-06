import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Chrome } from "lucide-react";
import { motion } from "framer-motion";

export function LoginPage() {
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    await login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to ThriveChat</CardTitle>
            <CardDescription>
              Sign in with your SurveySparrow account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Sign in with Google
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Only @surveysparrow.com email addresses are allowed
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 