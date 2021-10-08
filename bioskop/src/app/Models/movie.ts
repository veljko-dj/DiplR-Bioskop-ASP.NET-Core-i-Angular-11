export interface Movie {
    id: number;
    title: string;
    summary: string;
    trailer: string;
    releaseDate: Date;
    posterString?: string;
    posterFile: File;
    rating: number;
}
