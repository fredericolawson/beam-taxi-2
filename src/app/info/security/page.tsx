import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function SecurityPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Security Policy</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Our commitment to protecting your data and ensuring a secure tennis ladder experience.
        </p>
        <Badge variant="secondary">Last Updated: {new Date().toLocaleDateString()}</Badge>
      </div>

      {/* Data Protection & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🛡️ Data Protection & Privacy</CardTitle>
          <CardDescription>How we collect, store, and protect your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Data Collection</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>We collect only essential information: name, email, and tennis ranking data</li>
              <li>Match results and statistics are stored to maintain ladder accuracy</li>
              <li>Authentication data is managed securely through Supabase</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Data Storage</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>All data is encrypted at rest using industry-standard AES-256 encryption</li>
              <li>Database hosted on Supabase with AWS infrastructure compliance</li>
              <li>Data backups are automated and encrypted</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Data Access</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Users can only access their own profile and match data</li>
              <li>Administrative access is restricted to authorized club officials</li>
              <li>All data access is logged and monitored</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Authentication & Authorization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🔐 Authentication & Authorization</CardTitle>
          <CardDescription>Secure access controls and user authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Authentication Security</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Secure authentication powered by Supabase Auth</li>
              <li>Email verification required for account activation</li>
              <li>Password reset functionality with secure token validation</li>
              <li>Session management with automatic expiration</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Authorization Controls</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Role-based access control (RBAC) with player and admin roles</li>
              <li>Row Level Security (RLS) policies enforce data isolation</li>
              <li>API endpoints protected with middleware authentication</li>
              <li>Administrative actions require additional verification</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Database Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🗄️ Database Security</CardTitle>
          <CardDescription>Supabase security measures and data protection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Row Level Security (RLS)</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>All tables protected with Row Level Security policies</li>
              <li>Users can only access data they are authorized to see</li>
              <li>Policies enforced at the database level for maximum security</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Database Infrastructure</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Hosted on Supabase with PostgreSQL backend</li>
              <li>Automatic security updates and patches</li>
              <li>SSL/TLS encryption for all database connections</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">☁️ Infrastructure Security</CardTitle>
          <CardDescription>Vercel hosting and deployment security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Hosting Security</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Deployed on Vercel with enterprise-grade security</li>
              <li>Automatic HTTPS with TLS 1.3 encryption</li>
              <li>DDoS protection and traffic filtering</li>
              <li>Global CDN with edge security measures</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Application Security</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Server-side rendering with Next.js for enhanced security</li>
              <li>Environment variables secured and encrypted</li>
              <li>Regular dependency updates and vulnerability scanning</li>
              <li>Content Security Policy (CSP) headers implemented</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* API Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🔌 API Security</CardTitle>
          <CardDescription>Secure API design and server-side protection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">API Protection</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>All API routes protected with authentication middleware</li>
              <li>Input validation and sanitization on all endpoints</li>
              <li>Rate limiting to prevent abuse and DOS attacks</li>
              <li>Server-side validation of all user inputs</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Data Transmission</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>All data transmitted over encrypted HTTPS connections</li>
              <li>API responses sanitized to prevent data leakage</li>
              <li>No sensitive data exposed in client-side code</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* User Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">👤 User Responsibilities</CardTitle>
          <CardDescription>How users can help maintain security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Account Security</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Use strong, unique passwords for your account</li>
              <li>Do not share your login credentials with others</li>
              <li>Log out from shared or public devices</li>
              <li>Report suspicious activity immediately</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Data Accuracy</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Provide accurate information when creating your profile</li>
              <li>Report match results honestly and accurately</li>
              <li>Update your profile information when it changes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Incident Response */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🚨 Incident Response</CardTitle>
          <CardDescription>How we handle security incidents and breaches</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-semibold">Response Process</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>24/7 monitoring for security threats and anomalies</li>
              <li>Immediate containment and assessment of any incidents</li>
              <li>Prompt notification to affected users if required</li>
              <li>Full investigation and remediation of security issues</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">User Notification</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              <li>Users will be notified within 72 hours of any data breach</li>
              <li>Clear communication about impact and required actions</li>
              <li>Regular updates throughout the incident resolution process</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📧 Security Contact</CardTitle>
          <CardDescription>How to report security issues or ask questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              If you discover a security vulnerability or have security-related questions, please contact us immediately:
            </p>
            <div className="bg-muted rounded-md p-4">
              <p className="font-semibold">Security Team</p>
              <p className="text-muted-foreground text-sm">Coral Beach & Tennis Club</p>
              <p className="text-sm">Email: security@coralbeach.tennis.bm</p>
            </div>
            <p className="text-muted-foreground text-xs">
              We appreciate responsible disclosure and will respond to all security reports within 48 hours.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-muted-foreground text-center text-sm">
        <p>This security policy is reviewed and updated regularly to ensure continued protection of your data.</p>
      </div>
    </div>
  );
}
