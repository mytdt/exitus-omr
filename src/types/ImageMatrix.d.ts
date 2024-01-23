declare interface ImageMatrix {
    rows: number;
    columns: number;
    type: number;
    channels: number;
    depth: number;
    dimensions: number;
    empty: boolean;
    steps: number;
    elementSize: number;
    data: Buffer;
}
