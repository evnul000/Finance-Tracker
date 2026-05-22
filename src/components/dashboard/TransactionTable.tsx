import { Transaction } from "@/types/transaction"

type Props = {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionTable({
  transactions,
  onDelete
}: Props) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-bold mb-4">
        Transactions
      </h2>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <div>
              <p className="font-medium">
                {transaction.title}
              </p>

              <p className="text-sm text-muted-foreground">
                {transaction.category}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-bold">
                ${transaction.amount}
              </p>

              <button
                onClick={() => onDelete(transaction.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}