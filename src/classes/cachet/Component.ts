/* eslint-disable no-unused-vars */
import { Meta } from "./Meta"

export interface ComponentResponse {
    meta: Meta;
    data: Array<Component>;
}

export interface Component {
    id: number;
    name: string;
    description: string;
    link: string;
    status: number;
    order: number;
    group_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    enabled: boolean;
    meta: any | null;
    status_name: string;
    tags: {
        [x: string]: string;
    };
}

export interface ComponentPut {
    id: number;
    status: number;
}