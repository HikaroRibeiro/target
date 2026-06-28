import { useSQLiteContext } from "expo-sqlite";


export type TargetCreate = {
    name: string;
    amount: number;
}

export type TargetUpdate = TargetCreate & {
    id: number
}

export type TargetResponse = {
    id: number;
    name: string;
    amount: number;
    current: number;
    percentage: number;
    created_at: Date;
    updated_at: Date;
}

export function useTargetDatabase() {
    const database = useSQLiteContext();
    async function create(data: TargetCreate) {
        const statement = await database.prepareAsync(`
            INSERT INTO targets (name, amount) 
            VALUES ($name, $amount);
        `);
        statement.executeAsync({ 
            $name: data.name, 
            $amount: data.amount 
        });
    }

    function listBySavedValue() {
        return database.getAllAsync<TargetResponse>(`
            SELECT 
                targets.id, 
                targets.name, 
                targets.amount,
                COALESCE(SUM(transactions.amount), 0) as current,
                COALESCE((SUM(transactions.amount) / targets.amount) * 100, 0) as percentage,
                targets.created_at,
                targets.updated_at
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            GROUP BY targets.id, targets.name, targets.amount
            ORDER BY current DESC
            `);

    }

    function getTargetById(id: number) {
        return database.getFirstSync<TargetResponse>(`
            SELECT 
                targets.id, 
                targets.name, 
                targets.amount,
                COALESCE(SUM(transactions.amount), 0) as current,
                COALESCE((SUM(transactions.amount) / targets.amount) * 100, 0) as percentage,
                targets.created_at,
                targets.updated_at
            FROM targets
            LEFT JOIN transactions ON targets.id = transactions.target_id
            WHERE targets.id = ${id}
            `);
    }

    async function update(data: TargetUpdate) {
        const statement = await database.prepareSync(`
            UPDATE targets 
            SET 
                name = $name, 
                amount = $amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $id;
        `);
        statement.executeAsync({
            $name: data.name,
            $amount: data.amount,
            $id: data.id
        });
    }
    return {
        create,
        listBySavedValue,
        getTargetById,
        update
    }
}