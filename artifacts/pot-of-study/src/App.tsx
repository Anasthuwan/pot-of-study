import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarClock,
  Check,
  CheckCircle2,
  CheckSquare2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  EyeOff,
  Filter,
  LayoutDashboard,
  Leaf,
  Library,
  LineChart,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  Moon,
  MoreHorizontal,
  NotebookTabs,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Sun,
  Target,
  Timer,
  Trash2,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { AuthProvider, useAuth, getUserInitials } from '@/contexts/auth-context';

const queryClient = new QueryClient();

function AuthLoadingScreen() {
  return (
    <div
      className="app-noise flex min-h-[100dvh] flex-col items-center justify-center bg-background text-foreground"
      data-testid="auth-loading-screen"
    >
      <div className="flex flex-col items-center gap-3 animate-rise">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_20px_hsl(154_42%_31%_/_0.25)]">
          <span className="relative block h-5 w-5 rounded-full border-2 border-current animate-pulse">
            <span className="absolute -right-[3px] -top-[4px] h-2 w-2 rounded-full bg-accent" />
          </span>
        </span>
        <p className="hand-title text-2xl font-semibold tracking-[-0.02em]">Pot of Study</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Loader2 size={13} className="animate-spin text-primary" /> Setting up your space…
        </p>
      </div>
    </div>
  );
}

function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (user) {
        setLocation('/dashboard');
      } else {
        setLocation('/login');
      }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return null;
}


type Task = {
  id: number;
  title: string;
  subject: string;
  due: string;
  duration: string;
  completed: boolean;
  tag: 'Today' | 'Tomorrow' | 'This week';
};

type Subject = {
  name: string;
  detail: string;
  progress: number;
  accent: string;
  icon: LucideIcon;
};

const initialTasks: Task[] = [
  { id: 1, title: 'Review cell structure notes', subject: 'Biology', due: 'Today, 4:00 PM', duration: '45 min', completed: false, tag: 'Today' },
  { id: 2, title: 'Finish quadratic equations set', subject: 'Mathematics', due: 'Today, 7:30 PM', duration: '60 min', completed: false, tag: 'Today' },
  { id: 3, title: 'Read chapter 6 and annotate', subject: 'English literature', due: 'Tomorrow', duration: '35 min', completed: true, tag: 'Tomorrow' },
  { id: 4, title: 'Draft history essay outline', subject: 'History', due: 'Thu, 10:00 AM', duration: '50 min', completed: false, tag: 'This week' },
];

const subjects: Subject[] = [
  { name: 'Mathematics', detail: 'Algebra and calculus', progress: 72, accent: 'hsl(154 42% 31%)', icon: BarChart3 },
  { name: 'Biology', detail: 'Cells and ecosystems', progress: 58, accent: 'hsl(73 52% 44%)', icon: Leaf },
  { name: 'English literature', detail: 'Modern short fiction', progress: 84, accent: 'hsl(26 72% 61%)', icon: NotebookTabs },
  { name: 'World history', detail: 'Industrial revolution', progress: 46, accent: 'hsl(197 44% 53%)', icon: Library },
];

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare2 },
  { href: '/progress', label: 'Progress', icon: LineChart },
  { href: '/notes', label: 'Notes', icon: StickyNote },
  { href: '/timetable', label: 'Timetable', icon: CalendarDays },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2.5 pot-focus rounded-lg ${compact ? 'justify-center' : ''}`} data-testid="link-logo">
      <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-primary text-primary-foreground shadow-[0_6px_16px_hsl(154_42%_31%_/_0.18)]">
        <span className="relative block h-4 w-4 rounded-full border-2 border-current">
          <span className="absolute -right-[3px] -top-[4px] h-2 w-2 rounded-full bg-accent" />
        </span>
      </span>
      {!compact && <span className="text-[15px] font-semibold tracking-[-0.02em]">Pot of Study</span>}
    </Link>
  );
}

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      className="pot-focus relative inline-flex h-9 w-[68px] items-center rounded-full border border-border bg-card p-1 transition-colors hover:bg-muted"
      data-testid="button-theme-toggle"
    >
      <span className={`grid h-7 w-7 place-items-center rounded-full transition-all duration-300 ${dark ? 'translate-x-7 bg-accent text-accent-foreground' : 'translate-x-0 bg-primary text-primary-foreground'}`}>
        {dark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
      <span className={`absolute ${dark ? 'left-2' : 'right-2'} text-muted-foreground`}>
        {dark ? <Sun size={13} /> : <Moon size={13} />}
      </span>
    </button>
  );
}

function Sidebar({ mobileOpen, onClose, dark, onToggle }: { mobileOpen: boolean; onClose: () => void; dark: boolean; onToggle: () => void }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      setLocation('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Maya Chen';
  const displayEmail = user?.email || 'Year 12 student';
  const initials = getUserInitials(user?.displayName, user?.email);

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`} data-testid="sidebar-navigation">
        <div className="flex items-center justify-between px-2">
          <Logo />
          <button type="button" onClick={onClose} className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Close navigation" data-testid="button-close-navigation">
            <X size={17} />
          </button>
        </div>
        <div className="mt-10 px-2">
          <p className="mono-label mb-3 text-[10px] text-muted-foreground">Workspace</p>
          <nav className="space-y-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = location === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`pot-focus group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${active ? 'bg-primary text-primary-foreground shadow-[0_8px_18px_hsl(154_42%_31%_/_0.16)]' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                >
                  <Icon size={17} strokeWidth={active ? 2.3 : 1.8} />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Sparkles size={15} />
              <span className="text-xs font-semibold">A small reset</span>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">A clear desk makes room for a clear thought.</p>
          </div>
          <div className="flex items-center justify-between border-t border-border px-2 pt-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{displayName}</p>
                <p className="truncate text-[11px] text-muted-foreground">{displayEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={onToggle}
                className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Toggle theme"
                title="Toggle theme"
                data-testid="button-sidebar-theme"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label="Sign out"
                title="Sign out"
                data-testid="button-sidebar-logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
      {mobileOpen && <button type="button" onClick={onClose} className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] lg:hidden" aria-label="Close navigation overlay" data-testid="button-navigation-overlay" />}
    </>
  );
}

