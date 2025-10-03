import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface RoleSelectProps {
  onSelectRole: (role: 'admin' | 'driver', driverId?: string, driverName?: string) => void;
}

const ADMIN_PASSWORD = 'admin2024';
const DRIVERS = [
  { id: '1', name: 'Иванов Иван', password: 'driver1' },
  { id: '2', name: 'Петров Петр', password: 'driver2' },
  { id: '3', name: 'Сидоров Сидор', password: 'driver3' },
];

export default function RoleSelect({ onSelectRole }: RoleSelectProps) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showDriverLogin, setShowDriverLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [driverLogin, setDriverLogin] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const { toast } = useToast();

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      onSelectRole('admin');
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный пароль администратора',
        variant: 'destructive',
      });
    }
  };

  const handleDriverLogin = () => {
    const driver = DRIVERS.find(d => 
      d.name.toLowerCase().includes(driverLogin.toLowerCase()) && 
      d.password === driverPassword
    );

    if (driver) {
      onSelectRole('driver', driver.id, driver.name);
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверное имя или пароль водителя',
        variant: 'destructive',
      });
    }
  };

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="LayoutDashboard" size={32} className="text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">Вход администратора</CardTitle>
            <CardDescription className="text-center">Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Пароль</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="Введите пароль"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAdminLogin(false)} className="flex-1">
                Назад
              </Button>
              <Button onClick={handleAdminLogin} className="flex-1 gap-2">
                <Icon name="LogIn" size={18} />
                Войти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showDriverLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="User" size={32} className="text-success" />
            </div>
            <CardTitle className="text-center text-2xl">Вход водителя</CardTitle>
            <CardDescription className="text-center">Введите ваши данные для доступа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="driver-login">Имя</Label>
              <Input
                id="driver-login"
                value={driverLogin}
                onChange={(e) => setDriverLogin(e.target.value)}
                placeholder="Иванов"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver-password">Пароль</Label>
              <Input
                id="driver-password"
                type="password"
                value={driverPassword}
                onChange={(e) => setDriverPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDriverLogin()}
                placeholder="Введите пароль"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDriverLogin(false)} className="flex-1">
                Назад
              </Button>
              <Button onClick={handleDriverLogin} className="flex-1 gap-2 bg-success hover:bg-success/90">
                <Icon name="LogIn" size={18} />
                Войти
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Icon name="Truck" size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">Система доставки</h1>
          <p className="text-muted-foreground">Выберите роль для входа в систему</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary" onClick={() => setShowAdminLogin(true)}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="LayoutDashboard" size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl">Администратор</CardTitle>
              <CardDescription className="text-base">
                Управление заказами и водителями
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0" />
                <span>Просмотр всех заказов</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0" />
                <span>Управление водителями</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0" />
                <span>Карта с заказами</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0" />
                <span>Статистика и отчеты</span>
              </div>
              <Button className="w-full mt-4 gap-2" size="lg">
                <Icon name="LogIn" size={18} />
                Войти как администратор
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-success" onClick={() => setShowDriverLogin(true)}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={40} className="text-success" />
              </div>
              <CardTitle className="text-2xl">Водитель</CardTitle>
              <CardDescription className="text-base">
                Выполнение заказов доставки
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0" />
                <span>Мои активные заказы</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0" />
                <span>Отметка выполнения</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0" />
                <span>Навигация по карте</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icon name="CheckCircle2" size={18} className="text-success flex-shrink-0" />
                <span>История выполнений</span>
              </div>
              <Button className="w-full mt-4 gap-2 bg-success hover:bg-success/90" size="lg">
                <Icon name="LogIn" size={18} />
                Войти как водитель
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}