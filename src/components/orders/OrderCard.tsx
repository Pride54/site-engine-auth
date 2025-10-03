import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { getStatusConfig, type Order } from './types';

interface OrderCardProps {
  order: Order;
  onViewOnMap?: (orderId: string) => void;
  onEdit: (order: Order) => void;
  onArchive: (orderId: string) => void;
  onDelete: (orderId: string) => void;
  onOpenAssignDialog: (order: Order) => void;
  onUnassignDriver: (orderId: string) => void;
}

export default function OrderCard({
  order,
  onViewOnMap,
  onEdit,
  onArchive,
  onDelete,
  onOpenAssignDialog,
  onUnassignDriver
}: OrderCardProps) {
  const statusConfig = getStatusConfig(order.status);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="font-heading font-bold text-primary">#{order.id}</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-2 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            {order.driverId ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Icon name="User" size={12} />
                  {order.driverName}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-error"
                  onClick={() => onUnassignDriver(order.id)}
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="h-7 text-xs gap-1 w-fit"
                onClick={() => onOpenAssignDialog(order)}
              >
                <Icon name="UserPlus" size={12} />
                Назначить водителя
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={statusConfig.className}>
              {statusConfig.label}
            </Badge>
            {onViewOnMap && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onViewOnMap(order.id)}
                title="Показать на карте"
              >
                <Icon name="MapPin" size={18} className="text-primary" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => onEdit(order)}>
              <Icon name="Edit" size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onArchive(order.id)}
              title="В архив"
            >
              <Icon name="Archive" size={18} className="text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(order.id)}>
              <Icon name="Trash2" size={18} className="text-error" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
