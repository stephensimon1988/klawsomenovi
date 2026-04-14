import { useState } from 'react';
import { Pencil, X, LogOut } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const EditModeToggle = () => {
  const isMobile = useIsMobile();
  const { isEditMode, isAuthenticated, toggleEditMode, authenticate, logout } = useEditMode();
  const [showLogin, setShowLogin] = useState(false);
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  if (isMobile) return null;

  const handleClick = () => {
    if (isEditMode) {
      toggleEditMode();
    } else if (isAuthenticated) {
      toggleEditMode();
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const ok = await authenticate(pwd);
    setLoading(false);
    if (ok) {
      setShowLogin(false);
      setPwd('');
      toast.success('Edit mode enabled');
    } else {
      toast.error('Wrong password');
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2">
        {isEditMode && (
          <Button
            size="sm"
            variant="outline"
            onClick={logout}
            className="rounded-full bg-background/90 backdrop-blur shadow-lg border-border h-10 px-3"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
        <Button
          onClick={handleClick}
          className={`rounded-full shadow-lg h-12 px-5 font-heading font-bold text-sm transition-all ${
            isEditMode
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-background text-foreground hover:bg-muted border border-border'
          }`}
        >
          {isEditMode ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Exit Edit
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Mode
            </>
          )}
        </Button>
      </div>

      {/* Login modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-6 w-80 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-foreground text-lg">Admin Login</h3>
            <Input
              type="password"
              placeholder="Enter admin password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleLogin} disabled={loading || !pwd} className="flex-1 font-heading font-bold">
                {loading ? '...' : 'Login'}
              </Button>
              <Button variant="ghost" onClick={() => { setShowLogin(false); setPwd(''); }}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModeToggle;