function Topbar({ onMenu, dark, onToggle }: { onMenu: () => void; dark: boolean; onToggle: () => void }) {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const current = navItems.find((item) => item.href === location)?.label ?? 'Overview';

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur-md sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenu} className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" aria-label="Open navigation" data-testid="button-open-navigation">
          <Menu size={20} />
        </button>
        <div>
          <p className="mono-label text-[10px] text-muted-foreground">Your workspace</p>
          <p className="mt-0.5 text-sm font-semibold">{current}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button type="button" className="pot-focus hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:block" aria-label="Search" data-testid="button-search">
          <Search size={18} />
        </button>
        <button type="button" className="pot-focus relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications" data-testid="button-notifications">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <ThemeToggle dark={dark} onToggle={onToggle} />
        <button
          type="button"
          onClick={handleLogout}
          className="pot-focus inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          aria-label="Sign out"
          title="Sign out"
          data-testid="button-dashboard-logout"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

function AppShell({ children, dark, onToggle }: { children: ReactNode; dark: boolean; onToggle: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="app-noise min-h-[100dvh] bg-background text-foreground">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} dark={dark} onToggle={onToggle} />
      <div className="min-h-[100dvh] lg:pl-[250px]">
        <Topbar onMenu={() => setMobileOpen(true)} dark={dark} onToggle={onToggle} />
        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="animate-rise">
        <p className="mono-label mb-3 text-[10px] text-primary">{eyebrow}</p>
        <h1 className="hand-title text-balance text-[clamp(2.25rem,4vw,3.6rem)] leading-[0.98] text-foreground">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action && <div className="animate-rise animate-rise-delay-1">{action}</div>}
    </div>
  );
}

function PrimaryButton({ children, onClick, icon: Icon = ArrowRight, testId = 'button-primary', type = 'button' }: { children: ReactNode; onClick?: () => void; icon?: LucideIcon; testId?: string; type?: 'button' | 'submit' }) {
  return (
    <button type={type} onClick={onClick} className="pot-focus inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_hsl(154_42%_31%_/_0.15)] transition-transform hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0" data-testid={testId}>
      {children}<Icon size={16} />
    </button>
  );
}

