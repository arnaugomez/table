import { TableInstance, RowModel, AnyGenerics } from '../types'
import { memo } from '../utils'
import { expandRows } from './getExpandedRowModel'

export function getPaginationRowModel<TGenerics extends AnyGenerics>(opts?: {
  initialSync: boolean
}): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    memo(
      () => [instance.getState().pagination, instance.getExpandedRowModel()],
      (pagination, rowModel) => {
        if (!rowModel.rows.length) {
          return rowModel
        }

        const { pageSize, pageIndex } = pagination
        let { rows, flatRows, rowsById } = rowModel
        const pageStart = pageSize * pageIndex
        const pageEnd = pageStart + pageSize

        rows = rows.slice(pageStart, pageEnd)

        if (!instance.options.paginateExpandedRows) {
          return expandRows(
            {
              rows,
              flatRows,
              rowsById,
            },
            instance
          )
        }

        return {
          rows,
          flatRows,
          rowsById,
        }
      },
      {
        key: 'getPaginationRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
      }
    )
}
