import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface RoleSelectProps {
  onSelectRole: (role: 'admin' | 'driver') => void;
}

export default function RoleSelect({ onSelectRole }: RoleSelectProps) {
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
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary" onClick={() => onSelectRole('admin')}>
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

          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-success" onClick={() => onSelectRole('driver')}>
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
