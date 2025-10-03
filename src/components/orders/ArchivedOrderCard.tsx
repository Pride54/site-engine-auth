import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { getStatusConfig, type Order } from './types';

interface ArchivedOrderCardProps {
  order: Order;
  onUnarchive: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

export default function ArchivedOrderCard({
  order,
  onUnarchive,
  onDelete
}: ArchivedOrderCardProps) {
  const statusConfig = getStatusConfig(order.status);

  return (
    <Card className="hover:shadow-md transition-shadow opacity-75">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
              <span className="font-heading font-bold text-muted-foreground">#{order.id}</span>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 min-w-0">
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
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="secondary">
              {statusConfig.label}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onUnarchive(order.id)}
              title="Восстановить"
            >
              <Icon name="ArchiveRestore" size={18} className="text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(order.id)}
            >
              <Icon name="Trash2" size={18} className="text-error" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
