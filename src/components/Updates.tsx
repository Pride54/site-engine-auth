import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Update {
  id: string;
  type: 'order' | 'driver' | 'system';
  title: string;
  description: string;
  time: string;
  isNew: boolean;
}

export default function Updates() {
  const updates: Update[] = [
    {
      id: '1',
      type: 'order',
      title: 'Новый заказ #008',
      description: 'Создан заказ на доставку: ул. Ленина, 10 → ул. Пушкина, 25',
      time: '5 минут назад',
      isNew: true
    },
    {
      id: '2',
      type: 'driver',
      title: 'Водитель активирован',
      description: 'Иванов Иван начал смену',
      time: '15 минут назад',
      isNew: true
    },
    {
      id: '3',
      type: 'order',
      title: 'Заказ #007 выполнен',
      description: 'Доставка завершена водителем Петров Петр',
      time: '1 час назад',
      isNew: false
    },
    {
      id: '4',
      type: 'system',
      title: 'Обновление системы',
      description: 'Добавлена интеграция с Яндекс.Картами',
      time: '2 часа назад',
      isNew: false
    },
    {
      id: '5',
      type: 'driver',
      title: 'Новый водитель',
      description: 'Добавлен водитель: Сидоров Сидор',
      time: '3 часа назад',
      isNew: false
    },
  ];

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'Package';
      case 'driver':
        return 'User';
      case 'system':
        return 'Settings';
      default:
        return 'Bell';
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-primary';
      case 'driver':
        return 'text-success';
      case 'system':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">Обновления</h2>
        <Badge variant="secondary" className="text-sm">
          {updates.filter(u => u.isNew).length} новых
        </Badge>
      </div>

      <div className="space-y-3">
        {updates.map((update) => (
          <Card key={update.id} className={`hover:shadow-md transition-shadow ${update.isNew ? 'border-primary' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  update.isNew ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={getUpdateIcon(update.type)} 
                    size={20} 
                    className={update.isNew ? 'text-primary' : 'text-muted-foreground'}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-heading font-semibold">{update.title}</h3>
                    {update.isNew && (
                      <Badge variant="default" className="bg-primary text-primary-foreground flex-shrink-0">
                        Новое
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{update.time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
