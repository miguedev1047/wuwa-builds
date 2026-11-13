import {
  buildCatalogPickerVariants,
  type BuildCatalogPickerColumns,
} from "@builder/ui/build-catalog-picker"
import { Skeleton } from "@/components/ui/skeleton"

interface EchoPickerLoadingProps {
  columns?: BuildCatalogPickerColumns
}

const PICKER_COLUMNS = 4

/** Square skeleton that mirrors the echo picker grid. */
export function EchoPickerLoading({
  columns = PICKER_COLUMNS,
}: EchoPickerLoadingProps = {}) {
  return (
    <div className={buildCatalogPickerVariants({ columns })}>
      {Array.from({ length: columns * 2 }).map((_, index) => (
        <Skeleton key={index} className="aspect-square" />
      ))}
    </div>
  )
}
