export interface Meta {
    pagination: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
        links: {
            next_page: string | null;
            prevous_page: string | null;
        };
    };
}