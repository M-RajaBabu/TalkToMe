import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppHeader from '@/components/layout/AppHeader';
import { useState } from 'react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const userEmail = localStorage.getItem('userEmail') || t('No email found');
  // Placeholder for name and other details
  const userName = localStorage.getItem('userName') || t('No name set');
  const userPhone = localStorage.getItem('userPhone') || t('No phone set');
  // Password section (masked, with toggle)
  const [showPassword, setShowPassword] = useState(false);
  // In a real app, never store password in localStorage; here we use a placeholder
  const userPassword = 'password123'; // Placeholder only

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container max-w-md mx-auto flex-1 flex flex-col h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">{t('Profile')}</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('Account Information')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="font-medium">{t('Name')}:</div>
              <div className="text-muted-foreground">{userName}</div>
            </div>
            <div className="mb-4">
              <div className="font-medium">{t('Email')}:</div>
              <div className="text-muted-foreground">{userEmail}</div>
            </div>
            <div className="mb-4">
              <div className="font-medium">{t('Phone')}:</div>
              <div className="text-muted-foreground">{userPhone}</div>
            </div>
            <div className="mb-4">
              <div className="font-medium">{t('Password')}:</div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {showPassword ? userPassword : '••••••••'}
                </span>
                <button
                  type="button"
                  className="text-xs underline text-primary"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? t('Hide') : t('Show')}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        <AppHeader className="md:hidden" />
      </div>
    </div>
  );
};

export default ProfilePage; 