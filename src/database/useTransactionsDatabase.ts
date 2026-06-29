import { useSQLiteContext } from "expo-sqlite";

export type TransactionCreate = {
    target_id: number;
    amount: number;
    observation?: string;
}

export type TransactionResponse = {
    id: number;
    target_id: number;
    observation?: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
}

export function useTransactionsDatabase() {
    const database = useSQLiteContext();
    async function create(data: TransactionCreate) {
        const statement = await database.prepareAsync(`
            INSERT INTO transactions 
                (target_id, observation, amount) 
            VALUES 
                ($target_id, $observation, $amount);
        `);
        statement.executeAsync({ 
            $target_id: data.target_id, 
            $observation: data.observation ?? null, 
            $amount: data.amount 
        });
    }

    async function listByTargetId(target_id: number) {
        return database.getAllAsync<TransactionResponse>(`
            SELECT 
                id, 
                target_id, 
                observation, 
                amount, 
                created_at, 
                updated_at
            FROM transactions
            WHERE target_id = ${target_id}
            ORDER BY created_at DESC
        `);
    }

    return {
        create,
        listByTargetId
    }
}