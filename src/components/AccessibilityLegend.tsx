import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { accessibilityConfig } from './Map';

export default function AccessibilityLegend({ className }: { className?: string }) {
  return (
    <Card className={cn('p-4', className)}>
      <h3 className="mb-3 font-semibold">Accessibility Legend</h3>
      <div className="space-y-2">
        {Object.entries(accessibilityConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={cn(
              'rounded-full p-0.5 border',
              config.bgColor,
              config.borderColor
            )}>
              <MapPin className={cn('h-4 w-4', config.color)} />
            </div>
            <div>
              <span className="text-sm font-medium">{config.label}</span>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}