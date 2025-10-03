import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import type { Order, OrderStatus } from './types';

interface OrderFormDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  editingOrder: Order | null;
  formData: {
    phone: string;
    fromAddress: string;
    toAddress: string;
    status: OrderStatus;
  };
  setFormData: (data: { phone: string; fromAddress: string; toAddress: string; status: OrderStatus }) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

export default function OrderFormDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingOrder,
  formData,
  setFormData,
  handleSubmit,
  resetForm
}: OrderFormDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Icon name="Plus" size={18} />
          Новый заказ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingOrder ? 'Редактировать заказ' : 'Новый заказ'}</DialogTitle>
          <DialogDescription>
            Заполните информацию о заказе
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              placeholder="+7 900 123-45-67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="from">Откуда</Label>
            <Input
              id="from"
              placeholder="Адрес отправки"
              value={formData.fromAddress}
              onChange={(e) => setFormData({ ...formData, fromAddress: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">Куда</Label>
            <Input
              id="to"
              placeholder="Адрес доставки"
              value={formData.toAddress}
              onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <Select value={formData.status} onValueChange={(value: OrderStatus) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Не выполнено</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="completed">Выполнено</SelectItem>
                <SelectItem value="delivered">Доставлено</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {editingOrder ? 'Сохранить' : 'Создать'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
