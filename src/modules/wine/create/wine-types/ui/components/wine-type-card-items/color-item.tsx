export const ColorItem = ({ color }: { color: any }) => (
  <div className="flex items-center gap-3 p-2 border rounded">
    <div 
      className="w-6 h-6 rounded border"
      style={{ backgroundColor: `#${color.tones?.medium || 'ccc'}` }}
    />
    <div className="flex-1">
      <div className="font-medium">{color.label}</div>
      <div className="text-sm text-muted-foreground">
        Оттенки: {Object.values(color.tones || {}).filter(Boolean).join(', ')}
      </div>
    </div>
  </div>
)