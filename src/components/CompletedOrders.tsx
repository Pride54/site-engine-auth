import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface CompletedOrder {
  id: string;
  phone: string;
  fromAddress: string;
  toAddress: string;
  completedDate: string;
  driver: string;
}

export default function CompletedOrders() {
  const completedOrders: CompletedOrder[] = [
    { 
      id: '003', 
      phone: '+7 900 345-67-89', 
      fromAddress: 'ул. Советская, 3', 
      toAddress: 'пр. Победы, 18',
      completedDate: '2024-10-02 14:30',
      driver: 'Иванов Иван'
    },
    { 
      id: '005', 
      phone: '+7 900 456-78-90', 
      fromAddress: 'ул. Ломоносова, 7', 
      toAddress: 'ул. Кирова, 22',
      completedDate: '2024-10-02 12:15',
      driver: 'Петров Петр'
    },
    { 
      id: '007', 
      phone: '+7 900 567-89-01', 
      fromAddress: 'пр. Ленина, 45', 
      toAddress: 'ул. Жукова, 8',
      completedDate: '2024-10-01 16:45',
      driver: 'Иванов Иван'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">Выполненные заказы</h2>
        <Badge variant="secondary" className="text-sm">
          Всего: {completedOrders.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {completedOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <span className="font-heading font-bold text-success">#{order.id}</span>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon name="Phone" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{order.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{order.fromAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Navigation" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{order.toAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{order.driver}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Выполнен</div>
                    <div className="text-sm font-medium">{order.completedDate}</div>
                  </div>
                  <Badge className="bg-success text-white hover:bg-success/90">
                    Завершен
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
