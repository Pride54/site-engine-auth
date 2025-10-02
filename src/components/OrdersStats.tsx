import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface OrdersStatsProps {
  total: number;
  completed: number;
  processing: number;
  pending: number;
}

export default function OrdersStats({ total, completed, processing, pending }: OrdersStatsProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Всего заказов</p>
              <h3 className="text-3xl font-heading font-bold mt-2">{total}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="Package" size={24} className="text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Выполнено</p>
              <h3 className="text-3xl font-heading font-bold mt-2 text-success">{completed}</h3>
              <p className="text-xs text-muted-foreground mt-1">{completionRate}% от общего</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <Icon name="CheckCircle2" size={24} className="text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">В обработке</p>
              <h3 className="text-3xl font-heading font-bold mt-2 text-warning">{processing}</h3>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Не выполнено</p>
              <h3 className="text-3xl font-heading font-bold mt-2 text-error">{pending}</h3>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
              <Icon name="AlertCircle" size={24} className="text-error" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
