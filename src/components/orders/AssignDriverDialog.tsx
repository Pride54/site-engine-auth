import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import type { Order, Driver } from './types';

interface AssignDriverDialogProps {
  assignDialogOpen: boolean;
  setAssignDialogOpen: (open: boolean) => void;
  orderToAssign: Order | null;
  selectedDriverId: string;
  setSelectedDriverId: (id: string) => void;
  availableDrivers: Driver[];
  handleAssignDriver: () => void;
}

export default function AssignDriverDialog({
  assignDialogOpen,
  setAssignDialogOpen,
  orderToAssign,
  selectedDriverId,
  setSelectedDriverId,
  availableDrivers,
  handleAssignDriver
}: AssignDriverDialogProps) {
  return (
    <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Назначить водителя</DialogTitle>
          <DialogDescription>
            Выберите водителя для заказа #{orderToAssign?.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Водитель</Label>
            <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите водителя" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.filter(d => d.status === 'active').map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={14} />
                      {driver.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {orderToAssign && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                <span className="truncate">{orderToAssign.fromAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Navigation" size={14} className="text-muted-foreground" />
                <span className="truncate">{orderToAssign.toAddress}</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleAssignDriver} 
              disabled={!selectedDriverId}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Назначить
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setAssignDialogOpen(false)} 
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
