export type Region = {
    name: string;
    id: number;
    subregions: Subregion[];
};

export type Subregion = {
    id: number,
    name: string,
    resources: Resource[]
}

export type Resource = {
    id: number,
    name: string,
    location: string
}
