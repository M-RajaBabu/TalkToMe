
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AppHeader from "@/components/layout/AppHeader";
import { Language } from "@/types";
import { LogOut, Volume2, ChevronLeft, User, BarChart2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FadeIn from "@/components/animations/FadeIn";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";

const languages: Language[] = ["Hindi", "Telugu", "English"];

const SettingsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Voice Feedback state
  const [voiceFeedback, setVoiceFeedback] = useState(() => {
    const stored = localStorage.getItem('voiceFeedbackEnabled');
    return stored === null ? true : stored === 'true';
  });
  // Interface Language state
  const interfaceLanguages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'te', label: 'తెలుగు' },
  ];
  const [interfaceLang, setInterfaceLang] = useState(i18n.language);

  // Dialog state for change email/password
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Dialog state for reset progress
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Handlers
  const handleVoiceFeedbackChange = (checked: boolean) => {
    setVoiceFeedback(checked);
    localStorage.setItem('voiceFeedbackEnabled', String(checked));
  };
  const handleInterfaceLangChange = (value: string) => {
    setInterfaceLang(value);
    i18n.changeLanguage(value);
    localStorage.setItem('interfaceLanguage', value);
  };

  const handleLogout = () => {
    // Remove JWT token and user email from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };
  
  // Reset Progress: delete chat and streaks
  const handleReset = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(API_ENDPOINTS.CHAT_ALL, { method: 'DELETE', headers: getAuthHeaders(token || '') });
      await fetch(API_ENDPOINTS.STREAK_ALL, { method: 'DELETE', headers: getAuthHeaders(token || '') });
      // Clear cached progress in localStorage
      localStorage.removeItem('languagePreference');
      // Optionally clear other progress-related keys if used
      toast({ title: "Progress reset", description: "Your progress has been reset." });
      // Optionally reload the page or update UI
      setTimeout(() => { window.location.reload(); }, 1000);
    } catch {
      toast({ title: "Error", description: "Failed to reset progress.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Export Practice History: download chat as CSV
  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_ENDPOINTS.CHAT}?sourceLanguage=&targetLanguage=`, { headers: getAuthHeaders(token || '') });
      const data = await res.json();
      const csv = [
        ['Type', 'Content', 'Timestamp'],
        ...data.map((msg: any) => [msg.type, msg.content, msg.timestamp])
      ].map(row => row.map(String).join(",")).join("\n");
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'practice_history.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast({ title: "Exported", description: "Practice history downloaded." });
    } catch {
      toast({ title: "Error", description: "Failed to export history.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete Account: confirmation dialog, then delete
  const handleDeleteAccount = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(API_ENDPOINTS.DELETE_ACCOUNT, { method: 'DELETE', headers: getAuthHeaders(token || '') });
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      toast({ title: "Account deleted", description: "Your account and all data have been deleted." });
      setTimeout(() => { window.location.href = "/"; }, 1500);
    } catch {
      toast({ title: "Error", description: "Failed to delete account.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setShowDeleteDialog(false);
    }
  };

  // Change Email handler
  const handleChangeEmail = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.CHANGE_EMAIL, {
        method: 'POST',
        headers: getAuthHeaders(token || ''),
        body: JSON.stringify({ newEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change email');
      localStorage.setItem('userEmail', newEmail);
      toast({ title: t('Email updated'), description: t('Your email has been updated.') });
      setShowEmailDialog(false);
    } catch (error: any) {
      toast({ title: t('Error'), description: error.message || t('Failed to change email'), variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Change Password handler
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: t('Error'), description: t('Passwords do not match'), variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        headers: getAuthHeaders(token || ''),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      toast({ title: t('Password updated'), description: t('Your password has been updated.') });
      setShowPasswordDialog(false);
    } catch (error: any) {
      toast({ title: t('Error'), description: error.message || t('Failed to change password'), variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const [avatar, setAvatar] = useState('/pic_of_talk_to_me.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <div className="container max-w-md mx-auto p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-primary font-bold hover:underline focus:outline-none"
          aria-label={t('Back')}
        >
          <ChevronLeft className="h-5 w-5" /> {t('Back')}
        </button>
        <h1 className="text-2xl font-bold mt-4 mb-6">{t('Settings')}</h1>
        
        {/* Profile Card */}
        <div className="flex items-center gap-4 mb-6 bg-card rounded-lg shadow p-4">
          <img src={avatar} alt="Avatar" className="w-14 h-14 rounded-full border shadow" />
          <div className="flex-1">
            <div className="font-bold text-lg">{userName}</div>
            <div className="text-muted-foreground text-sm">{userEmail}</div>
                </div>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Change</Button>
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
              </div>
        {/* Account Section */}
        <FadeIn delay={100}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('Account')}</CardTitle>
              <CardDescription>{t('Manage your account settings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('Email')}</h3>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowEmailDialog(true)}>{t('Change')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('Password')}</h3>
                  <p className="text-sm text-muted-foreground">••••••••</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)}>{t('Change')}</Button>
              </div>
              <div className="pt-4">
                <Button asChild variant="outline" size="sm" className="w-full text-muted-foreground hover:text-destructive hover:border-destructive">
                  <Link to="/language-selection">{t('Reset language preferences')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
        {/* Voice Feedback & Interface Language */}
        <FadeIn delay={150}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('Preferences')}</CardTitle>
              <CardDescription>{t('Customize your app experience')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-feedback">{t('Voice Feedback')}</Label>
                <Switch id="voice-feedback" checked={voiceFeedback} onCheckedChange={handleVoiceFeedbackChange} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="interface-lang">{t('Interface Language')}</Label>
                <Select value={interfaceLang} onValueChange={handleInterfaceLangChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interfaceLanguages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
        {/* Export, Reset, Delete, Logout */}
        <FadeIn delay={200}>
          <Button variant="outline" className="w-full mb-4" onClick={handleExport} disabled={isProcessing}>{t('Export Practice History')}</Button>
          <Button variant="destructive" className="w-full mb-4" onClick={handleReset} disabled={isProcessing}>{t('Reset Progress')}</Button>
          <Button variant="destructive" className="w-full mb-4" onClick={() => setShowDeleteDialog(true)} disabled={isProcessing}><LogOut className="mr-2 h-4 w-4" /> {t('Delete Account')}</Button>
          <Button variant="destructive" className="w-full mb-4" onClick={handleLogout} disabled={isProcessing}><LogOut className="mr-2 h-4 w-4" /> {t('Log out')}</Button>
        </FadeIn>
        
        {/* Bottom spacing to prevent overlap with auto-hiding footer */}
        <div className="h-24"></div>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogTitle>{t('Delete Account')}</DialogTitle>
          <DialogDescription>
            {t('Are you sure you want to permanently delete your account and all your data? This action cannot be undone. You will be logged out and all your progress will be lost.')}
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isProcessing}>{t('Cancel')}</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isProcessing}>{t('Delete Account')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogTitle>{t('Change Email')}</DialogTitle>
          <DialogDescription>{t('Enter your new email address below.')}</DialogDescription>
          <Input
            type="email"
            placeholder={t('New email')}
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            disabled={isProcessing}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)} disabled={isProcessing}>{t('Cancel')}</Button>
            <Button onClick={handleChangeEmail} disabled={isProcessing || !newEmail}>{t('Update Email')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogTitle>{t('Change Password')}</DialogTitle>
          <DialogDescription>{t('Enter your current password and new password below.')}</DialogDescription>
          <Input
            type="password"
            placeholder={t('Current password')}
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            disabled={isProcessing}
          />
          <Input
            type="password"
            placeholder={t('New password')}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            disabled={isProcessing}
          />
          <Input
            type="password"
            placeholder={t('Confirm new password')}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isProcessing}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={isProcessing}>{t('Cancel')}</Button>
            <Button onClick={handleChangePassword} disabled={isProcessing || !currentPassword || !newPassword || !confirmPassword}>{t('Update Password')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
