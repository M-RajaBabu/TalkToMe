import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppHeader from '@/components/layout/AppHeader';
import { useState } from 'react';
import { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { Input } from '@/components/ui/input';
import { Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const badgeInfo: Record<string, { icon: string; label: string }> = {
  'streak-7': { icon: '🔥', label: '7-Day Streak' },
  'messages-100': { icon: '💬', label: '100 Messages' },
  'voice-1': { icon: '🎤', label: 'First Voice Chat' },
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const userEmail = localStorage.getItem('userEmail') || t('No email found');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || t('No name set'));
  const [userPhone, setUserPhone] = useState(localStorage.getItem('userPhone') || t('No phone set'));
  const [showPassword, setShowPassword] = useState(false);
  const userPassword = 'password123'; // Placeholder only
  // XP/Level (mock)
  const [xp] = useState(320);
  const [level] = useState(3);
  // Avatar (mock)
  const [avatar, setAvatar] = useState('/pic_of_talk_to_me.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Bio (mock)
  const [bio, setBio] = useState('Aspiring polyglot. Love learning new languages!');
  // Badges (mock)
  const [badges] = useState(['streak-7', 'messages-100']);
  
  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editPhone, setEditPhone] = useState(userPhone);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      setUserName(editName);
      localStorage.setItem('userName', editName);
      setIsEditingName(false);
      toast({
        title: "Success",
        description: "Name updated successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Name cannot be empty!",
        variant: "destructive",
      });
    }
  };

  const handleSavePhone = () => {
    if (editPhone.trim()) {
      setUserPhone(editPhone);
      localStorage.setItem('userPhone', editPhone);
      setIsEditingPhone(false);
      toast({
        title: "Success",
        description: "Phone number updated successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Phone number cannot be empty!",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = (type: 'name' | 'phone') => {
    if (type === 'name') {
      setEditName(userName);
      setIsEditingName(false);
    } else {
      setEditPhone(userPhone);
      setIsEditingPhone(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container max-w-md mx-auto flex-1 flex flex-col h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">{t('Profile')}</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('Account Information')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Avatar upload/selection */}
            <div className="flex items-center gap-4 mb-4">
              <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full border shadow" />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Change Avatar</Button>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
            </div>
            {/* Bio editing */}
            <div className="mb-4">
              <div className="font-medium">Bio:</div>
              <textarea className="w-full border rounded p-2 text-sm text-foreground bg-background" value={bio} onChange={e => setBio(e.target.value)} placeholder="Add a short bio..." />
            </div>
            <div className="mb-4">
              <div className="font-medium">Level:</div>
              <div className="text-muted-foreground">{level} (XP: {xp})</div>
            </div>
            <div className="mb-4">
              <div className="font-medium flex items-center justify-between">
                {t('Name')}:
                {!isEditingName && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1"
                    placeholder="Enter your name"
                  />
                  <Button size="sm" onClick={handleSaveName} className="h-8 px-2">
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelEdit('name')}
                    className="h-8 px-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="text-muted-foreground">{userName}</div>
              )}
            </div>
            <div className="mb-4">
              <div className="font-medium">{t('Email')}:</div>
              <div className="text-muted-foreground">{userEmail}</div>
            </div>
            <div className="mb-4">
              <div className="font-medium flex items-center justify-between">
                {t('Phone')}:
                {!isEditingPhone && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingPhone(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {isEditingPhone ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="flex-1"
                    placeholder="Enter your phone number"
                  />
                  <Button size="sm" onClick={handleSavePhone} className="h-8 px-2">
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelEdit('phone')}
                    className="h-8 px-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="text-muted-foreground">{userPhone}</div>
              )}
            </div>
            <div className="mb-4">
              <div className="font-medium">{t('Password')}:</div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {showPassword ? userPassword : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
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
            {/* Achievements/Badges */}
            <div className="mb-4">
              <div className="font-medium mb-1">Achievements:</div>
              <div className="flex gap-2 flex-wrap">
                {badges.length === 0 && <span>No badges yet</span>}
                {badges.map(badge => (
                  <Badge key={badge} className="flex items-center gap-1 px-2 py-1">
                    <span>{badgeInfo[badge]?.icon || '🏅'}</span>
                    <span>{badgeInfo[badge]?.label || badge}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <AppHeader className="md:hidden" />
        <BottomNavBar />
      </div>
    </div>
  );
};

export default ProfilePage; 