function StatCard({ label, value, detail, icon: Icon, accent = 'primary' }: { label: string; value: string; detail: string; icon: LucideIcon; accent?: 'primary' | 'orange' | 'blue' }) {
  const accentClass = accent === 'orange' ? 'bg-[hsl(26_72%_61%_/_0.16)] text-[hsl(26_72%_43%)]' : accent === 'blue' ? 'bg-[hsl(197_44%_53%_/_0.16)] text-[hsl(197_50%_36%)]' : 'bg-secondary text-primary';
  return (
    <div className="pot-card animate-rise rounded-2xl p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${accentClass}`}><Icon size={17} /></span>
        <ArrowUpRight size={16} className="text-muted-foreground" />
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      <p className="mt-3 text-xs font-medium text-primary">{detail}</p>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const todayTasks = tasks.filter((task) => task.tag === 'Today');
  const completedToday = todayTasks.filter((task) => task.completed).length;
  const toggleTask = (id: number) => setTasks((items) => items.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Maya';
  return (
    <div>
      <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="animate-rise">
          <p className="mono-label mb-3 text-[10px] text-primary">Tuesday, 14 May 2024</p>
          <h1 className="hand-title text-balance text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95]">Good afternoon, {firstName}.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">Your week has a little more shape today. Start with one clear thing, then let the rest follow.</p>
        </div>
        <Link href="/tasks" className="pot-focus inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary" data-testid="link-plan-session">
          <Timer size={16} /> Plan a study session
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Study hours this week" value="8h 40m" detail="+1h 20m from last week" icon={Clock3} />
        <StatCard label="Tasks completed" value="12 / 18" detail="You are on a good streak" icon={CheckCircle2} accent="orange" />
        <StatCard label="Current focus" value="Biology" detail="58% of your goal complete" icon={Target} accent="blue" />
        <StatCard label="Weekly rhythm" value="74%" detail="Three steady days in a row" icon={BarChart3} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="pot-card animate-rise animate-rise-delay-1 rounded-2xl p-5 sm:p-6" aria-labelledby="today-heading">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mono-label text-[10px] text-muted-foreground">Your next steps</p>
              <h2 id="today-heading" className="mt-2 text-xl font-semibold tracking-[-0.03em]">Today’s rhythm</h2>
            </div>
            <Link href="/tasks" className="pot-focus inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline" data-testid="link-view-all-tasks">View all <ChevronRight size={14} /></Link>
          </div>
          <div className="mt-6 space-y-2">
            {todayTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
            <span className="text-muted-foreground">{completedToday} of {todayTasks.length} focus blocks complete</span>
            <span className="font-semibold text-primary">{Math.round((completedToday / todayTasks.length) * 100)}%</span>
          </div>
        </section>
        <section className="animate-rise animate-rise-delay-2 overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-[0_15px_30px_hsl(154_42%_31%_/_0.16)]">
          <div className="flex items-start justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/10"><Leaf size={19} /></span>
            <span className="mono-label text-[10px] text-primary-foreground/60">Small note</span>
          </div>
          <div className="mt-16">
            <p className="hand-title text-3xl leading-tight">“Progress feels lighter when you only carry today.”</p>
            <p className="mt-5 text-xs leading-5 text-primary-foreground/65">Keep your attention close. Tomorrow can wait until it arrives.</p>
          </div>
        </section>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="pot-card animate-rise animate-rise-delay-2 rounded-2xl p-5 sm:p-6" aria-labelledby="subjects-heading">
          <div className="flex items-center justify-between">
            <div><p className="mono-label text-[10px] text-muted-foreground">Keep growing</p><h2 id="subjects-heading" className="mt-2 text-xl font-semibold tracking-[-0.03em]">Subject pulse</h2></div>
            <Link href="/subjects" className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="View subjects" data-testid="link-view-subjects"><ArrowUpRight size={17} /></Link>
          </div>
          <div className="mt-5 space-y-4">
            {subjects.slice(0, 3).map((subject) => <ProgressSubject key={subject.name} subject={subject} />)}
          </div>
        </section>
        <WeekStrip />
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div className={`group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-border hover:bg-muted/50 ${task.completed ? 'opacity-65' : ''}`} data-testid={`row-task-${task.id}`}>
      <button type="button" onClick={onToggle} className={`pot-focus grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${task.completed ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/35 hover:border-primary'}`} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`} data-testid={`button-toggle-task-${task.id}`}>
        {task.completed && <Check size={12} strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{task.subject} <span className="mx-1 text-border">•</span> {task.duration}</p>
      </div>
      <span className="hidden text-xs text-muted-foreground sm:block">{task.due}</span>
      <button type="button" className="pot-focus rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100" aria-label={`More options for ${task.title}`} data-testid={`button-task-options-${task.id}`}><MoreHorizontal size={16} /></button>
    </div>
  );
}

function ProgressSubject({ subject }: { subject: Subject }) {
  const Icon = subject.icon;
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `${subject.accent}1a`, color: subject.accent }}><Icon size={16} /></span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-medium">{subject.name}</p><span className="text-xs font-semibold">{subject.progress}%</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="progress-fill h-full rounded-full" style={{ width: `${subject.progress}%`, backgroundColor: subject.accent }} /></div>
      </div>
    </div>
  );
}

function WeekStrip() {
  const days = [{ day: 'Mon', date: '13', done: true, active: false }, { day: 'Tue', date: '14', done: false, active: true }, { day: 'Wed', date: '15', done: false, active: false }, { day: 'Thu', date: '16', done: false, active: false }, { day: 'Fri', date: '17', done: false, active: false }];
  return (
    <section className="pot-card animate-rise animate-rise-delay-3 rounded-2xl p-5 sm:p-6" aria-labelledby="week-heading">
      <div className="flex items-center justify-between"><div><p className="mono-label text-[10px] text-muted-foreground">This week</p><h2 id="week-heading" className="mt-2 text-xl font-semibold tracking-[-0.03em]">Your rhythm</h2></div><Link href="/timetable" className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Open timetable" data-testid="link-open-timetable"><CalendarClock size={17} /></Link></div>
      <div className="mt-6 grid grid-cols-5 gap-2">
        {days.map((day) => <div key={day.day} className={`rounded-xl border p-2 text-center ${day.active ? 'border-primary bg-secondary' : 'border-border bg-card'}`}><p className="text-[10px] text-muted-foreground">{day.day}</p><p className={`mt-2 text-sm font-semibold ${day.active ? 'text-primary' : ''}`}>{day.date}</p><span className={`mx-auto mt-3 block h-1.5 w-1.5 rounded-full ${day.done ? 'bg-accent' : day.active ? 'bg-primary' : 'bg-border'}`} /></div>)}
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-accent" /> One completed session <span className="ml-auto font-medium text-foreground">4 planned</span></div>
    </section>
  );
}

function SubjectsPage() {
  return (
    <div>
      <PageIntro eyebrow="Your learning map" title="Subjects with a pulse." description="See where your attention is landing, and choose the next small step for each subject." action={<PrimaryButton icon={Plus} testId="button-add-subject">Add subject</PrimaryButton>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active subjects" value="4" detail="All with a weekly plan" icon={BookOpen} />
        <StatCard label="Average progress" value="65%" detail="+8% this month" icon={Target} accent="orange" />
        <StatCard label="Next review" value="Biology" detail="Tomorrow at 3:30 PM" icon={CalendarClock} accent="blue" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {subjects.map((subject, index) => {
          const Icon = subject.icon;
          return <article key={subject.name} className="pot-card animate-rise rounded-2xl p-5 transition-transform hover:-translate-y-0.5 sm:p-6" style={{ animationDelay: `${index * 70}ms` }} data-testid={`card-subject-${index}`}>
            <div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ backgroundColor: `${subject.accent}1a`, color: subject.accent }}><Icon size={19} /></span><div><h2 className="font-semibold">{subject.name}</h2><p className="mt-1 text-xs text-muted-foreground">{subject.detail}</p></div></div><button type="button" className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label={`More options for ${subject.name}`} data-testid={`button-subject-options-${index}`}><MoreHorizontal size={17} /></button></div>
            <div className="mt-8 flex items-end justify-between"><span className="text-xs text-muted-foreground">Overall progress</span><span className="text-2xl font-semibold tracking-[-0.05em]">{subject.progress}%</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="progress-fill h-full rounded-full" style={{ width: `${subject.progress}%`, backgroundColor: subject.accent }} /></div>
            <div className="mt-5 flex items-center justify-between text-xs"><span className="text-muted-foreground">{index + 2} focus blocks this week</span><button type="button" className="pot-focus inline-flex items-center gap-1 font-semibold text-primary hover:underline" data-testid={`button-view-subject-${index}`}>View subject <ArrowRight size={13} /></button></div>
          </article>;
        })}
      </div>
    </div>
  );
}

function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<'All' | Task['tag']>('All');
  const visible = filter === 'All' ? tasks : tasks.filter((task) => task.tag === filter);
  const completed = tasks.filter((task) => task.completed).length;
  const addTask = () => setTasks((items) => [...items, { id: Date.now(), title: 'New focus block', subject: 'Personal study', due: 'Whenever you are ready', duration: '30 min', completed: false, tag: 'This week' }]);
  return (
    <div>
      <PageIntro eyebrow="Make room for focus" title="Tasks, without the noise." description="A simple queue for the work that deserves your attention next." action={<PrimaryButton icon={Plus} onClick={addTask} testId="button-add-task">Add task</PrimaryButton>} />
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1" role="tablist" aria-label="Task filters">{(['All', 'Today', 'Tomorrow', 'This week'] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} role="tab" aria-selected={filter === item} className={`pot-focus rounded-lg px-3 py-2 text-xs font-medium transition-colors ${filter === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div><div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 size={15} className="text-primary" /> {completed} of {tasks.length} completed</div></div>
      <div className="pot-card overflow-hidden rounded-2xl">
        <div className="hidden grid-cols-[1fr_150px_100px_40px] gap-4 border-b border-border px-5 py-3 text-[10px] text-muted-foreground sm:grid sm:px-6"><span>Focus block</span><span>Due</span><span>Length</span><span /></div>
        <div className="divide-y divide-border">
          {visible.map((task) => <div key={task.id} className="group grid gap-3 px-5 py-4 transition-colors hover:bg-muted/35 sm:grid-cols-[1fr_150px_100px_40px] sm:items-center sm:gap-4 sm:px-6"><div className="flex items-center gap-3"><button type="button" onClick={() => setTasks((items) => items.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))} className={`pot-focus grid h-5 w-5 shrink-0 place-items-center rounded-full border ${task.completed ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/35 hover:border-primary'}`} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`} data-testid={`button-complete-task-${task.id}`}>{task.completed && <Check size={12} strokeWidth={3} />}</button><div><p className={`text-sm font-medium ${task.completed ? 'text-muted-foreground line-through' : ''}`}>{task.title}</p><p className="mt-1 text-xs text-muted-foreground">{task.subject}</p></div></div><span className="pl-8 text-xs text-muted-foreground sm:pl-0">{task.due}</span><span className="pl-8 text-xs text-muted-foreground sm:pl-0">{task.duration}</span><button type="button" onClick={() => setTasks((items) => items.filter((item) => item.id !== task.id))} className="pot-focus hidden rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:justify-self-end sm:group-hover:block" aria-label={`Delete ${task.title}`} data-testid={`button-delete-task-${task.id}`}><Trash2 size={15} /></button></div>)}
        </div>
        {visible.length === 0 && <div className="px-6 py-16 text-center"><CheckSquare2 className="mx-auto text-muted-foreground/50" size={28} /><p className="mt-3 text-sm font-medium">Nothing in this view yet.</p><p className="mt-1 text-xs text-muted-foreground">Add a task when a new idea lands.</p></div>}
      </div>
    </div>
  );
}

function ProgressPage() {
  const bars = [42, 55, 38, 68, 52, 79, 61, 88, 67, 74, 82, 64];
  return (
    <div>
      <PageIntro eyebrow="Notice the pattern" title="Progress, made visible." description="The goal is not a perfect line. It is a rhythm you can return to." action={<button type="button" className="pot-focus inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary" data-testid="button-progress-range"><CalendarDays size={16} /> Last 30 days</button>} />
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Focus time" value="18h 25m" detail="+14% from last month" icon={Timer} /><StatCard label="Study sessions" value="32" detail="7 more than last month" icon={CalendarClock} accent="orange" /><StatCard label="Consistency" value="76%" detail="Your strongest month yet" icon={Sparkles} accent="blue" /></div>
      <section className="pot-card mt-6 rounded-2xl p-5 sm:p-7" aria-labelledby="chart-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="mono-label text-[10px] text-muted-foreground">Focus minutes</p><h2 id="chart-heading" className="mt-2 text-xl font-semibold">A steadier week is taking shape.</h2></div><div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> Focus time</span><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Goal</span></div></div>
        <div className="mt-10 flex h-[250px] items-end gap-2 border-b border-l border-border px-3 pb-0 pt-5 sm:gap-4 sm:px-5">{bars.map((height, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-3"><div className="group relative w-full max-w-9 rounded-t-lg bg-primary transition-all hover:bg-primary/80" style={{ height: `${height}%` }}><span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-1.5 py-1 text-[10px] text-background opacity-0 transition-opacity group-hover:opacity-100">{height}m</span></div><span className="text-[10px] text-muted-foreground">{['Apr 29', '30', 'May 1', '2', '3', '4', '5', '6', '7', '8', '9', '10'][index]}</span></div>)}</div>
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-secondary p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={15} /></span><div><p className="text-sm font-semibold">Your best day was May 6</p><p className="mt-1 text-xs leading-5 text-muted-foreground">You spent 88 focused minutes on Biology. That is a useful clue, not a new rule.</p></div></div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">{['Most focused subject', 'Best study window', 'Current streak'].map((label, i) => <div key={label} className="pot-card rounded-2xl p-5"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-3 text-xl font-semibold">{['Biology', '4:00 — 6:00 PM', '3 days'][i]}</p><p className="mt-2 text-xs text-primary">{['32% of focus time', 'Your most consistent slot', 'Keep it gentle'][i]}</p></div>)}</section>
    </div>
  );
}

function NotesPage() {
  const [active, setActive] = useState(0);
  const [notes, setNotes] = useState([{ title: 'A better way to revise', subject: 'Study method', date: 'Today', body: 'Retrieval practice works better when I explain the idea before looking back at the page. Start with a blank sheet and let the gaps show me what to revisit.' }, { title: 'Biology — cell membrane', subject: 'Biology', date: 'Yesterday', body: 'Phospholipid bilayer: hydrophilic heads face outward, hydrophobic tails face inward. Remember it as a quiet boundary, not a solid wall.' }, { title: 'Questions for class', subject: 'Mathematics', date: 'May 10', body: 'Ask about why the discriminant changes the number of real roots. Try drawing the graph before the formula.' }]);
  const note = notes[active];
  return (
    <div>
      <PageIntro eyebrow="A place to think" title="Notes that stay close." description="Keep the useful fragments of a study day somewhere you can find them again." action={<PrimaryButton icon={Plus} onClick={() => { setNotes((items) => [{ title: 'Untitled note', subject: 'Personal study', date: 'Just now', body: 'Start writing here…' }, ...items]); setActive(0); }} testId="button-new-note">New note</PrimaryButton>} />
      <div className="grid min-h-[520px] gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="pot-card rounded-2xl p-3">
          <div className="mb-3 flex items-center justify-between px-2 py-1"><span className="mono-label text-[10px] text-muted-foreground">Your notes</span><button type="button" className="pot-focus rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Filter notes" data-testid="button-filter-notes"><Filter size={14} /></button></div>
          <div className="space-y-1">{notes.map((item, index) => <button key={`${item.title}-${index}`} type="button" onClick={() => setActive(index)} className={`pot-focus w-full rounded-xl px-3 py-3 text-left transition-colors ${active === index ? 'bg-secondary' : 'hover:bg-muted'}`} data-testid={`button-note-${index}`}><p className="truncate text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.subject} <span className="mx-1">·</span> {item.date}</p></button>)}</div>
        </aside>
        <article className="pot-card relative rounded-2xl p-6 sm:p-9">
          <div className="absolute right-5 top-5 flex items-center gap-1"><button type="button" className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Edit note" data-testid="button-edit-note"><PenLine size={16} /></button><button type="button" onClick={() => { setNotes((items) => items.filter((_, index) => index !== active)); setActive(0); }} className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Delete note" data-testid="button-delete-note"><Trash2 size={16} /></button></div>
          <div className="max-w-2xl"><p className="mono-label text-[10px] text-primary">{note.subject}</p><h2 className="hand-title mt-4 text-4xl leading-tight">{note.title}</h2><div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Saved locally <span className="mx-1">·</span> {note.date}</div><p className="mt-10 whitespace-pre-line text-[15px] leading-8 text-foreground/80">{note.body}</p><div className="mt-12 border-t border-border pt-5"><p className="text-xs font-semibold text-muted-foreground">Related focus blocks</p><div className="mt-3 flex flex-wrap gap-2"><Link href="/tasks" className="pot-focus rounded-lg bg-muted px-3 py-2 text-xs font-medium hover:bg-secondary" data-testid="link-related-task">Review cell structure notes <ArrowUpRight size={12} className="ml-1 inline" /></Link><Link href="/subjects" className="pot-focus rounded-lg bg-muted px-3 py-2 text-xs font-medium hover:bg-secondary" data-testid="link-related-subject">Biology <ArrowUpRight size={12} className="ml-1 inline" /></Link></div></div></div>
        </article>
      </div>
    </div>
  );
}

function TimetablePage() {
  const schedule = [{ day: 'Monday', date: '13', sessions: [{ time: '4:00 PM', name: 'Biology review', color: 'bg-secondary text-primary' }, { time: '7:30 PM', name: 'Math practice', color: 'bg-[hsl(26_72%_61%_/_0.16)] text-[hsl(26_72%_43%)]' }] }, { day: 'Tuesday', date: '14', sessions: [{ time: '4:30 PM', name: 'History reading', color: 'bg-[hsl(197_44%_53%_/_0.16)] text-[hsl(197_50%_36%)]' }] }, { day: 'Wednesday', date: '15', sessions: [{ time: '3:30 PM', name: 'Biology practice', color: 'bg-secondary text-primary' }] }, { day: 'Thursday', date: '16', sessions: [{ time: '5:00 PM', name: 'Essay outline', color: 'bg-[hsl(26_72%_61%_/_0.16)] text-[hsl(26_72%_43%)]' }] }, { day: 'Friday', date: '17', sessions: [] }];
  return (
    <div>
      <PageIntro eyebrow="Give the week a shape" title="A timetable with breathing room." description="Plan enough to feel supported, not so much that every hour feels spoken for." action={<PrimaryButton icon={Plus} testId="button-add-session">Add session</PrimaryButton>} />
      <div className="mb-5 flex items-center justify-between"><button type="button" className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Previous week" data-testid="button-previous-week"><ArrowRight className="rotate-180" size={17} /></button><div className="text-center"><p className="text-sm font-semibold">13 — 19 May 2024</p><p className="mt-1 text-xs text-muted-foreground">Week 20 of your year</p></div><button type="button" className="pot-focus rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Next week" data-testid="button-next-week"><ArrowRight size={17} /></button></div>
      <div className="pot-card overflow-x-auto rounded-2xl p-3 sm:p-5"><div className="grid min-w-[760px] grid-cols-5 gap-3">{schedule.map((column, index) => <div key={column.day} className={`min-h-[430px] rounded-xl border p-3 ${index === 1 ? 'border-primary/45 bg-secondary/35' : 'border-border'}`}><div className="flex items-start justify-between border-b border-border pb-3"><div><p className="text-xs font-semibold">{column.day}</p><p className={`mt-1 text-2xl font-semibold tracking-[-0.05em] ${index === 1 ? 'text-primary' : ''}`}>{column.date}</p></div>{index === 1 && <span className="rounded-md bg-primary px-1.5 py-1 text-[9px] font-semibold text-primary-foreground">TODAY</span>}</div><div className="mt-4 space-y-3">{column.sessions.map((session) => <div key={session.name} className={`rounded-xl p-3 ${session.color}`}><p className="text-[10px] font-semibold opacity-75">{session.time}</p><p className="mt-2 text-xs font-semibold leading-4">{session.name}</p><div className="mt-3 flex items-center gap-1 text-[10px] opacity-70"><Clock3 size={11} /> 45 min</div></div>)}{column.sessions.length === 0 && <button type="button" className="pot-focus flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-xs text-muted-foreground hover:border-primary hover:text-primary" aria-label={`Add session on ${column.day}`} data-testid={`button-add-${column.day.toLowerCase()}`}><Plus size={16} className="mb-2" /> Open space</button>}</div></div>)}</div></div>
      <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted p-4 text-xs text-muted-foreground"><CircleHelp size={15} className="shrink-0 text-primary" /> Leave one open space each day. Plans work better when they can bend.</div>
    </div>
  );
}

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-noise grid min-h-[100dvh] bg-background lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-28 -top-24 h-72 w-72 rounded-full border-[30px] border-primary-foreground/10" />
        <div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full border-[45px] border-accent/20" />
        <div className="relative">
          <Logo />
          <p className="mono-label mt-20 text-[10px] text-primary-foreground/60">A quieter way to study</p>
          <h1 className="hand-title mt-6 max-w-md text-6xl leading-[0.95]">Make space for the work that matters.</h1>
          <p className="mt-7 max-w-sm text-sm leading-6 text-primary-foreground/70">Pot of Study helps you turn scattered intentions into a steady, kind rhythm.</p>
        </div>
        <div className="relative flex items-center gap-3 text-xs text-primary-foreground/60">
          <ShieldCheck size={16} /> Your study space stays yours.
        </div>
      </div>
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-20 lg:py-10">
        <div className="flex items-center justify-between">
          <div className="lg:hidden"><Logo /></div>
          <Link href="/" className="pot-focus ml-auto inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground" data-testid="link-back-home">
            <ArrowRight className="rotate-180" size={14} /> Back to home
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-[430px] flex-1 items-center py-14">
          <div className="w-full">
            {children}
            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <LockKeyhole size={13} /> Secured with Firebase Authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, loginDemo, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError || error;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    clearError();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(cleanEmail, password);
      setLocation('/dashboard');
    } catch {
      // Error message is set in AuthContext and displayed in activeError alert
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-rise">
        <p className="mono-label text-[10px] text-primary">Welcome back</p>
        <h1 className="hand-title mt-4 text-5xl leading-none">Good to see you.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">Pick up where you left off. Your next small step is waiting.</p>

        {activeError && (
          <div
            className="mt-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive animate-rise"
            role="alert"
            data-testid="alert-login-error"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1 font-medium leading-5">{activeError}</div>
            <button
              type="button"
              onClick={() => {
                setLocalError(null);
                clearError();
              }}
              className="text-destructive/70 hover:text-destructive"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold">Email address</span>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (activeError) {
                    setLocalError(null);
                    clearError();
                  }
                }}
                required
                placeholder="you@example.com"
                className="pot-focus h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                data-testid="input-login-email"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold">Password</span>
            <div className="relative">
              <LockKeyhole size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (activeError) {
                    setLocalError(null);
                    clearError();
                  }
                }}
                required
                placeholder="Enter your password"
                className="pot-focus h-11 w-full rounded-xl border border-input bg-card pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                data-testid="input-login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="pot-focus absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-3.5 w-3.5 accent-[hsl(var(--primary))]"
                data-testid="input-remember-me"
              />
              Keep me signed in
            </label>
            <button
              type="button"
              className="pot-focus font-semibold text-primary hover:underline"
              data-testid="button-forgot-password"
              onClick={() => {
                alert('To reset your password, please contact the workspace administrator or enter your registered email.');
              }}
            >
              Forgot password?
            </button>
          </div>

          <PrimaryButton
            type="submit"
            testId="button-submit-login"
            icon={submitting ? Loader2 : ArrowRight}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </PrimaryButton>

          <div className="relative my-5 flex items-center justify-center">
            <span className="w-full border-t border-border" />
            <span className="bg-card px-3 text-[11px] font-medium uppercase text-muted-foreground">Or</span>
            <span className="w-full border-t border-border" />
          </div>

          <button
            type="button"
            onClick={() => {
              loginDemo();
              setLocation('/dashboard');
            }}
            className="pot-focus flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-secondary/50 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:border-primary hover:bg-secondary active:scale-[0.99]"
            data-testid="button-demo-login"
          >
            <Sparkles size={15} /> Continue with Demo Account (Maya Chen)
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          New to Pot of Study?{' '}
          <Link href="/register" className="pot-focus font-semibold text-primary hover:underline" data-testid="link-register">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register, loginDemo, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError || error;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    clearError();

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setLocalError('Please enter your name.');
      return;
    }
    if (!cleanEmail) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLocalError('Please create a password.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (!agree) {
      setLocalError('Please accept the agreement to create your study space.');
      return;
    }

    try {
      setSubmitting(true);
      await register(cleanName, cleanEmail, password);
      setLocation('/dashboard');
    } catch {
      // Error message is set in AuthContext and displayed in activeError alert
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-rise">
        <p className="mono-label text-[10px] text-primary">Start gently</p>
        <h1 className="hand-title mt-4 text-5xl leading-none">Build your desk.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">A few details, then you can start turning the week into something you can hold.</p>

        {activeError && (
          <div
            className="mt-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive animate-rise"
            role="alert"
            data-testid="alert-register-error"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1 font-medium leading-5">{activeError}</div>
            <button
              type="button"
              onClick={() => {
                setLocalError(null);
                clearError();
              }}
              className="text-destructive/70 hover:text-destructive"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold">Your name</span>
            <div className="relative">
              <UserRound size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (activeError) {
                    setLocalError(null);
                    clearError();
                  }
                }}
                required
                placeholder="What should we call you?"
                className="pot-focus h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                data-testid="input-register-name"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold">Email address</span>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (activeError) {
                    setLocalError(null);
                    clearError();
                  }
                }}
                required
                placeholder="you@example.com"
                className="pot-focus h-11 w-full rounded-xl border border-input bg-card pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                data-testid="input-register-email"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold">Create a password</span>
            <div className="relative">
              <LockKeyhole size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (activeError) {
                    setLocalError(null);
                    clearError();
                  }
                }}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="pot-focus h-11 w-full rounded-xl border border-input bg-card pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
                data-testid="input-register-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="pot-focus absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                data-testid="button-toggle-register-password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="flex items-start gap-2 text-xs leading-5 text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
              className="mt-1 h-3.5 w-3.5 accent-[hsl(var(--primary))]"
              data-testid="input-agree-terms"
            />
            <span>I want a calm, personal place to plan my study week.</span>
          </label>

          <PrimaryButton
            type="submit"
            testId="button-submit-register"
            icon={submitting ? Loader2 : ArrowRight}
          >
            {submitting ? 'Creating your space…' : 'Create my space'}
          </PrimaryButton>

          <div className="relative my-5 flex items-center justify-center">
            <span className="w-full border-t border-border" />
            <span className="bg-card px-3 text-[11px] font-medium uppercase text-muted-foreground">Or</span>
            <span className="w-full border-t border-border" />
          </div>

          <button
            type="button"
            onClick={() => {
              loginDemo(name.trim() || 'New Student', email.trim() || 'student@potofstudy.app');
              setLocation('/dashboard');
            }}
            className="pot-focus flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-secondary/50 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:border-primary hover:bg-secondary active:scale-[0.99]"
            data-testid="button-demo-register"
          >
            <Sparkles size={15} /> Continue with Demo Student Space
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have a space?{' '}
          <Link href="/login" className="pot-focus font-semibold text-primary hover:underline" data-testid="link-login">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

function ProtectedRoute({
  children,
  dark,
  onToggle,
}: {
  children: ReactNode;
  dark: boolean;
  onToggle: () => void;
}) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/login');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return <AppShell dark={dark} onToggle={onToggle}>{children}</AppShell>;
}

function PublicAuthRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      setLocation('/dashboard');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}

function RoutedPages({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login">
        <PublicAuthRoute>
          <LoginPage />
        </PublicAuthRoute>
      </Route>
      <Route path="/register">
        <PublicAuthRoute>
          <RegisterPage />
        </PublicAuthRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute dark={dark} onToggle={onToggle}>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      <Route path="/subjects">
        <ProtectedRoute dark={dark} onToggle={onToggle}>
          <SubjectsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/tasks">
        <ProtectedRoute dark={dark} onToggle={onToggle}>
          <TasksPage />
        </ProtectedRoute>
      </Route>
      <Route path="/progress">
        <ProtectedRoute dark={dark} onToggle={onToggle}>
          <ProgressPage />
        </ProtectedRoute>
      </Route>
      <Route path="/notes">
        <ProtectedRoute dark={dark} onToggle={onToggle}>
          <NotesPage />
        </ProtectedRoute>
      </Route>
      <Route path="/timetable">
        <ProtectedRoute dark={dark} onToggle={onToggle}>
          <TimetablePage />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = window.localStorage.getItem('pot-study-theme');
    const shouldUseDark = stored === 'dark';
    setDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);
  const toggleTheme = () => {
    setDark((value) => {
      const next = !value;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('pot-study-theme', next ? 'dark' : 'light');
      return next;
    });
  };
  return (
    <RoutedErrorBoundary>
      <RoutedPages dark={dark} onToggle={toggleTheme} />
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
