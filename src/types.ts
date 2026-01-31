export type Region = {
    name: string;
    id: string;
    subregions: Subregion[];
};

export type Subregion = {
    id: string,
    name: string,
    resources: Resource[]
}

export type Resource = {
    id: string,
    name: string,
    location: string
}
